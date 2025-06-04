import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import { Picker } from '@react-native-picker/picker';

type Supplier = {
  id: string;
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

const SupplierAgencyScreen = () => {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
console.log("selectedSupplier",selectedSupplier);

  const ratings = [
    { label: "All Ratings", value: "" },
    { label: "5 Stars", value: "5" },
    { label: "4+ Stars", value: "4" },
    { label: "3+ Stars", value: "3" },
  ];

  const locations = [
    { label: "All Locations", value: "" },
    { label: "India", value: "India" },
    { label: "Australia", value: "Australia" },
    { label: "Canada", value: "Canada" },
    { label: "Afghanistan", value: "Afghanistan" },
    { label: "USA", value: "USA" },
  ];

  const fetchSupplierList = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await Services.getSuppliersList({ limit: 30, offset: 0 });

      if (response.success) {
        // Transform API response to match our Supplier type
        const formattedSuppliers = response.data.map((supplier: any) => ({
          id: supplier.id,
          company_name: supplier.company_name,
          email: supplier.user_detail?.email || supplier.email,
          country_name: supplier.country_name,
          state_name: supplier.state_name,
          district: supplier.district,
          is_active: supplier.is_active,
          user_detail: {
            first_name: supplier.user_detail?.first_name || '',
            last_name: supplier.user_detail?.last_name || '',
            email: supplier.user_detail?.email || '',
            contact_number: supplier.user_detail?.contact_number || '',
            experience: supplier.user_detail?.experience || '',
            linkedin_url: supplier.user_detail?.linkedin_url || '',
          },
          about_company: supplier.about_company,
          company_website: supplier.company_website,
          is_connection: supplier.is_connection,
        }));

        setSupplierList(formattedSuppliers);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to load suppliers',
          text2: response.error?.message || 'Something went wrong',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Supplier fetch error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to connect to server',
        position: 'top',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSupplierList();
  }, []);

  const onRefresh = useCallback(() => {
    fetchSupplierList(true);
  }, []);

  const filteredSuppliers = supplierList.filter(supplier => {
    // Safely extract values or fallback to empty string
    const companyName = supplier.company_name?.toLowerCase() || '';
    const email = supplier.email?.toLowerCase() || '';

    const matchesSearch =
      companyName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    const matchesRating = true; // Stubbed until rating data is available

    const matchesLocation =
      !locationFilter ||
      supplier.country_name === locationFilter;

    return matchesSearch && matchesRating && matchesLocation;
  });


  const handleConnect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setConnectModalVisible(true);
  };

  const handleViewProfile = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setProfileModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }
