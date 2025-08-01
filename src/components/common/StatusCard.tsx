import React from 'react';
import { View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

export interface StatusCardProps {
  avatar?: string;
  title: string;
  subtitle: string;
  timestamp: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  avatar,
  title,
  subtitle,
  timestamp,
  onPress,
  style,
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
  };

  const leftSectionStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  };

  const avatarStyle: ViewStyle = {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
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

  const subtitleStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.4,
    marginTop: 2,
  };

  const timestampStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.4,
  };

  const content = (
    <View style={[containerStyle, style]}>
      <View style={leftSectionStyle}>
        <View style={avatarStyle} />
        <View style={textContainerStyle}>
          <Text style={titleStyle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={subtitleStyle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Text style={timestampStyle}>{timestamp}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};