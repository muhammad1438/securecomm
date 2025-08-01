import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { Message } from "../../types/message";
import { bluetoothService } from "../../services/BluetoothService";
import { networkService } from "../../services/NetworkService";
import { messageService } from "../../services/MessageService";
import { MessageBubble } from "../../components/chat/MessageBubble";

type ChatScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Chat">;
  route: RouteProp<RootStackParamList, "Chat">;
};

export const ChatScreen: React.FC<ChatScreenProps> = ({
  navigation,
  route,
}) => {
  const { contactId, contactName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({ title: contactName });
    loadChatHistory();

    const handleMessageReceived = (message: Message) => {
      if (message.sender === contactId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    bluetoothService.on("messageReceived", handleMessageReceived);

    return () => {
      bluetoothService.off("messageReceived", handleMessageReceived);
    };
  }, [contactId, contactName, navigation]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const loadChatHistory = async () => {
    const history = await messageService.getMessageHistory(contactId);
    setMessages(history);
  };

  const sendTextMessage = async () => {
    if (!inputText.trim()) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      type: "text",
      content: inputText,
      sender: networkService.getDeviceId(),
      recipient: contactId,
      timestamp: Date.now(),
      encrypted: true,
      status: "sending",
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setInputText("");

    try {
      await networkService.sendMessage(contactId, message);
      await messageService.saveMessageHistory(message);
      updateMessageStatus(message.id, "sent");
    } catch (error) {
      updateMessageStatus(message.id, "failed");
    }
  };

  const updateMessageStatus = (
    messageId: string,
    status: Message["status"]
  ) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isOwn={item.sender === networkService.getDeviceId()}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendTextMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
