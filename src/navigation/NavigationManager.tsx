
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
import MSADetailsScreen from '../screens/OrganizationModules/MSADetailScreen';
import MSADetailScreen from '../screens/OrganizationModules/MSADetailScreen';
import CreateMSA from '../screens/CreateMSA';
import ApproverModal from '../components/Modals/ApproverModal';
import SOWDetailScreen from '../screens/OrganizationModules/SOWDetailScreen';
import CreateSOW from '../screens/CreateSOW';
import CreateServiceSow from '../screens/OrganizationModules/CreateServiceSow';
import SOWServiceDetailScreen from '../screens/OrganizationModules/SOWServiceDetailScreen';
import SignWellEmbed from '../screens/SignWellEmbed';
import AllIndividualScreen from '../screens/AllIndividualScreen';
import LawyerDashboard from '../screens/LawyerDashboard';
import AIResFullReviewScreen from '../screens/AIResFullReviewScreen';
import AIReviewScreen from '../screens/AIResReview';
import LawyerDirectoryScreen from '../screens/LawyerNetworkScreen';
import InviteLawyerScreen from '../screens/InviteLawyerScreen';
import InviteAgencyScreen from '../screens/InviteAgencyScreen';
import SupplierAgencyScreen from '../screens/SupplierAgencyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import InviteResourceScreen from '../screens/InviteResourceScreen';

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
  MSADetailScreen: { data: any };
  CreateMSA: undefined,
  ApproverModal: undefined,
  SOWDetailScreen: undefined,
  CreateSOW: undefined,
  CreateServiceSow: undefined,
  SOWServiceDetailScreen: undefined,
  SignWellEmbed: undefined,
  ESignature: undefined,
  AllResourcesScreen: undefined,
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
        <RootStack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{
            headerTitle: "My Profile",
            headerShown: true,
          }}
        />

        {/* <RootStack.Screen name="ESignatureScreen" component={ESignatureScreen} /> */}
        <RootStack.Screen name="SignWebViewScreen" component={SignWebViewScreen} />
        <RootStack.Screen name="LinkedInLoginScreen" component={LinkedInLoginScreen} />
        <RootStack.Screen name="SubscriptionHistoryScreen" component={SubscriptionHistoryScreen} options={{ title: 'Subscription History ' }} />
        <RootStack.Screen name="HelpScreen" component={HelpScreen} options={{ title: 'Help Screen ' }} />
        <RootStack.Screen name="SignWellEmbed" component={SignWellEmbed} options={{ title: 'SignWellEmbed  ' }} />
        <RootStack.Screen name="ESignature" component={ESignatureScreen} options={{ title: 'ESignature  ' }} />

        <RootStack.Screen name="AIDraft" component={AICoreAdminScreen} options={{ title: 'AI Draft ' }} />
        <RootStack.Screen name="ContractPreviewScreen" component={ContractPreviewScreen} options={{ title: 'Contract Preview ' }} />
        <RootStack.Screen name="LawyerOrgProfile" component={LawyerOrgProfile} options={{ title: 'Lawyer Profile' }} />
        <RootStack.Screen name="InviteOrganization" component={InviteOrganizationScreen} options={{ title: 'Invite Organization' }} />
        <RootStack.Screen name="MSADetailScreen" component={MSADetailScreen} options={{ title: 'MSA Details Screen' }} />

        <RootStack.Screen name="CreateMSA" component={CreateMSA} options={{ title: 'Create MSA ' }} />
        <RootStack.Screen name="CreateSOW" component={CreateSOW} options={{ title: 'Create SOW ' }} />
        <RootStack.Screen name="CreateServiceSow" component={CreateServiceSow} options={{ title: 'Create Service Sow ' }} />


        <RootStack.Screen name="ApproverModal" component={ApproverModal} options={{ title: 'Approver Modal ' }} />
        <RootStack.Screen name="AllResourcesScreen" component={AllIndividualScreen} options={{ title: 'AllResourcesScreen ' }} />


        <RootStack.Screen name="SOWDetailScreen" component={SOWDetailScreen} options={{ title: 'SOW Detail Screen' }} />
        <RootStack.Screen name="SOWServiceDetailScreen" component={SOWServiceDetailScreen} options={{ title: 'SOW Service Detail Screen' }} />

        <RootStack.Screen
          name="AIResFullReview"
          component={AIResFullReviewScreen}
          options={{
            title: 'AI-RES Full Review',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="AIReview"
          component={AIReviewScreen}
          options={{
            title: 'AI-Review',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="LawyerNetwork"
          component={LawyerDirectoryScreen}
          options={{
            title: 'Lawyer Network ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="InviteLawyer"
          component={InviteLawyerScreen}
          options={{
            title: 'Invite Lawyer ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="InviteAgency"
          component={InviteAgencyScreen}
          options={{
            title: 'Invite Agency ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="SupplierAgency"
          component={SupplierAgencyScreen}
          options={{
            title: 'Supplier Agency ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="InviteResource"
          component={InviteResourceScreen}
          options={{
            title: 'Invite Individual',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
     
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
          component={LawyerDashboard}
          options={{
            headerShown: true,
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
