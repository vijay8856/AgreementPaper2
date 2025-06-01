
import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AIResFullReviewScreen from './AIResFullReviewScreen';
import SupplierAgencyScreen from './SupplierAgencyScreen';
import LawyerNetworkScreen from './LawyerNetworkScreen';
import SettingsScreen from './SettingsScreen';
import ESignatureScreen from './ESignatureScreen';
import HomeScreen from './HomeScreen';

const Tab = createBottomTabNavigator();

const DashboardScreen = ({ navigation, route }: any) => {


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'HomeScreen':
              iconName = 'home-outline';
              break;
            case 'AIResFullReview':
              iconName = 'file-document-outline';
              break;
            case 'SupplierAgency':
              iconName = 'account-group-outline';
              break;
            case 'LawyerNetwork':
              iconName = 'gavel';
              break;
            case 'Settings':
              iconName = 'cog-outline';
              break;
            case 'ESignature':
              iconName = 'pen';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'gray',
        tabBarInactiveTintColor: '#0E3386',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="AIResFullReview" component={AIResFullReviewScreen} />
      <Tab.Screen name="SupplierAgency" component={SupplierAgencyScreen} />
      <Tab.Screen name="LawyerNetwork" component={LawyerNetworkScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="ESignature" component={ESignatureScreen} />
    </Tab.Navigator>
  );
};

export default DashboardScreen;
