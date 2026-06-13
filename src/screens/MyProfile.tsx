// @ts-nocheck

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import Services from '../Services/services'; // Your service file
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import AppHeader from '../components/AppHeader';
import DocumentPicker from 'react-native-document-picker';
type MyProfileNavProp = StackNavigationProp<RootStackParamList, 'MyProfile'>;

const MyProfile = () => {
  const navigation = useNavigation<MyProfileNavProp>();
  const [userData, setUserData] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any>({});

  const [languageModal, setLanguageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactNumber, setContactNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [age, setAge] = useState('');

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [resetStep, setResetStep] = useState(1);
  const [otpEmail, setOtpEmail] = useState('');

  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [userType, setUserType] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<any>(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Profile',
      headerBackTitle: '',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchUserProfile();
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (languages && languages.length > 0) {
      setFilteredLanguages(languages);
    }
  }, [languages]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter(language =>
        language.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredLanguages(filtered);
    }
  }, [searchQuery, languages]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedUser2 = await AsyncStorage.getItem('company');

        console.log('storedUser', storedUser);
        console.log('storedUser2', storedUser2);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('parsedUser', parsedUser);

          setUserEmail(parsedUser?.email || '');
          setOtpEmail(parsedUser?.email || ''); // auto fill otpEmail also
        }
      } catch (error) {
        console.log('Error fetching userData:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 100,
        height: 200,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      console.log('Picked Image:', image);

      if (image && image.path) {
        setUserData(prev => ({
          ...prev,
          profile_pic: image.path,
          profile_file: {
            uri: image.path,
            type: image.mime || 'image/jpeg',
            name: image.filename || 'profile.jpg',
          },
        }));
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Full Error Object:', error);
      console.log('Error Message:', error.message);
      console.log('Error Code:', error.code);

      if (
        error.message?.includes('cancelled') ||
        error.code === 'E_PICKER_CANCELLED'
      ) {
        console.log('User cancelled picker');
      } else if (error.message?.includes('permission')) {
        console.log('Permission denied');
        Toast.show({
          type: 'error',
          text1: 'Permission denied',
          text2: 'Please enable photo library access',
        });
      } else {
        console.log('Image Picker Error:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to pick image',
          text2: 'Please try again',
        });
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // First load from AsyncStorage for quick display
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Convert relative paths to absolute
          if (parsedData.profile_pic?.startsWith('/')) {
            parsedData.profile_pic = `https://api.agreementpaper.com/${parsedData.profile_pic}`;
          }
          setUserData(parsedData);
        }

        // Then fetch fresh data from API
        await fetchUserProfile();
      } catch (error) {
        console.log('Initial load error:', error);
      }
    };

    loadData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await Services.getUserProfileDetails();
      if (res.success) {
        const user = res.data;
        setUserType(user.user_type);
        console.log('userssss', user);

        let profilePic = user.profile_pic || user.avatar || '';
        if (profilePic && !profilePic.startsWith('http')) {
          profilePic = `http://api.agreementpaper.com${profilePic}`;
        }

        const updatedUser = {
          ...user,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          profile_pic: profilePic,
          email: user.email || '',
          contact_number: user.contact_number || '',
          linkedin_url: user.linkedin_url || '',
          age: user.age || '',
          language: user.language || '',
          userId: user.id || '',
          slug: user.profile.slug || '',
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setSelectedLanguage(user.language_data[0] || {});
        setContactNumber(user.contact_number || '');
        setLinkedinUrl(user.linkedin_url || '');
        setAge(user.age?.toString() || '');
      }
    } catch (err) {
      console.log('Error loading profile', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await Services.getLanguagesList();
      if (res.success) {
        setLanguages(res.data);
      }
    } catch (err) {
      console.log('Error loading languages', err);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userData.language) {
      Toast.show({type: 'error', text1: 'Please select a language'});
      return;
    }

    try {
      const formData = new FormData();

      formData.append('first_name', userData.first_name || '');
      formData.append('last_name', userData.last_name || '');
      formData.append('contact_number', contactNumber || '');
      formData.append('linkedin_url', linkedinUrl || '');
      formData.append('age', age || '');
      formData.append('language', String(Number(selectedLanguage.id)));

      if (userData.profile_pic && userData.profile_pic.startsWith('file://')) {
        formData.append('profile_pic', {
          uri: userData.profile_pic,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
      if (userType === 'RESOURCE_USER' && cvFile) {
        formData.append('cv', {
          uri: cvFile.uri,
          type: cvFile.type || 'application/pdf',
          name: cvFile.name || 'resume.pdf',
        } as any);
      }

      setLoading(true);
      const response = await Services.updateUserProfileDetails(formData);
      console.log('reseres', response);

      if (response?.success) {
        let profilePicUrl = response.data.profile_pic;
        if (profilePicUrl && !profilePicUrl.startsWith('http')) {
          profilePicUrl = `http://api.agreementpaper.com${profilePicUrl}`;
        }
        const updatedUser = {
          ...userData,
          profile_pic: profilePicUrl,
          profile_file: null,
        };
        try {
          await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
          setUserData(updatedUser);
          await fetchUserProfile();
        } catch (error) {
          console.log('Error saving user data:', error);
        }

        Toast.show({type: 'success', text1: 'Profile updated'});
        setEditMode(false);
      } else {
        if (response.error) {
          setFieldErrors(response.error); // store API field errors
        }
        Toast.show({
          type: 'error',
          text1: 'Update failed',
          text2: response?.error || 'Please try again',
        });
      }
    } catch (error) {
      console.log('Profile update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Update error',
        text2: error.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Toast.show({type: 'success', text1: 'Logged out successfully'});
          navigation.reset({
            index: 0,
            routes: [{name: 'Login' as any}],
          } as const);
        },
      },
    ]);
  };

  const renderLanguageModal = () => (
    <Modal visible={languageModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent2}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle2}>Select Language</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLanguageModal(false)}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search languages..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}>
                <Icon name="close" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Languages List */}
          <FlatList
            data={filteredLanguages}
            keyExtractor={item => item.id?.toString() || item.name}
            showsVerticalScrollIndicator={false}
            style={styles.languagesList}
            contentContainerStyle={styles.listContent}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedLanguage(item);
                  setUserData(prev => ({...prev, language: item.id}));
                  setLanguageModal(false);
                  setSearchQuery('');
                }}
                style={[
                  styles.languageItem,
                  selectedLanguage?.id === item.id &&
                    styles.selectedLanguageItem,
                ]}>
                <Text
                  style={[
                    styles.languageName,
                    selectedLanguage?.id === item.id &&
                      styles.selectedLanguageName,
                  ]}>
                  {item.name}
                </Text>
                {selectedLanguage?.id === item.id && (
                  <Icon name="checkmark" size={20} color="#0E3386" />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="search-off" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No languages found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your search terms
                </Text>
              </View>
            }
          />

          {/* Results Count */}
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredLanguages.length}{' '}
              {filteredLanguages.length === 1 ? 'language' : 'languages'} found
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
  const handleSendResetCode = async () => {
    setLoading(true);
    const res = await Services.forgetPassword({email: otpEmail});
    console.log('.......res', res);

    if (res.success) {
      setLoading(false);

      setResetStep(2);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to send code',
        text2: res.error.email,
      });
    }
  };

  const handleResetPassword = async () => {
    const formData = new FormData();
    formData.append('code', otpCode);
    formData.append('password', newPassword);
    setLoading(true);

    try {
      const res = await Services.forgetPasswordReset(formData);

      if (res.success) {
        setLoading(false);

        setPasswordModalVisible(false);
        setResetStep(1);
        Toast.show({
          type: 'success',
          text1: 'Password updated',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: res.data.code || 'Failed to reset password',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred',
      });
      console.log('Reset error:', error);
    }
  };

  if (loading)
    return <ActivityIndicator style={{marginTop: 50}} size="large" />;

  const onPickCV = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      setCvFile(res);
      setCvFileName(res.name || 'resume.pdf');
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // user cancelled – do nothing
      } else {
        Alert.alert('Error', 'Failed to pick CV');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <AppHeader title="My Profile" /> */}
      <ScrollView
        // style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {renderLanguageModal()}

        <View style={styles.profileCard}>
          {/* Profile Image Section */}
          <View style={styles.avatarContainer}>
            {userData?.profile_pic ? (
              <Image
                source={{
                  uri: `${
                    userData.profile_pic
                  }?timestamp=${new Date().getTime()}`,
                  cache: 'reload',
                }}
                style={styles.avatar}
                onError={e => {
                  console.log('Image loading error:', e.nativeEvent.error);
                }}
              />
            ) : (
              <View style={styles.initialsCircle}>
                <Text style={styles.initialsText}>
                  {userData?.first_name?.charAt(0) || 'U'}
                </Text>
              </View>
            )}

            {/* 👇 Show "Change Photo" only in edit mode */}
            {editMode && (
              <TouchableOpacity
                style={styles.changeProfileButton}
                onPress={handleImagePick}>
                <Icon name="camera" size={16} color="#fff" />
                <Text style={styles.changeProfileText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 👇 Edit / View Mode Content */}
          {editMode ? (
            <View>
              <View style={styles.editForm}>
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput
                      placeholder="First Name"
                      style={styles.input}
                      value={userData.first_name}
                      onChangeText={text => {
                        setUserData({...userData, first_name: text});
                        setFieldErrors(prev => ({...prev, first_name: null}));
                      }}
                    />

                    {fieldErrors.first_name && (
                      <Text style={styles.errorText}>
                        {fieldErrors.first_name[0]}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Last Name</Text>

                    <TextInput
                      placeholder="Enter last name"
                      style={styles.input}
                      value={userData.last_name}
                      onChangeText={text => {
                        setUserData({...userData, last_name: text});
                        setFieldErrors(prev => ({...prev, last_name: null}));
                      }}
                    />

                    {fieldErrors.last_name && (
                      <Text style={styles.errorText}>
                        {fieldErrors.last_name[0]}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={userData.email}
                    editable={false}
                    placeholder="Email"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contact Number</Text>

                  <TextInput
                    placeholder="Enter contact number"
                    style={styles.input}
                    value={contactNumber}
                    maxLength={10}
                    onChangeText={text => {
                      setContactNumber(text);
                      setFieldErrors(prev => ({...prev, contact_number: null}));
                    }}
                  />

                  {fieldErrors.contact_number && (
                    <Text style={styles.errorText}>
                      {fieldErrors.contact_number[0]}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>LinkedIn URL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter LinkedIn profile URL"
                    value={linkedinUrl}
                    onChangeText={setLinkedinUrl}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your age"
                    value={age}
                    onChangeText={setAge}
                    maxLength={3}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Preferred Language</Text>
                  <TouchableOpacity
                    style={styles.languageSelector}
                    onPress={() => {
                      setLanguageModal(true);
                      setFieldErrors(prev => ({...prev, language: null}));
                    }}>
                    <Text style={styles.languageText}>
                      {selectedLanguage.name || 'Select Language'}
                    </Text>
                    <Icon
                      name={
                        Platform.OS === 'ios' ? 'globe-outline' : 'language'
                      }
                      size={16}
                      color="#666"
                    />
                  </TouchableOpacity>

                  {fieldErrors.language && (
                    <Text style={styles.errorText}>
                      {fieldErrors.language[0]}
                    </Text>
                  )}
                </View>

                {userType === 'RESOURCE_USER' && (
                  <View style={styles.uploadCv}>
                    <TouchableOpacity style={styles.cvBox} onPress={onPickCV}>
                      <Text style={styles.cvText}>
                        {cvFileName
                          ? `CV: ${cvFileName}`
                          : '📄 Upload CV (PDF only)'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditMode(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateProfile}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {`${userData.first_name || ''} ${userData.last_name || ''}`}
              </Text>
              <Text style={styles.userEmail}>{userData.email || ''}</Text>

              <View style={styles.languageInfo}>
                <Icon name="language-outline" size={16} color="#666" />
                <Text style={styles.languageInfoText}>
                  {selectedLanguage.name || 'No language selected'}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  gap: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditMode(true)}>
                  <Icon name="create-outline" size={18} color="#fff" />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                {(userType === 'ORGANISATION_USER' ||
                  userType === 'AGENCY_USER') && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('CompanySetupScreen')}>
                    <Icon name="create-outline" size={18} color="#fff" />
                    <Text style={styles.editButtonText}>
                      Edit Company Profile
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setPasswordModalVisible(true)}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, {backgroundColor: '#E3F2FD'}]}>
                <Icon name="lock-closed-outline" size={20} color="#1976D2" />
              </View>
              <Text style={styles.settingsItemText}>Change Password</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => Linking.openURL('https://agreementpaper.com/legal')}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, {backgroundColor: '#E8F5E8'}]}>
                <Icon
                  name="shield-checkmark-outline"
                  size={20}
                  color="#388E3C"
                />
              </View>
              <Text style={styles.settingsItemText}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() =>
              Linking.openURL('https://agreementpaper.com/termsCondition')
            }>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, {backgroundColor: '#FFF3E0'}]}>
                <Icon name="document-text-outline" size={20} color="#F57C00" />
              </View>
              <Text style={styles.settingsItemText}>Terms and Conditions</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setDeleteModalVisible(true)}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, {backgroundColor: '#FFEBEE'}]}>
                <Icon name="trash-outline" size={20} color="#D32F2F" />
              </View>
              <Text style={[styles.settingsItemText, {color: '#D32F2F'}]}>
                Delete Account
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#fdf9f9ff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Change Password Modal */}
        <Modal visible={passwordModalVisible} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <ScrollView>
                {resetStep === 1 ? (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput
                        value={userEmail}
                        editable={false}
                        style={styles.disabledInput}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleSendResetCode}>
                      <Text style={styles.primaryButtonText}>
                        Send Verification Code
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Verification Code</Text>
                      <TextInput
                        placeholder="Enter the code sent to your email"
                        value={otpCode}
                        onChangeText={setOtpCode}
                        style={styles.input}
                      />
                    </View>
                    <View style={[styles.inputContainer, {height: 70}]}>
                      <Text style={styles.inputLabel}>New Password</Text>
                      <TextInput
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        style={styles.input}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleResetPassword}>
                      <Text style={styles.primaryButtonText}>
                        Reset Password
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setPasswordModalVisible(false);
                    setResetStep(1);
                  }}
                  style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Delete Account Modal */}
        <Modal visible={deleteModalVisible} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.warningIcon}>
                <Icon name="warning-outline" size={40} color="#D32F2F" />
              </View>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <Text style={styles.modalSubtitle}>
                This action cannot be undone. All your data will be permanently
                deleted.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Enter your password to confirm
                </Text>
                <View style={styles.passwordInput}>
                  <TextInput
                    placeholder="Your password"
                    value={deletePassword}
                    onChangeText={setDeletePassword}
                    secureTextEntry={!showDeletePassword}
                    autoCapitalize="none"
                    style={styles.passwordTextInput}
                  />
                  <TouchableOpacity
                    onPress={() => setShowDeletePassword(!showDeletePassword)}>
                    <Icon
                      name={
                        showDeletePassword ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={22}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={async () => {
                  try {
                    const result = await Services.deleteUserAccount(
                      deletePassword,
                    );
                    if (result.success) {
                      Toast.show({
                        type: 'success',
                        text1: 'Account deleted successfully',
                      });
                      await AsyncStorage.clear();
                      setDeleteModalVisible(false);
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'Login' as never}],
                      });
                    } else {
                      Alert.alert(
                        'Error',
                        result.error?.non_field_errors?.[0] ||
                          'Failed to delete account',
                      );
                    }
                  } catch (error) {
                    Alert.alert(
                      'Error',
                      'Failed to delete account. Please check your password.',
                    );
                  }
                }}>
                <Text style={styles.dangerButtonText}>
                  Delete Account Permanently
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 30,
  },
  profileHeader: {
    backgroundColor: '#0E3386',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  uploadCv: {
    borderWidth: 1,
    borderColor: '#989ca0ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  editProfileContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0E3386',
  },
  initialsCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0E3386',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  initialsText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '600',
  },
  changeProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E3386',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  changeProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  editForm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3,
    elevation: 1,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#989ca0ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  languageText: {
    fontSize: 16,
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0E3386',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E3386',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E3386',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#fefbfbff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  warningIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent2: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  languagesList: {
    maxHeight: 300,
  },
  listContent: {
    paddingVertical: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  selectedLanguageItem: {
    backgroundColor: '#F0F7FF',
  },
  languageName: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedLanguageName: {
    color: '#0E3386',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});
