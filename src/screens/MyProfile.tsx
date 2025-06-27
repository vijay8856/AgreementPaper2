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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Adjust path


type MyProfileNavProp = StackNavigationProp<RootStackParamList, 'MyProfile'>;


const MyProfile = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({
        full_name: '',
        email_id: '',
        avatar: '',
    });
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fName = await AsyncStorage.getItem('first_Name');
                const lName = await AsyncStorage.getItem('last_Name');
                const email = await AsyncStorage.getItem('email') as any;
                const pic = await AsyncStorage.getItem('profilePic');
                if (fName) setFirstName(fName);
                if (lName) setLastName(lName);
                if (email) setEmail(email);
                if (pic) setProfilePic(pic);


            } catch (e) {
                console.log('Error fetching user data:', e);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.clear();
                  
                    Toast.show({
                        type: 'success',
                        text1: 'Logged out successfully',
                    });
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }as any],
                    } as const);
                },
            },
        ]);
    };

    // useEffect(() => {
    //     const debugAsyncStorage = async () => {
    //         const keys = await AsyncStorage.getAllKeys();
    //         const stores = await AsyncStorage.multiGet(keys);

    //         stores.forEach(([key, value]) => {
    //             console.log(`🧠 AsyncStorage key: ${key} =>`, value);
    //         });
    //     };

    //     debugAsyncStorage();
    // }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    {profilePic ? (
                        <Image source={{ uri: profilePic }} style={styles.avatar} />
                    ) : (
                        <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>
                                {(firstName || 'U').charAt(0).toUpperCase()}
                            </Text>
                             {/* <Text style={styles.initialsText}>
                                {('M').charAt(0).toUpperCase()}
                            </Text> */}
                        </View>
                    )}
                </View>

                <Text style={styles.name}>{`${firstName + lastName}` || 'Your Name'}</Text>
                <Text style={styles.email}>{email || 'your@email.com'}</Text>

                  {/* <Text style={styles.name}>Michael Stone</Text>
                <Text style={styles.email}>{email || 'michaelstone@email.com'}</Text> */}
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.settingsHeader}>Settings</Text>
                <TouchableOpacity style={styles.settingsItem}>
                    <Text style={styles.settingsText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.settingsItem}
                    onPress={() => Linking.openURL('https://agreementpaper.com/legal')}
                >
                    <Text style={styles.settingsText}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem} onPress={() => Linking.openURL('https://agreementpaper.com/termsCondition')}>
                    <Text style={styles.settingsText}>Terms and Conditions</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default MyProfile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#0E3386',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#fff',
    },
    settingsSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    settingsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0E3386',
    },
    settingsItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsText: {
        fontSize: 16,
        color: '#111827',
    },
    logoutButton: {
        marginTop: "50%",
        marginHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#0E3386',
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    initialsCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0E3386',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },

    initialsText: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
    },

});
