// Mock react-native before importing services
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.NativeModules = {
    CryptoModule: {
      getPublicKey: jest.fn(() => Promise.resolve("test-public-key")),
      generateSharedSecret: jest.fn(() => Promise.resolve("test-shared-secret")),
      encrypt: jest.fn((data, key) => Promise.resolve(`encrypted:${data}:${key}`)),
      decrypt: jest.fn((data, _key) => {
        const parts = data.split(":");
        return Promise.resolve(parts[1]);
      }),
    },
  };
  RN.Platform = { OS: "test" }; // Force native module usage
  return RN;
});

import { cryptoService } from "../../src/services/CryptoService";
import { NativeModules } from "react-native";

const { CryptoModule } = NativeModules;

describe("CryptoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get the public key", async () => {
    await cryptoService.initialize();
    const publicKey = cryptoService.getPublicKey();
    expect(publicKey).toBe("test-public-key");
  });

  it("should establish a session key", async () => {
    const remotePublicKey = "remote-public-key";
    await cryptoService.establishSessionKey(remotePublicKey);
    expect(CryptoModule.generateSharedSecret).toHaveBeenCalledWith(
      remotePublicKey
    );
  });

  it("should encrypt and decrypt a message", async () => {
    const message = "hello world";
    const remotePublicKey = "remote-public-key";

    await cryptoService.establishSessionKey(remotePublicKey);
    const encryptedMessage = await cryptoService.encrypt(
      message,
      remotePublicKey
    );
    const decryptedMessage = await cryptoService.decrypt(
      encryptedMessage,
      remotePublicKey
    );

    expect(encryptedMessage).toBe("encrypted:hello world:test-shared-secret");
    expect(decryptedMessage).toBe("hello world");
  });
});
