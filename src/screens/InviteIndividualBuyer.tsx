import React, {useEffect, useState} from 'react';
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
const InviteIndividualBuyer = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTagged, setIsTagged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('');

  const isValidName = (name: string) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    // Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) {
          const result = await AsyncStorage.multiGet(keys);

          const dataObj = result.reduce<Record<string, any>>(
            (acc, [key, value]) => {
              if (value !== null) {
                try {
                  acc[key] = JSON.parse(value);
                } catch {
                  acc[key] = value;
                }
              }
              return acc;
            },
            {},
          );

          const typeFromStorage =
            dataObj.userData?.user_type || // preferred location
            dataObj.userType; // or the separate key if it exists

          if (typeFromStorage) {
            setUserType(typeFromStorage);
          }

          console.log('User type is:', typeFromStorage);
        }
      } catch (error) {
        console.error('Error fetching all AsyncStorage data:', error);
      }
    };

    fetchAllData();
  }, []);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Toast.show({type: 'error', text1: 'Please fill all fields'});
      return;
    }

    if (!isValidName(firstName)) {
      Toast.show({
        type: 'error',
        text1: 'First name should contain only letters',
      });
      return;
    }

    if (!isValidName(lastName)) {
      Toast.show({
        type: 'error',
        text1: 'Last name should contain only letters',
      });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({type: 'error', text1: 'Please enter a valid email address'});
      return;
    }

    if (!isValidPassword(password)) {
      Toast.show({
        type: 'error',
        text1:
          'Password must be 8+ characters with uppercase, lowercase & number',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({type: 'error', text1: 'Passwords do not match'});
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      user_type: 'INDIVIDUAL_USER',
      is_authorized: isTagged,
    };

    try {
      setLoading(true);
      const res = await Services.inviteUsers(payload);
      console.log('pay', payload);
      console.log('res', res);

      setLoading(false);
      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Individual Buyer invited successfully',
        });
        // Reset form or navigate back
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsTagged(false);
      } else {
        Toast.show({
          type: 'error',
          text1: res?.error?.message || 'Invite failed',
        });
      }
    } catch (error) {
      Toast.show({type: 'error', text1: 'Something went wrong'});
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#0E3386', '#0E3386']}
          style={styles.header}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}></LinearGradient>

        {/* Form */}
        <View style={styles.card}>
          <FormField
            label="First Name *"
            value={firstName}
            onChangeText={(text: any) => {
              const filtered = text.replace(/[^A-Za-z\s]/g, '');
              setFirstName(filtered);
            }}
            placeholder="Enter first name"
            placeholderTextColor={'Black'}
          />

          <FormField
            label="Last Name *"
            value={lastName}
            onChangeText={(text: any) => {
              const filtered = text.replace(/[^A-Za-z\s]/g, '');
              setLastName(filtered);
            }}
            placeholder="Enter last name"
            placeholderTextColor={'Black'}
          />

          <FormField
            label="Email id *"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            placeholderTextColor={'Black'}
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
            <Text style={styles.toggleLabel}>
              Tag this individual buyer to my team
            </Text>
            <TouchableOpacity
              style={[styles.toggleButton, isTagged && styles.toggleActive]}
              onPress={() => setIsTagged(!isTagged)}>
              <View
                style={[
                  styles.toggleCircle,
                  isTagged && styles.toggleCircleActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Invite </Text>
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
  keyboardType = 'default',
}: any) => (
  <View style={styles.formField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#171515ff"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
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
        placeholderTextColor={'black'}
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
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  card: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 8,

    // Android shadow
    elevation: 10,
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
    color: '#333',
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#0E3386',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleCircleActive: {
    transform: [{translateX: 22}],
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

export default InviteIndividualBuyer;
