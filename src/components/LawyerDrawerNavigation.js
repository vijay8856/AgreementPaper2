// DrawerNavigator.js
import { createDrawerNavigator } from '@react-navigation/drawer';
import AIResFullReviewScreen from '../screens/AIResFullReviewScreen';
import AIReviewScreen from '../screens/AIResReview';
import HelpScreen from '../screens/HelpScreen';
import AgencyDashboard from '../screens/AgencyDashboard';
import LawyerDashboard from '../screens/LawyerDashboard';
import AICoreAdminScreen from '../screens/AIDraft';
import ESignatureScreen from '../screens/ESignatureScreen';
import InviteResourceScreen from '../screens/InviteResourceScreen';
import LawyerOrgProfile from '../screens/LawyerOrgProfileList';
import SettingsScreen from '../screens/SettingsScreen';
import InviteOrganizationScreen from '../screens/InviteOrganization';

import LawyerDirectoryScreen from '../screens/LawyerNetworkScreen';
import InviteAgencyScreen from '../screens/InviteAgencyScreen';
import InviteLawyerScreen from '../screens/InviteLawyerScreen';
import SupplierAgencyScreen from '../screens/SupplierAgencyScreen';
const Drawer = createDrawerNavigator();

export const LawyerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
        drawerActiveTintColor: '#0E3386',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen
        name="Lawyer Dashboard"
        component={LawyerDashboard}
        options={{ headerShown: true }}
      />

      <Drawer.Screen
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
      <Drawer.Screen
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
      <Drawer.Screen
        name="AIDraft"
        component={AICoreAdminScreen}
        options={{
          title: 'AI-Draft',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Drawer.Screen
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
      <Drawer.Screen
        name="InviteOrganization"
        component={InviteOrganizationScreen}
        options={{
          title: 'Invite Organization',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Drawer.Screen
        name="LawyerOrgProfile"
        component={LawyerOrgProfile}
        options={{
          title: 'Organization Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Drawer.Screen
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
      <Drawer.Screen
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
      <Drawer.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{
          title: 'Help ',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Drawer.Screen
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
      <Drawer.Screen
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
      <Drawer.Screen
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
      <Drawer.Screen
        name="SupplierAgencyScreen"
        component={SupplierAgencyScreen}
        options={{
          title: 'Supplier Agency ',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Drawer.Navigator>
  );
};