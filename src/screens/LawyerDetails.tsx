import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const BASE_URL = "https://api.agreementpaper.com";

export default function LawyerDetails() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/lawyer-network/lawyers/${id}/`
      );
      setLawyer(res.data?.data || res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (!lawyer) return <Text>No data</Text>;

  const user = lawyer.user_detail || {};

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri:
            user.profile_pic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {user.first_name} {user.last_name}
      </Text>

      <Text style={styles.company}>{lawyer.company_name}</Text>

      <Text>Email: {user.email}</Text>
      <Text>Phone: {user.contact_number}</Text>
      <Text>Country: {lawyer.country_name}</Text>
      <Text>State: {lawyer.state_name}</Text>

      <Text style={styles.section}>About Company</Text>
      <Text>{lawyer.about_company || "—"}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  company: { textAlign: "center", color: "#555", marginBottom: 16 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 20 },
});
