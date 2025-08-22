
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar, TouchableOpacity, } from 'react-native';
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
import AIDraft from '../screens/AIDraft';
import ContractPreviewScreen from '../screens/ContractPreviewScreen';
import AICoreAdminScreen from '../screens/AIDraft';
import OrganisationDashboard from '../screens/OrganisationDashboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AgencyDashboard from '../screens/AgencyDashboard';
import { OrganisationDrawer } from '../components/DrawerNavigator';
import { AgencyDrawerNavigator } from '../components/AgencyDrawerNavigator';
import { LawyerDrawerNavigator } from '../components/LawyerDrawerNavigation';
import LawyerOrgProfile from '../screens/LawyerOrgProfileList';
import InviteOrganizationScreen from '../screens/InviteOrganization';
import TalentDashboard from '../screens/TalentDashboard';
import { TalentDrawerNavigator } from '../components/TalentDrawerNavigator';

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
  HelpScreen: undefined,
  AIDraft: undefined,
  ContractPreviewScreen: { htmlContent: any };
  AICoreAdminScreen: undefined,
  OrganisationDashboard: undefined,
  AgencyDashboard: undefined,
};

const NavigationManager = () => {
  return (
    <>
      <StatusBar backgroundColor="#0E3386" barStyle="light-content" />

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
        {/* <RootStack.Screen name="ESignatureScreen" component={ESignatureScreen} /> */}
        <RootStack.Screen name="SignWebViewScreen" component={SignWebViewScreen} />
        <RootStack.Screen name="LinkedInLoginScreen" component={LinkedInLoginScreen} />
        <RootStack.Screen name="SubscriptionHistoryScreen" component={SubscriptionHistoryScreen} options={{ title: 'Subscription History ' }} />
        <RootStack.Screen name="HelpScreen" component={HelpScreen} options={{ title: 'Help Screen ' }} />
        <RootStack.Screen name="AIDraft" component={AICoreAdminScreen} options={{ title: 'AI Draft ' }} />
        <RootStack.Screen name="ContractPreviewScreen" component={ContractPreviewScreen} options={{ title: 'Contract Preview ' }} />
        <RootStack.Screen name="LawyerOrgProfile" component={LawyerOrgProfile} options={{ title: 'Lawyer Profile' }} />
        <RootStack.Screen name="InviteOrganization" component={InviteOrganizationScreen} options={{ title: 'Invite Organization' }} />

        <RootStack.Screen name="TalentDashboard" component={TalentDrawerNavigator}   
         options={{
            headerShown: false,
            // title: 'Organisation Dashboard',
          }}
        //  options={({ navigation }:any) => ({
        //    title: 'Talent Dashboard',
        //    headerRight: () => (
        //      <TouchableOpacity
        //        onPress={() => navigation.navigate('MyProfile')}
        //        style={{ marginRight: 15 }}
        //      >
        //        <Icon name="account-circle" size={28} color="#fff" />
        //      </TouchableOpacity>
        //    ),
        //  })} 
         
         />



        <RootStack.Screen
          name="OrganisationDashboard"
          component={OrganisationDrawer}
          options={{
            headerShown: false,
            // title: 'Organisation Dashboard',
          }}
        />
        <RootStack.Screen
          name="AgencyDashboard"
          component={AgencyDrawerNavigator}
          options={{
            headerShown: false,
          }}
        // options={({ navigation }) => ({
        //   title: 'Agency Dashboard',
        //   headerRight: () => (
        //     <TouchableOpacity 
        //       onPress={() => navigation.navigate('MyProfile')}
        //       style={{ marginRight: 15 }}
        //     >
        //       <Icon name="account-circle" size={28} color="#fff" />
        //     </TouchableOpacity>
        //   ),
        // })}
        />
        <RootStack.Screen
          name="LawyerDashboard"
          component={LawyerDrawerNavigator}
          options={{
            headerShown: false,
            // title: 'Organisation Dashboard',
          }}
        />
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
