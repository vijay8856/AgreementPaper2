// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {View, Text, Button} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/NavigationManager';
import {useLoader} from '../context/LoaderContext';
import {  ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenWidth = Dimensions.get('window').width;



// type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, ''>;

type Props = {
  navigation: "";
};

const HomeScreen: React.FC<Props> = ({}) => {

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
  return (
  <ScrollView style={styles.container}>
     <Text style={styles.welcome}>Welcome,</Text>
     <Text style={styles.username}>{firstName + lastName}</Text>

     <View style={styles.card}>
       <View style={styles.textContainer}>
         <Text style={styles.contractTitle}>Contract Review</Text>
         <Text style={styles.contractSubtitle}>REQUEST A CONTRACT REVIEW</Text>
         <Text style={styles.contractDesc}>
           Protect your legal rights with a contract review with Automated AI Platform. Buying or selling a property can be daunting...
         </Text>
         <TouchableOpacity style={styles.viewButton}>
           <Text style={styles.buttonText}>View conveyancers</Text>
         </TouchableOpacity>
       </View>
       <Image
         source={require('../assets/images/glob.png')} 
         style={styles.image}
         resizeMode="contain"
       />
     </View>
     </ScrollView>

  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    fontWeight: '500',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 24,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1.2,
  },
  contractTitle: {
    fontSize: 18,
    color: '#0E3386',
    fontWeight: '600',
  },
  contractSubtitle: {
    fontSize: 14,
    color: '#6c8e00',
    fontWeight: '700',
    marginVertical: 4,
  },
  contractDesc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: '#0E3386',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    marginLeft: 10,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: (screenWidth - 48) / 2,
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0000ff',
    marginBottom: 6,
  },
  moduleDesc: {
    fontSize: 13,
    color: '#333',
    marginBottom: 10,
  },
  moduleButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 8,
    borderRadius: 6,
  },
});