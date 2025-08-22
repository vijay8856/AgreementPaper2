import { createDrawerNavigator } from '@react-navigation/drawer';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TalentDashboard from '../screens/TalentDashboard';
import SupplierAgencyScreen from '../screens/SupplierAgencyScreen';


const Drawer = createDrawerNavigator();

export const TalentDrawerNavigator = () => {
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
                name="Talent Dashboard"
                component={TalentDashboard}
                options={{
                    headerShown: false,

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