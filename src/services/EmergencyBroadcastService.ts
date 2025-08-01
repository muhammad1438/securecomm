import { bluetoothService } from './BluetoothService';
import { cryptoService } from './CryptoService';

interface EmergencyMessage {
  id: string;
  type: 'ALERT' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: {
    latitude: number;
    longitude: number;
  };
  expiresAt?: number;
}

class EmergencyBroadcastService {
  private isEnabled: boolean = true;
  private emergencyMessages: EmergencyMessage[] = [];
  private listeners: ((message: EmergencyMessage) => void)[] = [];

  constructor() {
    this.setupEmergencyListener();
  }

  private setupEmergencyListener() {
    // Listen for incoming emergency broadcasts
    bluetoothService.onMessageReceived((data: any) => {
      if (data.type === 'EMERGENCY_BROADCAST') {
        this.handleIncomingEmergencyMessage(data);
      }
    });
  }

  private async handleIncomingEmergencyMessage(data: any) {
    try {
      // Decrypt emergency message
      const decryptedMessage = await cryptoService.decrypt(data.encryptedPayload);
      const emergencyMessage: EmergencyMessage = JSON.parse(decryptedMessage);
      
      // Validate message is not expired
      if (emergencyMessage.expiresAt && Date.now() > emergencyMessage.expiresAt) {
        return;
      }

      // Add to emergency messages
      this.emergencyMessages.unshift(emergencyMessage);
      
      // Keep only last 50 emergency messages
      if (this.emergencyMessages.length > 50) {
        this.emergencyMessages = this.emergencyMessages.slice(0, 50);
      }

      // Notify listeners
      this.listeners.forEach(listener => listener(emergencyMessage));

      // Re-broadcast to extend range (with TTL to prevent loops)
      if (data.ttl && data.ttl > 0) {
        this.rebroadcastMessage(data, data.ttl - 1);
      }
    } catch (error) {
      console.error('Failed to handle emergency message:', error);
    }
  }

  private async rebroadcastMessage(originalData: any, ttl: number) {
    try {
      await bluetoothService.broadcast({
        ...originalData,
        ttl,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to rebroadcast emergency message:', error);
    }
  }

  async broadcastEmergency(
    type: EmergencyMessage['type'],
    title: string,
    message: string,
    priority: EmergencyMessage['priority'] = 'HIGH',
    location?: { latitude: number; longitude: number },
    expiresInHours: number = 24
  ): Promise<void> {
    if (!this.isEnabled) {
      throw new Error('Emergency broadcast is disabled');
    }

    const emergencyMessage: EmergencyMessage = {
      id: `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      priority,
      location,
      expiresAt: Date.now() + (expiresInHours * 60 * 60 * 1000)
    };

    try {
      // Encrypt the emergency message
      const encryptedPayload = await cryptoService.encrypt(JSON.stringify(emergencyMessage));
      
      // Broadcast the encrypted emergency message
      await bluetoothService.broadcast({
        type: 'EMERGENCY_BROADCAST',
        encryptedPayload,
        ttl: 5, // Re-broadcast up to 5 hops
        timestamp: Date.now(),
        priority: priority
      });

      // Add to local emergency messages
      this.emergencyMessages.unshift(emergencyMessage);
      
      console.log(`Emergency broadcast sent: ${title}`);
    } catch (error) {
      console.error('Failed to broadcast emergency message:', error);
      throw error;
    }
  }

  getEmergencyMessages(): EmergencyMessage[] {
    // Return only non-expired messages
    const now = Date.now();
    return this.emergencyMessages.filter(msg => 
      !msg.expiresAt || msg.expiresAt > now
    );
  }

  onEmergencyMessage(callback: (message: EmergencyMessage) => void) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isEmergencyBroadcastEnabled(): boolean {
    return this.isEnabled;
  }

  clearEmergencyMessages() {
    this.emergencyMessages = [];
  }

  // Predefined emergency message templates
  async broadcastMedicalEmergency(location?: { latitude: number; longitude: number }) {
    return this.broadcastEmergency(
      'ALERT',
      'Medical Emergency',
      'Medical assistance needed at this location. Please send help if available.',
      'CRITICAL',
      location,
      6 // Expires in 6 hours
    );
  }

  async broadcastFireEmergency(location?: { latitude: number; longitude: number }) {
    return this.broadcastEmergency(
      'ALERT',
      'Fire Emergency',
      'Fire reported at this location. Evacuate the area and call fire services.',
      'CRITICAL',
      location,
      12 // Expires in 12 hours
    );
  }

  async broadcastSafetyWarning(message: string, location?: { latitude: number; longitude: number }) {
    return this.broadcastEmergency(
      'WARNING',
      'Safety Warning',
      message,
      'HIGH',
      location,
      24 // Expires in 24 hours
    );
  }

  async broadcastMissingPerson(personDetails: string, location?: { latitude: number; longitude: number }) {
    return this.broadcastEmergency(
      'INFO',
      'Missing Person Alert',
      `Missing person: ${personDetails}. Last seen in this area. Please contact authorities if seen.`,
      'MEDIUM',
      location,
      72 // Expires in 72 hours
    );
  }
}

export const emergencyBroadcastService = new EmergencyBroadcastService();