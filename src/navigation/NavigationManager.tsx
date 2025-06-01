
// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import WelcomeScreen from '../screens/WelcomeScreen';
// import HomeScreen from '../screens/HomeScreen';
// import LoginScreen from '../screens/Login';
// import DashboardScreen from '../screens/DashboardScreen';

// export type RootStackParamList = {
//   Welcome: undefined;
//   Home: undefined;
//   Login: undefined;
//   Dashboard:undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const NavigationManager: React.FC = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Login"
//       screenOptions={{
//         headerStyle: {
//           height:50,
          
//           backgroundColor: '#000078',
//         },
//         headerTintColor: '#fff',
//         headerTitleStyle: {
//           fontWeight: 'bold',
//         },
//         headerTitleAlign: 'left',
//         headerShown: true,
//       }}>
//       <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown: false}} />
//       <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title: 'Dashboard'}} />
//       {/* <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Home'}} /> */}
//       {/* <Stack.Screen name="Welcome" component={WelcomeScreen} options={{title: 'Welcome'}} /> */}
//     </Stack.Navigator>
//   );
// };

// export default NavigationManager;
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Platform, StatusBar } from 'react-native';
// import LoginScreen from '../screens/Login';
// import DashboardScreen from '../screens/DashboardScreen';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
// export type RootStackParamList = {
//   Login: undefined;
//   Dashboard: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const NavigationManager: React.FC = () => {
//   return (
//     <>
//       {/* Add the status bar styling */}
//       <StatusBar
//         backgroundColor="#000078"
//         barStyle="light-content"
//       />
//       <Stack.Navigator
//         initialRouteName="Login"
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#000078',
//             elevation: 0,
//             shadowOpacity: 0,
//             height: Platform.OS === 'android' ? 60 : undefined,
//           },
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//           headerTitleAlign: 'left',
//           headerTintColor: '#fff',
//           headerShown: true,
//         }}>
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//      <Stack.Screen
//   name="Dashboard"
//   component={DashboardScreen}
//   options={({ route }) => {
//     const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';

//     const titles: Record<string, string> = {
//       HomeScreen: 'Dashboard',
//       AIResFullReview: 'AI-RES Full Review',
//       SupplierAgency: 'Supplier & Agency',
//       LawyerNetwork: 'Lawyer Network',
//       Settings: 'Settings',
//       ESignature: 'E-Signature',
//     };

//     return {
//       title: titles[routeName] || 'Dashboard',
//       headerBackTitleVisible: false,
//  headerLeft: () => null,
//     };
//   }}
// />

       
//       </Stack.Navigator>
//     </>
//   );
// };

// export default NavigationManager;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
import LoginScreen from '../screens/Login';
import DashboardScreen from '../screens/DashboardScreen'; // This should be your nested navigator
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


// Define the nested Dashboard stack screens
export type DashboardStackParamList = {
  HomeScreen: undefined;
  AIResFullReview: undefined;
  SupplierAgency: undefined;
  LawyerNetwork: undefined;
  Settings: undefined;
  ESignature: undefined;
};

// Root stack includes Login and Dashboard (which accepts nested params)
export type RootStackParamList = {
  Login: undefined;
  Dashboard: { screen?: keyof DashboardStackParamList } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationManager: React.FC = () => {
  return (
    <>
      <StatusBar backgroundColor="#0E3386" barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0E3386',
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'android' ? 60 : undefined,
          },
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'left',
          headerTintColor: '#fff',
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ route, navigation }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';

            const titles: Record<string, string> = {
              HomeScreen: 'Dashboard',
              AIResFullReview: 'AI-RES Full Review',
              SupplierAgency: 'Supplier & Agency',
              LawyerNetwork: 'Lawyer Network',
              Settings: 'Settings',
              ESignature: 'E-Signature',
            };

            if (routeName === 'HomeScreen') {
              // No back arrow on HomeScreen
              return {
                title: titles[routeName] || 'Dashboard',
                headerBackTitleVisible: false,
                headerLeft: () => null,
              };
            }

            // On other screens, show back arrow which navigates back to HomeScreen
            return {
              title: titles[routeName] || 'Dashboard',
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  style={{ marginLeft: 15 }}
                  onPress={() => navigation.navigate('Dashboard', { screen: 'HomeScreen' })}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              ),
            };
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default NavigationManager;
