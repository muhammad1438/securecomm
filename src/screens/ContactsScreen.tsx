
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { bluetoothService } from '../services/BluetoothService';
import { cryptoService } from '../services/CryptoService';
import { BluetoothDevice } from '../types/bluetooth';

export const ContactsScreen = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await cryptoService.initialize();
      await bluetoothService.startAdvertising();
    };
    initialize();

    bluetoothService.onDeviceDiscovered = (device) => {
      setDiscoveredDevices(prevDevices => {
        if (prevDevices.find(d => d.id === device.id)) {
          return prevDevices;
        }
        return [...prevDevices, device];
      });
    };

    return () => {
      bluetoothService.onDeviceDiscovered = undefined;
    };
  }, []);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
            ]);

            if (
                grants['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.BLUETOOTH_ADVERTISE'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true;
            } else {
                console.log('All Bluetooth permissions not granted');
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true;
  };


  const startScan = async () => {
    const hasPermission = await requestBluetoothPermission();
    if (!hasPermission) {
        return;
    }

    setIsScanning(true);
    setDiscoveredDevices([]);
    try {
      await bluetoothService.startScanning();
      setTimeout(() => {
        setIsScanning(false);
      }, 10000); 
    } catch (error) {
      console.error("Scanning error:", error);
      setIsScanning(false);
    }
  };

  const connectToDevice = (device: BluetoothDevice) => {
      bluetoothService.connectToDevice(device.id);
  }

  const renderItem = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
      <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scanButton} onPress={startScan} disabled={isScanning}>
        <Text style={styles.scanButtonText}>{isScanning ? 'Scanning...' : 'Scan for Devices'}</Text>
      </TouchableOpacity>
      <FlatList
        data={discoveredDevices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No devices found. Tap "Scan" to begin.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceAddress: {
    fontSize: 12,
    color: '#666',
  },
  deviceRssi: {
      fontSize: 12,
      color: '#666'
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 20
  }
});
