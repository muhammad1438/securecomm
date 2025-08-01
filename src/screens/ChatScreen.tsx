import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { MessageBubble } from "../components/chat/MessageBubble";
import { MessageInput } from "../components/chat/MessageInput";
import { ThemeToggle } from "../components/common/ThemeToggle";

type Screen = 'chat' | 'contacts' | 'network' | 'settings';

interface ChatScreenProps {
  onNavigate?: (screen: Screen) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    {
      message: "Hey, are you free for a quick chat?",
      senderName: "Sarah Miller",
      isOwn: false,
    },
    {
      message: "Yeah, what's up?",
      senderName: "Alex Turner",
      isOwn: true,
    },
    {
      message: "I wanted to discuss the new project proposal. Can we go over it together?",
      senderName: "Sarah Miller",
      isOwn: false,
    },
    {
      message: "Sure, I'm ready. Let's do it.",
      senderName: "Alex Turner",
      isOwn: true,
    },
    {
      message: "Great! I'll send you the document now.",
      senderName: "Sarah Miller",
      isOwn: false,
    },
    {
      message: "Sounds good. Waiting for it.",
      senderName: "Alex Turner",
      isOwn: true,
    },
  ]);

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const headerStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const logoContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const logoStyle: ViewStyle = {
    width: 16,
    height: 16,
    backgroundColor: theme.colors.text,
  };

  const titleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  };

  const navContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  };

  const navLinkStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  };

  const rightHeaderStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const actionButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const avatarStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  };

  const contentContainerStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.xl * 2.5,
    paddingVertical: theme.spacing.md,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  };

  const chatTitleStyle = {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  };

  const handleSendMessage = (message: string) => {
    const newMessage = {
      message,
      senderName: "Alex Turner",
      isOwn: true,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View style={headerStyle}>
        <View style={logoContainerStyle}>
          <View style={logoStyle} />
          <Text style={titleStyle}>SecureComm</Text>
        </View>
        <View style={navContainerStyle}>
          <TouchableOpacity onPress={() => onNavigate?.('chat')}>
            <Text style={[navLinkStyle, { opacity: 1 }]}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('contacts')}>
            <Text style={navLinkStyle}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('network')}>
            <Text style={navLinkStyle}>Network Map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('settings')}>
            <Text style={navLinkStyle}>Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={rightHeaderStyle}>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={actionButtonStyle}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>📹</Text>
          </TouchableOpacity>
          <ThemeToggle />
          <View style={avatarStyle} />
        </View>
      </View>
      
      <View style={contentContainerStyle}>
        <Text style={chatTitleStyle}>Sarah Miller</Text>
        
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg.message}
              senderName={msg.senderName}
              isOwn={msg.isOwn}
            />
          ))}
        </ScrollView>
        
        <MessageInput onSend={handleSendMessage} />
      </View>
    </SafeAreaView>
  );
};
