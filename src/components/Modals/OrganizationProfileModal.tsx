
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
  useColorScheme
} from 'react-native';
import Services from '../../Services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/NavigationManager';
import { StackNavigationProp } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-crop-picker';
import { Pressable } from 'react-native';

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
  specialization_data: number[];
  bar_registration_number: string;
  experience: string;
  jurisdiction_licensed: string;

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
  specialization_data: number[];
  bar_registration_number: string;
  experience: string;
  jurisdiction_licensed: string;
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
    specialization_data: [],
    bar_registration_number: '',
    experience: '',
    jurisdiction_licensed: '',
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const [stateResults, setStateResults] = useState<StateResult[]>([]);
  const [countryLoading, setCountryLoading] = useState<boolean>(false);
  const [stateLoading, setStateLoading] = useState<boolean>(false);
  const [showStateDropdown, setShowStateDropdown] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [selectedFunctionalities, setSelectedFunctionalities] = useState<string[]>([]);
  const countryInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [displayCurrency, setDisplayCurrency] = useState("");
  const [otpEmail, setOtpEmail] = useState('');
  const [userEmail, setUserEmail] = useState("");
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [userType, setUserType] = useState("");


  // ---- Specialization ----
  const [specializationList, setSpecializationList] = useState<
    { id: number; name: string }[]
  >([]);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);



  const [specializationLoading, setSpecializationLoading] = useState(false);



  // ---- Company Country ----
  const [countrySearch, setCountrySearch] = useState('');
  const [countryResults, setCountryResults] = useState<CountryResult[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // ---- Jurisdiction Country ----
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [jurisdictionResults, setJurisdictionResults] = useState<CountryResult[]>([]);
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);



  // ---- Errors (if not already present) ----



  const functionalities = [
    'Manage Contracts',
    'Manage Timesheets',
    'E-Signature',
    'HR management',
    'AI',
    'Invoice management'
  ];

  const isDark = useColorScheme() === 'dark';
  console.log("isdark", isDark);

  const themeColors = {
    background: isDark ? '#111827' : '#FFFFFF',
    modalBg: isDark ? '#1F2937' : '#FFFFFF',
    headerBg: isDark ? '#020617' : '#F8FAFC',

    text: isDark ? '#F9FAFB' : '#111827',
    subText: isDark ? '#D1D5DB' : '#374151',
    placeholder: isDark ? '#9CA3AF' : '#6B7280',

    inputBg: isDark ? '#020617' : '#F9FAFB',
    border: isDark ? '#D1D5DB' : '#374151',
    error: '#EF4444',

    primary: '#0E3386',
    disabled: isDark ? '#374151' : '#93C5FD',

    dropdownBg: isDark ? '#020617' : '#FFFFFF',
    selectedBg: isDark ? '#1E3A8A' : '#E6EBFF',


    checkboxBg: isDark ? '#020617' : '#FFFFFF',
    checkboxSelectedBg: isDark ? '#1E3A8A' : '#E6EBFF',


  };

  const closeAllDropdowns = () => {
    setShowCountryDropdown(false);
    setShowStateDropdown(false);
    setShowSpecializationDropdown(false);
    setShowJurisdictionDropdown(false);
  };

