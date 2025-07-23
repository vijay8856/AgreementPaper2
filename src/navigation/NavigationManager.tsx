
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/Login';
import DashboardWrapper from '../screens/DashboardWrapper';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import MyProfile from '../screens/MyProfile';
import SignWebViewScreen from '../screens/SignWebViewScreen';
import ESignatureScreen from '../screens/ESignatureScreen';
import WebViewScreen from '../components/WebViewScreen';
import LinkedInLoginScreen from '../screens/LinkedInLoginScreen';
import SubscriptionHistoryScreen from '../screens/SubscriptionHistoryScreen';
import HelpScreen from '../screens/HelpScreen';

const RootStack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  AuthLoading: undefined;
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
  Dashboard: undefined;
  MyProfile: undefined;
  SignWebViewScreen: { url: string };
  ESignatureScreen: undefined
  WebViewScreen: { url: string };
  LinkedInLoginScreen: undefined;
  SubscriptionHistoryScreen: undefined,
  HelpScreen:undefined,
};

const NavigationManager = () => {
  return (
    <>
      <StatusBar backgroundColor="#0E3386" barStyle="light-content" />
      {/* <RootStack.Navigator
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
      > */}
      <RootStack.Navigator
        initialRouteName="AuthLoading"
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

        <RootStack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <RootStack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ title: 'Verify Email' }} />
        <RootStack.Screen name="MyProfile" component={MyProfile} options={{ title: 'My Profile' }} />
        <RootStack.Screen name="ESignatureScreen" component={ESignatureScreen} />

        <RootStack.Screen name="SignWebViewScreen" component={SignWebViewScreen} />
        <RootStack.Screen name="LinkedInLoginScreen" component={LinkedInLoginScreen} />
        <RootStack.Screen name="SubscriptionHistoryScreen" component={SubscriptionHistoryScreen} options={{ title: 'Subscription History ' }} />
        <RootStack.Screen name="HelpScreen" component={HelpScreen} options={{ title: 'Help Screen ' }} />



        <RootStack.Screen
          name="Dashboard"
          component={DashboardWrapper}
          options={{ headerShown: false }}

        />

        <RootStack.Screen name="WebViewScreen" component={WebViewScreen} />
      </RootStack.Navigator>
    </>
  );
};

export default NavigationManager;
