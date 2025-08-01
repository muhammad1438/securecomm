import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "../../types/message";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
}) => (
  <View
    style={[
      styles.messageBubble,
      isOwn ? styles.ownMessage : styles.otherMessage,
    ]}
  >
    <Text style={isOwn ? styles.ownMessageText : styles.otherMessageText}>
      {message.content as string}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 4,
    maxWidth: "80%",
  },
  ownMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  ownMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
});
