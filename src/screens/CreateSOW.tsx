import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Switch,
    StyleSheet,
    SafeAreaView,
    Platform,
    Alert,
    Modal,
    Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Services from '../Services/services';
import { ActivityIndicator } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
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
const CreateSOW = ({ navigation }:any) => {
    // Form state
    const [msa, setMsa] = useState('Master Agreement for Contractor');
    const [title, setTitle] = useState('');
    const [sowNumber, setSowNumber] = useState('');
    const [sowType, setSowType] = useState('Fixed Price Contract');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [workTimesheet, setWorkTimesheet] = useState('Day');
    const [currency, setCurrency] = useState('INR');
    const [rate, setRate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState(0);
    const [taxGroup, setTaxGroup] = useState('Income Tax');
    const [taxPercentage, setTaxPercentage] = useState('');
    const [glAccount, setGlAccount] = useState('Consulting');
    const [costCenter, setCostCenter] = useState('Service Cost Center');
    const [grandTotal, setGrandTotal] = useState(0);
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');
    // const [sowApprover, setSowApprover] = useState('manual');
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

    const [selectedMsa, setSelectedMsa] = useState("");
    const [resourceType, setResourceType] = useState<string>("");
    const [sowApprover, setSowApprover] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [approverCoustom, setApproverCoustom] = useState<any>(null);



    const [approversList, setApproversList] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState(null);


    console.log("approverCoustom", approverCoustom);


    useEffect(() => {
        if (msaList.length > 0 && !selectedMsa) {
            setSelectedMsa(msaList[0].id); // auto-select first
        }
    }, [msaList]);



    const handleMsaChange = (id: number) => {
        const msa = msaList.find((item) => item.id === id);
        setSelectedMsa(msa || null);

        // If resource_datail exists, auto-check radio button
        if (msa?.resource_datail?.user_detail) {
            setResourceType("sow");
        } else {
            setResourceType("");
        }
    };

   
  const handleSelectApprover = (approver) => {
    setSelectedApprover(approver);
    setSowApprover('manual');
    setModalVisible(false);
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
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };


    // --- Fetch MSA List ---
    useEffect(() => {
        const fetchMSA = async () => {
            try {
                const data = {
                    limit: 50,
                    offset: 0,
                };

                const response = await Services.getMSAAllList(data);

                // ✅ Correctly accessing results
                let array = response?.data?.results;
                let newArray = [];

                for (let i = 0; i < array?.length; i++) {
                    if (
                        array[i]?.resource &&
                        array[i]?.resource_datail?.id &&
                        array[i]?.resource === array[i]?.resource_datail?.id
                    ) {
                        newArray.push(array[i]);
                    }
                }
                setMsaList(newArray);
            } catch (error) {
                console.error("Error fetching MSA List:", error);
            }
        };

        fetchMSA();
    }, []);



    useEffect(() => {
        const fetchSOWFields = async () => {
            try {
                const response = await Services.getSOWFields();
                console.log("response fetchSOWFields :", response);

                const payload = response?.data?.payload || {};
                setSowFileds(payload);

                // ✅ Default select first option if available
                if (payload?.sow_type?.length > 0) {
                    setSowType(payload.sow_type[0].name);
                }
            } catch (error) {
                console.error("Error fetching SOW details:", error);
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
                console.error("Error loading dropdown fields", err);
                Alert.alert("Error", "Failed to load form fields");
            } finally {
                setLoading(false);
            }
        };

        fetchCurrencyDetails();
    }, []);

    useEffect(() => {
        const fetchCoustomApprover = async () => {
            try {
                const data = {
                    limit: 10,
                    msa: "sow"
                };
                const response = await Services.getApproverCoustom(data);
                console.log("fetchCoustomApprover", response.data);

                if (response.success) {
                    setApproversList(response.data || [])
                    setApproverCoustom(response.data);
                }
            } catch (err) {
                console.error("Error loading approver", err);
            }
        };
        fetchCoustomApprover();
    }, []);



    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0033CC" />
            </View>
        );
    }
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


