import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
  Platform,
} from "react-native";
import { BluetoothDevice, BluetoothConnection } from "../types/bluetooth";
import { Message } from "../types/message";
import { cryptoService } from "./CryptoService";

// Define mock event emitter for web platform
class MockEventEmitter {
  addListener(eventName: string, listener: Function) {
    return { remove: () => {} };
  }
}

// Define fallback bluetooth module for web platform
const WebBluetoothMeshModule = {
  startAdvertising: async (publicKey: string): Promise<void> => {
    console.log("Web: Starting advertising with public key:", publicKey);
  },
  startScanning: async (): Promise<void> => {
    console.log("Web: Starting scanning");
  },
  connectToDevice: async (deviceId: string): Promise<void> => {
    console.log("Web: Connecting to device:", deviceId);
  },
  sendMessage: async (
    deviceId: string,
    encryptedData: string
  ): Promise<void> => {
    console.log("Web: Sending message to device:", deviceId);
  },
};

const BluetoothMeshModule =
  Platform.OS === "web"
    ? WebBluetoothMeshModule
    : NativeModules.BluetoothMeshModule || WebBluetoothMeshModule;
const bluetoothEventEmitter =
  Platform.OS === "web"
    ? new MockEventEmitter()
    : new NativeEventEmitter(NativeModules.BluetoothMeshModule || {});

class BluetoothService {
  private discoveredDevices: Map<string, BluetoothDevice> = new Map();
  private connections: Map<string, BluetoothConnection> = new Map();
  private eventSubscriptions: EmitterSubscription[] = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventSubscriptions.push(
      bluetoothEventEmitter.addListener("DeviceDiscovered", (device) => {
        const bluetoothDevice: BluetoothDevice = {
          id: device.id,
          name: device.name,
          address: device.address,
          rssi: device.rssi,
          isConnected: false,
          lastSeen: Date.now(),
          capabilities: ["text", "voice"],
          trustLevel: "unknown",
        };

        this.discoveredDevices.set(device.id, bluetoothDevice);
        this.onDeviceDiscovered?.(bluetoothDevice);
      })
    );

    this.eventSubscriptions.push(
      bluetoothEventEmitter.addListener("PublicKeyReceived", (data) => {
        const device = this.discoveredDevices.get(data.deviceId);
        if (device) {
          device.publicKey = data.publicKey;
          cryptoService.establishSessionKey(data.publicKey);
        }
      })
    );

    this.eventSubscriptions.push(
      bluetoothEventEmitter.addListener(
        "ConnectionStateChanged",
        (connection) => {
          const device = this.discoveredDevices.get(connection.deviceId);
          if (device) {
            device.isConnected = connection.status === "connected";
            if (connection.status === "connected") {
              const conn: BluetoothConnection = {
                deviceId: connection.deviceId,
                connectionId: `conn_${connection.deviceId}_${Date.now()}`,
                established: Date.now(),
                quality: {
                  signalStrength: device.rssi,
                  latency: 0,
                  packetLoss: 0,
                  bandwidth: 0,
                },
                role: "central",
              };
              this.connections.set(connection.deviceId, conn);
            } else {
              this.connections.delete(connection.deviceId);
            }

            this.onConnectionStateChanged?.(
              connection.deviceId,
              connection.status
            );
          }
        }
      )
    );

    this.eventSubscriptions.push(
      bluetoothEventEmitter.addListener(
        "MessageReceived",
        async (messageData) => {
          try {
            const device = this.discoveredDevices.get(messageData.deviceId);
            if (device && device.publicKey) {
              const decryptedData = await cryptoService.decrypt(
                messageData.data,
                device.publicKey
              );
              const message: Message = JSON.parse(decryptedData);

              if (message.type === "system") {
                this.onSystemMessageReceived?.(message);
              } else {
                this.onMessageReceived?.(message);
              }
            }
          } catch (error) {
            console.error("Failed to process received message:", error);
          }
        }
      )
    );
  }

  async startAdvertising(): Promise<void> {
    const publicKey = await cryptoService.getPublicKey();
    if (publicKey) {
      await BluetoothMeshModule.startAdvertising(publicKey);
    }
  }

  async startScanning(): Promise<void> {
    try {
      await BluetoothMeshModule.startScanning();
    } catch (error) {
      console.error("Failed to start scanning:", error);
    }
  }

  async connectToDevice(deviceId: string): Promise<void> {
    try {
      await BluetoothMeshModule.connectToDevice(deviceId);
    } catch (error) {
      console.error("Failed to connect to device:", error);
    }
  }

  async sendMessage(deviceId: string, message: Message): Promise<void> {
    try {
      const device = this.discoveredDevices.get(deviceId);
      if (device && device.publicKey) {
        const encryptedData = await cryptoService.encrypt(
          JSON.stringify(message),
          device.publicKey
        );
        await BluetoothMeshModule.sendMessage(deviceId, encryptedData);
      } else {
        throw new Error("Device or public key not found");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  getDiscoveredDevices(): BluetoothDevice[] {
    return Array.from(this.discoveredDevices.values());
  }

  getConnectedDevices(): BluetoothDevice[] {
    return this.getDiscoveredDevices().filter((device) => device.isConnected);
  }

  // Event handlers
  onDeviceDiscovered?: (device: BluetoothDevice) => void;
  onConnectionStateChanged?: (deviceId: string, status: string) => void;
  private messageReceivedCallbacks: ((message: any) => void)[] = [];
  onSystemMessageReceived?: (message: Message) => void;

  // Method to register message received callbacks
  onMessageReceived(callback: (message: any) => void): () => void {
    this.messageReceivedCallbacks.push(callback);
    return () => {
      const index = this.messageReceivedCallbacks.indexOf(callback);
      if (index > -1) {
        this.messageReceivedCallbacks.splice(index, 1);
      }
    };
  }

  // Method to broadcast messages
  async broadcast(data: any): Promise<void> {
    try {
      // For now, simulate broadcasting by logging
      console.log('Broadcasting emergency message:', data);
      
      // In a real implementation, this would send to all connected devices
      const connectedDevices = this.getConnectedDevices();
      for (const device of connectedDevices) {
        if (device.id) {
          const encryptedData = await cryptoService.encrypt(JSON.stringify(data));
          await BluetoothMeshModule.sendMessage(device.id, encryptedData);
        }
      }
    } catch (error) {
      console.error('Failed to broadcast message:', error);
      throw error;
    }
  }

  // Trigger message received callbacks (for testing/simulation)
  private triggerMessageReceived(message: any) {
    this.messageReceivedCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error in message received callback:', error);
      }
    });
  }

  cleanup(): void {
    this.eventSubscriptions.forEach((subscription) => subscription.remove());
    this.eventSubscriptions = [];
  }
}

export const bluetoothService = new BluetoothService();
