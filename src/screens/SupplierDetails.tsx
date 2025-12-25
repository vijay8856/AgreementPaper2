import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const BASE_URL = "https://api.agreementpaper.com";

export default function SupplierDetails() {
  const route = useRoute<any>();
  const { slug } = route.params;

  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/agency/agency-profile/${slug}/`
      );
      setSupplier(res.data?.data || res.data);
    } catch (e) {
      console.log("Supplier detail error", e);
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (!supplier) return <Text>No supplier found</Text>;

  const owner = supplier.user_detail || {};
  const privacy = supplier.privacy_settings || {};

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri:
            supplier.logo ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.name}>{supplier.company_name}</Text>
      <Text style={styles.owner}>
        {owner.first_name} {owner.last_name}
      </Text>

      <View style={styles.section}>
        {privacy.show_email && <Text>Email: {owner.email}</Text>}
        {privacy.show_contact_number && (
          <Text>Phone: {owner.contact_number}</Text>
        )}
        <Text>Country: {supplier.country_name}</Text>
        <Text>State: {supplier.state_name}</Text>
      </View>

      <Text style={styles.sectionTitle}>About Company</Text>
      <Text style={styles.about}>
        {supplier.about_company || "No company details available."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  owner: { textAlign: "center", color: "#666", marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  about: { fontSize: 15, lineHeight: 22 },
});
