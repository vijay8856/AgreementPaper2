// @ts-nocheck


import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  TextStyle,
  ViewStyle,
  Alert,
  KeyboardAvoidingView,
  FlatList,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Services from '../../Services/services';
import {Picker} from '@react-native-picker/picker';
import {ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import SelectPickerModal from '../../components/Modals/SelectModal';
import DatePickerSheet from '../../components/DatePickerSheet';
// Define types
type Material = {
  id: string;
  title: string;
  price: string;
  materialNumber: string;
  quantity: string;
  description: string;
  tax: string;
  baseUnit: string;
  grandTotal: string;
  currency: string;
  oldMaterialNumber: string;
  taxGroup: string;
  leadTime: string;
  orderUnit: string;
};

type Milestone = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  taxGroup: string;
  rate: string;
  quantity: string;
  tax: string;
  grandTotal: string;
  description: string;
  comments: string;
};
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
type FormType = 'milestone' | 'material';

const CreateServiceSow: React.FC = () => {
  // Main form state
  const navigation = useNavigation();
  const [msa, setMsa] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  console.log('title', title);

  const [sowNumber, setSowNumber] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] =
    useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [msaId, setMsaId] = useState<string>('');
  const [attachments, setAttachments] = useState<any[]>([]);
  // Items state
  const [items, setItems] = useState<
    Array<{type: FormType; data: Material | Milestone}>
  >([{type: 'milestone', data: createEmptyMilestone()}]);
  const [showApproverModal, setShowApproverModal] = useState<boolean>(false);
  const [msaList, setMsaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [currentFormType, setCurrentFormType] = useState<FormType>('milestone');
  console.log('showDropdown', showDropdown);

  const [currencies, setCurrencies] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [masterMaterialList, setMasterMaterialList] = useState<any[]>([]);
  const [activeMaterialIndex, setActiveMaterialIndex] = useState<number | null>(
    null,
  );
  const [fields, setFields] = useState<any>(null);
  const [sowType, setSowType] = useState();
  const [sowApprover, setSowApprover] = useState('');
  const [approversList, setApproversList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taxGroup, setTaxGroup] = useState();
  const [sowFileds, setSowFileds] = useState<SowFieldsType>({
    cost_center: [],
    account: [],
    tax_group: [],
    sow_type: [],
  });
  const materialOptions = [
    'Aluminum',
    'Brass',
    'Bronze',
    'Carbon Fiber',
    'Ceramic',
    'Concrete',
    'Copper',
    'Fabric',
    'Fiberglass',
    'Glass',
    'Granite',
    'Iron',
    'Leather',
    'Marble',
    'Metal',
    'Paper',
    'Plastic',
    'Plywood',
    'Polycarbonate',
    'PVC',
    'Rubber',
    'Silicone',
    'Stainless Steel',
    'Steel',
    'Stone',
    'Titanium',
    'Vinyl',
    'Wood',
  ];
  // Modal visibility
  const [materialTitleModal, setMaterialTitleModal] = useState(false);
  const [materialNumberModal, setMaterialNumberModal] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [taxGroupModal, setTaxGroupModal] = useState(false);

  const [activeDatePicker, setActiveDatePicker] = useState<
    'start' | 'end' | null
  >(null);

  const materialTitleData = materialOptions.map((item, idx) => ({
    id: idx,
    name: item,
  }));
  const materialNumberData = masterMaterialList.map(item => ({
    id: item.material_number,
    name: `${item.material_number} (${item.description})`,
  }));

  const currencyData = currencies.map(item => ({
    id: item.id,
    name: `${item.currency} - ${item.country_name}`,
  }));

  const taxGroupData =
    fields?.tax_group?.map(item => ({
      id: item.id,
      name: item.name,
    })) || [];

  const calculateGrandTotal = (
    rate: string,
    quantity: string,
    tax: string,
  ): string => {
    const rateNum = parseFloat(rate) || 0;
    const quantityNum = parseFloat(quantity) || 0;
    const taxNum = parseFloat(tax) || 0;

    const subtotal = rateNum * quantityNum;
    const taxAmount = subtotal * (taxNum / 100);
    const grandTotal = subtotal + taxAmount;

    return grandTotal.toFixed(2);
  };

  useEffect(() => {
    const fetchSOWFields = async () => {
      try {
        const response = await Services.getSOWFields();
        console.log('response fetchSOWFields :', response);

        const payload = response?.data?.payload || {};
        setSowFileds(payload);

        // ✅ Default select first option if available (store ID instead of name)
        if (payload?.sow_type?.length > 0) {
          setSowType(payload.sow_type[0].id); // Store ID instead of name
        }
        if (payload?.tax_group?.length > 0) {
          setTaxGroup(payload.tax_group[0].id); // Store ID instead of name
        }
      } catch (error) {
        console.error('Error fetching SOW details:', error);
      }
    };

    fetchSOWFields();
  }, []);
  {
    useEffect(() => {
      const fetchMaterialDetails = async () => {
        if (
          activeMaterialIndex !== null &&
          items[activeMaterialIndex].type === 'material'
        ) {
          const materialData = items[activeMaterialIndex].data as Material;

          if (materialData.materialNumber) {
            console.log(
              'materialData.materialNumber',
              materialData.materialNumber,
            );

            try {
              // Fetch material details using the UID
              const response = await Services.getMaterialDetails(
                materialData.materialNumber,
              );
              console.log('materialData response', response);

              if (response.success) {
                const detailData = response.data;
                console.log('old_material_number response', detailData);

                // Update the form with the fetched data
                updateFormData(
                  activeMaterialIndex,
                  'description',
                  detailData.description || '',
                );
                updateFormData(
                  activeMaterialIndex,
                  'title',
                  detailData.description || '',
                );
                updateFormData(
                  activeMaterialIndex,
                  'baseUnit',
                  detailData.unit_of_measure || '',
                );
                updateFormData(
                  activeMaterialIndex,
                  'oldMaterialNumber',
                  detailData.old_material_number?.toString() || '',
                );
                updateFormData(
                  activeMaterialIndex,
                  'orderUnit',
                  detailData.order_unit || '',
                );

                // Reset active index
                setActiveMaterialIndex(null);
              }
            } catch (error) {
              console.error('Error fetching material details:', error);
              Alert.alert('Error', 'Failed to load material details');
              setActiveMaterialIndex(null);
            }
          }
        }
      };

      fetchMaterialDetails();
    }, [items]);
  }

  //    useEffect(() => {
  //     const fetchCoustomApprover = async () => {
  //         try {
  //             const data = {
  //                 limit: 10,
  //                 msa: "sow"
  //             };
  //             const response = await Services.getApproverCoustom(data);
  //             console.log("fetchCoustomApprover", response.data);

  //             if (response.success) {
  //                 setApproversList(response.data || [])
  //                 // setApproverCoustom(response.data);
  //             }
  //         } catch (err) {
  //             console.error("Error loading approver", err);
  //         }
  //     };
  //     fetchCoustomApprover();
  // }, []);
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
        setLoading(false);
      }
    };

    fetchCurrencyDetails();
  }, []);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await Services.getMSAFields();
        if (response.success) {
          setFields(response.data.payload);
        }
      } catch (err) {
        console.error('Error loading dropdown fields', err);
        Alert.alert('Error', 'Failed to load form fields');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);
  useEffect(() => {
    const fetchMasterMaterialList = async () => {
      setLoading(true);
      try {
        const data = {
          limit: 10,
          offset: 0,
        };

        const response = await Services.getMasterMaterialListBySerach(data);
        if (response.success) {
          setMasterMaterialList(response.data || []);
          console.log('MasterMaterialList Response:', response.data);
        } else {
          setMasterMaterialList([]);
        }
      } catch (err) {
        console.error('Error loading dropdown fields', err);
        Alert.alert('Error', 'Failed to load Material List');
      } finally {
        setLoading(false);
      }
    };

    fetchMasterMaterialList();
  }, []);

  // Create empty milestone
  function createEmptyMilestone(): Milestone {
    return {
      id: Date.now().toString(),
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      currency: '',
      taxGroup: '',
      rate: '',
      quantity: '1',
      tax: '',
      grandTotal: '',
      description: '',
      comments: '',
    };
  }

  // Create empty material
  function createEmptyMaterial(): Material {
    return {
      id: Date.now().toString(),
      title: '',
      price: '',
      materialNumber: '',
      quantity: '1',
      description: '',
      tax: '',
      baseUnit: '',
      grandTotal: '',
      currency: '',
      oldMaterialNumber: '0',
      taxGroup: '',
      leadTime: '0',
      orderUnit: '',
    };
  }

  const handleMsaSelect = (item: any) => {
    setMsa(item.name);
    setMsaId(item.id); // Store the MSA ID for API
    setShowDropdown(false);
  };

  // Handle file upload

  const handleFilePick = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      setAttachments(results);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled file picker');
      } else {
        console.error('Error picking files:', err);
        Alert.alert('Error', 'Failed to pick files');
      }
    }
  };
  const formatDateForAPI = (date: Date): string => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };

  const prepareFormData = () => {
    const formData = new FormData();

    // Add basic fields
    formData.append('msa', msaId);
    formData.append('sow_flow', '2'); // Assuming service SOW flow is 2
    formData.append('title', title);
    formData.append('start_date', formatDateForAPI(startDate));
    formData.append('end_date', formatDateForAPI(endDate));

    if (sowNumber) {
      formData.append('sow_number', sowNumber);
    }
    // Separate milestones and materials
    const milestones = items
      .filter(item => item.type === 'milestone')
      .map(item => item.data as Milestone);

    const materials = items
      .filter(item => item.type === 'material')
      .map(item => item.data as Material);

    // Add milestones if any
    if (milestones.length > 0) {
      const milestoneData = milestones.map(milestone => ({
        title: milestone.title,
        sow_type: sowType, // Assuming 1 for milestone type
        start_date: formatDateForAPI(milestone.startDate).split(' ')[0],
        end_date: formatDateForAPI(milestone.endDate).split(' ')[0],
        currency: milestone.currency,
        tax_group: taxGroup,
        rate: milestone.rate,
        quantity: milestone.quantity,
        tax: milestone.tax,
        grand_total: milestone.grandTotal,
        description: milestone.description,
        comments: milestone.comments,
        approver: selectedApprover?.id,
      }));

      formData.append('milestones', JSON.stringify(milestoneData));
    }

    // Add materials if any
    if (materials.length > 0) {
      const materialData = materials.map(material => ({
        material_number: Math.floor(1000 + Math.random() * 9000),
        description: material.description,
        title: material.title,
        currency: material.currency,
        tax_group: material.taxGroup,
        price: material.price,
        quantity: material.quantity,
        tax: material.tax,
        grand_total: material.grandTotal,
        base_unit: material.baseUnit,
        old_material_number: parseInt(material.oldMaterialNumber) || 0,
        lead_time: parseInt(material.leadTime) || 0,
        order_unit: material.orderUnit,
        approver: selectedApprover?.id,
      }));

      formData.append('materials', JSON.stringify(materialData));
    }

    // Add attachments
    attachments.forEach((file, index) => {
      formData.append('attachment_files', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    });

    return formData;
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!msaId) {
        Alert.alert('Error', 'Please select an MSA');
        return;
      }

      if (!title) {
        Alert.alert('Error', 'Please enter a title');
        return;
      }

      if (items.length === 0) {
        Alert.alert('Error', 'Please add at least one milestone or material');
        return;
      }

      const formData = prepareFormData();

      // Log form data for debugging
      console.log('Submitting form data:', {
        msa: msaId,
        sow_flow: '2',
        title,
        start_date: formatDateForAPI(startDate),
        end_date: formatDateForAPI(endDate),
        sow_number: sowNumber,
        milestones_count: items.filter(item => item.type === 'milestone')
          .length,
        materials_count: items.filter(item => item.type === 'material').length,
        attachments_count: attachments.length,
      });
      console.log('formData', formData);

      // Call API
      const response = await Services.createServiceSOW(formData);

      if (response.success) {
        Alert.alert('Success', 'SOW created successfully!');
        navigation.goBack();
      } else {
        Alert.alert(
          'Error',
          response.error?.data
            ? JSON.stringify(response.error.data) // show backend error response
            : response.error?.message || 'Failed to create SOW',
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const addForm = (type: FormType) => {
    // If switching form types, clear existing items and set new type
    if (type !== currentFormType) {
      setCurrentFormType(type);
      const newItem =
        type === 'milestone'
          ? {type: 'milestone', data: createEmptyMilestone()}
          : {type: 'material', data: createEmptyMaterial()};

      setItems([newItem]);
    } else {
      // If same type, just add a new form
      const newItem =
        type === 'milestone'
          ? {type: 'milestone', data: createEmptyMilestone()}
          : {type: 'material', data: createEmptyMaterial()};

      setItems([...items, newItem]);
    }
  };
  useEffect(() => {
    fetchMSAList();
    // Initialize with an empty milestone form
    // setItems([{ type: 'milestone', data: createEmptyMilestone() }]);
  }, []);
  const fetchMSAList = async () => {
    setLoading(true);
    const data = {
      limit: 10,
      offset: 0,
    };
    const res = await Services.getMSAServiceList(data);
    setLoading(false);
    console.log('msa 3', res);

    if (res.success) {
      setMsaList(res.data.results || []); // ✅ results array
    } else {
      setMsaList([]);
    }
  };

  // Remove form
  const removeForm = (index: number) => {
    if (items.length <= 1) {
      Alert.alert('Cannot remove', 'At least one form is required');
      return;
    }

    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Copy form
  const copyForm = (index: number) => {
    const itemToCopy = items[index];
    const newItem = {
      type: itemToCopy.type,
      data: {...itemToCopy.data, id: Date.now().toString()},
    };

    setItems([...items, newItem]);
  };

  const updateFormData = (index: number, field: string, value: any) => {
    const newItems = [...items];

    if (newItems[index].type === 'milestone') {
      const milestoneData = {...(newItems[index].data as Milestone)};

      // Update the field
      milestoneData[field] = value;

      // Calculate grand total if rate, quantity, or tax changes
      if (field === 'rate' || field === 'quantity' || field === 'tax') {
        milestoneData.grandTotal = calculateGrandTotal(
          milestoneData.rate,
          milestoneData.quantity,
          milestoneData.tax,
        );
      }

      newItems[index].data = milestoneData;
    } else {
      const materialData = {...(newItems[index].data as Material)};

      // Update the field
      materialData[field] = value;

      // Calculate grand total if price, quantity, or tax changes
      if (field === 'price' || field === 'quantity' || field === 'tax') {
        materialData.grandTotal = calculateGrandTotal(
          materialData.price,
          materialData.quantity,
          materialData.tax,
        );
      }

      newItems[index].data = materialData;
    }

    setItems(newItems);
    console.log('newItems', newItems);
  };
  useEffect(() => {
    const fetchCustomApprover = async () => {
      try {
        setLoading(true);
        const params = {limit: 10, msa: 'sow'};
        const response = await Services.getApproverCoustom(params);

        if (response.success) {
          setApproversList(response.data || []);
        } else {
          console.warn('Failed to load approvers:', response.error);
        }
      } catch (err) {
        console.error('Error loading approvers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomApprover();
  }, []);

  // ✅ User taps an item
  const handleSelectApprover = (approver: any) => {
    setSelectedApprover(approver);
    setModalVisible(false);
  };

  const renderApproverItem = ({item}: {item: any}) => {
    const isSelected = selectedApprover?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.approverItem, isSelected && styles.selectedApproverItem]}
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
  };
  // Render a milestone form
  const renderMilestoneForm = (data: Milestone, index: number) => (
    <View key={data.id} style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Milestone {index + 1}</Text>
        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={() => copyForm(index)}
            style={styles.actionButton}>
            <Icon name="content-copy" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeForm(index)}
            style={styles.actionButton}>
            <Icon name="delete" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        value={data.title}
        onChangeText={text => updateFormData(index, 'title', text)}
        placeholder="MILESTONE 1"
        placeholderTextColor={'black'}
      />

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Start Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowStartDatePicker(true)}>
            <Text>{data.startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>End Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowEndDatePicker(true)}>
            <Text>{data.endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Sow Type *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sowType}
          onValueChange={value => setSowType(value)}>
          {sowFileds?.sow_type?.map((item: any) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Currency *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={data.currency}
          onValueChange={value => updateFormData(index, 'currency', value)}>
          <Picker.Item label="Select Currency" value="" />
          {currencies.map((item: any) => (
            <Picker.Item
              key={item.id}
              label={`${item.currency} - ${item.country_name}`}
              value={item.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tax Group *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={taxGroup}
          onValueChange={value => setTaxGroup(value)}>
          {sowFileds?.tax_group?.map((item: any) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Rate *</Text>
      <TextInput
        style={styles.input}
        value={data.rate}
        onChangeText={text => updateFormData(index, 'rate', text)}
        placeholder="ENTER RATE"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Quantity *</Text>
      <TextInput
        style={styles.input}
        value={data.quantity}
        onChangeText={text => updateFormData(index, 'quantity', text)}
        placeholder="1"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Tax *</Text>
      <TextInput
        style={styles.input}
        value={data.tax}
        onChangeText={text => updateFormData(index, 'tax', text)}
        placeholder="ENTER TAX IN %"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Grand Total *</Text>
      <TextInput
        style={styles.input}
        value={data.grandTotal}
        editable={false} // Make it read-only since it's calculated
        placeholder="GRAND TOTAL"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />
      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={data.description}
        onChangeText={text => updateFormData(index, 'description', text)}
        placeholder="Enter description"
        placeholderTextColor={'black'}
        multiline
      />

      <Text style={styles.label}>Comments *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={data.comments}
        onChangeText={text => updateFormData(index, 'comments', text)}
        placeholder="Enter comments"
        placeholderTextColor={'black'}
        multiline
      />
    </View>
  );

  // Render a material form
  const renderMaterialForm = (data: Material, index: number) => (
    <View key={data.id} style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Material {index + 1}</Text>
        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={() => copyForm(index)}
            style={styles.actionButton}>
            <Icon name="content-copy" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeForm(index)}
            style={styles.actionButton}>
            <Icon name="delete" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Material Title *</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setMaterialTitleModal(true)}>
        <Text>{data.title || 'Select Material'}</Text>
      </TouchableOpacity>

      <SelectPickerModal
        visible={materialTitleModal}
        title="Select Material"
        data={materialTitleData}
        selectedValue={data.title}
        onSelect={item => {
          updateFormData(index, 'title', item.name);
        }}
        onClose={() => setMaterialTitleModal(false)}
      />

      <Text style={styles.label}>Price *</Text>
      <TextInput
        style={styles.input}
        value={data.price}
        onChangeText={text => updateFormData(index, 'price', text)}
        placeholder="ENTER PRICE"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Material Number *</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          setActiveMaterialIndex(index);
          setMaterialNumberModal(true);
        }}>
        <Text>{data.materialNumber || 'Select Material Number'}</Text>
      </TouchableOpacity>

      <SelectPickerModal
        visible={materialNumberModal}
        title="Select Material Number"
        data={materialNumberData}
        selectedValue={data.materialNumber}
        onSelect={item => {
          updateFormData(index, 'materialNumber', item.id);
        }}
        onClose={() => setMaterialNumberModal(false)}
      />

      <Text style={styles.label}>Quantity *</Text>
      <TextInput
        style={styles.input}
        value={data.quantity}
        onChangeText={text => updateFormData(index, 'quantity', text)}
        placeholder="1"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Material description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={data.description}
        onChangeText={text => updateFormData(index, 'description', text)}
        placeholder="ENTER MATERIAL DESCRIPTION"
        multiline
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Tax % *</Text>
      <TextInput
        style={styles.input}
        value={data.tax}
        onChangeText={text => updateFormData(index, 'tax', text)}
        placeholder="ENTER TAX IN %"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Base unit of measure *</Text>
      <TextInput
        style={styles.input}
        value={data.baseUnit}
        onChangeText={text => updateFormData(index, 'baseUnit', text)}
        placeholder="ENTER BASE UNIT OF MEASURE"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Grand Total *</Text>
      <TextInput
        style={styles.input}
        value={data.grandTotal}
        editable={false} // Make it read-only since it's calculated
        placeholder="GRAND TOTAL"
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Currency *</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setCurrencyModal(true)}>
        <Text>{data.currencyName || 'Select Currency'}</Text>
      </TouchableOpacity>

      <SelectPickerModal
        visible={currencyModal}
        title="Select Currency"
        data={currencyData}
        selectedValue={data.currency}
        onSelect={item => {
          updateFormData(index, 'currency', item.id);
          updateFormData(index, 'currencyName', item.name);
        }}
        onClose={() => setCurrencyModal(false)}
      />

      <Text style={styles.label}>Old material number *</Text>
      <TextInput
        style={styles.input}
        value={data.oldMaterialNumber}
        onChangeText={text => updateFormData(index, 'oldMaterialNumber', text)}
        placeholder="ENTER OLD MATERIAL NUMBER"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Tax Group *</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setTaxGroupModal(true)}>
        <Text>{data?.taxGroupName || 'Select Tax Group'}</Text>
      </TouchableOpacity>

      <SelectPickerModal
        visible={taxGroupModal}
        title="Select Tax Group"
        data={taxGroupData}
        selectedValue={data.taxGroup}
        onSelect={item => {
          updateFormData(index, 'taxGroup', item.id);
          updateFormData(index, 'taxGroupName', item.name);
        }}
        onClose={() => setTaxGroupModal(false)}
      />

      <Text style={styles.label}>Lead time *</Text>
      <TextInput
        style={styles.input}
        value={data.leadTime}
        onChangeText={text => updateFormData(index, 'leadTime', text)}
        placeholder="ENTER LEAD TIME"
        placeholderTextColor={'black'}
      />

      <Text style={styles.label}>Order unit of measure *</Text>
      <TextInput
        style={styles.input}
        value={data.orderUnit}
        onChangeText={text => updateFormData(index, 'orderUnit', text)}
        placeholder="ENTER ORDER UNIT OF MEASURE"
        placeholderTextColor={'black'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView style={styles.scrollView}>
        {/* <Text style={styles.screenTitle}>Add Statement of work</Text> */}

        {/* Main Form */}
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.sectionTitle}>
              Select Master Service Agreement
            </Text>

            {/* Input with dropdown toggle */}
            <TouchableOpacity onPress={() => setShowDropdown(true)}>
              <TextInput
                style={styles.input}
                value={msa}
                placeholder="Select MSA"
                placeholderTextColor="black"
                editable={false}
                pointerEvents="none" // ✅ THIS IS THE FIX
              />
            </TouchableOpacity>

            {/* Dropdown */}
            {showDropdown && (
              <View style={styles.dropdown}>
                {loading ? (
                  <Text style={styles.loadingText}>Loading...</Text>
                ) : msaList.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No service MSA is created
                  </Text>
                ) : (
                  <FlatList
                    data={msaList}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                    nestedScrollEnabled
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => handleMsaSelect(item)}>
                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
          </View>

          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="ENTER TITLE"
            placeholderTextColor={'black'}
          />

          <Text style={styles.label}>Statement of work Number *</Text>
          <TextInput
            style={styles.input}
            value={sowNumber}
            onChangeText={setSowNumber}
            placeholder="ENTER SOW NUMBER"
            placeholderTextColor={'black'}
          />

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setActiveDatePicker('start')}>
                <Text>{startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>End Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setActiveDatePicker('end')}>
                <Text>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Previous Contract / Other *</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleFilePick}>
            <Text style={styles.uploadButtonText}>
              {attachments.length > 0
                ? `${attachments.length} file(s) selected`
                : 'Upload Files'}
            </Text>
          </TouchableOpacity>
          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              <Text style={styles.attachmentsTitle}>Selected Files:</Text>
              {attachments.map((file, index) => (
                <Text key={index} style={styles.attachmentName}>
                  {file.name}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Add Milestone/Material Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Add Milestone/Material</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.addButton,
                currentFormType === 'milestone' && styles.activeButton,
              ]}
              onPress={() => addForm('milestone')}>
              <Text style={styles.addButtonText}>Add Milestone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton,
                currentFormType === 'material' && styles.activeButton,
              ]}
              onPress={() => addForm('material')}>
              <Text style={styles.addButtonText}>Add Material</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Render all forms */}
        {items.map((item, index) =>
          item.type === 'milestone'
            ? renderMilestoneForm(item.data as Milestone, index)
            : renderMaterialForm(item.data as Material, index),
        )}

        <View style={styles.radioContainer}>
          <View>
            {/* Radio button */}

            <Text style={styles.label}>SOW Approver *</Text>

            {/* Button to open modal */}
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.selectButtonText}>
                {selectedApprover
                  ? `${selectedApprover.first_name} ${selectedApprover.last_name}`
                  : 'Select Approver'}
              </Text>
            </TouchableOpacity>

            {/* Show selected details */}
            {selectedApprover && (
              <View style={styles.selectedApproverContainer}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>
                    {selectedApprover.first_name?.charAt(0)}
                    {selectedApprover.last_name?.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.approverLabel}>
                    {selectedApprover.first_name} {selectedApprover.last_name}
                  </Text>
                  <Text style={styles.approverEmail}>
                    {selectedApprover.email}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit()}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()} // ✅ Correct method
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        <DatePickerSheet
          visible={activeDatePicker !== null}
          date={activeDatePicker === 'start' ? startDate : endDate}
          onChange={(event, selectedDate) => {
            if (!selectedDate) return;

            if (activeDatePicker === 'start') {
              setStartDate(selectedDate);
            } else {
              setEndDate(selectedDate);
            }
          }}
          onClose={() => setActiveDatePicker(null)}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Approver</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </Pressable>
              </View>

              {loading ? (
                <ActivityIndicator style={{marginTop: 20}} />
              ) : (
                <FlatList
                  data={approversList}
                  renderItem={renderApproverItem}
                  keyExtractor={item => item.id.toString()}
                  style={styles.approversList}
                />
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  approversList: {
    maxHeight: 400,
  },

  label: {fontSize: 16, fontWeight: '600', marginBottom: 8},

  selectButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f8f8',
  },
  selectButtonText: {fontSize: 15, color: '#333'},

  selectedApproverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmallText: {color: '#fff', fontWeight: 'bold'},
  approverLabel: {fontWeight: '600'},
  approverEmail: {color: '#666'},
  changeText: {marginLeft: 12, color: '#007AFF', fontWeight: '600'},

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
    marginBottom: 10,
  },
  modalTitle: {fontSize: 18, fontWeight: '600'},
  closeButton: {fontSize: 22, color: '#444'},

  selectedApproverItem: {backgroundColor: '#e6f0ff'},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {color: '#fff', fontWeight: 'bold'},
  approverInfo: {flex: 1},
  approverName: {fontWeight: '600', fontSize: 16},
  approverDetails: {color: '#555', fontSize: 14},
  statusContainer: {flexDirection: 'row', alignItems: 'center'},
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 4,
  },
  availableText: {fontSize: 12, color: 'green'},
  // modalContent: {
  //     width: "90%",
  //     backgroundColor: "#fff",
  //     borderRadius: 10,
  //     padding: 16,
  // },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  scrollView: {
    padding: 16,
  } as ViewStyle,
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  sectionHeader: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  } as TextStyle,
  formContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  } as ViewStyle,
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  formActions: {
    flexDirection: 'row',
  } as ViewStyle,
  actionButton: {
    marginLeft: 12,
  } as ViewStyle,
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  } as TextStyle,
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  } as TextStyle,
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  halfInputContainer: {
    width: '48%',
  } as ViewStyle,
  uploadButton: {
    borderWidth: 1,
    borderColor: '#0E3386',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  } as ViewStyle,
  uploadButtonText: {
    color: '#0E3386',
    fontSize: 16,
  } as TextStyle,
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  } as ViewStyle,
  addButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  } as ViewStyle,
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  } as TextStyle,
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  } as ViewStyle,
  submitButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  } as ViewStyle,
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  } as TextStyle,
  cancelButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  } as ViewStyle,
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  } as TextStyle,
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as ViewStyle,

  modalOption: {
    fontSize: 16,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  } as TextStyle,
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeButton: {
    backgroundColor: '#007AFF', // or any color to indicate active state
  },

  attachmentsContainer: {
    marginBottom: 15,
  },
  attachmentsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  attachmentName: {
    color: '#666',
    marginBottom: 3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },

  SelectResource: {
    borderWidth: 1,
    padding: 10,
    borderColor: '#000078',
    borderRadius: 5,
    marginBottom: 10,
    // backgroundColor: '#f0f5ff',
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
  radioOption2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
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

  radioContainer: {
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 12,
    color: '#888',
    fontSize: 14,
  },

  loadingText: {
    textAlign: 'center',
    paddingVertical: 12,
    color: '#555',
  },

  dropdownItemText: {
    fontSize: 14,
    color: '#222',
  },
});

export default CreateServiceSow;
