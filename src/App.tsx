
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './navigation/AppNavigator';
import { cryptoService } from './services/CryptoService';
import { bluetoothService } from './services/BluetoothService';
import { networkService } from './services/NetworkService';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await cryptoService.initialize();
        await bluetoothService.startAdvertising();
        // The network service is already initialized in its constructor
      } catch (error) {
        console.error("Failed to initialize the app:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
