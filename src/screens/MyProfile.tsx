// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     Image,
//     TouchableOpacity,
//     ScrollView,
//     Alert,
//     Linking,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/types'; // Adjust path


// type MyProfileNavProp = StackNavigationProp<RootStackParamList, 'MyProfile'>;


// const MyProfile = () => {
//     const navigation = useNavigation();
//     const [user, setUser] = useState({
//         full_name: '',
//         email_id: '',
//         avatar: '',
//     });
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [profilePic, setProfilePic] = useState<string | null>(null);
//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const fName = await AsyncStorage.getItem('first_Name');
//                 const lName = await AsyncStorage.getItem('last_Name');
//                 const email = await AsyncStorage.getItem('email') as any;
//                 const pic = await AsyncStorage.getItem('profilePic');
//                 if (fName) setFirstName(fName);
//                 if (lName) setLastName(lName);
//                 if (email) setEmail(email);
//                 if (pic) setProfilePic(pic);


//             } catch (e) {
//                 console.log('Error fetching user data:', e);
//             }
//         };

//         fetchUserData();
//     }, []);

//     const handleLogout = async () => {
//         Alert.alert('Logout', 'Are you sure you want to logout?', [
//             {
//                 text: 'Cancel',
//                 style: 'cancel',
//             },
//             {
//                 text: 'Logout',
//                 style: 'destructive',
//                 onPress: async () => {
//                     await AsyncStorage.clear();
                  
//                     Toast.show({
//                         type: 'success',
//                         text1: 'Logged out successfully',
//                     });
//                     navigation.reset({
//                         index: 0,
//                         routes: [{ name: 'Login' }as any],
//                     } as const);
//                 },
//             },
//         ]);
//     };

//     // useEffect(() => {
//     //     const debugAsyncStorage = async () => {
//     //         const keys = await AsyncStorage.getAllKeys();
//     //         const stores = await AsyncStorage.multiGet(keys);

//     //         stores.forEach(([key, value]) => {
//     //             console.log(`🧠 AsyncStorage key: ${key} =>`, value);
//     //         });
//     //     };

//     //     debugAsyncStorage();
//     // }, []);
//     return (
//         <ScrollView style={styles.container}>
//             <View style={styles.profileSection}>
//                 <View style={styles.avatarContainer}>
//                     {profilePic ? (
//                         <Image source={{ uri: profilePic }} style={styles.avatar} />
//                     ) : (
//                         <View style={styles.initialsCircle}>
//                             <Text style={styles.initialsText}>
//                                 {(firstName || 'U').charAt(0).toUpperCase()}
//                             </Text>
//                              {/* <Text style={styles.initialsText}>
//                                 {('M').charAt(0).toUpperCase()}
//                             </Text> */}
//                         </View>
//                     )}
//                 </View>

//                 <Text style={styles.name}>{`${firstName + lastName}` || 'Your Name'}</Text>
//                 <Text style={styles.email}>{email || 'your@email.com'}</Text>

//                   {/* <Text style={styles.name}>Michael Stone</Text>
//                 <Text style={styles.email}>{email || 'michaelstone@email.com'}</Text> */}
//             </View>

//             <View style={styles.settingsSection}>
//                 <Text style={styles.settingsHeader}>Settings</Text>
//                 <TouchableOpacity style={styles.settingsItem}>
//                     <Text style={styles.settingsText}>Change Password</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.settingsItem}
//                     onPress={() => Linking.openURL('https://agreementpaper.com/legal')}
//                 >
//                     <Text style={styles.settingsText}>Privacy Policy</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.settingsItem} onPress={() => Linking.openURL('https://agreementpaper.com/termsCondition')}>
//                     <Text style={styles.settingsText}>Terms and Conditions</Text>
//                 </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//                 <Text style={styles.logoutText}>Logout</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// };

// export default MyProfile;



// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     profileSection: {
//         alignItems: 'center',
//         paddingVertical: 30,
//         backgroundColor: '#0E3386',
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     avatar: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         marginBottom: 15,
//         borderWidth: 2,
//         borderColor: '#fff',
//     },
//     name: {
//         fontSize: 20,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     email: {
//         fontSize: 14,
//         color: '#fff',
//     },
//     settingsSection: {
//         marginTop: 20,
//         paddingHorizontal: 20,
//     },
//     settingsHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#0E3386',
//     },
//     settingsItem: {
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderColor: '#E5E7EB',
//     },
//     settingsText: {
//         fontSize: 16,
//         color: '#111827',
//     },
//     logoutButton: {
//         marginTop: "50%",
//         marginHorizontal: 20,
//         paddingVertical: 15,
//         backgroundColor: '#0E3386',
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     logoutText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     avatarContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },

//     initialsCircle: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         backgroundColor: '#0E3386',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 2,
//         borderColor: '#fff',
//     },

//     initialsText: {
//         fontSize: 36,
//         color: '#fff',
//         fontWeight: 'bold',
//     },

// });




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
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import * as ImagePickerLib from 'react-native-image-picker';
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






  useEffect(() => {
    fetchUserProfile();
    fetchLanguages();
  }, []);




const requestImagePermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      console.log('Permission Result:', result);
    } catch (err) {
      console.warn('Permission error:', err);
    }
  }
};

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

  
  const fetchUserProfile = async () => {
    try {
      const res = await Services.getUserProfileDetails();
      if (res.success) {
        const user = res.data;

        console.log("userssss",user);
        
        setUserData({
          ...user,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          profile_pic: user.avatar || '',
          email: user.email || '',
          contact_number:user.contact_number ||'',
          linkedin_url:user.linkedin_url || '',
          age:user.age ||'',
          language: user.language || '',
        });
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

//  const handleUpdateProfile = async () => {
//   if (!userData.language) {
//     Toast.show({
//       type: 'error',
//       text1: 'Please select a language before updating',
//     });
//     return;
//   }

//   const formData = new FormData();
//   formData.append('first_name', userData.first_name || '');
//   formData.append('last_name', userData.last_name || '');
//   formData.append('contact_number', contactNumber || '');
//   formData.append('linkedin_url', linkedinUrl || '');
//   formData.append('age', age || '');
// formData.append('language', String(Number(selectedLanguage.id)));


//   if (userData.profile_pic && userData.profile_pic.startsWith('file://')) {
//     formData.append('profile_pic', {
//       uri: userData.profile_pic,
//       type: 'image/jpeg',
//       name: 'profile.jpg',
//     });
//   }

//   try {
//    setLoading(true);
    
//     const response = await Services.updateUserProfileDetails(formData); // send FormData
//     setLoading(false);
//     if (response.success) {
//       Toast.show({ type: 'success', text1: 'Profile updated' });
//       setEditMode(false);
//     } else {
//       Toast.show({ type: 'error', text1: 'Update failed' });
//     }
//   } catch (e) {
//     console.log(e);
//     Toast.show({ type: 'error', text1: 'An error occurred' });
//   }
// };

const handleUpdateProfile = async () => {
  if (!userData.language) {
    Toast.show({
      type: 'error',
      text1: 'Please select a language before updating',
    });
    return;
  }

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

  try {
    setLoading(true); // Start loader
    const response = await Services.updateUserProfileDetails(formData);

    if (response.success) {
      Toast.show({ type: 'success', text1: 'Profile updated' });
      setEditMode(false);
    } else {
      Toast.show({ type: 'error', text1: 'Update failed' });
    }
  } catch (e) {
    console.log(e);
    Toast.show({ type: 'error', text1: 'An error occurred' });
  } finally {
    setLoading(false); // Stop loader
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
    console.log(".......res",res);
    
    if (res.success) {
      setResetStep(2);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to send code',
        text2:res.error.email
      });
    }
  };

const handleResetPassword = async () => {
  const formData = new FormData();
  formData.append('code', otpCode); // or token, as per your API
  formData.append('password', newPassword);

  try {
    const res = await Services.forgetPasswordReset(formData); // API call with FormData

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
  {userData.profile_pic ? (
    <Image source={{ uri: userData.profile_pic }} style={styles.avatar} />
  ) : (
    <View style={styles.initialsCircle}>
      <Text style={styles.initialsText}>{userData.first_name?.charAt(0)}</Text>
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
              <Text>{selectedLanguage.name|| 'Select Language'}</Text>
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
    </ScrollView>
  );
};

export default MyProfile;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  profileSection: { alignItems: 'center', marginTop: 20 },
  avatarContainer: { marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  initialsCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'
  },
  initialsText: { fontSize: 32, color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#777', marginVertical: 4 },
  editIcon: { marginTop: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, width: '100%', marginVertical: 8,
  },
  input1:{
 borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, width: '94%', marginVertical: 8,
  },
  settingsSection: { marginTop: 30 },
  settingsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  settingsItem: { paddingVertical: 10 },
  settingsText: { fontSize: 16 },
  logoutButton: {
    backgroundColor: '#000078',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginBottom: 20,  // Added bottom margin
  },
  logoutText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  saveButton: {
    backgroundColor: '#000078',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',  // Full width
    alignItems: 'center',
  },
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent dark
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
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  languageItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
fullWhiteBackdrop: {
  flex: 1,
  backgroundColor: '#ffffff', // full solid white background
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
resetbutton:{
     backgroundColor: '#000078', 
    padding: 10, 
    borderRadius: 8, 
      paddingHorizontal:'31%', 
    marginTop: 10, 
    alignItems: 'center' 
},
  button: { 
    backgroundColor: '#000078', 
    padding: 10, 
    borderRadius: 8, 
      paddingHorizontal:'37%', 
    marginTop: 10, 
    alignItems: 'center' 
  },
    buttonlink: { 
    backgroundColor: '#000078', 
    padding: 10,
    paddingHorizontal:'40%', 
    borderRadius: 8, 
    marginTop: 10, 
    alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#fff', fontWeight: 'bold' },  // Changed to blue
});
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 20 },
//   profileSection: { alignItems: 'center', marginTop: 20 },
//   avatarContainer: { marginBottom: 20 },
//   avatar: { width: 100, height: 100, borderRadius: 50 },
//   initialsCircle: {
//     width: 100, height: 100, borderRadius: 50,
//     backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'
//   },
//   initialsText: { fontSize: 32, color: '#fff' },
//   name: { fontSize: 22, fontWeight: 'bold' },
//   email: { fontSize: 16, color: '#777', marginVertical: 4 },
//   editIcon: { marginTop: 10 },
//   input: {
//     borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
//     paddingHorizontal: 10, paddingVertical: 8, width: '100%', marginVertical: 8,
//   },
//   settingsSection: { marginTop: 30 },
//   settingsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   settingsItem: { paddingVertical: 10 },
//   settingsText: { fontSize: 16 },
//   logoutButton: {
//     backgroundColor: '#E53935',
//     paddingVertical: 12,
//     marginTop: 30,
//     borderRadius: 8,
//   },
//   logoutText: { color: '#fff', textAlign: 'center', fontSize: 16 },
//   saveButton: {
//     backgroundColor: '#000078',
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     maxHeight: 400,
//   },
//   modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
//   languageItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#ccc',
//   },
// modalView: { 
//     backgroundColor: '#fff', 
//     padding: 20, 
//     margin: 20, 
//     borderRadius: 10,
//     marginTop: '30%', 
// },
//     button: { backgroundColor: '#000078', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
//      buttonText: { color: '#fff', fontWeight: 'bold' },
//        link: { color: '#fff', textAlign: 'center', marginTop: 10 },
// });
