
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   ActivityIndicator,
//   Image,
// } from 'react-native';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import Services from '../Services/services';
// import Toast from 'react-native-toast-message';
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { FlatList } from 'react-native-gesture-handler';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// const { width: screenWidth } = Dimensions.get('window');
// type DashboardDetails = {
//   arr: { increment: number; total_arr: number };
//   sales: { increment: number; total_sales: number };
//   costs: { increment: number; total_costs: number };
//   timesheet: { increment: number; total_amount: number };
// };
// const LawyerDashboard = () => {
//   // Sample data for charts
//   const navigation = useNavigation();
//     const insets = useSafeAreaInsets(); 
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//  const [showProfileModal, setShowProfileModal] = useState(false);
//   const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);
// const [resources, setResources] = useState<any[]>([]);
//   const [hasPremiumAccess, setHasPremiumAccess] = useState(true);

//   // const fetchAgencyDashboard = async (isRefresh = false) => {
//   //   if (!isRefresh) setLoading(true);
//   //   else setRefreshing(true);

//   //   const response = await Services.getAgencyDashboard();
//   //   console.log("getAgencyDashboard res", response);

//   //   if (response.success) {
//   //     {
//   //       setDashboardDetails(response.data);

//   //     };
//   //   } else {
//   //     Toast.show({
//   //       type: 'error',
//   //       text1: 'Failed to load Agency Dashboard',
//   //       text2: response.error?.message || 'Something went wrong',
//   //       position: 'top',
//   //     });
//   //   }

//   //   setLoading(false);
//   //   setRefreshing(false);
//   // };
//   // useEffect(() => {
//   //   fetchAgencyDashboard();
//   // }, []);

// const fetchTopResource = async () => {
//   try {
//     setLoading(true);
//     const data={
//       limit:5
//     }
//     const response = await Services.getIndividualUserProfile(data);
//     console.log("API Response:", response);

//     if (response?.success && Array.isArray(response.data)) {
//       // Transform the API data to match UI
//       const formattedResources = response.data.map((item) => ({
//         id: item.id,
//         name: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
//         email: item.email || "N/A",
//         contactNumber: item.contact_number || "N/A",
//         profilePic: item.profile_pic
//           ? `http://192.168.116.235:3000${item.profile_pic}`
//           : null,
//       }));

//       console.log("Formatted Data:", formattedResources);
//       setResources(formattedResources);
//     } else {
//       console.warn("Unexpected API response structure:", response);
//       setResources([]);
//     }
//   } catch (error) {
//     console.error("Error fetching top resources:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchTopResource();
//   }, []);

//     useEffect(() => {
//     const checkProfileStatus = async () => {
//       const isActive = await AsyncStorage.getItem('isActive');
//       console.log("isActive",isActive);

//       if (isActive !== 'true') {
//         setShowProfileModal(true);
//       }
//     };

//     checkProfileStatus();
//   }, []);
// const renderResourceCard = ({ item }: any) => {
//   return (
//     <View style={styles.card}>
//       <View style={styles.headerRow}>
//         <Image
//           source={
//             item.profilePic
//               ? { uri: item.profilePic }
//               : require('../assets/images/user.png')
//           }
//           style={styles.avatar}
//         />
//         <View style={styles.headerInfo}>
//           <Text style={styles.name}>{item.name}</Text>
//           {/* <Text style={styles.jobTitle}>{item.jobTitle}</Text> */}
//           <Text style={styles.email}>{item.email}</Text>
//         </View>
//       </View>

//       <View style={styles.detailRow}>
//         <Text style={styles.label}>Contact</Text>
//         <Text style={styles.value}>{item.contactNumber}</Text>
//       </View>
//       {/* <View style={styles.detailRow}>
//         <Text style={styles.label}>Experience</Text>
//         <Text style={styles.value}>{item.experience}</Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Text style={styles.label}>Job Type</Text>
//         <Text style={styles.value}>{item.jobType}</Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Text style={styles.label}>Work Rate</Text>
//         <Text style={styles.value}>{item.currency} *** /day</Text>
//       </View> */}
//     </View>
//   );
// };

