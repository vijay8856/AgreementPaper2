import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ESignatureScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>E-Signature Screen</Text>
    </View>
  );
};

export default ESignatureScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});
