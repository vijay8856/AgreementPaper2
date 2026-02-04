
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { API_URL, AUTH_MULTYPART_HEADERS } from '../Axios/axiosData';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
type LawyerCardProps = {
  lawyerData: {
    id: number;
    name: string;
    email: string;
    company_name: string;
    country: string;
    is_active: boolean;
    user_id?: number;
  };
};

type Organization = {
  id: string;
  user: number;
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

const LawyerCard: React.FC<LawyerCardProps> = ({ lawyerData }) => {
  const [profile, setProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Organization | null>(null);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(lawyerData?.is_favorite || false);

  console.log("selectedSupplier", selectedSupplier);

  const handleViewProfile = async (id: number) => {
    try {
      setLoadingProfile(true);
      const res = await Services.viewLawyerNetworkProfile(id);
      if (res.success) {
        setProfile(res.data.data);
        setShowProfileModal(true);
      } else {
        Toast.show({ type: 'error', text1: 'Unable to load profile' });
      }
    } catch (err) {
      console.error('View profile error', err);
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleConnect = () => {
    setSelectedSupplier(lawyerData as any);
    setConnectModalVisible(true);
  };

  const handleSendConnection = () => {
    sendConnection();
  };

  const sendConnection = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    const payload = {
      to_user: selectedSupplier?.user_id,
      message: message?.trim() || '',
    };

    try {
      const response = await Services.sendConnectionSupplier(payload);
      console.log("uuuu", response);

      if (response.success === true) {
        setConnectModalVisible(false);
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
    }

    setLoading(false);
    setRefreshing(false);
  };

  const toggleFavorite = async (user_id: number) => {
    try {
      const nextValue = !isFavorite;
      setIsFavorite(nextValue);

      if (nextValue) {
        await Services.addFavorites({ target_id: user_id });
        Toast.show({
          type: 'success',
          text1: 'Added to favorites',
          position: 'top',
        });
      } else {
        await Services.addFavorites({ target_id: user_id });
        // If you have a remove API, call it here
        Toast.show({
          type: 'info',
          text1: 'Removed from favorites',
          position: 'top',
        });
      }
    } catch (error) {
      setIsFavorite(prev => !prev);
      Toast.show({
        type: 'error',
        text1: 'Error updating favorites',
        position: 'top',
      });
      console.error('Favorite toggle failed:', error);
    }
  };

  return (
    <>
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={require('../assets/images/user.png')} style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{lawyerData.name}</Text>
              <Text style={styles.company}>{lawyerData.company_name}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(lawyerData?.user_id)}
            style={styles.favoriteButton}
          >
            <Icon
              name="heart"
              size={20}
              color={isFavorite ? "#fbbf24" : "#CCCCCC"}
              solid={isFavorite}
            />
          </TouchableOpacity>

        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="email-outline" size={14} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>{lawyerData.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={14} color="#666" />
            <Text style={styles.infoText}>{lawyerData.country}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="checkbox-blank-circle" size={14} color={lawyerData.is_active ? "green" : "red"} />
            <Text style={[styles.statusText, { color: lawyerData.is_active ? 'green' : 'red' }]}>
              {lawyerData.is_active ? 'Available' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* Card Footer - Action Buttons */}
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.connectButton,
              lawyerData?.connection_request && styles.disabledButton, // Optional grey-out if request exists
            ]}
            onPress={handleConnect}
            disabled={!!lawyerData?.connection_request} // disable if connection_request is NOT null
          >
            <Icon name="handshake-outline" size={14} color="#FFF" />
            <Text style={styles.connectButtonText}>
              {lawyerData?.connection_request
                ? lawyerData.connection_request // Show PENDING / COMPLETED / etc.
                : 'Connect'} {/* Show "Connect" if connection_request is null */}
            </Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewProfile(lawyerData.id)}
          >
            <Icon name="eye-outline" size={14} color="#FFF" />
            <Text style={styles.actionButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Modal (Keep existing modal code) */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <LinearGradient
              colors={['#072188', '#4a8ce2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
               <SafeAreaView style={styles.headerSafeArea}>



              <Text style={styles.modalTitle}>Profile Details</Text>
              <TouchableOpacity
                onPress={() => setShowProfileModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close-circle" size={24} color="#0E3386" />
              </TouchableOpacity>
               </SafeAreaView>

            </LinearGradient>

            {loadingProfile ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#072188" />
                <Text style={styles.loadingText}>Loading profile…</Text>
              </View>
            ) : (
              <ScrollView style={styles.modalBody}>
                {/* Keep existing modal content */}
                <View style={styles.companyHeader}>
                  <View style={styles.logoContainer}>
                    {profile?.logo ? (
                      <Image
                        source={{ uri: profile.logo }}
                        style={styles.companyLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <Icon name="office-building" size={40} color="#072188" />
                    )}
                  </View>

                  <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>
                      {profile?.company_name || 'N/A'}
                    </Text>
                    <View style={styles.companyMeta}>
                      <View style={[styles.badge, styles.locationBadge]}>
                        <Icon name="map-marker" size={14} color="white" />
                        <Text style={styles.badgeText}>
                          {profile?.country_name || 'N/A'} ({profile?.state_name || 'N/A'})
                        </Text>
                      </View>
                      <View style={[styles.badge, styles.currencyBadge]}>
                        <Icon name="money-bill-wave" size={12} color="#FFF" />
                        <Text style={styles.badgeText}>
                          {profile?.currency_detail?.currency || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.infoCardsContainer}>
                  <View style={styles.infoCard}>
                    <View style={[styles.cardIcon, styles.phoneIcon]}>
                      <Icon name="phone" size={16} color="#FFF" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Contact Information</Text>
                      <View style={styles.contactList}>
                        <View style={styles.contactItem}>
                          <Icon name="phone" size={14} color="#072188" />
                          <Text style={styles.contactText}>
                            {profile?.user_detail?.contact_number || 'Not provided'}
                          </Text>
                        </View>
                        <View style={styles.contactItem}>
                          <Icon name="email-outline" size={14} color="#072188" />
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(`mailto:${profile?.user_detail?.email}`)
                            }
                          >
                            <Text style={[styles.contactText, styles.emailText]}>
                              {profile?.user_detail?.email || 'Not provided'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={[styles.cardIcon, styles.mapIcon]}>
                      <Icon name="map-marker" size={14} color="#666" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Address</Text>
                      <View style={styles.addressContent}>
                        <View style={styles.addressItem}>
                          <Icon name="home-outline" size={14} color="#072188" />
                          <Text style={styles.addressText}>
                            {profile?.address || 'Not provided'}
                          </Text>
                        </View>
                        {profile?.company_website && (
                          <View style={styles.addressItem}>
                            <Icon name="earth" size={14} color="#072188" />
                            <TouchableOpacity
                              onPress={() =>
                                Linking.openURL(profile.company_website)
                              }
                            >
                              <Text style={[styles.addressText, styles.websiteText]}>
                                Visit Website
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.additionalDetails}>
                  <Text style={styles.sectionTitle}>Additional Information</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>About Company:</Text>
                      <Text style={styles.detailValue}>
                        {profile?.about_company || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>District:</Text>
                      <Text style={styles.detailValue}>
                        {profile?.district || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowProfileModal(false)}
              >
                <Icon name="check" size={16} color="#FFF" />
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Connect Modal (Keep existing modal code) */}
      <Modal
        visible={connectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConnectModalVisible(false)}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={styles.modalTitle}>Connect with {lawyerData.company_name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setConnectModalVisible(false)}
              >
                <Icon name="close-circle" size={24} color="#0E3386" />
              </TouchableOpacity>
            </View>

            {lawyerData && (
              <>
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
                    Contact directly: {lawyerData.email}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  connectButtonText: {
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    marginLeft: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  connectButton: {
    backgroundColor: '#0E3386',
  },
  viewButton: {
    backgroundColor: '#28A745',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },

  // Keep existing modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    height: Platform.OS === 'ios' ? 70 : 60,
    justifyContent: 'center',
  },

  headerSafeArea: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 20 : 18,
  },
  modalBody: {
    padding: 15,
  },
  loadingText: {
    marginTop: 10,
    color: '#072188',
    fontSize: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  companyLogo: {
    width: 60,
    height: 60,
  },
  companyInfo: {
    marginLeft: 15,
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#072188',
    marginBottom: 5,
  },
  companyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  locationBadge: {
    backgroundColor: '#072188',
  },
  currencyBadge: {
    backgroundColor: '#6C757D',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  infoCardsContainer: {
    marginBottom: 20,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -15,
    left: 15,
  },
  phoneIcon: {
    backgroundColor: '#072188',
  },
  mapIcon: {
    backgroundColor: '#28A745',
  },
  cardContent: {
    marginTop: 10,
    paddingLeft: 30,
  },
  cardTitle: {
    color: '#072188',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  contactList: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
    color: '#333',
  },
  emailText: {
    color: '#072188',
  },
  addressContent: {
    gap: 8,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    marginLeft: 8,
    color: '#333',
  },
  websiteText: {
    color: '#072188',
  },
  additionalDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#072188',
    fontSize: 16,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
    marginBottom: 15,
  },
  detailsGrid: {
    gap: 15,
  },
  detailItem: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 5,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  detailValue: {
    color: '#072188',
  },
  modalFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  closeModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#072188',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
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
});

export default LawyerCard;