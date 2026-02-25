import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InviteOrganizationScreen = () => {
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

          // 🔑 user_type lives inside the parsed userData object
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
    console.log('happy ');

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
      user_type: 'ORGANISATION_USER',
      is_authorized: isTagged,
    };
    console.log('pay', payload);

    try {
      setLoading(true);
      const res = await Services.inviteUsers(payload);

      setLoading(false);
      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Organization invited successfully',
        });
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
        Toast.show({
          type: 'error',
          text1: res?.error?.email || 'Invite failed',
        });
      }
    } catch (error) {
      Toast.show({type: 'error', text1: 'Something went wrong'});
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#F9FAFB'}]}>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          {/* Header (Hidden on iOS) */}
          {Platform.OS !== 'ios' && (
            <LinearGradient
              colors={['#0E3386', '#1A3B8B']}
              style={styles.header}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.headerTitle}>Invite New Organization</Text>
            </LinearGradient>
          )}

          {/* Form Card */}
          <View style={styles.card}>
            <FormField
              label="First Name *"
              value={firstName}
              onChangeText={(text:any)=> {
                const filtered = text.replace(/[^A-Za-z\s]/g, '');
                setFirstName(filtered);
              }}
              placeholder="Enter first name"
            />

            <FormField
              label="Last Name *"
              value={lastName}
              onChangeText={(text:any) => {
                const filtered = text.replace(/[^A-Za-z\s]/g, '');
                setLastName(filtered);
              }}
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
              <Text style={styles.toggleLabel}>
                Tag this Organization to my team
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

        {/* Fixed Bottom Button (Safe Area Friendly) */}
        <View style={styles.bottomSafeArea}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Invite Organization</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
      placeholderTextColor="#080808ff"
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
    margin: 10,
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingTop: 50,
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
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.4,
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
    borderColor: 'black',
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
  bottomSafeArea: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#F9FAFB',
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
    color: '#000000ff',
  },

  eyeButton: {
    paddingLeft: 8,
  },
});

export default InviteOrganizationScreen;
