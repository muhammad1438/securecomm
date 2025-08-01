import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { DeviceCard } from "../components/common/DeviceCard";
import { SearchInput } from "../components/common/SearchInput";
import { ThemeToggle } from "../components/common/ThemeToggle";

type Screen = 'chat' | 'contacts' | 'network' | 'settings';

interface ContactsScreenProps {
  onNavigate?: (screen: Screen) => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

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

  const searchStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
    height: 48,
  };

  const sectionTitleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  };

  const discoveredDevices = [
    { name: 'Device 1', status: 'Unknown' as const, signalStrength: 'medium' as const },
    { name: 'Device 2', status: 'Paired' as const, signalStrength: 'high' as const },
    { name: 'Device 3', status: 'Trusted' as const, signalStrength: 'high' as const },
  ];

  const contacts = [
    { name: 'Alice', status: 'Unknown' as const, signalStrength: 'medium' as const },
    { name: 'Bob', status: 'Paired' as const, signalStrength: 'high' as const },
    { name: 'Charlie', status: 'Trusted' as const, signalStrength: 'high' as const },
  ];

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
            <Text style={[navLinkStyle, { opacity: 1 }]}>Contacts</Text>
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
        <Text style={pageTitleStyle}>Contacts/Devices</Text>
        
        <SearchInput 
          style={searchStyle} 
          placeholder="Search contacts or devices" 
        />
        
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={sectionTitleStyle}>Discovered Devices</Text>
          {discoveredDevices.map((device, index) => (
            <DeviceCard
              key={`device-${index}`}
              name={device.name}
              status={device.status}
              signalStrength={device.signalStrength}
              isContact={false}
            />
          ))}
          
          <Text style={sectionTitleStyle}>Contacts</Text>
          {contacts.map((contact, index) => (
            <DeviceCard
              key={`contact-${index}`}
              name={contact.name}
              status={contact.status}
              signalStrength={contact.signalStrength}
              isContact={true}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
