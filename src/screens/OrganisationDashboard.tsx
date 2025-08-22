
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
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: screenWidth } = Dimensions.get('window');

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
     const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);
      const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);

      console.log("dashboardDetails",dashboardDetails);
  

      
  // Sample data for charts
  const totalSpendData = {
    labels: ['Feb2025', 'Mar2025', 'Apr2025', 'May2025', ],
    datasets: [
      {
        data: [200000, 300000, 1200000, 400000, ],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  useEffect(() => {
    const checkProfileStatus = async () => {
      const isActive = await AsyncStorage.getItem('isActive');
      if (isActive !== 'true') {
        setShowProfileModal(true);
      }
    };
    
    checkProfileStatus();
  }, []);


  const fetchOrganisationDashboard = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    const response = await Services.getOrganisationDashboard();
console.log("fetchOrganisationDashboard res",response);

    if (response.success) {{
      setDashboardDetails(response.data);
  
      };
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to load Organisation Dashboard',
        text2: response.error?.message || 'Something went wrong',
        position: 'top',
      });
    }

    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchOrganisationDashboard();
  }, []);



  const contractStatusData = [
    {
      name: 'Active',
      population: 17,
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Pending',
      population: 83,
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  const MetricCard = ({ title, value, change, changeType, icon }:any) => (
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

  const StatusCard = ({ title, sections }:any) => (
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
{loading ? (
  <ActivityIndicator size="small" color="#0000ff" />
) : (
  <StatusCard  />
)}
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
    

    <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={styles.menuButton}
          >
            <Icon name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organisation Dashboard</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('MyProfile')}
            style={styles.profileButton}
          >
            <Icon name="account-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>




        {/* Top Metrics */}
    <View style={styles.topMetrics}>
  <View style={styles.metricsRow}>
    <MetricCard
      title="Total Active Suppliers - Agencies"
      value={dashboardDetails?.payload?.total_active_suppliers?.active_suppliers ?? 0}
      change={dashboardDetails?.payload?.total_active_suppliers?.increment ?? 0}
      changeType="increase"
      icon="👥"
    />
    <MetricCard
      title="Estimated Savings"
      value={dashboardDetails?.payload?.estimate_savings?.average_savings ?? 0}
      change={dashboardDetails?.payload?.estimate_savings?.increment ?? 0}
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
      change={dashboardDetails?.payload?.job?.applications_increment ?? 0}
      changeType="increase"
      icon="⭐"
    />
  </View>
</View>

        {/* Status Cards */}
        {/* Master Service Agreement */}
<View style={styles.statusCardsContainer}>
  <StatusCard
    title="Master Service Agreement"
    sections={[
      { 
        value: dashboardDetails?.payload?.msa?.pending ?? 0, 
        label: 'Upcoming', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.msa?.approved ?? 0, 
        label: 'In Progress', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.msa?.completed ?? 0, 
        label: 'Completed', 
        change: 0 
      },
    ]}
  />
</View>

{/* Statement of Work */}
<View style={styles.statusCardsContainer}>
  <StatusCard
    title="Statement of Work"
    sections={[
      { 
        value: dashboardDetails?.payload?.sow?.pending ?? 0, 
        label: 'Upcoming', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.sow?.approved ?? 0, 
        label: 'In Progress', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.sow?.completed ?? 0, 
        label: 'Completed', 
        change: 0 
      },
    ]}
  />
</View>

{/* Time Sheet */}
<View style={styles.statusCardsContainer}>
  <StatusCard
    title="Time Sheet"
    sections={[
      { 
        value: dashboardDetails?.payload?.timesheet?.pending ?? 0, 
        label: 'Upcoming', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.timesheet?.approved ?? 0, 
        label: 'In Progress', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.timesheet?.rejected ?? 0, 
        label: 'Rejected', 
        change: 0 
      },
    ]}
  />
</View>

{/* Pending Approval */}
<View style={styles.statusCardsContainer}>
  <StatusCard
    title="Pending Approval"
    sections={[
      { 
        value: dashboardDetails?.payload?.pending?.msa ?? 0, 
        label: 'TMSA', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.pending?.sow ?? 0, 
        label: 'SOW', 
        change: 0 
      },
    ]}
  />
</View>

{/* Job Posting */}
<View style={styles.statusCardsContainer}>
  <StatusCard
    title="Job Posting"
    sections={[
      { 
        value: dashboardDetails?.payload?.pending?.timesheet ?? 0, 
        label: 'Timesheet', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.job?.applications ?? 0, 
        label: 'Applications', 
        change: 0 
      },
      { 
        value: dashboardDetails?.payload?.job?.active ?? 0, 
        label: 'Total Jobs', 
        change: 0 
      },
    ]}
  />
</View>
        {/* Total Spend Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Total Spend</Text>
            <Text style={styles.totalAmount}>1465045.00</Text>
            <Text style={styles.changePercent}>+0.00%</Text>
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>Active MSA</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Active SOW</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Timesheet</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Invoice</Text>
            </View>
          </View>
          <LineChart
            data={totalSpendData}
            width={screenWidth - 35}
            height={250}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#3B82F6',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Contract Status */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Contract Status (MSA and SOWs)</Text>
          <PieChart
            data={contractStatusData}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Active Suppliers Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.chartTitle}>Active Suppliers</Text>
            <Text style={styles.dateFilter}>April 2024</Text>
          </View>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>🗺️ World Map</Text>
            <Text style={styles.mapSubtext}>Active suppliers locations</Text>
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.membersContainer}>
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
        </View>
      </ScrollView>


      <OrganizationProfileModal
        visible={showProfileModal}
        onComplete={() => setShowProfileModal(false)}
        onClose={() => setShowProfileModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({


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
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sidebarContent: {
    backgroundColor: '#fff',
    width: '70%',
    alignSelf: 'flex-end',
    height: '50%',
    paddingTop: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default OrganisationDashboard;