//   const MetricCard = ({ title, value, change, changeType, icon }: any) => (
//     <View style={styles.metricCard}>
//       <View style={styles.metricHeader}>
//         <View style={styles.iconContainer}>
//           <Text style={styles.icon}>{icon}</Text>
//         </View>
//         <Text style={styles.metricTitle}>{title}</Text>
//       </View>
//       <Text style={styles.metricValue}>{value}</Text>
//       <View style={styles.changeContainer}>
//         <Text style={[styles.changeText, { color: changeType === 'increase' ? '#10B981' : '#EF4444' }]}>
//           {changeType === 'increase' ? '+' : ''}{change}
//         </Text>
//         <Text style={styles.changeLabel}>{changeType === 'increase' ? 'Increased' : 'Decreased'}</Text>
//       </View>
//     </View>
//   );

//   // const StatusCard = ({ title, sections }: any) => (
//   //   <View style={styles.statusCard}>
//   //     <View style={styles.statusHeader}>
//   //       <Text style={styles.statusTitle}>{title}</Text>
//   //       <View style={styles.changeIndicator}>
//   //         <Text style={styles.changeValue}>+{sections.reduce((sum: any, s: { change: any; }) => sum + s.change, 0)}</Text>
//   //         <Text style={styles.changeLabel}>Increased</Text>
//   //       </View>
//   //     </View>
//   //     <View style={styles.statusSections}>
//   //       {sections.map((section: { value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
//   //         <View key={index} style={styles.statusSection}>
//   //           <Text style={styles.sectionValue}>{section.value}</Text>
//   //           <Text style={styles.sectionLabel}>{section.label}</Text>
//   //         </View>
//   //       ))}
//   //     </View>
//   //   </View>
//   // );
// const allItems = [
//     { id: 1, icon: 'file-document-outline', label: 'AI-Full Review', screen: 'AIResFullReview', premium: true },
//     { id: 2, icon: 'chip', label: 'AI-Review', screen: 'AIReview', premium: true },
//     { id: 10, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: true },
//     { id: 5, icon: 'scale-balance', label: 'Lawyers', screen: 'LawyerNetwork', premium: false },
//     { id: 8, icon: 'gavel', label: 'Invite Lawyer', screen: 'InviteLawyer', premium: false },
//     { id: 3, icon: 'account-tie', label: 'Suppliers/Agencies', screen: 'SupplierAgency', premium: true },
//     { id: 6, icon: 'briefcase-plus', label: 'Invite Agency', screen: 'InviteAgency', premium: false },
//     { id: 7, icon: 'account-group', label: 'Invite Your Friends', screen: 'InviteResource', premium: false },
//     { id: 4, icon: 'cog-outline', label: 'Settings', screen: 'Settings', premium: false },
//     { id: 11, icon: 'pencil-outline', label: 'ESignature', screen: 'ESignature', premium: false },
//     { id: 9, icon: 'help-circle-outline', label: 'Help', screen: 'HelpScreen', premium: false },
//   ];

//   const gridItems = allItems.filter(item => hasPremiumAccess || !item.premium);
//   return (
//     <>
//     <SafeAreaView style={styles.container}>
//       {/* <ScrollView showsVerticalScrollIndicator={false}> */}


