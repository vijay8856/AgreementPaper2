
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
import SubscriptionScreen from '../screens/SubscriptionScreen';
import PostNewJobScreen from '../screens/OrganizationModules/PostNewJob';
import TopOrganisation from '../screens/OrganizationModules/TopOrganization';
import JobDetailScreen from '../screens/JobDetailScreen';
import CompanySetupScreen from '../screens/CompanySetupScreen';
import OrganisationDetailScreen from '../screens/OrganisationDetailScreen'
// import CrispChatScreen from '../screens/CrispChatScreen';
import JobListScreen from '../screens/OrganizationModules/JobListScreen';
import LatestJobsScreen from '../screens/LatestJobsScreen';
import FindLawyers from '../screens/FindLawyers';
import LawyerDetails from '../screens/LawyerDetails';
import FindSuppliers from '../screens/FindSuppliers';
import SupplierDetails from '../screens/SupplierDetails';
import JobPostScreen from '../screens/JobPostScreen'
import InvoiceScreen from '../screens/InvoiceScreen';
import TaxGroupScreen from '../screens/Common/MasterData/TaxGroupScreen';
import AgencySupplierMasterdata from '../screens/Common/MasterData/AgencySupplierMasterdata';
import CompanyLocationScreen from '../screens/Common/MasterData/CompanyLocationScreen';
import InviteIndividualBuyer from '../screens/InviteIndividualBuyer';
import GLAccountScreen from '../screens/Common/MasterData/GLAccountScreen';
import BusinessUnitScreen from '../screens/Common/MasterData/BusinessUnitScreen';
import PostedJobsScreen from '../screens/PostedJobsScreen';
import EditJobScreen from '../screens/EditJobScreen';
import CostCenter from '../screens/Common/MasterData/CostCenter';
import MsaType from '../screens/Common/MasterData/MsaType';
import UnpscCode from '../screens/Common/MasterData/UnpscCode';
import TaxRate from '../screens/Common/MasterData/TaxRate';
import PaymentTerms from '../screens/Common/MasterData/PaymentTerms';
import SowTypeScreen from '../screens/Common/MasterData/SowTypeScreen';
import ExpensesCategoryScreen from '../screens/Common/MasterData/ExpensesCategoryScreen';
import IncomeTaxSlabsScreen from '../screens/Common/MasterData/IncomeTaxSlabsScreen';
import MaterialMasterData from '../screens/Common/MasterData/MaterialMasterData';
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

          headerBackTitleVisible: false,
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
            headerBackTitleVisible: false,
          }}
        />

        <RootStack.Screen name="SignWebViewScreen" component={SignWebViewScreen} />
        <RootStack.Screen name="LinkedInLoginScreen" component={LinkedInLoginScreen} />
        <RootStack.Screen name="SubscriptionHistoryScreen" component={SubscriptionHistoryScreen} options={{
          title: 'Subscription History ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="HelpScreen" component={HelpScreen} options={{
          title: 'Help Screen ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="SignWellEmbed" component={SignWellEmbed} options={{
          title: 'SignWellEmbed , ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="ESignature" component={ESignatureScreen} options={{
          title: 'ESignature  ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />

        <RootStack.Screen name="AIDraft" component={AICoreAdminScreen} options={{
          title: 'AI Draft',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="ContractPreviewScreen" component={ContractPreviewScreen} options={{
          title: 'Contract Preview ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="LawyerOrgProfile" component={LawyerOrgProfile} options={{
          title: 'Organization Profile', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="InviteOrganization" component={InviteOrganizationScreen} options={{
          title: 'Invite Organization', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="MSADetailScreen" component={MSADetailScreen} options={{
          title: 'MSA Details Screen', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />

        <RootStack.Screen name="CreateMSA" component={CreateMSA} options={{
          title: 'Create MSA ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="CreateSOW" component={CreateSOW} options={{
          title: 'Create SOW ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="CreateServiceSow" component={CreateServiceSow} options={{
          title: 'Create Service Sow ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />


        <RootStack.Screen name="ApproverModal" component={ApproverModal} options={{
          title: 'Approver Modal ', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="AllResourcesScreen" component={AllIndividualScreen}
          options={{
            title: 'Individual Buyer ', headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }} />


        <RootStack.Screen name="SOWDetailScreen" component={SOWDetailScreen} options={{
          title: 'SOW Detail Screen', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="SOWServiceDetailScreen" component={SOWServiceDetailScreen} options={{
          title: 'SOW Service Detail Screen', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />

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
            title: 'Invite Talent',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="InviteIndividualBuyer"
          component={InviteIndividualBuyer}
          options={{
            title: 'Invite Individual Buyer',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
         <RootStack.Screen
          name="GLAccountScreen"
          component={GLAccountScreen}
          options={{
            title: 'GL Account',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
         <RootStack.Screen
          name="MsaType"
          component={MsaType}
          options={{
            title: 'Msa Type',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
          <RootStack.Screen
          name="UnpscCode"
          component={UnpscCode}
          options={{
            title: 'UnpscCode',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
           <RootStack.Screen
          name="TaxRate"
          component={TaxRate}
          options={{
            title: 'Tax Rate',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="SowTypeScreen"
          component={SowTypeScreen}
          options={{
            title: 'Sow Type ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        
            <RootStack.Screen
          name="PaymentTerms"
          component={PaymentTerms}
          options={{
            title: 'Payment Terms',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="ExpensesCategoryScreen"
          component={ExpensesCategoryScreen}
          options={{
            title: 'Expenses Category',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="MaterialMasterData"
          component={MaterialMasterData}
          options={{
            title: 'Material Master Data',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
          <RootStack.Screen
          name="IncomeTaxSlabsScreen"
          component={IncomeTaxSlabsScreen}
          options={{
            title: 'Income Tax Slabs',
            headerShown: true, 
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        
         <RootStack.Screen
          name="CostCenter"
          component={CostCenter}
          options={{
            title: 'Cost Center',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />

          <RootStack.Screen
          name="BusinessUnitScreen"
          component={BusinessUnitScreen}
          options={{
            title: 'Business Unit',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen name="SubscriptionScreen" component={SubscriptionScreen} options={{
          title: 'Subscription Screen', headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <RootStack.Screen name="TalentDashboard" component={TalentDrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Top Organisation"
          component={TopOrganisation}
          options={{
            title: 'Top Organisation',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="JobDetailScreen"
          component={JobDetailScreen}
          options={{ headerShown: false }}
        />

        <RootStack.Screen
          name="PostNewJobScreen"
          component={PostNewJobScreen
          }
          options={{
            title: 'Post New Job ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="CompanySetupScreen"
          component={CompanySetupScreen
          }
          options={{
            title: 'Edit Company Profile ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <RootStack.Screen
          name="OrganisationDetailScreen"
          component={OrganisationDetailScreen
          }
          options={{
            title: 'Top Organisation Detail  ',
            headerShown: true,
            headerStyle: { backgroundColor: '#0E3386' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
<RootStack.Screen
          name="TaxGroupScreen"
          component={TaxGroupScreen}
          options={{
          title:"Tax Group",

            headerShown: true,
          }}
        />
        <RootStack.Screen
          name="CompanyLocationScreen"
          component={CompanyLocationScreen}
          options={{
          title:"Company Location",

            headerShown: true,
          }}
        />
        <RootStack.Screen
          name="AgencySupplierMasterdata"
          component={AgencySupplierMasterdata}
          options={{
          title:"Agency Supplier Masterdata",

            headerShown: true,
          }}
        />
        {/* <RootStack.Screen
          name="CrispChat"
          component={CrispChatScreen}
          options={{ title: "Live Chat Support" }}
        /> */}

<RootStack.Screen
          name="PostedJobsScreen"
          component={PostedJobsScreen}
          options={{
          title:"Posted Jobs ",

            headerShown: true,
          }}
        />
        <RootStack.Screen
          name="EditJobScreen"
          component={EditJobScreen}
          options={{
          title:"Edit Job ",

          }}
        />
        
        <RootStack.Screen
          name="OrganisationDrawer"
          component={OrganisationDrawer}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="JobListScreen"
          component={JobListScreen}
          options={{
            headerShown: true,
          }}
        />
        <RootStack.Screen
          name="LatestJobsScreen"
          component={LatestJobsScreen}
          options={{
            headerShown: true,
            title: 'Job List',
          }}
        />
        <RootStack.Screen
          name="FindLawyers"
          component={FindLawyers}
          options={{
            headerShown: true,
            title: 'Find Lawyers',
          }}
        />
        <RootStack.Screen

          name="LawyerDetails"
          component={LawyerDetails}
          options={{
            headerShown: true,
            title: 'Lawyer Details',
          }}
        />
        <RootStack.Screen

          name="FindSuppliers"
          component={FindSuppliers}
          options={{
            headerShown: true,
            title: 'Find Suppliers',
          }}
        />
        <RootStack.Screen

          name="SupplierDetails"
          component={SupplierDetails}
          options={{
            headerShown: true,
            title: 'Supplier Details',
          }}
        />
        <RootStack.Screen
          name="AgencyDashboard"
          component={AgencyDrawerNavigator}
          options={{
            headerShown: false,

          }}
        />

        <RootStack.Screen
          name="JobPostScreen"
          component={JobPostScreen}
          options={{
            headerShown: false,
          }}
        />

        <RootStack.Screen
          name="LawyerDashboard"
          component={LawyerDashboard}
          options={{
            headerShown: Platform.OS === 'android',
          }}

        />
        <RootStack.Screen
          name="InvoiceScreen"
          component={InvoiceScreen}
          options={{
            headerShown: true,
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
