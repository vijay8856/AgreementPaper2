import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Services from '../Services/services'; // Your service file
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
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


  useEffect(() => {
    fetchUserProfile();
    fetchLanguages();
  }, []);

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
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
      if (error.message?.includes('cancelled')) {
        console.log('User cancelled picker');
      } else {
        console.log('Image Picker Error:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to pick image',
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

        console.log("userssss", user);

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
        userId:user.id || '' ,
      };
  await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        // setUserData({
        //   ...user,
        //   first_name: user.first_name || '',
        //   last_name: user.last_name || '',
        //    profile_pic: user.profile_pic || user.avatar || '',
        //   email: user.email || '',
        //   contact_number: user.contact_number || '',
        //   linkedin_url: user.linkedin_url || '',
        //   age: user.age || '',
        //   language: user.language || '',
        // });
        // setSelectedLanguage(user.language_data[0] || {});

        // setContactNumber(user.contact_number || '');
        // setLinkedinUrl(user.linkedin_url || '');
        // setAge(user.age?.toString() || '');
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



console.log("userData",userData?.profile_pic);
const handleUpdateProfile = async () => {
  if (!userData.language) {
    Toast.show({ type: 'error', text1: 'Please select a language' });
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

    setLoading(true);
    const response = await Services.updateUserProfileDetails(formData);

    if (response?.success) {
      
 let profilePicUrl = response.data.profile_pic;
      if (profilePicUrl && !profilePicUrl.startsWith('http')) {
        profilePicUrl = `http://api.agreementpaper.com${profilePicUrl}`;
      }
      const updatedUser = {
        ...userData,
        profile_pic: profilePicUrl,
           profile_file: null
      };
      try {
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    setUserData(updatedUser);
       await fetchUserProfile();
  } catch (error) {
    console.log('Error saving user data:', error);
  }

      Toast.show({ type: 'success', text1: 'Profile updated' });
      setEditMode(false);
    } else {
      Toast.show({ 
        type: 'error', 
        text1: 'Update failed',
        text2: response?.error || 'Please try again'
      });
    }
  } catch (error) {
    console.log('Profile update error:', error);
    Toast.show({
      type: 'error',
      text1: 'Update error',
      text2: error.message || 'An unexpected error occurred'
    });
  } finally {
    setLoading(false);
  }
};

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

  const renderLanguageModal = () => (
    <Modal visible={languageModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <FlatList
            data={languages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedLanguage(item);
                  setUserData(prev => ({ ...prev, language: item.id })); // ID for API
                  setLanguageModal(false);
                }}
                style={styles.languageItem}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setLanguageModal(false)}>
            <Text style={{ color: 'blue', textAlign: 'center', marginTop: 10 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleSendResetCode = async () => {
    const res = await Services.forgetPassword({ email: otpEmail });
    console.log(".......res", res);

    if (res.success) {
      setResetStep(2);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to send code',
        text2: res.error.email
      });
    }
  };

  const handleResetPassword = async () => {
    const formData = new FormData();
    formData.append('code', otpCode);
    formData.append('password', newPassword);

    try {
      const res = await Services.forgetPasswordReset(formData);

      if (res.success) {
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


  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {renderLanguageModal()}

      <View style={styles.profileSection}>
<TouchableOpacity onPress={handleImagePick}>
  {userData?.profile_pic ? (
    <Image
      source={{ 
        uri: `${userData.profile_pic}?timestamp=${new Date().getTime()}`,
        cache: 'reload'
      }}
      style={styles.avatar}
      onError={(e) => {
        console.log('Image loading error:', e.nativeEvent.error);
        // Fallback to initials if image fails to load
      }}
    />
  ) : (
    <View style={styles.initialsCircle}>
      <Text style={styles.initialsText}>
        {userData?.first_name?.charAt(0) || ''}
      </Text>
    </View>
  )}
  <Text style={{ color: 'blue' }}>Change Picture</Text>
</TouchableOpacity>


        {editMode ? (
          <>
            <TextInput
              style={styles.input}
              value={userData.first_name}
              onChangeText={(text) => setUserData({ ...userData, first_name: text })}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={userData.last_name}
              onChangeText={(text) => setUserData({ ...userData, last_name: text })}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              value={userData.email}
              editable={false}
              placeholder="Email"
            />


            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TextInput
              style={styles.input}
              placeholder="LinkedIn URL"
              value={linkedinUrl}
              onChangeText={setLinkedinUrl}
            />

            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              maxLength={3}
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={() => setLanguageModal(true)} style={styles.input}>
              <Text>{selectedLanguage.name || 'Select Language'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
              <Text style={styles.logoutText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{`${userData.first_name || ''} ${userData.last_name || ''}`}</Text>
            <Text style={styles.email}>{userData.email || ''}</Text>
            <Text style={styles.email}>Language: {selectedLanguage.name || 'N/A'}</Text>
            <TouchableOpacity style={styles.editIcon} onPress={() => setEditMode(true)}>
              <Icon name="create-outline" size={24} color="#000" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsHeader}>Settings</Text>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => setPasswordModalVisible(true)}
        >
          <Text style={styles.settingsText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => Linking.openURL('https://agreementpaper.com/legal')}
        >
          <Text style={styles.settingsText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => Linking.openURL('https://agreementpaper.com/termsCondition')}
        >
          <Text style={styles.settingsText}>Terms and Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.settingsItem}
  onPress={() => setDeleteModalVisible(true)}
>
  <Text style={styles.settingsText}>Delete Account</Text>
</TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={passwordModalVisible} animationType="slide" transparent>
        <View style={styles.fullWhiteBackdrop}>

          {resetStep === 1 ? (
            <>
              <TextInput
                placeholder="Enter your email"
                value={otpEmail}
                onChangeText={setOtpEmail}
                style={styles.input1}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendResetCode}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Enter OTP"
                value={otpCode}
                onChangeText={setOtpCode}
                style={styles.input1}
              />
              <TextInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input1}
              />
              <TouchableOpacity style={styles.resetbutton} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              setPasswordModalVisible(false);
              setResetStep(1);
            }}
            style={styles.buttonlink}
          >
            <Text style={styles.link}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={deleteModalVisible} animationType="slide" transparent>
  <View style={styles.fullWhiteBackdrop}>
    <Text style={styles.modalTitle}>Confirm Account Deletion</Text>

    <View style={[styles.input1, { flexDirection: 'row', alignItems: 'center' }]}>
  <TextInput
    style={{ flex: 1 }}
    placeholder="Enter your password"
    value={deletePassword}
    onChangeText={setDeletePassword}
    secureTextEntry={!showDeletePassword}
    autoCapitalize="none"
  />
  <TouchableOpacity onPress={() => setShowDeletePassword(!showDeletePassword)}>
    <Icon
      name={showDeletePassword ? 'eye-off-outline' : 'eye-outline'}
      size={22}
      color="#555"
    />
  </TouchableOpacity>
</View>

    
    {/* <TextInput
      placeholder="Enter your password"
      value={deletePassword}
      onChangeText={setDeletePassword}
      secureTextEntry
      style={styles.input1}
    /> */}

    <TouchableOpacity
      style={styles.resetbutton}
      onPress={async () => {
        try {
     const result = await Services.deleteUserAccount(deletePassword);

if (result.success) {
  Toast.show({ type: 'success', text1: 'Account deleted successfully' });
  await AsyncStorage.clear();
  setDeleteModalVisible(false);

  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' as never }],
  });
} else {
  Alert.alert('Error', result.error?.non_field_errors?.[0] || 'Failed to delete account');
}

        } catch (error) {
          Alert.alert('Error', 'Failed to delete account. Please check your password.');
        }
      }}
    >
      <Text style={styles.buttonText}>Delete</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setDeleteModalVisible(false)}
      style={styles.buttonlink}
    >
      <Text style={styles.link}>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>

    </ScrollView>
  );
};

export default MyProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20
  },
  avatarContainer: {
    marginBottom: 20
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor:"gray"
  },
  initialsCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  initialsText: {
    fontSize: 32,
    color: '#fff'
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginVertical: 4
  },
  editIcon: {
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    marginVertical: 8,
  },
  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,

    width: '94%',
    marginVertical: 8,
  },
  settingsSection: {
    marginTop: 30
  },
  settingsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  settingsItem: {
    paddingVertical: 10
  },
  settingsText: {
    fontSize: 16
  },
  logoutButton: {
    backgroundColor: '#000078',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  saveButton: {
    backgroundColor: '#000078',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  languageItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  fullWhiteBackdrop: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resetbutton: {
    backgroundColor: '#000078',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: '35%',
    marginTop: 10,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#000078',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: '32%',
    marginTop: 10,
    alignItems: 'center'
  },
  buttonlink: {
    backgroundColor: '#000078',
    padding: 10,
    paddingHorizontal: '35%',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  link: {
    color: '#fff',
    fontWeight: 'bold'
  },



});
