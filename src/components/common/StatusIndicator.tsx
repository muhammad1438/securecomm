import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'connecting' | 'secure' | 'insecure' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
  style?: ViewStyle;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = false,
  text,
  style,
}) => {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'online':
      case 'secure':
        return theme.colors.success;
      case 'offline':
        return theme.colors.offline;
      case 'connecting':
      case 'pending':
        return theme.colors.warning;
      case 'insecure':
        return theme.colors.error;
      default:
        return theme.colors.textTertiary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 8;
      case 'lg': return 16;
      default: return 12;
    }
  };

  const getStatusText = () => {
    if (text) return text;
    
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'connecting': return 'Connecting';
      case 'secure': return 'Secure';
      case 'insecure': return 'Insecure';
      case 'pending': return 'Pending';
      default: return '';
    }
  };

  const indicatorSize = getSize();
  const color = getStatusColor();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const dotStyle: ViewStyle = {
    width: indicatorSize,
    height: indicatorSize,
    borderRadius: indicatorSize / 2,
    backgroundColor: color,
  };

  const textStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  };

  return (
    <View style={[containerStyle, style]}>
      <View style={dotStyle} />
      {showText && (
        <Text style={textStyle}>{getStatusText()}</Text>
      )}
    </View>
  );
};