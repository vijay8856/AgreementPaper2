import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  StyleSheet,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Services from '../Services/services';



const AllIndividualScreen = () => {
  const [individuals, setIndividuals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileDetail, setUserProfileDetail] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchIndividuals = async () => {
    try {
      setLoading(true);
      const data = {
        limit: 5
      };
      const response = await Services.getIndividualUserProfile(data);
      console.log("API Response:", response);

      if (response?.success && Array.isArray(response.data)) {
        setIndividuals(response.data);
      } else {
        console.warn("Unexpected API response structure:", response);
        setIndividuals([]);
        Alert.alert('Error', 'Failed to load individuals data');
      }
    } catch (error) {
      console.error("Error fetching individuals:", error);
      Alert.alert('Error', 'Failed to fetch individuals data');
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualsProfile = async (userId) => {
    try {
      setLoadingProfile(true);
      const data = {
        User: userId
      };
      const response = await Services.getIndividualUserProfileDetail(data);
      console.log("Individual Profile API Response:", response);

      if (response?.success) {
        // Assuming the response has the user profile data
        // Adjust this based on your actual API response structure
        setUserProfileDetail(response);
      } else {
        console.warn("Unexpected API response structure:", response);
        Alert.alert('Error', 'Failed to load user profile details');
        setUserProfileDetail(null);
      }
    } catch (error) {
      console.error("Error fetching individual profile:", error);
      Alert.alert('Error', 'Failed to fetch user profile details');
      setUserProfileDetail(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
    // Fetch detailed profile for the selected user
    await fetchIndividualsProfile(user.id);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
    setUserProfileDetail(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return null;
    // Use your actual base URL here
    return `http://192.168.116.235:3000${profilePic}`;
  };

  useEffect(() => {
    fetchIndividuals();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#072188" />
        <Text style={styles.loadingText}>Loading individuals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {individuals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="users" size={50} color="#CCCCCC" />
            <Text style={styles.emptyText}>No individuals found</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchIndividuals}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          individuals.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onViewDetails={handleViewDetails}
              getProfilePicUrl={getProfilePicUrl}
            />
          ))
        )}
      </ScrollView>

      {/* Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          visible={showDetailsModal}
          user={selectedUser}
          userProfileDetail={userProfileDetail}
          loading={loadingProfile}
          onClose={handleCloseModal}
          getProfilePicUrl={getProfilePicUrl}
          formatDate={formatDate}
        />
      )}
    </View>
  );
};

// User Card Component
const UserCard = ({ user, onViewDetails, getProfilePicUrl }) => {
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name';
console.log("user",user);

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {/* {user.profile_pic ? (
            <Image 
              source={{ uri: getProfilePicUrl(user.profile_pic) }} 
              style={styles.avatar} 
            />
          ) : (
           
          )} */}
           <View style={styles.avatarPlaceholder}>
              <Icon name="user" size={20} color="#666" />
            </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{user.email || 'No email'}</Text>
          </View>
        </View>
        {/* <View style={styles.verificationBadge}>
          <Icon
            name={user.is_verify ? "check-circle" : "times-circle"}
            size={16}
            color={user.is_verify ? "green" : "red"}
          />
          <Text style={styles.verificationText}>
            {user.is_verify ? 'Verified' : 'Not Verified'}
          </Text> 
        </View> */}
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="phone" size={14} color="#666" />
          <Text style={styles.infoText}>
            {user.contact_number || 'No contact number'}
          </Text>
        </View>

        {/* {user.age && (
          <View style={styles.infoRow}>
            <Icon name="birthday-cake" size={14} color="#666" />
            <Text style={styles.infoText}>Age: {user.age}</Text>
          </View>
        )} */}

        {/* <View style={styles.infoRow}>
          <Icon name="circle" size={14} color={user.is_active ? "green" : "red"} />
          <Text style={[styles.statusText, { color: user.is_active ? 'green' : 'red' }]}>
            {user.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View> */}
      </View>

      {/* Card Footer - Action Buttons */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => onViewDetails(user)}
        >
          <Icon name="eye" size={14} color="#FFF" />
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ 
  visible, 
  user, 
  userProfileDetail, 
  loading, 
  onClose, 
  getProfilePicUrl, 
  formatDate 
}) => {
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name';
  
  // Use detailed profile data if available, otherwise fall back to basic user data
  const displayData = userProfileDetail?.data || user;
console.log("displayData",userProfileDetail);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#072188" />
              <Text style={styles.loadingText}>Loading details…</Text>
            </View>
          ) : (
            <ScrollView style={styles.modalBody}>
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                  {displayData.profile_pic ? (
                    <Image
                      source={{ uri: getProfilePicUrl(displayData.profile_pic) }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Icon name="user" size={40} color="#072188" />
                    </View>
                  )}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{fullName}</Text>
                  <Text style={styles.profileEmail}>{displayData.email || 'No email'}</Text>
                  <View style={styles.profileMeta}>
                    <View style={[styles.badge, displayData.is_verify ? styles.verifiedBadge : styles.unverifiedBadge]}>
                      <Icon 
                        name={displayData.is_verify ? "check-circle" : "times-circle"} 
                        size={12} 
                        color="#FFF" 
                      />
                      <Text style={styles.badgeText}>
                        {displayData.is_verify ? 'Verified' : 'Not Verified'}
                      </Text>
                    </View>
                    <View style={[styles.badge, displayData.is_active ? styles.activeBadge : styles.inactiveBadge]}>
                      <Icon name="circle" size={12} color="#FFF" />
                      <Text style={styles.badgeText}>
                        {displayData.is_active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Information Cards */}
              <View style={styles.infoCardsContainer}>
                {/* Contact Information */}
                <View style={styles.infoCard}>
                  <View style={[styles.cardIcon, styles.contactIcon]}>
                    <Icon name="phone" size={16} color="#FFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Contact Information</Text>
                    <View style={styles.contactList}>
                      <View style={styles.contactItem}>
                        <Icon name="phone-alt" size={14} color="#072188" />
                        <Text style={styles.contactText}>
                          {displayData.contact_number || 'Not provided'}
                        </Text>
                      </View>
                      <View style={styles.contactItem}>
                        <Icon name="envelope" size={14} color="#072188" />
                        <TouchableOpacity
                          onPress={() => displayData.email && Linking.openURL(`mailto:${displayData.email}`)}
                        >
                          <Text style={[styles.contactText, styles.emailText]}>
                            {displayData.email || 'Not provided'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {displayData.linkedin_url && (
                        <View style={styles.contactItem}>
                          <Icon name="linkedin" size={14} color="#072188" />
                          <TouchableOpacity
                            onPress={() => Linking.openURL(displayData.linkedin_url)}
                          >
                            <Text style={[styles.contactText, styles.emailText]}>
                              LinkedIn Profile
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Personal Information */}
                <View style={styles.infoCard}>
                  <View style={[styles.cardIcon, styles.userIcon]}>
                    <Icon name="user" size={16} color="#FFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Personal Information</Text>
                    <View style={styles.detailsList}>
                      {displayData.age && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Age:</Text>
                          <Text style={styles.detailValue}>{displayData.age}</Text>
                        </View>
                      )}
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>User Type:</Text>
                        <Text style={styles.detailValue}>{displayData.user_type || 'N/A'}</Text>
                      </View>
                      {displayData.language_data && displayData.language_data.length > 0 && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Languages:</Text>
                          <Text style={styles.detailValue}>
                            {displayData.language_data.map(lang => lang.name).join(', ')}
                          </Text>
                        </View>
                      )}
                      {displayData.experience && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Experience:</Text>
                          <Text style={styles.detailValue}>{displayData.experience}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Account Information */}
                <View style={styles.infoCard}>
                  <View style={[styles.cardIcon, styles.infoIcon]}>
                    <Icon name="info-circle" size={16} color="#FFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Account Information</Text>
                    <View style={styles.detailsList}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Member Since:</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(displayData.date_joined)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Last Updated:</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(displayData.updated_at)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Last Login:</Text>
                        <Text style={styles.detailValue}>
                          {displayData.last_login ? formatDate(displayData.last_login) : 'Never'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Authorization Status */}
                <View style={styles.infoCard}>
                  <View style={[styles.cardIcon, styles.shieldIcon]}>
                    <Icon name="shield-alt" size={16} color="#FFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Authorization Status</Text>
                    <View style={styles.detailsList}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Authorized:</Text>
                        <Text style={[styles.detailValue, 
                          { color: displayData.is_authorized ? 'green' : 'red' }]}>
                          {displayData.is_authorized ? 'Yes' : 'No'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Verified:</Text>
                        <Text style={[styles.detailValue, 
                          { color: displayData.is_verify ? 'green' : 'red' }]}>
                          {displayData.is_verify ? 'Yes' : 'No'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Additional Profile Data */}
                {userProfileDetail?.profile && Object.keys(userProfileDetail.profile).length > 0 && (
                  <View style={styles.infoCard}>
                    <View style={[styles.cardIcon, styles.fileIcon]}>
                      <Icon name="file-alt" size={16} color="#FFF" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Additional Profile Information</Text>
                      <View style={styles.detailsList}>
                        {Object.entries(userProfileDetail.profile).map(([key, value]) => (
                          <View key={key} style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                              {key.replace(/_/g, ' ').toUpperCase()}:
                            </Text>
                            <Text style={styles.detailValue}>
                              {value || 'N/A'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={onClose}
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#072188',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
  email: {
    fontSize: 14,
    color: '#666',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
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
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: '#072188',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Modal Styles
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
    color: '#FFF',
  },
  closeButton: {
    padding: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  modalBody: {
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  closeModalButton: {
    backgroundColor: '#072188',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Profile Header Styles
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  profileMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: 'green',
  },
  unverifiedBadge: {
    backgroundColor: 'red',
  },
  activeBadge: {
    backgroundColor: 'green',
  },
  inactiveBadge: {
    backgroundColor: 'red',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Info Cards Styles
  infoCardsContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactIcon: {
    backgroundColor: '#072188',
  },
  userIcon: {
    backgroundColor: '#28a745',
  },
  infoIcon: {
    backgroundColor: '#17a2b8',
  },
  shieldIcon: {
    backgroundColor: '#dc3545',
  },
  fileIcon: {
    backgroundColor: '#ffc107',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactList: {
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emailText: {
    color: '#072188',
    textDecorationLine: 'underline',
  },
  detailsList: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
});

export default AllIndividualScreen;