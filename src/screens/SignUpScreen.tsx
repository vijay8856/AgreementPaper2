import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Services from '../Services/services';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';


const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setpassword2] = useState('');
  const [error, setError] = useState('');

const handleSignUp = async () => {
  if (password1 !== password2) {
    setError("Passwords don't match");
    return;
  }

  const payload = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password1,
    password2:password2,
    user_type:"INDIVIDUAL_USER"
  };

  try {
    const result = await Services.signUp(payload);

    if (result.success) {
       (navigation as any).navigate('VerifyEmail');
    } else {
      console.log('Sign-up failed:', result.error);
      setError(result.error?.message || 'Registration failed. Please try again.');
    }
  } catch (e) {
    console.log('Unexpected error:', e);
    setError('Something went wrong. Please try again later.');
  }
};

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
  <View style={styles.SignupIconContainer}>
  <Image
    source={require('../assets/images/IndividualSignup.png')}
    style={styles.SignupIcon}
  />
</View>
      
      <Text style={styles.header}>Register As Individual Buyer</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input1, { marginRight: 20 }]}
          placeholder="Enter first name *"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input1}
          placeholder="Enter last name *"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter email address *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password *"
        value={password1}
        onChangeText={setPassword1}
        secureTextEntry
      />

      <TextInput
        style={[styles.input, error ? styles.errorInput : null]}
        placeholder="Enter confirm password *"
        value={password2}
        onChangeText={setpassword2}
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Register As Individual Buyer</Text>
      </TouchableOpacity>

      <View style={styles.loginBox}>
        <Text style={styles.signup}>Already have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.link}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    marginTop: 20,
  },
    SignupIconContainer: {
    width: '100%', 
    alignItems: 'center', 
  },
  SignupIcon: {
    width: 300,
    height: 200,
   
  },

  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input1:{
width:160,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  input: {
    marginBottom: 15,

    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#000078',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signup: {
    color: '#333',
    fontSize: 14,
  },
  link: {
    color: '#000078',
    fontWeight: '600',
    fontSize: 14,
  },
});
