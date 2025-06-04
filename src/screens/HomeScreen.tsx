
import React, { useEffect, useState } from 'react';
 import {StackNavigationProp} from '@react-navigation/stack';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList, DashboardTabParamList } from '../navigation/types';


const screenWidth = Dimensions.get('window').width;

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'HomeScreen'>,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fName = await AsyncStorage.getItem('first_name');
        const lName = await AsyncStorage.getItem('last_name');
        if (fName) setFirstName(fName);
        if (lName) setLastName(lName);
      } catch (e) {
        console.log('Error fetching user data:', e);
      }
    };

    fetchUserData();
  }, []);

  // Grid items configuration
  const gridItems = [
    {
      id: 1,
      icon: 'file-document-outline',
      label: 'AI-Full Review',
      screen: 'AIResFullReview',
    },
    {
      id: 2,
      icon: 'chip',
      label: 'AI-Review',
      screen: 'AIReview',
    },
    {
      id: 3,
      icon: 'account-tie',
      label: 'Suppliers',
      screen: 'SupplierAgency',
    },
    {
      id: 4,
      icon: 'cog-outline',
      label: 'Settings',
      screen: 'Settings',
    },
    {
      id: 5,
      icon: 'scale-balance',
      label: 'Lawyers',
      screen: 'LawyerNetwork',
    },
    {
      id: 6,
      icon: 'briefcase-plus',
      label: 'Invite Agency',
      screen: 'InviteAgency',
    },
    {
      id: 7,
      icon: 'account-plus',
      label: 'Invite Resource',
      screen: 'InviteResource',
    },
    {
      id: 8,
      icon: 'pen',
      label: 'E-Signature',
      screen: 'ESignature',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.username}>{firstName} {lastName}</Text>
        </View>
      </View>

      {/* Feature Card */}
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.contractTitle}>Contract Review</Text>
          <Text style={styles.contractSubtitle}>REQUEST A CONTRACT REVIEW</Text>
          <Text style={styles.contractDesc}>
            Protect your legal rights with a contract review with Automated AI Platform. 
            Buying or selling a property can be daunting...
          </Text>
          <TouchableOpacity 
            style={styles.viewButton} 
            onPress={() => navigation.navigate('LawyerNetwork')}
          >
            <Text style={styles.buttonText}>View conveyancers</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/glob.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Grid Title */}
      
      {/* 4x2 Grid */}
      <View style={styles.gridContainer}>
        {gridItems.map((item:any) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.gridItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconContainer}>
              <Icon name={item.icon} size={32} color="#0E3386" />
            </View>
            <Text style={styles.gridItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E3386',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f5ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  contractTitle: {
    fontSize: 18,
    color: '#0E3386',
    fontWeight: '600',
    marginBottom: 4,
  },
  contractSubtitle: {
    fontSize: 14,
    color: '#6c8e00',
    fontWeight: '700',
    marginBottom: 8,
  },
  contractDesc: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    lineHeight: 20,
  },
  viewButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  image: {
    width: 100,
    height: 100,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (screenWidth - 48) / 4, // 16px padding * 2 + 16px spacing
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridItemText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0E3386',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;