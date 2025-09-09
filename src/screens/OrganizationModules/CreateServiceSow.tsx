import React, { useEffect, useState } from 'react';
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
    FlatList
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
// import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Services from '../../Services/services';
import { Picker } from "@react-native-picker/picker";
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
    sow_type: DropdownItem[]
};
type FormType = 'milestone' | 'material';

const CreateServiceSow: React.FC = (navigation) => {
    // Main form state
    const [msa, setMsa] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [sowNumber, setSowNumber] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [msaId, setMsaId] = useState<string>('');
    const [attachments, setAttachments] = useState<any[]>([]);
    // Items state
    const [items, setItems] = useState<Array<{ type: FormType; data: Material | Milestone }>>([
        { type: 'milestone', data: createEmptyMilestone() }
    ]);
    const [showApproverModal, setShowApproverModal] = useState<boolean>(false);
    const [msaList, setMsaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const [currentFormType, setCurrentFormType] = useState<FormType>('milestone');

    const [currencies, setCurrencies] = useState<any[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [masterMaterialList, setMasterMaterialList] = useState<any[]>([]);
    const [activeMaterialIndex, setActiveMaterialIndex] = useState<number | null>(null);
    const [fields, setFields] = useState<any>(null);
      const [sowType, setSowType] = useState();
    const [sowFileds, setSowFileds] = useState<SowFieldsType>({
        cost_center: [],
        account: [],
        tax_group: [],
        sow_type: [],
    });

       const [taxGroup, setTaxGroup] = useState();
console.log("currencies",currencies);

    const materialOptions = [
        "Aluminum",
        "Brass",
        "Bronze",
        "Carbon Fiber",
        "Ceramic",
        "Concrete",
        "Copper",
        "Fabric",
        "Fiberglass",
        "Glass",
        "Granite",
        "Iron",
        "Leather",
        "Marble",
        "Metal",
        "Paper",
        "Plastic",
        "Plywood",
        "Polycarbonate",
        "PVC",
        "Rubber",
        "Silicone",
        "Stainless Steel",
        "Steel",
        "Stone",
        "Titanium",
        "Vinyl",
        "Wood",
    ];

  const calculateGrandTotal = (rate: string, quantity: string, tax: string): string => {
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
        console.log("response fetchSOWFields :", response);

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
        console.error("Error fetching SOW details:", error);
      }
    };

    fetchSOWFields();
  }, []);
    {
        useEffect(() => {
            const fetchMaterialDetails = async () => {
                if (activeMaterialIndex !== null && items[activeMaterialIndex].type === 'material') {
                    const materialData = items[activeMaterialIndex].data as Material;

                    if (materialData.materialNumber) {
                        console.log("materialData.materialNumber", materialData.materialNumber);

                        try {
                            // Fetch material details using the UID
                            const response = await Services.getMaterialDetails(materialData.materialNumber);
                            console.log("materialData response", response);

                            if (response.success) {
                                const detailData = response.data;
                                console.log("old_material_number response", detailData);

                                // Update the form with the fetched data
                                updateFormData(activeMaterialIndex, 'description', detailData.description || '');
                                updateFormData(activeMaterialIndex, 'title', detailData.description || '');
                                updateFormData(activeMaterialIndex, 'baseUnit', detailData.unit_of_measure || '');
                                updateFormData(activeMaterialIndex, 'oldMaterialNumber', detailData.old_material_number?.toString() || '');
                                updateFormData(activeMaterialIndex, 'orderUnit', detailData.order_unit || '');

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
        }, [items])
    }
    useEffect(() => {
        const fetchCurrencyDetails = async () => {
            try {
                const response = await Services.getCurrencyDetails();
                if (response.success) {
                    setCurrencies(response.data);

                }
            } catch (err) {
                console.error("Error loading dropdown fields", err);
                Alert.alert("Error", "Failed to load form fields");
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
                console.error("Error loading dropdown fields", err);
                Alert.alert("Error", "Failed to load form fields");
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
                    console.log("MasterMaterialList Response:", response.data);
                } else {
                    setMasterMaterialList([]);
                }
            } catch (err) {
                console.error("Error loading dropdown fields", err);
                Alert.alert("Error", "Failed to load Material List");
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
            comments: ''
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
            oldMaterialNumber: '',
            taxGroup: '',
            leadTime: '',
            orderUnit: ''
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
                comments: milestone.comments
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
                old_material_number: material.oldMaterialNumber,
                lead_time: material.leadTime,
                order_unit: material.orderUnit
            }));

            formData.append('materials', JSON.stringify(materialData));
        }

        // Add attachments
        attachments.forEach((file, index) => {
            formData.append('attachment_files', {
                uri: file.uri,
                type: file.type,
                name: file.name
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
                milestones_count: items.filter(item => item.type === 'milestone').length,
                materials_count: items.filter(item => item.type === 'material').length,
                attachments_count: attachments.length
            });
console.log("formData",formData);

            // Call API
            const response = await Services.createServiceSOW(formData);

            if (response.success) {
                Alert.alert('Success', 'SOW created successfully!');
                // Reset form or navigate away
            } else {
                Alert.alert(
  'Error',
  response.error?.data
    ? JSON.stringify(response.error.data)   // show backend error response
    : response.error?.message || 'Failed to create SOW'
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
            const newItem = type === 'milestone'
                ? { type: 'milestone', data: createEmptyMilestone() }
                : { type: 'material', data: createEmptyMaterial() };

            setItems([newItem]);
        } else {
            // If same type, just add a new form
            const newItem = type === 'milestone'
                ? { type: 'milestone', data: createEmptyMilestone() }
                : { type: 'material', data: createEmptyMaterial() };

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
            offset: 0
        }
        const res = await Services.getMSAServiceList(data);
        setLoading(false);

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
            data: { ...itemToCopy.data, id: Date.now().toString() }
        };

        setItems([...items, newItem]);
    };

    // Update form data
    // const updateFormData = (index: number, field: string, value: any) => {
    //     const newItems = [...items];
    //     if (newItems[index].type === 'milestone') {
    //         (newItems[index].data as Milestone) = {
    //             ...newItems[index].data as Milestone,
    //             [field]: value
    //         };
    //     } else {
    //         (newItems[index].data as Material) = {
    //             ...newItems[index].data as Material,
    //             [field]: value
    //         };
    //     }
    //     setItems(newItems);
    //     console.log("newItems", newItems);

    // };

      const updateFormData = (index: number, field: string, value: any) => {
    const newItems = [...items];
    
    if (newItems[index].type === 'milestone') {
      const milestoneData = { ...newItems[index].data as Milestone };
      
      // Update the field
      milestoneData[field] = value;
      
      // Calculate grand total if rate, quantity, or tax changes
      if (field === 'rate' || field === 'quantity' || field === 'tax') {
        milestoneData.grandTotal = calculateGrandTotal(
          milestoneData.rate,
          milestoneData.quantity,
          milestoneData.tax
        );
      }
      
      newItems[index].data = milestoneData;
    } else {
      const materialData = { ...newItems[index].data as Material };
      
      // Update the field
      materialData[field] = value;
      
      // Calculate grand total if price, quantity, or tax changes
      if (field === 'price' || field === 'quantity' || field === 'tax') {
        materialData.grandTotal = calculateGrandTotal(
          materialData.price,
          materialData.quantity,
          materialData.tax
        );
      }
      
      newItems[index].data = materialData;
    }
    
    setItems(newItems);
    console.log("newItems", newItems);
  };

    // Render a milestone form
    const renderMilestoneForm = (data: Milestone, index: number) => (
        <View key={data.id} style={styles.formContainer}>
            <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Milestone {index + 1}</Text>
                <View style={styles.formActions}>
                    <TouchableOpacity onPress={() => copyForm(index)} style={styles.actionButton}>
                        <Icon name="content-copy" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeForm(index)} style={styles.actionButton}>
                        <Icon name="delete" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.label}>Title *</Text>
            <TextInput
                style={styles.input}
                value={data.title}
                onChangeText={(text) => updateFormData(index, 'title', text)}
                placeholder="MILESTONE 1"
            />

            <View style={styles.row}>
                <View style={styles.halfInputContainer}>
                    <Text style={styles.label}>Start Date *</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowStartDatePicker(true)}
                    >
                        <Text>{data.startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.halfInputContainer}>
                    <Text style={styles.label}>End Date *</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowEndDatePicker(true)}
                    >
                        <Text>{data.endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                </View>
            </View>



      <Text style={styles.label}>Sow Type *</Text>
                              <View style={styles.pickerContainer}>
                                  <Picker
                                      selectedValue={sowType}
                                      onValueChange={(value) => setSowType(value)}
                                  >
                                      {sowFileds?.sow_type?.map((item: any) => (
                                          <Picker.Item
                                              key={item.id}
                                              label={item.name}
                                              value={item.id}
                                          />
                                      ))}
                                  </Picker>
                              </View>



            <Text style={styles.label}>Currency *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={data.currency}
              onValueChange={(value) => updateFormData(index, 'currency', value)}

                >
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







            {/* <Text style={styles.label}>Tax Group *</Text>
            <TextInput
                style={styles.input}
                value={data.taxGroup}
                onChangeText={(text) => updateFormData(index, 'taxGroup', text)}
                placeholder="Tax Group"
            /> */}

 <Text style={styles.label}>Tax Group *</Text>
                            <View style={styles.pickerContainer}>


                                <Picker
                                    selectedValue={taxGroup}
                                    onValueChange={(value) => setTaxGroup(value)}
                                >
                                    {sowFileds?.tax_group?.map((item: any) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.id}
                                        />
                                    ))}
                                </Picker>
                            </View>



            <Text style={styles.label}>Rate *</Text>
            <TextInput
                style={styles.input}
                value={data.rate}
                onChangeText={(text) => updateFormData(index, 'rate', text)}
                placeholder="ENTER RATE"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Quantity *</Text>
            <TextInput
                style={styles.input}
                value={data.quantity}
                onChangeText={(text) => updateFormData(index, 'quantity', text)}
                placeholder="1"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Tax *</Text>
            <TextInput
                style={styles.input}
                value={data.tax}
                onChangeText={(text) => updateFormData(index, 'tax', text)}
                placeholder="ENTER TAX IN %"
                keyboardType="numeric"
            />

             <Text style={styles.label}>Grand Total *</Text>
      <TextInput
        style={styles.input}
        value={data.grandTotal}
        editable={false} // Make it read-only since it's calculated
        placeholder="GRAND TOTAL"
        keyboardType="numeric"
      />
            <Text style={styles.label}>Description *</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={data.description}
                onChangeText={(text) => updateFormData(index, 'description', text)}
                placeholder="Enter description"
                multiline
            />

            <Text style={styles.label}>Comments *</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={data.comments}
                onChangeText={(text) => updateFormData(index, 'comments', text)}
                placeholder="Enter comments"
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
                    <TouchableOpacity onPress={() => copyForm(index)} style={styles.actionButton}>
                        <Icon name="content-copy" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeForm(index)} style={styles.actionButton}>
                        <Icon name="delete" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.label}>Material Title *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={data.material}
                    onValueChange={(value) => updateFormData(index, 'material', value)}
                >
                    <Picker.Item label="Select Material" value="" />
                    {materialOptions.map((item, idx) => (
                        <Picker.Item
                            key={idx}
                            label={item}
                            value={item}
                        />
                    ))}
                </Picker>
            </View>




            <Text style={styles.label}>Price *</Text>
            <TextInput
                style={styles.input}
                value={data.price}
                onChangeText={(text) => updateFormData(index, 'price', text)}
                placeholder="ENTER PRICE"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Material Number *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={data.materialNumber}
                    onValueChange={(value) => {
                        // Set the active index before changing the value
                        setActiveMaterialIndex(index);
                        updateFormData(index, "materialNumber", value);
                    }}
                >
                    <Picker.Item label="Select Material Number" value="" />
                    {masterMaterialList.map((item, idx) => (
                        <Picker.Item
                            key={item.uid || idx}
                            label={`${item.material_number} (${item.description})`}
                            value={item.material_number} // Store the UID instead of material_number
                        />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Quantity *</Text>
            <TextInput
                style={styles.input}
                value={data.quantity}
                onChangeText={(text) => updateFormData(index, 'quantity', text)}
                placeholder="1"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Material description *</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={data.description}
                onChangeText={(text) => updateFormData(index, 'description', text)}
                placeholder="ENTER MATERIAL DESCRIPTION"
                multiline
            />

            <Text style={styles.label}>Tax % *</Text>
            <TextInput
                style={styles.input}
                value={data.tax}
                onChangeText={(text) => updateFormData(index, 'tax', text)}
                placeholder="ENTER TAX IN %"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Base unit of measure *</Text>
            <TextInput
                style={styles.input}
                value={data.baseUnit}
                onChangeText={(text) => updateFormData(index, 'baseUnit', text)}
                placeholder="ENTER BASE UNIT OF MEASURE"
            />

         <Text style={styles.label}>Grand Total *</Text>
      <TextInput
        style={styles.input}
        value={data.grandTotal}
        editable={false} // Make it read-only since it's calculated
        placeholder="GRAND TOTAL"
        keyboardType="numeric"
      />

            <Text style={styles.label}>Currency *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={data.currency}
                    onValueChange={(value) => updateFormData(index, 'currency', value)}
                >
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

            <Text style={styles.label}>Old material number *</Text>
            <TextInput
                style={styles.input}
                value={data.oldMaterialNumber}
                onChangeText={(text) => updateFormData(index, 'oldMaterialNumber', text)}
                placeholder="ENTER OLD MATERIAL NUMBER"
            />


            <Text style={styles.label}>Tax Group *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={data.taxGroup}
                    onValueChange={(text) => updateFormData(index, 'taxGroup', text)}
                >
                    <Picker.Item label="Select Tax Group" value="" />
                    {fields?.tax_group?.map((item: any) => (
                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                    ))}
                </Picker>
            </View>
            <Text style={styles.label}>Lead time *</Text>
            <TextInput
                style={styles.input}
                value={data.leadTime}
                onChangeText={(text) => updateFormData(index, 'leadTime', text)}
                placeholder="ENTER LEAD TIME"
            />

            <Text style={styles.label}>Order unit of measure *</Text>
            <TextInput
                style={styles.input}
                value={data.orderUnit}
                onChangeText={(text) => updateFormData(index, 'orderUnit', text)}
                placeholder="ENTER ORDER UNIT OF MEASURE"
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView}>
                {/* <Text style={styles.screenTitle}>Add Statement of work</Text> */}

                {/* Main Form */}
                <View style={styles.formContainer}>
                    <View>
                        <Text style={styles.sectionTitle}>Select Master Service Agreement</Text>

                        {/* Input with dropdown toggle */}
                        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                            <TextInput
                                style={styles.input}
                                value={msa}
                                placeholder="Select MSA"
                                editable={false} // prevent typing, only selection allowed
                            />
                        </TouchableOpacity>

                        {/* Dropdown */}
                        {showDropdown && (
                            <View style={styles.dropdown}>
                                {loading ? (
                                    <Text>Loading...</Text>
                                ) : (
                                    <FlatList
                                        data={msaList}
                                        keyExtractor={(item) => item.id.toString()}
                                        scrollEnabled={false}
                                        nestedScrollEnabled={true}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => handleMsaSelect(item)}
                                          
                                            >
                                                <Text>{item.name}</Text>
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
                    />

                    <Text style={styles.label}>Statement of work Number *</Text>
                    <TextInput
                        style={styles.input}
                        value={sowNumber}
                        onChangeText={setSowNumber}
                        placeholder="ENTER SOW NUMBER"
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInputContainer}>
                            <Text style={styles.label}>Start Date *</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Text>{startDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.halfInputContainer}>
                            <Text style={styles.label}>End Date *</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowEndDatePicker(true)}
                            >
                                <Text>{endDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.label}>Previous Contract / Other *</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
                        <Text style={styles.uploadButtonText}>
                            {attachments.length > 0
                                ? `${attachments.length} file(s) selected`
                                : 'Upload Files'
                            }
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
                            style={[styles.addButton, currentFormType === 'milestone' && styles.activeButton]}
                            onPress={() => addForm('milestone')}
                        >
                            <Text style={styles.addButtonText}>Add Milestone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.addButton, currentFormType === 'material' && styles.activeButton]}
                            onPress={() => addForm('material')}
                        >
                            <Text style={styles.addButtonText}>Add Material</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Render all forms */}
                {items.map((item, index) => (
                    item.type === 'milestone'
                        ? renderMilestoneForm(item.data as Milestone, index)
                        : renderMaterialForm(item.data as Material, index)
                ))}

                {/* Sow Approver Section */}
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Sow Approver</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowApproverModal(true)}
                    >
                        <Text>Automatic Approver</Text>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.submitButton}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}  // ✅ Correct method
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Pickers */}
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartDatePicker(false);
                            if (selectedDate) setStartDate(selectedDate);
                        }}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndDatePicker(false);
                            if (selectedDate) setEndDate(selectedDate);
                        }}
                    />
                )}

                {/* Approver Modal */}
                <Modal
                    visible={showApproverModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Approver</Text>
                            <Text style={styles.modalOption}>Automatic Approver</Text>
                            <Text style={styles.modalOption}>Manual Selection</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowApproverModal(false)}
                            >
                                <Text style={styles.modalCloseButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: 1 },
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
        shadowOffset: { width: 0, height: 1 },
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    } as TextStyle,
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
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    } as ViewStyle,
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    } as TextStyle,
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
        borderColor: "#ccc",
        maxHeight: 200,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
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
        borderColor: "#ccc",
        borderRadius: 6,
        marginBottom: 8,
        overflow: "hidden",
    },
});

export default CreateServiceSow;