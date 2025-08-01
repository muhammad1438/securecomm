import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface DeviceCardProps {
  name: string;
  status: 'Unknown' | 'Paired' | 'Trusted';
  signalStrength: 'low' | 'medium' | 'high';
  isContact?: boolean;
  avatar?: string;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  name,
  status,
  signalStrength,
  isContact = false,
  avatar,
}) => {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 72,
    gap: theme.spacing.md,
  };

  const leftSectionStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
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

  const avatarStyle: ViewStyle = {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    flexShrink: 0,
  };

  const textContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
  };

  const titleStyle = {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.base * 1.5,
  };

  const statusStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.4,
    marginTop: 2,
  };

  const signalContainerStyle: ViewStyle = {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const getSignalIcon = () => {
    const iconColor = theme.colors.text;
    if (signalStrength === 'high') {
      return <Text style={{ color: iconColor, fontSize: 20 }}>📶</Text>;
    } else if (signalStrength === 'medium') {
      return <Text style={{ color: iconColor, fontSize: 20 }}>📶</Text>;
    } else {
      return <Text style={{ color: iconColor, fontSize: 18 }}>📶</Text>;
    }
  };

  const getDeviceIcon = () => {
    return <Text style={{ color: theme.colors.text, fontSize: 24 }}>📡</Text>;
  };

  return (
    <View style={containerStyle}>
      <View style={leftSectionStyle}>
        {isContact ? (
          <View style={avatarStyle} />
        ) : (
          <View style={iconContainerStyle}>
            {getDeviceIcon()}
          </View>
        )}
        <View style={textContainerStyle}>
          <Text style={titleStyle} numberOfLines={1}>
            {name}
          </Text>
          <Text style={statusStyle} numberOfLines={2}>
            {status}
          </Text>
        </View>
      </View>
      <View style={signalContainerStyle}>
        {getSignalIcon()}
      </View>
    </View>
  );
};