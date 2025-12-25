// DrawerNavigator.js
import { createDrawerNavigator } from '@react-navigation/drawer';
import AIResFullReviewScreen from '../screens/AIResFullReviewScreen';
import AIReviewScreen from '../screens/AIResReview';
import HelpScreen from '../screens/HelpScreen';
import AgencyDashboard from '../screens/AgencyDashboard';
import AICoreAdminScreen from '../screens/AIDraft';
import ESignatureScreen from '../screens/ESignatureScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MasterAgreement from '../screens/OrganizationModules/MasterAgreement';
import StatementOfWork from '../screens/OrganizationModules/StatementOfWork';
import ApprovalScreen from '../screens/OrganizationModules/ApprovalScreen';
import JobPostScreen from '../screens/JobPostScreen'
import TalentProfileList from '../screens/TalentProfileList'

// Import other screens you want in the drawer

const Drawer = createDrawerNavigator();

export const AgencyDrawerNavigator = () => {
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
        name="Agency Dashboard"
        component={AgencyDashboard}
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
        name="MasterAgreement"
        component={MasterAgreement}
        options={{
          title: 'Master Service Agreement (MSA)',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Drawer.Screen
        name="StatementOfWork"
        component={StatementOfWork}
        options={{
          title: 'Statement Of Work (SOW)',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
         <Drawer.Screen
        name="JobPostScreen"
        component={JobPostScreen}
        options={{
          title: 'Job Post',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
  <Drawer.Screen
        name="TalentProfileList"
        component={TalentProfileList}
        options={{
          title: 'Talent Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      
      <Drawer.Screen
        name="ApprovalScreen"
        component={ApprovalScreen}
        options={{
          title: 'Approval',
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

    </Drawer.Navigator>
  );
};