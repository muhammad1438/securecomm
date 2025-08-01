import { Message } from "../types/message";
import { bluetoothService } from "./BluetoothService";
import { storageService } from "./StorageService";

class MessageService {
  async sendMessage(message: Message): Promise<void> {
    try {
      await bluetoothService.sendMessage(message.recipient, message);
      await this.saveMessageHistory(message);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  async saveMessageHistory(message: Message): Promise<void> {
    try {
      const currentHistory = await this.getMessageHistory(message.recipient);
      const updatedHistory = [...currentHistory, message];
      storageService.saveMessages(message.recipient, updatedHistory);
    } catch (error) {
      console.error("Failed to save message history:", error);
    }
  }

  async getMessageHistory(contactId: string): Promise<Message[]> {
    try {
      return await storageService.getMessages(contactId);
    } catch (error) {
      console.error("Failed to get message history:", error);
      return [];
    }
  }
}

export const messageService = new MessageService();
