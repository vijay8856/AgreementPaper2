
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  FlatList,
  ActivityIndicator as RNActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,

} from 'react-native';
import Services from '../../Services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/NavigationManager';
import { StackNavigationProp } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-crop-picker';

import { ActivityIndicator, Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";

type OrganizationProfileModalProps = {
  visible: boolean;
  onComplete: () => void;
  onClose: () => void;
};

type FormData = {
  company_name: string;
  about_company: string;
  company_website: string;
  tax_number: string;
  country: string;
  state: string;
  district: string;
  pin_code: string;
  address: string;
  currency: string;
  mobile_number: string;
  logo: { uri: string; type: string; name: string } | null;
  profilePic: { uri: string; type: string; name: string } | null;
  firstName: string;
  lastName: string;
  contactNumber: string;
  linkedIn: string;
  email: string;
};

type Errors = {
  company_name?: string;
  country?: string;
  state?: string;
  district?: string;
  pin_code?: string;
  address?: string;
  currency?: string;
  mobile_number?: string;
  contactNumber?: string;
  linkedIn?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type CountryResult = {
  name: string;
  code?: string;
  currency?: { currency: string };
};

type StateResult = {
  name: string;
  code?: string;
};

type OrganizationProfileModalNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OrganizationProfileModal'
>;

const OrganizationProfileModal: React.FC<OrganizationProfileModalProps> = ({
  visible,
  onComplete,
  onClose,
}) => {
  const navigation = useNavigation<OrganizationProfileModalNavigationProp>();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
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
    mobile_number: '',
    logo: null,
    profilePic: null,
    firstName: "",
    lastName: "",
    contactNumber: "",
    linkedIn: "",
    email: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryResults, setCountryResults] = useState<CountryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const [stateResults, setStateResults] = useState<StateResult[]>([]);
  const [countryLoading, setCountryLoading] = useState<boolean>(false);
  const [stateLoading, setStateLoading] = useState<boolean>(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [showStateDropdown, setShowStateDropdown] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [selectedFunctionalities, setSelectedFunctionalities] = useState<string[]>([]);
  const countryInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [displayCurrency, setDisplayCurrency] = useState("");
   const [otpEmail, setOtpEmail] = useState('');
    const [userEmail, setUserEmail] = useState("");
  console.log("displayCurrency", displayCurrency);
 const [addressConfirmed, setAddressConfirmed] = useState(false);
  const functionalities = [
    'Manage Contracts',
    'Manage Timesheets',
    'E-Signature',
    'HR management',
    'AI',
    'Invoice management'
  ];


//   const getAllStoredItems = async () => {
//   try {
//     // 1️⃣ Get every key that exists
//     const keys = await AsyncStorage.getAllKeys();

//     // 2️⃣ Fetch all the key–value pairs in one call
//     const items = await AsyncStorage.multiGet(keys);

//     // 3️⃣ Convert the array to a plain object if you like
//     const storeObject: Record<string, string | null> = {};
//     items.forEach(([key, value]) => {
//       storeObject[key] = value;
//     });

//     console.log('All stored items:', storeObject);
//     return storeObject;
//   } catch (error) {
//     console.error('Error reading AsyncStorage:', error);
//     return {};
//   }
// };
// useEffect(() => {
//   (async () => {
//     const allItems = await getAllStoredItems();
//     // Do something with allItems
//   })();
// }, []);
useEffect(() => {
  const loadUserData = async () => {
    const [
      [_, firstName],
      [, lastName],
      [, email],
      [, profilePicUri]
    ] = await AsyncStorage.multiGet([
      'first_Name',
      'last_Name',
      'email',
      'profilePic'
    ]);



    setFormData(prev => ({
      ...prev,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      profilePic: profilePicUri
        ? { uri: profilePicUri, type: 'image/jpeg', name: 'profile.jpg' }
        : null,
    }));
  };

  loadUserData();
}, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setShowCountryDropdown(false);
        setShowStateDropdown(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setShowCountryDropdown(false);
      setShowStateDropdown(false);
    }
  }, [visible]);


  const pickImage = async (field: 'logo' | 'profilePic'): Promise<void> => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: false,
      });

      const file = {
        uri: image.path,
        type: image.mime,
        name: `${field}.jpg`, // dynamic name
      };

      handleInputChange(field, file);
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.error(`${field} picker error:`, error);
      }
    }
  };
  // const handleCountrySelect = async (
  //   countryName: string,
  //   countryCode?: string,
  //   currencyCode?: string
  // ): Promise<void> => {
  //   handleInputChange("country", countryName);
  //   setSearchQuery(countryName);
  //   setShowCountryDropdown(false);

  //   if (currencyCode) {
  //     handleInputChange("currency", currencyCode);
  //   }

  //   handleInputChange("state", "");
  //   setStateResults([]);
  //   setShowStateDropdown(false);

  //   await fetchStatesForCountry(countryName);
  // };
  const handleCountrySelect = async (
    countryName: string,
    countryCode?: string,
    currencyId?: number,
    currencyName?: string,
    currencyCode?: string
  ): Promise<void> => {
    console.log("currencyId",currencyId);
    console.log("currencyName",currencyName);

    
    // Save country
    handleInputChange("country", countryName);
    setSearchQuery(countryName);
    setShowCountryDropdown(false);

    // Save currency id for backend
    if (currencyId) {
      handleInputChange("currency", currencyId);   // 👈 backend wants id
    }

    // Save display string for UI
    if (currencyName && currencyCode) {
      setDisplayCurrency(`${currencyName} (${currencyCode})`);
    }

    // Reset state dropdown
    handleInputChange("state", "");
    setStateResults([]);
    setShowStateDropdown(false);

    // Load states for selected country
    await fetchStatesForCountry(countryName);
  };
  const fetchStatesForCountry = async (countryName: string): Promise<void> => {
    if (!countryName) return;

    setStateLoading(true);
    const res = await Services.getCountryDetailsState(countryName);
    setStateLoading(false);

    if (res.success) {
      setStateResults(res.data);
    } else {
      setStateResults([]);
      Toast.show({
        type: 'error',
        text1: 'Failed to load states',
        text2: 'Please try again',
      });
    }
  };

  const handleStateSelect = (stateName: string): void => {
    handleInputChange('state', stateName);
    setShowStateDropdown(false);
  };

  const handleStateSearch = (text: string): void => {
    handleInputChange('state', text);
    if (text.length > 0) {
      setShowStateDropdown(true);
    } else {
      setShowStateDropdown(false);
    }
  };

