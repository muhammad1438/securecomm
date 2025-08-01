import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../theme';
import { Card, Button, StatusIndicator } from '../components/common';

export const HomeScreen = () => {
  const { theme } = useTheme();

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const contentStyle = {
    padding: theme.spacing.md,
  };

  const titleStyle = {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.sm,
  };

  const subtitleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.xl,
  };

  const sectionTitleStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  };

  const descriptionStyle = {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.base * 1.5,
    marginBottom: theme.spacing.md,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView style={contentStyle} showsVerticalScrollIndicator={false}>
        <Text style={titleStyle}>SecureComm</Text>
        <Text style={subtitleStyle}>Secure Communication Platform</Text>
        
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <StatusIndicator 
            status="secure" 
            showText 
            text="App Initialized Successfully"
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={descriptionStyle}>
            SecureComm is a decentralized, mesh-networking communication app that enables 
            secure messaging without relying on internet infrastructure.
          </Text>
        </Card>

        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text style={sectionTitleStyle}>Key Features</Text>
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Text style={descriptionStyle}>• End-to-end encrypted messaging</Text>
            <Text style={descriptionStyle}>• Bluetooth mesh networking</Text>
            <Text style={descriptionStyle}>• Offline-first architecture</Text>
            <Text style={descriptionStyle}>• Emergency broadcast system</Text>
            <Text style={descriptionStyle}>• Cross-platform support</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text style={sectionTitleStyle}>Network Status</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <StatusIndicator status="online" showText text="Bluetooth Active" />
              <StatusIndicator status="secure" showText text="Encryption Ready" />
            </View>
            <Button 
              title="Start Scanning" 
              variant="outline" 
              size="sm"
              onPress={() => console.log('Start scanning for devices')}
            />
          </View>
        </Card>

        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          <Button 
            title="Messages" 
            onPress={() => console.log('Navigate to messages')}
            style={{ flex: 1 }}
          />
          <Button 
            title="Contacts" 
            variant="secondary"
            onPress={() => console.log('Navigate to contacts')}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};