
import { NativeModules } from 'react-native';

const { CryptoModule } = NativeModules;

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
    const sharedSecret = await CryptoModule.generateSharedSecret(remotePublicKey);
    this.sessionKeys.set(remotePublicKey, sharedSecret);
  }

  async encrypt(plaintext: string, recipientPublicKey: string): Promise<string> {
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
