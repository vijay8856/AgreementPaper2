import React, { useEffect, useRef, useState } from "react";
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
import { Modal } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";
import Services from '../Services/services';
const BASE_URL = "https://api.agreementpaper.com";
const LIMIT = 200;
const OFFSET = 0;

export default function FindLawyers() {
  const navigation = useNavigation<any>();

  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
    const [selectedIndividual, setSelectedIndividual] = useState(null);
    console.log("selectedIndividual",selectedIndividual);
    
    const [message, setMessage] = useState('');
  /* Fetch countries */
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/accounts/v2/countries/`);
      const data = res.data?.data || [];
      setCountries(data);
      setFilteredCountries(data.slice(0, 30));
    } catch (err) {
      console.log("Country fetch error", err);
    }
  };

  /* Handle typing */
  const onChangeText = (text: string) => {
    setQuery(text);
    setSelectedCountry("");
    setShowDropdown(true);

    if (!text.trim()) {
      setFilteredCountries(countries.slice(0, 30));
      return;
    }

    const filtered = countries.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  /* Select country */
  const onSelectCountry = (country: any) => {
    setQuery(country.name);
    setSelectedCountry(country.code);
    setShowDropdown(false);
  };

  /* Fetch lawyers */
  const fetchLawyers = async () => {
    if (!selectedCountry) {
      alert("Please select a country from the list");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/lawyer-network/lawyers/?limit=${LIMIT}&offset=${OFFSET}&country=${selectedCountry}`
      );
console.log("lawyer res",res);

      const data =
        Array.isArray(res.data?.results?.data)
          ? res.data.results.data
          : res.data?.results || [];

      setLawyers(data);
    } catch (err) {
      console.log("Lawyer fetch error", err);
      setLawyers([]);
    }

    setLoading(false);
  };
const maskEmail = (email?: string) => {
  if (!email) return "";

  const [name] = email.split("@");
  return `${name}@****`;
};

  /* Render country item */
  const renderCountry = ({ item }: any) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => onSelectCountry(item)}
    >
      <Text>{item.name} ({item.code})</Text>
    </TouchableOpacity>
  );
 const handleOpenConnect = (item: any) => {
        console.log("item", item);

        setSelectedIndividual(item);
        setConnectModalVisible(true);
    };

 const handleCloseConnectModal = () => {
    setConnectModalVisible(false);
    setSelectedIndividual(null);
    setMessage('');
  };

  const sendConnection = async () => {
    if (!selectedIndividual) return;

    setLoading(true);

    const payload = {
      to_user: selectedIndividual?.user_id,
      message: message?.trim() || '',
    };

    try {
      const response = await Services.sendConnectionSupplier(payload);

      if (response.success === true) {
        setConnectModalVisible(false);
        setMessage('');
        Toast.show({
          type: 'success',
          text1: 'Connection sent successfully',
          position: 'top',
        });
      } else if (
        response.status === 400 &&
        response.error?.message === 'Connection request pending'
      ) {
        setConnectModalVisible(false);
        Toast.show({
          type: 'info',
          text1: 'Connection Already Pending',
          text2: 'You have already sent a connection request.',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send connection',
          text2: response.error?.message || 'Something went wrong',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Unexpected error',
        text2: 'Please try again later',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };




  /* Render lawyer card */
  const renderLawyer = ({ item }: any) => (
    <View style={styles.card}>
  {/* LEFT CONTENT */}
  <View style={styles.leftContent}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.company}>{item.company_name}</Text>
 <Text style={styles.detail}>
  Email: {maskEmail(item.email)}
</Text>

    <Text style={styles.detail}>Country: {item.country}</Text>
  </View>

  {/* RIGHT FIXED BUTTON */}
  <View style={styles.rightContent}>

    <TouchableOpacity
                            style={styles.detailsBtn}
                            onPress={() => handleOpenConnect(item)}
                        >
                            <Text style={styles.connectBtnText}>Connect</Text>
                        </TouchableOpacity>
    {/* <TouchableOpacity
      style={styles.detailsBtn}
      onPress={() =>
        navigation.navigate("LawyerDetails", { id: item.id })
      }
    >
      <Text style={styles.detailsText}>Details →</Text>
    </TouchableOpacity> */}
  </View>
</View>

  );

  return (
    <>
    
    
    <View style={styles.container}>
      <Text style={styles.title}>Find Trusted Lawyers</Text>

      {/* Search */}
      <TextInput
        value={query}
        onChangeText={onChangeText}
        placeholder="Select country (type to search)"
        placeholderTextColor={'black'}
        style={styles.input}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && (
        <View style={styles.dropdown}>
          {filteredCountries.length === 0 ? (
            <Text style={styles.empty}>No countries found</Text>
          ) : (
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCountry}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}

      <TouchableOpacity style={styles.searchBtn} onPress={fetchLawyers}>
        <Text style={{ color: "white", fontWeight: "600" }}>
          🔍 Find Lawyers
        </Text>
      </TouchableOpacity>

      {/* Results */}
      {loading && <ActivityIndicator size="large" />}

      {!loading && lawyers.length > 0 && (
        <FlatList
          data={lawyers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLawyer}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {!loading && selectedCountry && lawyers.length === 0 && (
        <Text style={styles.noData}>No lawyers found.</Text>
      )}





    </View>



  {/* Connect Modal */}
      <Modal
        visible={connectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseConnectModal}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseConnectModal}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>

            {selectedIndividual && (
              <>
                <Text style={styles.modalTitle}>
                  Connect with {selectedIndividual.name} 
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Message (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.messageInput]}
                    multiline
                    numberOfLines={4}
                    placeholder="Type your message here..."
                    placeholderTextColor="#999"
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.connectActionButton} 
                  onPress={sendConnection}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.connectActionButtonText}>
                      Send Connection Request
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactText}>
                    Or contact directly: {selectedIndividual.contact_number || selectedIndividual.email}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f9fc" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#525050ff",
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

  empty: { padding: 14, color: "#666" },

  searchBtn: {
    backgroundColor: "#0E3386",
    padding: 14,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: "center",
  },

 card: {
  backgroundColor: "white",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
  flexDirection: "row",
  alignItems: "center",   // 🔑 vertical alignment
  elevation: 3,
},

leftContent: {
    maxWidth:230,
  flex: 1,               // 🔑 takes remaining space
  paddingRight: 10,
},

rightContent: {
    maxWidth:100,

  justifyContent: "center",
  alignItems: "center",
},

detailsBtn: {
  backgroundColor: "#0E3386",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 20,
},

detailsText: {
  color: "white",
  fontWeight: "600",
},
detail:{
  color: "#555",
  fontWeight: "600",
},
  name: { fontSize: 18, fontWeight: "600" },
  company: { color: "#555", marginBottom: 4 },

  viewBtn: {
    backgroundColor: "#0E3386",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  noData: { textAlign: "center", marginTop: 30, fontSize: 16 },
  
    connectBtn: {
        flex: 1,
        backgroundColor: '#10B981',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },

    connectBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },
    closeButton: {
        padding: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    modalHeader: {
        backgroundColor: '#072188',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },

    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    connectActionButton: {
        backgroundColor: '#072188',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    connectActionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    contactInfo: {
        backgroundColor: '#F0F4FF',
        borderRadius: 8,
        padding: 12,
    },
    contactText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    modalText: {

    }
});
