import { BluetoothDevice, BluetoothConnection } from "./bluetooth";

export interface NetworkTopology {
  devices: Map<string, BluetoothDevice>;
  connections: Map<string, BluetoothConnection>;
  routes: Map<string, Route>;
  lastUpdated: number;
}

export interface Route {
  destination: string;
  path: string[];
  cost: number;
  timestamp: number;
}
