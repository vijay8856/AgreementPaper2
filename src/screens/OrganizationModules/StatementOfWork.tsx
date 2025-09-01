import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  RefreshControl
} from 'react-native';
import Services from '../../Services/services';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
const { width } = Dimensions.get('window');

const StatementOfWork = () => {
    const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState(1);
 
const [refreshing, setRefreshing] = useState(false);
  const [msaData, setMsaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const tabs = [{label:"Contractor SOW" , value:1}, {label:"Service SOW" , value:2},{label:'Approved' , value:3}, {label:'Pending' , value:4}, {label:'Rejected' , value:5}];
console.log("sowData",msaData);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;  // <-- API needs this format
};
const fetchMSAData = async (tab:any) => {
  try {
    setLoading(true);
    setError(null);

    let response;

    // Common pagination object
    const params = { limit: 6, offset: 0 ,sow:"contractor"};
if (startDate) params.date_from = formatDate(startDate);
      if (endDate) params.date_to = formatDate(endDate);
    if (tab === 1) {
      // Contractor MSA
      response = await Services.getSowContractorList(params);
    } else if (tab === 2) {
      // Service MSA
      response = await Services.getSOWServiceList(params);
    } else if (tab === 3) {
      // Approved
      response = await Services.getSOWStatusList({
        ...params,
        status: "approved",
      });
    } else if (tab === 4) {
      // Pending
      response = await Services.getSOWStatusList({
        ...params,
        status: "pending_approval",
      });
    } else if (tab === 5) {
      // Rejected
      response = await Services.getSOWStatusList({
        ...params,
        status: "rejected",
      });
    }

    if (response?.success) {
      // assuming API returns `data.results` as list
      setMsaData(response.data?.results || []);
    } else {
      setError(response?.error || "Failed to load data");
    }
  } catch (err) {
    console.log("fetchMSAData error:", err);
    // setError("Failed to load data");
  } finally {
    setLoading(false);
  }
};


const onRefresh = async () => {
  try {
    setRefreshing(true);
    await fetchMSAData(activeTab);
  } catch (err) {
    console.log("Refresh error:", err);
  } finally {
    setRefreshing(false);
  }
};


  // 👇 call API whenever activeTab changes
  useEffect(() => {
    fetchMSAData(activeTab);
  }, [activeTab, startDate, endDate]);


const handleViewDetails = async (item:any) => {
    console.log("itemmm",item);
    
    setLoading(true); 
    try {
      const res = await Services.getSOWDetail(item);

      if (res.success) {
        console.log("SOW Detail Data", res.data);
        // navigation.navigate("MSADetailScreen", { data: res.data });
        navigation.navigate("SOWDetailScreen", { data: res.data as MSAData });

      } else {
        console.log("Error", res.error);
      }
    } catch (error) {
      console.log("Unexpected Error", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
const getName = (item: any) => {
  if (item.masterdata_detail.name) {
    return `${item.masterdata_detail.name} `;
    // ${item.masterdata_detail.email}
  } else if (item.resource_detail?.user_detail) {
    return `${item.resource_detail.user_detail.first_name} ${item.resource_detail.user_detail.last_name}`;
  } else if (item.account_detail?.user_detail) {
    return `${item.account_detail.user_detail.first_name} ${item.account_detail.user_detail.last_name}`;
  }
  return "";
};

const renderStatusBadge = (status: string) => {
  let backgroundColor, textColor, label;

  switch (status) {
    case 'approved':
    case 'Approved':
      backgroundColor = '#E8F5E9';
      textColor = '#2E7D32';
      label = 'Approved';
      break;

    case 'pending_approval':
    case 'Pending':
      backgroundColor = '#FFF8E1';
      textColor = '#F57C00';
      label = 'Pending';
      break;

    case 'rejected':
    case 'Rejected':
      backgroundColor = '#FFEBEE';
      textColor = '#D32F2F';
      label = 'Rejected';
      break;

    default:
      backgroundColor = '#F5F5F5';
      textColor = '#616161';
      label = status; // fallback: show the raw status
  }
    
 return (
    <View
      style={{
        backgroundColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: textColor, fontWeight: '600' }}>{label}</Text>
    </View>
  );
  };

  const renderItem = ({ item}:any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.msaNo}>{item.sow_number}</Text>
        {renderStatusBadge(item.status)}
      </View>
      
      <Text style={styles.msaTitle}>{item.title}</Text>
      <Text style={styles.msaType}>
  {item.sow_flow === 1 ? 'Contractor' : item.sow_flow === 2 ? 'Service' : ''}
</Text>

      
      <View style={styles.divider} />
      
      <View style={styles.detailsRow}>
    <View style={styles.detailItem}>
  <Text style={styles.detailLabel}>Resource</Text>
  <Text style={styles.detailValue}>{getName(item)}</Text>
</View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
<Text style={styles.detailValue}>
  {new Date(item.start_date).toDateString()}
</Text>

        </View>
      </View>
      
      <View style={styles.detailsRow}>
        {/* <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>SOWs</Text>
        <Text style={styles.detailValue}>
  {item.sow_data && item.sow_data.length > 0 ? item.sow_data.length : 0}
</Text>

        </View> */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Budget</Text>
          <Text style={styles.detailValue}>{item.grand_total}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
         <TouchableOpacity
      style={styles.viewButton}
     onPress={() => handleViewDetails(item.slug)}

      disabled={loading} // Disable button while loading
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.viewButtonText}>View Details</Text>
      )}
    </TouchableOpacity>
  
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={['#007BFF']}
        tintColor={'#007BFF'}
      />
    }>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statement Of Work </Text>
       <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
  <Text style={styles.addButtonText}>+ Add SOW</Text>
</TouchableOpacity>

      </View>

      {/* Tabs */}
   <ScrollView 
  horizontal
  style={styles.tabsContainer}
>
  {tabs.map((tab) => (
    <TouchableOpacity
      key={tab.value}
      style={[
        styles.tab,
        activeTab === tab.value && styles.activeTab
      ]}
      onPress={() => setActiveTab(tab.value)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === tab.value && styles.activeTabText
        ]}
      
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
  <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Date Range</Text>
      <View style={styles.dateInputs}>
        {/* From Date */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate ? formatDate(startDate) : "From"}</Text>
        </TouchableOpacity>

        {/* Show Start Date Picker */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {/* To Date */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endDate ? formatDate(endDate) : "To"}</Text>
        </TouchableOpacity>

        {/* Show End Date Picker */}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}

        {/* Apply Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchMSAData(activeTab)}
        >
          <Text style={styles.searchButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{msaData.length} SOWs found</Text>
      </View>

      {/* MSA List */}
     {/* <View style={styles.listWrapper}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={msaData}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={true}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
        </View> */}


<View style={styles.listWrapper}>
  <ScrollView 
 
  >
    {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
        </View>
    ) : error ? (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
    ) : (
        <View style={styles.listContainer}>
            {/* {msaData.map((item) => renderItem({ item }))}
             */}
             {msaData.map((item) => renderItem({ item, key: item.id }))}

        </View>
    )}
  </ScrollView>
</View>
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Select Type</Text>

      {/* Option 1 - Contractor MSA */}
      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Statement Of Work for Contractors</Text>
        <Text style={styles.optionDesc}>
          Use this option if you are creating SOW for Services by Contractors through Agencies or Supplier
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate("CreateSOW", { type: "contractor" });
          }}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Option 2 - Service MSA */}
      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Statement Of Work
