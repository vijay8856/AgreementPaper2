import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface ProfileData {
  id?: string;
  name?: string;
  country?: string;
  state?: string;
  currency?: string;
  contact_number?: string;
  mobile?: string;
  email?: string;
  address_1?: string;
  website?: string;
  logo?: string;
  // Add other fields as needed
}

interface MasterDataIdViewModalProps {
  show: boolean;
  modalClose: () => void;
  profile: {
    data?: ProfileData;
  } | null;
}

const MasterDataIdViewModal: React.FC<MasterDataIdViewModalProps> = ({
  show,
  modalClose,
  profile,
}) => {
  const handleEmailPress = () => {
    if (profile?.data?.email) {
      Linking.openURL(`mailto:${profile.data.email}`);
    }
  };
console.log("profile",profile);

  const handleWebsitePress = () => {
    if (profile?.data?.website) {
      Linking.openURL(profile.data.website);
    }
  };

  if (!profile) {
    return (
      <Modal
        visible={show}
        animationType="slide"
        transparent={true}
        onRequestClose={modalClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#072188" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={show}
      animationType="slide"
      transparent={true}
      onRequestClose={modalClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalView}>
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#072188', '#4a8ce2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Profile Details</Text>
            <TouchableOpacity onPress={modalClose} style={styles.closeButton}>
              <Icon name="times" size={20} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalBody}>
            {/* Company Logo and Basic Info */}
            <View style={styles.companyHeader}>
              <View style={styles.logoContainer}>
                {profile?.logo ? (
                  <Image
                    source={{ uri: profile?.logo }}
                    style={styles.companyLogo}
                    onError={() => console.log('Error loading image')}
                    resizeMode="contain"
                  />
                ) : (
                  <Icon name="building" size={40} color="#072188" />
                )}
              </View>

              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{profile?.name || 'N/A'}</Text>
                <View style={styles.companyMeta}>
                  <View style={[styles.badge, styles.locationBadge]}>
                    <Icon name="map-marker-alt" size={12} color="#FFF" />
                    <Text style={styles.badgeText}>
                      {profile?.country || 'N/A'} ({profile?.state || 'N/A'})
                    </Text>
                  </View>
                  <View style={[styles.badge, styles.currencyBadge]}>
                    <Icon name="money-bill-wave" size={12} color="#FFF" />
                    <Text style={styles.badgeText}>{profile?.country || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Information Cards */}
            <View style={styles.infoCardsContainer}>
              <View style={styles.infoCard}>
                <View style={[styles.cardIcon, styles.phoneIcon]}>
                  <Icon name="phone" size={16} color="#FFF" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Contact Information</Text>
                  <View style={styles.contactList}>
                    <View style={styles.contactItem}>
                      <Icon name="phone-alt" size={14} color="#072188" />
                      <Text style={styles.contactText}>
                        {profile?.mobile || 'Not provided'}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Icon name="mobile-alt" size={14} color="#072188" />
                      <Text style={styles.contactText}>
                        {profile?.mobile || 'Not provided'}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Icon name="envelope" size={14} color="#072188" />
                      <TouchableOpacity onPress={handleEmailPress}>
                        <Text style={[styles.contactText, styles.emailText]}>
                          {profile?.email || 'Not provided'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={[styles.cardIcon, styles.mapIcon]}>
                  <Icon name="map-marked-alt" size={16} color="#FFF" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Address</Text>
                  <View style={styles.addressContent}>
                    <View style={styles.addressItem}>
                      <Icon name="home" size={14} color="#072188" />
                      <Text style={styles.addressText}>
                        {profile?.address_1 || 'Not provided'}
                      </Text>
                    </View>
                    {profile?.website && (
                      <View style={styles.addressItem}>
                        <Icon name="globe" size={14} color="#072188" />
                        <TouchableOpacity onPress={handleWebsitePress}>
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

            {/* Additional Details */}
            <View style={styles.additionalDetails}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Industry:</Text>
                  <Text style={styles.detailValue}>
                    {profile?.name || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Founded:</Text>
                  <Text style={styles.detailValue}>
                    {profile?.state || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={modalClose}
            >
              <Icon name="check" size={16} color="#FFF" />
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 5,
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
});

export default MasterDataIdViewModal;