
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from './HomeScreen';
import AIResFullReviewScreen from './AIResFullReviewScreen';
import ESignatureScreen from './ESignatureScreen';
import AIReviewScreen from './AIResReview';
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
        // case 'AIResFullReview':
        //   iconName = 'file-document-outline';
        //   break;
        //    case 'AIReview':
        //   iconName = 'chip';
        //   break;
        // case 'ESignature':
        //   iconName = 'pen';
        //   break;
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
  {/* <Tab.Screen
    name="AIResFullReview"
    component={AIResFullReviewScreen}
    options={{ title: 'AI-RES Full Review' }}
  />
    <Tab.Screen
    name="AIReview"
    component={AIReviewScreen}
    options={{ title: 'AI-Review' }}
  /> */}
  {/* <Tab.Screen
    name="ESignature"
    component={ESignatureScreen}
    options={{ title: 'E-Signature' }}
  /> */}

  
</Tab.Navigator>
  );
};

export default BottomTabs;
