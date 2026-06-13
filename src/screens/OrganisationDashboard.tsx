// @ts-nocheck

import React, {useEffect, useState} from 'react';
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
  FlatList,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import {LineChart, PieChart} from 'react-native-chart-kit';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Notifications from '../components/Modals/Notifications';
import {DeviceEventEmitter} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const {width: screenWidth} = Dimensions.get('window');

interface DashboardDetails {
  message: string;
  status: number;
  payload: {
    estimate_savings: {
      average_savings: number;
      increment: number;
    };
    job: {
      active: number;
      applications: number;
      job_increment: number;
      applications_increment: number;
    };
    msa: {
      approved: number;
      pending: number;
      completed: number;
    };
    pending: {
      msa: number;
      sow: number;
      timesheet: number;
    };
    profile_completion: number;
    sow: {
      approved: number;
      pending: number;
      completed: number;
    };
    timesheet: {
      pending: number;
      approved: number;
      rejected: number;
    };
    total_active_suppliers: {
      active_suppliers: number;
      country_wise_data: any;
      increment: number;
    };
  };
}

const OrganisationDashboard = () => {
  const navigation = useNavigation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const [members, setMembers] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{data: []}],
  });
  const [totalSpend, setTotalSpend] = useState(0);
  const [contractStatusData, setContractStatusData] = useState([]);

  const insets = useSafeAreaInsets();
  console.log('dash', dashboardDetails);

  const fetchDashboardMap = async () => {
    try {
      setLoadingChart(true);
      const response = await Services.getOrganisationDashboardMap();
      console.log('Dashboard Map API Response:', response);

      if (response.success) {
        const data = response.data;

        // Filter only the objects that contain 'Date'
        const validData = data.filter(item => item.Date);

        // Extract labels and total spend (sum of MSA + SOW + Timesheet + Invoice)
        const labels = validData.map(item => {
          const [month, year] = item.Date.split(' ');
          const monthMap = {
            January: 'Jan',
            February: 'Feb',
            March: 'Mar',
            April: 'Apr',
            May: 'May',
            June: 'Jun',
            July: 'Jul',
            August: 'Aug',
            September: 'Sep',
            October: 'Oct',
            November: 'Nov',
            December: 'Dec',
          };
          const shortMonth = monthMap[month] || month;
          return `${shortMonth} ${year.slice(-2)}`;
        });

        const totalSpends = validData.map(
          item => item.MSA + item.SOW + item.Timesheet + item.Invoice,
        );

        // Calculate total of all spend values
        const total = totalSpends.reduce((sum, value) => sum + value, 0);
        setTotalSpend(total);

        // Prepare chart data
        const formattedData = {
          labels,
          datasets: [
            {
              data: totalSpends,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
        setChartData(formattedData);

        // Added for contract_status
        const lastItem = data[data.length - 1];
        if (lastItem && lastItem.contract_status) {
          const {contract_status} = lastItem;

          const formattedContractStatus = [
            {
              name: 'In Progress',
              population: contract_status.in_progress || 0,
              color: '#3B82F6',
              legendFontColor: '#374151',
              legendFontSize: 12,
            },
            {
              name: 'Approved',
              population: contract_status.approved || 0,
              color: '#10B981',
              legendFontColor: '#374151',
              legendFontSize: 12,
            },
            {
              name: 'Completed',
              population: contract_status.completed || 0,
              color: '#6366F1',
              legendFontColor: '#374151',
              legendFontSize: 12,
            },
            {
              name: 'Pending Approval',
              population: contract_status.pending_approval || 0,
              color: '#F59E0B',
              legendFontColor: '#374151',
              legendFontSize: 12,
            },
          ];

          setContractStatusData(formattedContractStatus);
        }
      } else {
        console.log('Failed to fetch chart data:', response.error);
      }
    } catch (err) {
      console.log('Error fetching chart data:', err);
    } finally {
      setLoadingChart(false);
    }
  };

  useEffect(() => {
    fetchDashboardMap();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const storedData = await AsyncStorage.getItem('userData');
          if (storedData) {
            const parsed = JSON.parse(storedData);

            if (parsed.profile_pic?.startsWith('/')) {
              parsed.profile_pic = `https://api.agreementpaper.com${parsed.profile_pic}`;
            }
            if (parsed.profile?.logo?.startsWith('/')) {
              parsed.profile.logo = `https://api.agreementpaper.com${parsed.profile.logo}`;
            }

            setUserData(parsed);
          }
        } catch (e) {
          console.log('LOAD ERROR:', e);
        }
      };

      loadData();
    }, []),
  );

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

  const fetchOrganisationDashboard = async (isRefresh = false) => {
    if (!isRefresh) setLoadingDashboard(true);
    else setRefreshing(true);

    try {
      const response = await Services.getOrganisationDashboard();
      console.log('fetchOrganisationDashboard res', response);

      if (response.success) {
        setDashboardDetails(response.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to load Organisation Dashboard',
          text2: response.error?.message || 'Something went wrong',
          position: 'top',
        });
      }
    } catch (error) {
      console.log('Error fetching dashboard:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to load dashboard data',
        position: 'top',
      });
    } finally {
      setLoadingDashboard(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrganisationDashboard();
  }, []);

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await Services.getOrganisationDashboardUser();
      console.log('Organisation Users Response:', response);

      if (response.success) {
        setMembers(response.data?.results || []);
      } else {
        console.log('Failed to fetch members:', response.error);
      }
    } catch (err) {
      console.log('Error loading members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'COMPANY_UPDATED',
      newName => {
        setCompanyName(newName);
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const loadPremiumStatus = async () => {
      const storedValue = await AsyncStorage.getItem('hasPremiumAccess');
      const hasPremiumAccess = JSON.parse(storedValue || 'false');
      const storedCompany = await AsyncStorage.getItem('company');

      if (storedCompany) {
        setCompanyName(storedCompany);
      }
      navigation.setOptions({
        headerTitleAlign: 'left',
        headerStatusBarHeight: Platform.OS === 'ios' ? insets.top : undefined,
        headerTitle: () => (
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: Platform.OS === 'ios' ? 12 : 18,
              }}>
              Organization
            </Text>

            {companyName ? (
              <Text style={{color: '#fff', fontSize: 12, marginTop: 2}}>
                {companyName}
              </Text>
            ) : null}
          </View>
        ),

        headerRight: () => (
          <>
            <View>
              <Notifications />
            </View>
            <View style={{flexDirection: 'row', marginRight: 10}}>
              {/* Conditional Button */}
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
                  }}>
                  <Icon name="crown" size={14} color="#000" />
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginLeft: 5,
                    }}>
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
                  }}>
                  <Text
                    style={{color: '#000', fontSize: 12, fontWeight: 'bold'}}>
                    Upgrade Plan
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => navigation.navigate('MyProfile')}>
                {userData?.profile_pic ? (
                  <Image
                    source={{
                      uri: `${userData.profile_pic}?t=${Date.now()}`,
                    }}
                    style={styles.headerImg}
                    onError={e =>
                      console.log('Profile error →', e.nativeEvent.error)
                    }
                  />
                ) : (
                  <Icon name="account-circle" size={28} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </>
        ),
        headerStyle: {
          height: Platform.OS === 'ios' ? 44 + insets.top : 100,
          backgroundColor: '#0E3386',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      });
    };

    loadPremiumStatus();
  }, [navigation, userData, companyName]);

  const MetricCard = ({title, value, change, changeType, icon}: any) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.changeContainer}>
        <Text
          style={[
            styles.changeText,
            {color: changeType === 'increase' ? '#10B981' : '#EF4444'},
          ]}>
          {changeType === 'increase' ? '+' : ''}
          {change}
        </Text>
        <Text style={styles.changeLabel}>
          {changeType === 'increase' ? 'Increased' : 'Decreased'}
        </Text>
      </View>
    </View>
  );

  const StatusCard = ({title, sections, loading = false}: any) => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusTitle}>{title}</Text>
        {!loading && (
          <View style={styles.changeIndicator}>
            {/* <Text style={styles.changeValue}>
              +
              {sections.reduce(
                (sum: any, s: {change: any}) => sum + s.change,
                0,
              )}
            </Text>
            <Text style={styles.changeLabel}>Increased</Text> */}
          </View>
        )}
      </View>
      {loading ? (
        <View style={styles.sectionLoader}>
          <ActivityIndicator size="small" color="#0E3386" />
        </View>
      ) : (
        <View style={styles.statusSections}>
          {sections.map(
            (
              section: {value: any; label: any},
              index: React.Key | null | undefined,
            ) => (
              <View key={index} style={styles.statusSection}>
                <Text style={styles.sectionValue}>{section.value}</Text>
                <Text style={styles.sectionLabel}>{section.label}</Text>
              </View>
            ),
          )}
        </View>
      )}
    </View>
  );

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
      icon: 'chip',
      label: 'AI-Review',
      screen: 'AIReview',
      premium: false,
    },
    {id: 3, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: false},
    {
      id: 4,
      icon: 'application-edit',
      label: 'MasterAgreement',
      screen: 'MasterAgreement',
      premium: false,
    },
    {
      id: 5,
      icon: 'animation',
      label: 'StatementOfWork',
      screen: 'StatementOfWork',
      premium: false,
    },
    {
      id: 6,
      icon: 'account-tie',
      label: 'Suppliers/Agencies',
      screen: 'SupplierAgency',
      premium: false,
    },
    {
      id: 15,
      icon: 'cog-outline',
      label: 'Settings',
      screen: 'Settings',
      premium: false,
    },
    {
      id: 16,
      icon: 'scale-balance',
      label: 'Lawyers',
      screen: 'LawyerNetwork',
      premium: false,
    },
    {
      id: 7,
      icon: 'briefcase-plus',
      label: 'Invite Agency',
      screen: 'InviteAgency',
      premium: false,
    },
    {
      id: 8,
      icon: 'account-group',
      label: 'Invite Resource',
      screen: 'InviteResource',
      premium: false,
    },
    {
      id: 9,
      icon: 'clipboard-text-outline',
      label: 'Talent Profile',
      screen: 'TalentProfileList',
      premium: false,
    },
    {
      id: 10,
      icon: 'help-circle-outline',
      label: 'Help',
      screen: 'HelpScreen',
      premium: false,
    },
    {
      id: 12,
      icon: 'pencil-outline',
      label: 'ESignature',
      screen: 'ESignature',
      premium: false,
    },
    {
      id: 13,
      icon: 'clipboard-text-outline',
      label: 'Job Post',
      screen: 'JobPostScreen',
      premium: false,
    },
    {
      id: 14,
      icon: 'gavel',
      label: 'Invite Lawyer',
      screen: 'InviteLawyer',
      premium: false,
    },
    {
      id: 18,
      icon: 'chip',
      label: ' Posted Job',
      screen: 'PostedJobsScreen',
      premium: false,
    },
  ];

  const gridItems = allItems.filter(item => hasPremiumAccess || !item.premium);

  const renderMember = ({item}: any) => {
    const user = item.user_detail;
    const initials =
      (user?.first_name?.[0]?.toUpperCase() || '') +
      (user?.last_name?.[0]?.toUpperCase() || '');

    return (
      <View style={styles.memberItem}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.memberEmail}>{user?.email}</Text>
        </View>
      </View>
    );
  };

  // Show main loader only on initial load
  if (loadingDashboard && !dashboardDetails) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#123B8C" // Android only, safe to keep
      />

      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                fetchOrganisationDashboard(true);
                fetchDashboardMap();
                loadMembers();
              }}
              colors={['#0E3386']}
            />
          }>
          {/* Top Metrics */}
          <View style={styles.topMetrics}>
            <View style={styles.metricsRow}>
              <MetricCard
                title="Total Active Suppliers - Agencies"
                value={
                  dashboardDetails?.payload?.total_active_suppliers
                    ?.active_suppliers ?? 0
                }
                change={
                  dashboardDetails?.payload?.total_active_suppliers
                    ?.increment ?? 0
                }
                changeType="increase"
                icon="👥"
              />
              <MetricCard
                title="Estimated Savings"
                value={
                  dashboardDetails?.payload?.estimate_savings
                    ?.average_savings ?? 0
                }
                change={
                  dashboardDetails?.payload?.estimate_savings?.increment ?? 0
                }
                changeType="increase"
                icon="💰"
              />
            </View>

            <View style={styles.metricsRow}>
              <MetricCard
                title="Published Jobs"
                value={dashboardDetails?.payload?.job?.active ?? 0}
                change={dashboardDetails?.payload?.job?.job_increment ?? 0}
                changeType="decrease"
                icon="📋"
              />
              <MetricCard
                title="Shortlisted"
                value={dashboardDetails?.payload?.job?.applications ?? 0}
                change={
                  dashboardDetails?.payload?.job?.applications_increment ?? 0
                }
                changeType="increase"
                icon="⭐"
              />
            </View>
          </View>

          {/* Grid Items Section */}
          <View style={styles.gridSection}>
            <View style={styles.gridContainer}>
              {gridItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate(item.screen as never)}>
                  <View style={styles.iconContainer}>
                    <Icon name={item.icon} size={28} color="#0E3386" />
                  </View>
                  <Text style={styles.gridItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Cards with individual loaders */}
          <View style={styles.statusCardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('MasterAgreement' as never)}>
              <StatusCard
                title="Master Service Agreement"
                loading={loadingDashboard}
                sections={[
                  {
                    value: dashboardDetails?.payload?.msa?.pending ?? 0,
                    label: 'Upcoming',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.msa?.approved ?? 0,
                    label: 'In Progress',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.msa?.completed ?? 0,
                    label: 'Completed',
                    change: 0,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusCardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('StatementOfWork' as never)}>
              <StatusCard
                title="Statement of Work"
                loading={loadingDashboard}
                sections={[
                  {
                    value: dashboardDetails?.payload?.sow?.pending ?? 0,
                    label: 'Upcoming',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.sow?.approved ?? 0,
                    label: 'In Progress',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.sow?.completed ?? 0,
                    label: 'Completed',
                    change: 0,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusCardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TimeSheet' as never)}>
              <StatusCard
                title="Time Sheet"
                loading={loadingDashboard}
                sections={[
                  {
                    value: dashboardDetails?.payload?.timesheet?.pending ?? 0,
                    label: 'Upcoming',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.timesheet?.approved ?? 0,
                    label: 'In Progress',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.timesheet?.rejected ?? 0,
                    label: 'Rejected',
                    change: 0,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusCardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ApprovalScreen' as never)}>
              <StatusCard
                title="Pending Approval"
                loading={loadingDashboard}
                sections={[
                  {
                    value: dashboardDetails?.payload?.pending?.msa ?? 0,
                    label: 'TMSA',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.pending?.sow ?? 0,
                    label: 'SOW',
                    change: 0,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.statusCardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PostedJobsScreen' as never)}>
              <StatusCard
                title="Posted Job "
                loading={loadingDashboard}
                sections={[
                  {
                    value: dashboardDetails?.payload?.job?.active ?? 0,
                    label: 'Active',
                    change: 0,
                  },
                  {
                    value: dashboardDetails?.payload?.job?.applications ?? 0,
                    label: 'Applications',
                    change: 0,
                  },
                  {
                    value:
                      dashboardDetails?.payload?.job?.applications_increment ??
                      0,
                    label: 'Incre. Applications',
                    change: 0,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
          {/* Total Spend Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Total Spend</Text>
            {loadingChart ? (
              <View style={styles.chartLoader}>
                <ActivityIndicator size="large" color="#0E3386" />
                <Text style={styles.loadingText}>Loading chart data...</Text>
              </View>
            ) : chartData.labels.length > 0 ? (
              <>
                <Text style={styles.totalSpendText}>
                  Total: ${totalSpend.toLocaleString()}
                </Text>
                <LineChart
                  data={chartData}
                  width={screenWidth - 60}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(107, 114, 128, ${opacity})`,
                    style: {borderRadius: 16},
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#3B82F6',
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </>
            ) : (
              <Text style={styles.noDataText}>No chart data available</Text>
            )}
          </View>

          {/* Contract Status */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              Contract Status (MSA and SOWs)
            </Text>
            {loadingChart ? (
              <View style={styles.chartLoader}>
                <ActivityIndicator size="large" color="#0E3386" />
                <Text style={styles.loadingText}>Loading contract data...</Text>
              </View>
            ) : contractStatusData.length > 0 ? (
              <PieChart
                data={contractStatusData}
                width={screenWidth - 30}
                height={200}
                chartConfig={{
                  backgroundColor: '#c73232ff',
                  backgroundGradientFrom: '#b04141ff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            ) : (
              <Text style={styles.noDataText}>
                No contract status data available
              </Text>
            )}
          </View>

          {/* Members Section */}
          <View style={styles.membersContainer}>
            <Text style={styles.sectionTitle}>Members</Text>
            {loadingMembers ? (
              <View style={styles.sectionLoader}>
                <ActivityIndicator size="large" color="#0E3386" />
                <Text style={styles.loadingText}>Loading members...</Text>
              </View>
            ) : members.length > 0 ? (
              <FlatList
                data={members}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderMember}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noDataText}>No members found</Text>
            )}
          </View>
        </ScrollView>

        <OrganizationProfileModal
          visible={showProfileModal}
          onComplete={() => setShowProfileModal(false)}
          onClose={() => setShowProfileModal(false)}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLoader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLoader: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0E3386',
    padding: 15,
    marginBottom: 10,
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
    width: (Dimensions.get('window').width - 48) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  gridSection: {
    marginBottom: 24,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  topMetrics: {
    padding: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#dfdedeff',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  icon: {
    fontSize: 20,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  changeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusCardsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  statusCard: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 8,

    // Android shadow
    elevation: 10,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  changeIndicator: {
    alignItems: 'flex-end',
  },
  changeValue: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  statusSections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusSection: {
    alignItems: 'center',
  },
  sectionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  totalSpendText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  membersContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  memberEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default OrganisationDashboard;
