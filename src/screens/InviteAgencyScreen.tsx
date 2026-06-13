import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const InviteAgencyScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTagged, setIsTagged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [agencyType, setAgencyType] = useState<string>('');
const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);





  const [userType, setUserType] = useState('')

const AGENCY_ROLES = [
  { label: 'Recruiter', value: 'RECRUITER' },
  { label: 'Real Estate Agent', value: 'REAL_ESTATE_AGENT' },
  { label: 'Goods & Services Supplier', value: 'GOODS_AND_SERVICE_SUPPLIER' },
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const handleAgencyRoleSelect = (value: string) => {
  setAgencyType(value);
  setShowAgencyDropdown(false);
};

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

          // 🔑 user_type lives inside the parsed userData object
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
    // Simple validation (you can expand this)
  
if (!agencyType) {
  Toast.show({ type: 'error', text1: 'Please select agency role' });
  return;
}

  
    if (!firstName.trim()) {
      Toast.show({ type: 'error', text1: 'First name is required' });
      return;
    }

    if (!lastName.trim()) {
      Toast.show({ type: 'error', text1: 'Last name is required' });
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

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      user_type: "AGENCY_USER",
       agency_type: agencyType,
      is_authorized: isTagged, // true if tagged, false otherwise
    };

    try {
      setLoading(true);
      const res = await Services.inviteUsers(payload);
      console.log("payloadpayload", payload);

      setLoading(false);
      if (res.success) {
        Toast.show({ type: 'success', text1: 'Agency invited successfully' });
        // Reset form or navigate back
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsTagged(false);
      } else {
        Toast.show({ type: 'error', text1: res?.error?.message || 'Invite failed' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#0E3386', '#0E3386']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0 }}
        >
        </LinearGradient>

        {/* Form */}
        <View style={styles.card}>
          <FormField
            label="First Name *"
            value={firstName}
             onChangeText={(text:any) => {
                const filtered = text.replace(/[^A-Za-z\s]/g, '');
                setFirstName(filtered);
              }}
            placeholder="Enter first name"
          />

          <FormField
            label="Last Name *"
            value={lastName}
             onChangeText={(text:any)=> {
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
{/* Agency Type Dropdown */}
<View style={styles.formField}>
  <Text style={styles.fieldLabel}>Agency Role *</Text>

  <TouchableOpacity
    style={styles.dropdownButton}
    activeOpacity={0.7}
    onPress={() => setShowAgencyDropdown(!showAgencyDropdown)}
  >
    <Text style={styles.dropdownText}>
      {agencyType
        ? AGENCY_ROLES.find(r => r.value === agencyType)?.label
        : 'Select agency role'}
    </Text>
  </TouchableOpacity>

  {showAgencyDropdown && (
    <View style={styles.dropdownContainer}>
      {AGENCY_ROLES.map(role => {
        const isSelected = agencyType === role.value;
        return (
          <TouchableOpacity
            key={role.value}
            onPress={() => handleAgencyRoleSelect(role.value)}
            activeOpacity={0.7}
            style={[
              styles.dropdownItem,
              isSelected && styles.dropdownItemSelected,
            ]}
          >
            <Text
              style={[
                styles.dropdownItemText,
                isSelected && styles.dropdownItemTextSelected,
              ]}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )}
</View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Tag this agency to my team</Text>
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
          <Text style={styles.submitButtonText}>Invite Agency</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// const FormField = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default'
// }: any) => (
//   <View style={styles.formField}>
//     <Text style={styles.fieldLabel}>{label}</Text>
//     <TextInput
//       style={styles.input}
//       value={value}
//       onChangeText={onChangeText}
//       placeholder={placeholder}
//       placeholderTextColor="#999"
//       secureTextEntry={secureTextEntry}
//       keyboardType={keyboardType}
//     />
//   </View>
// );
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
      placeholderTextColor="#999"
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
    backgroundColor: 'white',
    borderRadius: 16,
    margin: Platform.OS === 'ios' ? 9 : 16,
    padding: Platform.OS === 'ios' ? 15 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0E3386',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
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

  dropdownButton: {
  borderWidth: 2,
    borderColor: '#0E3386',
height:50,
  borderRadius: 6,
  padding: 12,
  backgroundColor: '#fff',
},

dropdownText: {
  fontSize: 14,
  color: '#333',
},

dropdownContainer: {
  marginTop: 6,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 6,
  overflow: 'hidden',
},

dropdownItem: {
  padding: 12,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

dropdownItemSelected: {
  backgroundColor: '#EAF0FF',
},

dropdownItemText: {
  fontSize: 14,
  color: '#333',
},

dropdownItemTextSelected: {
  fontWeight: '700',
  color: '#0E3386',
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

export default InviteAgencyScreen;