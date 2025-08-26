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
  Modal
} from 'react-native';
import Services from '../../Services/services';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MasterAgreement = () => {
    const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState(1);
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState('2025-05-31');
const [refreshing, setRefreshing] = useState(false);
  const [msaData, setMsaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [modalVisible, setModalVisible] = useState(false);

  const tabs = [{label:"Contractor MSA" , value:1}, {label:"Service MSA" , value:2},{label:'Approved' , value:3}, {label:'Pending' , value:4}, {label:'Rejected' , value:5}];
console.log("msaData",msaData);


const fetchMSAData = async (tab:any) => {
  try {
    setLoading(true);
    setError(null);

    let response;

    // Common pagination object
    const params = { limit: 20, offset: 0 };

    if (tab === 1) {
      // Contractor MSA
      response = await Services.getMSAContractorList(params);
    } else if (tab === 2) {
      // Service MSA
      response = await Services.getMSAServiceList(params);
    } else if (tab === 3) {
      // Approved
      response = await Services.getMSAStatusList({
        ...params,
        status: "approved",
      });
    } else if (tab === 4) {
      // Pending
      response = await Services.getMSAStatusList({
        ...params,
        status: "pending_approval",
      });
    } else if (tab === 5) {
      // Rejected
      response = await Services.getMSAStatusList({
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
      const res = await Services.getMSADetail(item);

      if (res.success) {
        console.log("MSA Detail Data", res.data);
        navigation.navigate("MSADetailScreen", { data: res.data });
      } else {
        console.log("Error", res.error);
      }
    } catch (error) {
      console.log("Unexpected Error", error);
    } finally {
      setLoading(false); // Stop loading
    }
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
        <Text style={styles.msaNo}>{item.msa_number}</Text>
        {renderStatusBadge(item.status)}
      </View>
      
      <Text style={styles.msaTitle}>{item.name}</Text>
      <Text style={styles.msaType}>
  {item.msa_flow === 1 ? 'Contractor' : item.msa_flow === 2 ? 'Service' : ''}
</Text>

      
      <View style={styles.divider} />
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Resource</Text>
     <Text style={styles.detailValue}>
  {item.resource_datail?.user_detail?.first_name + ' ' + item.resource_datail?.user_detail?.last_name}
</Text>

        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
<Text style={styles.detailValue}>
  {new Date(item.start_date).toDateString()}
</Text>

        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>SOWs</Text>
        <Text style={styles.detailValue}>
  {item.sow_data && item.sow_data.length > 0 ? item.sow_data.length : 0}
</Text>

        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Budget</Text>
          <Text style={styles.detailValue}>{item.budget}</Text>
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
      {/* <TouchableOpacity 
  style={styles.viewButton}
  onPress={async () => {
    const res = await Services.getMSADetail({
      slug: item.slug,  
    });

    if (res.success) {
      console.log("MSA Detail Data", res.data);
navigation.navigate("MSADetailScreen", { data: res.data });

    } else {
      console.log("Error", res.error);
    }
  }}
>
  <Text style={styles.viewButtonText}>View Details</Text>
</TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Master Service Agreements</Text>
       <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
  <Text style={styles.addButtonText}>+ Add MSA</Text>
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
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>From</Text>
            <TextInput
              style={styles.dateInput}
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>To</Text>
            <TextInput
              style={styles.dateInput}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
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
        <Text style={styles.resultsText}>{msaData.length} MSAs found</Text>
      </View>

      {/* MSA List */}
    {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={msaData}
          renderItem={renderItem}
          keyExtractor={(item:any) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
            refreshing={refreshing}
  onRefresh={onRefresh}
        />
      )}

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
        <Text style={styles.optionTitle}>Master Service Agreement for Contractors</Text>
        <Text style={styles.optionDesc}>
          Use this option if you are creating MSA for Services by Contractors through Agencies or Supplier
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate("CreateMSA", { type: "contractor" });
          }}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Option 2 - Service MSA */}
      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Master Service Agreement</Text>
        <Text style={styles.optionDesc}>
          Use this option if you are creating MSA for Service Procurement
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate("CreateMSA", { type: "service" });
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




    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
//   backgroundColor: 'white',
//   paddingVertical: 18,       
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
},
optionTitle: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 8,
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

});

export default MasterAgreement;