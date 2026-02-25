import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import Services from '../Services/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
type TalentProfile = {
  id: number;
  user_detail: {
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    profile_pic: string | null;
  };
  country_name: string;
  state_name: string;
  district: string;
  current_job_title: string;
  about: string;
  total_experience: string;
  skill_set_data: {id: number; name: string}[];
  cv: string;
  is_available: boolean;
  privacy_settings: {
    show_email: boolean;
    show_contact_number: boolean;
    show_cv: boolean;
  };
  slug: string;
};

const TalentProfileList = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [availability, setAvailability] = useState<number | null>(null);
  const [payMin, setPayMin] = useState('');
  const [payMax, setPayMax] = useState('');
  const [expMin, setExpMin] = useState('');
  const [expMax, setExpMax] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [selectedIndividual, setSelectedIndividual] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [locationOptions] = useState([
    {id: 74, name: 'India'},
    {id: 9, name: 'Australia'},
  ]);

  useEffect(() => {
    loadSkills();
    applyFilters(); // initial load
  }, []);

  const loadSkills = async () => {
    const res = await Services.getSkillDropDownList();
    if (res.success) {
      setSkillOptions(res.data || []);
    }
  };

  const resetFilters = () => {
    setSelectedSkill(null);
    setAvailability(null);
    setPayMin('');
    setPayMax('');
    setExpMin('');
    setExpMax('');
    setSelectedCountry(null);

    loadProfiles();
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const params: any = {
      limit: 10,
    };
    const res = await Services.getAllTalentUserProfile(params);
    console.log('getAllTalentUserProfile  res', res);

    if (res.success) {
      setProfiles(res.data.results || []);
    }

    setLoading(false);
  };
  const applyFilters = async () => {
    setLoading(true);

    try {
      const params: any = {
        limit: 100,
      };

      if (selectedSkill) params.skill = selectedSkill;
      if (availability) params.availability = availability;

      if (payMin) params.pay_rate_min = payMin;
      if (payMax) params.pay_rate_max = payMax;

      if (expMin) params.experience_min = expMin;
      if (expMax) params.experience_max = expMax;

      if (selectedCountry) params.country = selectedCountry;

      console.log('FILTER PARAMS 👉', params);

      const res = await Services.getAllTalentUserProfile(params);
      console.log('0000', res);

      if (res.success) {
        setProfiles(res.data.results || []);
      }
    } catch (e) {
      console.log('Filter error', e);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenConnect = (item: any) => {
    console.log('item', item);

    setSelectedIndividual(item);
    setConnectModalVisible(true);
  };
  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
  };

  const handleCloseConnectModal = () => {
    setConnectModalVisible(false);
    setMessage('');
  };

  const handleViewDetails = async (slug: string) => {
    console.log('handleViewDetails', slug);

    try {
      setDetailsLoading(true);
      const res = await Services.getTalentProfileResourceDetails(slug);

      if (res.success) {
        setSelectedIndividual(res.data.data); // FULL PROFILE OBJECT
        setDetailsModalVisible(true);
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load profile',
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  const sendConnection = async () => {
    if (!selectedIndividual) return;

    setLoading(true);

    const payload = {
      to_user: selectedIndividual?.user,
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
  const renderItem = ({item}: {item: TalentProfile}) => {
    const fullName = `${item.user_detail.first_name} ${item.user_detail.last_name}`;

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            {item.user_detail.profile_pic ? (
              <Image
                source={{uri: item.user_detail.profile_pic}}
                style={styles.avatarImg}
              />
            ) : (
              <Icon name="account" size={32} color="#fff" />
            )}
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.job}>{item.current_job_title}</Text>
          </View>

          <View
            style={[
              styles.status,
              {backgroundColor: item.is_available ? '#DCFCE7' : '#FEE2E2'},
            ]}>
            <Text
              style={{
                color: item.is_available ? '#166534' : '#991B1B',
                fontWeight: '600',
                fontSize: 12,
              }}>
              {item.is_available ? 'Available' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.meta}>
          📍 {item.district}, {item.state_name}, {item.country_name}
        </Text>

        {/* Experience */}
        <Text style={styles.meta}>
          💼 Experience: {item.total_experience} yrs
        </Text>

        {/* About */}
        {item.about ? (
          <Text style={styles.about} numberOfLines={3}>
            {item.about}
          </Text>
        ) : null}

        {/* Skills */}
        <View style={styles.skillsRow}>
          {item.skill_set_data.map(skill => (
            <View key={skill.id} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill.name}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          {item.privacy_settings.show_email && (
            <Text style={styles.actionText}>📧 {item.user_detail.email}</Text>
          )}

          {item.privacy_settings.show_contact_number && (
            <Text style={styles.actionText}>
              📞 {item.user_detail.contact_number}
            </Text>
          )}

          {item.privacy_settings.show_cv && item.cv ? (
            <TouchableOpacity onPress={() => Linking.openURL(item.cv)}>
              <Text style={styles.cvLink}>📄 View CV</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => handleViewDetails(item?.slug)}>
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.connectBtn}
            onPress={() => handleOpenConnect(item)}>
            <Text style={styles.connectBtnText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }

  return (
    <>
      <View style={{margin: 5, padding: 5, paddingBottom: 3}}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowSkillModal(true)}>
          <Text style={styles.dropdownText}>
            {selectedSkill
              ? skillOptions.find(s => s.id === selectedSkill)?.name
              : 'Select Skill'}
          </Text>
          <Icon name="chevron-down" size={22} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowAvailability(true)}>
          <Text style={styles.dropdownText}>
            {availability === 1
              ? 'Available'
              : availability === 2
              ? 'Busy'
              : 'Select Availability'}
          </Text>
          <Icon name="chevron-down" size={22} color="#6B7280" />
        </TouchableOpacity>

        <Text style={{marginTop: 5}}> Pay Rate</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="Min Pay"
            keyboardType="numeric"
            placeholderTextColor={'black'}
            value={payMin}
            onChangeText={setPayMin}
            style={styles.input}
          />
          <TextInput
            placeholder="Max Pay"
            keyboardType="numeric"
            placeholderTextColor={'black'}
            value={payMax}
            onChangeText={setPayMax}
            style={styles.input}
          />
        </View>
        <Text style={{marginTop: 5}}> Experience</Text>

        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="Min Exp"
            keyboardType="numeric"
            placeholderTextColor={'black'}
            value={expMin}
            onChangeText={setExpMin}
            style={styles.input}
          />
          <TextInput
            placeholder="Max Exp"
            keyboardType="numeric"
            placeholderTextColor={'black'}
            value={expMax}
            onChangeText={setExpMax}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowCountryModal(true)}>
          <Text style={styles.dropdownText}>
            {selectedCountry
              ? locationOptions.find(c => c.id === selectedCountry)?.name
              : 'Select Country'}
          </Text>
          <Icon name="chevron-down" size={22} color="#6B7280" />
        </TouchableOpacity>

        <View style={{flexDirection: 'row', paddingTop: 7}}>
          <TouchableOpacity onPress={applyFilters} style={styles.applyBtn}>
            <Text style={styles.btnText}>Apply</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!loading && profiles.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Modal visible={showAvailability} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowAvailability(false)}>
          <View style={styles.modalBox}>
            {[
              {label: 'Available', value: 1},
              {label: 'Busy', value: 2},
            ].map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.option}
                onPress={() => {
                  setAvailability(item.value);
                  setShowAvailability(false);
                }}>
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showSkillModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSkillModal(false)}>
          <View style={styles.modalBox}>
            <FlatList
              data={skillOptions}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setSelectedSkill(item.id);
                    setShowSkillModal(false);
                  }}>
                  <Text style={styles.optionText}>{item?.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={showCountryModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryModal(false)}>
          <View style={styles.modalBox}>
            <FlatList
              data={locationOptions}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setSelectedCountry(item.id);
                    setShowCountryModal(false);
                  }}>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={detailsModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseDetailsModal}>
              <Icon2 name="times" size={24} />
            </TouchableOpacity>

            {detailsLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              selectedIndividual && (
                <>
                  <Text style={styles.modalTitle}>
                    {selectedIndividual.user_detail.first_name}{' '}
                    {selectedIndividual.user_detail.last_name}
                  </Text>

                  <Text style={styles.modalText}>
                    📍 {selectedIndividual.district},
                    {selectedIndividual.state_name},{' '}
                    {selectedIndividual.country_name}
                  </Text>

                  <Text style={styles.modalText}>
                    💼 {selectedIndividual.current_job_title}
                  </Text>

                  <Text style={styles.modalText}>
                    🧠 Experience: {selectedIndividual.total_experience} yrs
                  </Text>

                  <Text style={styles.modalText}>
                    📝 {selectedIndividual.about}
                  </Text>

                  <View style={styles.skillsRow}>
                    {selectedIndividual.skill_set_data.map((s: any) => (
                      <View key={s.id} style={styles.skillChip}>
                        <Text style={styles.skillText}>{s.name}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.modalText}>
                    📍 {selectedIndividual.pin_code}
                  </Text>
                  {selectedIndividual.cv && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(selectedIndividual.cv)}>
                      <Text style={styles.cvLink}>📄 View CV</Text>
                    </TouchableOpacity>
                  )}
                </>
              )
            )}
          </View>
        </View>
      </Modal>
      {/* Connect Modal */}
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
              <Icon2 name="times" size={24} color="#666" />
            </TouchableOpacity>

            {selectedIndividual && (
              <>
                <Text style={styles.modalTitle}>
                  Connect with {selectedIndividual.user_detail.first_name}{' '}
                  {selectedIndividual.user_detail.last_name}
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Message (Optional)</Text>
                  <TextInput
                    style={[styles.inputModal, styles.messageInput]}
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
                    {selectedIndividual.user_detail.contact_number ||
                      selectedIndividual.email ||
                      'N/A'}
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

export default TalentProfileList;
const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#767777ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
    marginTop: 5,
  },
  inputModal: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 6,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    height: 50,
    width: 200,
  },

  picker: {
    height: 52, // reduce picker height
    fontSize: 10, // Android only
    color: '#111827',
  },

  pickerItem: {
    fontSize: 10, // Android dropdown text size
  },
  /* APPLY BUTTON */
  applyBtn: {
    flex: 1,
    backgroundColor: '#0E3386',
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    elevation: 3,
  },

  /* RESET BUTTON */
  resetBtn: {
    flex: 1,

    backgroundColor: '#6B7280',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  /* BUTTON TEXT */
  btnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E3386',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  job: {
    fontSize: 13,
    color: '#6B7280',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  meta: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4,
  },
  about: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 8,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  actionsRow: {
    marginTop: 10,
  },
  actionText: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 4,
  },
  cvLink: {
    borderWidth: 1,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    borderColor: '#2563EB',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#585858ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },

  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  optionText: {
    fontSize: 15,
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  viewBtn: {
    flex: 1,
    backgroundColor: '#0E3386',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },

  viewBtnText: {
    color: '#fff',
    fontWeight: '700',
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