const validateStep1 = (): boolean => {
  const newErrors: Errors = {};

  // Trim to remove accidental leading/trailing spaces
  const name = formData.company_name.trim();

  if (!name) {
    newErrors.company_name = 'Business name is required';
  } else if (!/^[A-Za-z0-9 ]+$/.test(name)) {
    // Regex allows only letters, numbers and spaces
    newErrors.company_name = 'Business name cannot contain symbols';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const validateStep2 = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District/City is required';
    if (!formData.pin_code.trim()) newErrors.pin_code = 'PIN code is required';
    // if (!formData.address.trim()) newErrors.address = 'Address is required';
    // if (!formData.currency.trim()) newErrors.currency = 'Currency is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Contact Number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // LinkedIn validation (optional but must be valid if provided)
    if (formData.linkedIn.trim() && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(formData.linkedIn)) {
      newErrors.linkedIn = 'Please enter a valid LinkedIn profile URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (): void => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleSearchCountry = async (text: string): Promise<void> => {
    setSearchQuery(text);
    handleInputChange('country', text);

    if (text.length < 1) {
      setCountryResults([]);
      setShowCountryDropdown(false);
      return;
    }

    setShowCountryDropdown(true);
    setCountryLoading(true);
    const res = await Services.searchCountry(text);
    setCountryLoading(false);

    if (res.success) {
      setCountryResults(res.data);
    } else {
      setCountryResults([]);
    }
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Toast.show({ type: 'success', text1: 'Logged out successfully' });
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };


  const handleInputChange = (name: keyof FormData, value: any): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'country') {
      setFormData((prev) => ({ ...prev, state: '' }));
      setStateResults([]);
      setShowStateDropdown(false);
    }
  };

  const toggleFunctionality = (func: string): void => {
    if (selectedFunctionalities.includes(func)) {
      setSelectedFunctionalities(selectedFunctionalities.filter(f => f !== func));
    } else {
      setSelectedFunctionalities([...selectedFunctionalities, func]);
    }
  };

  // const handleSubmit = async (): Promise<void> => {
  //   setLoading(true);
  //   try {
  //     const response = await Services.updateOrganizationProfile(formData);

  //     if (response.success) {
  //       await AsyncStorage.setItem('isActive', 'true');
  //       onComplete();
  //     } else {
  //       Toast.show({
  //         type: 'error',  
  //         text1: 'Profile update failed',
  //         text2: response.error || 'Please try again',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Profile update error:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'An error occurred',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (): Promise<void> => {
  setLoading(true);
  try {
    // Get user type from AsyncStorage
    const userType = await AsyncStorage.getItem('userType');
    
    let response;
    
    // Call the appropriate API based on user type
    switch(userType) {
      case 'LAWYER_USER':
        response = await Services.updateLawyerProfile(formData);
        break;
      case 'AGENCY_USER':
        response = await Services.updateAgencyProfile(formData);
        break;
      case 'RESOURCE_USER':
        response = await Services.updateResourceProfile(formData);
        break;
      case 'ORGANISATION_USER':
        response = await Services.updateOrganizationProfile(formData);
        break;
 
      default:
        throw new Error('Unknown user type');
    }

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
      text2: error.message || 'Please try again later',
    });
  } finally {
    setLoading(false);
  }
};
  const handleBack = (): void => {
    if (step === 1) {
      onClose();
    } else {
      setStep(step - 1);
    }
  };
  const pickLogo = () => pickImage('logo');
  const handleUploadProfilePic = () => pickImage('profilePic');
  const renderStep1 = (): JSX.Element => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={22} color="#2563eb" />
        </TouchableOpacity> */}
        <Text style={styles.title}>Company Information</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            {formData.logo ? (
              <Image source={{ uri: formData.logo.uri }} style={styles.logoImage} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Icon name="business" size={40} color="#3b82f6" />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={pickLogo} disabled={uploading}>
            {uploading ? (
              <RNActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="cloud-upload" size={16} color="#fff" style={styles.uploadIcon} />
                <Text style={styles.uploadButtonText}>
                  {formData.logo ? 'Change Logo' : 'Upload Logo'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Business Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.company_name && styles.inputError]}
            placeholder="Enter your business name"
            value={formData.company_name}
            onChangeText={(text) => handleInputChange('company_name', text)}
          />
          {errors.company_name && <Text style={styles.errorText}>{errors.company_name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your company (industry, services/products, size)"
            multiline
            numberOfLines={4}
            value={formData.about_company}
            onChangeText={(text) => handleInputChange('about_company', text)}
            maxLength={500}
          />
          <Text style={styles.charCount}>{formData.about_company.length}/500 characters</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Website</Text>
          <TextInput
            style={styles.input}
            placeholder="https://www.example.com"
            value={formData.company_website}
            onChangeText={(text) => handleInputChange('company_website', text)}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Tax ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tax identification number"
            value={formData.tax_number}
            onChangeText={(text) => handleInputChange('tax_number', text)}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderStep2 = (): JSX.Element => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={22} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.title}>Company Address</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        <View style={styles.inputGroup}>
      <Text style={styles.label}>Address</Text>

      <TextInput
        style={[styles.input, errors.address && styles.inputError]}
        placeholder="House No./Street Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
        multiline
        numberOfLines={2}
      />

      {errors.address && (
        <Text style={styles.errorText}>{errors.address}</Text>
      )}

      {/* ✅ Confirmation line with checkbox */}
     
    </View>
       

        <View style={styles.row}>
          <View style={[styles.flex, styles.inputGroupWithDropdown]}>
            <Text style={styles.label}>
              Country <Text style={styles.required}>*</Text>
            </Text>
            <View>
              <TextInput
                ref={countryInputRef}
                style={[styles.input, errors.country && styles.inputError]}
                placeholder="Search country"
                
                value={formData.country}
                onChangeText={handleSearchCountry}
                onFocus={() => {
                  if (formData.country.length > 1) {
                    setShowCountryDropdown(true);
                  }
                }}
                // onBlur={() => {
                //   setTimeout(() => setShowCountryDropdown(false), 200);
                // }}
              />
              {countryLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text style={styles.loadingText}>Searching...</Text>
                </View>
              )}
                  {/* Show "no results" message when no countries found */}
            {showCountryDropdown && countryResults.length === 0 && !countryLoading && (
              <View style={[styles.dropdown, styles.countryDropdown]}>
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No countries found for your search
                  </Text>
                </View>
              </View>
            )}
              {showCountryDropdown && countryResults.length > 0 && (
                <View style={[styles.dropdown, styles.countryDropdown]}>
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled={true}
                    style={styles.dropdownScroll}
                  >
                    {countryResults.map((item, index) => {
                      // const currencyCode = item.currency?.currency ?? "";
                      const currencyId = item.currency?.id ?? null; // pk for backend
                      const currencyCode = item.currency?.currency ?? ""; // e.g. "INR"
                      const currencyName = item.currency?.currency ?? ""; // e.g. "Indian Rupee"

                      return (
                        <TouchableOpacity
                          key={index.toString()}
                          style={styles.dropdownItem}
                          onPress={() => handleCountrySelect(
                            item.name,
                            item.code,
                            currencyId,
                            currencyName,
                            currencyCode
                          )}
                        >
                          <Text style={styles.dropdownText}>
                            {item.name} {currencyCode && `(${currencyCode})`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>

          <View style={[styles.flex, styles.inputGroupWithDropdown, styles.leftMargin]}>
            <Text style={styles.label}>
              State <Text style={styles.required}>*</Text>
            </Text>
            <View>
              <TextInput
                ref={stateInputRef}
                style={[styles.input, errors.state && styles.inputError]}
                placeholder="Select state"
                value={formData.state}
                onChangeText={handleStateSearch}
                onFocus={() => {
                  if (!formData.country) {
                    Toast.show({
                      type: 'error',
                      text1: 'Please select a country first',
                    });
                    stateInputRef.current?.blur();
                    return;
                  }
                  if (stateResults.length > 0) {
                    setShowStateDropdown(true);
                  }
                }}
                // onBlur={() => {
                //   setTimeout(() => setShowStateDropdown(false), 200);
                // }}
                editable={!!formData.country}
              />
              {stateLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text style={styles.loadingText}>Loading states...</Text>
                </View>
              )}

              {showStateDropdown && stateResults.length > 0 && (
                <View style={[styles.dropdown, styles.stateDropdown]}>
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled={true}
                    style={styles.dropdownScroll}
                  >
                    {stateResults
                      .filter(state =>
                        state.name.toLowerCase().includes(formData.state.toLowerCase())
                      )
                      .map((item, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          style={styles.dropdownItem}
                          onPress={() => handleStateSelect(item.name)}
                        >
                          <Text style={styles.dropdownText}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </ScrollView>
                </View>
              )}
            </View>
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.flex, styles.inputGroup]}>
            <Text style={styles.label}>
              District / City <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.district && styles.inputError]}
              placeholder="Enter city"
              value={formData.district}
              onChangeText={(text) => handleInputChange('district', text)}
            />
            {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
          </View>

          <View style={[styles.flex, styles.inputGroup, styles.leftMargin]}>
            <Text style={styles.label}>
              PIN Code <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.pin_code && styles.inputError]}
              placeholder="PIN Code"
              keyboardType="numeric"
              value={formData.pin_code}
              onChangeText={(text) => handleInputChange('pin_code', text)}
              maxLength={10}
            />
            {errors.pin_code && <Text style={styles.errorText}>{errors.pin_code}</Text>}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Currency <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.currency && styles.inputError]}
            placeholder="Currency (e.g. INR, USD)"
            value={displayCurrency}
            onChangeText={(text) => handleInputChange('currency', text)}
            editable={false}
          />
          {errors.currency && <Text style={styles.errorText}>{errors.currency}</Text>}
        </View>
 <View style={styles.confirmRow}>
        <Checkbox
          status={addressConfirmed ? 'checked' : 'unchecked'}
          onPress={() => setAddressConfirmed(!addressConfirmed)}
          color="#3b82f6" // optional custom color
        />
        <Text
          style={styles.confirmText}
          onPress={() => setAddressConfirmed(!addressConfirmed)}
        >
          Please confirm this is your correct address
        </Text>
      </View>

      {/* Optional validation message */}
      {!addressConfirmed && (
        <Text style={styles.confirmHint}>
          You must confirm your address before continuing.
        </Text>
      )}
      <TouchableOpacity
  style={[
    styles.primaryButton2,
    !addressConfirmed && styles.primaryButtonDisabled, // gray out when disabled
  ]}
  onPress={handleContinue}
  disabled={!addressConfirmed}   // ✅ Disable when not confirmed
>
  <Text style={styles.primaryButtonText}>Continue</Text>
</TouchableOpacity>
      </ScrollView>
    </View>
  );

  //   const renderStep3 = (): JSX.Element => (
  //   <View style={styles.container}>
  //      <ScrollView
  //         style={styles.formContainer}
  //         keyboardShouldPersistTaps="handled"
  //         ref={scrollViewRef}
  //       >
  //      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
  //           <Icon name="arrow-back" size={22} color="#2563eb" />
  //         </TouchableOpacity>
  //       {/* Profile Pic Upload */}
  //      <View style={styles.profilePicContainer}>
  //   {formData.profilePic ? (
  //     <Image source={{ uri: formData.profilePic.uri }} style={styles.profilePic} />
  //   ) : (
  //    <Image
  //   source={require('../../assets/images/user.png')}
  //   style={styles.profilePic}
  //   resizeMode="cover"
  // />

  //   )}
  //   <TouchableOpacity
  //     style={styles.editPicButton}
  //     onPress={handleUploadProfilePic}
  //   >
  //     <Text style={styles.editPicButtonText}>Upload</Text>
  //   </TouchableOpacity>
  // </View>


  //       {/* Inputs */}
  //       <TextInput
  //         style={styles.input3}
  //         placeholder="First Name"
  //         value={formData.firstName}
  //         onChangeText={(text) => handleInputChange("firstName", text)}
  //       />
  //       <TextInput
  //         style={styles.input3}
  //         placeholder="Last Name"
  //         value={formData.lastName}
  //         onChangeText={(text) => handleInputChange("lastName", text)}
  //       />
  //       <TextInput
  //         style={styles.input3}
  //         placeholder="Contact Number"
  //         keyboardType="phone-pad"
  //         value={formData.contactNumber}
  //         maxLength={10}
  //         onChangeText={(text) => handleInputChange("contactNumber", text)}
  //       />
  //       <TextInput
  //         style={styles.input3}
  //         placeholder="LinkedIn Profile"
  //         value={formData.linkedIn}
  //         onChangeText={(text) => handleInputChange("linkedIn", text)}
  //       />
  //       <TextInput
  //         style={styles.input3}
  //         placeholder="Email ID"
  //         keyboardType="email-address"
  //         value={formData.email}
  //         onChangeText={(text) => handleInputChange("email", text)}
  //       />

  //       {/* Continue Button */}
  //    <TouchableOpacity
  //           style={styles.primaryButton}
  //           onPress={handleContinue}
  //         >
  //           <Text style={styles.primaryButtonText}>Continue</Text>
  //         </TouchableOpacity>
  //         </ScrollView>
  //     </View>
  // );
  const renderStep3 = (): JSX.Element => (


    
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={22} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.title}>Owner Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        {/* Profile Pic Upload */}
        <View style={styles.profilePicContainer}>
          {formData.profilePic ? (
            <Image source={{ uri: formData.profilePic.uri }} style={styles.profilePic} />
          ) : (
            <Image
              source={require('../../assets/images/user.png')}
              style={styles.profilePic}
              resizeMode="cover"
            />
          )}
          <TouchableOpacity
            style={styles.editPicButton}
            onPress={handleUploadProfilePic}
          >
            <Text style={styles.editPicButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs with validation */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => handleInputChange("lastName", text)}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number *</Text>
          <TextInput
            style={[styles.input, errors.contactNumber && styles.inputError]}
            placeholder="Contact Number"
            keyboardType="phone-pad"
            value={formData.contactNumber}
            maxLength={10}
            onChangeText={(text) => handleInputChange("contactNumber", text)}
          />
          {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
        </View>

        {/* <View style={styles.inputGroup}>
          <Text style={styles.label}>LinkedIn Profile</Text>
          <TextInput
            style={[styles.input, errors.linkedIn && styles.inputError]}
            placeholder="LinkedIn Profile URL"
            value={formData.linkedIn}
            onChangeText={(text) => handleInputChange("linkedIn", text)}
          />
          {errors.linkedIn && <Text style={styles.errorText}>{errors.linkedIn}</Text>}
        </View> */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email ID"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderStep4 = (): JSX.Element => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={22} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Functionalities</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        <Text style={styles.sectionTitle}>
          Which of the following functionality do you want to use?
        </Text>

        {functionalities.map((func, index) => (
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() => toggleFunctionality(func)}
          >
            <View style={styles.checkbox}>
              {selectedFunctionalities.includes(func) && (
                <Icon name="checkmark" size={20} color="#2563eb" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{func}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <RNActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isKeyboardVisible && styles.modalContentKeyboardOpen]}>
            {step === 1 ? renderStep1() :
              step === 2 ? renderStep2() :
                step === 3 ? renderStep3() :
                  renderStep4()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({


  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

    primaryButton2: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: '#a5b4fc', // lighter/greyish color
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
    inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', marginTop: 4 },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  confirmText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  confirmHint: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 30,
    color: "#666",
  },
  editPicButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: "#007bff",
    borderRadius: 20,
  },
  editPicButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  input3: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  modalContent: {
    width: '90%',
    height: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContentKeyboardOpen: {
    height: '95%',
  },
  stepContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupWithDropdown: {
    marginBottom: 16,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  leftMargin: {
    marginLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 20000,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  countryDropdown: {
    zIndex: 10001,
  },
  stateDropdown: {
    zIndex: 10001,
  },
    noResultsContainer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  noResultsText: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#64748b',
  },
  primaryButton2: {

    backgroundColor: '#0E3386',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30

  },
  primaryButton: {
    backgroundColor: '#0E3386',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 15
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#0E3386',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: '#374151',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
});

export default OrganizationProfileModal;