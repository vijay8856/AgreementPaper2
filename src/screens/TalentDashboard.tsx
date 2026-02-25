import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Notifications from '../components/Modals/Notifications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const {width: screenWidth} = Dimensions.get('window');

const TalentDashboard = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [lawyers, setAllLawyer] = useState([]);
  const [jobProfiles, setJobProfiles] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [userData, setUserData] = useState<any>({});
  const [companyName, setCompanyName] = useState('');

  const insets = useSafeAreaInsets();
  useEffect(() => {
    const checkProfileStatus = async () => {
      const isActive = await AsyncStorage.getItem('isActive');
      console.log('isActive', isActive);

      if (isActive !== 'true') {
        setShowProfileModal(true);
      }
    };

    checkProfileStatus();
  }, []);

  useEffect(() => {
    const fetchAllLawyer = async () => {
      setLoading(true);
      try {
        const payload = {
          limit: 2,
          offset: 0,
          search: searchText,
        };
        const response = await Services.getOrganistionProfileList(payload);
        console.log('response43', response);

        if (response.success) {
          setAllLawyer(response.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.error || 'Failed to fetch lawyers',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllLawyer();
  }, []);

  useEffect(() => {
    const fetchJobProfiles = async () => {
      setLoading(true);
      try {
        const payload = {
          limit: 2,
          offset: 0,
        };
        const response = await Services.getJobsList(payload);
        console.log('response46', response);

        if (response.success) {
          setJobProfiles(response.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.error || 'Failed to fetch lawyers',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobProfiles();
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'COMPANY_UPDATED',
      newName => {
        setCompanyName(newName); // 🔥 Instantly update dashboard header
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // ---- Fetch user data ----
        const fName = await AsyncStorage.getItem('first_Name');
        const lName = await AsyncStorage.getItem('last_Name');
        if (fName) setFirstName(fName);
        if (lName) setLastName(lName);

        // ---- Fetch premium access ----
        const storedValue = await AsyncStorage.getItem('hasPremiumAccess');
        const premium = JSON.parse(storedValue || 'false');
        setHasPremiumAccess(premium);

        // ---- Fetch company name ----
        const storedCompany = await AsyncStorage.getItem('company');
        if (storedCompany) {
          setCompanyName(storedCompany);
        }

        // ---- Apply Header Fixes ----
        navigation.setOptions({
          headerTitleAlign: 'left',
          headerBackTitle: '',
          // 1. Fix for Dynamic Island / Notch
          headerStatusBarHeight: Platform.OS === 'ios' ? insets.top : undefined,

          headerTitle: () => (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                height: 44,
              }}>
              <Text
                style={{
                  color: '#fff',
                  // 2. Smaller font for iOS to prevent icon overlap
                  fontSize: Platform.OS === 'ios' ? 13 : 15,
                  fontWeight: 'bold',
                }}
                numberOfLines={1}>
                Talent Dashboard
              </Text>

              {firstName || lastName ? (
                <Text
                  style={{
                    color: '#E5E7EB',
                    fontSize: 10,
                    marginTop: 1,
                  }}
                  numberOfLines={1}>
                  {firstName} {lastName}
                </Text>
              ) : null}
            </View>
          ),

          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 10,
                height: 44,
              }}>
              <View>
                <Notifications />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 5,
                }}>
                {/* Premium / Upgrade Button */}
                {premium ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SubscriptionScreen')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 8,
                      backgroundColor: '#ffd700',
                      paddingHorizontal: 8,
                      paddingVertical: 5,
                      borderRadius: 6,
                    }}>
                    <Icon name="crown" size={12} color="#000" />
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 11,
                        fontWeight: 'bold',
                        marginLeft: 3,
                      }}>
                      Premium
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SubscriptionScreen')}
                    style={{
                      marginHorizontal: 8,
                      backgroundColor: '#fbbf24',
                      paddingHorizontal: 8,
                      paddingVertical: 5,
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{color: '#000', fontSize: 11, fontWeight: 'bold'}}>
                      Upgrade
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Profile Icon */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('MyProfile')}>
                  {userData?.profile_pic ? (
                    <Image
                      source={{
                        uri: `${userData.profile_pic}?t=${Date.now()}`,
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: '#fff',
                      }}
                    />
                  ) : (
                    <Icon name="account-circle" size={26} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#0E3386',
            // 3. Dynamic height calculation
            height: Platform.OS === 'ios' ? 44 + insets.top : 100,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
        });
      } catch (e) {
        console.log('Error loading dashboard data:', e);
      }
    };

    init();
  }, [navigation, hasPremiumAccess, userData, companyName, insets.top]);

  useFocusEffect(
    useCallback(() => {
      const fetchDashboardData = async () => {
        setDashboardLoading(true);
        try {
          const response = await Services.getResourceDashboard();
          console.log('Dashboard API Response:', response);

          if (response.success) {
            setDashboardData(response.data.payload);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.error || 'Failed to fetch dashboard data',
            });
          }
        } catch (err) {
          console.error('Dashboard fetch error:', err);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong while loading dashboard',
          });
        } finally {
          setDashboardLoading(false);
        }
      };

      fetchDashboardData();

      // Cleanup if needed
      return () => {};
    }, []),
  );

  const earningCategories = [
    {title: 'SOW', icon: 'description'},
    {title: 'Timesheet', icon: 'event-note'},
    {title: 'Invoke', icon: 'receipt'},
    {title: 'Half Yearly', icon: 'calendar-today'},
  ];

  const renderProgressItem = ({item}: any) => (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>{item.title}</Text>
      </View>
      <Text style={styles.progressValue}>{item.value}</Text>
      {item.subtitle && (
        <Text style={styles.progressSubtitle}>{item.subtitle}</Text>
      )}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${item.progress}%`}]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      {item.status && <Text style={styles.statusText}>{item.status}</Text>}
    </View>
  );

  const renderOrganization = ({item}: any) => (
    <View style={styles.orgCard}>
      <Text style={styles.orgName}>{item.company_name}</Text>
      <Text style={styles.orgCategory}>
        Location:
        {item.country_name}
        {item.state_name ? `, ${item.state_name}` : ''}
      </Text>
      <Text style={styles.orgCategory}>
        Email:
        {item.user_detail?.email}
      </Text>
    </View>
  );

  const renderEarningCategory = ({item}: any) => (
    <View style={styles.earningCard}>
      <Text style={styles.earningTitle}>{item.title}</Text>
    </View>
  );

  const renderJobItem = ({item}: any) => (
    <View style={styles.jobsCard}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <View style={styles.jobMeta}>
        <Text style={styles.jobBureau}>Job type : {item.job_type_value}</Text>
        <Text style={styles.jobCompany}>{item.company_name}</Text>
      </View>
      <View style={styles.jobDetails}>
        <Text style={styles.jobExperience}>
          Exp.
          {item.experience_value ? `${item.experience_value} Years` : 'N/A'}
        </Text>
        <Text style={styles.jobType}>{item.type}</Text>
      </View>
      <Text style={styles.jobPosted}>
        Posted on:{' '}
        {new Date(item.created_at).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      <Text style={styles.jobDescription}>
        {`Job as a ${item.job_type_value || ''} ${item.title || ''}`.trim()}
      </Text>
    </View>
  );

  // Render Applied Jobs Cards
  const renderAppliedJobsCard = () => {
    if (dashboardLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00007B" />
          <Text style={styles.loadingText}>Loading applied jobs...</Text>
        </View>
      );
    }

    if (!dashboardData) {
      return (
        <View style={styles.noDataContainer}>
          <Icon name="alert-circle-outline" size={40} color="#ccc" />
          <Text style={styles.noDataText}>No data found!</Text>
        </View>
      );
    }

    const {jobs, msa, sow, timesheet} = dashboardData;

    const appliedJobsCards = [
      {
        id: 1,
        title: 'Applied Jobs',
        count: jobs?.applied_jobs || 0,
        total: jobs?.total_jobs || 0,
        percentage: jobs?.increment || 0,
        icon: 'briefcase-check',
        bgColor: '#00007B',
        iconColor: '#1b1b76ff',
        gradient: ['#E3F2FD', '#BBDEFB'],
      },
      {
        id: 2,
        title: 'MSA Status',
        approved: msa?.approved || 0,
        pending: msa?.pending || 0,
        icon: 'file-document-multiple',
        bgColor: '#00007B',
        iconColor: '#1b1b76ff',
        gradient: ['#E8F5E8', '#C8E6C9'],
      },
      {
        id: 3,
        title: 'SOW Status',
        approved: sow?.approved || 0,
        pending: sow?.pending || 0,
        percentage: sow?.increment || 0,
        icon: 'clipboard-text',
        bgColor: '#00007B',
        iconColor: '#1b1b76ff',
        gradient: ['#FFF3E0', '#FFE0B2'],
      },
      {
        id: 4,
        title: 'Timesheet Status',
        approved: timesheet?.approved || 0,
        pending: timesheet?.pending || 0,
        percentage: timesheet?.increment || 0,
        icon: 'calendar-clock',
        bgColor: '#00007B',
        iconColor: '#1b1b76ff',
        gradient: ['#F3E5F5', '#E1BEE7'],
      },
    ];

    return (
      <View style={styles.appliedJobsContainer}>
        <FlatList
          data={appliedJobsCards}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.appliedJobsScroll}
          renderItem={({item}) => (
            <View
              style={[styles.appliedJobCard, {backgroundColor: item.bgColor}]}>
              {/* Icon Header Section */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: 'rgba(255,255,255,0.9)'},
                  ]}>
                  <Icon name={item.icon} size={32} color={item.iconColor} />
                </View>
                {item.percentage > 0 && (
                  <View style={styles.percentageBadge}>
                    <Icon name="trending-up" size={14} color="#00C851" />
                    <Text style={styles.percentageBadgeText}>
                      +{item.percentage}%
                    </Text>
                  </View>
                )}
              </View>

              {/* Content Section */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                {item.id === 1 ? (
                  // Applied Jobs Card
                  <View style={styles.jobStats}>
                    <Text style={styles.jobCount}>{item.count}</Text>
                    <Text style={styles.jobTotal}>/ {item.total} Total</Text>
                  </View>
                ) : (
                  // MSA, SOW, Timesheet Cards
                  <View style={styles.statusStats}>
                    <View style={styles.statusRow}>
                      <View style={styles.statusIndicator}>
                        <Icon name="check-circle" size={16} color="#fff" />
                        <Text style={styles.statusLabel}>Approved:</Text>
                      </View>
                      <Text style={[styles.statusValue, styles.approvedText]}>
                        {item.approved}
                      </Text>
                    </View>
                    <View style={styles.statusRow}>
                      <View style={styles.statusIndicator}>
                        <Icon name="clock-outline" size={16} color="#fff" />
                        <Text style={styles.statusLabel}>Pending:</Text>
                      </View>
                      <Text style={[styles.statusValue, styles.pendingText]}>
                        {item.pending}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  const allItems = [
    {
      id: 1,
      icon: 'file-document-outline',
      label: 'AI-Full Review',
      screen: 'AIResFullReview',
      premium: false,
    },
    {
      id: 2,
      icon: 'clipboard-text-outline',
      label: 'Job List ',
      screen: 'LatestJobsScreen',
      premium: false,
    },
    {
      id: 3,
      icon: 'animation',
      label: 'StatementOfWork',
      screen: 'StatementOfWork',
      premium: false,
    },
    {
      id: 4,
      icon: 'cog-outline',
      label: 'Settings',
      screen: 'Settings',
      premium: false,
    },
    {
      id: 5,
      icon: 'briefcase-plus',
      label: 'Top Organisation',
      screen: 'Top Organisation',
      premium: false,
    },
    {
      id: 6,
      icon: 'pencil-outline',
      label: 'ESignature',
      screen: 'ESignature',
      premium: false,
    },
    {
      id: 7,
      icon: 'help-circle-outline',
      label: 'Help',
      screen: 'HelpScreen',
      premium: false,
    },
    {
      id: 8,
      icon: 'account-group',
      label: 'Find Suppliers / Agency',
      screen: 'FindSuppliers',
      premium: false,
    },
    {
      id: 9,
      icon: 'scale-balance',
      label: 'Find Lawyers',
      screen: 'FindLawyers',
      premium: false,
    },
    {
      id: 10,
      icon: 'chip',
      label: 'AI-Review',
      screen: 'AIReview',
      premium: false,
    },
    // {
    //   id: 11,
    //   icon: 'account-tie',
    //   label: 'Suppliers/Agencies',
    //   screen: 'SupplierAgency',
    //   premium: false,
    // },
    // { id: 10, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: false },
    // { id: 2, icon: 'application-edit', label: 'MasterAgreement', screen: 'MasterAgreement', premium: false },
    // { id: 16, icon: 'help-circle-outline', label: 'Supplier Details', screen: 'SupplierDetails', premium: false },
  ];

  const gridItems = allItems.filter(item => hasPremiumAccess || !item.premium);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerCard}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.username}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.subtitle}>
            Explore new ways of working with compliance and best pay
          </Text>

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('LatestJobsScreen')}>
              <Text style={styles.primaryButtonText}>View Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('ViewTalentProfileScreen')}>
              <Text style={styles.secondaryButtonText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid Items Section */}
        <View style={styles.gridSection}>
          <View style={styles.gridContainer}>
            {gridItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => navigation.navigate(item.screen)}>
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={28} color="#0E3386" />
                </View>
                <Text style={styles.gridItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Jobs</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LatestJobsScreen')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}>
            {jobProfiles.map((job: any) => (
              <View key={job.id} style={styles.jobItem}>
                {renderJobItem({item: job})}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Applied Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Application Status</Text>
          </View>
          {renderAppliedJobsCard()}
        </View>

        <OrganizationProfileModal
          visible={showProfileModal}
          onComplete={() => setShowProfileModal(false)}
          onClose={() => setShowProfileModal(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    padding: 5,
  },
  gridItemText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0E3386',
    textAlign: 'center',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (screenWidth - 48) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gridSection: {
    backgroundColor: '#ffff',
    marginTop: 10,
    padding: 10,
    marginBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0E3386',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCard: {
    backgroundColor: '#ffff',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 5,
    borderLeftWidth: 6,
    borderLeftColor: '#000078',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 10,
    paddingLeft: 5,
  },
  viewAllText: {
    fontSize: 14,
    color: '#00007B',
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000078',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#000078',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#000078',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  jobsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#00007B',
  },
  section: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  sectionTitle: {
    marginLeft: 10,
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },

  // Applied Jobs Styles
  appliedJobsContainer: {
    marginBottom: 20,
  },
  appliedJobsScroll: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  appliedJobCard: {
    color: 'white',

    borderRadius: 20,
    marginHorizontal: 8,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  percentageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00C851',
    marginLeft: 4,
  },
  cardContent: {
    padding: 20,
    paddingTop: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  jobStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  jobCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  jobTotal: {
    fontSize: 16,
    color: 'white',

    marginLeft: 8,
    fontWeight: '500',
  },
  statusStats: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  approvedText: {
    color: '#fff',
  },
  pendingText: {
    color: '#fff',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#718096',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  noDataText: {
    fontSize: 16,
    color: '#a0aec0',
    marginTop: 10,
  },

  // Rest of the existing styles...
  progressItem: {
    width: width * 0.7,
    marginRight: 15,
  },
  progressCard: {
    backgroundColor: '#f7f9fc',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5BFF',
    marginBottom: 5,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 10,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E5BFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
  },
  horizontalScroll: {
    paddingVertical: 5,
  },
  orgItem: {
    marginRight: 14,
  },
  orgCard: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 40,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 5,
  },
  orgCategory: {
    fontSize: 14,
    color: '#718096',
  },
  earningContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningItem: {
    width: '48%',
    marginBottom: 15,
  },
  earningCard: {
    backgroundColor: '#f7f9fc',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  earningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginTop: 10,
  },
  jobItem: {
    width: width * 0.9,
    marginHorizontal: 15,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jobBureau: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  jobCompany: {
    fontSize: 14,
    color: '#2E5BFF',
    fontWeight: '500',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jobExperience: {
    fontSize: 14,
    color: '#718096',
  },
  jobType: {
    fontSize: 14,
    color: '#38a169',
    fontWeight: '500',
  },
  jobPosted: {
    fontSize: 12,
    color: '#a0aec0',
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 14,
    color: '#4a5568',
    fontStyle: 'italic',
  },
});

export default TalentDashboard;
