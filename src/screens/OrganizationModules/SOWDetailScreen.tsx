import React, { useState, useEffect } from "react";
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
  Pressable,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Services from "../../Services/services";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const SOWDetailScreen = ({ route }: any) => {
  const { data } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [sowData, setSowData] = useState(data);
  const [refreshing, setRefreshing] = useState(false);
  const [originalSlug, setOriginalSlug] = useState(data.slug);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    account: [],
    cost_center: [],
    sow_type: [],
    tax_group: [],
    unpsc_code: [],
    business_unit: [],
    tax_service_type: [],
  });
  const [dropdownModal, setDropdownModal] = useState({
    visible: false,
    type: null,
    data: [],
  });
  const [sowApprover, setSowApprover] = useState(data.sow_flow === '1' ? 'manual' : 'auto');
  const [modalVisible, setModalVisible] = useState(false);
  const [approversList, setApproversList] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(data.approver_detail || null);
  const [currencies, setCurrencies] = useState([]);

  // const onRefresh = async () => {
  //   try {
  //     setRefreshing(true);
  //     const res = await Services.getSOWDetail(sowData.slug);
  //     if (res.success) {
  //       setSowData(res.data);
  //     } else {
  //       console.log("Refresh error:", res.error);
  //     }
  //   } catch (err) {
  //     console.log("Unexpected refresh error:", err);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await Services.getSOWDetail(sowData.slug);
      if (res.success) {
        setSowData(res.data);
        // Update approver state based on fetched data
        setSowApprover(res.data.sow_flow === '1' ? 'manual' : 'auto');
        setSelectedApprover(res.data.approver_detail || null);
      } else {
        console.log("Refresh error:", res.error);
      }
    } catch (err) {
      console.log("Unexpected refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };
  // Fetch dropdown data from the single API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await Services.getSOWFields();
        if (response.success) {
          setDropdownData(response.data.payload);
        } else {
          Alert.alert("Error", "Failed to fetch dropdown data");
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        Alert.alert("Error", "Failed to fetch dropdown data");
      }
    };

    fetchDropdownData();
  }, []);


  // Fetch currencies
  useEffect(() => {
    const fetchCurrencyDetails = async () => {
      try {
        const response = await Services.getCurrencyDetails();
        if (response.success) {
          setCurrencies(response.data);
        }
      } catch (err) {
        console.error("Error loading currency fields", err);
      }
    };

    fetchCurrencyDetails();
  }, []);

  // Fetch approvers
  useEffect(() => {
    const fetchCoustomApprover = async () => {
      try {
        const data = {
          limit: 10,
          msa: "sow"
        };
        const response = await Services.getApproverCoustom(data);
        if (response.success) {
          setApproversList(response.data || []);
        }
      } catch (err) {
        console.error("Error loading approver", err);
      }
    };
    fetchCoustomApprover();
  }, []);


  const getResourceData = (sowData: any) => {
    if (sowData?.masterdata_detail.name) {
      return {
        ...sowData.masterdata_detail,
        profile_pic: sowData.masterdata_detail.logo,
        first_name: sowData.masterdata_detail.name,
        email: sowData.masterdata_detail.email,
        contact_number: sowData.masterdata_detail.mobile,
      };
    } else if (sowData?.resource_detail?.user_detail) {
      return {
        ...sowData.resource_detail,
        ...sowData.resource_detail?.user_detail,
      };
    } else if (sowData?.agency_datail?.user_detail) {
      return {
        ...sowData.agency_datail,
        ...sowData.agency_datail.user_detail,
      };
    }
    return {};
  };


  const handleSelectApprover = (approver) => {
    setSelectedApprover(approver);
    setSowApprover('manual');
    setModalVisible(false);
  };

  const renderApproverItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.approverItem,
        selectedApprover?.id === item.id && styles.selectedApproverItem
      ]}
      onPress={() => handleSelectApprover(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.first_name?.charAt(0)}{item.last_name?.charAt(0)}
        </Text>
      </View>
      <View style={styles.approverInfo}>
        <Text style={styles.approverName}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.approverDetails}>
          {item.email} | {item.contact_number}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.availableText}>Available</Text>
      </View>
    </TouchableOpacity>
  );


  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Find the actual objects for dropdown values
      const selectedSowType = dropdownData.sow_type.find(item => item.id === sowData.sow_type);
      const selectedTaxGroup = dropdownData.tax_group.find(item => item.id === sowData.tax_group);
      const selectedAccount = dropdownData.account.find(item => item.id === sowData.account);
      const selectedCostCenter = dropdownData.cost_center.find(item => item.id === sowData.cost_center);
      const selectedCurrency = currencies.find(item => item.id === sowData.currency);

      // Get resource ID from the appropriate source
      const resourceId = sowData.resource ||
        sowData.resource_detail?.id ||
        sowData.masterdata_detail?.id ||
        sowData.agency_datail?.id;

      // Append all fields in the correct format
      formData.append('msa', sowData.msa || '');
      formData.append('title', sowData.title || '');
      formData.append('sow_type', selectedSowType?.id || '');
      formData.append("sow_number", sowData.sow_number || "");

      // Format dates properly
      const formatDateForAPI = (dateString: any) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} 00:00:00`;
      };

      formData.append('start_date', formatDateForAPI(sowData.start_date));
      formData.append('end_date', formatDateForAPI(sowData.end_date));

      // Resource handling
      if (resourceId) {
        formData.append('resource', resourceId);
      }

      // Timesheet type (is_hour vs is_day) - NEW FIELD
      formData.append('is_hour', sowData.is_hour ? 'true' : 'false');
      formData.append('is_day', sowData.is_day ? 'true' : 'false');

      // Currency - using ID instead of code - UPDATED
      formData.append('currency', selectedCurrency?.id || sowData.currency || '');

      // Pricing information
      formData.append('work_rate', String(sowData.work_rate || 0));
      formData.append('work_quantity', String(sowData.work_quantity || 0));
      formData.append('amount', String(sowData.amount || 0));

      // Tax information
      formData.append('tax_group', selectedTaxGroup?.id || '');
      formData.append('tax_percent', String(sowData.tax_percent || 0));

      // Accounting
      formData.append('account', selectedAccount?.id || '');
      formData.append('cost_center', selectedCostCenter?.id || '');

      // Additional information
      formData.append('description', sowData.description || '');
      formData.append('comments', sowData.comments || '');

      // Status and approval - preserve existing values
      formData.append('status', sowData.status || 'pending_approval');

      // Approver selection - NEW FIELDS
      if (sowApprover === 'manual' && selectedApprover) {
        formData.append('approver', selectedApprover.id);
        formData.append('sow_flow', '1'); // Manual approval flow
      } else {
        formData.append('sow_flow', '2'); // Automatic approval flow
      }

      // Final calculated amount
      formData.append('grand_total', String(sowData.grand_total || 0));

      console.log("FormData contents:");
      for (const [key, value] of (formData as any)._parts) {
        console.log(key, value);
      }

      const response = await Services.updateSOWDetail(originalSlug, formData);

      console.log("Update response:", response);

      if (response.success) {
        Alert.alert("Success", "SOW details updated successfully!");
        setIsEditing(false);
        onRefresh();
      } else {
        Alert.alert("Error", response.error || "Failed to update SOW details");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update SOW details. Please try again.");
      console.error("Update error:", error);
    }
  };


  const handleCancel = () => {
    // Reset to original data
    setSowData(data);
    setIsEditing(false);
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const onStartDateChange = (event: any, selectedDate: any) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSowData({
        ...sowData,
        start_date: selectedDate.toISOString(),
      });
    }
  };

  const onEndDateChange = (event: any, selectedDate: any) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSowData({
        ...sowData,
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
      sow_type: "sow_type",
      unpsc_code: "unpsc_code",
      account: "account",
      business_unit: "business_unit",
      tax_service_type: "tax_service_type",
      tax_group: "tax_group",
    };

    setSowData({
      ...sowData,
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
    return selectedItem ? selectedItem.name : "Select option";
  };

  const renderEditableField = (label: any, value: any, onChange: any, key: any, placeholder = "", keyboardType = "default") => {
    return (
      <View style={styles.inputGroup} key={key}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value?.toString() || ""}
          onChangeText={(text) => onChange(text)}
          placeholder={placeholder}
          editable={isEditing}
        //   keyboardType={keyboardType}
        />
      </View>
    );
  };


  // Add the Work Timesheet radio buttons section
  const renderWorkTimesheetField = () => {
    if (isEditing) {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Work Timesheet *</Text>
          <View style={styles.radioContainer2}>
            <TouchableOpacity
              style={[styles.radioOption2, sowData.is_day && styles.radioSelected]}
              onPress={() => setSowData({ ...sowData, is_day: true, is_hour: false })}
            >
              <Text style={styles.radioText}>Day</Text>
              <View style={styles.radioCircle}>
                {sowData.is_day && <View style={styles.radioInnerCircle} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioOption2, sowData.is_hour && styles.radioSelected]}
              onPress={() => setSowData({ ...sowData, is_hour: true, is_day: false })}
            >
              <Text style={styles.radioText}>Hour</Text>
              <View style={styles.radioCircle}>
                {sowData.is_hour && <View style={styles.radioInnerCircle} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Work Timesheet</Text>
        <Text style={styles.fieldValue}>
          {sowData.is_day ? 'Day' : sowData.is_hour ? 'Hour' : 'N/A'}
        </Text>
      </View>
    );
  };

  // Add the SOW Approver selection section
  const renderSOWApproverField = () => {
    if (isEditing) {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SOW Approver *</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioOption, sowApprover === 'manual' && styles.radioSelected]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.radioText}>Manual Approval</Text>
              <View style={styles.radioCircle}>
                {sowApprover === 'manual' && <View style={styles.radioInnerCircle} />}
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[styles.radioOption, sowApprover === 'auto' && styles.radioSelected]}
              onPress={() => {
                setSowApprover('auto');
                setSelectedApprover(null);
              }}
            >
              <Text style={styles.radioText}>Automatic Approval</Text>
              <View style={styles.radioCircle}>
                {sowApprover === 'auto' && <View style={styles.radioInnerCircle} />}
              </View>
            </TouchableOpacity> */}
          </View>

          {/* Show selected approver details */}
          {selectedApprover && sowApprover === 'manual' && (
            <View style={styles.approverSection}>
              <View style={styles.selectedApproverContainer}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>
                    {selectedApprover.first_name?.charAt(0)}
                    {selectedApprover.last_name?.charAt(0)}
                  </Text>
                </View>
                <View style={styles.approverInfo}>
                  <Text style={styles.approverLabel}>
                    {selectedApprover.first_name} {selectedApprover.last_name}
                  </Text>
                  <Text style={styles.approverEmail}>{selectedApprover.email}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>SOW Approver</Text>
        <Text style={styles.fieldValue}>
          {sowApprover === 'manual' && selectedApprover
            ? `${selectedApprover.first_name} ${selectedApprover.last_name}`
            : 'Automatic Approval'
          }
        </Text>
      </View>
    );
  };

  // Add the approver selection modal
  const renderApproverModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Approver</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={approversList}
            renderItem={renderApproverItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.approversList}
          />
        </View>
      </View>
    </Modal>
  );





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
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: textColor,
            marginRight: 6,
          }}
        />
        <Text style={{ color: textColor, fontWeight: '600', fontSize: 12 }}>
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
            onPress={() => openDropdownModal(type)}
          >
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
          {getSelectedValue(type, value) || "N/A"}
        </Text>
      </View>
    );
  };

  const renderDateField = (label: any, dateString: any, onPress: any, key: any) => {
    if (isEditing) {
      return (
        <View style={styles.inputGroup} key={key}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TouchableOpacity onPress={onPress} style={styles.dateInput}>
            <Text>{formatDate(dateString) || "Select date"}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{formatDate(dateString) || "N/A"}</Text>
      </View>
    );
  };

  const renderDropdownModal = () => (
    <Modal
      visible={dropdownModal.visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setDropdownModal({ visible: false, type: null, data: [] })}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Option</Text>
          <FlatList
            data={dropdownModal.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => selectDropdownItem(item)}
              >
                <Text style={styles.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setDropdownModal({ visible: false, type: null, data: [] })}
          >
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );


  const ResourceDetailCard = ({ sowData }: any) => {
    const resource = getResourceData(sowData);

    return (
      <ScrollView style={styles.ResourceDetailCardcontainer}>
        {/* Top Card */}
        <View style={styles.card}>
          {/* Profile Pic + Name + Title */}
          <View style={styles.profileSection}>
            <Image
              source={
                resource?.profile_pic
                  ? { uri: resource.profile_pic }
                  : require("../../assets/images/user.png")
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
              <Text style={styles.statValue}>{resource?.total_experience || 0} Years</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{resource?.average_rating || 0}</Text>
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
              <Text style={styles.infoText}>{resource?.currency_detail?.currency}</Text>
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
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>

        {/* Title and Edit Button */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{sowData.title}</Text>

          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.statusBadge}>

          {renderStatusBadge(sowData.status)}


        </View>

        {/* MSA Details */}
        <View style={styles.detailsContainer}>
          {renderEditableField(
            "SOW Name",
            sowData.title,
            (text: any) => setSowData({ ...sowData, title: text }),
            "name"
          )}

          {renderEditableField(
            "Reference Number",
            sowData.sow_number,
            (text: any) => setSowData({ ...sowData, sow_number: text }),
            "msa_number"
          )}

          {renderDropdownField(
            "SOW Type",
            "sow_type",
            sowData.sow_type,
            "sow_type"
          )}

          {/* Dates and Budget */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              {renderDateField(
                "Start Date",
                sowData.start_date,
                () => setShowStartDatePicker(true),
                "start_date"
              )}
            </View>
            <View style={styles.halfWidth}>
              {renderDateField(
                "End Date",
                sowData.end_date,
                () => setShowEndDatePicker(true),
                "end_date"
              )}
            </View>
          </View>
          <Text style={styles.sectionTitle}>Work Timesheet</Text>
          <View style={styles.checkboxRow}>

            {/* <Text style={styles.checkboxLabel}>Is Hourly</Text>
  <Switch
    value={sowData.is_hour}
    onValueChange={(value) => setSowData({...sowData, is_hour: value})}
    disabled={!isEditing}
  /> */}

            {renderWorkTimesheetField()}
          </View>
          <View style={styles.rowContainer}>

            <View style={styles.halfWidth}>
              {renderEditableField(
                "Currency",
                sowData.currency_detail?.currency,
                (text: any) => setSowData({ ...sowData, currency: text }),
                "currency_code"
              )}
            </View>
            <View style={styles.halfWidth}>
              {renderEditableField(
                "Rate",
                sowData.work_rate,
                (text: any) => setSowData({ ...sowData, work_rate: text }),
                "budget",
                "",
                "numeric"
              )}
            </View>

          </View>

          <View style={styles.rowContainer}>

            <View style={styles.halfWidth}>
              {renderEditableField(
                "Amount ",
                sowData.amount,
                (text: any) => setSowData({ ...sowData, budget: text }),
                "amount",
                "",
                "numeric"
              )}
            </View>

            <View style={styles.halfWidth}>
              {renderEditableField(
                "Work Quantity ",
                sowData.work_quantity,
                (text: any) => setSowData({ ...sowData, budget: text }),
                "work_quantity",
                "",
                "numeric"
              )}
            </View>

          </View>

          {/* Description */}
          {renderEditableField(
            "Description",
            sowData.description,
            (text: any) => setSowData({ ...sowData, description: text }),
            "description",
            "Enter MSA description"
          )}

          {/* Tax Information */}
          <Text style={styles.sectionTitle}>Tax Information</Text>
          {renderEditableField(
            "Tax Percent",
            sowData.tax_percent,
            (text: any) => setSowData({ ...sowData, tax_percent: text }),
            "tax_percent",
            "",
            "numeric"
          )}

          {renderDropdownField(
            "Tax Group",
            "tax_group",
            sowData.tax_group,
            "tax_group"
          )}
          {renderDropdownField(
            "GL Account",
            "account",
            sowData.account,
            "account"
          )}
          {/* {renderEditableField(
            "Saving Percentage",
            sowData.savings_percentage,
            (text:any) => setSowData({...sowData, savings_percentage: text}),
            "savings_percentage",
            "",
            "numeric"
          )} */}

          {renderDropdownField(
            "Cost Center ",
            "cost_center",
            sowData.cost_center,
            "cost_center"
          )}
          {renderEditableField(
            "Grand Total ",
            sowData.grand_total,
            (text: any) => setSowData({ ...sowData, grand_total: text }),
            "grand_total",
            "",
            "numeric"
          )}
          {/* Comments */}
          {renderEditableField(
            "Comments",
            sowData.comments,
            (text: any) => setSowData({ ...sowData, comments: text }),
            "comments",
            "Enter comments"
          )}
          {renderSOWApproverField()}
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(sowData.start_date || Date.now())}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(sowData.end_date || Date.now())}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        {/* Dropdown Modal */}
        {renderDropdownModal()}
        {renderApproverModal()}
        <View style={styles.sectionTitle}></View>
        <ResourceDetailCard sowData={sowData} />




      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ResourceDetailCardcontainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  orgInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  orgLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#072188",
  },
  orgSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#856404",
    fontSize: 12,
    fontWeight: "500",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    backgroundColor: "#072188",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    display: "flex",

  },
  editButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  editActions: {
    flexDirection: "row",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  detailsContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 16,

  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfWidth: {
    width: "48%",
  },
  thirdWidth: {
    width: "31%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
    color: "#072188",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingBottom: 8,
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxRow: {

    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#072188",
    borderRadius: 5,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  //     container: {
  //     flex: 1,
  //     backgroundColor: "#fff",
  //     padding: 10,
  //   },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  //   title: {
  //     fontSize: 14,
  //     color: "#666",
  //   },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoList: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
  //   sectionTitle: {
  //     fontSize: 16,
  //     fontWeight: "600",
  //     marginBottom: 8,
  //   },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  skillText: {
    fontSize: 12,
    color: "#333",
  },
  approverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedApproverItem: {
    backgroundColor: '#f0f8ff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0033CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  approverInfo: {
    flex: 1,
  },
  approverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  approverDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  availableText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  approverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  selectedApproverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0033CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarSmallText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  approverLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  approverEmail: {
    fontSize: 12,
    color: '#666',
  },
  changeText: {
    color: '#0033CC',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // modalContent: {
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   padding: 20,
  //   width: '90%',
  //   maxHeight: '80%',
  // },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  approversList: {
    maxHeight: 400,
  },
  radioContainer: {
    marginVertical: 8,


  },
  radioContainer2: {
    marginVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',


  },

  radioOption2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    //  width: width * 0.45 - 12,
    width: "48.5%",
    borderWidth: 1,
    borderColor: '#ccc',

  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  radioSelected: {
    borderColor: '#000078',
    backgroundColor: '#f0f5ff',
  },
  radioText: {
    fontSize: 14,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000078',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000078',
  },
});

export default SOWDetailScreen;