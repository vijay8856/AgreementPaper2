
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from './HomeScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName = '';
      switch (route.name) {
        case 'HomeScreen':
          iconName = 'home-outline';
          break;
     
        default:
          iconName = 'circle'; // fallback icon
      }
      return <Icon name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'gray',
    tabBarInactiveTintColor: '#0E3386',
    headerShown: true,
    headerStyle: {
      backgroundColor: '#0E3386',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  })}
>
  <Tab.Screen
    name="HomeScreen"
    component={HomeScreen}
    options={{ title: 'Home' }}
  />


  
</Tab.Navigator>
  );
};

export default BottomTabs;
