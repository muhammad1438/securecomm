
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatScreen } from '../screens/ChatScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { WalkieTalkieScreen } from '../screens/WalkieTalkieScreen';
import { NetworkScreen } from '../screens/NetworkScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { VoiceCallScreen } from '../screens/VoiceCallScreen';


export type RootStackParamList = {
  Main: undefined;
  Chat: { contactId: string };
  VoiceCall: { contactId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Messages: undefined;
  Contacts: undefined;
  WalkieTalkie: undefined;
  Network: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Messages" component={ChatScreen} />
    <Tab.Screen name="Contacts" component={ContactsScreen} />
    <Tab.Screen name="WalkieTalkie" component={WalkieTalkieScreen} />
    <Tab.Screen name="Network" component={NetworkScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="VoiceCall" component={VoiceCallScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
