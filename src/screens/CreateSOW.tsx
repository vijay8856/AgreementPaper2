import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import Services from '../Services/services';
import {ActivityIndicator} from 'react-native-paper';
import {FlatList} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import DatePickerSheet from '../components/DatePickerSheet';
import ApprovalModalSOW from '../components/Modals/ApprovalModalSOW';
import IOSPickerModal from '../components/Modals/IOSPickerModal';

type DropdownItem = {
  id: string;
  name: string;
};

type SowFieldsType = {
  cost_center: DropdownItem[];
  account: DropdownItem[];
  tax_group: DropdownItem[];
  sow_type: DropdownItem[];
};

type ValidationErrors = {
  msa?: string;
  title?: string;
  sowType?: string;
  startDate?: string;
  endDate?: string;
  resourceType?: string;
  workTimesheet?: string;
  currency?: string;
  rate?: string;
  quantity?: string;
  taxGroup?: string;
  taxPercentage?: string;
  glAccount?: string;
  costCenter?: string;
  description?: string;
  comments?: string;
  sowApprover?: string;
  selectedApprover?: string;
};

const CreateSOW = ({navigation}: any) => {
  // Form state
  const [msa, setMsa] = useState('Master Agreement for Contractor');
  const [title, setTitle] = useState('');
  const [sowNumber, setSowNumber] = useState('');
  const [sowType, setSowType] = useState<any>(null);
  console.log('type', sowType);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [workTimesheet, setWorkTimesheet] = useState('Day');
  const [currency, setCurrency] = useState<any>(null);

  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState(0);
  const [taxGroup, setTaxGroup] = useState<any>(null);

  const [taxPercentage, setTaxPercentage] = useState('');
  const [glAccount, setGlAccount] = useState<any>(null);

  const [costCenter, setCostCenter] = useState<any>(null);
  console.log('gl', glAccount);

  const [grandTotal, setGrandTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [sowApprover, setSowApprover] = useState('');
  const [approver, setApprover] = useState('Manoj Patidar');
  const [msaList, setMsaList] = useState<any[]>([]);
  const [sowFileds, setSowFileds] = useState<SowFieldsType>({
    cost_center: [],
    account: [],
    tax_group: [],
    sow_type: [],
  });
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsa, setSelectedMsa] = useState<any>(null);

  const [resourceType, setResourceType] = useState<string>('');
  // const [approverCoustom, setApproverCoustom] = useState<any>(null);
  console.log('msaList', msaList);
  console.log('resourceType', resourceType);
  console.log('selectedMsa', selectedMsa);
  console.log('currencies', currencies);

  // Validation state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [approversList, setApproversList] = useState<any[]>([]);
  const [selectedApprover, setSelectedApprover] = useState<any>(null);
  const [approverLoading, setApproverLoading] = useState(false);
  const [sowApproverModalVisible, setSowApproverModalVisible] = useState(false);
  const [showTaxGroupPicker, setShowTaxGroupPicker] = useState(false);
  const [showGlAccountPicker, setShowGlAccountPicker] = useState(false);
  const [showCostCenterPicker, setShowCostCenterPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showSowTypePicker, setShowSowTypePicker] = useState(false);
  const [showMsaPicker, setShowMsaPicker] = useState(false);
  const openApproverModal = () => {
    setSowApproverModalVisible(true);
  };

  useEffect(() => {
    if (msaList.length > 0 && !selectedMsa) {
      setSelectedMsa(msaList[0]); // ✅ FULL OBJECT
    }
  }, [msaList]);

  const handleMsaChange = (id: number) => {
    const msaObj = msaList.find(item => item.id === id) || null;
    setSelectedMsa(msaObj);

    if (msaObj?.resource_datail?.user_detail) {
      setResourceType('sow');
    } else {
      setResourceType('');
    }

    setErrors(prev => ({...prev, msa: undefined}));
  };

  const handleSelectApprover = approver => {
    setSelectedApprover(approver);
    setSowApprover('manual');
    setModalVisible(false);

    // Clear error when approver is selected
    if (errors.selectedApprover) {
      setErrors(prev => ({...prev, selectedApprover: undefined}));
    }
  };

  // Calculate amount and grand total
  useEffect(() => {
    const calculatedAmount = parseFloat(rate || 0) * parseFloat(quantity || 0);
    setAmount(calculatedAmount);

    const taxAmount = calculatedAmount * (parseFloat(taxPercentage || 0) / 100);
    setGrandTotal(calculatedAmount + taxAmount);
  }, [rate, quantity, taxPercentage]);

  // Date picker handlers
  const onStartDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }

    if (selectedDate) {
      setStartDate(selectedDate);

      // iOS: close after selection
      if (Platform.OS === 'ios') {
        setShowStartDatePicker(false);
      }

      if (errors.startDate) {
        setErrors(prev => ({...prev, startDate: undefined}));
      }
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
      // Clear error when end date is selected
      if (errors.endDate) {
        setErrors(prev => ({...prev, endDate: undefined}));
      }
    }
  };

  // Format date for display
  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Validation functions
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'msa':
        return !selectedMsa ? 'Master Service Agreement is required' : '';
      case 'title':
        return !value?.trim() ? 'Title is required' : '';
      case 'sowType':
        return !value ? 'SOW Type is required' : '';
      case 'startDate':
        return !value ? 'Start Date is required' : '';
      case 'endDate':
        if (!value) return 'End Date is required';
        if (value < startDate) return 'End Date cannot be before Start Date';
        return '';
      case 'resourceType':
        return !value ? 'Resource selection is required' : '';
      case 'workTimesheet':
        return !value ? 'Work Timesheet is required' : '';
      case 'currency':
        return !value?.id ? 'Currency is required' : '';
      case 'rate':
        if (!value) return 'Rate is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) <= 0)
          return 'Rate must be a positive number';
        return '';
      case 'quantity':
        if (!value) return 'Quantity is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) <= 0)
          return 'Quantity must be a positive number';
        return '';
      case 'taxGroup':
        return !value?.id ? 'Tax Group is required' : '';
      case 'taxPercentage':
        if (!value) return 'Tax Percentage is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0)
          return 'Tax Percentage must be a non-negative number';
        return '';
      case 'glAccount':
        return !value?.id ? 'GL Account is required' : '';
      case 'costCenter':
        return !value?.id ? 'Cost Center is required' : '';
      case 'description':
        return !value?.trim() ? 'Description is required' : '';
      case 'comments':
        return !value?.trim() ? 'Comments are required' : '';
      case 'sowApprover':
        return !value ? 'SOW Approver selection is required' : '';
      case 'selectedApprover':
        return sowApprover === 'manual' && !selectedApprover
          ? 'Approver must be selected for manual approval'
          : '';

      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({...prev, [field]: true}));

    let error = '';
    switch (field) {
      case 'msa':
        error = validateField('msa', selectedMsa);
        break;
      case 'title':
        error = validateField('title', title);
        break;
      case 'sowType':
        error = validateField('sowType', sowType);
        break;
      case 'startDate':
        error = validateField('startDate', startDate);
        break;
      case 'endDate':
        error = validateField('endDate', endDate);
        break;
      case 'resourceType':
        error = validateField('resourceType', resourceType);
        break;
      case 'workTimesheet':
        error = validateField('workTimesheet', workTimesheet);
        break;
      case 'currency':
        error = validateField('currency', currency);
        break;
      case 'rate':
        error = validateField('rate', rate);
        break;
      case 'quantity':
        error = validateField('quantity', quantity);
        break;
      case 'taxGroup':
        error = validateField('taxGroup', taxGroup);
        break;
      case 'taxPercentage':
        error = validateField('taxPercentage', taxPercentage);
        break;
      case 'glAccount':
        error = validateField('glAccount', glAccount);
        break;
      case 'costCenter':
        error = validateField('costCenter', costCenter);
        break;
      case 'description':
        error = validateField('description', description);
        break;
      case 'comments':
        error = validateField('comments', comments);
        break;
      case 'sowApprover':
        error = validateField('sowApprover', sowApprover);
        break;
      case 'selectedApprover':
        error = validateField('selectedApprover', selectedApprover);
        break;
    }

    if (error) {
      setErrors(prev => ({...prev, [field]: error}));
    } else {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.msa = validateField('msa', selectedMsa);
    newErrors.title = validateField('title', title);
    newErrors.sowType = validateField('sowType', sowType);
    newErrors.startDate = validateField('startDate', startDate);
    newErrors.endDate = validateField('endDate', endDate);
    newErrors.resourceType = validateField('resourceType', resourceType);
    newErrors.workTimesheet = validateField('workTimesheet', workTimesheet);
    newErrors.currency = validateField('currency', currency);
    newErrors.rate = validateField('rate', rate);
    newErrors.quantity = validateField('quantity', quantity);
    newErrors.taxGroup = validateField('taxGroup', taxGroup);
    newErrors.taxPercentage = validateField('taxPercentage', taxPercentage);
    newErrors.glAccount = validateField('glAccount', glAccount);
    newErrors.costCenter = validateField('costCenter', costCenter);
    newErrors.description = validateField('description', description);
    newErrors.comments = validateField('comments', comments);
    newErrors.sowApprover = validateField('sowApprover', sowApprover);
    newErrors.selectedApprover = validateField(
      'selectedApprover',
      selectedApprover,
    );

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== ''),
    );

    setErrors(filteredErrors);
    setTouched({
      msa: true,
      title: true,
      sowType: true,
      startDate: true,
      endDate: true,
      resourceType: true,
      workTimesheet: true,
      currency: true,
      rate: true,
      quantity: true,
      taxGroup: true,
      taxPercentage: true,
      glAccount: true,
      costCenter: true,
      description: true,
      comments: true,
      sowApprover: true,
      selectedApprover: true,
    });
    console.log('errors', filteredErrors);

    return Object.keys(filteredErrors).length === 0;
  };

  // --- Fetch MSA List ---
  useEffect(() => {
    const fetchMSA = async () => {
      try {
        setLoading(true);
        const data = {
          limit: 30,
          offset: 0,
        };

        const response = await Services.getMSAAllList(data);
        console.log('responsess', response);

        // ✅ Correctly accessing results
        let array = response?.data?.results;
        let newArray = [];
        console.log('array', array);

        for (let i = 0; i < array?.length; i++) {
          if (
            array[i]?.resource &&
            array[i]?.resource_datail?.id &&
            array[i]?.resource === array[i]?.resource_datail?.id
          ) {
            newArray.push(array[i]);
          }
        }
        setMsaList(array);
        setLoading(false);

        console.log('new array', newArray);
      } catch (error) {
        console.error('Error fetching MSA List:', error);
      }
    };

    fetchMSA();
  }, []);

  useEffect(() => {
    const fetchSOWFields = async () => {
      try {
        const response = await Services.getSOWFields();
        console.log('response fetchSOWFields :', response);

        const payload = response?.data?.payload || {};
        setSowFileds(payload);

        // ✅ Default select first option if available
        if (payload?.sow_type?.length > 0) {
          setSowType(payload.sow_type[0].name);
        }
      } catch (error) {
        console.error('Error fetching SOW details:', error);
      }
    };

    fetchSOWFields();
  }, []);

  useEffect(() => {
    const fetchCurrencyDetails = async () => {
      try {
        const response = await Services.getCurrencyDetails();
        if (response.success) {
          setCurrencies(response.data);
        }
      } catch (err) {
        console.error('Error loading dropdown fields', err);
        Alert.alert('Error', 'Failed to load form fields');
      } finally {
        // setLoading(false);
      }
    };

    fetchCurrencyDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0033CC" />
      </View>
    );
  }

  const renderApproverItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.approverItem,
        selectedApprover?.id === item.id && styles.selectedApproverItem,
      ]}
      onPress={() => handleSelectApprover(item)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.first_name?.charAt(0)}
          {item.last_name?.charAt(0)}
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

  //     const handleSubmit = async () => {
  //         if (!validateForm()) {
  //             Alert.alert('Validation Error', 'Please fix all errors before submitting');
  //             return;
  //         }
  //   if (!selectedMsa?.id) {
  //     Alert.alert('Error', 'Master Service Agreement is missing');
  //     return;
  //   }

  // const selectedSowType = sowType;

  //   console.log("sow type",selectedSowType);
  //   console.log("sow type2    ",sowFileds);
  //   console.log("sow type3    ",sowType);

  //   if (!selectedSowType?.id) {
  //     Alert.alert('Error', 'SOW Type is missing');
  //     return;
  //   }

  //   if (!currency?.id) {
  //     Alert.alert('Error', 'Currency is missing');
  //     return;
  //   }

  //   if (!taxGroup?.id || !glAccount?.id || !costCenter?.id) {
  //     Alert.alert('Error', 'Accounting fields are missing');
  //     return;
  //   }
  //         try {
  //             // Find the actual objects for dropdown values
  //             const selectedSowType = sowFileds.sow_type.find(item => item.name === sowType);

  //             const selectedCurrency = currencies.find(item => item.currency === currency);
  //             const selectedTaxGroup = taxGroup;
  //             const selectedAccount = glAccount;
  //             const selectedCostCenter = costCenter;

  //             // Prepare FormData for API
  //             const formData = new FormData();

  //             // Add all required fields
  //             formData.append('msa', selectedMsa.id);
  //             formData.append('title', title);
  //             formData.append('sow_number', sowNumber);
  //                  formData.append('sow_type', selectedSowType.id);
  //             formData.append('start_date', formatDateForAPI(startDate));
  //             formData.append('end_date', formatDateForAPI(endDate));

  //             // Resource handling
  //             if (resourceType === 'sow') {
  //                 if (selectedMsa?.resource_datail?.id) {
  //                     formData.append('resource', selectedMsa.resource_datail.id);
  //                 } else {
  //                     Alert.alert('Error', 'Please select a resource');
  //                     return;
  //                 }
  //             }
  //             else if (resourceType === 'agency') {
  //                 const agencyId = selectedMsa?.agency_datail?.id;

  //                 if (agencyId) {
  //                     formData.append('agency', agencyId);
  //                 } else {
  //                     Alert.alert('Error', 'Please select an agency');
  //                     return;
  //                 }
  //             }

  //             // Timesheet type (is_hour vs is_day)
  //             formData.append('is_hour', workTimesheet === 'Hour');
  //             formData.append('is_day', workTimesheet === 'Day');

  //             // Currency and pricing
  //             formData.append('currency', selectedCurrency.id);
  //             formData.append('work_rate', parseFloat(rate));
  //             formData.append('work_quantity', parseFloat(quantity));
  //             formData.append('amount', amount);

  //             // Tax information
  //             formData.append('tax_group', selectedTaxGroup.id);
  //             formData.append('tax_percent', parseFloat(taxPercentage || '0'));

  //             // Accounting
  //             formData.append('account', selectedAccount.id);
  //             formData.append('cost_center', selectedCostCenter.id);

  //             // Additional information
  //             formData.append('description', description);
  //             formData.append('comments', comments);
  //             formData.append('sow_flow', '1');

  //             // Status and approval
  //             formData.append('status', 'pending_approval');

  //             // Handle approver based on selection
  //             if (sowApprover === 'manual' && selectedApprover) {
  //                 formData.append('approver', selectedApprover.id);
  //             } else if (sowApprover === 'auto') {
  //                 // For automatic approval, you might need to set a different value or leave it empty
  //                 // Adjust this based on your API requirements
  //                 formData.append('approver', 'auto');
  //             }

  //             // Final calculated amount
  //             formData.append('grand_total', grandTotal);

  //             console.log('Form data to submit:', formData);

  //             // Call the API
  //             const result = await Services.createSOW(formData);

  //             if (result.success) {
  //                 Alert.alert('Success', 'SOW created successfully!');
  //                 navigation.goBack();
  //             } else {
  //                 Alert.alert('Error', result.error?.message || 'Failed to create SOW');
  //             }
  //         } catch (error) {
  //             console.error('Error submitting form:', error);
  //             Alert.alert('Error', 'An unexpected error occurred');
  //         }
  //     };
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix all errors before submitting',
      );
      return;
    }

    if (!selectedMsa?.id) {
      Alert.alert('Error', 'Master Service Agreement is missing');
      return;
    }

    const selectedSowType = sowType;

    if (!selectedSowType?.id) {
      Alert.alert('Error', 'SOW Type is missing');
      return;
    }

    if (!currency?.id) {
      Alert.alert('Error', 'Currency is missing');
      return;
    }

    if (!taxGroup?.id || !glAccount?.id || !costCenter?.id) {
      Alert.alert('Error', 'Accounting fields are missing');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('msa', selectedMsa.id);
      formData.append('title', title);
      formData.append('sow_number', sowNumber);
      formData.append('sow_type', selectedSowType.id);
      formData.append('start_date', formatDateForAPI(startDate));
      formData.append('end_date', formatDateForAPI(endDate));

      // Resource
      if (resourceType === 'sow') {
        if (!selectedMsa?.resource_datail?.id) {
          Alert.alert('Error', 'Please select a resource');
          return;
        }
        formData.append('resource', selectedMsa.resource_datail.id);
      }

      if (resourceType === 'agency') {
        if (!selectedMsa?.agency_datail?.id) {
          Alert.alert('Error', 'Please select an agency');
          return;
        }
        formData.append('agency', selectedMsa.agency_datail.id);
      }

      // Timesheet
      formData.append('is_hour', workTimesheet === 'Hour');
      formData.append('is_day', workTimesheet === 'Day');

      // Pricing
      formData.append('currency', currency.id);
      formData.append('work_rate', parseFloat(rate));
      formData.append('work_quantity', parseFloat(quantity));
      formData.append('amount', amount);

      // Tax & accounting
      formData.append('tax_group', taxGroup.id);
      formData.append('tax_percent', parseFloat(taxPercentage || '0'));
      formData.append('account', glAccount.id);
      formData.append('cost_center', costCenter.id);

      // Extra
      formData.append('description', description);
      formData.append('comments', comments);
      formData.append('sow_flow', '1');
      formData.append('status', 'pending_approval');
      formData.append('grand_total', grandTotal);

      if (sowApprover === 'manual' && selectedApprover?.id) {
        formData.append('approver', selectedApprover.id);
      }

      const result = await Services.createSOW(formData);

      if (result.success) {
        Alert.alert('Success', 'SOW created successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to create SOW');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  const clearError = (field: string) => {
    setErrors(prev => {
      const copy = {...prev};
      delete copy[field];
      return copy;
    });
  };

  const formatDateForAPI = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 00:00:00`;
  };
  const shouldShowError = (field: string) => touched[field] && errors[field];

  const handleSowApproverSelect = (approver: any) => {
    setSelectedApprover(approver); // ✅ FIX
    setSowApprover('manual');
    setSowApproverModalVisible(false);

    setErrors(prev => ({
      ...prev,
      selectedApprover: undefined,
      sowApprover: undefined,
    }));
  };
  const getInitials = (first = '', last = '') => {
    return (
      (first.charAt(0) || '').toUpperCase() +
      (last.charAt(0) || '').toUpperCase()
    );
  };

  const getAgencyInitials = (name = '') => {
    const words = name.split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <ScrollView
            contentContainerStyle={{padding: 16}}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Add Statement of Work</Text>
            <View style={styles.column}>
              <Text style={styles.label}>Master Service Agreement *</Text>

              {Platform.OS === 'ios' ? (
                <>
                  {/* iOS Touchable */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.input,
                      styles.iosPickerInput,
                      shouldShowError('msa') && styles.errorBorder,
                    ]}
                    onPress={() => {
                      if (msaList.length > 0) {
                        setShowMsaPicker(true);
                      }
                    }}>
                    {msaList.length === 0 ? (
                      <ActivityIndicator size="small" color="#007bff" />
                    ) : (
                      <Text style={styles.iosPickerText}>
                        {selectedMsa?.name || 'Select MSA'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <IOSPickerModal
                    visible={showMsaPicker}
                    title="Select Master Service Agreement"
                    data={msaList}
                    selectedValue={selectedMsa?.id}
                    onSelect={(item: any) => {
                      handleMsaChange(item.id);
                      handleBlur('msa');
                    }}
                    onClose={() => setShowMsaPicker(false)}
                  />

                  {shouldShowError('msa') && (
                    <Text style={styles.errorText}>{errors.msa}</Text>
                  )}
                </>
              ) : (
                <>
                  <View
                    style={[
                      styles.pickerContainer,
                      shouldShowError('msa') && styles.errorBorder,
                    ]}>
                    {msaList.length === 0 ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 48,
                        }}>
                        <ActivityIndicator size="small" color="#007bff" />
                      </View>
                    ) : (
                      <Picker
                        style={styles.picker}
                        selectedValue={selectedMsa?.id || ''}
                        onValueChange={value => {
                          handleMsaChange(value);
                          // handleBlur('msa');
                          clearError('msa');
                        }}
                        mode="dropdown">
                        <Picker.Item
                          label="Select MSA"
                          value=""
                          color="#d6d7d9ff"
                        />
                        {msaList.map(item => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.id}
                            color="#d3d5d7ff"
                          />
                        ))}
                      </Picker>
                    )}
                  </View>

                  {shouldShowError('msa') && (
                    <Text style={styles.errorText}>{errors.msa}</Text>
                  )}
                </>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>STATEMENT OF WORK DETAILS</Text>

              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[
                  styles.input,
                  shouldShowError('title') && styles.errorBorder,
                ]}
                placeholder="ENTER TITLE"
                placeholderTextColor={'black'}
                value={title}
                onChangeText={setTitle}
                onBlur={() => handleBlur('title')}
              />
              {shouldShowError('title') && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}

              <Text style={styles.label}>Statement of Work Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter number"
                placeholderTextColor={'black'}
                value={sowNumber}
                onChangeText={setSowNumber}
              />

              <Text style={styles.addSOWText}>Add SOW Work</Text>

              <View style={styles.row}>
                {Platform.OS === 'ios' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>SOW Type *</Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.input,
                        styles.iosPickerInput,
                        shouldShowError('sowType') && styles.errorBorder,
                      ]}
                      onPress={() => setShowSowTypePicker(true)}>
                      <Text style={styles.iosPickerText}>
                        {sowType?.name || 'Select SOW Type'}
                      </Text>
                    </TouchableOpacity>

                    <IOSPickerModal
                      visible={showSowTypePicker}
                      title="Select SOW Type"
                      data={sowFileds?.sow_type || []}
                      selectedValue={sowType}
                      onSelect={(item: any) => {
                        setSowType(item);
                        clearError('sowType');
                      }}
                      onClose={() => setShowSowTypePicker(false)}
                    />

                    {shouldShowError('sowType') && (
                      <Text style={styles.errorText}>{errors.sowType}</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.column}>
                    <Text style={styles.label}>SOW Type *</Text>

                    <View
                      style={[
                        styles.pickerContainer,
                        shouldShowError('sowType') && styles.errorBorder,
                      ]}>
                      <Picker
                        style={styles.picker}
                        selectedValue={sowType?.name || ''}
                        onValueChange={value => {
                          const selected = sowFileds?.sow_type?.find(
                            (item: any) => item.name === value,
                          );
                          setSowType(selected);
                          // handleBlur('sowType');
                          clearError('sowType');
                        }}
                        mode="dropdown">
                        <Picker.Item
                          label="Select SOW Type"
                          value=""
                          color="#646464ff"
                        />
                        {sowFileds?.sow_type?.map((item: any) => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.name}
                            color="#f7f7f7ff"
                          />
                        ))}
                      </Picker>
                    </View>

                    {shouldShowError('sowType') && (
                      <Text style={styles.errorText}>{errors.sowType}</Text>
                    )}
                  </View>
                )}

                <View style={styles.column}>
                  <Text style={styles.label}>Start Date *</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      shouldShowError('startDate') && styles.errorBorder,
                    ]}
                    onPress={() => setShowStartDatePicker(true)}
                    onBlur={() => handleBlur('startDate')}>
                    <Text>{formatDate(startDate)}</Text>
                  </TouchableOpacity>
                  {shouldShowError('startDate') && (
                    <Text style={styles.errorText}>{errors.startDate}</Text>
                  )}
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>End Date *</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      shouldShowError('endDate') && styles.errorBorder,
                    ]}
                    onPress={() => setShowEndDatePicker(true)}
                    onBlur={() => handleBlur('endDate')}>
                    <Text>{formatDate(endDate)}</Text>
                  </TouchableOpacity>
                  {shouldShowError('endDate') && (
                    <Text style={styles.errorText}>{errors.endDate}</Text>
                  )}
                </View>
              </View>

              <Text style={styles.label}>Select Resource *</Text>
              <View
                style={[
                  styles.SelectResource,
                  shouldShowError('resourceType') && styles.errorBorder,
                ]}>
                <TouchableOpacity
                  style={[styles.radioOption2, resourceType === 'sow']}
                  onPress={() => {
                    setResourceType('sow');
                    if (errors.resourceType) {
                      setErrors(prev => ({...prev, resourceType: undefined}));
                    }
                  }}
                  onBlur={() => handleBlur('resourceType')}>
                  <Text>SOW for Resource</Text>
                  <View style={styles.radioCircle}>
                    {resourceType === 'sow' && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                </TouchableOpacity>

                {selectedMsa?.resource_datail?.user_detail && (
                  <View style={styles.resourceDetails}>
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarSmallText}>
                        {(() => {
                          const firstName =
                            selectedMsa.resource_datail.user_detail
                              .first_name || '';
                          const lastName =
                            selectedMsa.resource_datail.user_detail.last_name ||
                            '';
                          const initials =
                            (firstName.charAt(0) || '').toUpperCase() +
                            (
                              lastName.charAt(lastName.length - 1) || ''
                            ).toUpperCase();
                          return initials;
                        })()}
                      </Text>
                    </View>
                    <Text style={styles.resourceName}>
                      {selectedMsa.resource_datail.user_detail.first_name}{' '}
                      {selectedMsa.resource_datail.user_detail.last_name}
                    </Text>
                  </View>
                )}
              </View>
              {shouldShowError('resourceType') && (
                <Text style={styles.errorText}>{errors.resourceType}</Text>
              )}

              <View
                style={[
                  styles.SelectResource,
                  shouldShowError('resourceType') && styles.errorBorder,
                ]}>
                <TouchableOpacity
                  style={styles.radioOption2}
                  onPress={() => {
                    setResourceType('agency');
                    setErrors(prev => ({...prev, resourceType: undefined}));
                  }}
                  onBlur={() => handleBlur('resourceType')}>
                  <Text>SOW for Agency</Text>
                  <View style={styles.radioCircle}>
                    {resourceType === 'agency' && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                </TouchableOpacity>

                {selectedMsa?.agency_datail && (
                  <View style={styles.resourceDetails}>
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarSmallText}>
                        {getAgencyInitials(
                          selectedMsa?.agency_datail.company_name,
                        )}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.resourceName}>
                        {selectedMsa?.agency_datail?.company_name}
                      </Text>

                      <Text style={styles.subText}>
                        {selectedMsa?.agency_datail?.state_name},{' '}
                        {selectedMsa?.agency_datail?.country_name}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <Text style={styles.label}>Work Timesheet *</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    workTimesheet === 'Day' && styles.radioSelected,
                  ]}
                  onPress={() => {
                    setWorkTimesheet('Day');
                    if (errors.workTimesheet) {
                      setErrors(prev => ({...prev, workTimesheet: undefined}));
                    }
                  }}
                  onBlur={() => handleBlur('workTimesheet')}>
                  <Text style={styles.radioText}>Day</Text>
                  <View style={styles.radioCircle}>
                    {workTimesheet === 'Day' && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    workTimesheet === 'Hour' && styles.radioSelected,
                  ]}
                  onPress={() => {
                    setWorkTimesheet('Hour');
                    if (errors.workTimesheet) {
                      setErrors(prev => ({...prev, workTimesheet: undefined}));
                    }
                  }}
                  onBlur={() => handleBlur('workTimesheet')}>
                  <Text style={styles.radioText}>Hour</Text>
                  <View style={styles.radioCircle}>
                    {workTimesheet === 'Hour' && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              {shouldShowError('workTimesheet') && (
                <Text style={styles.errorText}>{errors.workTimesheet}</Text>
              )}

              <Text style={styles.sectionTitle}>Costing for Resource</Text>

              <View style={styles.row}>
                {Platform.OS === 'ios' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>Currency *</Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.input,
                        styles.iosPickerInput,
                        shouldShowError('currency') && styles.errorBorder,
                      ]}
                      onPress={() => setShowCurrencyPicker(true)}>
                      <Text style={styles.iosPickerText}>
                        {currency?.currency || 'Select Currency'}
                      </Text>
                    </TouchableOpacity>

                    <IOSPickerModal
                      visible={showCurrencyPicker}
                      title="Select Currency"
                      data={currencies}
                      selectedValue={currency}
                      labelExtractor={item =>
                        `${item.currency} (${item.country_name})`
                      }
                      searchKeys={['currency', 'country_name']}
                      onSelect={item => {
                        setCurrency(item);
                        clearError('currency'); // ✅ FIX
                      }}
                      onClose={() => setShowCurrencyPicker(false)}
                    />

                    {shouldShowError('currency') && (
                      <Text style={styles.errorText}>{errors.currency}</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.column}>
                    <Text style={styles.label}>Currency *</Text>

                    <View
                      style={[
                        styles.pickerContainer,
                        shouldShowError('currency') && styles.errorBorder,
                      ]}>
                      <Picker
                        style={styles.picker}
                        selectedValue={currency?.currency || ''}
                        onValueChange={value => {
                          const selected =
                            currencies.find(item => item.currency === value) ||
                            null;
                          setCurrency(selected);
                          // handleBlur('currency');
                          clearError('currency');
                        }}
                        mode="dropdown">
                        <Picker.Item
                          label="Select Currency"
                          value=""
                          color="#646464ff"
                        />
                        {currencies?.map((item: any) => (
                          <Picker.Item
                            key={item.id}
                            label={`${item.currency} - ${item.country_name}`}
                            value={item.currency}
                            color="rgba(239, 239, 239, 1)"
                          />
                        ))}
                      </Picker>
                    </View>

                    {shouldShowError('currency') && (
                      <Text style={styles.errorText}>{errors.currency}</Text>
                    )}
                  </View>
                )}

                <View style={styles.column}>
                  <Text style={styles.label}>Rate *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      shouldShowError('rate') && styles.errorBorder,
                    ]}
                    placeholder="ENTER RATE"
                    placeholderTextColor={'black'}
                    value={rate}
                    onChangeText={setRate}
                    keyboardType="numeric"
                    onBlur={() => handleBlur('rate')}
                  />
                  {shouldShowError('rate') && (
                    <Text style={styles.errorText}>{errors.rate}</Text>
                  )}
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Quantity *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      shouldShowError('quantity') && styles.errorBorder,
                    ]}
                    placeholder="Enter Quantity"
                    placeholderTextColor={'black'}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    onBlur={() => handleBlur('quantity')}
                  />
                  {shouldShowError('quantity') && (
                    <Text style={styles.errorText}>{errors.quantity}</Text>
                  )}
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Amount *</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={amount.toFixed(2)}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.row}>
                {/* iOS */}
                {Platform.OS === 'ios' ? (
                  <>
                    <View style={styles.column}>
                      <Text style={styles.label}>Tax Group *</Text>
                      {/* iOS Touchable */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.input,
                          styles.iosPickerInput,
                          shouldShowError('taxGroup') && styles.errorBorder,
                        ]}
                        onPress={() => setShowTaxGroupPicker(true)}>
                        <Text style={styles.iosPickerText}>
                          {taxGroup?.name || 'Select Tax Group'}
                        </Text>
                      </TouchableOpacity>

                      <IOSPickerModal
                        visible={showTaxGroupPicker}
                        title="Select Tax Group"
                        data={sowFileds?.tax_group || []}
                        selectedValue={taxGroup}
                        onSelect={(item: any) => {
                          setTaxGroup(item);
                          clearError('taxGroup');
                        }}
                        onClose={() => setShowTaxGroupPicker(false)}
                      />
                    </View>
                  </>
                ) : (
                  /* ✅ ANDROID PICKER — NO TOUCHABLE */
                  <View style={styles.column}>
                    <Text style={styles.label}>Tax Group *</Text>
                    <View
                      style={[
                        styles.pickerContainer,
                        shouldShowError('taxGroup') && styles.errorBorder,
                      ]}>
                      <Picker
                        style={styles.picker}
                        selectedValue={taxGroup?.name || ''}
                        onValueChange={value => {
                          const selected = sowFileds?.tax_group?.find(
                            (item: any) => item.name === value,
                          );
                          setTaxGroup(selected);
                          // handleBlur('taxGroup');
                          clearError('taxGroup');
                        }}
                        mode="dropdown">
                        <Picker.Item
                          label="Select Tax Group"
                          value=""
                          color="#646464ff"
                        />
                        {sowFileds?.tax_group?.map((item: any) => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.name}
                            color="#fbfbfbff"
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}

                <View style={styles.column}>
                  <Text style={styles.label}>Tax % *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      shouldShowError('taxPercentage') && styles.errorBorder,
                    ]}
                    placeholder="ENTER TAX IN %"
                    placeholderTextColor={'black'}
                    value={taxPercentage}
                    onChangeText={setTaxPercentage}
                    keyboardType="numeric"
                    onBlur={() => handleBlur('taxPercentage')}
                  />
                  {shouldShowError('taxPercentage') && (
                    <Text style={styles.errorText}>{errors.taxPercentage}</Text>
                  )}
                </View>
              </View>

              <View style={styles.row}>
                {Platform.OS === 'ios' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>GL Account *</Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.input,
                        styles.iosPickerInput,
                        shouldShowError('glAccount') && styles.errorBorder,
                      ]}
                      onPress={() => setShowGlAccountPicker(true)}>
                      <Text style={styles.iosPickerText}>
                        {glAccount?.name || 'Select GL Account'}
                      </Text>
                    </TouchableOpacity>

                    <IOSPickerModal
                      visible={showGlAccountPicker}
                      title="Select GL Account"
                      data={sowFileds?.account || []}
                      selectedValue={glAccount}
                      onSelect={item => {
                        setGlAccount(item);
                        clearError('glAccount');
                      }}
                      onClose={() => setShowGlAccountPicker(false)}
                    />

                    {shouldShowError('glAccount') && (
                      <Text style={styles.errorText}>{errors.glAccount}</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.column}>
                    <Text style={styles.label}>GL Account *</Text>

                    <View
                      style={[
                        styles.pickerContainer,
                        shouldShowError('glAccount') && styles.errorBorder,
                      ]}>
                      <Picker
                        style={styles.picker}
                        selectedValue={glAccount?.id?.toString() || ''}
                        onValueChange={value => {
                          const selected = sowFileds?.account?.find(
                            (item: any) => item.id.toString() === value,
                          );

                          setGlAccount(selected);
                          clearError('glAccount');
                        }}
                        mode="dropdown">
                        <Picker.Item
                          label="Select GL Account"
                          value=""
                          color="#646464ff"
                        />

                        {sowFileds?.account?.map((item: any) => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.id.toString()}
                            color="#ffffff"
                          />
                        ))}
                      </Picker>
                    </View>

                    {shouldShowError('glAccount') && (
                      <Text style={styles.errorText}>{errors.glAccount}</Text>
                    )}
                  </View>
                )}

                {Platform.OS === 'ios' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>Cost Center *</Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.input,
                        styles.iosPickerInput,
                        shouldShowError('costCenter') && styles.errorBorder,
                      ]}
                      onPress={() => setShowCostCenterPicker(true)}>
                      <Text style={styles.iosPickerText}>
                        {costCenter?.name || 'Select Cost Center'}
                      </Text>
                    </TouchableOpacity>

                    <IOSPickerModal
                      visible={showCostCenterPicker}
                      title="Select Cost Center"
                      data={sowFileds?.cost_center || []}
                      selectedValue={costCenter}
                      onSelect={(item: any) => {
                        setCostCenter(item);
                        clearError('costCenter');
                      }}
                      onClose={() => setShowCostCenterPicker(false)}
                    />

                    {shouldShowError('costCenter') && (
                      <Text style={styles.errorText}>{errors.costCenter}</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.column}>
                    <Text style={styles.label}>Cost Center *</Text>

                    <View
                      style={[
                        styles.pickerContainer,
                        shouldShowError('costCenter') && styles.errorBorder,
                      ]}>
                      <Picker
                        style={styles.picker}
                        selectedValue={costCenter?.name || ''}
                        onValueChange={value => {
                          const selected = sowFileds?.cost_center?.find(
                            (item: any) => item.name === value,
                          );
                          setCostCenter(selected);
                          // handleBlur('costCenter');
                          clearError('costCenter');
                        }}>
                        <Picker.Item
                          label="Select Cost Center"
                          value=""
                          color="#646464ff"
                        />
                        {sowFileds?.cost_center?.map((item: any) => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.name}
                            color="#fffdfdff"
                          />
                        ))}
                      </Picker>
                    </View>

                    {shouldShowError('costCenter') && (
                      <Text style={styles.errorText}>{errors.costCenter}</Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Grand Total *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.disabledInput,
                      styles.totalInput,
                    ]}
                    value={grandTotal.toFixed(2)}
                    editable={false}
                  />
                </View>
              </View>

              <Text style={styles.sectionTitle}>Previous Contract / Other</Text>

              <Text style={styles.label}>Previous contracts</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Documents</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Supporting Documents</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Documents</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Due Diligence Documents</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Documents</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  shouldShowError('description') && styles.errorBorder,
                ]}
                placeholder="Enter description"
                placeholderTextColor={'black'}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                onBlur={() => handleBlur('description')}
              />
              {shouldShowError('description') && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              <Text style={styles.label}>Comments *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  shouldShowError('comments') && styles.errorBorder,
                ]}
                placeholder="Enter comments"
                placeholderTextColor={'black'}
                value={comments}
                onChangeText={setComments}
                multiline
                numberOfLines={4}
                onBlur={() => handleBlur('comments')}
              />
              {shouldShowError('comments') && (
                <Text style={styles.errorText}>{errors.comments}</Text>
              )}

              <View style={styles.radioContainer}>
                <View>
                  <Text style={styles.label}>SOW Approver *</Text>
                  <View style={styles.SelectResource}>
                    <TouchableOpacity
                      style={[
                        styles.radioOption2,
                        sowApprover === 'manual' && styles.radioSelected,
                      ]}
                      onPress={() => {
                        setSowApprover('manual');
                        openApproverModal();

                        // clear errors
                        setErrors(prev => ({
                          ...prev,
                          sowApprover: undefined,
                          selectedApprover: undefined,
                        }));
                      }}>
                      <Text style={styles.radioText}>Manual Approval</Text>
                      <View style={styles.radioCircle}>
                        {sowApprover === 'manual' && (
                          <View style={styles.radioInnerCircle} />
                        )}
                      </View>
                    </TouchableOpacity>

                    {selectedApprover && (
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
                              {selectedApprover.first_name}{' '}
                              {selectedApprover.last_name}
                            </Text>
                            <Text style={styles.approverEmail}>
                              {selectedApprover.email}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity onPress={openApproverModal}>
                          <Text style={styles.changeText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      sowApprover === 'automatic' && styles.radioSelected,
                    ]}
                    onPress={() => {
                      setSowApprover('automatic');

                      setErrors(prev => ({
                        ...prev,
                        sowApprover: undefined,
                        selectedApprover: undefined,
                      }));
                    }}>
                    <Text style={styles.radioText}>Automatic Approval</Text>
                    <View style={styles.radioCircle}>
                      {sowApprover === 'automatic' && (
                        <View style={styles.radioInnerCircle} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {shouldShowError('sowApprover') && (
                <Text style={styles.errorText}>{errors.sowApprover}</Text>
              )}

              {shouldShowError('selectedApprover') &&
                sowApprover === 'manual' && (
                  <Text style={styles.errorText}>
                    {errors.selectedApprover}
                  </Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <DatePickerSheet
              visible={showStartDatePicker}
              date={startDate}
              onChange={(e, d) => {
                if (d) setStartDate(d);
              }}
              onClose={() => setShowStartDatePicker(false)}
            />

            <DatePickerSheet
              visible={showEndDatePicker}
              date={endDate}
              onChange={(e, d) => {
                if (d) setEndDate(d);
              }}
              onClose={() => setShowEndDatePicker(false)}
            />

            <ApprovalModalSOW
              visible={sowApproverModalVisible}
              onClose={() => setSowApproverModalVisible(false)}
              onSelectApprover={handleSowApproverSelect}
              selectedApprover={selectedApprover}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scroll: {padding: 16},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approversList: {
    maxHeight: 400,
  },
  scrollView: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
    color: '#333',
  },
  SelectResource: {
    borderWidth: 1,
    padding: 10,
    borderColor: '#000078',
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3f3d3dff',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  totalInput: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addSOWText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  column: {
    flex: 1, // 🔑 THIS IS THE FIX
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#414141ff',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#ffffffff',
    height: 48,
    minWidth: 50,
  },
  picker: {
    height: 50,
    color: '#111827',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 50,
  },
  radioContainer: {
    marginVertical: 8,
  },
  radioOption2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
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
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  uploadButtonText: {
    color: '#666',
  },
  approverSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  approverLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  changeText: {
    color: '#0033CC',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#0E3386',
    padding: 16,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#0E3386',
    padding: 16,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#0E3386',
    fontWeight: 'bold',
    fontSize: 16,
  },

  closeBtn: {
    fontSize: 18,
    color: '#666',
  },
  sectionLabel: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
    paddingBottom: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  closeButton: {
    fontSize: 20,
    color: '#333',
  },

  approverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontWeight: '700',
  },
  details: {
    fontSize: 12,
    color: '#555',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginLeft: 10,
  },
  available: {
    marginLeft: 4,
    fontSize: 12,
    color: 'green',
  },
  approverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedApproverItem: {
    backgroundColor: '#f0f5ff',
  },
  approverName: {
    fontSize: 16,
    fontWeight: '500',
  },
  approverDetails: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0033CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarSmallText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  selectedApproverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  approverInfo: {
    flex: 1,
  },
  approverEmail: {
    fontSize: 12,
    color: '#666',
  },
  errorBorder: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  resourceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000078',
    paddingVertical: 5,
  },
  resourceName: {
    fontSize: 14,
    fontWeight: '600',
  },
  // closeButton: {
  //     fontSize: 18,
  //     color: "#666",
  // },

  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  dateModalContent: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  iosPickerInput: {
    justifyContent: 'center',
  },

  iosPickerText: {
    fontSize: 14,
    color: '#000',
  },
});

export default CreateSOW;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Modal,
//   Pressable,
//   Alert,
// } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import Services from "../Services/services";

// /* ================= TYPES ================= */

// type DropdownItem = {
//   id: number;
//   name: string;
// };

// type SowFieldsType = {
//   sow_type: DropdownItem[];
//   tax_group: DropdownItem[];
//   account: DropdownItem[];
//   cost_center: DropdownItem[];
// };

// type ValidationErrors = {
//   msa?: string;
//   title?: string;
//   sowType?: string;
//   startDate?: string;
//   endDate?: string;
//   resourceType?: string;
//   workTimesheet?: string;
//   currency?: string;
//   rate?: string;
//   quantity?: string;
//   taxGroup?: string;
//   taxPercentage?: string;
//   glAccount?: string;
//   costCenter?: string;
//   description?: string;
//   comments?: string;
//   sowApprover?: string;
//   selectedApprover?: string;
// };

// /* ================= COMPONENT ================= */

// const CreateSOW = ({ navigation }: any) => {
//   /* ================= STATE ================= */

//   const [loading, setLoading] = useState(true);

//   const [msaList, setMsaList] = useState<any[]>([]);
//   const [selectedMsa, setSelectedMsa] = useState<any>(null);

//   const [sowFileds, setSowFileds] = useState<SowFieldsType>({
//     sow_type: [],
//     tax_group: [],
//     account: [],
//     cost_center: [],
//   });

//   const [currencies, setCurrencies] = useState<any[]>([]);

//   const [title, setTitle] = useState("");
//   const [sowNumber, setSowNumber] = useState("");

//   const [sowType, setSowType] = useState("");
//   const [taxGroup, setTaxGroup] = useState("");
//   const [glAccount, setGlAccount] = useState("");
//   const [costCenter, setCostCenter] = useState("");

//   const [currency, setCurrency] = useState("");
//   const [rate, setRate] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [taxPercentage, setTaxPercentage] = useState("");

//   const [resourceType, setResourceType] = useState("");
//   const [workTimesheet, setWorkTimesheet] = useState("");

//   const [description, setDescription] = useState("");
//   const [comments, setComments] = useState("");

//   const [sowApprover, setSowApprover] = useState("");
//   const [selectedApprover, setSelectedApprover] = useState<any>(null);

//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());

//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);

//   const [errors, setErrors] = useState<ValidationErrors>({});

//   /* ================= MODAL ================= */

//   const [dropdown, setDropdown] = useState<{
//     visible: boolean;
//     title: string;
//     data: any[];
//     onSelect: (item: any) => void;
//   }>({
//     visible: false,
//     title: "",
//     data: [],
//     onSelect: () => {},
//   });

//   /* ================= CALCULATIONS ================= */

//   const amount = Number(rate || 0) * Number(quantity || 0);
//   const taxAmount = (amount * Number(taxPercentage || 0)) / 100;
//   const grandTotal = amount + taxAmount;

//   /* ================= API LOAD ================= */

//   useEffect(() => {
//     loadAll();
//   }, []);

//   const loadAll = async () => {
//     try {
//       const [msaRes, sowRes, currencyRes] = await Promise.all([
//         Services.getMSAAllList({ limit: 30, offset: 0 }),
//         Services.getSOWFields(),
//         Services.getCurrencyDetails(),
//       ]);

//       setMsaList(msaRes?.data?.results || []);
//       setSowFileds(sowRes?.data?.payload || {});
//       setCurrencies(currencyRes?.data || []);
//     } catch {
//       Alert.alert("Error", "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= VALIDATION ================= */

//   const validateField = (field: string, value: any): string => {
//     switch (field) {
//       case "msa": return !value ? "MSA is required" : "";
//       case "title": return !value?.trim() ? "Title is required" : "";
//       case "sowType": return !value ? "SOW Type is required" : "";
//       case "startDate": return !value ? "Start Date is required" : "";
//       case "endDate":
//         if (!value) return "End Date is required";
//         if (value < startDate) return "End Date cannot be before Start Date";
//         return "";
//       case "resourceType": return !value ? "Resource Type is required" : "";
//       case "workTimesheet": return !value ? "Work Timesheet is required" : "";
//       case "currency": return !value ? "Currency is required" : "";
//       case "rate": return !value ? "Rate is required" : "";
//       case "quantity": return !value ? "Quantity is required" : "";
//       case "taxGroup": return !value ? "Tax Group is required" : "";
//       case "taxPercentage": return !value ? "Tax % is required" : "";
//       case "glAccount": return !value ? "GL Account is required" : "";
//       case "costCenter": return !value ? "Cost Center is required" : "";
//       case "description": return !value?.trim() ? "Description is required" : "";
//       case "comments": return !value?.trim() ? "Comments are required" : "";
//       case "sowApprover": return !value ? "SOW Approver is required" : "";
//       case "selectedApprover":
//         return sowApprover === "manual" && !value ? "Approver required" : "";
//       default: return "";
//     }
//   };

//   const validateForm = () => {
//     const e: ValidationErrors = {
//       msa: validateField("msa", selectedMsa),
//       title: validateField("title", title),
//       sowType: validateField("sowType", sowType),
//       startDate: validateField("startDate", startDate),
//       endDate: validateField("endDate", endDate),
//       resourceType: validateField("resourceType", resourceType),
//       workTimesheet: validateField("workTimesheet", workTimesheet),
//       currency: validateField("currency", currency),
//       rate: validateField("rate", rate),
//       quantity: validateField("quantity", quantity),
//       taxGroup: validateField("taxGroup", taxGroup),
//       taxPercentage: validateField("taxPercentage", taxPercentage),
//       glAccount: validateField("glAccount", glAccount),
//       costCenter: validateField("costCenter", costCenter),
//       description: validateField("description", description),
//       comments: validateField("comments", comments),
//       sowApprover: validateField("sowApprover", sowApprover),
//       selectedApprover: validateField("selectedApprover", selectedApprover),
//     };

//     const filtered = Object.fromEntries(
//       Object.entries(e).filter(([_, v]) => v)
//     );

//     setErrors(filtered);
//     return Object.keys(filtered).length === 0;
//   };

//   /* ================= HELPERS ================= */

//   const openDropdown = (title: string, data: any[], onSelect: any) =>
//     setDropdown({ visible: true, title, data, onSelect });

//   const formatDateForAPI = (d: Date) =>
//     `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//       d.getDate()
//     ).padStart(2, "0")} 00:00:00`;

//   /* ================= SUBMIT (UNCHANGED PAYLOAD) ================= */

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       Alert.alert("Validation Error", "Please fix errors");
//       return;
//     }

//     try {
//       const selectedSowType = sowFileds.sow_type.find(i => i.name === sowType);
//       const selectedTaxGroup = sowFileds.tax_group.find(i => i.name === taxGroup);
//       const selectedAccount = sowFileds.account.find(i => i.name === glAccount);
//       const selectedCostCenter = sowFileds.cost_center.find(i => i.name === costCenter);
//       const selectedCurrency = currencies.find(i => i.currency === currency);

//       const formData = new FormData();

//       formData.append("msa", selectedMsa.id);
//       formData.append("title", title);
//       formData.append("sow_number", sowNumber);
//       formData.append("sow_type", selectedSowType.id);
//       formData.append("start_date", formatDateForAPI(startDate));
//       formData.append("end_date", formatDateForAPI(endDate));

//       if (resourceType === "sow" && selectedMsa?.resource_datail?.id) {
//         formData.append("resource", selectedMsa.resource_datail.id);
//       } else {
//         Alert.alert("Error", "Please select resource");
//         return;
//       }

//       formData.append("is_hour", workTimesheet === "Hour");
//       formData.append("is_day", workTimesheet === "Day");

//       formData.append("currency", selectedCurrency.id);
//       formData.append("work_rate", parseFloat(rate));
//       formData.append("work_quantity", parseFloat(quantity));
//       formData.append("amount", amount);

//       formData.append("tax_group", selectedTaxGroup.id);
//       formData.append("tax_percent", parseFloat(taxPercentage));

//       formData.append("account", selectedAccount.id);
//       formData.append("cost_center", selectedCostCenter.id);

//       formData.append("description", description);
//       formData.append("comments", comments);
//       formData.append("sow_flow", "1");
//       formData.append("status", "pending_approval");

//       if (sowApprover === "manual") {
//         formData.append("approver", selectedApprover.id);
//       } else {
//         formData.append("approver", "auto");
//       }

//       formData.append("grand_total", grandTotal);

//       const result = await Services.createSOW(formData);

//       if (result.success) {
//         Alert.alert("Success", "SOW created successfully");
//         navigation.goBack();
//       } else {
//         Alert.alert("Error", "Failed to create SOW");
//       }
//     } catch {
//       Alert.alert("Error", "Unexpected error");
//     }
//   };

//   /* ================= UI ================= */

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loader}>
//         <Text>Loading…</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.scroll}>
//         <Text style={styles.header}>Create SOW</Text>

//         {/* ALL INPUTS */}
//         {/* MSA */}
//         <TouchableOpacity style={styles.input} onPress={() => openDropdown("Select MSA", msaList, setSelectedMsa)}>
//           <Text>{selectedMsa?.name || "Select MSA *"}</Text>
//         </TouchableOpacity>
//         {errors.msa && <Text style={styles.error}>{errors.msa}</Text>}

//         <TextInput style={styles.input} placeholder="Title *" value={title} onChangeText={setTitle} />
//         <TextInput style={styles.input} placeholder="SOW Number" value={sowNumber} onChangeText={setSowNumber} />

//         <TouchableOpacity style={styles.input} onPress={() => openDropdown("SOW Type", sowFileds.sow_type, i => setSowType(i.name))}>
//           <Text>{sowType || "Select SOW Type *"}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
//           <Text>Start Date: {formatDateForAPI(startDate).split(" ")[0]}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
//           <Text>End Date: {formatDateForAPI(endDate).split(" ")[0]}</Text>
//         </TouchableOpacity>

//         <TextInput style={styles.input} placeholder="Rate *" keyboardType="numeric" value={rate} onChangeText={setRate} />
//         <TextInput style={styles.input} placeholder="Quantity *" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
//         <TextInput style={styles.input} placeholder="Tax %" keyboardType="numeric" value={taxPercentage} onChangeText={setTaxPercentage} />

//         <TextInput style={[styles.input, styles.textArea]} placeholder="Description *" value={description} onChangeText={setDescription} multiline />
//         <TextInput style={[styles.input, styles.textArea]} placeholder="Comments *" value={comments} onChangeText={setComments} multiline />

//         <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
//           <Text style={styles.submitText}>Submit</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {dropdown.visible && (
//         <Modal transparent animationType="fade">
//           <Pressable style={styles.modalOverlay} onPress={() => setDropdown({ ...dropdown, visible: false })}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>{dropdown.title}</Text>
//               {dropdown.data.map(item => (
//                 <TouchableOpacity key={item.id} style={styles.modalItem} onPress={() => {
//                   dropdown.onSelect(item);
//                   setDropdown({ ...dropdown, visible: false });
//                 }}>
//                   <Text>{item.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </Pressable>
//         </Modal>
//       )}

//       {showStartPicker && <DateTimePicker value={startDate} mode="date" onChange={(_, d) => { setShowStartPicker(false); d && setStartDate(d); }} />}
//       {showEndPicker && <DateTimePicker value={endDate} mode="date" onChange={(_, d) => { setShowEndPicker(false); d && setEndDate(d); }} />}
//     </SafeAreaView>
//   );
// };

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   scroll: { padding: 16 },
//   header: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
//   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 14, marginBottom: 10 },
//   textArea: { height: 90 },
//   error: { color: "#FF3B30", fontSize: 12, marginBottom: 6 },
//   submit: { backgroundColor: "#0E3386", padding: 16, borderRadius: 6, marginTop: 20 },
//   submitText: { color: "#fff", textAlign: "center", fontWeight: "700" },
//   cancel: { borderWidth: 1, borderColor: "#0E3386", padding: 16, borderRadius: 6, marginTop: 12 },
//   cancelText: { textAlign: "center", color: "#0E3386", fontWeight: "700" },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
//   modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
//   modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 16 },
//   modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
//   modalItem: { padding: 14, borderBottomWidth: 1, borderColor: "#eee" },
// });

// export default CreateSOW;
