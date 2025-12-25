// src/screens/CrispChatScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CrispChat from 'react-native-crisp-chat-sdk';

const CrispChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <CrispChat />
    </View>
  );
};

export default CrispChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
