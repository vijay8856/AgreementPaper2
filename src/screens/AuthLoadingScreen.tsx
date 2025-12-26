
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import type { StackNavigationProp } from '@react-navigation/stack';
import { refreshSubscriptionStatus } from '../utils/ubscriptionHelper';

// Define your root navigation routes
export type RootStackParamList = {
  AuthLoading: undefined;
  Login: undefined; 
  Dashboard: undefined;
  OrganisationDrawer: undefined;
  AgencyDashboard: undefined;
  TalentDashboard: undefined;
  LawyerDashboard: undefined;
};

// Define navigation prop type for this screen
type AuthLoadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AuthLoading'
>;

const AuthLoadingScreen: React.FC = () => {
  const navigation = useNavigation<AuthLoadingScreenNavigationProp>();
useEffect(() => {
  refreshSubscriptionStatus(); // ⬅️ Runs on first load
}, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('Token');
      const idToken = await AsyncStorage.getItem('idToken');
      const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
      const userType = await AsyncStorage.getItem('userType');

      if (token || idToken) {
        // ✅ Choose dashboard based on userType
        let dashboardRoute: keyof RootStackParamList = 'Dashboard';
        if (userType === 'ORGANISATION_USER') dashboardRoute = 'OrganisationDrawer';
        else if (userType === 'AGENCY_USER') dashboardRoute = 'AgencyDashboard';
        else if (userType === 'RESOURCE_USER') dashboardRoute = 'TalentDashboard';
        else if (userType === 'INDIVIDUAL_USER') dashboardRoute = 'Dashboard';
        else if (userType === 'LAWYER_USER') dashboardRoute = 'LawyerDashboard';

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: dashboardRoute }],
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
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0E3386" />
    </View>
  );
};

export default AuthLoadingScreen;
