import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const VoiceCallScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Voice Call Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
