
import { networkService } from '../../src/services/NetworkService';
import { bluetoothService } from '../../src/services/BluetoothService';
import { Message } from '../../src/types/message';

// Mock the BluetoothService
jest.mock('../../src/services/BluetoothService', () => ({
    bluetoothService: {
        sendMessage: jest.fn(),
        getConnectedDevices: jest.fn(() => []),
    },
}));

describe('NetworkService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a direct message if a route exists', async () => {
    const recipientId = 'device-2';
    const message: Message = {
      id: 'test-message',
      type: 'text',
      content: 'Hello',
      sender: 'device-1',
      recipient: recipientId,
      timestamp: Date.now(),
      encrypted: true,
      status: 'sending'
    };

    // Setup a direct route
    networkService['routingTable'] = {
        [recipientId]: {
            nextHop: recipientId,
            cost: 1,
            timestamp: Date.now()
        }
    };

    await networkService.sendMessage(recipientId, message);
    expect(bluetoothService.sendMessage).toHaveBeenCalledWith(recipientId, message);
  });

  it('should send a message via a hop if a route exists', async () => {
    const recipientId = 'device-3';
    const message: Message = {
        id: 'test-message',
        type: 'text',
        content: 'Hello',
        sender: 'device-1',
        recipient: recipientId,
        timestamp: Date.now(),
        encrypted: true,
        status: 'sending'
    };

    // Setup a route through device-2
    networkService['routingTable'] = {
        [recipientId]: {
            nextHop: 'device-2',
            cost: 2,
            timestamp: Date.now()
        }
    };

    await networkService.sendMessage(recipientId, message);
    expect(bluetoothService.sendMessage).toHaveBeenCalledWith('device-2', message);
  });
});