//   const handleSubmit = () => {
//   if (!title || !sowNumber || !rate || !quantity || !selectedMsa) {
//     Alert.alert('Error', 'Please fill all required fields');
//     return;
//   }

//   if (sowApprover === 'manual' && !selectedApprover) {
//     Alert.alert('Error', 'Please select an approver');
//     return;
//   }

//   // Find the actual objects for dropdown values (not just labels)
//   const selectedSowType = sowFileds.sow_type.find(item => item.name === sowType);
//   const selectedTaxGroup = sowFileds.tax_group.find(item => item.name === taxGroup);
//   const selectedAccount = sowFileds.account.find(item => item.name === glAccount);
//   const selectedCostCenter = sowFileds.cost_center.find(item => item.name === costCenter);
//   const selectedCurrency = currencies.find(item => item.currency === currency);

//   // Prepare FormData for API
//   const formData = new FormData();
  
//   // Add all required fields
//   formData.append('msa', selectedMsa.id);
//   formData.append('title', title);
//   formData.append('sow_number', sowNumber);
//   formData.append('sow_type', selectedSowType.id);
//   formData.append('start_date', formatDateForAPI(startDate));
//   formData.append('end_date', formatDateForAPI(endDate));
  
//   // Resource handling
//   if (resourceType === "sow" && selectedMsa?.resource_datail?.id) {
//     formData.append('resource', selectedMsa.resource_datail.id);
//   } else {
//     // You need to handle the case where no resource is selected
//     Alert.alert('Error', 'Please select a resource');
//     return;
//   }
  
//   // Timesheet type (is_hour vs is_day)
//   formData.append('is_hour', workTimesheet === 'Hour');
//   formData.append('is_day', workTimesheet === 'Day');
  
//   // Currency and pricing
//   formData.append('currency', selectedCurrency.id);
//   formData.append('work_rate', parseFloat(rate));
//   formData.append('work_quantity', parseFloat(quantity));
//   formData.append('amount', amount);
  
//   // Tax information
//   formData.append('tax_group', selectedTaxGroup.id);
//   formData.append('tax_percent', parseFloat(taxPercentage || '0'));
  
//   // Accounting
//   formData.append('account', selectedAccount.id);
//   formData.append('cost_center', selectedCostCenter.id);
  
//   // Additional information
//   formData.append('description', description);
//   formData.append('comments', comments);
  
//   // Status and approval
//   formData.append('status', 'pending_approval');
  
//   // Approver selection
//   if (sowApprover === 'manual' && selectedApprover) {
//     formData.append('approver', selectedApprover.id);
//     formData.append('sow_flow', '1'); // Manual approval flow
//   } else {
//     formData.append('sow_flow', '2'); // Automatic approval flow
//     // For automatic approval, you might not need to send an approver ID
//     // or your API might handle it differently
//   }
  
//   // Final calculated amount
//   formData.append('grand_total', grandTotal);

//   console.log('Form data to submit:', formData);
//      const result = await Services.createSOW(formData);
    
//     if (result.success) {
//       Alert.alert('Success', 'SOW created successfully!');
//       navigation.goBack();
//     } else {
//       Alert.alert('Error', result.error?.message || 'Failed to create SOW');
//     }
  
//    catch (error) {
//     console.error('Error submitting form:', error);
//     Alert.alert('Error', 'An unexpected error occurred');
//   }

//   // Here you would typically send the formData to your API
//   // Example: Services.createSOW(formData);
//   Alert.alert('Success', 'SOW created successfully!');
//   navigation.goBack();
// };

// Helper function to format date for API

