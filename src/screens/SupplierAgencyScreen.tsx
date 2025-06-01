import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SupplierAgencyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Supplier & Agency Screen</Text>
    </View>
  );
};

export default SupplierAgencyScreen;

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
