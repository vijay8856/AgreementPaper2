
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Checkbox from '../components/CommanCheckbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

import { CommonActions } from '@react-navigation/native';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width } = Dimensions.get('window');



const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);



useEffect(() => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
}, []);
  const handleSignup = () => {

    navigation.navigate('SignUp');
  };



const handleLogin = async (loginType: 'google' | 'email') => {
  try {
    setLoading(true);

    // -------- Google Login flow ----------
    if (loginType === 'google') {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      const accessToken = tokens?.accessToken;
      const idToken = tokens?.idToken;
console.log("accessToken",accessToken);
console.log("tokens",tokens);

console.log("userInfo",userInfo);

      if (!accessToken) {
        await GoogleSignin.signOut();
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Google Login Failed',
          text2: 'No access token received. Please try again.',
          position: 'top',
        });
        return;
      }

      // Send access token to backend for login
      let tokenResult = await Services.googleSignup(accessToken);
console.log("tokenResult tokenResult",tokenResult);


if (!tokenResult.success) {
  setLoading(false);
  Toast.show({
    type: 'error',
    text1: 'Google Auth Failed',
    text2: tokenResult.error || 'Could not authenticate with Google',
    position: 'top',
  });
  return;
}



      const user = tokenResult?.data?.user;

      await AsyncStorage.setItem('first_Name', user?.first_name || '');
      await AsyncStorage.setItem('last_Name', user?.last_name || '');
      await AsyncStorage.setItem('email', user?.email || '');
      await AsyncStorage.setItem('profilePic', user?.profile?.logo || '');
      await AsyncStorage.setItem('Token', tokenResult.data?.key || '');
      await AsyncStorage.setItem('hasLoggedIn', 'true');

      Toast.show({
        type: 'success',
        text1: 'Login successful!',
        position: 'top',
      });

      setTimeout(() => {
        setLoading(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          })
        );
      }, 1000);
    }

    // -------- Email Login flow ----------
    else if (loginType === 'email') {
      if (!email || !password) {
        Toast.show({
          type: 'error',
          text1: 'Missing Input',
          text2: 'Please enter both email and password.',
        });
        setLoading(false);
        return;
      }

      if (!agreeTerms) {
        Toast.show({
          type: 'error',
          text1: 'Terms Not Accepted',
          text2: 'You must agree to the terms and conditions.',
        });
        setLoading(false);
        return;
      }

      const result = await Services.login(email, password);

      if (result.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Login successful!',
          position: 'top',
        });

        await AsyncStorage.setItem('Token', result.data?.key || '');
        await AsyncStorage.setItem('first_Name', result?.data?.data?.first_name || '');
        await AsyncStorage.setItem('last_Name', result.data?.data?.last_name || '');
        await AsyncStorage.setItem('email', result.data?.data?.email || '');
        await AsyncStorage.setItem('hasLoggedIn', 'true');

        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Dashboard');
        }, 1000);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: result.error?.message || 'Invalid credentials',
          position: 'top',
        });
      }
    }
  } catch (err: any) {
    setLoading(false);
    const errorMessage = err?.message || 'Something went wrong during login';
    const errorCode = err?.code || 'No code';
    const fullError = JSON.stringify(err, null, 2);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: `${errorCode}: ${errorMessage}`,
    });

    console.log('🛑 Google login failed:');
    console.log('➡️ Code:', errorCode);
    console.log('➡️ Message:', errorMessage);
    console.log('➡️ Full Error:', fullError);
  }
};


  const renderSocialButtons = () => (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => handleLogin('google')}
        disabled={loading}
      >
        <Image
          source={require('../assets/images/search.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Login Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require('../assets/images/linkedin.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Login LinkedIn</Text>
      </TouchableOpacity>
    </View>

  );


  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Image
            source={require('../assets/images/a200.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tag}>Contract Management Made Smarter</Text>
          <Text style={styles.baseTag}>
            Easy-to-use Contracts, SOWs, approval flows, Supplier Timesheets
            payments, and more — plus an average savings of 10%
          </Text>

          {/* Social Login Buttons - Top */}
          {renderSocialButtons()}

          {/* OR separator */}
          <Text style={styles.orText}>Or</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.signupbox}>
            <Text style={styles.signup}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.link} >Sign up</Text>
            </TouchableOpacity>
          </View>





          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password</Text>
          </TouchableOpacity>


        </ScrollView>
        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={agreeTerms}
              onValueChange={setAgreeTerms}
            />

          </View>
          <Text style={styles.termsText}>
            <Text style={styles.termsLabel}>By creating your account, you agree to our </Text>
            <TouchableOpacity style={styles.settingsItem} onPress={() => Linking.openURL('https://agreementpaper.com/termsCondition')}>
              <Text style={styles.settingsText}>Terms and Conditions &</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem2}
              onPress={() => Linking.openURL('https://agreementpaper.com/legal')}
            >
              <Text style={styles.settingsText2}>{' '}Privacy Policy</Text>
            </TouchableOpacity>
          </Text>
        </View>
        {/* Fixed Login Button */}


        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={() => handleLogin('email')}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingVertical: 30,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  logo: {
    marginHorizontal: 30,
    width: width * 0.7,
    height: width * 0.2,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#323293',
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 52,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  baseTag: {
    fontSize: 12,
    marginBottom: 40,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 0.48,
    justifyContent: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#888',
    fontSize: 14,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  fixedButtonContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000078',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  signup: {
    color: '#666',
    textAlign: 'left',
    marginTop: 8,
  },
  signupbox: {
    display: 'flex',
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 5
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
  },
  checkboxRow: {
    flexDirection: "column",

  },
  termsLabel: {
    fontSize: 14,
    color: '#333',
  },
  termsText: {
    marginLeft: 30,
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#000078',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  disabledButton: {
    backgroundColor: '#aaa',
    opacity: 0.7,
  },
  settingsItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#000078',
  },
  settingsItem2: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#000078',
  },
  settingsText: {
    fontSize: 14,
    color: '#000078',
  },
  settingsText2: {

    fontSize: 14,
    color: '#000078',
  },
});

export default LoginScreen;
