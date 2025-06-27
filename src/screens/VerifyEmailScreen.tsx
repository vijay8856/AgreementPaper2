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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from '../Services/services';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
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
  success: boolean;
  error?: {
    message: string;
  };
}

const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [otp, setOtp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  // Create refs for OTP inputs
  const otpInputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const getEmailFromStorage = async (): Promise<void> => {
      try {
        const userData = await AsyncStorage.getItem("signUp_data");
        if (!userData) {
          navigation.navigate('SignUp');
          return;
        }
        const parsedData: SignUpData = JSON.parse(userData);
        setEmail(parsedData.email);
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        navigation.navigate('SignUp');
      }
    };

    getEmailFromStorage();
  }, [navigation]);

  const handleVerifyCode = async (): Promise<void> => {
    if (otp.length !== 5) {
      Alert.alert('Invalid OTP', 'Please enter a 5-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const payload = { email, code: parseInt(otp, 10) };
      const result: ServiceResponse = await Services.verifyCode(payload);



      if (result.success) {
        Alert.alert('Success', 'Email verified successfully!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', result.error?.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
        Alert.alert('Success', 'Verification code resent successfully!');
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number): void => {
    const newOtp = otp.split('');
    newOtp[index] = text;
    setOtp(newOtp.join(''));
    
    // Focus next input if text is entered and not the last input
    if (text && index < 4 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1]?.focus();
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
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <View style={styles.otpContainer}>
        <Text style={styles.otpLabel}>Enter Your 5 Digits OTP</Text>
        <View style={styles.otpInputContainer}>
          {[...Array(5)].map((_, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={otp[index] || ''}
              onChangeText={(text: string) => handleOtpChange(text, index)}
              ref={(ref: TextInput | null) => {
                otpInputs.current[index] = ref;
              }}
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  otpLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
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
    color: '#007AFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
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