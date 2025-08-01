import { BluetoothDevice, BluetoothConnection } from "../types/bluetooth";
import { NetworkTopology, Route } from "../types/network";
import { Message } from "../types/message";
import { bluetoothService } from "./BluetoothService";
import { v4 as uuidv4 } from "uuid";

interface RoutingTable {
  [destination: string]: {
    nextHop: string;
    cost: number;
    timestamp: number;
  };
}

class NetworkService {
  private topology: NetworkTopology = {
    devices: new Map(),
    connections: new Map(),
    routes: new Map(),
    lastUpdated: Date.now(),
  };
  private routingTable: RoutingTable = {};
  private deviceId: string;

  constructor() {
    this.deviceId = uuidv4();
    this.startNetworkMaintenance();
    bluetoothService.onSystemMessageReceived =
      this.processSystemMessage.bind(this);
  }

  private startNetworkMaintenance(): void {
    setInterval(() => {
      this.broadcastHelloMessage();
    }, 30000);

    setInterval(() => {
      this.cleanupOldRoutes();
    }, 60000);
  }

  private async broadcastHelloMessage(): Promise<void> {
    const message: Message = {
      id: uuidv4(),
      type: "system",
      content: JSON.stringify({
        type: "hello",
        deviceId: this.deviceId,
        deviceName: "SecureComm Device",
      }),
      sender: this.deviceId,
      recipient: "broadcast",
      timestamp: Date.now(),
      encrypted: true,
      status: "sending",
    };

    const connectedDevices = bluetoothService.getConnectedDevices();
    for (const device of connectedDevices) {
      await bluetoothService.sendMessage(device.id, message);
    }
  }

  private processSystemMessage(message: Message): void {
    try {
      const content = JSON.parse(message.content as string);
      if (content.type === "hello") {
        this.processHelloMessage(content);
      }
    } catch (e) {
      console.error("Error processing system message", e);
    }
  }

  private processHelloMessage(content: any): void {
    const { deviceId, deviceName } = content;

    if (!this.topology.devices.has(deviceId)) {
      const newDevice: BluetoothDevice = {
        id: deviceId,
        name: deviceName,
        address: deviceId,
        rssi: 0,
        isConnected: true,
        lastSeen: Date.now(),
        capabilities: ["text", "voice"],
        trustLevel: "unknown",
      };
      this.topology.devices.set(deviceId, newDevice);
    }

    const route: Route = {
      destination: deviceId,
      path: [this.deviceId, deviceId],
      cost: 1,
      timestamp: Date.now(),
    };
    this.topology.routes.set(deviceId, route);
    this.routingTable[deviceId] = {
      nextHop: deviceId,
      cost: 1,
      timestamp: Date.now(),
    };
  }

  private cleanupOldRoutes(): void {
    const now = Date.now();
    const routeTimeout = 5 * 60 * 1000;

    for (const [destination, route] of this.topology.routes.entries()) {
      if (now - route.timestamp > routeTimeout) {
        this.topology.routes.delete(destination);
        delete this.routingTable[destination];
      }
    }
  }

  async sendMessage(recipientId: string, message: Message): Promise<void> {
    if (recipientId === "broadcast") {
      const connectedDevices = bluetoothService.getConnectedDevices();
      for (const device of connectedDevices) {
        await bluetoothService.sendMessage(device.id, message);
      }
      return;
    }
    const route = this.routingTable[recipientId];
    if (route) {
      await bluetoothService.sendMessage(route.nextHop, message);
    } else {
      console.warn(`No route to ${recipientId}, attempting direct connection`);
      await bluetoothService.sendMessage(recipientId, message);
    }
  }

  getNetworkTopology(): NetworkTopology {
    return this.topology;
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}

export const networkService = new NetworkService();
