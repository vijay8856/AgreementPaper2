// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
//   TextStyle,
//   ViewStyle
// } from 'react-native';
// import Services from '../../Services/services';

// // Define types
// type TimeSheetItem = {
//   id: string;
//   timesheetNumber: string;
//   sow: string;
//   resourceName: string;
//   sowNumber: string;
//   status: 'Pending' | 'Approved' | 'Rejected';
// };

// type TimeSheetResponse = {
//   success: boolean;
//   data: {
//     results: TimeSheetItem[];
//     count: number;
//   };
//   status: number;
// };

// type TabType = {
//   id: number;
//   title: string;
//   status: number | null;
// };

// const TimeSheetScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<number>(0); // 0: Approval Request, 1: Pending, 2: Approved, 3: Rejected
//   const [searchText, setSearchText] = useState<string>('');
//   const [timesheetData, setTimesheetData] = useState<TimeSheetItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   const tabs: TabType[] = [
//     { id: 0, title: 'Approval Request', status: null },
//     { id: 1, title: 'Pending', status: 1 },
//     { id: 2, title: 'Approved', status: 2 },
//     { id: 3, title: 'Rejected', status: 3 },
//   ];

//   const fetchTimeSheets = async (status: number | null = null, isRefreshing: boolean = false) => {
//     if (isRefreshing) {
//       setRefreshing(true);
//     } else {
//       setLoading(true);
//     }
    
//     try {
//       const params: {status?: number; search?: string} = {};
//       if (status !== null) {
//         params.status = status;
//       }
//       if (searchText) {
//         params.search = searchText;
//       }
      
//       const response = await Services.getTimeSheetList(params);
//       if (response.success) {
//         setTimesheetData(response.data.results || []);
//       } else {
//         console.error('Failed to fetch timesheets');
//         setTimesheetData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching timesheets:', error);
//       setTimesheetData([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     const status = tabs[activeTab].status;
//     fetchTimeSheets(status);
//   }, [activeTab]);

//   const handleSearch = () => {
//     const status = tabs[activeTab].status;
//     fetchTimeSheets(status);
//   };

//   const handleRefresh = () => {
//     const status = tabs[activeTab].status;
//     fetchTimeSheets(status, true);
//   };

//   const renderItem = ({ item }: { item: TimeSheetItem }) => (
//     <View style={styles.itemContainer}>
//              <View style={styles.itemRow}>
//                  <Text style={styles.label}>WEEK DAYS</Text>
//         <Text style={styles.value}>{item.timesheetNumber}</Text>

//              </View>
       

//       <View style={styles.itemRow}>
//         <Text style={styles.label}>TIMESHEET NUMBER</Text>
//         <Text style={styles.value}>{item.timesheetNumber}</Text>
//       </View>
//       <View style={styles.itemRow}>
//         <Text style={styles.label}>SOW</Text>
//         <Text style={styles.value}>{item.sow}</Text>
//       </View>
//       <View style={styles.itemRow}>
//         <Text style={styles.label}>RESOURCES NAME</Text>
//         <Text style={styles.value}>{item.resourceName}</Text>
//       </View>
//       <View style={styles.itemRow}>
//         <Text style={styles.label}>SOW NUMBER</Text>
//         <Text style={styles.value}>{item.sowNumber}</Text>
//       </View>
//       <View style={styles.itemRow}>
//         <Text style={styles.label}>STATUS</Text>
//         <Text style={[
//           styles.value, 
//           {color: item.status === 'Approved' ? 'green' : 
//                  item.status === 'Rejected' ? 'red' : 'orange'}]}
//         >
//           {item.status}
//         </Text>
//       </View>
//       <View style={styles.separator} />
//     </View>
//   );

//   const renderEmptyState = () => {
//     if (loading) {
//       return (
//         <View style={styles.centerContent}>
//           <ActivityIndicator size="large" color="#007AFF" />
//         </View>
//       );
//     }
    
//     return (
//       <View style={styles.centerContent}>
//         <Text style={styles.noDataText}>No data found!</Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>TimeSheet</Text>
//       </View>

//       {/* Tabs */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         style={styles.tabContainer}
//       >
//         {tabs.map((tab, index) => (
//           <TouchableOpacity
//             key={tab.id}
//             style={[styles.tab, activeTab === index && styles.activeTab]}
//             onPress={() => setActiveTab(index)}
//           >
//             <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
//               {tab.title}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           {/* <Icon name="search" size={20} color="#888" style={styles.searchIcon} /> */}
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search SOW"
//             value={searchText}
//             onChangeText={setSearchText}
//             onSubmitEditing={handleSearch}
//             returnKeyType="search"
//           />
//         </View>
//       </View>

//       {/* Table Header */}
//       <View style={styles.tableHeader}>
//       </View>

//       {/* Column Headers */}
//       <ScrollView
//       horizontal
//       >
//            <View style={styles.columnHeaders}>
//          <Text style={styles.columnHeaderText}>WEEK DAYS</Text>
//         <Text style={styles.columnHeaderText}>TIMESHEET NUMBER</Text>
//         <Text style={styles.columnHeaderText}>SOW</Text>
//         <Text style={styles.columnHeaderText}>RESOURCES NAME</Text>
//         <Text style={styles.columnHeaderText}>SOW NUMBER</Text>
//         <Text style={styles.columnHeaderText}>STATUS</Text>
//       </View>
//       </ScrollView>
   

//       {/* Timesheet List */}
//       <FlatList
//         data={timesheetData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListEmptyComponent={renderEmptyState}
//         refreshing={refreshing}
//         onRefresh={handleRefresh}
//         contentContainerStyle={timesheetData.length === 0 && styles.emptyList}
//       />
//     </View>
//   );
// };

