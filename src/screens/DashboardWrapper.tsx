import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './DashboardScreen';
import LawyerNetworkScreen from './LawyerNetworkScreen';
import SupplierAgencyScreen from './SupplierAgencyScreen';
import SettingsScreen from './SettingsScreen';
import InviteAgencyScreen from './InviteAgencyScreen';
import InviteResourceScreen from './InviteResourceScreen';
import AIResFullReviewScreen from './AIResFullReviewScreen';
import AIReviewScreen from './AIResReview';
import ESignatureScreen from './ESignatureScreen';
import InviteLawyerScreen from './InviteLawyerScreen';
import SubscriptionScreen from './SubscriptionScreen';
import HelpScreen from './HelpScreen';

const Stack = createStackNavigator();

const DashboardWrapper = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen
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

  <Stack.Screen
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

<Stack.Screen
  name="LawyerNetwork"
  component={LawyerNetworkScreen}
  options={{
    title: 'Lawyer Network',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
<Stack.Screen
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
<Stack.Screen
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
<Stack.Screen
  name="InviteAgency"
  component={InviteAgencyScreen}
  options={{
    title: 'Invite Agency',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
     <Stack.Screen
  name="InviteResource"
  component={InviteResourceScreen}
  options={{
    title: 'Invite Resource',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
 <Stack.Screen
  name="HelpScreen"
  component={HelpScreen}
  options={{
    title: 'Help Screen',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
<Stack.Screen
  name="InviteLawyer"
  component={InviteLawyerScreen}
  options={{
    title: 'Invite Lawyer',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
<Stack.Screen
  name="SubscriptionPlan"
  component={SubscriptionScreen}
  options={{
    title: 'Subscription Plan',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
  <Stack.Screen
  name="ESignature"
  component={ESignatureScreen}
  options={{
    title: 'E-Signature',
    headerShown: true,
    headerStyle: { backgroundColor: '#0E3386' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>

    </Stack.Navigator>
  );
};

export default DashboardWrapper;
