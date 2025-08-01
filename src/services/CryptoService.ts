import { NativeModules, Platform } from "react-native";

// Define fallback crypto module for web platform
const WebCryptoModule = {
  getPublicKey: async (): Promise<string> => {
    // Generate a mock public key for web platform
    return `web-public-key-${Math.random().toString(36).substring(2, 11)}`;
  },
  generateSharedSecret: async (remotePublicKey: string): Promise<string> => {
    // Generate a mock shared secret for web platform
    return `shared-secret-${remotePublicKey.substring(0, 8)}`;
  },
  encrypt: async (plaintext: string, sessionKey: string): Promise<string> => {
    // Simple base64 encoding for web platform (NOT secure, just for testing)
    return btoa(plaintext + "-" + sessionKey);
  },
  decrypt: async (ciphertext: string, sessionKey: string): Promise<string> => {
    // Simple base64 decoding for web platform (NOT secure, just for testing)
    try {
      const decoded = atob(ciphertext);
      return decoded.split("-" + sessionKey)[0];
    } catch {
      throw new Error("Decryption failed");
    }
  },
};

const CryptoModule =
  Platform.OS === "web"
    ? WebCryptoModule
    : NativeModules.CryptoModule || WebCryptoModule;

class CryptoService {
  private devicePublicKey: string | null = null;
  private sessionKeys: Map<string, string> = new Map();

  async initialize(): Promise<void> {
    this.devicePublicKey = await CryptoModule.getPublicKey();
  }

  getPublicKey(): string | null {
    return this.devicePublicKey;
  }

  async establishSessionKey(remotePublicKey: string): Promise<void> {
    const sharedSecret = await CryptoModule.generateSharedSecret(
      remotePublicKey
    );
    this.sessionKeys.set(remotePublicKey, sharedSecret);
  }

  async encrypt(
    plaintext: string,
    recipientPublicKey: string
  ): Promise<string> {
    const sessionKey = this.sessionKeys.get(recipientPublicKey);
    if (!sessionKey) {
      throw new Error("No session key for this recipient");
    }
    return await CryptoModule.encrypt(plaintext, sessionKey);
  }

  async decrypt(ciphertext: string, senderPublicKey: string): Promise<string> {
    const sessionKey = this.sessionKeys.get(senderPublicKey);
    if (!sessionKey) {
      throw new Error("No session key for this sender");
    }
    return await CryptoModule.decrypt(ciphertext, sessionKey);
  }
}

export const cryptoService = new CryptoService();
