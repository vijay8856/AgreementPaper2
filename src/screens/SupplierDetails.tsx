import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
const BASE_URL = 'https://api.agreementpaper.com';

export default function SupplierDetails() {
  const route = useRoute<any>();
  const {slug, item, id} = route.params;

  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [message, setMessage] = useState('');

  const data = supplier || item;
  // const owner = data?.user_detail || {};
  console.log('selectedIndividual', selectedIndividual);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/agency/agency-profile/${slug}/`);
      setSupplier(res.data?.data || res.data);
    } catch (e) {
      console.log('Supplier detail error', e);
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (!supplier) return <Text>No supplier found</Text>;

  const owner = supplier.user_detail || {};
  const privacy = supplier.privacy_settings || {};
  const handleOpenConnect = (item: any) => {
    console.log('idsss', item?.user);

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
      to_user: id,
      message: message?.trim() || '',
    };

    console.log('logs pay', payload);

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
  return (
    <View>
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri:
              supplier.logo ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
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
          {supplier.about_company || 'No company details available.'}
        </Text>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => handleOpenConnect(data)}>
          <Text style={styles.connectBtnText}>Connect</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={connectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseConnectModal}>
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseConnectModal}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>

            {selectedIndividual && (
              <>
                <Text style={styles.modalTitle}>
                  Connect with {selectedIndividual?.company_name}
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
                  disabled={loading}>
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
                    Or contact directly:{' '}
                    {selectedIndividual?.user_detail?.contact_number ||
                      selectedIndividual?.user_detail?.email}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  logo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {fontSize: 24, fontWeight: 'bold', textAlign: 'center'},
  owner: {textAlign: 'center', color: '#666', marginBottom: 20},
  section: {marginBottom: 20},
  sectionTitle: {fontSize: 18, fontWeight: '600', marginBottom: 10},
  about: {fontSize: 15, lineHeight: 22},
  detailsBtn: {
    marginTop:10,
    alignItems:'center',
    backgroundColor: '#0056d2',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 20,
  },

  detailsText: {
    color: 'white',
    fontWeight: '600',
  },
  detail: {
    color: '#555',
    fontWeight: '600',
  },

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
  modalText: {},
});
