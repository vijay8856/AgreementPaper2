// @ts-nocheck

import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import Services from '../Services/services';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';
import { useEffect } from 'react';
// import { GOOGLE_CLIENT_ID } from '@env';
import {
  validateSignupForm,
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
  validateSignupType
} from '../utils/validations';
import { useColorScheme } from 'react-native';
const SIGNUP_TYPES = [
  { label: 'Individual Buyer', value: 'INDIVIDUAL_USER' },
  { label: 'Supplier & Agency Network', value: 'AGENCY_USER' },
  { label: 'Talent', value: 'RESOURCE_USER' },
  { label: 'Lawyer Network', value: 'LAWYER_USER' },
  { label: 'Enterprise', value: 'ORGANISATION_USER' },
];
const AGENCY_ROLES = [
  { label: 'Recruiter', value: 'RECRUITER' },
  { label: 'Real Estate Agent', value: 'REAL_ESTATE_AGENT' },
  { label: 'Goods & Services Supplier', value: 'GOODS_AND_SERVICE_SUPPLIER' },
];

const AGENCY_ROLE_KEY = 'AGENCY_ROLE';

const SignUpScreen: React.FC = () => {


  const GOOGLE_CLIENT_ID = "601221483061-eadrdpe1opnslp4sug89v8mpugebj68f.apps.googleusercontent.com"
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [agencyRole, setAgencyRole] = useState<string>('');
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [signupType, setSignupType] = useState<string>(''); // Initially empty, so user must choose
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [referralCode, setreferralCode] = useState('')
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTypeInfo, setSelectedTypeInfo] = useState<{ label: string, value: string } | null>(null);
  const [selectedAgencyRole, setSelectedAgencyRole] = useState<string | null>(null);

  console.log("selectedAgencyRole", selectedAgencyRole);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';


  const themeColors = {
    placeholder: isDark ? '#9CA3AF' : '#6B7280',
    text: isDark ? '#FFFFFF' : '#111827',
    inputBg: isDark ? '#1F2937' : '#FFFFFF',
    border: isDark ? 'white' : 'black',
    dropdownBg: isDark ? '#111827' : '#FFFFFF',
    toggleText: isDark ? '#93C5FD' : '#0E3386',
    togglePressedBg: isDark ? '#1E293B' : '#EEF2FF',
    selectedBg: isDark ? '#1E3A8A' : '#E6EBFF',
    selectedText: isDark ? '#BFDBFE' : '#00007B',
  };



  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      // offlineAccess: true,
      // forceCodeForRefreshToken: true,
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Sign Up ',
      headerBackTitle: '',
      headerBackTitleVisible: false,
    });
  }, [navigation]);
  const handleAgencyRoleSelect = (value: string) => {
    if (selectedAgencyRole === value) {
      // 👉 already selected → close dropdown
      setShowAgencyDropdown(false);
      return;
    }

    // 👉 first time selection → set value, keep dropdown open
    setSelectedAgencyRole(value);
  };


  const validateField = (fieldName: string, value: string) => {
    let fieldErrors: string[] = [];

    switch (fieldName) {
      case 'firstName':
        fieldErrors = validateName(value, 'First name').errors;
        break;
      case 'lastName':
        fieldErrors = validateName(value, 'Last name').errors;
        break;
      case 'email':
        fieldErrors = validateEmail(value).errors;
        break;
      case 'password1':
        fieldErrors = validatePassword(value).errors;
        break;
      case 'password2':
        fieldErrors = validateConfirmPassword(password1, value).errors;
        break;
      case 'signupType':
        fieldErrors = validateSignupType(value).errors;
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors[0] || ''
    }));
  };

  // Handle blur event
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    switch (fieldName) {
      case 'firstName':
        validateField('firstName', firstName);
        break;
      case 'lastName':
        validateField('lastName', lastName);
        break;
      case 'email':
        validateField('email', email);
        break;
      case 'password1':
        validateField('password1', password1);
        break;
      case 'password2':
        validateField('password2', password2);
        break;
    }
  };




  const handleSignUp = async () => {
    if (!signupType) {
      setError('Please select a signup type first.');
      return;
    }

    const allTouched = {
      signupType: true,
      firstName: true,
      lastName: true,
      email: true,
      password1: true,
      password2: true,
    };
    setTouched(allTouched);
    const validation = validateSignupForm({
      signupType,
      firstName,
      lastName,
      email,
      password: password1,
      confirmPassword: password2,
    });
    if (signupType === 'AGENCY_USER' && !selectedAgencyRole) {
      setError('Please select your agency role.');
      return;
    }


    if (!validation.isValid) {
      // Convert array of errors to object format
      const errorObj: { [key: string]: string } = {};
      validation.errors.forEach(error => {
        if (error.includes('First name')) errorObj.firstName = error;
        else if (error.includes('Last name')) errorObj.lastName = error;
        else if (error.includes('email')) errorObj.email = error;
        else if (error.includes('Password')) errorObj.password1 = error;
        else if (error.includes('Confirm password') || error.includes('Passwords do not match')) errorObj.password2 = error;
        else if (error.includes('signup type')) errorObj.signupType = error;
      });
      setErrors(errorObj);
      return;
    }
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password1,
      password2: password2,
      user_type: signupType,
      agency_role: signupType === 'AGENCY_USER' ? agencyRole : undefined,
      agency_type: signupType === 'AGENCY_USER' ? selectedAgencyRole : undefined,
    };


    try {
      const result = await Services.signUp(payload);
      console.log("re", result);

      if (result.success) {
        await AsyncStorage.setItem(
          'signUp_data',
          JSON.stringify({
            email,
            user_type: signupType,
          })
        );
        console.log("result.success", result.success);

        navigation.navigate('VerifyEmail');


      } else {
        setError(result.error?.message || 'Registration failed. Please try again.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleLogin = async (loginType: 'google' | 'email') => {
    try {
      setLoading(true);

      if (loginType === 'google') {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut(); // ensure fresh login
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();

        const accessToken = tokens?.accessToken;

        if (!accessToken) {
          await GoogleSignin.signOut();
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Google Signup Failed',
            text2: 'No access token received. Please try again.',
            position: 'top',
          });
          return;
        }

        // 🔹 Direct signup with Google (skip sendAccessToken)
        const tokenResult = await Services.googleSignup(accessToken, signupType);
        console.log("googleSignup result", tokenResult);

        if (!tokenResult.success) {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Google Signup Failed',
            text2: tokenResult.error || 'Could not sign up with Google',
            position: 'top',
          });
          return;
        }

        // Save user data
        const user = tokenResult?.data?.user;
        console.log("useruser", user);

        await AsyncStorage.setItem('first_Name', user?.first_name || '');
        await AsyncStorage.setItem('last_Name', user?.last_name || '');
        await AsyncStorage.setItem('email', user?.email || '');
        await AsyncStorage.setItem('profilePic', user?.profile?.logo || '');
        await AsyncStorage.setItem('Token', tokenResult.data?.key || '');
        await AsyncStorage.setItem('hasLoggedIn', 'true');
        await AsyncStorage.setItem('userType', user?.user_type);
        Toast.show({ type: 'success', text1: 'Signup successful!', position: 'top' });

        setTimeout(() => {
          setLoading(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'AuthLoading' }],
            })
          );
        }, 1000);
      }

    } catch (err: any) {
      setLoading(false);

      // Print the entire object so you can see all fields
      console.log("Google Signup full error:", JSON.stringify(err, null, 2));

      // Extract known properties if available
      console.log("Error code:", err.code);
      console.log("Error message:", err.message);

      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: err.message || 'Something went wrong',
        position: 'top',
      });
    }
  };

  const handleNameChange = (value: string, setter: (text: string) => void) => {
    // Allow only alphabets and spaces
    const cleaned = value.replace(/[^A-Za-z ]/g, '');
    setter(cleaned);
  };

  const handleLinkedinLogin = () => {
    navigation.navigate('LinkedInLoginScreen');
  };

  const renderSocialButtons = () => (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => handleLogin('google')}
        disabled={loading}
      >
        <Image
          source={require('../assets/images/search.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}> Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}
        onPress={handleLinkedinLogin}
      >
        <Image
          source={require('../assets/images/linkedin.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>LinkedIn  </Text>
      </TouchableOpacity>
    </View>

  );

  const getSignupTypeDescription = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL_USER':
        return {
          title: "Individual Buyer",
          description: "Shop for services and manage your purchases with ease.",
          bullets: [
            " Review high value contracts Real Estate Contracts and Employment Contracts",
            "Avoid Contract frauds.",
            "Review past agreements anytime.",
            "Fast, secure, and mobile-friendly experience.",
            "Support for digital signatures and secure storage."
          ]
        };
      case 'AGENCY_USER':
        return {
          title: "Supplier & Agency Network",
          description: "Showcase your services and connect with buyers.",
          bullets: [
            " Submit proposals, quotes, or documents securely.",
            " Review, draft contract and reduce contract signing by 70%. ",
            " Unlimited E signatures",
            " Track agreement status and respond to enterprise requests quickly.",
            " Access shared resources and contract history.",
            " Find Talent for Sourcing",
            " Streamlined communication with buyers and legal teams.",
          ]
        };
      case 'RESOURCE_USER':
        return {
          title: "Talent",
          description: "Showcase your skills and find opportunities that match your expertise.",
          bullets: [
            "Create a professional profile to showcase your skills",
            "Build an impressive portfolio of your work",
            "Find opportunities that match your expertise",
            "Connect with potential clients and employers",
            "Manage your projects and collaborations in one place"
          ]
        };
      case 'LAWYER_USER':
        return {
          title: "Lawyer Network",
          description: "Offer legal services and consult with clients.",
          bullets: [
            "Review, draft contract and reduce contract signing by 70%.",
            "Unlimited E signatures",
            "Generate legal templates tailored for multiple industries. ",
            "Collaborate with clients or enterprises on secure agreements.",
            "Track your workload and manage deliverables.",
            "Get notified of contract updates or required actions.",
          ]
        };
      case 'ORGANISATION_USER':
        return {
          title: "Enterprise",
          description: "Manage agreements for your organization with full control and visibility.",
          bullets: [
            "Centralized dashboard for all contracts and purchase orders",
            "Review, draft contracts and reduce contract signing by 70%",
            "Unlimited E-signatures for your organization",
            "Manage supplier relationships and approvals in one place",
            "Advanced analytics and compliance tracking",
            "Role-based access for teams and departments"
          ]
        };
      default:
        return {
          title: "",
          description: "",
          bullets: []
        };
    }
  };
  // Add this function to get the appropriate image for each signup type
  const getSignupTypeImage = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL_USER':
        return require('../assets/images/individualBuyer.png');
      case 'AGENCY_USER':
        return require('../assets/images/SuppliersAgency.png');
      case 'RESOURCE_USER':
        return require('../assets/images/Talent.png');
      case 'LAWYER_USER':
        return require('../assets/images/SuppliersAgency.png');
      case 'ORGANISATION_USER':
        return require('../assets/images/IndividualSignup.png');
      default:
        return require('../assets/images/individualBuyer.png');
    }
  };
  // Function to handle type selection
  const handleTypeSelection = (type: string) => {
    const selectedType = SIGNUP_TYPES.find(t => t.value === type);
    if (selectedType) {
      setSelectedTypeInfo(selectedType);
      setSignupType(type);
      setShowConfirmation(true);
      setError('');
    }
  };

  // Function to handle confirmation
  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      setShowConfirmation(false);
    } else {
      setShowConfirmation(false);
      setSignupType('');
      setSelectedTypeInfo(null);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={[{ padding: 0 }, styles.SignupIconContainer]} >

              <Image
                source={
                  !signupType
                    ? require('../assets/images/SuppliersAgency.png')
                    : showConfirmation && selectedTypeInfo
                      ? getSignupTypeImage(selectedTypeInfo.value)
                      : getSignupTypeImage(signupType)
                }
                style={styles.SignupIcon}
              />
            </View>

            {/* STEP 1: Select Signup Type */}
            {!signupType && !showConfirmation ? (
              <View>
                <Text style={styles.header}>Select Signup Type</Text>
                {SIGNUP_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.typeButton}
                    onPress={() => handleTypeSelection(type.value)}
                  >
                    <Text style={styles.typeButtonText}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
                {touched.signupType && errors.signupType && (
                  <Text style={styles.errorText}>{errors.signupType}</Text>
                )}
              </View>
            ) : showConfirmation && selectedTypeInfo ? (
              <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationHeader}>Confirm Your Selection</Text>

                <View style={styles.typeCard}>
                  <Text style={styles.typeLabel}>
                    {getSignupTypeDescription(selectedTypeInfo.value).title}
                  </Text>

                  <Text style={styles.typeDescription}>
                    {getSignupTypeDescription(selectedTypeInfo.value).description}
                  </Text>

                  <View style={styles.bulletsContainer}>
                    {getSignupTypeDescription(selectedTypeInfo.value).bullets.map((bullet, index) => (
                      <View key={index} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.confirmationText}>
                  Is this the right account type for you?
                </Text>

                <View style={styles.confirmationButtons}>
                  <TouchableOpacity
                    style={[styles.confirmationButton, styles.confirmButton]}
                    onPress={() => handleConfirmation(true)}
                  >
                    <Text style={styles.confirmButtonText}>
                      Continue as {getSignupTypeDescription(selectedTypeInfo.value).title}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.confirmationButton, styles.changeButton]}
                    onPress={() => handleConfirmation(false)}
                  >
                    <Text style={styles.changeButtonText}>No, Change Type</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {renderSocialButtons()}
                {/* STEP 2: Show Form */}
                <Text style={styles.header}>
                  Register as user {SIGNUP_TYPES.find(t => t.value === signupType)?.label}
                </Text>
                <View style={styles.row}>
                  <View >
                    <TextInput
                      style={[
                        styles.input1,
                        {
                          color: themeColors.text,
                          backgroundColor: themeColors.inputBg,
                          borderColor: themeColors.border,
                        },
                        errors.firstName && styles.errorInput,
                      ]}
                      placeholder="Enter first name *"
                      value={firstName}
                      placeholderTextColor={themeColors.placeholder}

                      onChangeText={(text) => handleNameChange(text, setFirstName)}
                      onBlur={() => handleBlur('firstName')}
                    />
                    {touched.firstName && errors.firstName && (
                      <Text style={styles.fieldErrorText1}>{errors.firstName}</Text>
                    )}
                  </View>

                  <View >
                    <TextInput
                      style={[
                        styles.input1,
                        {
                          color: themeColors.text,
                          backgroundColor: themeColors.inputBg,
                          borderColor: themeColors.border,
                        },
                        errors.lastName && styles.errorInput,
                      ]}
                      placeholder="Enter last name *"
                      value={lastName}
                      placeholderTextColor={themeColors.placeholder}

                      onChangeText={(text) => handleNameChange(text, setLastName)}
                      onBlur={() => handleBlur('lastName')}
                    />
                    {touched.lastName && errors.lastName && (
                      <Text style={styles.fieldErrorText}>{errors.lastName}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: themeColors.text,
                        backgroundColor: themeColors.inputBg,
                        borderColor: themeColors.border,
                      },
                      errors.email && styles.errorInput,
                    ]}
                    placeholder="Enter email address *"
                    value={email}
                    placeholderTextColor={themeColors.placeholder}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={() => handleBlur('email')}
                  />


                  {touched.email && errors.email && (
                    <Text style={styles.fieldErrorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.passwordContainer,
                      {
                        backgroundColor: themeColors.inputBg,
                        borderColor: themeColors.border,
                      },
                      errors.password1 && touched.password1 && styles.errorInput,
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.passwordInput,
                        { color: themeColors.text },
                      ]}
                      placeholder="Enter password *"
                      value={password1}
                      placeholderTextColor={themeColors.placeholder}
                      onChangeText={setPassword1}
                      secureTextEntry={!showPassword1}
                      onBlur={() => handleBlur('password1')}
                    />

                    <TouchableOpacity
                      onPress={() => setShowPassword1(!showPassword1)}
                      activeOpacity={0.7}
                      style={styles.toggleBtn}
                    >
                      <Text style={[styles.toggleText, { color: themeColors.toggleText }]}>
                        {showPassword1 ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {touched.password1 && errors.password1 && (
                    <Text style={styles.fieldErrorText}>{errors.password1}</Text>
                  )}
                </View>


                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.passwordContainer,
                      {
                        backgroundColor: themeColors.inputBg,
                        borderColor: themeColors.border,
                      },
                      errors.password2 && touched.password2 && styles.errorInput,
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.passwordInput,
                        { color: themeColors.text },
                      ]}
                      placeholder="Confirm password *"
                      value={password2}
                      placeholderTextColor={themeColors.placeholder}
                      onChangeText={setPassword2}
                      secureTextEntry={!showPassword2}
                      onBlur={() => handleBlur('password2')}
                    />

                    <TouchableOpacity
                      onPress={() => setShowPassword2(!showPassword2)}
                      activeOpacity={0.7}
                      style={styles.toggleBtn}
                    >
                      <Text style={[styles.toggleText, { color: themeColors.toggleText }]}>
                        {showPassword2 ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {touched.password2 && errors.password2 && (
                    <Text style={styles.fieldErrorText}>{errors.password2}</Text>
                  )}
                </View>

                <TextInput
                  style={[
                    {
                      borderWidth: 1,
                      borderRadius: 5,
                      marginBottom: 15,
                      paddingRight: 10,
                      paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                      paddingLeft: 10,
                      borderColor: themeColors.border,
                      backgroundColor: themeColors.inputBg,
                      color: themeColors.text,
                    },
                  ]}
                  placeholder="Do You Have Referral Code"
                  placeholderTextColor={themeColors.placeholder}
                  value={referralCode}
                  onChangeText={setreferralCode}
                />

                {signupType === 'AGENCY_USER' && (
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        marginBottom: 6,
                        fontWeight: '600',
                        color: themeColors.text,
                      }}
                    >
                      Select Agency Role *
                    </Text>

                    {/* Dropdown Trigger */}
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: themeColors.border,
                        borderRadius: 6,
                        padding: 12,
                        backgroundColor: themeColors.inputBg,
                      }}
                      activeOpacity={0.7}
                      onPress={() => setShowAgencyDropdown(!showAgencyDropdown)}
                    >
                      <Text
                        style={{
                          color: selectedAgencyRole
                            ? themeColors.text
                            : themeColors.placeholder,
                          fontSize: 16,
                        }}
                      >
                        {AGENCY_ROLES.find(r => r.value === selectedAgencyRole)?.label ||
                          'Choose your role'}
                      </Text>
                    </TouchableOpacity>

                    {/* Dropdown List */}
                    {showAgencyDropdown && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: themeColors.border,
                          borderRadius: 6,
                          marginTop: 5,
                          backgroundColor: themeColors.dropdownBg,
                          overflow: 'hidden',
                        }}
                      >
                        {AGENCY_ROLES.map(role => {
                          const isSelected = selectedAgencyRole === role.value;

                          return (
                            <TouchableOpacity
                              key={role.value}
                              onPress={() => handleAgencyRoleSelect(role.value)}
                              activeOpacity={0.7}
                              style={{
                                padding: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: themeColors.border,
                                backgroundColor: isSelected
                                  ? themeColors.selectedBg
                                  : themeColors.dropdownBg,
                              }}
                            >
                              <Text
                                style={{
                                  color: isSelected
                                    ? themeColors.selectedText
                                    : themeColors.text,
                                  fontWeight: isSelected ? '700' : '400',
                                  fontSize: 15,
                                }}
                              >
                                {role.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                )}


                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>
                    Register as user {SIGNUP_TYPES.find(t => t.value === signupType)?.label}
                  </Text>
                </TouchableOpacity>

                <View style={styles.loginBox}>
                  <Text style={styles.signup}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Log In</Text>
                  </TouchableOpacity>
                </View>

                {/* Option to go back and change signup type */}
                <TouchableOpacity
                  style={styles.changeType}
                  onPress={() => setSignupType('')}
                >
                  <Text style={styles.changeTypeText}>← Change Signup Type</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 20, marginTop: 20 },
  SignupIconContainer: { width: '100%', alignItems: 'center' },
  SignupIcon: { width: 300, height: 200 },
  typeButton: {
    backgroundColor: '#000078',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },

  confirmationContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  confirmationHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#0E3386',
  },
  typeCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    marginBottom: 25,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#0E3386',
  },
  typeDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  bulletsContainer: {
    marginTop: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 10,
    color: '#007AFF',
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
    color: '#444',
    fontWeight: '600',
  },
  confirmationButtons: {
    width: '100%',
  },
  confirmationButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#0E3386',
  },
  changeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },

  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },

  fieldErrorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  fieldErrorText1: {
    maxWidth: 160,
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  typeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  row: { flexDirection: 'row', marginBottom: 15, justifyContent: "space-between" },
  input1: {
    width: 165,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    // backgroundColor: '#f9f9f9',
    // color:'red',
    fontSize: 16,
  },
  input: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    // backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  // passwordContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 5,
  //   marginBottom: 15,
  //   paddingRight: 10,
  // },
  // passwordInput: { flex: 1, height: 45, paddingHorizontal: 10 },
  // toggleText: { color: '#0E3386', fontWeight: '600' },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingRight: 10,
  },

  passwordInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  toggleText: {
    fontWeight: '600',
    fontSize: 14,
  },

  button: {
    backgroundColor: '#000078',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  loginBox: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  signup: { color: '#333', fontSize: 14 },
  link: { color: '#000078', fontWeight: '600', fontSize: 14 },
  changeType: { marginTop: 15, alignItems: 'center' },
  changeTypeText: { color: '#666', textDecorationLine: 'underline' },


  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 15,
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
});
