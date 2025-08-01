import React, { useEffect } from "react";
import { ThemeProvider } from "./theme";
import { HomeScreen } from "./screens/HomeScreen";
import { cryptoService } from "./services/CryptoService";
import { bluetoothService } from "./services/BluetoothService";

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await cryptoService.initialize();
        await bluetoothService.startAdvertising();
        console.log("SecureComm app initialized successfully!");
      } catch (error) {
        console.error("Failed to initialize the app:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
};

export default App;
