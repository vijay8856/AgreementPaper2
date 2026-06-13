import React, {useEffect, useState} from 'react';
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
  Modal,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import {ActivityIndicator} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Checkbox from '../components/CommanCheckbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GOOGLE_WEB_CLIENT_ID } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import {useIsFocused} from '@react-navigation/native';
// import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';

import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import axios from 'axios';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const {width} = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isFocused = useIsFocused();

  const isDark = useColorScheme() === 'dark';
  console.log('isdark', isDark);
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: "601221483061-eadrdpe1opnslp4sug89v8mpugebj68f.apps.googleusercontent.com",
  //     //  GOOGLE_WEB_CLIENT_ID,
  //     iosClientId:
  //   'client_60123061-6hdifq4bnvua13lbj7kq8ebufmrm.apps.googleusercontent.com',
  //     offlineAccess: true,
  //     forceCodeForRefreshToken: true,
  //   });
  // }, []);

  // ORIGINAL_ID
    //  iosClientId:
    //     '601221483061-6hdifq4bhgd5nvua13lbj7kq8ebufmrm.apps.googleusercontent.com',
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '601221483061-6hdifq4bhgd5nvua13lbj7kq8ebufmrm.apps.googleusercontent.com',
      webClientId:
        '601221483061-eadrdpe1opnslp4sug89v8mpugebj68f.apps.googleusercontent.com',

      offlineAccess: true,
    });
  }, []);

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };
// ─── DROP-IN REPLACEMENT for handleAppleLogin in LoginScreen.tsx ─────────────
// NO BACKEND — Pure local login using AsyncStorage only
// Mirrors your Google flow: save user data → navigate to AuthLoading

// const handleAppleLogin = async () => {
//   try {
//     setLoading(true);

//     const appleAuthRequestResponse = await appleAuth.performRequest({
//       requestedOperation: appleAuth.Operation.LOGIN,
//       requestedScopes: [
//         appleAuth.Scope.EMAIL,
//         appleAuth.Scope.FULL_NAME,
//       ],
//     });

//     const { identityToken, email, fullName, user } = appleAuthRequestResponse;

//     if (!identityToken) {
//       setLoading(false);
//       Toast.show({
//         type: 'error',
//         text1: 'Apple Sign-In Failed',
//         text2: 'No identity token returned. Please try again.',
//         position: 'top',
//       });
//       return;
//     }

//     // Apple only sends name/email on VERY FIRST login — reuse stored after that
//     const storedFirstName = await AsyncStorage.getItem('first_Name');
//     const storedLastName  = await AsyncStorage.getItem('last_Name');
//     const storedEmail     = await AsyncStorage.getItem('email');

//     const firstName = fullName?.givenName  || storedFirstName || 'Apple';
//     const lastName  = fullName?.familyName || storedLastName  || 'User';
//     const userEmail = email || storedEmail || '';

//     // Save with same keys your whole app uses
//     await AsyncStorage.multiSet([
//       ['first_Name',  firstName],
//       ['last_Name',   lastName],
//       ['email',       userEmail],
//       ['profilePic',  ''],
//       ['Token',       identityToken],     // ✅ AuthLoading checks this
//       ['hasLoggedIn', 'true'],
//       ['userType',    'INDIVIDUAL_USER'], // ✅ Routes to Dashboard
//       ['userId',      user || ''],
//       ['isActive',    'true'],
//       ['company',     ''],
//       ['slug',        ''],
//       ['appleUserId', user || ''],
//       ['loginType',   'apple'],
//     ]);

//     Toast.show({
//       type: 'success',
//       text1: 'Login successful!',
//       position: 'top',
//     });

//     setTimeout(() => {
//       setLoading(false);
//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{ name: 'AuthLoading' }],
//         }),
//       );
//     }, 1000);

//   } catch (error: any) {
//     setLoading(false);
//     console.log('Apple Login Error:', error);

//     // 1001 = user cancelled — show nothing
//     if (error?.code === '1001' || error?.code === 1001) {
//       return;
//     }

//     Toast.show({
//       type: 'error',
//       text1: 'Apple Sign-In Failed',
//       text2: error?.message || 'Something went wrong. Please try again.',
//       position: 'top',
//     });
//   }
// };