</Text>
        <Text style={styles.optionDesc}>
      Use this option if you are creating SOW for Service/Material Procurement
        </Text>
        <TouchableOpacity
          style={styles.createButton2}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate("CreateSOW", { type: "service" });
          }}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  marginBottom:10,
    
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#0E3386',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
tabsContainer: {
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
  minHeight: 20,     
},

tab: {
  paddingHorizontal: 10,
  paddingVertical: 10,   
  marginRight: 25,
  borderRadius: 20,
  backgroundColor: '#f0f0f0',
  justifyContent: "center",
  alignItems: "center",
  minHeight: 40,    
  marginBottom:10,
},

activeTab: {
  backgroundColor: '#0E3386',
},

tabText: {
  fontSize: 12,       
  color: '#333',
  fontWeight: '500',
},

activeTabText: {
  color: '#fff',
},

  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    minWidth:100
  },
  searchButton: {
    backgroundColor: '#0E3386',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  msaNo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  msaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  msaType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#3498db',
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},
modalContainer: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
  width: "90%",
  alignItems: "center",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
},
optionCard: {
  backgroundColor: "#F9F9F9",
  borderRadius: 10,
  padding: 15,
  marginVertical: 10,
  width: "100%",
  borderWidth:1,
  borderColor:"gray",
  minHeight:200
},
optionTitle: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 18,
},
optionDesc: {
  fontSize: 14,
  color: "#666",
  marginBottom: 12,
},
createButton: {
  backgroundColor: "#0033A0",
  paddingVertical: 8,
  borderRadius: 6,
  alignItems: "center",
},
createButton2: {
  backgroundColor: "#0033A0",
  paddingVertical: 8,
  borderRadius: 6,
  alignItems: "center",
  marginTop:"15%"
},
createButtonText: {
  color: "#fff",
  fontWeight: "600",
},
closeButton: {
  position: "absolute",
  top: 10,
  right: 10,
},
closeButtonText: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
},
    listWrapper: {
        flex: 1, 

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    
});

export default StatementOfWork;