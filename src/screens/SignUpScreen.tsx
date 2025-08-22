
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import Services from '../Services/services';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';
import { useEffect } from 'react';
import { GOOGLE_CLIENT_ID } from '@env';

const SIGNUP_TYPES = [
  { label: 'Enterprise', value: 'ORGANISATION_USER' },
  { label: 'Supplier & Agency Network', value: 'AGENCY_USER' },
  { label: 'Talent', value: 'RESOURCE_USER' },
  { label: 'Individual Buyer', value: 'INDIVIDUAL_USER' },
  { label: 'Lawyer Network', value: 'LAWYER_USER' },
];

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [signupType, setSignupType] = useState<string>(''); // Initially empty, so user must choose
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);

console.log("signupType",signupType);

useEffect(() => {
  GoogleSignin.configure({
    webClientId:GOOGLE_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
}, []);

  const handleSignUp = async () => {
    if (!signupType) {
      setError('Please select a signup type first.');
      return;
    }
    if (password1 !== password2) {
      setError("Passwords don't match");
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password1,
      password2: password2,
      user_type: signupType,
    };

    try {
      const result = await Services.signUp(payload);
      if (result.success) {
        (navigation as any).navigate('VerifyEmail');
      } else {
        setError(result.error?.message || 'Registration failed. Please try again.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again later.');
    }
  };


// const handleLogin = async (loginType: 'google' | 'email') => {
//   try {
//     setLoading(true);

//     // -------- Google Login flow ----------
//     if (loginType === 'google') {
//       await GoogleSignin.hasPlayServices();
//       await GoogleSignin.signOut(); // optional, ensures fresh login
//       const userInfo = await GoogleSignin.signIn();
//       const tokens = await GoogleSignin.getTokens();

//       const accessToken = tokens?.accessToken;
//       const idToken = tokens?.idToken;

//       if (!accessToken) {
//         await GoogleSignin.signOut();
//         setLoading(false);
//         Toast.show({
//           type: 'error',
//           text1: 'Google Login Failed',
//           text2: 'No access token received. Please try again.',
//           position: 'top',
//         });
//         return;
//       }

//       // Try login with access token
//       let tokenResult = await Services.sendAccessToken(accessToken);
//       console.log("sendAccessToken result", tokenResult);

//       if (!tokenResult.success && tokenResult.error === 'No Account Found! Please Sign Up First.') {
//         setLoading(false); // Stop loader before showing alert

//         Alert.alert(
//           'Account Not Found',
//           'No account was found with your Google account. Would you like to Google sign up instead?',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             {
//               text: 'Google Sign Up',
//               onPress: async () => {
//                 try {
//                   setLoading(true);
//                   const tokenResult2 = await Services.googleSignup(accessToken);
//                   console.log("googleSignup result", tokenResult2);

//                   if (!tokenResult2.success) {
//                     setLoading(false);
//                     Toast.show({
//                       type: 'error',
//                       text1: 'Google Signup Failed',
//                       text2: tokenResult2.error || 'Could not sign up with Google',
//                       position: 'top',
//                     });
//                     return;
//                   }

//                   const user = tokenResult2?.data?.user;
//                   await AsyncStorage.setItem('first_Name', user?.first_name || '');
//                   await AsyncStorage.setItem('last_Name', user?.last_name || '');
//                   await AsyncStorage.setItem('email', user?.email || '');
//                   await AsyncStorage.setItem('profilePic', user?.profile?.logo || '');
//                   await AsyncStorage.setItem('Token', tokenResult2.data?.key || '');
//                   await AsyncStorage.setItem('hasLoggedIn', 'true');

//                   Toast.show({ type: 'success', text1: 'Signup successful!', position: 'top' });

//                   setTimeout(() => {
//                     setLoading(false);
//                     navigation.dispatch(
//                       CommonActions.reset({
//                         index: 0,
//                         routes: [{ name: 'Dashboard' }],
//                       })
//                     );
//                   }, 1000);
//                 } catch (signupErr: any) {
//                   setLoading(false);
//                   Toast.show({
//                     type: 'error',
//                     text1: 'Signup Error',
//                     text2: signupErr.message || 'Something went wrong during signup',
//                     position: 'top',
//                   });
//                 }
//               },
//             },
//           ],
//           { cancelable: false }
//         );
//         return;
//       } else if (!tokenResult.success) {
//         setLoading(false);
//         Toast.show({
//           type: 'error',
//           text1: 'Google Login Failed',
//           text2: tokenResult.error || 'Could not authenticate with Google',
//           position: 'top',
//         });
//         return;
//       }

//       // Save user data and navigate
//       const user = tokenResult?.data?.user;
//       await AsyncStorage.setItem('first_Name', user?.first_name || '');
//       await AsyncStorage.setItem('last_Name', user?.last_name || '');
//       await AsyncStorage.setItem('email', user?.email || '');
//       await AsyncStorage.setItem('profilePic', user?.profile?.logo || '');
//       await AsyncStorage.setItem('Token', tokenResult.data?.key || '');
//       await AsyncStorage.setItem('hasLoggedIn', 'true');

//       Toast.show({ type: 'success', text1: 'Login successful!', position: 'top' });

//       setTimeout(() => {
//         setLoading(false);
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: 'Dashboard' }],
//           })
//         );
//       }, 1000);
//     }

//   } catch (err: any) {
//     setLoading(false);
//     console.error("Google Login Error:", err);
//     Toast.show({
//       type: 'error',
//       text1: 'Login Error',
//       text2: err.message || 'Something went wrong',
//       position: 'top',
//     });
//   }
// };
const handleLogin = async (loginType: 'google' | 'email') => {
  try {
    setLoading(true);

    if (loginType === 'google') {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // ensure fresh login
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      const accessToken = tokens?.accessToken;

      if (!accessToken) {
        await GoogleSignin.signOut();
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Google Signup Failed',
          text2: 'No access token received. Please try again.',
          position: 'top',
        });
        return;
      }

      // 🔹 Direct signup with Google (skip sendAccessToken)
      const tokenResult = await Services.googleSignup(accessToken,signupType);
      console.log("googleSignup result", tokenResult);

      if (!tokenResult.success) {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Google Signup Failed',
          text2: tokenResult.error || 'Could not sign up with Google',
          position: 'top',
        });
        return;
      }

      // Save user data
      const user = tokenResult?.data?.user;
      console.log("useruser",user);
      
      await AsyncStorage.setItem('first_Name', user?.first_name || '');
      await AsyncStorage.setItem('last_Name', user?.last_name || '');
      await AsyncStorage.setItem('email', user?.email || '');
      await AsyncStorage.setItem('profilePic', user?.profile?.logo || '');
      await AsyncStorage.setItem('Token', tokenResult.data?.key || '');
      await AsyncStorage.setItem('hasLoggedIn', 'true');
