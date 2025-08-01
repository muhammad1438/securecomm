import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Alert,
  Platform,
} from "react-native";
import { audioService } from "../services/AudioService"; // Import the singleton instance
import { networkService } from "../services/NetworkService"; // Import the singleton instance
import { bluetoothService } from "../services/BluetoothService"; // Import the singleton instance
import { BluetoothDevice } from "../types/bluetooth";
import { Message, MessageType } from "../types/message";
import { Buffer } from "buffer";

// Generate UUID for React Native
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const WalkieTalkieScreen: React.FC = () => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("General");
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>(
    []
  );
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const channels = ["General", "Team A", "Team B", "Emergency"];

  useEffect(() => {
    initializeServices();

    return () => {
      cleanup();
    };
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize audio service
      await audioService.initialize();

      // Setup audio level monitoring
      audioService.onVoiceLevelChanged = (level: number) => {
        setVoiceLevel(level);
      };

      // Get connected devices
      updateConnectedDevices();

      // Setup bluetooth event listeners
      bluetoothService.onConnectionStateChanged = handleConnectionChange;
      bluetoothService.onMessageReceived = handleMessage;

      // Setup network service
      networkService.onMessageReceived = handleNetworkMessage;

      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize services:", error);
      Alert.alert("Error", "Failed to initialize walkie-talkie services");
    }
  };

  const updateConnectedDevices = () => {
    try {
      const devices = bluetoothService.getConnectedDevices();
      setConnectedDevices(devices);
    } catch (error) {
      console.error("Failed to get connected devices:", error);
      setConnectedDevices([]);
    }
  };

  const handleConnectionChange = (deviceId: string, status: string) => {
    console.log(`Connection changed: ${deviceId} - ${status}`);
    updateConnectedDevices();
  };

  const handleMessage = (message: Message) => {
    if (message.type === "voice" && message.content) {
      try {
        // Handle voice message from direct bluetooth connection
        playVoiceMessage(message);
      } catch (error) {
        console.error("Failed to handle bluetooth message:", error);
      }
    }
  };

  const handleNetworkMessage = (message: Message) => {
    if (message.type === "voice" && message.content) {
      try {
        // Handle voice message from network layer
        playVoiceMessage(message);
      } catch (error) {
        console.error("Failed to handle network message:", error);
      }
    }
  };

  const playVoiceMessage = async (message: Message) => {
    try {
      if (typeof message.content === "string") {
        // Convert base64 string to Uint8Array
        const audioData = new Uint8Array(
          Buffer.from(message.content, "base64")
        );
        await audioService.playAudioData(audioData);
      } else if (message.content instanceof Uint8Array) {
        await audioService.playAudioData(message.content);
      }
    } catch (error) {
      console.error("Failed to play voice message:", error);
    }
  };

  const startTransmission = async () => {
    if (!isInitialized) {
      Alert.alert("Error", "Services not initialized");
      return;
    }

    if (connectedDevices.length === 0) {
      Alert.alert("No Devices", "No connected devices to transmit to");
      return;
    }

    try {
      setIsTransmitting(true);
      Vibration.vibrate(50);

      // Animate button
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();

      // Start audio recording with real-time streaming
      await audioService.startRecording(async (audioData: Uint8Array) => {
        try {
          await broadcastVoiceMessage(audioData);
        } catch (error) {
          console.error("Failed to broadcast voice message:", error);
        }
      });
    } catch (error) {
      console.error("Failed to start transmission:", error);
      Alert.alert("Error", "Failed to start transmission");
      setIsTransmitting(false);
    }
  };

  const stopTransmission = async () => {
    try {
      setIsTransmitting(false);
      setVoiceLevel(0);
      Vibration.vibrate(50);

      // Reset button animation
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Stop audio recording
      await audioService.stopRecording();
    } catch (error) {
      console.error("Failed to stop transmission:", error);
      Alert.alert("Error", "Failed to stop transmission");
    }
  };

  const broadcastVoiceMessage = async (audioData: Uint8Array) => {
    const message: Message = {
      id: generateUUID(),
      type: "voice" as MessageType,
      content: audioData,
      sender: networkService.getDeviceId(),
      recipient: "broadcast",
      timestamp: Date.now(),
      encrypted: true,
      status: "sending",
      channel: selectedChannel,
    };

    // Send to all connected devices
    const promises = connectedDevices.map(async (device) => {
      try {
        // Create individual message for each device
        const deviceMessage: Message = {
          ...message,
          recipient: device.id,
        };

        // Send via network service for mesh routing
        await networkService.sendMessage(device.id, deviceMessage);

        // Also send directly via bluetooth for immediate delivery
        await bluetoothService.sendMessage(device.id, deviceMessage);
      } catch (error) {
        console.error(`Failed to send message to ${device.id}:`, error);
      }
    });

    // Wait for all messages to be sent
    await Promise.allSettled(promises);
  };

  const cleanup = () => {
    try {
      // Clean up event listeners
      bluetoothService.onConnectionStateChanged = undefined;
      bluetoothService.onMessageReceived = undefined;
      networkService.onMessageReceived = undefined;
      audioService.onVoiceLevelChanged = undefined;

      // Stop any ongoing recording
      if (isTransmitting) {
        audioService.stopRecording();
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  };

  const VoiceLevelIndicator = () => {
    if (!isTransmitting) return null;

    return (
      <View style={styles.voiceLevelContainer}>
        <View style={styles.voiceLevelBar}>
          <Animated.View
            style={[
              styles.voiceLevelFill,
              {
                width: `${Math.min(voiceLevel * 100, 100)}%`,
                backgroundColor: voiceLevel > 0.8 ? "#FF3B30" : "#34C759",
              },
            ]}
          />
        </View>
        <Text style={styles.voiceLevelText}>
          {Math.round(voiceLevel * 100)}%
        </Text>
      </View>
    );
  };

  const getSignalIcon = (rssi: number) => {
    if (rssi > -50) return "📶";
    if (rssi > -70) return "📶";
    if (rssi > -90) return "📶";
    return "📶";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Walkie-Talkie</Text>
        <Text style={styles.connectedCount}>
          {connectedDevices.length} connected
        </Text>
      </View>

      <View style={styles.channelSelector}>
        {channels.map((channel) => (
          <TouchableOpacity
            key={channel}
            style={[
              styles.channelButton,
              selectedChannel === channel && styles.selectedChannel,
            ]}
            onPress={() => setSelectedChannel(channel)}
            disabled={isTransmitting}
          >
            <Text
              style={[
                styles.channelText,
                selectedChannel === channel && styles.selectedChannelText,
              ]}
            >
              {channel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.devicesList}>
        <Text style={styles.devicesTitle}>Connected Devices:</Text>
        {connectedDevices.length === 0 ? (
          <Text style={styles.noDevicesText}>No devices connected</Text>
        ) : (
          connectedDevices.map((device) => (
            <View key={device.id} style={styles.deviceItem}>
              <Text style={styles.deviceName} numberOfLines={1}>
                {device.name || "Unknown Device"}
              </Text>
              <View style={styles.signalIndicator}>
                <Text style={styles.signalText}>
                  {getSignalIcon(device.rssi)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <VoiceLevelIndicator />

      <View style={styles.transmitContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.transmitButton,
              isTransmitting && styles.transmitButtonActive,
              !isInitialized && styles.transmitButtonDisabled,
            ]}
            onPressIn={startTransmission}
            onPressOut={stopTransmission}
            activeOpacity={0.8}
            disabled={!isInitialized || connectedDevices.length === 0}
          >
            <Text style={styles.transmitButtonText}>
              {isTransmitting ? "🔴 TRANSMITTING" : "🎙️ PUSH TO TALK"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.instructionText}>
          {connectedDevices.length > 0
            ? `Hold button to transmit on ${selectedChannel}`
            : "Connect to devices to start transmitting"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  connectedCount: {
    fontSize: 16,
    color: "#34C759",
  },
  channelSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    flexWrap: "wrap",
  },
  channelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
    marginHorizontal: 4,
    marginVertical: 4,
  },
  selectedChannel: {
    backgroundColor: "#007AFF",
  },
  channelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  selectedChannelText: {
    color: "#fff",
  },
  devicesList: {
    marginBottom: 20,
    maxHeight: 120,
  },
  devicesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  noDevicesText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 8,
  },
  deviceName: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  signalIndicator: {
    alignItems: "center",
    marginLeft: 12,
  },
  signalText: {
    fontSize: 16,
  },
  voiceLevelContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  voiceLevelBar: {
    width: "80%",
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  voiceLevelFill: {
    height: "100%",
    borderRadius: 3,
  },
  voiceLevelText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 8,
  },
  transmitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  transmitButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#555",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transmitButtonActive: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF6B6B",
  },
  transmitButtonDisabled: {
    backgroundColor: "#222",
    borderColor: "#333",
  },
  transmitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  instructionText: {
    color: "#999",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