//         {/* Top Metrics */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
//             style={styles.menuButton}
//           >
//             <Icon name="menu" size={28} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Lawyer Dashboard</Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('MyProfile')}
//             style={styles.profileButton}
//           >
//             <Icon name="account-circle" size={28} color="#fff" />
//           </TouchableOpacity>
//         </View>
//         {/* <View style={styles.topMetrics}>
//           <View style={styles.metricsRow}>
//             <MetricCard
//               title="Total ARR"
//               value={dashboardDetails?.arr.total_arr ?? 0}
//               change={dashboardDetails?.arr.increment ?? 0}
//               changeType="increase"
//               icon="👥"
//             />
//             <MetricCard
//               title="Total Sales"
//               value={dashboardDetails?.sales.total_sales ?? 0}
//               change={dashboardDetails?.sales.increment ?? 0}
//               changeType="increase"
//               icon="💰"
//             />
//           </View>
//           <View style={styles.metricsRow}>
//             <MetricCard
//               title="Total Costs"
//               value={dashboardDetails?.costs.total_costs ?? 0}
//               change={dashboardDetails?.costs.increment ?? 0}
//               changeType="decrease"
//               icon="📋"
//             />
//             <MetricCard
//               title="Total Timesheet"
//               value={dashboardDetails?.timesheet.total_amount ?? 0}
//               change={dashboardDetails?.timesheet.increment ?? 0}
//               changeType="increase"
//               icon="⭐"
//             />
//           </View>
//         </View> */}
//     {/* Grid Items Section */}
//       <View style={styles.gridSection}>
//         <View style={styles.gridContainer}>
//           {gridItems.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={styles.gridItem}
//              // Change this in your gridItems map:
// onPress={() => navigation.navigate(item.screen as never)}
//             >
//               <View style={styles.iconContainer}>
//                 <Icon name={item.icon} size={28} color="#0E3386" />
//               </View>
//               <Text style={styles.gridItemText}>{item.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
// <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Individual Buyers</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('AllResourcesScreen')}>
//         <Text style={styles.seeAll}>See All ›</Text>
//       </TouchableOpacity>
//         </View>



//       {loading ? (
//   <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
// ) : (
//   <FlatList
//     data={resources}
//     renderItem={renderResourceCard}
//     keyExtractor={(item) => item.id.toString()}
//     contentContainerStyle={{ paddingBottom: 20 }}
//   />
// )}
//         {/* Members Section */}
//         {/* <View style={styles.membersContainer}>
//           <Text style={styles.sectionTitle}>Members</Text>
//           <View style={styles.memberItem}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>VT</Text>
//             </View>
//             <View style={styles.memberInfo}>
//               <Text style={styles.memberName}>Vijay10 ten</Text>
//               <Text style={styles.memberEmail}>vijay10@yopmail.com</Text>
//             </View>
//           </View>
//         </View> */}
//          <OrganizationProfileModal
//         visible={showProfileModal}
//         onComplete={() => setShowProfileModal(false)}
//         onClose={() => setShowProfileModal(false)}
//       />
//     </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },


//  gridSection: {
//     marginBottom: 24,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   gridItem: {
//     width: (screenWidth - 48) / 3,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   iconContainer: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     backgroundColor: '#f0f5ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   gridItemText: {
//     fontSize: 11,
//     fontWeight: '500',
//     color: '#0E3386',
//     textAlign: 'center',
//     marginTop: 4,
//   },


//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     // padding: 20,
//     paddingHorizontal:15,
//     paddingVertical:20,
//     backgroundColor: '#0E3386',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',