await AsyncStorage.setItem('userType', user?.user_type);
      Toast.show({ type: 'success', text1: 'Signup successful!', position: 'top' });

      setTimeout(() => {
        setLoading(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AuthLoading' }],
          })
        );
      }, 1000);
    }

  } catch (err: any) {
  setLoading(false);

  // Print the entire object so you can see all fields
  console.log("Google Signup full error:", JSON.stringify(err, null, 2));

  // Extract known properties if available
  console.log("Error code:", err.code);
  console.log("Error message:", err.message);

  Toast.show({
    type: 'error',
    text1: 'Signup Error',
    text2: err.message || 'Something went wrong',
    position: 'top',
  });
  }
};






const handleLinkedinLogin = () => {
  navigation.navigate('LinkedInLoginScreen');
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
        <Text style={styles.socialText}> Google signUp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}
      onPress={handleLinkedinLogin}
      >
        <Image
          source={require('../assets/images/linkedin.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>LinkedIn signUp</Text>
      </TouchableOpacity>
    </View>

  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.SignupIconContainer}>
              <Image
                source={require('../assets/images/IndividualSignup.png')}
                style={styles.SignupIcon}
              />
            </View>

            {/* STEP 1: Select Signup Type */}
            {!signupType ? (
              <View>
                <Text style={styles.header}>Select Signup Type</Text>
                {SIGNUP_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.typeButton}
                    onPress={() => {
                      setSignupType(type.value);
                      setError('');
                    }}
                  >
                    <Text style={styles.typeButtonText}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                  {renderSocialButtons()}
                {/* STEP 2: Show Form */}
                <Text style={styles.header}>
                  Register As {SIGNUP_TYPES.find(t => t.value === signupType)?.label}
                </Text>

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

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter password *"
                    value={password1}
                    onChangeText={setPassword1}
                    secureTextEntry={!showPassword1}
                  />
                  <TouchableOpacity onPress={() => setShowPassword1(!showPassword1)}>
                    <Text style={styles.toggleText}>{showPassword1 ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, error ? styles.errorInput : null]}
                    placeholder="Enter confirm password *"
                    value={password2}
                    onChangeText={setPassword2}
                    secureTextEntry={!showPassword2}
                  />
                  <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
                    <Text style={styles.toggleText}>{showPassword2 ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>
                    Register As {SIGNUP_TYPES.find(t => t.value === signupType)?.label}
                  </Text>
                </TouchableOpacity>

                <View style={styles.loginBox}>
                  <Text style={styles.signup}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Log In</Text>
                  </TouchableOpacity>
                </View>

                {/* Option to go back and change signup type */}
                <TouchableOpacity
                  style={styles.changeType}
                  onPress={() => setSignupType('')}
                >
                  <Text style={styles.changeTypeText}>← Change Signup Type</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 20, marginTop: 20 },
  SignupIconContainer: { width: '100%', alignItems: 'center' },
  SignupIcon: { width: 300, height: 200 },
  typeButton: {
    backgroundColor: '#000078',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  typeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  row: { flexDirection: 'row', marginBottom: 15 },
  input1: {
    width: 150,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingRight: 10,
  },
  passwordInput: { flex: 1, height: 50, paddingHorizontal: 10 },
  toggleText: { color: '#0E3386', fontWeight: '600' },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 10 },
  button: {
    backgroundColor: '#000078',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loginBox: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  signup: { color: '#333', fontSize: 14 },
  link: { color: '#000078', fontWeight: '600', fontSize: 14 },
  changeType: { marginTop: 15, alignItems: 'center' },
  changeTypeText: { color: '#666', textDecorationLine: 'underline' },

  
    socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop:15,
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
});
