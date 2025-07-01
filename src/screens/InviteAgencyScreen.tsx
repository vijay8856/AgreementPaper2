import React, { useState } from 'react';
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

const InviteAgencyScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTagged, setIsTagged] = useState(false);
    const [loading, setLoading] = useState(false);
const handleSubmit = async () => {
  // Simple validation (you can expand this)
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    Toast.show({ type: 'error', text1: 'Please fill all fields' });
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
    user_type: 'AGENCY_USER',
    is_authorized: isTagged, // true if tagged, false otherwise
  };

  try {
     setLoading(true);
    const res = await Services.inviteUsers(payload);
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
          colors={['#0E3386', '#1A3B8B']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>Invite New Agency</Text>
        </LinearGradient>

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
          
          <FormField
            label="Password *"
            value={password}
            onChangeText={setPassword}
            placeholder="Create password"
            secureTextEntry
          />
          
          <FormField
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
          />
          
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

const FormField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = 'default'
} :any) => (
  <View style={styles.formField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
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
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
});

export default InviteAgencyScreen;