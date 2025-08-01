import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'sm',
}) => {
  const { theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return theme.spacing.sm;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.md;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'none': return theme.shadows.none;
      case 'sm': return theme.shadows.sm;
      case 'md': return theme.shadows.md;
      case 'lg': return theme.shadows.lg;
      case 'xl': return theme.shadows.xl;
      default: return theme.shadows.sm;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: getPadding(),
    ...getShadow(),
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};