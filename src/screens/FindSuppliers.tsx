import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "https://api.agreementpaper.com";
const LIMIT = 200;
const OFFSET = 0;

export default function FindSuppliers() {
  const navigation = useNavigation<any>();

  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  /* Load countries */
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/accounts/v2/countries/`);
      const list = res.data?.data || [];
      setCountries(list);
      setFilteredCountries(list.slice(0, 30));
    } catch (e) {
      console.log("Country load error", e);
    }
  };

  /* Handle search */
  const onChangeText = (text: string) => {
    setQuery(text);
    setSelectedCountry("");
    setShowDropdown(true);

    if (!text.trim()) {
      setFilteredCountries(countries.slice(0, 30));
      return;
    }

    const filtered = countries.filter(
      (c) =>
        c.name?.toLowerCase().includes(text.toLowerCase()) ||
        c.code?.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredCountries(filtered);
  };

  /* Select country */
  const selectCountry = (country: any) => {
    setQuery(country.name);
    setSelectedCountry(country.code);
    setShowDropdown(false);
  };

  /* Fetch suppliers */
  const fetchSuppliers = async () => {
    if (!selectedCountry) {
      alert("Please select a country from the list");
      return;
    }

    setLoading(true);
    setSuppliers([]);

    try {
      const res = await axios.get(
        `${BASE_URL}/agency/agency-profile/?limit=${LIMIT}&offset=${OFFSET}&country=${selectedCountry}`
      );
      setSuppliers(res.data?.results || []);
    } catch (e) {
      console.log("Supplier fetch error", e);
    }

    setLoading(false);
  };

  const renderCountry = ({ item }: any) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectCountry(item)}
    >
      <Text>{item.name} ({item.code})</Text>
    </TouchableOpacity>
  );

  const renderSupplier = ({ item }: any) => {
    const owner = item.user_detail || {};
    const privacy = item.privacy_settings || {};

    const initials = `${owner.first_name?.[0] || ""}${owner.last_name?.[0] || ""}`.toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.company_name}</Text>
            <Text style={styles.detail}>
              Owner: {owner.first_name} {owner.last_name}
            </Text>

            {privacy.show_email && (
              <Text style={styles.detail}>
                Email: {maskEmail(owner.email)}
              </Text>
            )}

            <Text style={styles.detail}>Country: {item.country_name}</Text>
            <Text style={styles.detail}>State: {item.state_name}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() =>
            navigation.navigate("SupplierDetails", { slug: item.slug, item: item, id:item.user })
          }
        >
          <Text style={styles.detailsText}>Details →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Trusted Suppliers / Agency</Text>

      <TextInput
        value={query}
        onChangeText={onChangeText}
        placeholder="Type or select a country"
        placeholderTextColor={'black'}

        style={styles.input}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCountry}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      <TouchableOpacity style={styles.searchBtn} onPress={fetchSuppliers}>
        <Text style={styles.searchText}>🔍 Find Suppliers / Agency</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" />}

      {!loading && suppliers.length > 0 && (
        <FlatList
          data={suppliers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSupplier}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {!loading && selectedCountry && suppliers.length === 0 && (
        <Text style={styles.noData}>No suppliers found.</Text>
      )}
    </View>
  );
}

/* Helpers */
const maskEmail = (email?: string) => {
  if (!email || !email.includes("@")) return "";
  return email.split("@")[0] + "@****";
};

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f9fc" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },

  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#535252ff",
  },

  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 260,
    elevation: 5,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  searchBtn: {
    backgroundColor: "#0E3386",
    padding: 14,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: "center",
  },

  searchText: { color: "white", fontWeight: "600" },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },

  left: { flexDirection: "row", gap: 12, flex: 1 },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0E3386",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: { color: "white", fontWeight: "bold", fontSize: 18 },

  name: { fontSize: 17, fontWeight: "700" },
  detail: { fontSize: 14, marginTop: 4, color: "#444" },

  detailsBtn: {
    backgroundColor: "#0E3386",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  detailsText: { color: "white", fontWeight: "600" },

  noData: { textAlign: "center", marginTop: 30, fontSize: 16 },
});
