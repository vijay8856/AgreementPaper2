// components/AppLoader.tsx
import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet} from 'react-native';
import {useLoader} from '../context/LoaderContext';
import {Text} from 'react-native-gesture-handler';

const AppLoader: React.FC = () => {
  const {loading} = useLoader();

  return (
    <Modal transparent visible={loading} animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#000078" />
        <Text>Hyyy Loading...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoader;
