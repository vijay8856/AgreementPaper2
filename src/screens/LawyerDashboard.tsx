
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
const { width: screenWidth } = Dimensions.get('window');
type DashboardDetails = {
  arr: { increment: number; total_arr: number };
  sales: { increment: number; total_sales: number };
  costs: { increment: number; total_costs: number };
  timesheet: { increment: number; total_amount: number };
};
const LawyerDashboard = () => {
  // Sample data for charts
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);
const [resources, setResources] = useState<any[]>([]);

  // const fetchAgencyDashboard = async (isRefresh = false) => {
  //   if (!isRefresh) setLoading(true);
  //   else setRefreshing(true);

  //   const response = await Services.getAgencyDashboard();
  //   console.log("getAgencyDashboard res", response);

  //   if (response.success) {
  //     {
  //       setDashboardDetails(response.data);

  //     };
  //   } else {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Failed to load Agency Dashboard',
  //       text2: response.error?.message || 'Something went wrong',
  //       position: 'top',
  //     });
  //   }

  //   setLoading(false);
  //   setRefreshing(false);
  // };
  // useEffect(() => {
  //   fetchAgencyDashboard();
  // }, []);

const fetchTopResource = async () => {
  setLoading(true);
  const response = await Services.getTopResource();
  if (response?.data) { // Changed from results to data based on API response
    // Transform the API data to match our UI needs
    const formattedResources = response.data.map((resource: any) => ({
      id: resource.id,
      name: `${resource.user_detail.first_name} ${resource.user_detail.last_name}`,
      jobTitle: resource.current_job_title || "Not specified",
      email: resource.user_detail.email,
      location: `${resource.country_name} (${resource.state_name})`,
      experience: resource.total_experience || "0.0",
      jobType: "Full time", // Static as shown in screenshot
      currency: resource.currency_detail?.currency || "INR",
      profilePic: resource.user_detail.profile_pic,
      // Add any additional fields needed
    }));
    setResources(formattedResources);
  }
  setLoading(false);
};
  useEffect(() => {
    fetchTopResource();
  }, []);
const renderResourceCard = ({ item }: any) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={
            item.profilePic
              ? { uri: item.profilePic }
              : require('../assets/images/user.png')
          }
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{item.location}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Experience</Text>
        <Text style={styles.value}>{item.experience}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Job Type</Text>
        <Text style={styles.value}>{item.jobType}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Work Rate</Text>
        <Text style={styles.value}>{item.currency} *** /day</Text>
      </View>
    </View>
  );
};

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

  // const StatusCard = ({ title, sections }: any) => (
  //   <View style={styles.statusCard}>
  //     <View style={styles.statusHeader}>
  //       <Text style={styles.statusTitle}>{title}</Text>
  //       <View style={styles.changeIndicator}>
  //         <Text style={styles.changeValue}>+{sections.reduce((sum: any, s: { change: any; }) => sum + s.change, 0)}</Text>
  //         <Text style={styles.changeLabel}>Increased</Text>
  //       </View>
  //     </View>
  //     <View style={styles.statusSections}>
  //       {sections.map((section: { value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
  //         <View key={index} style={styles.statusSection}>
  //           <Text style={styles.sectionValue}>{section.value}</Text>
  //           <Text style={styles.sectionLabel}>{section.label}</Text>
  //         </View>
  //       ))}
  //     </View>
  //   </View>
  // );

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}


        {/* Top Metrics */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={styles.menuButton}
          >
            <Icon name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lawyer Dashboard</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyProfile')}
            style={styles.profileButton}
          >
            <Icon name="account-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.topMetrics}>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Total ARR"
              value={dashboardDetails?.arr.total_arr ?? 0}
              change={dashboardDetails?.arr.increment ?? 0}
              changeType="increase"
              icon="👥"
            />
            <MetricCard
              title="Total Sales"
              value={dashboardDetails?.sales.total_sales ?? 0}
              change={dashboardDetails?.sales.increment ?? 0}
              changeType="increase"
              icon="💰"
            />
          </View>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Total Costs"
              value={dashboardDetails?.costs.total_costs ?? 0}
              change={dashboardDetails?.costs.increment ?? 0}
              changeType="decrease"
              icon="📋"
            />
            <MetricCard
              title="Total Timesheet"
              value={dashboardDetails?.timesheet.total_amount ?? 0}
              change={dashboardDetails?.timesheet.increment ?? 0}
              changeType="increase"
              icon="⭐"
            />
          </View>
        </View>

<View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Resource</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All ›</Text>
          </TouchableOpacity>
        </View>

       
    
      {loading ? (
  <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
) : (
  <FlatList
    data={resources}
    renderItem={renderResourceCard}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={{ paddingBottom: 20 }}
  />
)}
        {/* Members Section */}
        {/* <View style={styles.membersContainer}>
          <Text style={styles.sectionTitle}>Members</Text>
          <View style={styles.memberItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>VT</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Vijay10 ten</Text>
              <Text style={styles.memberEmail}>vijay10@yopmail.com</Text>
            </View>
          </View>
        </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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




  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  seeAll: { color: "#2563eb", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flex: 1,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  headerInfo: { marginLeft: 10, flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  jobTitle: { fontSize: 14, color: "#6b7280" },
  email: { fontSize: 12, color: "#9ca3af" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  value: { fontSize: 13, color: "#111827" },
});

export default LawyerDashboard;