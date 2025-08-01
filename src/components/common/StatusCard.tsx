import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  style?: ViewStyle;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  title,
  status,
  style,
}) => {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 72,
    gap: theme.spacing.md,
  };

  const iconContainerStyle: ViewStyle = {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
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

  return (
    <View style={[containerStyle, style]}>
      <View style={iconContainerStyle}>
        {icon}
      </View>
      <View style={textContainerStyle}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={statusStyle}>{status}</Text>
      </View>
    </View>
  );
};