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
} from "react-native";
import Services from "../../Services/services";
import { useFocusEffect } from "@react-navigation/native";

const ApprovalScreen = () => {
  const [msaData, setMsaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMSAList();
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
        Alert.alert("Success", `MSA ${status} successfully`);
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


  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.listContainer} >
        <FlatList
          data={msaData}
          keyExtractor={(item) => item.slug?.toString()}
          renderItem={renderItem}
          contentContainerStyle={msaData?.length === 0 && styles.center}
          ListEmptyComponent={
            <Text style={styles.noData}>No data found</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />

      </View>

    </>
  );
};

export default ApprovalScreen;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    backgroundColor: "#28a745",
  },
  reject: {
    backgroundColor: "#dc3545",
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
  listContainer: {
    textAlign: "center",
    justifyContent: "center",
    flex: 1,
    color: "gray",
    fontSize: 16,
    margin: 10
  }
});
