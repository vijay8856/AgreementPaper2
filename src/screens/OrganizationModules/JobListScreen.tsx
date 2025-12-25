import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const JobListScreen = ({ navigation }) => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Senior Next js developer",
      date: "Thu Oct 30 2025",
      company: "Eminence Infotech",
      location: "Indore",
      applications: 0,
      type: "Full time",
    },
    {
      id: 2,
      title: "Sr. Web developer",
      date: "Thu May 23 2024",
      company: "Geomotion (Australia) Pty Ltd",
      location: "Queensland",
      applications: 1,
      type: "Full time",
    },
    {
      id: 3,
      title: "Sr. Python developer",
      date: "Wed Sep 20 2023",
      company: "HCL Australia Services Pty Ltd",
      location: "Queensland",
      applications: 0,
      type: "Full time",
    },
  ]);

  const renderJobCard = ({ item }) => (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.cardHeader}>
        <View style={styles.serialCircle}>
          <Text style={styles.serialText}>{item.id}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      {/* Details Section */}
      <View style={styles.cardContent}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Posted On:</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Organisation / Agency:</Text>
          <View style={styles.orgContainer}>
            <View style={styles.orgAvatar}>
              <Text style={styles.orgAvatarText}>{item.company[0]}</Text>
            </View>
            <View>
              <Text style={styles.orgName}>{item.company}</Text>
              <Text style={styles.orgLocation}>{item.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Applications:</Text>
          <View style={styles.applicationBox}>
            <Text style={styles.applicationText}>{item.applications}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Job Type:</Text>
          <Text style={styles.value}>{item.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Action:</Text>
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.iconBtn}>
              <Icon name="pencil-outline" size={22} color="#1E40AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Icon name="delete-outline" size={22} color="#1E40AF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Tabs + Add Button */}
      <View style={styles.header}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Job Posting</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabInactive}>
            <Text style={styles.tabTextInactive}>Application</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn}
        onPress={() => navigation.navigate("PostNewJobScreen")}
        >
          <Icon name="plus" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add Job Post</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
        <TextInput style={styles.input} placeholder="Select skills" />
        <TextInput style={styles.input} placeholder="Search" />
      </View>

      {/* List */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 12 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tabs: { flexDirection: "row" },
  tabActive: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#1E40AF",
  },
  tabInactive: { paddingVertical: 6, paddingHorizontal: 15 },
  tabTextActive: { color: "#1E40AF", fontWeight: "600" },
  tabTextInactive: { color: "#6B7280" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: { color: "white", marginLeft: 5, fontWeight: "600" },

  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    height: 40,
  },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serialCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  serialText: { color: "#111827", fontWeight: "600" },
  cardTitle: { color: "#2563EB", fontWeight: "600", fontSize: 16 },

  cardContent: { marginLeft: 38 },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  label: {
    width: 140,
    fontWeight: "500",
    color: "#374151",
  },
  value: {
    flex: 1,
    color: "#111827",
  },

  orgContainer: { flexDirection: "row", alignItems: "center" },
  orgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  orgAvatarText: { color: "#374151", fontWeight: "bold" },
  orgName: { color: "#111827", fontWeight: "500" },
  orgLocation: { color: "#6B7280", fontSize: 12 },

  applicationBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#A5B4FC",
    justifyContent: "center",
    alignItems: "center",
  },
  applicationText: { color: "white", fontWeight: "bold" },

  actionBtns: { flexDirection: "row" },
  iconBtn: { marginRight: 8 },
});

export default JobListScreen;
