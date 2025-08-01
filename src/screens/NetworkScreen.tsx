import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { SearchInput } from "../components/common/SearchInput";
import { ThemeToggle } from "../components/common/ThemeToggle";

type Screen = 'chat' | 'contacts' | 'network' | 'settings';

interface NetworkScreenProps {
  onNavigate?: (screen: Screen) => void;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ onNavigate }) => {
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

  const pageHeaderStyle: ViewStyle = {
    flexDirection: 'column',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  };

  const pageTitleStyle = {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  };

  const descriptionStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  };

  const mapContainerStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
  };

  const mapViewStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
  };

  const mapBackgroundStyle: ViewStyle = {
    minHeight: 320,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#182834',
  };

  const mapSearchStyle: ViewStyle = {
    height: 48,
  };

  const controlsContainerStyle: ViewStyle = {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  };

  const zoomControlsStyle: ViewStyle = {
    flexDirection: 'column',
    gap: 2,
  };

  const controlButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    backgroundColor: '#182834',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  };

  const zoomInButtonStyle: ViewStyle = {
    ...controlButtonStyle,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  };

  const zoomOutButtonStyle: ViewStyle = {
    ...controlButtonStyle,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  };

  const navButtonStyle: ViewStyle = {
    ...controlButtonStyle,
    borderRadius: theme.borderRadius.lg,
  };

  const captionStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
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
            <Text style={[navLinkStyle, { opacity: 1 }]}>Network Map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('settings')}>
            <Text style={navLinkStyle}>Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={rightHeaderStyle}>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
          <ThemeToggle />
          <View style={avatarStyle} />
        </View>
      </View>
      
      <View style={contentContainerStyle}>
        <View style={pageHeaderStyle}>
          <Text style={pageTitleStyle}>Network Map</Text>
          <Text style={descriptionStyle}>Visualize the Bluetooth mesh network topology.</Text>
        </View>
        
        <View style={mapContainerStyle}>
          <View style={mapViewStyle}>
            <View style={mapBackgroundStyle}>
              <SearchInput 
                style={mapSearchStyle} 
                placeholder="Search for a device"
              />
              
              <View style={controlsContainerStyle}>
                <View style={zoomControlsStyle}>
                  <TouchableOpacity style={zoomInButtonStyle}>
                    <Text style={{ color: theme.colors.text, fontSize: 24 }}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={zoomOutButtonStyle}>
                    <Text style={{ color: theme.colors.text, fontSize: 24 }}>−</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={navButtonStyle}>
                  <Text style={{ color: theme.colors.text, fontSize: 20 }}>🧭</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={captionStyle}>
          Nodes represent devices, lines indicate connections. Colors may represent signal strength or network health.
        </Text>
      </View>
    </SafeAreaView>
  );
};
