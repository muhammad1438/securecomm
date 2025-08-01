import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { SearchInput, StatusCard, ThemeToggle } from '../components/common';

type Screen = 'chat' | 'contacts' | 'network' | 'settings' | 'emergency';

interface HomeScreenProps {
  onNavigate?: (screen: Screen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  const containerStyle = {
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

  const rightHeaderStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  };

  const searchContainerStyle: ViewStyle = {
    minWidth: 160,
    height: 40,
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
  };

  const mainSearchStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
    height: 48,
  };

  const welcomeTextStyle = {
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

  const statusItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  };

  const quickAccessStyle: ViewStyle = {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  };

  const quickButtonStyle: ViewStyle = {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flex: 1,
  };

  const emergencyButtonStyle: ViewStyle = {
    backgroundColor: '#dc2626',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flex: 1,
  };

  const buttonTextStyle = {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View style={headerStyle}>
        <View style={logoContainerStyle}>
          <View style={logoStyle} />
          <Text style={titleStyle}>SecureComm</Text>
        </View>
        <View style={rightHeaderStyle}>
          <SearchInput style={searchContainerStyle} />
          <ThemeToggle />
          <View style={avatarStyle} />
        </View>
      </View>
      
      <View style={contentContainerStyle}>
        <Text style={welcomeTextStyle}>Welcome back, Emily</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={sectionTitleStyle}>App Status</Text>
          
          <View style={statusItemStyle}>
            <Text style={{
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.medium,
              color: theme.colors.text,
            }}>Connection Status</Text>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              fontFamily: theme.typography.fontFamily.regular,
              color: '#22c55e',
            }}>Connected</Text>
          </View>
          
          <View style={statusItemStyle}>
            <Text style={{
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.medium,
              color: theme.colors.text,
            }}>Bluetooth Mesh</Text>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              fontFamily: theme.typography.fontFamily.regular,
              color: '#22c55e',
            }}>Active</Text>
          </View>
          
          <View style={statusItemStyle}>
            <Text style={{
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.medium,
              color: theme.colors.text,
            }}>Security Status</Text>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              fontFamily: theme.typography.fontFamily.regular,
              color: '#22c55e',
            }}>Encrypted</Text>
          </View>
          
          <Text style={sectionTitleStyle}>Quick Access</Text>
          
          <View style={quickAccessStyle}>
            <TouchableOpacity 
              style={quickButtonStyle}
              onPress={() => onNavigate?.('chat')}
            >
              <Text style={buttonTextStyle}>💬 New Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={quickButtonStyle}
              onPress={() => onNavigate?.('contacts')}
            >
              <Text style={buttonTextStyle}>👥 Contacts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={emergencyButtonStyle}
              onPress={() => onNavigate?.('emergency')}
            >
              <Text style={buttonTextStyle}>🚨 Emergency Broadcast</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};