const DetailItem: React.FC<{
  label: string;
  value: string;
  isLink?: boolean;
  isEmail?: boolean;
}> = ({ label, value, isLink = false, isEmail = false }) => (
  <View style={styles.infoGroup}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isLink || isEmail ? (
      <Text style={[styles.infoValue2, isLink && styles.linkText]}>
        {value}
      </Text>
    ) : (
      <Text style={styles.infoValue2}>{value}</Text>
    )}
  </View>
);
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0E3386', '#1A3B8B']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>ORGANIZATION</Text>
      </LinearGradient>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Organization"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Select Rating</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ratingFilter}
                onValueChange={setRatingFilter}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {ratings.map((rating, index) => (
                  <Picker.Item key={index} label={rating.label} value={rating.value} style={styles.pickerFont} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Select Location</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={locationFilter}
                onValueChange={setLocationFilter}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {locations.map((location, index) => (
                  <Picker.Item key={index} label={location.label} value={location.value} style={styles.pickerFont} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>
      <ScrollView horizontal>
        <View style={{marginBottom:40}}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.idColumn}><Text style={styles.headerText}>ID</Text></View>
            <View style={styles.orgColumn}><Text style={styles.headerText}>ORG</Text></View>
            <View style={styles.emailColumn}><Text style={styles.headerText}>EMAIL | COMPANY</Text></View>
            <View style={styles.ratingColumn}><Text style={styles.headerText}>RATINGS</Text></View>
            <View style={styles.locationColumn}><Text style={styles.headerText}>LOCATION</Text></View>
            <View style={styles.statusColumn}><Text style={styles.headerText}>STATUS</Text></View>
            <View style={styles.connectColumn}><Text style={styles.headerText}>CONNECT</Text></View>
            <View style={styles.actionColumn}><Text style={styles.headerText}>ACTION</Text></View>
          </View>

          {/* Supplier List */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredSuppliers.map((supplier, index) => (
              <View key={supplier.id} style={styles.tableRow}>
                <View style={styles.idColumn}><Text style={styles.cellText}>{index + 1}</Text></View>

                <View style={styles.orgColumn}>
                  <Text style={styles.cellText}>{supplier.company_name}</Text>
                </View>

                <View style={styles.emailColumn}>
                  <Text style={styles.cellText}>{supplier.email}</Text>
                  <Text style={styles.companyText}>{supplier.company_name}</Text>
                </View>

                <View style={styles.ratingColumn}>
                  <Text style={styles.cellText}>India</Text>
                </View>

                <View style={styles.locationColumn}>
                  <Text style={styles.cellText}>India</Text>
                  <Text style={styles.cellText}>Australia</Text>
                  <Text style={styles.cellText}>Canada</Text>
                  <Text style={styles.cellText}>New India</Text>
                </View>

                <View style={styles.statusColumn}>
                  <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, supplier.is_active && styles.activeDot]} />
                    <Text style={styles.statusText}>
                      {supplier.is_active ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                </View>

                <View style={styles.connectColumn}>
                  <TouchableOpacity
                    style={[styles.connectButton, supplier.is_connection && styles.connectedButton]}
                    onPress={() => handleConnect(supplier)}
                  >
                    <Text style={styles.connectButtonText}>
                      {supplier.is_connection ? 'Connected' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionColumn}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewProfile(supplier)}
                  >
                    <Text style={styles.actionButtonText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {/* View Profile Modal */}
      
      <Modal
  visible={profileModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setProfileModalVisible(false)}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Supplier Profile</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setProfileModalVisible(false)}
        >
          <Icon name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {selectedSupplier && (
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {/* Company Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="business" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Company Information</Text>
            </View>
            <View style={styles.cardBody}>
              <DetailItem 
                label="Company Name" 
                value={selectedSupplier.company_name} 
              />
              <DetailItem 
                label="Email" 
                value={selectedSupplier.email} 
                isEmail={true}
              />
              <DetailItem 
                label="Website" 
                value={selectedSupplier.company_website || 'N/A'} 
                isLink={true}
              />
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>About</Text>
                <Text style={styles.infoValue}>
                  {selectedSupplier.about_company || 'No description available'}
                </Text>
              </View>
            </View>
          </View>

          {/* Location Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="location-on" size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <View style={styles.cardBody}>
              <DetailItem label="Country" value={selectedSupplier.country_name} />
              <DetailItem label="State" value={selectedSupplier.state_name} />
              <DetailItem label="District" value={selectedSupplier.district} />
            </View>
          </View>

          {/* Contact Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="person" size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Contact</Text>
            </View>
            <View style={styles.cardBody}>
              <DetailItem 
                label="Contact Person" 
                value={`${selectedSupplier.user_detail.first_name} ${selectedSupplier.user_detail.last_name}`} 
              />
              <DetailItem 
                label="Phone" 
                value={selectedSupplier.user_detail.contact_number || 'N/A'} 
              />
              <DetailItem 
                label="Experience" 
                value={selectedSupplier.user_detail.experience || 'N/A'} 
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  </View>
</Modal>


      {/* Connect Modal */}
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
                  />
                </View>

                <TouchableOpacity style={styles.connectActionButton}>
                  <Text style={styles.connectActionButtonText}>Send Connection Request</Text>
                </TouchableOpacity>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactText}>
                    Or contact directly: {selectedSupplier.user_detail.contact_number || selectedSupplier.email}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FC',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 10,
    color: 'black',
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',

  },
  picker: {
    color: 'black',
    height: 45,
  },
  pickerFont: {
   fontSize: 11,
    marginBottom: 10,
     color: 'black',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0E3386',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  idColumn: {
    width: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgColumn: {
    width: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  emailColumn: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  ratingColumn: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  locationColumn: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statusColumn: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  connectColumn: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  actionColumn: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  cellText: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
  },
  companyText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    marginRight: 4,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 10,
    color: '#333',
  },
  connectButton: {
    backgroundColor: '#0E3386',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  connectedButton: {
    backgroundColor: '#4CAF50',
  },
  connectButtonText: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#0E3386',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
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
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0E3386',
    marginBottom: 16,
    textAlign: 'center',
  },
  profileSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: '40%',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#666',
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
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
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

  // modal view style

   modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // modalTitle: {
  //   fontSize: 20,
  //   fontWeight: '600',
  //   color: '#111827',
  //   letterSpacing: 0.25,
  // },
  // closeButton: {
  //   padding: 8,
  // },
  contentScroll: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // sectionTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#1F2937',
  //   marginLeft: 12,
  // },
  cardBody: {
    paddingVertical: 4,
  },
  infoGroup: {
    marginBottom: 16,
  },
  infoLabel2: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue2: {
    fontSize: 15,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 22,
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default SupplierAgencyScreen;