// Mock react-native before importing services
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.NativeModules = {
    BluetoothMeshModule: {
      startScanning: jest.fn(),
      connectToDevice: jest.fn(),
      sendMessage: jest.fn(),
      startAdvertising: jest.fn(),
    },
  };
  RN.Platform = { OS: "test" }; // Force native module usage
  RN.NativeEventEmitter = jest.fn().mockImplementation(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  }));
  return RN;
});

// Mock the CryptoService
jest.mock("../../src/services/CryptoService", () => ({
  cryptoService: {
    encrypt: jest.fn((data) => Promise.resolve(data)), // Mock encryption
  },
}));

import { bluetoothService } from "../../src/services/BluetoothService";
import { cryptoService } from "../../src/services/CryptoService";
import { NativeModules } from "react-native";

const { BluetoothMeshModule } = NativeModules;

describe("BluetoothService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start scanning for devices", async () => {
    await bluetoothService.startScanning();
    expect(BluetoothMeshModule.startScanning).toHaveBeenCalled();
  });

  it("should connect to a device", async () => {
    const deviceId = "test-device-id";
    await bluetoothService.connectToDevice(deviceId);
    expect(BluetoothMeshModule.connectToDevice).toHaveBeenCalledWith(deviceId);
  });

  it("should send a message", async () => {
    const deviceId = "test-device-id";
    const message = {
      id: "test-message-id",
      type: "text" as const,
      content: "hello",
      sender: "me",
      recipient: deviceId,
      timestamp: Date.now(),
      encrypted: true,
      status: "sending" as const,
    };

    // Mock the discovered devices map to include the test device with a public key
    bluetoothService["discoveredDevices"].set(deviceId, {
      id: deviceId,
      name: "Test Device",
      address: deviceId,
      rssi: -50,
      isConnected: true,
      lastSeen: Date.now(),
      capabilities: ["text"],
      trustLevel: "trusted",
      publicKey: "test-public-key",
    });

    await bluetoothService.sendMessage(deviceId, message);

    expect(cryptoService.encrypt).toHaveBeenCalledWith(
      JSON.stringify(message),
      "test-public-key"
    );
    expect(BluetoothMeshModule.sendMessage).toHaveBeenCalledWith(
      deviceId,
      expect.any(String)
    );
  });
});