// // Define styles with TypeScript
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   } as ViewStyle,
//   header: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   } as ViewStyle,
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   } as TextStyle,
//   tabContainer: {
//     flexGrow: 0,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   } as ViewStyle,
//   tab: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   } as ViewStyle,
//   activeTab: {
//     borderBottomColor: '#007AFF',
//   } as ViewStyle,
//   tabText: {
//     fontSize: 14,
//     color: '#666',
//   } as TextStyle,
//   activeTabText: {
//     color: '#007AFF',
//     fontWeight: 'bold',
//   } as TextStyle,
//   searchContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   } as ViewStyle,
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   } as ViewStyle,
//   searchIcon: {
//     marginRight: 8,
//   } as ViewStyle,
//   searchInput: {
//     flex: 1,
//     height: 40,
//   } as TextStyle,
//   tableHeader: {
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//   } as ViewStyle,
//   tableHeaderText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   } as TextStyle,
//   columnHeaders: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     // flexWrap: 'wrap',
//   } as ViewStyle,
//   columnHeaderText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     flex: 1,
//     minWidth: 120,
//   } as TextStyle,
//   itemContainer: {
//     padding: 16,
//   } as ViewStyle,
//   itemRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//     flexWrap: 'wrap',
//   } as ViewStyle,
//   label: {
//     fontSize: 12,
//     color: '#666',
//     width: 150,
//     fontWeight: 'bold',
//   } as TextStyle,
//   value: {
//     fontSize: 14,
//     flex: 1,
//     minWidth: 120,
//   } as TextStyle,
//   separator: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 12,
//   } as ViewStyle,
//   centerContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   } as ViewStyle,
//   noDataText: {
//     fontSize: 16,
//     color: '#888',
//   } as TextStyle,
//   emptyList: {
//     flexGrow: 1,
//   } as ViewStyle,
// });

// export default TimeSheetScreen;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  TextStyle,
  ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Services from '../../Services/services';

// Define types
type TimeSheetItem = {
  id: string;
  timesheetNumber: string;
  sow: string;
  resourceName: string;
  sowNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  weekDays?: string;
};

type TimeSheetResponse = {
  success: boolean;
  data: {
    results: TimeSheetItem[];
    count: number;
  };
  status: number;
};

type TabType = {
  id: number;
  title: string;
  status: number | null;
};


const TimeSheetScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [timesheetData, setTimesheetData] = useState<TimeSheetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const tabs: TabType[] = [
    { id: 0, title: 'Approval Request', status: null },
    { id: 1, title: 'Pending', status: 1 },
    { id: 2, title: 'Approved', status: 2 },
    { id: 3, title: 'Rejected', status: 3 },
  ];

  const fetchTimeSheets = async (status: number | null = null, isRefreshing: boolean = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const params: {status?: number; search?: string} = {};
      if (status !== null) {
        params.status = status;
      }
      if (searchText) {
        params.search = searchText;
      }
      
      const response = await Services.getTimeSheetList(params);
      if (response.success) {
        setTimesheetData(response.data.results || []);
      } else {
        console.error('Failed to fetch timesheets');
        setTimesheetData([]);
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setTimesheetData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const status = tabs[activeTab].status;
    fetchTimeSheets(status);
  }, [activeTab]);

  const handleSearch = () => {
    const status = tabs[activeTab].status;
    fetchTimeSheets(status);
  };

  const handleRefresh = () => {
    const status = tabs[activeTab].status;
    fetchTimeSheets(status, true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Rejected': return '#F44336';
      case 'Pending': return '#FF9800';
      default: return '#757575';
    }
  };

  const renderItem = ({ item }: { item: TimeSheetItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.timesheetNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Icon name="document-text-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.sow}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="person-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.resourceName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.weekDays}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="hash-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.sowNumber}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading timesheets...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.centerContent}>
        <Icon name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.noDataText}>No timesheets found</Text>
        <Text style={styles.noDataSubText}>
          {searchText ? 'Try a different search term' : 'There are no timesheets for this status'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TimeSheet</Text>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContentContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
              {tab.title}
            </Text>
            {/* <Text style={{marginBottom:2}}></Text> */}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search SOW"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Timesheet List */}
      <FlatList
        data={timesheetData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={timesheetData.length === 0 ? styles.emptyList : styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Define styles with TypeScript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  } as ViewStyle,
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  } as TextStyle,
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as ViewStyle,
  tabContentContainer: {
    paddingHorizontal: 8,
  } as ViewStyle,
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  activeTab: {
    backgroundColor: '#007AFF',
  } as ViewStyle,
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  } as TextStyle,
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  } as TextStyle,
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as ViewStyle,
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  } as ViewStyle,
  searchIcon: {
    marginRight: 8,
  } as ViewStyle,
  searchInput: {
    height: 40,
    fontSize: 14,
  } as TextStyle,
  listContent: {
    padding: 16,
    paddingBottom: 32,
  } as ViewStyle,
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  } as ViewStyle,
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  } as ViewStyle,
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  } as TextStyle,
  cardContent: {
    marginBottom: 16,
  } as ViewStyle,
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
    flex: 1,
  } as TextStyle,
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  } as ViewStyle,
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
  } as ViewStyle,
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  } as TextStyle,
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  } as ViewStyle,
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  } as TextStyle,
  noDataText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  } as TextStyle,
  noDataSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  } as TextStyle,
  emptyList: {
    flexGrow: 1,
  } as ViewStyle,
});

export default TimeSheetScreen;