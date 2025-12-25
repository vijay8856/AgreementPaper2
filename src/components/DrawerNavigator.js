// // DrawerNavigator.js
import { createDrawerNavigator } from '@react-navigation/drawer';
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
import PostNewJobScreen from '../screens/OrganizationModules/JobListScreen'
import JobListScreen from '../screens/OrganizationModules/JobListScreen';
import InviteAgencyScreen from '../screens/InviteAgencyScreen';
import InviteResourceScreen from '../screens/InviteResourceScreen';
// Import other screens you want in the drawer

const Drawer = createDrawerNavigator();

export const OrganisationDrawer = () => {
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
        name="OrganisationDashboard"
        component={OrganisationDashboard}
        options={{ headerShown: true }}
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
        name="TimeSheet"
        component={TimeSheetScreen}
        options={{
          title: 'Time Sheet',
          headerShown: true,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
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
        name="JobListScreen "
        component={JobListScreen
        }
        options={{
          title: 'Job List ',
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
          title: 'Supplier / Agency',
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
        name="AgencySupplierMasterdata"
        component={AgencySupplierMasterdata}
        options={{
          title: 'Agency/Supplier Masterdata',
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


// DrawerNavigator.js
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import OrganisationDashboard from '../screens/OrganisationDashboard';
// import AIResFullReviewScreen from '../screens/AIResFullReviewScreen';
// import AIReviewScreen from '../screens/AIResReview';
// import AICoreAdminScreen from '../screens/AIDraft';
// import HelpScreen from '../screens/HelpScreen';
// import ESignatureScreen from '../screens/ESignatureScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import SupplierAgencyScreen from '../screens/SupplierAgencyScreen';

// const Drawer = createDrawerNavigator();

// // 👇 Custom Drawer
// function CustomDrawerContent(props) {
//   const [aiGroupOpen, setAiGroupOpen] = useState(false);

//   return (
//     <DrawerContentScrollView {...props}>
//       <TouchableOpacity onPress={() => props.navigation.navigate("OrganisationDashboard")}>
//         <Text style={{ padding: 15 }}>Organisation Dashboard</Text>
//       </TouchableOpacity>

//       {/* Collapsible AI-Group */}
//       <TouchableOpacity onPress={() => setAiGroupOpen(!aiGroupOpen)}>
//         <Text style={{ padding: 15, fontWeight: "bold" }}>
//           {aiGroupOpen ? "▼" : "▶"} AI-Group
//         </Text>
//       </TouchableOpacity>
//       {aiGroupOpen && (
//         <View style={{ paddingLeft: 20 }}>
//           <TouchableOpacity onPress={() => props.navigation.navigate("AIResFullReview")}>
//             <Text style={{ padding: 10 }}>AI-RES Full Review</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => props.navigation.navigate("AIReview")}>
//             <Text style={{ padding: 10 }}>AI-Review</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => props.navigation.navigate("AIDraft")}>
//             <Text style={{ padding: 10 }}>AI-Draft</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <TouchableOpacity onPress={() => props.navigation.navigate("SupplierAgencyScreen")}>
//         <Text style={{ padding: 15 }}>Supplier / Agency</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => props.navigation.navigate("ESignature")}>
//         <Text style={{ padding: 15 }}>E-Signature</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
//         <Text style={{ padding: 15 }}>Settings</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => props.navigation.navigate("HelpScreen")}>
//         <Text style={{ padding: 15 }}>Help</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// }

// export const OrganisationDrawer = () => {
//   return (
//     <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
//       <Drawer.Screen name="OrganisationDashboard" component={OrganisationDashboard} options={{ headerShown: false }} />
//       <Drawer.Screen name="AIResFullReview" component={AIResFullReviewScreen} options={{ headerShown: false }} />
//       <Drawer.Screen name="AIReview" component={AIReviewScreen} options={{ headerShown: false }} />
//       <Drawer.Screen name="AIDraft" component={AICoreAdminScreen} options={{ headerShown: false }} />
//       <Drawer.Screen name="SupplierAgencyScreen" component={SupplierAgencyScreen} options={{ headerShown: false }} />
//       <Drawer.Screen name="ESignature" component={ESignatureScreen} options={{ headerShown: false }} />
//       <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
//       <Drawer.Screen name="HelpScreen" component={HelpScreen} options={{ headerShown: false }} />
//     </Drawer.Navigator>
//   );
// };
