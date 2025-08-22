
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Services from '../../Services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/NavigationManager';
import { StackNavigationProp } from '@react-navigation/stack';
type OrganizationProfileModal = StackNavigationProp<RootStackParamList, 'OrganizationProfileModal'>;
const OrganizationProfileModal = ({ visible, onComplete, onClose }: any) => {
     const navigation = useNavigation<OrganizationProfileModal>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    about_company: '',
    company_website: '',
    tax_number: '',
    country: '',
    state: '',
    district: '',
    pin_code: '',
    address: '',
    currency: '',
    logo: null, // { uri, name, type }
  });



    const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Toast.show({ type: 'success', text1: 'Logged out successfully' });
          navigation.reset({ index: 0, routes: [{ name: 'Login' as any }] } as const);
        },
      },
    ]);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await Services.updateOrganizationProfile(formData);

      if (response.success) {
        await AsyncStorage.setItem('isActive', 'true');
        onComplete();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Profile update failed',
          text2: response.error || 'Please try again',
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Toast.show({
        type: 'error',
        text1: 'An error occurred',
      });
    }
  };
const renderStep1 = () => (
  <View>
    <Text style={styles.modalTitle}>Company Profile</Text>
    <TextInput
      style={styles.input}
      placeholder="Business Name"
      value={formData.company_name}
      onChangeText={(text) => handleInputChange('company_name', text)}
    />
    <Text style={styles.sectionHeader}>Company Logo</Text>
    <TouchableOpacity style={styles.uploadButton}>
      <Text>Update Logo</Text>
    </TouchableOpacity>

    <Text style={styles.sectionHeader}>Company Description</Text>
    <TextInput
      style={[styles.input, { height: 100 }]}
      placeholder="Describe your company (industry, services/products, size)"
      multiline
      value={formData.about_company}
      onChangeText={(text) => handleInputChange('about_company', text)}
      maxLength={500}
    />

    <TextInput
      style={styles.input}
      placeholder="Company Website"
      value={formData.company_website}
      onChangeText={(text) => handleInputChange('company_website', text)}
      keyboardType="url"
    />

    <TextInput
      style={styles.input}
      placeholder="Company Tax IDs"
      value={formData.tax_number}
      onChangeText={(text) => handleInputChange('tax_number', text)}
    />

    {/* Continue button */}
    <TouchableOpacity 
      style={styles.continueButton}
      onPress={() => setStep(2)}
    >
      <Text style={styles.buttonText}>Continue</Text>
    </TouchableOpacity>

    {/* Logout button */}
    <TouchableOpacity 
      style={[styles.continueButton, { backgroundColor: 'red', marginTop: 10 }]}
      onPress={handleLogout}
    >
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  </View>
);


  const renderStep2 = () => (
    <View>
      <Text style={styles.modalTitle}>Company Address</Text>
      
      <Text style={styles.sectionHeader}>Geolocation</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for places"
      />

      <Text style={styles.sectionHeader}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        value={formData.country}
        onChangeText={(text) => handleInputChange('country', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="State"
        value={formData.state}
        onChangeText={(text) => handleInputChange('state', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="District/City"
        value={formData.district}
        onChangeText={(text) => handleInputChange('district', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Zip/Pin Code"
        value={formData.pin_code}
        onChangeText={(text) => handleInputChange('pin_code', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Currency"
        value={formData.currency}
        onChangeText={(text) => handleInputChange('currency', text)}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep(1)}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {step === 1 ? renderStep1() : renderStep2()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#6B7280',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OrganizationProfileModal;