const handleAppleLogin = async () => {
  try {
    setLoading(true);

    // 🔐 Step 1: Apple Login
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [
        appleAuth.Scope.EMAIL,
        appleAuth.Scope.FULL_NAME,
      ],
    });

    console.log("Apple Response", appleAuthRequestResponse);

    const { authorizationCode } = appleAuthRequestResponse;

    if (!authorizationCode) {
      Toast.show({
        type: "error",
        text1: "Apple Login Failed",
        text2: "No authorization code returned",
        position: "top",
      });
      return;
    }

    // 🌐 Step 2: Backend API (LOGIN)
    const url =
      "https://api.agreementpaper.com/accounts/dj-rest-auth/apple/mobile/";

    const payload = {
      authorization_code: authorizationCode,
      auth_type: "login", // ✅ CHANGED (signup → login)
     
    };

    console.log("Apple payload", payload);

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Apple login result", response.data);

    const result = response?.data;

    if (!result || !result?.payload) {
      Toast.show({
        type: "error",
        text1: "Apple Login Failed",
        text2: "Invalid server response",
        position: "top",
      });
      return;
    }

    // ✅ Correct mapping
    const user = result.payload;

    // 🛡️ Safe values
    const firstName = user?.first_name ?? "";
    const lastName = user?.last_name ?? "";
    const email = user?.email ?? "";
    const profilePic = user?.profile?.logo ?? "";
    const token = result?.key ?? "";
    const userType = user?.user_type ?? "";

    // 💾 Save safely
    await AsyncStorage.multiSet([
      ["first_Name", firstName],
      ["last_Name", lastName],
      ["email", email],
      ["profilePic", profilePic],
      ["Token", token],
      ["hasLoggedIn", "true"],
      ["userType", userType],
    ]);

    // 🎉 Success
    Toast.show({
      type: "success",
      text1: "Login successful!",
      position: "top",
    });

    // 🔄 Navigate
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AuthLoading" }],
      })
    );

  } catch (error) {
    console.log("Apple login error", error?.response || error);

    // ❌ ignore cancel error
    if (error?.code === "1001" || error?.code === 1001) {
      return;
    }

    Toast.show({
      type: "error",
      text1: "Apple Login Error",
      text2:
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong",
      position: "top",
    });
  } finally {
    setLoading(false);
  }
};
  const handleLogin = async (loginType: 'google' | 'email') => {
    try {
      setLoading(true);

      // -------- Google Login flow ----------
      if (loginType === 'google') {
        console.log('    come in try');

        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices();
        }

        await GoogleSignin.signOut();

        const userInfo = await GoogleSignin.signIn();

        const tokens = await GoogleSignin.getTokens();

        const accessToken = tokens?.accessToken;
        const idToken = tokens?.idToken;

        console.log('accessToken', accessToken);
        console.log('tokens', tokens);
        console.log('userInfo', userInfo);

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

        // Try login with access token
        let tokenResult = await Services.sendAccessToken(accessToken);

        console.log('A: tokenResult raw');
        console.log(tokenResult);

        await new Promise(res => setTimeout(res, 500));

        console.log('B: after delay', tokenResult);

        if (
          !tokenResult.success &&
          tokenResult.error === 'No Account Found! Please Sign Up First.'
        ) {
          setLoading(false);
          setAlertVisible(true);
          return;
        } else if (!tokenResult.success) {
          // Other login failure (not "Account not found")
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Google Login Failed',
            text2: tokenResult.error || 'Could not authenticate with Google',
            position: 'top',
          });
          return;
        }

        // Save user data and navigate to Dashboard
        const user = tokenResult?.data?.user;
        console.log('useruser', user);

        await AsyncStorage.multiSet([
          ['first_Name', user?.first_name || ''],
          ['last_Name', user?.last_name || ''],
          ['email', user?.email || ''],
          ['profilePic', user?.profile?.logo || ''],
          ['Token', tokenResult.data?.key || ''],
          ['hasLoggedIn', 'true'],
          ['userType', String(user?.user_type || '')],
          ['userId', String(user?.id || '')],
          ['isActive', user?.profile?.is_active?.toString() || 'false'],
          ['company', user.profile?.company_name?.toString() || ''],
          ['slug', user?.profile?.slug || ''],
        ]);

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
              routes: [{name: 'AuthLoading'}],
            }),
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
        console.log('result login', result);

        if (result.success) {
          // 🔴 EMAIL VERIFICATION CHECK
          if (result.data?.payload?.is_verify === false) {
            setLoading(false);

            Toast.show({
              type: 'error',
              text1: 'Email Not Verified',
              text2: 'Redirecting to verification screen...',
              position: 'top',
            });

            navigation.navigate('VerifyEmail', {
              email: result.data.payload?.email || email,
            });

            return; // ⛔ stop login flow
          }
          Toast.show({
            type: 'success',
            text1: result?.data?.message || 'Login successful!',
            position: 'top',
          });

          await AsyncStorage.multiSet([
            ['Token', result.data.key || ''],
            ['first_Name', result.data.payload?.first_name || ''],
            ['last_Name', result.data.payload?.last_name || ''],
            ['email', result.data.payload?.email || ''],
            ['hasLoggedIn', 'true'],
            ['userType', result.data.payload?.user_type || ''],
            [
              'isActive',
              result.data.payload?.profile?.is_active?.toString() || 'false',
            ],
            ['userId', result.data.payload?.id?.toString() || ''],
            [
              'company',
              result.data.payload?.profile?.company_name?.toString() || '',
            ],
            ['slug', result.data.payload?.profile?.slug || ''],
            ['agencyType', result.data.payload?.agency_type || ''],
          ]);

          setTimeout(() => {
            setLoading(false);
            navigation.navigate('AuthLoading');
          }, 1000);
        } else {
          // ❌ HANDLE LOGIN FAILURE (403, 401, etc.)
          setLoading(false);

          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: result.error?.message || 'Something went wrong',
            position: 'top',
          });
        }
      }
    } catch (err: any) {
      setLoading(false);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network error or unexpected issue',
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
        onPress={() => isFocused && handleLogin('google')}
        disabled={loading || !isFocused}>
        <Image
          source={require('../assets/images/search.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Login Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={handleLinkedinLogin}>
        <Image
          source={require('../assets/images/linkedin.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Login LinkedIn</Text>
      </TouchableOpacity>
    </View>
  );
  const handleSendResetCode = async () => {
    setLoading(true);
    try {
      const res = await Services.forgetPassword({email: otpEmail});
      if (res.success) {
        setResetStep(2);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send code',
          text2: res.error?.email || 'Unknown error',
        });
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const formData = new FormData();
    formData.append('code', otpCode); // or token, as per your API
    formData.append('password', newPassword);

    try {
      setLoading(true);

      const res = await Services.forgetPasswordReset(formData); // API call with FormData
      setLoading(false);

      if (res.success) {
        setPasswordModalVisible(false);
        setResetStep(1);
        Toast.show({
          type: 'success',
          text1: 'Password updated',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: res.data.code || 'Failed to reset password',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred',
      });
      console.log('Reset error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
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
{Platform.OS === 'ios' && (
  <AppleButton
    buttonStyle={AppleButton.Style.BLACK}
    buttonType={AppleButton.Type.SIGN_IN}
    style={{
      width: '100%',
      height: 44,
      marginTop: 10,
    }}
    onPress={() => handleAppleLogin()}
  />
)}
          {/* OR separator */}
          <Text style={styles.orText}>Or</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor={'black'}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              placeholderTextColor={'black'}
              style={[
                styles.inputLoginPassword,
                {flex: 1, borderWidth: 0, color: '#100d0dff', fontSize: 16},
              ]}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(prev => !prev)}
              style={styles.eyeButton}>
              <Icon
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.signupbox}>
            <Text style={styles.signup}>Don't have an account ?{'  '}</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
            <Text style={styles.forgotPassword}>Forgot password</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox value={agreeTerms} onValueChange={setAgreeTerms} />
          </View>
          <Text style={styles.termsText}>
            <Text style={styles.termsLabel}>
              By creating your account, you agree to our{' '}
            </Text>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() =>
                Linking.openURL('https://agreementpaper.com/termsCondition')
              }>
              <Text style={styles.settingsText}>Terms and Conditions &</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem2}
              onPress={() =>
                Linking.openURL('https://agreementpaper.com/legal')
              }>
              <Text style={styles.settingsText2}> Privacy Policy</Text>
            </TouchableOpacity>
          </Text>
        </View>
        {/* Fixed Login Button */}

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={() => handleLogin('email')}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
        <Modal visible={passwordModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {resetStep === 1 ? (
                <>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={'Black'}
                    value={otpEmail}
                    onChangeText={setOtpEmail}
                    style={styles.input1}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={styles.button2}
                    onPress={handleSendResetCode}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    placeholder="Enter OTP"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    style={styles.input1}
                    keyboardType="number-pad"
                    placeholderTextColor={'Black'}
                  />

                  {/* Password field with eye icon */}
                  <View style={styles.passwordWrapper2}>
                    <TextInput
                      placeholder="New Password"
                      placeholderTextColor={'Black'}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!passwordVisible}
                      style={[
                        styles.inputNewPassword,
                        {flex: 1, borderWidth: 0},
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(prev => !prev)}
                      style={styles.eyeButton}>
                      <Icon
                        name={passwordVisible ? 'eye' : 'eye-off'}
                        size={22}
                        color="#555"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.resetbutton}
                    onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={() => {
                  setPasswordModalVisible(false);
                  setResetStep(1);
                }}
                style={styles.buttonlink}>
                <Text style={styles.link2}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <CustomAlert
          visible={alertVisible}
          onDismiss={() => setAlertVisible(false)}
          onConfirm={() => {
            setAlertVisible(false);
            navigation.navigate('SignUp');
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    fontSize: 16,
    color: '#000',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  iconContainer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#141313ff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    maxWidth: 290,
  },
  eyeButton: {
    paddingHorizontal: 6,
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
    borderColor: '#201a1aff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
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
    color: '#0e0e0eff',
    textAlign: 'left',
    marginTop: 8,
  },
  signupbox: {
    display: 'flex',
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 5,
    marginBottom: 15,
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  checkboxRow: {
    flexDirection: 'column',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },

  input1: {
    borderWidth: 1,
    borderColor: '#211818ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '94%',
    marginVertical: 10,
  },
  inputNewPassword: {
    borderWidth: 1,
    borderColor: '#1c1919ff',
    borderRadius: 8,
    width: '80%',
  },
  inputLoginPassword: {
    borderWidth: 1,
    borderColor: '#1c1717ff',
    borderRadius: 8,
    width: '80%',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  resetbutton: {
    backgroundColor: '#000078',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: '29%',
    marginTop: 10,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#000078',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: '35%',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonlink: {
    backgroundColor: '#000078',
    padding: 10,
    paddingHorizontal: '40%',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  link2: {color: '#fff', fontWeight: 'bold'},
});

export default LoginScreen;
