
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../navigation/NavigationManager';

type AuthLoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthLoading'>;

const AuthLoadingScreen = () => {
  const navigation = useNavigation<AuthLoadingScreenNavigationProp>();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('Token');
      const idToken = await AsyncStorage.getItem('idToken');
      const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn'); // <-- new

      if (token || idToken) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          })
        );
      } else {
        if (hasLoggedIn === 'true') {
          Toast.show({
            type: 'error',
            text1: 'Session Expired',
            text2: 'Please login again.',
            position: 'top',
          });
        }

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    };

    checkToken();
  }, []);


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0E3386" />
    </View>
  );
};

export default AuthLoadingScreen;
