// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Image, Alert, useColorScheme, Pressable, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Services from '../../../Services/services';
import axios from 'axios';
import { API_URL } from '../../../Axios/axiosData';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MasterDataIdViewModal from '../../../components/Modals/MasterDataIdViewModal';
import { SafeAreaView } from 'react-native';
import { COLORS } from '../../../constants/colors';

type Organization = {
  id: string;
  user: number,
  company_name: string;
  email: string;
  country_name: string;
  state_name: string;
  district: string;
  is_active: boolean;
  user_detail: {
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    experience: string;
    linkedin_url: string;
  };
  about_company: string;
  company_website: string;
  is_connection: boolean;
};
const AgencySupplierMasterdata = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address_1: '',
    address_2: '',
    city: '',
    country: 'India',
    state: '',
    zip_code: '',
    website: '',
    logo: null
  });
  console.log("form", formData);

  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Organization | null>(null);



  const isDark = useColorScheme() === 'dark';

  const [countryModal, setCountryModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [countrySearch, setCountrySearch] = useState('');
  const [loadingCountry, setLoadingCountry] = useState(false);



  const COLORS = {
    bg: isDark ? '#000000' : '#FFFFFF',
    card: isDark ? '#e4e6efff' : '#FFFFFF',
    border: isDark ? '#374151' : '#22252aff',
    text: isDark ? '#F9FAFB' : '#111827',
    placeholder: isDark ? '#9CA3AF' : '#000000ff',
    primary: '#0E3386',
  };
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    console.log("loadCountries");

    setLoadingCountry(true);
    const res = await Services.getCountryList();
    if (res.success) setCountries(res.data);
    console.log("countries", res);

    setLoadingCountry(false);
  };
  const openCountryModal = () => {
    setShowForm(false);

    setTimeout(() => {
      setCountryModal(true);
    }, 250);
  };

  const openStateModal = () => {
    setShowForm(false);

    setTimeout(() => {
      setStateModal(true);
    }, 250);
  };

  const handleCountrySearch = async (text: string) => {
    setCountrySearch(text);

    if (!text.trim()) {
      loadCountries();
      return;
    }

    const res = await Services.searchCountry(text);
    if (res.success) setCountries(res.data);
  };


  const handleCountrySelect = async (item: any) => {
    const countryName = item.name || item.country;

    setFormData(prev => ({
      ...prev,
      country: countryName,
      state: '',
    }));

    await loadStates(countryName);

    setCountryModal(false);
    setTimeout(() => setShowForm(true), 250);
  };
  const handleStateSelect = (item) => {
    setFormData(prev => ({
      ...prev,
      state: item.name,   // ✅ string
    }));

    setStateModal(false);

    setTimeout(() => {
      setShowForm(true);
    }, 250);
  };


  const loadStates = async (countryName: string) => {
    const res = await Services.getCountryDetailsState(countryName);
    console.log("states", res);

    if (res?.success) setStates(res.data);
  };
  const handleInputChange = (name, value) => {
    console.log("name", name);

    setFormData({
      ...formData,
      [name]: value
    });
  };
  console.log("selectedSupplier", selectedSupplier);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: false,
        mediaType: 'photo',
      });

      if (image) {
        setImageUri(image.path);

        // Create a file object for the form data
        const file = {
          uri: image.path,
          name: image.filename || 'profile_picture.jpg',
          type: image.mime,
        };

        setImageFile(file);
        setFormData({
          ...formData,
          logo: file
        });
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };
  const handleConnect = (item: Organization) => {
    setSelectedSupplier(item);
    setConnectModalVisible(true);
  };
  const sendConnection = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    const payload = {
      to_user: selectedSupplier?.id,
      message: message?.trim() || '',
    };

    try {
      const response = await Services.sendConnectionSupplier(payload);


      if (response.success === true) {
        setConnectModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Connection sent successfully',
          position: 'top',
        });

      } else if (
        response.status === 400 &&
        response.error?.message === 'Connection request pending' &&
        setConnectModalVisible(false)
      ) {
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
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.city || !formData.country || !formData.state || !formData.zip_code) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      // Create FormData object
      const data = new FormData();

      // Append all fields to the FormData
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('mobile', formData.mobile);
      data.append('address_1', formData.address_1);
      data.append('address_2', formData.address_2);
      data.append('city', formData.city);
      data.append('country', formData.country);
      data.append('state', formData.state);
      data.append('zip_code', formData.zip_code);
      data.append('website', formData.website);

      // Append the image file if available
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      const response = await Services.createMasterData(data);
      console.log('Data created successfully:', response);
      setShowForm(false);

      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        address_1: '',
        address_2: '',
        city: '',
        country: 'India',
        state: '',
        zip_code: '',
        website: '',
        logo: null
      });
      setImageUri(null);
      setImageFile(null);

      // Refresh the table data
      fetchMasterData();

      Alert.alert('Success', 'Master data created successfully');
    } catch (error) {
      console.error('Error creating data:', error);
      Alert.alert('Error', 'Failed to create master data');
    }
  };

  const fetchMasterData = async () => {
    try {
      const response = await Services.getMasterData();
      console.log('successfully:', response);
      setTableData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);
  const handleViewProfile = (id: any) => {
    axios
      .get(`${API_URL}masterdata/master-data/${id}/`)
      .then((response) => {
        console.log("response ", response);

        setSelectedProfile(response.data);
        setModalVisible(true);
      })
      .catch((error) => {
        // Handle error
        Toast.error("Something went wrong");
        console.error("Error fetching data:", error);
      });
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProfile(null);
  };
  const handleSendConnection = () => {
    sendConnection()
  }
  return (
    <View style={styles.container}>
      {/* Header with search and filters */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search "
          placeholderTextColor={'black'}
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>

            <Text style={styles.filtersText}>Select Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filtersText}>Select Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filtersText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <ScrollView horizontal={true} style={styles.tableContainer}>
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
            <Text style={[styles.headerCell, styles.nameCell]}>NAME</Text>
            <Text style={[styles.headerCell, styles.nameCell]}>EMAIL | COMPANY</Text>
            <Text style={[styles.headerCell, styles.locationCell]}>LOCATION</Text>
            <Text style={[styles.headerCell, styles.statusCell]}>STATUS</Text>
            <Text style={[styles.headerCell, styles.connectCell]}>CONNECT</Text>
            <Text style={[styles.headerCell, styles.actionCell]}>ACTION</Text>
          </View>

          {/* Table Rows */}
          {tableData.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cell, styles.idCell]}>{item.id}</Text>
              <Text style={[styles.cell, styles.resourceCell]}>{item.name}</Text>
              <View style={[styles.cell, styles.nameCell]}>
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                {item.company ? <Text>{item.company}</Text> : null}
              </View>
              <Text style={[styles.cell, styles.locationCell]}>{item.city}</Text>
              <View style={[styles.cell, styles.statusCell]}>
                <View style={styles.statusIndicator} />
                <Text> {item.status}</Text>
              </View>

              <TouchableOpacity style={[styles.cell, styles.connectCell]}
                onPress={() => handleConnect(item)}>
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cell, styles.actionCell]}
                onPress={() => handleViewProfile(item.id)} // Pass the ID here
              >
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>


      <Modal
        visible={connectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConnectModalVisible(false)}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setConnectModalVisible(false)}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>

            {selectedSupplier && (
              <>
                <Text style={styles.modalTitle}>Connect with {selectedSupplier.company_name}</Text>

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

                <TouchableOpacity style={styles.connectActionButton} onPress={handleSendConnection}>
                  <Text style={styles.connectActionButtonText}>Send Connection Request</Text>
                </TouchableOpacity>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactText}>
                    Or contact directly: {selectedSupplier.mobile || selectedSupplier.email}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>



      <MasterDataIdViewModal
        show={modalVisible}
        modalClose={closeModal}
        profile={selectedProfile}
      />
      {/* Create Master Data Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        transparent={false}
        statusBarTranslucent={false}
        onRequestClose={() => setShowForm(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.primary}
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create Master Data</Text>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
              >
                {/* IMAGE UPLOAD */}
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                  ) : (
                    <Text>Upload Profile Picture</Text>
                  )}
                </TouchableOpacity>

                {/* INPUTS */}
                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="Name *"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="Email *"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={text => handleInputChange('email', text)}
                />

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="Mobile"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="phone-pad"
                  value={formData.mobile}
                  onChangeText={text => handleInputChange('mobile', text)}
                />

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="Address 1"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.address_1}
                  onChangeText={text => handleInputChange('address_1', text)}
                />

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="Address 2"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.address_2}
                  onChangeText={text => handleInputChange('address_2', text)}
                />

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="City *"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.city}
                  onChangeText={text => handleInputChange('city', text)}
                />

                {/* COUNTRY */}
                <Pressable
                  style={[styles.input, styles.themeInput, styles.centerInput]}
                  onPress={openCountryModal}
                >
                  <Text
                    style={{
                      color: formData.country ? COLORS.text : COLORS.placeholder,
                      fontSize: 16,
                    }}
                  >
                    {formData.country || 'Select Country *'}
                  </Text>
                </Pressable>

                {/* STATE */}
                <Pressable
                  disabled={!states.length}
                  style={[
                    styles.input,
                    styles.themeInput,
                    styles.centerInput,
                    { opacity: states.length ? 1 : 0.5 },
                  ]}
                  onPress={openStateModal}
                >
                  <Text
                    style={{
                      color: formData.state ? COLORS.text : COLORS.placeholder,
                      fontSize: 16,
                    }}
                  >
                    {formData.state || 'Select State *'}
                  </Text>
                </Pressable>

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="ZIP Code *"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.zip_code}
                  onChangeText={text => handleInputChange('zip_code', text)}
                />

                <TextInput
                  style={[styles.input, styles.themeInput]}
                  placeholder="Website"
                  keyboardType="url"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.website}
                  onChangeText={text => handleInputChange('website', text)}
                />

                {/* ACTION BUTTONS */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setShowForm(false)}
                  >
                    <Text style={styles.submitButtonText}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>


      <Modal
        visible={countryModal}
        animationType="slide"
        transparent={false}   // 🔴 REQUIRED for iOS
        presentationStyle="fullScreen"
        onRequestClose={() => setCountryModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>

          {/* Header */}
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: COLORS.border },
            ]}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text }}>
              Select Country
            </Text>

            <Pressable onPress={() => setCountryModal(false)}>
              <Text style={{ color: COLORS.primary, fontSize: 16 }}>
                Close
              </Text>
            </Pressable>
          </View>

          {/* Search */}
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                color: COLORS.text,
              },
            ]}
            placeholder="Search country"
            placeholderTextColor={COLORS.placeholder}
            value={countrySearch}
            onChangeText={handleCountrySearch}
          />

          {/* List */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {countries.map(item => (
              <Pressable
                key={item.id}
                onPress={() => handleCountrySelect(item)}
                style={[
                  styles.listItem,
                  {
                    borderBottomColor: COLORS.border,

                  },
                ]}
              >
                <Text
                  style={{
                    color: COLORS.text,   // 🔴 FIX ANDROID TEXT
                    fontSize: 16,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

        </SafeAreaView>
      </Modal>

      <Modal
        visible={stateModal}
        animationType="slide"
        transparent={false}
        presentationStyle="fullScreen"
        onRequestClose={() => setStateModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>

          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: COLORS.text }]}>
              Select State
            </Text>

            <Pressable onPress={() => setStateModal(false)}>
              <Text style={{ color: COLORS.primary }}>Close</Text>
            </Pressable>
          </View>

          {/* State List */}
          <ScrollView keyboardShouldPersistTaps="handled">
            {states.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.listItem,
                  { borderBottomColor: COLORS.border },
                ]}
                onPress={() => {
                  handleStateSelect((item)); // ✅ store name
                  setStateModal(false);
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 16,
                  }}
                >
                  {item.name}   {/* ✅ render string */}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

        </SafeAreaView>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
  },
  themeInput: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    color: COLORS.text,
  },

  centerInput: {
    justifyContent: 'center',
  },

  filterContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#606060ff',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10

  },
  filtersText: {
    fontSize: 10
  },
  createButton: {
    backgroundColor: '#0E3386',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10

  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    padding: 5,
    justifyContent: 'center',
  },
  idCell: {
    width: 80,
  },
  resourceCell: {
    width: 200,
  },
  nameCell: {
    width: 200,
  },
  locationCell: {
    width: 120,
  },
  statusCell: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectCell: {
    width: 180,
  },
  actionCell: {
    width: 180,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 5,
  },
  connectText: {
    color: '#007bff',
    textAlign: 'center',
  },
  viewProfileText: {
    color: '#007bff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    height: 150,
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#0E3386',
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',

  },
  submitButton: {
    backgroundColor: '#0E3386',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#191212ff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  connectActionButton: {
    backgroundColor: '#0E3386',
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
  selectInput: {
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#535353ff',
    borderRadius: 10,
    padding: 14,
    margin: 16,
    fontSize: 16,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },


  listText: {
    fontSize: 16,
    color: "black"
  },

  closeText: {
    color: '#2563EB',
    fontWeight: '600',
  },

});

export default AgencySupplierMasterdata;