useEffect(() => {
  if (!visible) return;

  const initStep = async () => {
    const type = await AsyncStorage.getItem('userType');
    setUserType(type || '');

    if (type === 'RESOURCE_USER') {
      setStep(2); // ✅ start from Step 2
    } else {
      setStep(1);
    }
  };

  initStep();
}, [visible]);



  const themedInputStyle = (hasError?: boolean) => ([
    styles.input,
    {
      backgroundColor: themeColors.inputBg,
      borderColor: hasError ? themeColors.error : themeColors.border,
      color: themeColors.text,
    },
  ]);
  const handleSearchCountry = async (text: string) => {
    setCountrySearch(text);
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
    setCountryResults(res.success ? res.data : []);
  };
  const handleJurisdictionSearch = async (text: string) => {
    setJurisdictionSearch(text);
    handleInputChange('jurisdiction_licensed', text);

    if (text.length < 1) {
      setJurisdictionResults([]);
      setShowJurisdictionDropdown(false);
      return;
    }

    setShowJurisdictionDropdown(true);

    const res = await Services.searchCountry(text);

    setJurisdictionResults(res.success ? res.data : []);
  };

  // ⬇️ ADD THIS — Skip Step 1 & 2 for RESOURCE_USER
  // useEffect(() => {
  //   const checkUserType = async () => {
  //     const userType = await AsyncStorage.getItem("userType");

  //     if (userType === "RESOURCE_USER") {
  //       setStep(3);  // ⬅️ Jump directly to Owner Profile step
  //     }
  //   };

  //   checkUserType();
  // }, []);
  useEffect(() => {
    const loadType = async () => {
      const type = await AsyncStorage.getItem("userType");
      setUserType(type || "");
    };
    loadType();
  }, []);

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

  // 🔹 Dummy Specialization API


  const loadSpecializations = async () => {
    try {
      setSpecializationLoading(true);

      const res = await Services.getLawyerSpecialization();

      if (res.success) {
        // Adjust mapping if backend keys differ
        const mappedData = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

        setSpecializationList(mappedData);
      } else {
        console.log('Failed to load specialization', res.error);
      }
    } catch (e) {
      console.log('Specialization API error', e);
    } finally {
      setSpecializationLoading(false);
    }
  };




  useEffect(() => {
    if (userType === 'LAWYER_USER') {
      loadSpecializations()

      // fetchCountries().then(setCountryResults);
    }
  }, [userType]);
  const toggleSpecialization = (id: number) => {
    setFormData((prev: any) => ({
      ...prev,
      specialization_data: prev.specialization_data.includes(id)
        ? prev.specialization_data.filter((v: number) => v !== id)
        : [...prev.specialization_data, id],
    }));
  };



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

  const handleCountrySelect = async (
    countryName: string,
    countryCode?: string,
    currencyId?: number,
    currencyName?: string,
    currencyCode?: string
  ): Promise<void> => {


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




  const handleJurisdictionSelect = (countryName: string) => {
    handleInputChange('jurisdiction_licensed', countryName);
    setJurisdictionSearch(countryName);
    setShowJurisdictionDropdown(false);
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

  // ✅ ONLY FOR LAWYER
  if (userType === 'LAWYER_USER') {
    if (formData.specialization_data.length === 0) {
      newErrors.specialization_data = 'Please select at least one specialization';
    }

    if (!formData.jurisdiction_licensed) {
      newErrors.jurisdiction_licensed = 'Please select jurisdiction country';
    }
  }

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
const shouldDisableContinue =
  userType === 'RESOURCE_USER' &&
  step === 2 &&
  !addressConfirmed;


const handleContinue = () => {
  console.log('UserType:', userType, 'Step:', step);

  // ================= RESOURCE USER =================
  if (userType === 'RESOURCE_USER') {

    if (step === 2) {
      if (!addressConfirmed) {
        Alert.alert(
          'Confirmation Required',
          'Please confirm your address before continuing.'
        );
        return;
      }

      if (!validateStep2()) return;
      setStep(3); // ✅ Step 2 → Step 3
      return;
    }

    if (step === 3) {
      if (!validateStep3()) return;
      setStep(4); // ✅ Step 3 → Step 4
      return;
    }

    return;
  }

  // ================= ALL OTHER USERS =================
  if (step === 1) {
    if (!validateStep1()) return;
    setStep(2);
    return;
  }

  if (step === 2) {
    if (!validateStep2()) return;
    setStep(3);
    return;
  }

  if (step === 3) {
    if (!validateStep3()) return;
    setStep(4);
    return;
  }
};






  // const handleSearchCountry = async (text: string): Promise<void> => {
  //   setSearchQuery(text);
  //   handleInputChange('country', text);

  //   if (text.length < 1) {
  //     setCountryResults([]);
  //     setShowCountryDropdown(false);
  //     return;
  //   }

  //   setShowCountryDropdown(true);
  //   setCountryLoading(true);
  //   const res = await Services.searchCountry(text);
  //   setCountryLoading(false);

  //   if (res.success) {
  //     setCountryResults(res.data);
  //   } else {
  //     setCountryResults([]);
  //   }
  // };
  const selectedSpecializationNames = specializationList
    .filter(item => formData.specialization_data.includes(item.id))
    .map(item => item.name)
    .join(', ');

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


  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {

      const userType = await AsyncStorage.getItem('userType');

      let response;


      switch (userType) {

        case 'AGENCY_USER':
          response = await Services.updateAgencyProfile(formData);
          break;
        case 'RESOURCE_USER':
          response = await Services.updateResourceProfile(formData);
          console.log("lods",response);
          
          break;
        case 'ORGANISATION_USER':
          response = await Services.updateOrganizationProfile(formData);
          break;
        case 'LAWYER_USER':
          response = await Services.updateLawyerProfile(formData);
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
    } catch (error: any) {
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

  const handleBack = () => {

    if (userType === "RESOURCE_USER") {
      if (step === 3) return;
      if (step === 2) {
        setStep(3);
        return;
      }
      if (step === 4) {
        setStep(2);
        return;
      }
      return;
    }

    // Default back flow
    if (step === 1) onClose();
    else setStep(step - 1);
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
            style={[
              styles.input,
              {
                backgroundColor: themeColors.inputBg,
                borderColor: themeColors.border,
                color: themeColors.text,
              },
              errors.company_name && { borderColor: themeColors.error },
            ]}
            placeholder="Enter your business name"
            placeholderTextColor={themeColors.placeholder}
            value={formData.company_name}
            onChangeText={(text) => handleInputChange('company_name', text)}
          />

        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Description</Text>
          <TextInput
            style={[
              ...themedInputStyle(),
              styles.textArea,
            ]}
            placeholder="Describe your company (industry, services/products, size)"
            placeholderTextColor={themeColors.placeholder}
            multiline
            numberOfLines={4}
            maxLength={500}
            value={formData.about_company}
            onChangeText={(text) => handleInputChange('about_company', text)}
          />

          <Text style={styles.charCount}>{formData.about_company.length}/500 characters</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Website</Text>
          <TextInput
            style={themedInputStyle()}
            placeholder="https://www.example.com"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="url"
            autoCapitalize="none"
            value={formData.company_website}
            onChangeText={(text) => handleInputChange('company_website', text)}
          />

        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Tax ID</Text>
          <TextInput
            style={themedInputStyle()}
            placeholder="Enter tax identification number"
            placeholderTextColor={themeColors.placeholder}
            value={formData.tax_number}
            onChangeText={(text) => handleInputChange('tax_number', text)}
          />

        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
          disabled={userType === "RESOURCE_USER"}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text> */}


        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderStep2 = (): JSX.Element => (

    <Pressable
      style={{ flex: 1 }}
      onPress={closeAllDropdowns}
    >

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
              style={[
                ...themedInputStyle(!!errors.address),
                styles.textArea,
              ]}
              placeholder="House No./Street Address"
              placeholderTextColor={themeColors.placeholder}
              multiline
              numberOfLines={2}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
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
                  style={themedInputStyle(!!errors.country)}
                  placeholder="Search country"
                  placeholderTextColor={themeColors.placeholder}
                  value={formData.country}
                  onChangeText={handleSearchCountry}
                  onFocus={() => {
                    if (formData.country.length > 1) setShowCountryDropdown(true);
                  }}
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
                  style={themedInputStyle(!!errors.state)}
                  placeholder="Select state"
                  placeholderTextColor={themeColors.placeholder}
                  value={formData.state}
                  onChangeText={handleStateSearch}
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
                style={themedInputStyle(!!errors.district)}
                placeholder="Enter city"
                placeholderTextColor={themeColors.placeholder}
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
                style={themedInputStyle(!!errors.pin_code)}
                placeholder="PIN Code"
                placeholderTextColor={themeColors.placeholder}
                keyboardType="numeric"
                maxLength={10}
                value={formData.pin_code}
                onChangeText={(text) => handleInputChange('pin_code', text)}
              />

              {errors.pin_code && <Text style={styles.errorText}>{errors.pin_code}</Text>}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Currency <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={themedInputStyle(!!errors.currency)}
              placeholder="Currency"
              placeholderTextColor={themeColors.placeholder}
              value={displayCurrency}
              editable={false}
            />

            {errors.currency && <Text style={styles.errorText}>{errors.currency}</Text>}
          </View>



          {userType === "LAWYER_USER" && (
            <>
              {/* Select Specialization */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Specialization</Text>

                <TouchableOpacity
                  style={themedInputStyle(!!errors.specialization_data)}
                  onPress={() => setShowSpecializationDropdown(true)}
                >
                  <Text
                    style={{
                      color: selectedSpecializationNames
                        ? '#191717ff'
                        : themeColors.placeholder,
                    }}
                  >
                    {selectedSpecializationNames || 'Specialization'}
                  </Text>
                </TouchableOpacity>

                {showSpecializationDropdown && (
                  // <Pressable onPress={(e) => e.stopPropagation()}>
                  <View style={styles.dropdown}>
                    {specializationLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#2563eb" />
                        <Text style={styles.loadingText}>Loading...</Text>
                      </View>
                    ) : (
                      <ScrollView nestedScrollEnabled>
                        {specializationList.map((item) => {
                          const selected = formData.specialization_data.includes(item.id);

                          return (
                            <TouchableOpacity
                              key={item.id}
                              style={styles.dropdownItem}
                              onPress={() => toggleSpecialization(item.id)}
                            >
                              <Text
                                style={[
                                  styles.dropdownText,
                                  { color: isDark ? '#FFFFFF' : '#0a0b0dff' },
                                ]}
                              >
                                {selected ? '✓ ' : ''}{item.name}
                              </Text>


                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>

                    )}
                  </View>
                  // </Pressable>
                )}

              </View>

              {/* Bar Registration + Experience */}
              <View style={styles.row}>
                <View style={[styles.flex, styles.inputGroup]}>
                  <Text style={styles.label}>Bar Registration Number</Text>
                  <TextInput
                    style={themedInputStyle()}
                    placeholder="Bar registration number"
                    keyboardType="numeric"
                    value={formData.bar_registration_number}
                    onChangeText={(t) =>
                      handleInputChange('bar_registration_number', t)
                    }
                  />
                </View>

                <View style={[styles.flex, styles.inputGroup, styles.leftMargin]}>
                  <Text style={styles.label}>Total Experience (in year)</Text>
                  <TextInput
                    style={themedInputStyle()}
                    placeholder="Experience (in year)"
                    keyboardType="numeric"
                    value={formData.experience}
                    onChangeText={(t) =>
                      handleInputChange('experience', t)
                    }
                  />
                </View>
              </View>

              {/* Jurisdiction Licensed Country */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Jurisdiction Licensed Country</Text>

                <TextInput
                  style={themedInputStyle(!!errors.jurisdiction_licensed)}
                  placeholder="Search country"
                  placeholderTextColor={themeColors.placeholder}
                  value={formData.jurisdiction_licensed}
                  onChangeText={handleJurisdictionSearch}
                  onFocus={() => {
                    if (formData.jurisdiction_licensed.length > 1) {
                      setShowJurisdictionDropdown(true);
                    }
                  }}
                />

                {showJurisdictionDropdown && jurisdictionResults.length > 0 && (
                  <View style={[styles.dropdown, styles.countryDropdown]}>
                    <ScrollView
                      keyboardShouldPersistTaps="always"
                      nestedScrollEnabled
                      style={styles.dropdownScroll}
                    >
                      {jurisdictionResults.map((item, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          style={styles.dropdownItem}
                          onPress={() => handleJurisdictionSelect(item.name)}
                        >
                          <Text style={styles.dropdownText}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}


                {errors.jurisdiction_licensed && (
                  <Text style={styles.errorText}>{errors.jurisdiction_licensed}</Text>
                )}
              </View>

            </>
          )}

          <View style={styles.confirmRow}>
            <TouchableOpacity
              onPress={() => setAddressConfirmed(!addressConfirmed)}
              style={{
                marginRight: 3,
                width: 22,
                height: 22,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: addressConfirmed ? '#3b82f6' : '#9ca3af',
                backgroundColor: addressConfirmed ? '#3b82f6' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {addressConfirmed && (
                <Icon name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>

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
    // shouldDisableContinue && styles.primaryButtonDisabled,
  ]}
  onPress={handleContinue}
  // disabled={shouldDisableContinue}
>
  <Text style={styles.primaryButtonText}>Continue</Text>
</TouchableOpacity>


        </ScrollView>
      </View>
    </Pressable>
  );

  const renderStep3 = (): JSX.Element => (
    <View style={styles.container}>

      <View style={styles.header}>

        {/* ⭐ Hide back button if userType = RESOURCE_USER */}
        {userType !== "RESOURCE_USER" ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={22} color="#2563eb" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />  // keep layout aligned
        )}

        <Text style={styles.title}>Owner Profile</Text>

        {/* Right spacer section */}
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
            style={themedInputStyle(!!errors.firstName)}
            placeholder="First Name"
            placeholderTextColor={themeColors.placeholder}
            value={formData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
          />

          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={themedInputStyle(!!errors.lastName)}
            placeholder="Last Name"
            placeholderTextColor={themeColors.placeholder}
            value={formData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
          />

          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number *</Text>
          <TextInput
            style={themedInputStyle(!!errors.contactNumber)}
            placeholder="Contact Number"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.contactNumber}
            onChangeText={(text) => handleInputChange('contactNumber', text)}
          />

          {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID *</Text>
          <TextInput
            style={themedInputStyle(!!errors.email)}
            placeholder="Email ID"
            placeholderTextColor={themeColors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
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
    <View style={[styles.stepContainer, { backgroundColor: themeColors.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.headerBg }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={22} color={themeColors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: themeColors.text }]}>
          Select Functionalities
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        <Text style={[styles.sectionTitle, { color: themeColors.subText }]}>
          Which of the following functionality do you want to use?
        </Text>

        {functionalities.map((func, index) => {
          const isSelected = selectedFunctionalities.includes(func);

          return (
            <TouchableOpacity
              key={index}
              style={styles.checkboxContainer}
              onPress={() => toggleFunctionality(func)}
              activeOpacity={0.7}
            >
              {/* Checkbox */}
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: themeColors.border,
                    backgroundColor: isSelected
                      ? themeColors.checkboxSelectedBg
                      : themeColors.checkboxBg,
                  },
                ]}
              >
                {isSelected && (
                  <Icon
                    name="checkmark"
                    size={18}
                    color={themeColors.primary}
                  />
                )}
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.checkboxLabel,
                  { color: themeColors.text },
                ]}
              >
                {func}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: loading
                ? themeColors.disabled
                : themeColors.primary,
            },
          ]}
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