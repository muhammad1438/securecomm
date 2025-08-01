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
import { ThemeToggle } from "../components/common/ThemeToggle";

type Screen = 'chat' | 'contacts' | 'network' | 'settings';

interface SettingsScreenProps {
  onNavigate?: (screen: Screen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
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

  const sectionTitleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  };

  const settingItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 72,
  };

  const iconContainerStyle: ViewStyle = {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const textContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
  };

  const settingTitleStyle = {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.base * 1.5,
  };

  const settingDescriptionStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.4,
    marginTop: 2,
  };

  const settings = [
    {
      icon: "🛡️",
      title: "Encryption Settings",
      description: "Adjust encryption settings and privacy controls"
    },
    {
      icon: "☀️",
      title: "Theme Selection",
      description: "Choose between light and dark themes"
    },
    {
      icon: "📶",
      title: "Network Configuration",
      description: "Manage Bluetooth mesh network settings"
    },
    {
      icon: "👁️",
      title: "Privacy Controls",
      description: "Customize data handling and visibility"
    },
    {
      icon: "🔔",
      title: "Emergency Settings",
      description: "Configure options related to the emergency broadcast system"
    },
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
            <Text style={navLinkStyle}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('network')}>
            <Text style={navLinkStyle}>Network Map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('settings')}>
            <Text style={[navLinkStyle, { opacity: 1 }]}>Settings</Text>
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
        <Text style={pageTitleStyle}>Settings</Text>
        
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={sectionTitleStyle}>Security Preferences</Text>
          
          {settings.map((setting, index) => (
            <View key={index} style={settingItemStyle}>
              <View style={iconContainerStyle}>
                <Text style={{ fontSize: 24 }}>{setting.icon}</Text>
              </View>
              <View style={textContainerStyle}>
                <Text style={settingTitleStyle} numberOfLines={1}>
                  {setting.title}
                </Text>
                <Text style={settingDescriptionStyle} numberOfLines={2}>
                  {setting.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
