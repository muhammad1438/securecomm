
export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  rssi: number;
  isConnected: boolean;
  lastSeen: number;
  capabilities: DeviceCapability[];
  trustLevel: TrustLevel;
  publicKey?: string;
}

export type DeviceCapability = 'text' | 'voice' | 'file' | 'emergency';
export type TrustLevel = 'unknown' | 'paired' | 'trusted' | 'verified';

export interface BluetoothConnection {
  deviceId: string;
  connectionId: string;
  established: number;
  quality: ConnectionQuality;
  role: 'central' | 'peripheral';
}

export interface ConnectionQuality {
  signalStrength: number;
  latency: number;
  packetLoss: number;
  bandwidth: number;
}
