import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InviteLawyerScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTagged, setIsTagged] = useState(false);
  const [loading, setLoading] = useState(false);

  const [contactNumber, setContactNumber] = useState('');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  const [userType, setUserType] = useState('')



  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) {
          const result = await AsyncStorage.multiGet(keys);

          const dataObj = result.reduce<Record<string, any>>((acc, [key, value]) => {
            if (value !== null) {
              try {
                acc[key] = JSON.parse(value);
              } catch {
                acc[key] = value;
              }
            }
            return acc;
          }, {});

          const typeFromStorage =
            dataObj.userData?.user_type || // preferred location
            dataObj.userType;              // or the separate key if it exists

          if (typeFromStorage) {
            setUserType(typeFromStorage);
          }

          console.log("User type is:", typeFromStorage);
        }
      } catch (error) {
        console.error("Error fetching all AsyncStorage data:", error);
      }
    };

    fetchAllData();
  }, []);


  const handleSubmit = async () => {

    if (!firstName.trim()) {
      Toast.show({ type: 'error', text1: 'First name is required' });
      return;
    }

    if (!lastName.trim()) {
      Toast.show({ type: 'error', text1: 'Last name is required' });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      Toast.show({ type: 'error', text1: 'Please enter a valid email address' });
      return;
    }



    if (!PASSWORD_REGEX.test(password)) {
      Toast.show({
        type: 'error',
        text1:
          'Password must be 8+ chars, include uppercase, lowercase, number & symbol',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      Toast.show({ type: 'error', text1: 'Please enter a valid email address' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      user_type: 'LAWYER_USER',
      is_authorized: isTagged, // true if tagged, false otherwise
    };

    try {
      setLoading(true);
      const res = await Services.inviteUsers(payload);

      console.log("ressss", res);

      setLoading(false);
      if (res.success) {
        Toast.show({ type: 'success', text1: 'Lawyer invited successfully' });
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsTagged(false);
      } else {
        Toast.show({ type: 'error', text1: res?.error?.message || 'Invite failed' });
        Toast.show({ type: 'error', text1: res?.error?.email || 'Invite failed' });

      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        {/* <LinearGradient
          colors={['#0E3386', '#0E3386']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
        </LinearGradient> */}

        {/* Form */}
        <View style={styles.card}>
          <FormField
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <FormField
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />

          <FormField
            label="Email id *"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <PasswordField
            label="Password *"
            value={password}
            onChangeText={setPassword}
            placeholder="Create password"
            secureTextEntry={!showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            show={showPassword}
          />

          <PasswordField
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry={!showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            show={showConfirmPassword}
          />


          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Tag this Lawyer to my team</Text>
            <TouchableOpacity
              style={[styles.toggleButton, isTagged && styles.toggleActive]}
              onPress={() => setIsTagged(!isTagged)}
            >
              <View style={[styles.toggleCircle, isTagged && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Invite Lawyer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default'
}: any) => (
  <View style={styles.formField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={(text) =>
        keyboardType === 'email-address'
          ? onChangeText(text.toLowerCase())
          : onChangeText(text)
      }
      placeholder={placeholder}
      placeholderTextColor="#040303ff"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType={keyboardType === 'email-address' ? 'emailAddress' : 'none'}
    />

  </View>
);
const PasswordField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onToggle,
  show,
}: any) => (
  <View style={styles.formField}>
    <Text style={styles.fieldLabel}>{label}</Text>

    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={"black"}

        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
 <TouchableOpacity onPress={onToggle} style={styles.eyeButton}>
        <Icon
          name={show ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color="#666"
        />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FC',
    margin: 10,

  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    marginTop: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#0E3386',
    // Android shadow
    elevation: 4,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    padding: 10,
    borderWidth: 2,
    borderColor: '#0E3386',
    borderRadius: 5,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#494747ff',
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#a29898ff',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#1a5bdcff',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black'
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  submitButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0E3386',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

eyeButton: {
    paddingLeft: 8,
  },

});

export default InviteLawyerScreen;