
import { MMKV } from 'react-native-mmkv';
import { Message } from '../types/message';

const storage = new MMKV();

class StorageService {
  saveMessages(contactId: string, messages: Message[]): void {
    try {
      storage.set(contactId, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  getMessages(contactId: string): Promise<Message[]> {
    try {
      const messages = storage.getString(contactId);
      return messages ? Promise.resolve(JSON.parse(messages)) : Promise.resolve([]);
    } catch (error) {
      console.error('Failed to get messages:', error);
      return Promise.resolve([]);
    }
  }

  clearMessages(contactId: string): void {
      try {
          storage.delete(contactId);
      } catch (error) {
          console.error('Failed to clear messages: ', error);
      }
  }
}

export const storageService = new StorageService();