//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffff',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   upgradeButton: {
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   upgradeText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   topMetrics: {
//     padding: 20,
//   },
//   metricsRow: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   metricCard: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderRadius: 12,
//     marginRight: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   metricHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   icon: {
//     fontSize: 20,
//   },
//   metricTitle: {
//     fontSize: 12,
//     color: '#6B7280',
//     flex: 1,
//   },
//   metricValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   changeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   changeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginRight: 4,
//   },
//   changeLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   statusCardsContainer: {
//     flexDirection: 'column',
//     paddingHorizontal: 10,
//     marginBottom: 16,
//   },
//   statusCard: {
//     paddingHorizontal: 20,

//     flex: 1,
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderRadius: 12,
//     marginRight: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   statusHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   statusTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//     flex: 1,
//   },
//   changeIndicator: {
//     alignItems: 'flex-end',
//   },
//   changeValue: {
//     fontSize: 12,
//     color: '#10B981',
//     fontWeight: '600',
//   },
//   statusSections: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statusSection: {
//     alignItems: 'center',
//   },
//   sectionValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   sectionLabel: {
//     fontSize: 10,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   chartContainer: {
//     backgroundColor: '#ffffff',
//     margin: 10,
//     padding: 10,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   chartHeader: {
//     marginBottom: 16,
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   totalAmount: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   changePercent: {
//     fontSize: 14,
//     color: '#10B981',
//     marginTop: 4,
//   },
//   chartLegend: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//     marginBottom: 8,
//   },
//   legendDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   mapContainer: {
//     backgroundColor: '#ffffff',
//     margin: 20,
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   mapHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   dateFilter: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   mapPlaceholder: {
//     height: 200,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   mapPlaceholderText: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   mapSubtext: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   membersContainer: {
//     backgroundColor: '#ffffff',
//     margin: 20,
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#3B82F6',
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   memberInfo: {
//     flex: 1,
//   },
//   memberName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   memberEmail: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   menuButton: {
//     padding: 5,
//   },

//   profileButton: {
//     padding: 5,
//   },




//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   // sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
//   seeAll: { color: "#2563eb", fontWeight: "600" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     flex: 1,
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },

//   headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//   headerInfo: { marginLeft: 10, flex: 1 },
//   name: { fontSize: 16, fontWeight: "bold", color: "#111827" },
//   jobTitle: { fontSize: 14, color: "#6b7280" },
//   email: { fontSize: 12, color: "#9ca3af" },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 4,
//   },
//   label: { fontSize: 13, fontWeight: "600", color: "#374151" },
//   value: { fontSize: 13, color: "#111827" },
// });

// export default LawyerDashboard;


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
  RefreshControl,
  Alert,
  BackHandler,
  Linking,
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

  useEffect(() => {
    fetchTopResource();
    const loadDashboardData = async () => {
      try {
        // ---- Load First & Last Name ----
        const fName = await AsyncStorage.getItem('first_Name');
        const lName = await AsyncStorage.getItem('last_Name');

        if (fName) setFirstName(fName);
        if (lName) setLastName(lName);

        // ---- Load Premium Access ----
        const storedValue = await AsyncStorage.getItem('hasPremiumAccess');
        const premium = JSON.parse(storedValue || 'false');
        setHasPremiumAccess(premium);
      } catch (e) {
        console.log('Error fetching user data:', e);
      }
 const companyName = await AsyncStorage.getItem('company');

      // ---- Update Header ----
      navigation.setOptions({

        headerTitle: () => (
                          <View style={{ flexDirection: "column" }}>
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                             Lawyer Dashboard
                            </Text>
                
                            {companyName ? (
                              <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>
                                {companyName}
                              </Text>
                            ) : null}
                          </View>
                        ),
        headerRight: () => (
          <>
            {/* Notifications Icon */}
            <View>
              <Notifications />
            </View>

            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              {/* Premium Access / Upgrade Button */}
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
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginLeft: 5,
                    }}
                  >
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

              {/* My Profile Icon */}
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
          </>
        ),

        headerStyle: { backgroundColor: '#0E3386' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      });
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


  // useEffect(() => {
  //    fetchTopResource();
  //   const fetchUserData = async () => {
  //     try {
  //       const fName = await AsyncStorage.getItem('first_Name');
  //       const lName = await AsyncStorage.getItem('last_Name');
  //       console.log("fName", fName);
  //       console.log("lName", lName);

  //       if (fName) setFirstName(fName);
  //       if (lName) setLastName(lName);
  //     } catch (e) {
  //       console.log('Error fetching user data:', e);
  //     }
  //   };

  //   fetchUserData();
  //   // Initial fetch - will also be triggered by useFocusEffect
  //   fetchFavoriteLawyers();

  //   navigation.setOptions({
  //     title: 'Lawyer ',
  //     headerRight: () => (
  //       <>
  //         <View> <Notifications /> </View>
  //         <View style={{ flexDirection: 'row', marginRight: 10 }}>

  //           <TouchableOpacity
  //             onPress={() => navigation.navigate('SubscriptionScreen')}
  //             style={{
  //               marginRight: 12,
  //               backgroundColor: '#fbbf24',
  //               paddingHorizontal: 10,
  //               paddingVertical: 6,
  //               borderRadius: 6,
  //             }}
  //           >
  //             <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>Upgrade Plan</Text>
  //           </TouchableOpacity>

  //           <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
  //             {userData?.profile_pic ? (
  //               <Image
  //                 source={{
  //                   uri: `${userData.profile_pic}?timestamp=${new Date().getTime()}`,
  //                 }}
  //                 style={{
  //                   width: 30,
  //                   height: 30,
  //                   borderRadius: 15, // make it circular
  //                   borderWidth: 1,
  //                   borderColor: '#fff',
  //                 }}
  //                 onError={(e) => console.log('Profile pic error:', e.nativeEvent.error)}
  //               />
  //             ) : (
  //               <Icon name="account-circle" size={28} color="#fff" />
  //             )}
  //           </TouchableOpacity>
  //         </View>
  //       </>
  //     ),
  //     headerStyle: {
  //       backgroundColor: '#0E3386',
  //     },
  //     headerTintColor: '#fff',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   });
  // }, [navigation, hasPremiumAccess]);




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

  // useEffect(() => {
  //   fetchTopResource();
  //   fetchUserData();

  //   const checkProfileStatus = async () => {
  //     const isActive = await AsyncStorage.getItem('isActive');
  //     if (isActive !== 'true') {
  //       setShowProfileModal(true);
  //     }
  //   };
  //   checkProfileStatus();
  // }, []);

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
    { id: 1, icon: 'file-document-outline', label: 'AI-RES Full Review', screen: 'AIResFullReview', premium: true },
    { id: 2, icon: 'chip', label: 'AI-Review', screen: 'AIReview', premium: true },
    { id: 10, icon: 'chip', label: 'AI-Draft', screen: 'AIDraft', premium: true },
    // { id: 5, icon: 'scale-balance', label: 'Lawyers', screen: 'LawyerNetwork', premium: false },
    // { id: 8, icon: 'gavel', label: 'Invite Lawyer', screen: 'InviteLawyer', premium: false },
    { id: 5, icon: 'account-tie', label: 'Suppliers/Agencies', screen: 'SupplierAgency', premium: true },
    { id: 8, icon: 'briefcase-plus', label: 'Invite Agency', screen: 'InviteAgency', premium: false },
    { id: 3, icon: 'account-tie', label: 'Organization Profile', screen: 'LawyerOrgProfile', premium: true },
    { id: 6, icon: 'briefcase-plus', label: 'Invite Organization', screen: 'InviteOrganization', premium: false },
    { id: 7, icon: 'account-group', label: 'Invite Individual Buyer', screen: 'InviteResource', premium: false },
    { id: 4, icon: 'cog-outline', label: 'Settings', screen: 'Settings', premium: false },
    { id: 11, icon: 'pencil-outline', label: 'ESignature', screen: 'ESignature', premium: false },
    { id: 9, icon: 'help-circle-outline', label: 'Help', screen: 'HelpScreen', premium: false },
  ];

  const gridItems = allItems;

  return (
    <>
      <SafeAreaView style={styles.container}>
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

          {/* Contract Review Card */}
          {/* <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.contractTitle}>Contract Review</Text>
              <Text style={styles.contractSubtitle}>REQUEST A CONTRACT REVIEW</Text>
              <Text style={styles.contractDesc}>
                Protect your legal rights with a contract review with Automated AI Platform.
                Buying or selling a property can be daunting...
              </Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleNavigation('LawyerNetwork')}
              >
                <Text style={styles.buttonText}>View conveyancers</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require('../assets/images/glob.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View> */}

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

          {/* Favorites Section */}
          {/* <View style={styles.favoritesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favorites</Text>
              {favoriteLawyers.length > 0 && (
                <TouchableOpacity onPress={() => handleNavigation('LawyerNetwork')}>
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
                {favoriteLawyers.map(renderLawyerCard)}
              </ScrollView>
            ) : (
              <View style={styles.emptyFavorites}>
                <Icon name="heart-outline" size={48} color="#ccc" />
                <Text style={styles.emptyFavoritesText}>No favorite lawyers yet</Text>
                <TouchableOpacity
                  style={styles.browseLawyersButton}
                  onPress={() => handleNavigation('LawyerNetwork')}
                >
                  <Text style={styles.browseLawyersText}>Browse Lawyers</Text>
                </TouchableOpacity>
              </View>
            )}
          </View> */}

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
      </SafeAreaView>
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