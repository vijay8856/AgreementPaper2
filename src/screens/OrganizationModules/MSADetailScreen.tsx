// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  Switch,
  Linking,
  Alert,
  Platform,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Services from '../../Services/services';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MSADetailScreen = ({route}: any) => {
  const {data} = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [msaData, setMsaData] = useState(data);
  const [refreshing, setRefreshing] = useState(false);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    msa_type: [],
    unpsc_code: [],
    gl_account: [],
    business_unit: [],
    tax_service_type: [],
    tax_group: [],
  });
  const [dropdownModal, setDropdownModal] = useState({
    visible: false,
    type: null,
    data: [],
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await Services.getMSADetail(msaData.slug);
      if (res.success) {
        setMsaData(res.data);
      } else {
        console.log('Refresh error:', res.error);
      }
    } catch (err) {
      console.log('Unexpected refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch dropdown data from the single API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await Services.getMSAFields();
        if (response.success) {
          setDropdownData(response.data.payload);
        } else {
          Alert.alert('Error', 'Failed to fetch dropdown data');
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        Alert.alert('Error', 'Failed to fetch dropdown data');
      }
    };

    fetchDropdownData();
  }, []);
  const getResourceData = (msaData: any) => {
    if (msaData?.masterdata_detail.name) {
      return {
        ...msaData.masterdata_detail,
        profile_pic: msaData.masterdata_detail.logo,
        first_name: msaData.masterdata_detail.name,
        email: msaData.masterdata_detail.email,
        contact_number: msaData.masterdata_detail.mobile,
      };
    } else if (msaData?.resource_datail?.user_detail) {
      return {
        ...msaData.resource_datail,
        ...msaData.resource_datail?.user_detail,
      };
    } else if (msaData?.agency_datail?.user_detail) {
      return {
        ...msaData.agency_datail,
        ...msaData.agency_datail.user_detail,
      };
    }
    return {};
  };

  const handleSave = async () => {
    try {
      // Prepare the data to send to API
      const payload = {
        ...msaData,
        // Include all the fields that can be edited
        name: msaData.name,
        msa_number: msaData.msa_number,
        msa_type: msaData.msa_type,
        unpsc_code: msaData.unpsc_code,
        gl_account: msaData.gl_account,
        business_unit: msaData.business_unit,
        currency_code: msaData.currency_code,
        budget: msaData.budget,
        tax_service_type: msaData.tax_service_type,
        tax_group: msaData.tax_group,
        savings_percentage: msaData.savings_percentage,
        comments: msaData.comments,
        description: msaData.description,
        start_date: msaData.start_date,
        end_date: msaData.end_date,
        // Add assign MSA fields if needed
        assign_msa_agency: msaData.assign_msa_agency || false,
        assign_msa_resource: msaData.assign_msa_resource || false,
        assign_msa_masterdata: msaData.assign_msa_masterdata || false,
      };

      const response = await Services.updateMSADetail(msaData.slug, payload);

      console.log('response update ', response);

      Alert.alert('Success', 'MSA details updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update MSA details. Please try again.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setMsaData(data);
    setIsEditing(false);
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const onStartDateChange = (event: any, selectedDate: any) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setMsaData({
        ...msaData,
        start_date: selectedDate.toISOString(),
      });
    }
  };

  const onEndDateChange = (event: any, selectedDate: any) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setMsaData({
        ...msaData,
        end_date: selectedDate.toISOString(),
      });
    }
  };

  const openDropdownModal = (type: any) => {
    setDropdownModal({
      visible: true,
      type,
      data: dropdownData[type] || [],
    });
  };

  const selectDropdownItem = (item: any) => {
    const fieldMap = {
      msa_type: 'msa_type',
      unpsc_code: 'unpsc_code',
      gl_account: 'gl_account',
      business_unit: 'business_unit',
      tax_service_type: 'tax_service_type',
      tax_group: 'tax_group',
    };

    setMsaData({
      ...msaData,
      [fieldMap[dropdownModal.type]]: item.id,
    });

    setDropdownModal({
      visible: false,
      type: null,
      data: [],
    });
  };

  const getSelectedValue = (type: any, id: any) => {
    const items = dropdownData[type] || [];
    const selectedItem = items.find((item: any) => item.id === id);
    return selectedItem ? selectedItem.name : 'Select option';
  };

  const renderEditableField = (
    label: any,
    value: any,
    onChange: any,
    key: any,
    placeholder = '',
    keyboardType = 'default',
  ) => {
    return (
      <View style={styles.inputGroup} key={key}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value?.toString() || ''}
          onChangeText={text => onChange(text)}
          placeholder={placeholder}
          editable={isEditing}
          //   keyboardType={keyboardType}
        />
      </View>
    );
  };
  const renderStatusBadge = (status: string) => {
    let backgroundColor, textColor, label;

    switch (status?.toLowerCase()) {
      case 'approved':
        backgroundColor = '#E8F5E9';
        textColor = '#2E7D32';
        label = 'Approved';
        break;

      case 'pending':
      case 'pending_approval':
        backgroundColor = '#FFF8E1';
        textColor = '#F57C00';
        label = 'Pending';
        break;

      case 'rejected':
        backgroundColor = '#FFEBEE';
        textColor = '#D32F2F';
        label = 'Rejected';
        break;

      default:
        backgroundColor = '#F5F5F5';
        textColor = '#616161';
        label = status || 'Unknown';
    }

    return (
      <View
        style={{
          backgroundColor,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: textColor,
            marginRight: 6,
          }}
        />
        <Text style={{color: textColor, fontWeight: '600', fontSize: 12}}>
          {label}
        </Text>
      </View>
    );
  };

  const renderDropdownField = (label: any, type: any, value: any, key: any) => {
    if (isEditing) {
      return (
        <View style={styles.inputGroup} key={key}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => openDropdownModal(type)}>
            <Text style={styles.dropdownButtonText}>
              {getSelectedValue(type, value)}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>
          {getSelectedValue(type, value) || 'N/A'}
        </Text>
      </View>
    );
  };

  const renderDateField = (
    label: any,
    dateString: any,
    onPress: any,
    key: any,
  ) => {
    if (isEditing) {
      return (
        <View style={styles.inputGroup} key={key}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TouchableOpacity onPress={onPress} style={styles.dateInput}>
            <Text>{formatDate(dateString) || 'Select date'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{formatDate(dateString) || 'N/A'}</Text>
      </View>
    );
  };

  const renderDropdownModal = () => (
    <Modal
      visible={dropdownModal.visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() =>
        setDropdownModal({visible: false, type: null, data: []})
      }>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Option</Text>
          <FlatList
            data={dropdownModal.data}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => selectDropdownItem(item)}>
                <Text style={styles.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() =>
              setDropdownModal({visible: false, type: null, data: []})
            }>
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ResourceDetailCard = ({msaData}: any) => {
    const resource = getResourceData(msaData);

    return (
      <ScrollView style={styles.ResourceDetailCardcontainer}>
        {/* Top Card */}
        <View style={styles.card}>
          {/* Profile Pic + Name + Title */}
          <View style={styles.profileSection}>
            <Image
              source={
                resource?.profile_pic
                  ? {uri: resource.profile_pic}
                  : require('../../assets/images/user.png')
              }
              style={styles.profilePic}
            />
            <Text style={styles.name}>
              {resource?.first_name} {resource?.last_name}
            </Text>
            <Text style={styles.title}>{resource?.current_job_title}</Text>
          </View>

          {/* Experience, Rating, Work Rate */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {resource?.total_experience || 0} Years
              </Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {resource?.average_rating || 0}
              </Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>INR ****</Text>
              <Text style={styles.statLabel}>Work Rate</Text>
            </View>
          </View>

          {/* Info List */}
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#555" />
              <Text style={styles.infoText}>
                {resource?.country_name} ({resource?.state_name})
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color="#555" />
              <Text style={styles.infoText}>
                {resource?.currency_detail?.currency}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color="#555" />
              <Text style={styles.infoText}>{resource?.contact_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#555" />
              <Text style={styles.infoText}>{resource?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={18} color="#555" />
              <Text style={styles.infoText}>{resource?.current_job_title}</Text>
            </View>
          </View>
        </View>

        {/* Skills Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {resource?.skill_set_data?.map((skill: any) => (
              <View key={skill.id} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Title and Edit Button */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{msaData.name}</Text>

          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.statusBadge}>
          {renderStatusBadge(msaData.status)}
        </View>

        {/* MSA Details */}
        <View style={styles.detailsContainer}>
          {renderEditableField(
            'MSA Name',
            msaData.name,
            (text: any) => setMsaData({...msaData, name: text}),
            'name',
          )}

          {renderEditableField(
            'Reference Number',
            msaData.msa_number,
            (text: any) => setMsaData({...msaData, msa_number: text}),
            'msa_number',
          )}

          {renderDropdownField(
            'MSA Type',
            'msa_type',
            msaData.msa_type,
            'msa_type',
          )}

          {renderDropdownField(
            'Industry Material Group',
            'unpsc_code',
            msaData.unpsc_code,
            'unpsc_code',
          )}

          {renderDropdownField(
            'Business Unit',
            'business_unit',
            msaData.business_unit,
            'business_unit',
          )}

          {renderDropdownField(
            'GL Account',
            'gl_account',
            msaData.gl_account,
            'gl_account',
          )}

          {/* Assign MSA Section */}
          <Text style={styles.sectionTitle}>ASSIGN MSA</Text>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Switch
                value={msaData.agency !== null} // <-- checked if agency not null
                onValueChange={value =>
                  setMsaData({
                    ...msaData,
                    assign_msa_agency: value,
                    agency: value ? msaData.agency ?? {} : null, // reset if turned off
                  })
                }
                disabled={!isEditing}
              />
              <Text style={styles.checkboxLabel}>MSA For Agency</Text>
            </View>

            <View style={styles.checkboxRow}>
              <Switch
                value={msaData.resource !== null} // <-- checked if resource not null
                onValueChange={value =>
                  setMsaData({
                    ...msaData,
                    assign_msa_resource: value,
                    resource: value ? msaData.resource ?? {} : null,
                  })
                }
                disabled={!isEditing}
              />
              <Text style={styles.checkboxLabel}>MSA For Resource</Text>
            </View>

            <View style={styles.checkboxRow}>
              <Switch
                value={msaData.masterdata !== null} // <-- checked if masterdata not null
                onValueChange={value =>
                  setMsaData({
                    ...msaData,
                    assign_msa_masterdata: value,
                    masterdata: value ? msaData.masterdata ?? {} : null,
                  })
                }
                disabled={!isEditing}
              />
              <Text style={styles.checkboxLabel}>MSA For MasterData</Text>
            </View>
          </View>

          {/* Dates and Budget */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              {renderDateField(
                'Start Date',
                msaData.start_date,
                () => setShowStartDatePicker(true),
                'start_date',
              )}
            </View>
            <View style={styles.halfWidth}>
              {renderDateField(
                'End Date',
                msaData.end_date,
                () => setShowEndDatePicker(true),
                'end_date',
              )}
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              {renderEditableField(
                'Currency',
                msaData.currency_code,
                (text: any) => setMsaData({...msaData, currency_code: text}),
                'currency_code',
              )}
            </View>
            <View style={styles.halfWidth}>
              {renderEditableField(
                'Budget',
                msaData.budget,
                (text: any) => setMsaData({...msaData, budget: text}),
                'budget',
                '',
                'numeric',
              )}
            </View>
          </View>

          {/* Description */}
          {renderEditableField(
            'Description',
            msaData.description,
            (text: any) => setMsaData({...msaData, description: text}),
            'description',
            'Enter MSA description',
          )}

          {/* Tax Information */}
          <Text style={styles.sectionTitle}>Tax Information</Text>

          {renderDropdownField(
            'Service Tax Type',
            'tax_service_type',
            msaData.tax_service_type,
            'tax_service_type',
          )}

          {renderDropdownField(
            'Tax Group',
            'tax_group',
            msaData.tax_group,
            'tax_group',
          )}

          {renderEditableField(
            'Saving Percentage',
            msaData.savings_percentage,
            (text: any) => setMsaData({...msaData, savings_percentage: text}),
            'savings_percentage',
            '',
            'numeric',
          )}

          {/* Comments */}
          {renderEditableField(
            'Comments',
            msaData.comments,
            (text: any) => setMsaData({...msaData, comments: text}),
            'comments',
            'Enter comments',
          )}
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(msaData.start_date || Date.now())}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(msaData.end_date || Date.now())}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        {/* Dropdown Modal */}
        {renderDropdownModal()}
        <View style={styles.sectionTitle}></View>
        <ResourceDetailCard msaData={msaData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ResourceDetailCardcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  orgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orgLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#072188',
  },
  orgSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: '500',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 20,
  },
  editButton: {
    backgroundColor: '#072188',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    display: 'flex',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  thirdWidth: {
    width: '31%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#072188',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 8,
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#072188',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  //     container: {
  //     flex: 1,
  //     backgroundColor: "#fff",
  //     padding: 10,
  //   },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  //   title: {
  //     fontSize: 14,
  //     color: "#666",
  //   },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoList: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
  },
  //   sectionTitle: {
  //     fontSize: 16,
  //     fontWeight: "600",
  //     marginBottom: 8,
  //   },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MSADetailScreen;
