
import React, {useState} from 'react';
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
 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/NavigationManager';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const {width} = Dimensions.get('window');



const LoginScreen: React.FC = () => {
const navigation = useNavigation<LoginScreenNavigationProp>();
const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);


const handleLogin = async () => {
  if (!email || !password) {
    Toast.show({
      type: 'error',
      text1: 'Missing Input',
      text2: 'Please enter both email and password.',
    });
    return;
  }

  if (!agreeTerms) {
    Toast.show({
      type: 'error',
      text1: 'Terms Not Accepted',
      text2: 'You must agree to the terms and conditions.',
    });
    return;
  }

  try {
    setLoading(true); 
    const result = await Services.login(email, password);
    console.log("result", result);

    if (result.status === 200) {
      Toast.show({
        type: 'success',
        text1: 'Login successful!',
        position: 'top',
      });

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
  } catch (err) {
      setLoading(false);
    Toast.show({

      type: 'error',
      text1: 'Error',
      text2: 'Something went wrong during login',
      position: 'top',
    });
  }
};
  const renderSocialButtons = () => (
    <View style={styles.socialContainer}>
      <TouchableOpacity style={styles.socialButton}>
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
          <Text style={styles.tag}>Contract Management made smarter</Text>
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

   <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password</Text>
          </TouchableOpacity>

      
        </ScrollView>
    {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            {/* <CheckBox
              value={agreeTerms}
              onValueChange={setAgreeTerms}
              tintColors={{true: '#000078'}}
            /> */}
            <Text style={styles.termsText}>
              By creating your account, you agree to our{' '}
              <Text style={styles.link}>Terms of Use</Text> &{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        {/* Fixed Login Button */}
     

<View style={styles.fixedButtonContainer}>
  <TouchableOpacity
    style={[styles.button, loading && styles.disabledButton]}
    onPress={handleLogin}
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
    backgroundColor: '#000078',
    padding: 5,
    borderRadius: 5,
    fontSize: 19,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal:10,
  },
  termsText: {
    color: '#000',
    fontSize: 12,
    flex: 1,
  },
  link: {
    color: '#B00020',
    textDecorationLine: 'underline',
  },
  disabledButton: {
  backgroundColor: '#aaa', 
  opacity: 0.7,
}
});

export default LoginScreen;
