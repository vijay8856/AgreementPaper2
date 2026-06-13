import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Services from '../Services/services';


const OrganisationDetailScreen = ({ route, navigation }: any) => {
  const { slug } = route.params;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    fetchOrganisationDetails();
  }, []);

  const fetchOrganisationDetails = async () => {
    try {
      setLoading(true);
      const res = await Services.getTopOrganisationDetailsTalent(slug);

      console.log("📥 Organisation Details API:", res);

      if (res.success) {
        setDetails(res.data);
      }
    } catch (err) {
      console.log("❌ Error fetching organisation details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !details) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00007B" />
        <Text style={{ marginTop: 10 }}>Loading organisation...</Text>
      </View>
    );
  }

  const user = details.user_detail;

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.headerCard}>
        <Image
          source={{
            uri: details.logo
              ? details.logo
              : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.logoLarge}
        />

        <Text style={styles.companyName}>{details.company_name}</Text>

        <Text style={styles.location}>
          📍 {details.country_name}, {details.state_name}
        </Text>

        {details.company_website ? (
          <Text style={styles.website}>🌐 {details.company_website}</Text>
        ) : null}
      </View>

      {/* BASIC INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <Text style={styles.item}>📧 Email: {user?.email}</Text>
        <Text style={styles.item}>👤 Contact: {user?.contact_number}</Text>
        <Text style={styles.item}>🏙 District: {details.district}</Text>
        <Text style={styles.item}>📮 Pincode: {details.pin_code}</Text>
      </View>

      {/* ABOUT */}
      {details.about_company ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Company</Text>
          <Text style={styles.aboutText}>{details.about_company}</Text>
        </View>
      ) : null}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

export default OrganisationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    alignItems: "center",
    marginBottom: 20,
  },

  logoLarge: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#ddd",
  },

  companyName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
    color: "#000078",
  },

  location: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  website: {
    fontSize: 14,
    marginTop: 6,
    color: "#0066FF",
    fontWeight: "600",
  },

  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  item: {
    fontSize: 15,
    marginVertical: 3,
    color: "#333",
  },

  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
});
