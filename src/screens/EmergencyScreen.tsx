import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ViewStyle,
  Modal,
} from "react-native";
import { useTheme } from "../theme";
import { emergencyBroadcastService } from "../services/EmergencyBroadcastService";
import { ThemeToggle } from "../components/common/ThemeToggle";

type Screen = 'chat' | 'contacts' | 'network' | 'settings' | 'emergency';

interface EmergencyScreenProps {
  onNavigate?: (screen: Screen) => void;
}

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

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [emergencyMessages, setEmergencyMessages] = useState<EmergencyMessage[]>([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  useEffect(() => {
    // Load existing emergency messages
    setEmergencyMessages(emergencyBroadcastService.getEmergencyMessages());

    // Listen for new emergency messages
    const unsubscribe = emergencyBroadcastService.onEmergencyMessage((message) => {
      setEmergencyMessages(prev => [message, ...prev]);
    });

    return unsubscribe;
  }, []);

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const headerStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const logoContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const logoStyle: ViewStyle = {
    width: 16,
    height: 16,
    backgroundColor: theme.colors.text,
  };

  const titleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  };

  const navContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  };

  const navLinkStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  };

  const rightHeaderStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const actionButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const avatarStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  };

  const contentContainerStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.xl * 2.5,
    paddingVertical: theme.spacing.md,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  };

  const pageTitleStyle = {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  };

  const emergencyButtonsStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  };

  const emergencyButtonStyle: ViewStyle = {
    backgroundColor: '#dc2626',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 150,
  };

  const emergencyButtonTextStyle = {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  };

  const customButtonStyle: ViewStyle = {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 150,
  };

  const messageListStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  };

  const messageItemStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
  };

  const modalStyle: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyle: ViewStyle = {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    maxWidth: 400,
  };

  const inputStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  };

  const handleEmergencyBroadcast = async (type: 'medical' | 'fire' | 'safety' | 'missing') => {
    try {
      switch (type) {
        case 'medical':
          await emergencyBroadcastService.broadcastMedicalEmergency();
          Alert.alert('Emergency Broadcast', 'Medical emergency alert sent successfully');
          break;
        case 'fire':
          await emergencyBroadcastService.broadcastFireEmergency();
          Alert.alert('Emergency Broadcast', 'Fire emergency alert sent successfully');
          break;
        case 'safety':
          await emergencyBroadcastService.broadcastSafetyWarning('General safety warning issued from this location');
          Alert.alert('Emergency Broadcast', 'Safety warning sent successfully');
          break;
        case 'missing':
          await emergencyBroadcastService.broadcastMissingPerson('Details not specified');
          Alert.alert('Emergency Broadcast', 'Missing person alert sent successfully');
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send emergency broadcast');
      console.error('Emergency broadcast error:', error);
    }
  };

  const handleCustomBroadcast = async () => {
    if (!customTitle.trim() || !customMessage.trim()) {
      Alert.alert('Error', 'Please enter both title and message');
      return;
    }

    try {
      await emergencyBroadcastService.broadcastEmergency(
        'INFO',
        customTitle.trim(),
        customMessage.trim(),
        'MEDIUM'
      );
      Alert.alert('Emergency Broadcast', 'Custom message sent successfully');
      setCustomTitle('');
      setCustomMessage('');
      setShowBroadcastModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to send custom broadcast');
      console.error('Custom broadcast error:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MEDIUM': return '#d97706';
      case 'LOW': return '#65a30d';
      default: return theme.colors.primary;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View style={headerStyle}>
        <View style={logoContainerStyle}>
          <View style={logoStyle} />
          <Text style={titleStyle}>SecureComm</Text>
        </View>
        <View style={navContainerStyle}>
          <TouchableOpacity onPress={() => onNavigate?.('chat')}>
            <Text style={navLinkStyle}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('contacts')}>
            <Text style={navLinkStyle}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('network')}>
            <Text style={navLinkStyle}>Network Map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('settings')}>
            <Text style={navLinkStyle}>Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={rightHeaderStyle}>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
          <ThemeToggle />
          <View style={avatarStyle} />
        </View>
      </View>

      <View style={contentContainerStyle}>
        <Text style={pageTitleStyle}>Emergency Broadcast</Text>
        
        <View style={emergencyButtonsStyle}>
          <TouchableOpacity 
            style={emergencyButtonStyle}
            onPress={() => handleEmergencyBroadcast('medical')}
          >
            <Text style={emergencyButtonTextStyle}>🚑 Medical Emergency</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={emergencyButtonStyle}
            onPress={() => handleEmergencyBroadcast('fire')}
          >
            <Text style={emergencyButtonTextStyle}>🔥 Fire Emergency</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={emergencyButtonStyle}
            onPress={() => handleEmergencyBroadcast('safety')}
          >
            <Text style={emergencyButtonTextStyle}>⚠️ Safety Warning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={emergencyButtonStyle}
            onPress={() => handleEmergencyBroadcast('missing')}
          >
            <Text style={emergencyButtonTextStyle}>👤 Missing Person</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={customButtonStyle}
            onPress={() => setShowBroadcastModal(true)}
          >
            <Text style={emergencyButtonTextStyle}>📢 Custom Message</Text>
          </TouchableOpacity>
        </View>

        <Text style={{
          fontSize: theme.typography.fontSize.lg,
          fontFamily: theme.typography.fontFamily.bold,
          color: theme.colors.text,
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.sm,
        }}>Recent Emergency Messages</Text>

        <ScrollView style={messageListStyle} showsVerticalScrollIndicator={false}>
          {emergencyMessages.map((message) => (
            <View 
              key={message.id} 
              style={[messageItemStyle, { borderLeftColor: getPriorityColor(message.priority) }]}
            >
              <Text style={{
                fontSize: theme.typography.fontSize.base,
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.text,
                marginBottom: 4,
              }}>
                {message.title}
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.text,
                marginBottom: 8,
              }}>
                {message.message}
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.textSecondary,
              }}>
                {formatTimestamp(message.timestamp)} • Priority: {message.priority}
              </Text>
            </View>
          ))}
          {emergencyMessages.length === 0 && (
            <Text style={{
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              paddingVertical: theme.spacing.xl,
            }}>
              No emergency messages received
            </Text>
          )}
        </ScrollView>
      </View>

      <Modal visible={showBroadcastModal} transparent animationType="fade">
        <View style={modalStyle}>
          <View style={modalContentStyle}>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
              textAlign: 'center',
            }}>
              Custom Emergency Broadcast
            </Text>
            
            <TextInput
              style={[inputStyle, { color: theme.colors.text }]}
              placeholder="Emergency Title"
              placeholderTextColor={theme.colors.textSecondary}
              value={customTitle}
              onChangeText={setCustomTitle}
            />
            
            <TextInput
              style={[inputStyle, { height: 100, textAlignVertical: 'top', color: theme.colors.text }]}
              placeholder="Emergency Message"
              placeholderTextColor={theme.colors.textSecondary}
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
            />
            
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <TouchableOpacity
                style={[customButtonStyle, { flex: 1, backgroundColor: theme.colors.surface }]}
                onPress={() => setShowBroadcastModal(false)}
              >
                <Text style={{ color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[emergencyButtonStyle, { flex: 1 }]}
                onPress={handleCustomBroadcast}
              >
                <Text style={emergencyButtonTextStyle}>Send Broadcast</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};