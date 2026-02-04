import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import Services from "../../Services/services";
import { useFocusEffect } from "@react-navigation/native";

const ApprovalScreen = () => {
  const [msaData, setMsaData] = useState<any[]>([]);
  const [sowData, setSOWData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
   const [activeTab, setActiveTab] = useState<"msa" | "sow">("msa");
  // Mock fetch data (replace with your getMSAList API)
  const fetchMSAList = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await Services.getMSAApprovalList();
      if (res.success) {
        setMsaData(res.data || []);
      } else {
        Alert.alert("Error", "Failed to load MSA data");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMSAList();
    fetchSOWList();
  }, []);



    const fetchSOWList = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await Services.getSOWApprovalList();
      if (res.success) {
        setSOWData(res.data || []);
      } else {
        Alert.alert("Error", "Failed to load MSA data");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };



  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMSAList();
          fetchSOWList();
    }, [])
  );

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchMSAList();
  };

  const handleAction = async (slug: string, status: string) => {
    try {
      setLoading(true);
      const payload = { status }; // status: "approved" or "rejected"
      const res = await Services.updateMSAStatus(slug, payload);

      if (res.success) {
        Alert.alert("Success", `Master Service Agreement  ${status} successfully`);
        fetchMSAList(); // refresh list
      } else {
        Alert.alert("Error", res.error || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleSOWAction = async (slug: string, status: string) => {
    try {
      setLoading(true);
      const payload = { status };
      const res = await Services.updateSOWStatus(slug, payload);

      if (res.success) {
        Alert.alert("Success", `SOW ${status} successfully`);
        fetchSOWList();
      } else {
        Alert.alert("Error", res.error || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }: any) => (
    <>

      <View style={styles.card}>
        {/* Row: MSA Number & Title */}
        <View style={styles.row1}>
          <Text style={styles.msaNo}>{item.msa_number}</Text>
          <Text style={styles.msaTitle}>{item.name}</Text>
        </View>

        {/* Row: Agency / Resource */}
        <View style={styles.row}>
          <Text style={styles.label}>Agency/Resource: </Text>
          <Text style={styles.value}>
            {item.agency_datail?.company_name ||
              `${item.resource_datail?.user_detail?.first_name} ${item.resource_datail?.user_detail?.last_name}`}
          </Text>
        </View>

        {/* Row: Date */}
        <View style={styles.row}>
          <Text style={styles.label}>Date: </Text>
          <Text style={styles.value}>
            {new Date(item.start_date).toDateString()}
          </Text>
        </View>

        {/* Row: SOWs & Budget */}
        <View style={styles.row}>
          <Text style={styles.label}>SOWs: </Text>
          <Text style={styles.value}>{item.sow_data?.length || 0}</Text>
          <Text style={styles.label}> | Budget: </Text>
          <Text style={styles.value}>INR {item.budget}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.approve]}
            onPress={() => handleAction(item.slug, "approved")}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.reject]}
            onPress={() => handleAction(item.slug, "rejected")}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>


      </View>
    </>
  );
const renderSowItem = ({ item }: any) => (
    <>

      <View style={styles.card}>
        {/* Row: MSA Number & Title */}
        <View style={styles.row1}>
          <Text style={styles.msaNo}>{item.sow_number}</Text>
          <Text style={styles.msaTitle}>{item.title}</Text>
        </View>

        {/* Row: Agency / Resource */}
        <View style={styles.row}>
          <Text style={styles.label}>Agency/Resource: </Text>
          <Text style={styles.value}>
            {item.masterdata_detail?.company_name ||
              `${item.resource_detail?.user_detail?.first_name} ${item.resource_detail?.user_detail?.last_name}`}
          </Text>
        </View>

        {/* Row: Date */}
        <View style={styles.row}>
          <Text style={styles.label}>Date: </Text>
          <Text style={styles.value}>
            {new Date(item.start_date).toDateString()}
          </Text>
        </View>

       

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.approve]}
            onPress={() => handleSOWAction(item.slug, "approved")}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.reject]}
            onPress={() => handleSOWAction(item.slug, "rejected")}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>


      </View>
    </>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <>
     
         <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'msa' && styles.activeTab]}
          onPress={() => setActiveTab('msa')}
        >
          <Text style={[styles.tabText, activeTab === 'msa' && styles.activeTabText]}>
            MSA Approvals {msaData.length > 0 && `(${msaData.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'sow' && styles.activeTab]}
          onPress={() => setActiveTab('sow')}
        >
          <Text style={[styles.tabText, activeTab === 'sow' && styles.activeTabText]}>
            SOW Approvals {sowData.length > 0 && `(${sowData.length})`}
          </Text>
        </TouchableOpacity>
      </View>
     <View style={styles.container}>
      {/* Tab Navigation */}
 

      {/* Content based on active tab */}
      {activeTab === 'msa' ? (
        <FlatList
          data={msaData}
          keyExtractor={(item) => item.slug?.toString()}
          renderItem={renderItem}
          contentContainerStyle={msaData?.length === 0 && styles.center}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No MSA approvals pending</Text>
              <Text style={styles.emptyStateSubText}>All MSA documents are approved</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <FlatList
          data={sowData}
          keyExtractor={(item) => item.slug?.toString()}
          renderItem={renderSowItem}
          contentContainerStyle={sowData?.length === 0 && styles.center}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No SOW approvals pending</Text>
              <Text style={styles.emptyStateSubText}>All SOW documents are approved</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
    </>
  );
};

export default ApprovalScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:10
  },
  section: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
card: {

  marginTop:10,
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 26,
    marginBottom: 10,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.40,
    shadowRadius: 8,

    // Android shadow
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  row1: {
    flexDirection: "column-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15
  },
  msaNo: {
    fontWeight: "500",
    color: "#333",
    marginRight: 8,
  },
  msaTitle: {
    fontWeight: '600'
  },
  label: {
    fontWeight: "600",
    color: "#444",
  },
  value: {
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  approve: {
    backgroundColor: "#0E3386",
  },
  reject: {
    backgroundColor: "#0E3386",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noData: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
  listContainer1: {
    textAlign: "center",
    justifyContent: "center",
    flex: 1,
    color: "gray",
    fontSize: 16,
    maxHeight:300


  },
    listContainer: {
    textAlign: "center",
    justifyContent: "center",
    flex: 1,
    color: "gray",
    fontSize: 16,
    maxHeight:300

  },
 

  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2E6EEE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2E6EEE',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  docNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: "500",
    color: "#4B5563",
    marginRight: 6,
    fontSize: 14,
  },
  detailValue: {
    color: "#111827",
    fontSize: 14,
    flex: 1,
  },

  approveButton: {
    backgroundColor: "#10B981",
  },
  rejectButton: {
    backgroundColor: "#EF4444",
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
