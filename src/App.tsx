import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./theme";
import { ChatScreen } from "./screens/ChatScreen";
import { ContactsScreen } from "./screens/ContactsScreen";
import { NetworkScreen } from "./screens/NetworkScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { EmergencyScreen } from "./screens/EmergencyScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { cryptoService } from "./services/CryptoService";
import { bluetoothService } from "./services/BluetoothService";

type Screen = 'home' | 'chat' | 'contacts' | 'network' | 'settings' | 'emergency';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Starting app initialization...");
        await cryptoService.initialize();
        console.log("Crypto service initialized");
        await bluetoothService.startAdvertising();
        console.log("Bluetooth service initialized");
        console.log("SecureComm app initialized successfully!");
      } catch (error) {
        console.error("Failed to initialize the app:", error);
        // Don't prevent app from loading if services fail
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'chat':
        return <ChatScreen onNavigate={setCurrentScreen} />;
      case 'contacts':
        return <ContactsScreen onNavigate={setCurrentScreen} />;
      case 'network':
        return <NetworkScreen onNavigate={setCurrentScreen} />;
      case 'settings':
        return <SettingsScreen onNavigate={setCurrentScreen} />;
      case 'emergency':
        return <EmergencyScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#101a23',
          color: 'white',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔐</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>SecureComm</div>
            <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>
              Initializing secure connection...
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {renderScreen()}
    </ThemeProvider>
  );
};

export default App;
