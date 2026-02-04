import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from '../Services/services';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Define the navigation stack type
type RootStackParamList = {
  SignUp: undefined;
  Dashboard: undefined;
  VerifyEmail: undefined;
};

// Define the user data structure
interface SignUpData {
  email: string;
  // Add other properties as needed
}

// Define service response types
interface ServiceResponse {
  [x: string]: any;
  success: boolean;
  error?: {
    message: string;
  };
}
const OTP_LENGTH = 5;
const VerifyEmailScreen: React.FC = () => {
  const route = useRoute<any>();

  const emailFromRoute = route.params?.email;
  console.log("email", emailFromRoute);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState<string>(emailFromRoute || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  // Create refs for OTP inputs
  const otpInputs = useRef<(TextInput | null)[]>([]);
  const isDark = useColorScheme() === 'dark';

  const themeColors = {
    text: isDark ? '#272424ff' : '#111827',
    otp: isDark ? '#f5efefff' : '#111827',

    placeholder: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#D1D5DB',
    bg: isDark ? '#1F2937' : '#FFFFFF',
    boxBg: isDark ? '#111827' : '#FFFFFF',
    activeBorder: '#0E3386',
  };

  const SIGNUP_TYPES = [
    { label: 'Enterprise', value: 'ORGANISATION_USER', screen: 'OrganisationDrawer' },
    { label: 'Supplier & Agency Network', value: 'AGENCY_USER', screen: 'AgencyDashboard' },
    { label: 'Talent', value: 'RESOURCE_USER', screen: 'TalentDashboard' },
    { label: 'Individual Buyer', value: 'INDIVIDUAL_USER', screen: 'Dashboard' },
    { label: 'Lawyer Network', value: 'LAWYER_USER', screen: 'LawyerDashboard' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
      );

      return () => backHandler.remove();
    }, [])
  );



  useEffect(() => {
    const getEmailFromStorage = async (): Promise<void> => {
      if (emailFromRoute) {
        return;
      }

      try {
        const userData = await AsyncStorage.getItem('signUp_data');

        if (!userData) {
          navigation.navigate('SignUp');
          return;
        }

        const parsedData: SignUpData = JSON.parse(userData);

        if (parsedData?.email) {
          setEmail(parsedData.email);
        } else {
          navigation.navigate('SignUp');
        }
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        navigation.navigate('SignUp');
      }
    };

    getEmailFromStorage();
  }, [emailFromRoute, navigation]);


  const finalEmail = emailFromRoute || email;




  const handleVerifyCode = async (): Promise<void> => {
    const otpString = otp.join('');

    // ✅ Correct validation
    if (otpString.length !== OTP_LENGTH) {
      Toast.show({
        type: 'info',
        text1: 'Invalid OTP',
        text2: 'Please enter all 5 digits',
        position: 'top',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: finalEmail,
        code: Number(otpString), // ✅ FULL OTP
      };

      console.log('OTP PAYLOAD 👉', payload);

      const result: ServiceResponse = await Services.verifyCode(payload);

      console.log('result of verifyCode', result);
      if (!result.success) {
        Toast.show({
          type: 'error',
          text1: 'Verification failed',
          text2: result.error,
        });
        return; // back enabled
      }

      if (result.success) {
        const userType = result.data?.payload?.user_type;
        const agencyType = result.data?.payload?.agency_type;

        if (userType) {
          await AsyncStorage.setItem('userData', JSON.stringify(result.data));
          await AsyncStorage.setItem('userPayload', JSON.stringify(result.data.payload));
          await AsyncStorage.setItem('userId', String(result.data.payload.id));
          await AsyncStorage.setItem('company', result.data.payload.profile?.company_name || '');
          await AsyncStorage.setItem('slug', result.data.payload.profile?.slug || '');
          await AsyncStorage.setItem('userType', userType);
          await AsyncStorage.setItem('agencyType', agencyType || '');
        }

        const matchedType = SIGNUP_TYPES.find(type => type.value === userType);
        Toast.show({
          type: 'info',
          text1: 'Info',
          text2: result.data.message,
          position: 'top',
        });



        if (matchedType) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: matchedType.screen }],
            })
          );
        }

      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification failed',
          text2: result.error,
        });

      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    setResendLoading(true);
    try {
      const payload = { email };
      const result: ServiceResponse = await Services.sendVerificationCode(payload);


      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Done',
          text2: result.success?.message || 'Verification code resent successfully!',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to resent Code ',
          text2: result.error?.message || 'Please Try Again',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to resend verification code',
        text2: 'Please Try Again',
        position: 'top',
      });
    } finally {
      setResendLoading(false);
    }
  };


  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index]) {
        // Clear current box
        const updatedOtp = [...otp];
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      } else if (index > 0) {
        // Move to previous box and clear it
        otpInputs.current[index - 1]?.focus();
        const updatedOtp = [...otp];
        updatedOtp[index - 1] = '';
        setOtp(updatedOtp);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/IndividualSignup.png')}
          style={styles.vectorImage}
        />
        <Text style={styles.headerText}>Verify your email</Text>
      </View>

      <View style={styles.emailContainer}>
        <Text style={styles.emailLabel}>We have sent an email to:</Text>
        <Text style={styles.emailText}>
          {emailFromRoute || email}
        </Text>

      </View>



      <View style={styles.container}>
        <Text style={[styles.otpLabel, { color: themeColors.text }]}>
          Enter Your 5 Digit OTP
        </Text>

        <View style={styles.otpInputContainer}>
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  color: themeColors.otp,
                  backgroundColor: themeColors.boxBg,
                  borderColor: otp[index]
                    ? themeColors.activeBorder
                    : themeColors.border,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              placeholder="•"
              placeholderTextColor={themeColors.placeholder}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Please verify to confirm your email</Text>
        <TouchableOpacity onPress={handleResendCode} disabled={resendLoading}>
          <Text style={styles.resendLink}>
            {resendLoading ? 'Sending...' : 'Resend Email'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, otp.length !== 5 && styles.disabledButton]}
        onPress={handleVerifyCode}
        disabled={otp.length !== 5 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },

  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },

  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  otpInput: {
    width: 50,
    height: 55,
    borderWidth: 1.5,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: '600',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  vectorImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emailContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emailLabel: {
    fontSize: 16,
    color: '#666',
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  otpContainer: {
    marginBottom: 30,
  },

  footerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  resendLink: {
    color: '#0E3386',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0E3386',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerifyEmailScreen;