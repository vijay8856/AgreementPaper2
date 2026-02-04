// // DrawerNavigator.js
import {createDrawerNavigator} from '@react-navigation/drawer';
import OrganisationDashboard from '../screens/OrganisationDashboard';
import AIResFullReviewScreen from '../screens/AIResFullReviewScreen';
import AIReviewScreen from '../screens/AIResReview';
import HelpScreen from '../screens/HelpScreen';
import AICoreAdminScreen from '../screens/AIDraft';
import ESignatureScreen from '../screens/ESignatureScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SupplierAgencyScreen from '../screens/SupplierAgencyScreen';
import MasterAgreement from '../screens/OrganizationModules/MasterAgreement';
import ApprovalScreen from '../screens/OrganizationModules/ApprovalScreen';
import StatementOfWork from '../screens/OrganizationModules/StatementOfWork';
import TimeSheetScreen from '../screens/OrganizationModules/TimeSheet';
import AgencySupplierMasterdata from '../screens/Common/MasterData/AgencySupplierMasterdata';
import PostNewJobScreen from '../screens/OrganizationModules/JobListScreen';
import JobListScreen from '../screens/OrganizationModules/JobListScreen';
import InviteAgencyScreen from '../screens/InviteAgencyScreen';
import InviteResourceScreen from '../screens/InviteResourceScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import TaxGroupScreen from '../screens/Common/MasterData/TaxGroupScreen';
import CustomDrawerContent from './CustomDrawerContent';
import EditJobScreen from '../screens/EditJobScreen';
// Import other screens you want in the drawer

const Drawer = createDrawerNavigator();

export const OrganisationDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
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
      }}>
      <Drawer.Screen
        name="OrganisationDashboard"
        component={OrganisationDashboard}
        options={{headerShown: true}}
      />
      <Drawer.Screen
        name="MasterAgreement"
        component={MasterAgreement}
        options={{
          title: 'Master Service Agreement (MSA)',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="StatementOfWork"
        component={StatementOfWork}
        options={{
          title: 'Statement Of Work (SOW)',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="ApprovalScreen"
        component={ApprovalScreen}
        options={{
          title: 'Approval',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="TimeSheet"
        component={TimeSheetScreen}
        options={{
          title: 'Time Sheet',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
    
        <Drawer.Screen
        name="EditJobScreen"
        component={EditJobScreen}
        options={{
          title: 'Edit Job',

        }}
      />
      <Drawer.Screen
        name="AIResFullReview"
        component={AIResFullReviewScreen}
        options={{
          title: 'AI-RES Full Review',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="AIReview"
        component={AIReviewScreen}
        options={{
          title: 'AI-Review',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="AIDraft"
        component={AICoreAdminScreen}
        options={{
          title: 'AI-Draft',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      {/* <Drawer.Screen
        name="TaxGroupScreen "
        component={TaxGroupScreen
        }
        options={{
          title: 'Tax Group ',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      /> */}

      <Drawer.Screen
        name="SupplierAgencyScreen"
        component={SupplierAgencyScreen}
        options={{
          title: 'Supplier / Agency',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="ESignature"
        component={ESignatureScreen}
        options={{
          title: 'E-Signature',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="InviteAgency"
        component={InviteAgencyScreen}
        options={{
          title: 'Invite Agency',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="InviteResource"
        component={InviteResourceScreen}
        options={{
          title: 'Invite Resource',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="InvoiceScreen"
        component={InvoiceScreen}
        options={{
          title: 'Invoice Screen',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
      {/* <Drawer.Screen
        name="AgencySupplierMasterdata"
        component={AgencySupplierMasterdata}
        options={{
          title: 'Agency/Supplier Masterdata',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      /> */}
      <Drawer.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{
          title: 'Help ',
          headerShown: true,
          headerStyle: {backgroundColor: '#0E3386'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
    </Drawer.Navigator>
  );
};
