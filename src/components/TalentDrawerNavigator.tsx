import { createDrawerNavigator } from '@react-navigation/drawer';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TalentDashboard from '../screens/TalentDashboard';
import TopOrganisation from '../screens/OrganizationModules/TopOrganization'
import LatestJobsScreen from '../screens/LatestJobsScreen';
import MasterAgreement from '../screens/OrganizationModules/MasterAgreement';
import StatementOfWork from '../screens/OrganizationModules/StatementOfWork';
import ViewTalentProfileScreen from '../screens/ViewTalentProfileScreen';
import InvoiceScreen from '../screens/InvoiceScreen';

const Drawer = createDrawerNavigator();

export const TalentDrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#fff',
                    width: 240,
                        headerBackTitleVisible: false,
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
                name="Talent Dashboard"
                component={TalentDashboard}
                options={{
                    headerShown: true,
    headerBackTitleVisible: false,
                }}
            />
            <Drawer.Screen
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
            <Drawer.Screen
                name="LatestJobsScreen"
                component={LatestJobsScreen}
                options={{
                    title: 'Latest Jobs ',
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
                name="ViewTalentProfileScreen"
                component={ViewTalentProfileScreen}
                options={{
                    title: 'View Talent Profile ',
                    headerShown: false,
                    headerStyle: { backgroundColor: '#0E3386' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
             <Drawer.Screen
                    name="InvoiceScreen"
                    component={InvoiceScreen}
                    options={{
                      title: 'Invoice Screen',
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