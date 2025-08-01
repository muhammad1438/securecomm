import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface ThemeToggleProps {
  style?: ViewStyle;
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style, size = 20 }) => {
  const { theme, toggleTheme } = useTheme();

  const buttonStyle: ViewStyle = {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  // Show sun icon for dark mode (to indicate switching to light)
  // Show moon icon for light mode (to indicate switching to dark)
  const icon = theme.isDark ? '☀️' : '🌙';

  return (
    <TouchableOpacity style={buttonStyle} onPress={toggleTheme}>
      <Text style={{ fontSize: size }}>{icon}</Text>
    </TouchableOpacity>
  );
};