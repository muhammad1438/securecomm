import React from "react";
import { View, Text, ViewStyle } from "react-native";
import { useTheme } from "../../theme";

interface MessageBubbleProps {
  message: string;
  senderName: string;
  isOwn: boolean;
  avatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  senderName,
  isOwn,
  avatar,
}) => {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
  };

  const avatarStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    flexShrink: 0,
  };

  const messageContainerStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
    gap: theme.spacing.xs,
    alignItems: isOwn ? 'flex-end' : 'flex-start',
  };

  const nameStyle = {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    maxWidth: 360,
    textAlign: isOwn ? 'right' as const : 'left' as const,
  };

  const bubbleStyle: ViewStyle = {
    maxWidth: 360,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: isOwn ? '#2094f3' : theme.colors.surface,
  };

  const messageTextStyle = {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.base * 1.5,
  };

  return (
    <View style={containerStyle}>
      {!isOwn && <View style={avatarStyle} />}
      
      <View style={messageContainerStyle}>
        <Text style={nameStyle}>{senderName}</Text>
        <View style={bubbleStyle}>
          <Text style={messageTextStyle}>{message}</Text>
        </View>
      </View>
      
      {isOwn && <View style={avatarStyle} />}
    </View>
  );
};
