import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Message',
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  };

  const inputContainerStyle: ViewStyle = {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  };

  const inputStyle = {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    paddingHorizontal: theme.spacing.md,
    paddingRight: theme.spacing.sm,
    outlineStyle: 'none' as const,
    borderWidth: 0,
  };

  const actionsContainerStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  };

  const actionButtonStyle: ViewStyle = {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const sendButtonStyle: ViewStyle = {
    minWidth: 84,
    height: 32,
    backgroundColor: '#2094f3',
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  };

  const sendButtonTextStyle = {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  };

  const iconColor = theme.colors.textSecondary;

  return (
    <View style={containerStyle}>
      <View style={inputContainerStyle}>
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline={false}
          onSubmitEditing={handleSend}
        />
        <View style={actionsContainerStyle}>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: iconColor, fontSize: 20 }}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: iconColor, fontSize: 20 }}>🎤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sendButtonStyle} onPress={handleSend}>
            <Text style={sendButtonTextStyle}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};