
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';
import Notifications from '../components/Modals/Notifications';
import { DeviceEventEmitter } from "react-native";
const { width: screenWidth } = Dimensions.get('window');
type DashboardDetails = {
  arr: { increment: number; total_arr: number };
  sales: { increment: number; total_sales: number };
  costs: { increment: number; total_costs: number };
  timesheet: { increment: number; total_amount: number };
};
type SecRowDetails = {
  msa: { approved: number; pending: number; completed: number };
  sow: { approved: number; pending: number; completed: number };
  timesheet: { pending: number; approved: number; rejected: number };
  pending: { msa: number; sow: number; timesheet: number };
  job: { active: number; applications: number };
  profile_completion: number;
};

const AgencyDashboard = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);
  const [secRowDetails, setSecRowDetails] = useState<SecRowDetails | null>(null);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const [companyName, setCompanyName] = useState("");
  const [graphData, setGraphData] = useState<{ labels: string[]; revenue: number[]; expense: number[] }>({
    labels: [],
    revenue: [],
    expense: [],
  });
  const [agencyType, setAgencyType] = useState<string | null>(null);

  useEffect(() => {
    const loadAgencyType = async () => {
      const type = await AsyncStorage.getItem('agencyType');

      setAgencyType(type?.trim().toUpperCase() || null);
    };

    loadAgencyType();
  }, []);


  useEffect(() => {
    const checkProfileStatus = async () => {
      const isActive = await AsyncStorage.getItem('isActive');
      console.log("isActive", isActive);

      if (isActive !== 'true') {
        setShowProfileModal(true);
      }
    };

    checkProfileStatus();
  }, []);

  useEffect(() => {
    console.log('agencyType 👉', agencyType);
  }, [agencyType]);

  const fetchGraphData = async () => {
    setLoading(true);
    const response = await Services.getAgencyDashboardGraphDetails();

    if (response.success) {
      const data = response.data;

      // ✅ Filter only valid items (skip "total" object)
      const filteredData = data.filter(
        (item) =>
          item.Date &&
          typeof item.revenue === 'number' &&
          isFinite(item.revenue) &&
          typeof item.expense === 'number' &&
          isFinite(item.expense)
      );

      const formattedLabels = filteredData.map((item) => {
        try {
          const [month, year] = item.Date.split(' ');
          const shortMonth = month.substring(0, 3);
          const shortYear = year.slice(-2);
          return `${shortMonth} ${shortYear}`;
        } catch (e) {
          return item.Date;
        }
      });

      setGraphData({
        labels: formattedLabels,
        revenue: filteredData.map((item) => Number(item.revenue) || 0),
        expense: filteredData.map((item) => Number(item.expense) || 0),
      });
    }

    setLoading(false);
  };



  useEffect(() => {
    fetchGraphData();
  }, []);

  const safeRevenue = graphData.revenue.map(v =>
    typeof v === 'number' && isFinite(v) ? v : 0
  );
  const safeExpense = graphData.expense.map(v =>
    typeof v === 'number' && isFinite(v) ? v : 0
  );

  const fetchAgencyDashboard = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    const response = await Services.getAgencyDashboard();
    console.log("getAgencyDashboard res", response);

    if (response.success) {
      {
        setDashboardDetails(response.data);

      };
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to load Agency Dashboard',
        text2: response.error?.message || 'Something went wrong',
        position: 'top',
      });
    }
    const secResponse = await Services.getAgencyDashboardSecRow();
    if (secResponse.success) setSecRowDetails(secResponse.data.payload);
    else
      Toast.show({
        type: 'error',
        text1: 'Failed to load Dashboard Status',
        text2: secResponse.error || 'Something went wrong',
        position: 'top',
      });
    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchAgencyDashboard();
  }, []);



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
      } catch (error) {
        console.log('Initial load error:', error);
      }
    };

    loadData();
  }, []);




  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "COMPANY_UPDATED",
      (newName) => {
        setCompanyName(newName); // 🔥 Instantly update dashboard header
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const loadPremiumStatus = async () => {
      const storedValue = await AsyncStorage.getItem('hasPremiumAccess');
      const hasPremiumAccess = JSON.parse(storedValue || 'false');
      const storedCompany = await AsyncStorage.getItem('company');
      const angencyType = await AsyncStorage.getItem('agencyType');

      console.log("storedCompany", storedCompany);

      if (storedCompany) {
        setCompanyName(storedCompany); // 🔥 Update state
      }
      navigation.setOptions({

        headerTitle: () => (
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", }}>
              Agency
              {" "}
              {angencyType ? (
                <Text style={{ color: "#fff", fontSize: 10, marginLeft: 2 }}>
                  ({angencyType})
                </Text>
              ) : null}
            </Text>

            {companyName ? (
              <Text style={{ color: "#fff", fontSize: 10, marginTop: 2 }}>
                {companyName}
              </Text>
            ) : null}


          </View>
        ),
        headerRight: () => (
          <>
            <View><Notifications /></View>
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
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
                  }}
                >
                  <Icon name="crown" size={14} color="#000" />
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>Premium</Text>
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
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>Upgrade Plan</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
                {userData?.profile_pic ? (
                  <Image
                    source={{
                      uri: `${userData.profile_pic}?timestamp=${new Date().getTime()}`,
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}
                    onError={(e) => console.log('Profile pic error:', e.nativeEvent.error)}
                  />
                ) : (
                  <Icon name="account-circle" size={28} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </>
        ),
        headerStyle: {
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
  const MetricCard = ({ title, value, change, changeType, icon }: any) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.changeContainer}>
        <Text style={[styles.changeText, { color: changeType === 'increase' ? '#10B981' : '#EF4444' }]}>
          {changeType === 'increase' ? '+' : ''}{change}
        </Text>
        <Text style={styles.changeLabel}>{changeType === 'increase' ? 'Increased' : 'Decreased'}</Text>
      </View>
    </View>
  );

  const StatusCard = ({ title, sections }: any) => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusTitle}>{title}</Text>
        <View style={styles.changeIndicator}>
          <Text style={styles.changeValue}>+{sections.reduce((sum: any, s: { change: any; }) => sum + s.change, 0)}</Text>
          <Text style={styles.changeLabel}>Increased</Text>
        </View>
      </View>
      <View style={styles.statusSections}>
        {sections.map((section: { value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
          <View key={index} style={styles.statusSection}>
            <Text style={styles.sectionValue}>{section.value}</Text>
            <Text style={styles.sectionLabel}>{section.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );


  const allItems = [
    { id: 1, icon: 'file-document-outline', label: 'AI-Full Review', screen: 'AIResFullReview', premium: true },
    { id: 2, icon: 'chip', label: 'AI-Review', screen: 'AIReview', premium: true },
    { id: 10, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: true },
    { id: 12, icon: 'application-edit', label: 'MasterAgreement', screen: 'MasterAgreement', premium: false },
    { id: 13, icon: 'animation', label: 'StatementOfWork', screen: 'StatementOfWork', premium: false },
    { id: 5, icon: 'scale-balance', label: 'Lawyers', screen: 'LawyerNetwork', premium: false },
    { id: 8, icon: 'gavel', label: 'Invite Lawyer', screen: 'InviteLawyer', premium: false },
    { id: 3, icon: 'account-tie', label: 'Organization Profile', screen: 'LawyerOrgProfile', premium: true },
    { id: 6, icon: 'briefcase-plus', label: 'Invite Organization', screen: 'InviteOrganization', premium: false },
    { id: 7, icon: 'account-group', label: 'Invite Talent', screen: 'InviteResource', premium: false },
    { id: 4, icon: 'cog-outline', label: 'Settings', screen: 'Settings', premium: false },
    { id: 11, icon: 'pencil-outline', label: 'ESignature', screen: 'ESignature', premium: false },
    { id: 9, icon: 'help-circle-outline', label: 'Help', screen: 'HelpScreen', premium: false },
    { id: 14, icon: 'account-box-outline', label: 'Talent Profile', screen: 'TalentProfileList', premium: false },
    { id: 15, icon: 'clipboard-text-outline', label: 'Job Post', screen: 'JobPostScreen', premium: false },
    { id: 16, icon: 'clipboard-text-outline', label: 'Individual Profile', screen: 'AllResourcesScreen', premium: false },
    { id: 17, icon: 'clipboard-text-outline', label: 'Job List ', screen: 'LatestJobsScreen', premium: false },




  ];
  const RESTRICTED_SCREENS_BY_ROLE: Record<string, string[]> = {

    RECRUITER: [
      // 'LawyerOrgProfile',
      // 'InviteOrganization',
      // 'StatementOfWork',
      // 'JobPostScreen',
      // 'InviteResource',
      // 'TalentProfileList',
    ],

    REAL_ESTATE_AGENT: [
      'LawyerOrgProfile',
      'InviteOrganization',
      'StatementOfWork',
      'JobPostScreen',
      'InviteResource',
      'TalentProfileList',
      'LatestJobsScreen'
    ],

    GOODS_AND_SERVICE_SUPPLIER: [
      // 'LawyerOrgProfile',
      // 'InviteOrganization',
      // 'StatementOfWork',
      // 'JobPostScreen',
      'InviteResource',
      'LatestJobsScreen'
      // 'TalentProfileList',
    ],
  };

  const finalMenuItems = useMemo(() => {
    return allItems.filter(item => {
      // 🚫 Role-based restrictions
      if (
        agencyType &&
        RESTRICTED_SCREENS_BY_ROLE[agencyType]?.includes(item.screen)
      ) {
        return false;
      }

      // 🚫 Premium restriction
      if (!hasPremiumAccess && item.premium) {
        return false;
      }
      return true;
    });
  }, [agencyType, hasPremiumAccess]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Metrics */}
        <View style={styles.topMetrics}>
          <View style={styles.metricsRow}>

            <MetricCard
              title="Total Sales"
              value={dashboardDetails?.sales.total_sales ?? 0}
              change={dashboardDetails?.sales.increment ?? 0}
              changeType="increase"
              icon="💰"
            />
            <MetricCard
              title="Total Costs"
              value={dashboardDetails?.costs.total_costs ?? 0}
              change={dashboardDetails?.costs.increment ?? 0}
              changeType="decrease"
              icon="📋"
            />
          </View>
          <View style={styles.metricsRow}>

            <MetricCard
              title="Total Timesheet"
              value={dashboardDetails?.timesheet.total_amount ?? 0}
              change={dashboardDetails?.timesheet.increment ?? 0}
              changeType="increase"
              icon="⭐"
            />
            <MetricCard
              title="Total ARR"
              value={dashboardDetails?.arr.total_arr ?? 0}
              change={dashboardDetails?.arr.increment ?? 0}
              changeType="increase"
              icon="👥"
            />
          </View>
        </View>


        {/* Grid Items Section */}
        <View style={styles.gridSection}>
          <View style={styles.gridContainer}>
            {finalMenuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Icon name={item.icon} size={26} color="#0E3386" />
                <Text style={styles.gridItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        {secRowDetails && (
          <>
            <View style={styles.statusCardsContainer}>
              <StatusCard
                title="Master Service Agreement"
                sections={[
                  { value: secRowDetails.msa.pending, label: 'Upcoming', change: 0 },
                  { value: secRowDetails.msa.approved, label: 'In Progress', change: 0 },
                  { value: secRowDetails.msa.completed, label: 'Completed', change: 0 },
                ]}
              />
            </View>

            <View style={styles.statusCardsContainer}>
              <StatusCard
                title="Statement of Work"
                sections={[
                  { value: secRowDetails.sow.pending, label: 'Upcoming', change: 0 },
                  { value: secRowDetails.sow.approved, label: 'In Progress', change: 0 },
                  { value: secRowDetails.sow.completed, label: 'Completed', change: 0 },
                ]}
              />
            </View>

            <View style={styles.statusCardsContainer}>
              <StatusCard
                title="Time Sheet"
                sections={[
                  { value: secRowDetails.timesheet.pending, label: 'Upcoming', change: 0 },
                  { value: secRowDetails.timesheet.approved, label: 'In Progress', change: 0 },
                  { value: secRowDetails.timesheet.rejected, label: 'Rejected', change: 0 },
                ]}
              />
            </View>

            <View style={styles.statusCardsContainer}>
              <StatusCard
                title="Pending Approval"
                sections={[
                  { value: secRowDetails.pending.msa, label: 'MSA', change: 0 },
                  { value: secRowDetails.pending.sow, label: 'SOW', change: 0 },
                  { value: secRowDetails.pending.timesheet, label: 'Timesheet', change: 0 },
                ]}
              />
            </View>

            <View style={styles.statusCardsContainer}>
              <StatusCard
                title="Job Posting"
                sections={[
                  { value: secRowDetails.job.active, label: 'Active Jobs', change: 0 },
                  { value: secRowDetails.job.applications, label: 'Applications', change: 0 },
                  { value: 0, label: 'Total Jobs', change: 0 },
                ]}
              />
            </View>

          </>
        )}
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
    backgroundColor: '#F9FAFB',
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
    marginBottom: 24,
  },
  gridSection: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0E3386',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',

  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffff',
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
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
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
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
    padding: 10,
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
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  changePercent: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  mapContainer: {
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
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateFilter: {
    fontSize: 14,
    color: '#6B7280',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 24,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
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
  menuButton: {
    padding: 5,
  },

  profileButton: {
    padding: 5,
  },
});

export default AgencyDashboard;