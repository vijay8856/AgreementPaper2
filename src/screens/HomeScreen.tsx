import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackHandler,
  RefreshControl,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, DashboardTabParamList } from '../navigation/types';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import Notifications from '../components/Modals/Notifications';

const screenWidth = Dimensions.get('window').width;

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DashboardTabParamList, 'HomeScreen'>,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type Lawyer = {
  id: number;
  display_name: string;
  email: string;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasPremiumAccess, setHasPremiumAccess] = useState(true);
  const [favoriteLawyers, setFavoriteLawyers] = useState<Lawyer[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>({});

  console.log("favoriteLawyers", favoriteLawyers);

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

      // Refresh favorites when screen comes into focus
      fetchFavoriteLawyers();

      return () => subscription.remove();
    }, [])
  );

  const fetchFavoriteLawyers = async () => {
    try {
      setLoadingFavorites(true);
      // const user_id = await AsyncStorage.getItem('user_id');

      // if (!user_id) {
      //   console.log('User ID not found');
      //   return;
      // }

      const data = {
        limit: 10,
        offset: 0,
      };

      const response = await Services.getFavorites(data);
      // Assuming the API response structure matches your example
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
  };

  const toggleFavorite = async (lawyerId: number) => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');

      // Here you would call your API to add/remove from favorites
      // Since toggle happens on another screen, we'll just refresh the list
      Toast.show({
        type: 'success',
        text1: 'Favorite updated',
        position: 'top',
      });

      // Refresh the favorites list to get latest data
      fetchFavoriteLawyers();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating favorite',
        position: 'top',
      });
      console.error('Favorite toggle failed:', error);
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
        // await fetchUserProfile();
      } catch (error) {
        console.log('Initial load error:', error);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fName = await AsyncStorage.getItem('first_Name');
        const lName = await AsyncStorage.getItem('last_Name');
        const storedValue = await AsyncStorage.getItem('hasPremiumAccess');

        if (fName) setFirstName(fName);
        if (lName) setLastName(lName);

        // ⭐ Load premium access
        const hasPremium = JSON.parse(storedValue || 'false');
        setHasPremiumAccess(hasPremium);

      } catch (e) {
        console.log('Error fetching user data:', e);
      }
    };

    fetchUserData();
    fetchFavoriteLawyers();

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
          <Text style={{ color: '#f8f8f8ff', fontSize: 20, fontWeight: 'bold' }}>
            Home
          </Text>
          {/* {company ? (
                  <Text style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>
                    {company}
                  </Text>
                ) : null} */}
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>

          {/* Notifications */}
          <View style={{ marginRight: 10 }}>
            <Notifications />
          </View>

          {/* PREMIUM / UPGRADE BUTTON */}
          {hasPremiumAccess ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('SubscriptionScreen')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 12,
                backgroundColor: '#ffd700',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Icon name="crown" size={14} color="#000" />
              <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>
                Premium
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('SubscriptionScreen')}
              style={{
                marginRight: 12,
                backgroundColor: '#fbbf24',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>
                Upgrade Plan
              </Text>
            </TouchableOpacity>
          )}

          {/* PROFILE ICON */}
          <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
            {userData?.profile_pic ? (
              <Image
                source={{ uri: `${userData.profile_pic}?t=${Date.now()}` }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#fff',
                }}
              />
            ) : (
              <Icon name="account-circle" size={28} color="#fff" />
            )}
          </TouchableOpacity>

        </View>
      ),

      headerStyle: {
        backgroundColor: '#0E3386',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });

  }, [navigation, hasPremiumAccess]);   // ⭐ rerenders header when premium changes




  const allItems = [
    { id: 1, icon: 'file-document-outline', label: 'AI-Full Review', screen: 'AIResFullReview', premium: false },
    { id: 2, icon: 'chip', label: 'AI-Review', screen: 'AIReview', premium: false },
    { id: 3, icon: 'account-tie', label: 'Suppliers/Agencies', screen: 'SupplierAgency', premium: false },
    { id: 4, icon: 'cog-outline', label: 'Settings', screen: 'Settings', premium: false },

    // { id: 10, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: true },
    { id: 5, icon: 'scale-balance', label: 'Lawyers', screen: 'LawyerNetwork', premium: false },
    { id: 6, icon: 'briefcase-plus', label: 'Invite Agency', screen: 'InviteAgency', premium: false },
    { id: 7, icon: 'account-group', label: 'Invite Your Friends', screen: 'InviteIndividualBuyer', premium: false },
    { id: 9, icon: 'help-circle-outline', label: 'Help', screen: 'HelpScreen', premium: false },

    { id: 8, icon: 'gavel', label: 'Invite Lawyer', screen: 'InviteLawyer', premium: false },
    { id: 10, icon: 'pencil-outline', label: 'ESignature', screen: 'ESignature', premium: false },

  ];

  const gridItems = allItems.filter(item => hasPremiumAccess || !item.premium);

  return (
    <ScrollView
      style={styles.container}
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
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome,</Text>
        <Text style={styles.username}>{firstName} {lastName}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.contractTitle}>Contract Review</Text>
          <Text style={styles.contractSubtitle}>REQUEST A CONTRACT REVIEW</Text>
          <Text style={styles.contractDesc}>
            Protect your legal rights with a contract review with Automated AI Platform.
            Buying or selling a property can be daunting...
          </Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('LawyerNetwork')}
          >
            <Text style={styles.buttonText}>View conveyancers</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/glob.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>



      {/* Grid Items Section */}
      <View style={styles.gridSection}>
        <View style={styles.gridContainer}>
          {gridItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={28} color="#0E3386" />
              </View>
              <Text style={styles.gridItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>



      {/* Favorites Section */}
      <View style={styles.favoritesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          {favoriteLawyers.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('LawyerNetwork')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {loadingFavorites ? (
          <Text style={styles.loadingText}>Loading favorites...</Text>
        ) : favoriteLawyers.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.favoritesScrollView}
            contentContainerStyle={styles.favoritesContentContainer}
          >
            {favoriteLawyers.map((lawyer) => (
              <TouchableOpacity
                key={lawyer.id}
                style={styles.lawyerCard}
                onPress={() => navigation.navigate('LawyerNetwork', { lawyerId: lawyer.id })}
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
                  onPress={() => {
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
                  }}
                >
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyFavorites}>
            <Icon name="heart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyFavoritesText}>No favorite lawyers yet</Text>
            <TouchableOpacity
              style={styles.browseLawyersButton}
              onPress={() => navigation.navigate('LawyerNetwork')}
            >
              <Text style={styles.browseLawyersText}>Browse Lawyers</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 24,
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
  favoritesSection: {
    marginBottom: 24,
  },
  gridSection: {
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
    marginBottom: 10
  },
  lawyerCardHeader: {
    flexDirection: 'row',
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
});