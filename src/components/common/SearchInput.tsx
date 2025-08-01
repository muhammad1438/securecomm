import React, { useState } from 'react';
import { View, TextInput, ViewStyle, Text } from 'react-native';
import { useTheme } from '../../theme';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search',
  value,
  onChangeText,
  style,
}) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState('');

  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalValue(text);
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 48,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  };

  const iconContainerStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    paddingLeft: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  };

  const inputStyle = {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    paddingHorizontal: theme.spacing.md,
    paddingLeft: theme.spacing.sm,
    outlineStyle: 'none' as const,
    borderWidth: 0,
  };

  const iconColor = theme.colors.textSecondary;

  return (
    <View style={[containerStyle, style]}>
      <View style={iconContainerStyle}>
        <Text style={{ color: iconColor, fontSize: 20 }}>🔍</Text>
      </View>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value !== undefined ? value : internalValue}
        onChangeText={handleChangeText}
      />
    </View>
  );
};