const handleSubmit = async () => {
  if (!title || !sowNumber || !rate || !quantity || !selectedMsa) {
    Alert.alert('Error', 'Please fill all required fields');
    return;
  }

  if (sowApprover === 'manual' && !selectedApprover) {
    Alert.alert('Error', 'Please select an approver');
    return;
  }

  try {
    // Find the actual objects for dropdown values
    const selectedSowType = sowFileds.sow_type.find(item => item.name === sowType);
    const selectedTaxGroup = sowFileds.tax_group.find(item => item.name === taxGroup);
    const selectedAccount = sowFileds.account.find(item => item.name === glAccount);
    const selectedCostCenter = sowFileds.cost_center.find(item => item.name === costCenter);
    const selectedCurrency = currencies.find(item => item.currency === currency);

    // Prepare FormData for API
    const formData = new FormData();
    
    // Add all required fields
    formData.append('msa', selectedMsa.id);
    formData.append('title', title);
    formData.append('sow_number', sowNumber);
    formData.append('sow_type', selectedSowType.id);
    formData.append('start_date', formatDateForAPI(startDate));
    formData.append('end_date', formatDateForAPI(endDate));
    
    // Resource handling
    if (resourceType === "sow" && selectedMsa?.resource_datail?.id) {
      formData.append('resource', selectedMsa.resource_datail.id);
    } else {
      Alert.alert('Error', 'Please select a resource');
      return;
    }
    
    // Timesheet type (is_hour vs is_day)
    formData.append('is_hour', workTimesheet === 'Hour');
    formData.append('is_day', workTimesheet === 'Day');
    
    // Currency and pricing
    formData.append('currency', selectedCurrency.id);
    formData.append('work_rate', parseFloat(rate));
    formData.append('work_quantity', parseFloat(quantity));
    formData.append('amount', amount);
    
    // Tax information
    formData.append('tax_group', selectedTaxGroup.id);
    formData.append('tax_percent', parseFloat(taxPercentage || '0'));
    
    // Accounting
    formData.append('account', selectedAccount.id);
    formData.append('cost_center', selectedCostCenter.id);
    
    // Additional information
    formData.append('description', description);
    formData.append('comments', comments);
    
    // Status and approval
    formData.append('status', 'pending_approval');
    
    // Approver selection
    if (sowApprover === 'manual' && selectedApprover) {
      formData.append('approver', selectedApprover.id);
      formData.append('sow_flow', '1'); // Manual approval flow
    } else {
      formData.append('sow_flow', '2'); // Automatic approval flow
    }
    
    // Final calculated amount
    formData.append('grand_total', grandTotal);

    console.log('Form data to submit:', formData);
    
    // Call the API
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

// Helper function to format date for API
const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day} 00:00:00`;
};





    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Add Statement of Work</Text>

                <Text style={styles.label}>Master Service Agreement *</Text>
                <View style={styles.pickerContainer}>

                    <Picker
                        selectedValue={selectedMsa?.id || ""}
                        onValueChange={(value) => handleMsaChange(value)}
                    >
                        {msaList.map((item) => (
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>STATEMENT OF WORK DETAILS</Text>

                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ENTER TITLE"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>Statement of Work Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number"
                        value={sowNumber}
                        onChangeText={setSowNumber}
                    />

                    <Text style={styles.addSOWText}>Add SOW Work</Text>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Sow Type *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={sowType}
                                    onValueChange={(value) => setSowType(value)}
                                    style={styles.picker}
                                >
                                    {sowFileds?.sow_type?.map((item: any) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.name}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Start Date *</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Text>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>End Date *</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowEndDatePicker(true)}
                            >
                                <Text>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.label}>Select Resource *</Text>
                    <View style={styles.SelectResource}>
                        <TouchableOpacity
                            style={[
                                styles.radioOption2,
                                resourceType === "sow"
                            ]}
                            onPress={() => setResourceType("sow")}
                        >
                            <Text >SOW for Resource</Text>
                            <View style={styles.radioCircle}>
                                {resourceType === "sow" && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity>

                        {/* 🔹 Show resource details only if selectedMsa has resource_datail.user_detail */}
                        {selectedMsa?.resource_datail?.user_detail && (
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 8,
                                paddingLeft: 12,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "#000078",
                                paddingVertical: 5,
                            }}>
                                {/* Avatar with initials */}
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "#000078", // your theme color
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 10,
                                        backgroundColor: "#f2f2f2",
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#000078" }}>
                                        {(() => {
                                            const firstName = selectedMsa.resource_datail.user_detail.first_name || "";
                                            const lastName = selectedMsa.resource_datail.user_detail.last_name || "";
                                            const initials =
                                                (firstName.charAt(0) || "").toUpperCase() +
                                                (lastName.charAt(lastName.length - 1) || "").toUpperCase();
                                            return initials;
                                        })()}
                                    </Text>
                                </View>

                                {/* Full Name */}
                                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                                    {selectedMsa.resource_datail.user_detail.first_name}{" "}
                                    {selectedMsa.resource_datail.user_detail.last_name}
                                </Text>
                            </View>
                        )}




                    </View>

                    <Text style={styles.label}>Work Timesheet *</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={[styles.radioOption, workTimesheet === 'Day' && styles.radioSelected]}
                            onPress={() => setWorkTimesheet('Day')}
                        >
                            <Text style={styles.radioText}>Day</Text>
                            <View style={styles.radioCircle}>
                                {workTimesheet === 'Day' && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.radioOption, workTimesheet === 'Hour' && styles.radioSelected]}
                            onPress={() => setWorkTimesheet('Hour')}
                        >
                            <Text style={styles.radioText}>Hour</Text>
                            <View style={styles.radioCircle}>
                                {workTimesheet === 'Hour' && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Costing for Resource</Text>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Currency *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={currency}
                                    onValueChange={(value) => setCurrency(value)}
                                    style={styles.picker}
                                >
                                    {currencies.map((item: any) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={`${item.currency} - ${item.country_name}`}
                                            value={item.currency}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Rate *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ENTER RATE"
                                value={rate}
                                onChangeText={setRate}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Quantity *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="22"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                            />
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
                        <View style={styles.column}>
                            <Text style={styles.label}>Tax Group *</Text>
                            <View style={styles.pickerContainer}>


                                <Picker
                                    selectedValue={taxGroup}
                                    onValueChange={(value) => setTaxGroup(value)}
                                    style={styles.picker}
                                >
                                    {sowFileds?.tax_group?.map((item: any) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.name}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Tax % *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ENTER TAX IN %"
                                value={taxPercentage}
                                onChangeText={setTaxPercentage}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>GI Account *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={taxGroup}
                                    onValueChange={(value) => setGlAccount(value)}
                                    style={styles.picker}
                                >
                                    {sowFileds?.account?.map((item: any) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.name}
                                        />
                                    ))}

                                </Picker>
                            </View>
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Cost Center *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={costCenter}
                                    onValueChange={(value) => setCostCenter(value)}
                                    style={styles.picker}
                                >
                                    {sowFileds?.cost_center?.map((item: any) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name}
                                            value={item.name}
                                        />
                                    ))}

                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Grand Total *</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput, styles.totalInput]}
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
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Comments *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter comments"
                        value={comments}
                        onChangeText={setComments}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.radioContainer}>
                        {/* <TouchableOpacity
                            style={[styles.radioOption, sowApprover === 'manual' && styles.radioSelected]}
                            onPress={() => setSowApprover('manual')}
                        >
                            <Text style={styles.radioText}>Sow Approver</Text>
                            <View style={styles.radioCircle}>
                                {sowApprover === 'manual' && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity> */}

                        <View>
                            {/* Radio button */}

                            <Text style={styles.label}>SOW Approver *</Text>
                            <View style={styles.SelectResource}>
                                <TouchableOpacity
                                    style={[styles.radioOption2, sowApprover === 'manual' && styles.radioSelected]}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text style={styles.radioText}>Sow Approver</Text>
                                    <View style={styles.radioCircle}>
                                        {sowApprover === 'manual' && <View style={styles.radioInnerCircle} />}
                                    </View>
                                </TouchableOpacity>

                              
                           

                            {/* Show selected approver details */}
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
                            {/* <TouchableOpacity
                                style={[styles.radioOption, sowApprover === "manual" && styles.radioSelected]}
                                onPress={handleSelectApprover}
                            >
                                <Text style={styles.radioText}>Sow Approver</Text>
                                <View style={styles.radioCircle}>
                                    {sowApprover === "manual" && <View style={styles.radioInnerCircle} />}
                                </View>
                            </TouchableOpacity> */}

                            {/* Modal */}
                            {/* <Modal
                                visible={modalVisible}
                                animationType="fade"
                                transparent
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                  
                                        <View style={styles.modalHeader}>
                                            <Text style={styles.modalTitle}>Approver Contract Detail</Text>
                                            <Pressable onPress={() => setModalVisible(false)}>
                                                <Text style={styles.closeBtn}>✕</Text>
                                            </Pressable>
                                        </View>

                                     
                                        <Text style={styles.sectionLabel}>User Details</Text>
                                        <View style={styles.inputBox}>
                                            <Text style={{ color: "#666" }}>
                                                {approverCoustom?.length > 0
                                                    ? `${approverCoustom[0]?.first_name ?? ""} ${approverCoustom[0]?.last_name ?? ""}`
                                                    : "No Approver"}
                                            </Text>

                                        </View>

                                        <Text style={styles.sectionLabel}>Select Approver Details</Text>
                                        <View style={styles.approverBox}>
                                            <View style={styles.avatar}>
                                                <Text style={styles.avatarText}>
                                                    {approverCoustom[0].first_name?.charAt(0)}
                                                    {approverCoustom[0].last_name?.charAt(0)}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.name}>
                                                    {approverCoustom[0].first_name} {approverCoustom[0].last_name}
                                                </Text>
                                                <Text style={styles.details}>
                                                    {approverCoustom[0].email} | {approverCoustom[0].contact_number}

                                                </Text>
                                            </View>
                                            <View style={styles.statusDot} />
                                            <Text style={styles.available}>Available</Text>
                                        </View>
                                    </View>
                                </View>
                            </Modal> */}
                              <TouchableOpacity
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
                                </TouchableOpacity>
                        </View>

                        {/* <TouchableOpacity
                            style={[styles.radioOption, sowApprover === 'auto' && styles.radioSelected]}
                            onPress={() => setSowApprover('auto')}
                        >
                            <Text style={styles.radioText}>Automatic Approval</Text>
                            <View style={styles.radioCircle}>
                                {sowApprover === 'auto' && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity> */}
                    </View>

                    {/* <View style={styles.approverSection}>
                        <Text style={styles.approverLabel}>[MP] {approver}</Text>
                        <TouchableOpacity>
                            <Text style={styles.changeText}>Change</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
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
                        onChange={onStartDateChange}
                    />
                )}

                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={onEndDateChange}
                    />
                )}


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
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
        marginBottom:10
        // backgroundColor: '#f0f5ff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
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
    },
    column: {
        flex: 1,
        marginRight: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
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
        backgroundColor: '#0033CC',
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
        borderColor: '#0033CC',
        padding: 16,
        borderRadius: 4,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        color: '#0033CC',
        fontWeight: 'bold',
        fontSize: 16,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    closeBtn: {
        fontSize: 18,
        color: "#666",
    },
    sectionLabel: {
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 6,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 10,
    },
    approverBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 10,
        marginTop: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    avatarText: {
        fontWeight: "700",
        color: "#fff",
    },
    name: {
        fontWeight: "700",
    },
    details: {
        fontSize: 12,
        color: "#555",
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "green",
        marginLeft: 10,
    },
    available: {
        marginLeft: 4,
        fontSize: 12,
        color: "green",
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
});

export default CreateSOW;