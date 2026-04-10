
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
  BackHandler,
  Linking,
  Platform
} from 'react-native';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';
import { useFocusEffect } from '@react-navigation/native';
import Notifications from '../components/Modals/Notifications';
import IOSDashboardHeader from '../components/IOSDashboardHeader';


const screenWidth = Dimensions.get('window').width;

type Lawyer = {
  id: number;
  display_name: string;
  email: string;
};

type Resource = {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  profilePic: string | null;
};

const LawyerDashboard = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [favoriteLawyers, setFavoriteLawyers] = useState<Lawyer[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [companyName, setCompanyName] = useState<string>('');


  console.log("nm", firstName);


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      fetchFavoriteLawyers();

      return () => subscription.remove();
    }, [])
  );

  useLayoutEffect(() => {
    if (Platform.OS !== 'android') return; // 🔥 STOP iOS COMPLETELY

    fetchTopResource();

    const loadDashboardData = async () => {
      try {
        // ----------------------------
        // ✅ FIRST / LAST NAME LOGIC
        // ----------------------------
        const fName = await AsyncStorage.getItem('first_Name');
        const lName = await AsyncStorage.getItem('last_Name');

        let finalFirstName = fName || '';
        let finalLastName = lName || '';

        // 🔁 Fallback if missing
        if (!finalFirstName.trim() || !finalLastName.trim()) {
          const storedUser = await AsyncStorage.getItem('userData');

          if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("user from async", user);

            if (!finalFirstName.trim() && user?.first_name) {
              finalFirstName = user.first_name;
              await AsyncStorage.setItem('first_Name', user.first_name);
            }

            if (!finalLastName.trim() && user?.last_name) {
              finalLastName = user.last_name;
              await AsyncStorage.setItem('last_Name', user.last_name);
            }
          }
        }

        if (finalFirstName) setFirstName(finalFirstName);
        if (finalLastName) setLastName(finalLastName);



        const storedValue = await AsyncStorage.getItem('hasPremiumAccess');
        setHasPremiumAccess(storedValue ? JSON.parse(storedValue) : false);

        const company = await AsyncStorage.getItem('company');
        setCompanyName(company ?? '');

        navigation.setOptions({
          headerShown: true,
          headerTransparent: false,
          headerLargeTitle: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#0E3386' },
          headerTintColor: '#fff',
          headerTitleAlign: 'left',

          headerTitle: () => (
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ color: '#f8f8f8ff', fontSize: 16, fontWeight: 'bold' }}>
                Lawyer Dashboard
              </Text>
              {company ? (
                <Text style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>
                  {company}
                </Text>
              ) : null}
            </View>
          ),

          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <Notifications />
              <TouchableOpacity
                onPress={() => navigation.navigate('SubscriptionScreen')}
                style={{
                  marginHorizontal: 10,
                  backgroundColor: '#fbbf24',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                  {'Upgrade Plan'}

                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
                {userData?.profile_pic ? (
                  <Image
                    source={{
                      uri: `${userData.profile_pic}?timestamp=${new Date().getTime()}`,
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15, // make it circular
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}
                    onError={(e) => console.log('Profile pic error:', e.nativeEvent.error)}
                  />
                ) : (
                  <Icon name="account-circle" size={28} color="#fff" />
                )}
              </TouchableOpacity>   </View>
          ),
        });
      } catch (e) {
        console.log('Header error:', e);
      }
    };

    loadDashboardData();
  }, [navigation, hasPremiumAccess]);



  const fetchTopResource = async () => {
    try {
      setLoading(true);
      const data = { limit: 3 };
      const response = await Services.getIndividualUserProfile(data);

      if (response?.success && Array.isArray(response.data)) {
        const formattedResources = response.data.map((item) => ({
          id: item.id,
          name: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
          email: item.email || "N/A",
          contactNumber: item.contact_number || "N/A",
          profilePic: item.profile_pic
            ? `http://192.168.116.235:3000${item.profile_pic}`
            : null,
        }));
        setResources(formattedResources);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error("Error fetching top resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteLawyers = async () => {
    try {
      setLoadingFavorites(true);
      const data = { limit: 10, offset: 0 };
      const response = await Services.getFavorites(data);
      setFavoriteLawyers(response.results || []);
    } catch (error) {
      console.error('Error fetching favorite lawyers:', error);
      Toast.show({
        type: 'error',
        text1: 'Error loading favorites',
        position: 'top',
      });
    } finally {
      setLoadingFavorites(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavoriteLawyers();
    fetchTopResource();
  };

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const company = await AsyncStorage.getItem('company');
        setCompanyName(company ?? '');


        const fName = await AsyncStorage.getItem('first_Name');
        const lName = await AsyncStorage.getItem('last_Name');

        let finalFirstName = fName || '';
        let finalLastName = lName || '';

        // 🔁 Fallback if missing
        if (!finalFirstName.trim() || !finalLastName.trim()) {
          const storedUser = await AsyncStorage.getItem('userData');

          if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("user from async", user);

            if (!finalFirstName.trim() && user?.first_name) {
              finalFirstName = user.first_name;
              await AsyncStorage.setItem('first_Name', user.first_name);
            }

            if (!finalLastName.trim() && user?.last_name) {
              finalLastName = user.last_name;
              await AsyncStorage.setItem('last_Name', user.last_name);
            }
          }
        }

        if (finalFirstName) setFirstName(finalFirstName);
        if (finalLastName) setLastName(finalLastName);
      } catch (error) {
        console.log('Error loading company:', error);
      }
    };

    loadCompany();
  }, []);


  useEffect(() => {
    fetchTopResource()
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
        // await fetchUserProfile();
      } catch (error) {
        console.log('Initial load error:', error);
      }
    };

    loadData();
  }, []);





  const toggleFavorite = async (lawyerId: number) => {
    try {
      Toast.show({
        type: 'success',
        text1: 'Favorite updated',
        position: 'top',
      });
      fetchFavoriteLawyers();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating favorite',
        position: 'top',
      });
    }
  };

  useEffect(() => {
    fetchTopResource();
    // fetchUserData();

    const checkProfileStatus = async () => {
      const isActive = await AsyncStorage.getItem('isActive');
      if (isActive !== 'true') {
        setShowProfileModal(true);
      }
    };
    checkProfileStatus();
  }, []);

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName as never);
  };

  const contactLawyer = (lawyer: Lawyer) => {
    if (!lawyer?.email) {
      Alert.alert("No Email", "This lawyer does not have an email address available.");
      return;
    }

    const subject = "Legal Assistance Inquiry";
    const body = `Hello ${lawyer.display_name},\n\nI would like to get in touch with you regarding...`;

    const emailUrl = `mailto:${lawyer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch(() => {
      Alert.alert("Error", "Could not open email client.");
    });
  };

  const renderResourceCard = ({ item }: { item: Resource }) => {
    return (
      <TouchableOpacity onPress={() => handleNavigation('AllResourcesScreen')}>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image
              source={require('../assets/images/user.png')
                // item.profilePic
                //   ? { uri: item.profilePic }
                //   : require('../assets/images/user.png')
              }
              style={styles.avatar}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Contact</Text>
              <Text style={styles.value}>{item.contactNumber}</Text>
            </View>
          </View>


        </View>
      </TouchableOpacity>
    );
  };

  const renderLawyerCard = (lawyer: Lawyer) => (
    <TouchableOpacity
      key={lawyer.id}
      style={styles.lawyerCard}
      onPress={() => handleNavigation('LawyerNetwork')}
    >
      <View style={styles.lawyerCardHeader}>
        <View style={styles.lawyerAvatar}>
          <Text style={styles.lawyerInitial}>
            {lawyer.display_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => toggleFavorite(lawyer.id)}
        >
          <Icon name="heart" size={20} color="#fbbf24" />
        </TouchableOpacity>
      </View>

      <View style={styles.lawyerInfo}>
        <Text style={styles.lawyerName} numberOfLines={1}>
          {lawyer.display_name}
        </Text>
        <Text style={styles.lawyerEmail} numberOfLines={1}>
          {lawyer.email}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => contactLawyer(lawyer)}
      >
        <Text style={styles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const allItems = [
    { id: 1, icon: 'file-document-outline', label: 'AI-RES Full Review', screen: 'AIResFullReview', premium: false },
    { id: 2, icon: 'chip', label: 'AI-Review', screen: 'AIReview', premium: false },
    { id: 3, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: true },
    { id: 4, icon: 'cog-outline', label: 'Settings', screen: 'Settings', premium: false },
    { id: 5, icon: 'account-tie', label: 'Suppliers/Agencies', screen: 'SupplierAgency', premium: false },
    { id: 6, icon: 'briefcase-plus', label: 'Invite Organization', screen: 'InviteOrganization', premium: false },
    { id: 7, icon: 'account-group', label: 'Invite Individual Buyer', screen: 'InviteIndividualBuyer', premium: false },
    { id: 8, icon: 'briefcase-plus', label: 'Invite Agency', screen: 'InviteAgency', premium: false },
    { id: 9, icon: 'clipboard-text-outline', label: 'Individual Profile', screen: 'AllResourcesScreen', premium: false },
    { id: 10, icon: 'account-tie', label: 'Organization Profile', screen: 'LawyerOrgProfile', premium: false },
    // { id: 5, icon: 'scale-balance', label: 'Lawyers', screen: 'LawyerNetwork', premium: false },
    // { id: 8, icon: 'gavel', label: 'Invite Lawyer', screen: 'InviteLawyer', premium: false },
    { id: 11, icon: 'pencil-outline', label: 'ESignature', screen: 'ESignature', premium: false },
    { id: 12, icon: 'help-circle-outline', label: 'Help', screen: 'HelpScreen', premium: false },

  ];

  const gridItems = allItems;

  return (
    <>
      <View style={styles.container}>
        {Platform.OS === 'ios' && (
          <IOSDashboardHeader
            companyName={companyName}
            hasPremiumAccess={hasPremiumAccess}
            onUpgradePress={() => navigation.navigate('SubscriptionScreen')}
            onProfilePress={() => navigation.navigate('MyProfile')}
          />
        )}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0E3386']}
              tintColor={'#0E3386'}
            />
          }
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome,</Text>
            <Text style={styles.username}>{firstName} {lastName}</Text>
          </View>




          {/* Grid Items Section */}
          <View style={styles.gridSection}>
            <View style={styles.gridContainer}>
              {gridItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => handleNavigation(item.screen)}
                >
                  <View style={styles.iconContainer}>
                    <Icon name={item.icon} size={28} color="#0E3386" />
                  </View>
                  <Text style={styles.gridItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>



          {/* Individual Buyers Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Individual Buyers</Text>
              <TouchableOpacity onPress={() => handleNavigation('AllResourcesScreen')}>
                <Text style={styles.seeAllText}>See All ›</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={resources}
                renderItem={renderResourceCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.resourcesList}
              />
            )}
          </View>



        </ScrollView>

        <OrganizationProfileModal
          visible={showProfileModal}
          onComplete={() => setShowProfileModal(false)}
          onClose={() => setShowProfileModal(false)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E3386',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f5ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  contractTitle: {
    fontSize: 18,
    color: '#0E3386',
    fontWeight: '600',
    marginBottom: 4,
  },
  contractSubtitle: {
    fontSize: 14,
    color: '#6c8e00',
    fontWeight: '700',
    marginBottom: 8,
  },
  contractDesc: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    lineHeight: 20,
  },
  viewButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  image: {
    width: 100,
    height: 100,
  },
  gridSection: {
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (screenWidth - 48) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridItemText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0E3386',
    textAlign: 'center',
    marginTop: 4,
  },
  favoritesSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  seeAllText: {
    color: '#0E3386',
    fontWeight: '500',
  },
  favoritesScrollView: {
    marginHorizontal: -16,
  },
  favoritesContentContainer: {
    paddingHorizontal: 16,
  },
  lawyerCard: {
    width: 130,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 10,
  },
  lawyerCardHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lawyerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#0E3386',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lawyerInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    padding: 4,
  },
  lawyerInfo: {
    marginBottom: 12,
  },
  lawyerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lawyerEmail: {
    fontSize: 12,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  emptyFavorites: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyFavoritesText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  browseLawyersButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0E3386',
    borderRadius: 6,
  },
  browseLawyersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
  resourcesList: {
    paddingBottom: 5
  },
  // Individual Buyers card styles
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default LawyerDashboard;