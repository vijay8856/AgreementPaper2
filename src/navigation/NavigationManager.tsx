
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/Login';
import DashboardWrapper from '../screens/DashboardWrapper';

const RootStack = createStackNavigator();

const screenTitles: Record<string, string> = {
  AIResFullReview: 'AI-RES Full Review',
  ESignature: 'E-Signature',
  LawyerNetwork: 'Lawyer Network',
  SupplierAgency: 'Supplier & Agency',
  Settings: 'Settings',
};

const NavigationManager = () => {
  return (
    <>
      <StatusBar backgroundColor="#0E3386" barStyle="light-content" />
      <RootStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0E3386',
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'android' ? 60 : undefined,
          },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'left',
        }}
      >
        <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        <RootStack.Screen
          name="Dashboard"
          component={DashboardWrapper}
          options={{ headerShown: false }} 
      
        />
      </RootStack.Navigator>
    </>
  );
};

export default NavigationManager;
