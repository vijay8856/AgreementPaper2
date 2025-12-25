// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     ScrollView,
//     Switch,
//     StyleSheet,
//     SafeAreaView,
//     Platform,
//     Alert,
//     Modal,
//     Pressable,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';
// import Services from '../Services/services';
// import { ActivityIndicator } from 'react-native-paper';
// import { FlatList } from 'react-native-gesture-handler';
// type DropdownItem = {
//     id: string;
//     name: string;
// };

// type SowFieldsType = {
//     cost_center: DropdownItem[];
//     account: DropdownItem[];
//     tax_group: DropdownItem[];
//     sow_type: DropdownItem[]
// };
// const CreateSOW = ({ navigation }: any) => {
//     // Form state
//     const [msa, setMsa] = useState('Master Agreement for Contractor');
//     const [title, setTitle] = useState('');
//     const [sowNumber, setSowNumber] = useState('');
//     const [sowType, setSowType] = useState('Fixed Price Contract');
//     const [startDate, setStartDate] = useState(new Date());
//     const [endDate, setEndDate] = useState(new Date());
//     const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//     const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//     const [workTimesheet, setWorkTimesheet] = useState('Day');
//     const [currency, setCurrency] = useState('INR');
//     const [rate, setRate] = useState('');
//     const [quantity, setQuantity] = useState('');
//     const [amount, setAmount] = useState(0);
//     const [taxGroup, setTaxGroup] = useState('Income Tax');
//     const [taxPercentage, setTaxPercentage] = useState('');
//     const [glAccount, setGlAccount] = useState('Consulting');
//     const [costCenter, setCostCenter] = useState('Service Cost Center');
//     const [grandTotal, setGrandTotal] = useState(0);
//     const [description, setDescription] = useState('');
//     const [comments, setComments] = useState('');
//     // const [sowApprover, setSowApprover] = useState('manual');
//     const [approver, setApprover] = useState('Manoj Patidar');
//     const [msaList, setMsaList] = useState<any[]>([]);
//     const [sowFileds, setSowFileds] = useState<SowFieldsType>({
//         cost_center: [],
//         account: [],
//         tax_group: [],
//         sow_type: [],
//     });
//     const [currencies, setCurrencies] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     const [selectedMsa, setSelectedMsa] = useState("");
//     const [resourceType, setResourceType] = useState<string>("");
//     const [sowApprover, setSowApprover] = useState("");
//     const [modalVisible, setModalVisible] = useState(false);
//     const [approverCoustom, setApproverCoustom] = useState<any>(null);



//     const [approversList, setApproversList] = useState([]);
//     const [selectedApprover, setSelectedApprover] = useState(null);


//     console.log("approverCoustom", approverCoustom);


//     useEffect(() => {
//         if (msaList.length > 0 && !selectedMsa) {
//             setSelectedMsa(msaList[0].id); // auto-select first
//         }
//     }, [msaList]);



//     const handleMsaChange = (id: number) => {
//         const msa = msaList.find((item) => item.id === id);
//         setSelectedMsa(msa || null);

//         // If resource_datail exists, auto-check radio button
//         if (msa?.resource_datail?.user_detail) {
//             setResourceType("sow");
//         } else {
//             setResourceType("");
//         }
//     };


//     const handleSelectApprover = (approver) => {
//         setSelectedApprover(approver);
//         setSowApprover('manual');
//         setModalVisible(false);
//     };



//     // Calculate amount and grand total
//     useEffect(() => {
//         const calculatedAmount = parseFloat(rate || 0) * parseFloat(quantity || 0);
//         setAmount(calculatedAmount);

//         const taxAmount = calculatedAmount * (parseFloat(taxPercentage || 0) / 100);
//         setGrandTotal(calculatedAmount + taxAmount);
//     }, [rate, quantity, taxPercentage]);

//     // Date picker handlers
//     const onStartDateChange = (event, selectedDate) => {
//         setShowStartDatePicker(Platform.OS === 'ios');
//         if (selectedDate) {
//             setStartDate(selectedDate);
//         }
//     };

//     const onEndDateChange = (event, selectedDate) => {
//         setShowEndDatePicker(Platform.OS === 'ios');
//         if (selectedDate) {
//             setEndDate(selectedDate);
//         }
//     };

//     // Format date for display
//     const formatDate = (date) => {
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit'
//         });
//     };


//     // --- Fetch MSA List ---
//     useEffect(() => {
//         const fetchMSA = async () => {
//             try {
//                 const data = {
//                     limit: 50,
//                     offset: 0,
//                 };

//                 const response = await Services.getMSAAllList(data);

//                 // ✅ Correctly accessing results
//                 let array = response?.data?.results;
//                 let newArray = [];

//                 for (let i = 0; i < array?.length; i++) {
//                     if (
//                         array[i]?.resource &&
//                         array[i]?.resource_datail?.id &&
//                         array[i]?.resource === array[i]?.resource_datail?.id
//                     ) {
//                         newArray.push(array[i]);
//                     }
//                 }
//                 setMsaList(newArray);
//             } catch (error) {
//                 console.error("Error fetching MSA List:", error);
//             }
//         };

//         fetchMSA();
//     }, []);



//     useEffect(() => {
//         const fetchSOWFields = async () => {
//             try {
//                 const response = await Services.getSOWFields();
//                 console.log("response fetchSOWFields :", response);

//                 const payload = response?.data?.payload || {};
//                 setSowFileds(payload);

//                 // ✅ Default select first option if available
//                 if (payload?.sow_type?.length > 0) {
//                     setSowType(payload.sow_type[0].name);
//                 }
//             } catch (error) {
//                 console.error("Error fetching SOW details:", error);
//             }
//         };

//         fetchSOWFields();
//     }, []);


//     useEffect(() => {
//         const fetchCurrencyDetails = async () => {
//             try {
//                 const response = await Services.getCurrencyDetails();
//                 if (response.success) {
//                     setCurrencies(response.data);

//                 }
//             } catch (err) {
//                 console.error("Error loading dropdown fields", err);
//                 Alert.alert("Error", "Failed to load form fields");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCurrencyDetails();
//     }, []);

//     useEffect(() => {
//         const fetchCoustomApprover = async () => {
//             try {
//                 const data = {
//                     limit: 10,
//                     msa: "sow"
//                 };
//                 const response = await Services.getApproverCoustom(data);
//                 console.log("fetchCoustomApprover", response.data);

//                 if (response.success) {
//                     setApproversList(response.data || [])
//                     setApproverCoustom(response.data);
//                 }
//             } catch (err) {
//                 console.error("Error loading approver", err);
//             }
//         };
//         fetchCoustomApprover();
//     }, []);



//     if (loading) {
//         return (
//             <View style={styles.loader}>
//                 <ActivityIndicator size="large" color="#0033CC" />
//             </View>
//         );
//     }
//     const renderApproverItem = ({ item }) => (
//         <TouchableOpacity
//             style={[
//                 styles.approverItem,
//                 selectedApprover?.id === item.id && styles.selectedApproverItem
//             ]}
//             onPress={() => handleSelectApprover(item)}
//         >
//             <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>
//                     {item.first_name?.charAt(0)}{item.last_name?.charAt(0)}
//                 </Text>
//             </View>
//             <View style={styles.approverInfo}>
//                 <Text style={styles.approverName}>
//                     {item.first_name} {item.last_name}
//                 </Text>
//                 <Text style={styles.approverDetails}>
//                     {item.email} | {item.contact_number}
//                 </Text>
//             </View>
//             <View style={styles.statusContainer}>
//                 <View style={styles.statusDot} />
//                 <Text style={styles.availableText}>Available</Text>
//             </View>
//         </TouchableOpacity>
//     );




//     const handleSubmit = async () => {
//         if (!title || !rate || !quantity || !selectedMsa) {
//             Alert.alert('Error', 'Please fill all required fields');
//             return;
//         }

//         if (sowApprover === 'manual' && !selectedApprover) {
//             Alert.alert('Error', 'Please select an approver');
//             return;
//         }

//         try {
//             // Find the actual objects for dropdown values
//             const selectedSowType = sowFileds.sow_type.find(item => item.name === sowType);
//             const selectedTaxGroup = sowFileds.tax_group.find(item => item.name === taxGroup);
//             const selectedAccount = sowFileds.account.find(item => item.name === glAccount);
//             const selectedCostCenter = sowFileds.cost_center.find(item => item.name === costCenter);
//             const selectedCurrency = currencies.find(item => item.currency === currency);

//             // Prepare FormData for API
//             const formData = new FormData();

//             // Add all required fields
//             formData.append('msa', selectedMsa.id);
//             formData.append('title', title);
//             formData.append('sow_number', sowNumber);
//             formData.append('sow_type', selectedSowType.id);
//             formData.append('start_date', formatDateForAPI(startDate));
//             formData.append('end_date', formatDateForAPI(endDate));

//             // Resource handling
//             if (resourceType === "sow" && selectedMsa?.resource_datail?.id) {
//                 formData.append('resource', selectedMsa.resource_datail.id);
//             } else {
//                 Alert.alert('Error', 'Please select a resource');
//                 return;
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
//             formData.append('approver', selectedApprover.id);

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

//     // Helper function to format date for API
//     const formatDateForAPI = (date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day} 00:00:00`;
//     };





//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView style={styles.scrollView}>
//                 <Text style={styles.header}>Add Statement of Work</Text>

//                 <Text style={styles.label}>Master Service Agreement *</Text>
//                 <View style={styles.pickerContainer}>

//                     <Picker
//                         selectedValue={selectedMsa?.id || ""}
//                         onValueChange={(value) => handleMsaChange(value)}
//                     >
//                         {msaList.map((item) => (
//                             <Picker.Item key={item.id} label={item.name} value={item.id} />
//                         ))}
//                     </Picker>

//                 </View>

//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>STATEMENT OF WORK DETAILS</Text>

//                     <Text style={styles.label}>Title *</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="ENTER TITLE"
//                         value={title}
//                         onChangeText={setTitle}
//                     />

//                     <Text style={styles.label}>Statement of Work Number *</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter number"
//                         value={sowNumber}
//                         onChangeText={setSowNumber}
//                     />

//                     <Text style={styles.addSOWText}>Add SOW Work</Text>

//                     <View style={styles.row}>
//                         <View style={styles.column}>
//                             <Text style={styles.label}>Sow Type *</Text>
//                             <View style={styles.pickerContainer}>
//                                 <Picker
//                                     selectedValue={sowType}
//                                     onValueChange={(value) => setSowType(value)}
//                                     style={styles.picker}
//                                 >
//                                     {sowFileds?.sow_type?.map((item: any) => (
//                                         <Picker.Item
//                                             key={item.id}
//                                             label={item.name}
//                                             value={item.name}
//                                         />
//                                     ))}
//                                 </Picker>
//                             </View>
//                         </View>

//                         <View style={styles.column}>
//                             <Text style={styles.label}>Start Date *</Text>
//                             <TouchableOpacity
//                                 style={styles.dateInput}
//                                 onPress={() => setShowStartDatePicker(true)}
//                             >
//                                 <Text>{formatDate(startDate)}</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.column}>
//                             <Text style={styles.label}>End Date *</Text>
//                             <TouchableOpacity
//                                 style={styles.dateInput}
//                                 onPress={() => setShowEndDatePicker(true)}
//                             >
//                                 <Text>{formatDate(endDate)}</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     <Text style={styles.label}>Select Resource *</Text>
//                     <View style={styles.SelectResource}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.radioOption2,
//                                 resourceType === "sow"
//                             ]}
//                             onPress={() => setResourceType("sow")}
//                         >
//                             <Text >SOW for Resource</Text>
//                             <View style={styles.radioCircle}>
//                                 {resourceType === "sow" && <View style={styles.radioInnerCircle} />}
//                             </View>
//                         </TouchableOpacity>

//                         {/* 🔹 Show resource details only if selectedMsa has resource_datail.user_detail */}
//                         {selectedMsa?.resource_datail?.user_detail && (
//                             <View style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 marginTop: 8,
//                                 paddingLeft: 12,
//                                 borderRadius: 10,
//                                 borderWidth: 1,
//                                 borderColor: "#000078",
//                                 paddingVertical: 5,
//                             }}>
//                                 {/* Avatar with initials */}
//                                 <View
//                                     style={{
//                                         width: 40,
//                                         height: 40,
//                                         borderRadius: 20,
//                                         borderWidth: 1,
//                                         borderColor: "#000078", // your theme color
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                         marginRight: 10,
//                                         backgroundColor: "#f2f2f2",
//                                     }}
//                                 >
//                                     <Text style={{ fontSize: 16, fontWeight: "700", color: "#000078" }}>
//                                         {(() => {
//                                             const firstName = selectedMsa.resource_datail.user_detail.first_name || "";
//                                             const lastName = selectedMsa.resource_datail.user_detail.last_name || "";
//                                             const initials =
//                                                 (firstName.charAt(0) || "").toUpperCase() +
//                                                 (lastName.charAt(lastName.length - 1) || "").toUpperCase();
//                                             return initials;
//                                         })()}
//                                     </Text>
//                                 </View>

//                                 {/* Full Name */}
//                                 <Text style={{ fontSize: 14, fontWeight: "600" }}>
//                                     {selectedMsa.resource_datail.user_detail.first_name}{" "}
//                                     {selectedMsa.resource_datail.user_detail.last_name}
//                                 </Text>
//                             </View>
//                         )}




//                     </View>

//                     <Text style={styles.label}>Work Timesheet *</Text>
//                     <View style={styles.radioContainer}>
//                         <TouchableOpacity
//                             style={[styles.radioOption, workTimesheet === 'Day' && styles.radioSelected]}
//                             onPress={() => setWorkTimesheet('Day')}
//                         >
//                             <Text style={styles.radioText}>Day</Text>
//                             <View style={styles.radioCircle}>
//                                 {workTimesheet === 'Day' && <View style={styles.radioInnerCircle} />}
//                             </View>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={[styles.radioOption, workTimesheet === 'Hour' && styles.radioSelected]}
//                             onPress={() => setWorkTimesheet('Hour')}
//                         >
//                             <Text style={styles.radioText}>Hour</Text>
//                             <View style={styles.radioCircle}>
//                                 {workTimesheet === 'Hour' && <View style={styles.radioInnerCircle} />}
//                             </View>
//                         </TouchableOpacity>
//                     </View>

//                     <Text style={styles.sectionTitle}>Costing for Resource</Text>

//                     <View style={styles.row}>
//                         <View style={styles.column}>
//                             <Text style={styles.label}>Currency *</Text>
//                             <View style={styles.pickerContainer}>
//                                 <Picker
//                                     selectedValue={currency}
//                                     onValueChange={(value) => setCurrency(value)}
//                                     style={styles.picker}
//                                 >
//                                     {currencies.map((item: any) => (
//                                         <Picker.Item
//                                             key={item.id}
//                                             label={`${item.currency} - ${item.country_name}`}
//                                             value={item.currency}
//                                         />
//                                     ))}
//                                 </Picker>
//                             </View>
//                         </View>

//                         <View style={styles.column}>
//                             <Text style={styles.label}>Rate *</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="ENTER RATE"
//                                 value={rate}
//                                 onChangeText={setRate}
//                                 keyboardType="numeric"
//                             />
//                         </View>
//                     </View>

//                     <View style={styles.row}>
//                         <View style={styles.column}>
//                             <Text style={styles.label}>Quantity *</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="22"
//                                 value={quantity}
//                                 onChangeText={setQuantity}
//                                 keyboardType="numeric"
//                             />
//                         </View>

//                         <View style={styles.column}>
//                             <Text style={styles.label}>Amount *</Text>
//                             <TextInput
//                                 style={[styles.input, styles.disabledInput]}
//                                 value={amount.toFixed(2)}
//                                 editable={false}
//                             />
//                         </View>
//                     </View>

//                     <View style={styles.row}>
//                         <View style={styles.column}>
//                             <Text style={styles.label}>Tax Group *</Text>
//                             <View style={styles.pickerContainer}>


//                                 <Picker
//                                     selectedValue={taxGroup}
//                                     onValueChange={(value) => setTaxGroup(value)}
//                                     style={styles.picker}
//                                 >
//                                     {sowFileds?.tax_group?.map((item: any) => (
//                                         <Picker.Item
//                                             key={item.id}
//                                             label={item.name}
//                                             value={item.name}
//                                         />
//                                     ))}
//                                 </Picker>
//                             </View>
//                         </View>

//                         <View style={styles.column}>
//                             <Text style={styles.label}>Tax % *</Text>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="ENTER TAX IN %"
//                                 value={taxPercentage}
//                                 onChangeText={setTaxPercentage}
//                                 keyboardType="numeric"
//                             />
//                         </View>
//                     </View>

//                     <View style={styles.row}>
//                         <View style={styles.column}>
//                             <Text style={styles.label}>GI Account *</Text>
//                             <View style={styles.pickerContainer}>
//                                 <Picker
//                                     selectedValue={taxGroup}
//                                     onValueChange={(value) => setGlAccount(value)}
//                                     style={styles.picker}
//                                 >
//                                     {sowFileds?.account?.map((item: any) => (
//                                         <Picker.Item
//                                             key={item.id}
//                                             label={item.name}
//                                             value={item.name}
//                                         />
//                                     ))}

//                                 </Picker>
//                             </View>
//                         </View>

//                         <View style={styles.column}>
//                             <Text style={styles.label}>Cost Center *</Text>
//                             <View style={styles.pickerContainer}>
//                                 <Picker
//                                     selectedValue={costCenter}
//                                     onValueChange={(value) => setCostCenter(value)}
//                                     style={styles.picker}
//                                 >
//                                     {sowFileds?.cost_center?.map((item: any) => (
//                                         <Picker.Item
//                                             key={item.id}
//                                             label={item.name}
//                                             value={item.name}
//                                         />
//                                     ))}

//                                 </Picker>
//                             </View>
//                         </View>
//                     </View>

//                     <View style={styles.row}>
//                         <View style={styles.column}>
//                             <Text style={styles.label}>Grand Total *</Text>
//                             <TextInput
//                                 style={[styles.input, styles.disabledInput, styles.totalInput]}
//                                 value={grandTotal.toFixed(2)}
//                                 editable={false}
//                             />
//                         </View>
//                     </View>

//                     <Text style={styles.sectionTitle}>Previous Contract / Other</Text>

//                     <Text style={styles.label}>Previous contracts</Text>
//                     <TouchableOpacity style={styles.uploadButton}>
//                         <Text style={styles.uploadButtonText}>Upload Documents</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.label}>Supporting Documents</Text>
//                     <TouchableOpacity style={styles.uploadButton}>
//                         <Text style={styles.uploadButtonText}>Upload Documents</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.label}>Due Diligence Documents</Text>
//                     <TouchableOpacity style={styles.uploadButton}>
//                         <Text style={styles.uploadButtonText}>Upload Documents</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.label}>Description *</Text>
//                     <TextInput
//                         style={[styles.input, styles.textArea]}
//                         placeholder="Enter description"
//                         value={description}
//                         onChangeText={setDescription}
//                         multiline
//                         numberOfLines={4}
//                     />

//                     <Text style={styles.label}>Comments *</Text>
//                     <TextInput
//                         style={[styles.input, styles.textArea]}
//                         placeholder="Enter comments"
//                         value={comments}
//                         onChangeText={setComments}
//                         multiline
//                         numberOfLines={4}
//                     />

//                     <View style={styles.radioContainer}>


//                         <View>
//                             {/* Radio button */}

//                             <Text style={styles.label}>SOW Approver *</Text>
//                             <View style={styles.SelectResource}>
//                                 <TouchableOpacity
//                                     style={[styles.radioOption2, sowApprover === 'manual' && styles.radioSelected]}
//                                     onPress={() => setModalVisible(true)}
//                                 >
//                                     <Text style={styles.radioText}>Sow Approver</Text>
//                                     <View style={styles.radioCircle}>
//                                         {sowApprover === 'manual' && <View style={styles.radioInnerCircle} />}
//                                     </View>
//                                 </TouchableOpacity>




//                                 {/* Show selected approver details */}
//                                 {selectedApprover && (
//                                     <View style={styles.approverSection}>
//                                         <View style={styles.selectedApproverContainer}>
//                                             <View style={styles.avatarSmall}>
//                                                 <Text style={styles.avatarSmallText}>
//                                                     {selectedApprover.first_name?.charAt(0)}
//                                                     {selectedApprover.last_name?.charAt(0)}
//                                                 </Text>
//                                             </View>
//                                             <View style={styles.approverInfo}>
//                                                 <Text style={styles.approverLabel}>
//                                                     {selectedApprover.first_name} {selectedApprover.last_name}
//                                                 </Text>
//                                                 <Text style={styles.approverEmail}>{selectedApprover.email}</Text>
//                                             </View>
//                                         </View>
//                                         <TouchableOpacity onPress={() => setModalVisible(true)}>
//                                             <Text style={styles.changeText}>Change</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 )}
//                             </View>

//                             <TouchableOpacity
//                                 style={[styles.radioOption, sowApprover === 'auto' && styles.radioSelected]}
//                                 onPress={() => {
//                                     setSowApprover('auto');
//                                     setSelectedApprover(null);
//                                 }}
//                             >
//                                 <Text style={styles.radioText}>Automatic Approval</Text>
//                                 <View style={styles.radioCircle}>
//                                     {sowApprover === 'auto' && <View style={styles.radioInnerCircle} />}
//                                 </View>
//                             </TouchableOpacity>
//                         </View>

//                     </View>


//                 </View>

//                 <View style={styles.buttonContainer}>
//                     <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                         <Text style={styles.submitButtonText}>Submit</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.cancelButton}
//                         onPress={() => navigation.goBack()}
//                     >
//                         <Text style={styles.cancelButtonText}>Cancel</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Date Pickers */}
//                 {showStartDatePicker && (
//                     <DateTimePicker
//                         value={startDate}
//                         mode="date"
//                         display="default"
//                         onChange={onStartDateChange}
//                     />
//                 )}

//                 {showEndDatePicker && (
//                     <DateTimePicker
//                         value={endDate}
//                         mode="date"
//                         display="default"
//                         onChange={onEndDateChange}
//                     />
//                 )}


//                 <Modal
//                     visible={modalVisible}
//                     animationType="slide"
//                     transparent={true}
//                     onRequestClose={() => setModalVisible(false)}
//                 >
//                     <View style={styles.modalOverlay}>
//                         <View style={styles.modalContent}>
//                             <View style={styles.modalHeader}>
//                                 <Text style={styles.modalTitle}>Select Approver</Text>
//                                 <Pressable onPress={() => setModalVisible(false)}>
//                                     <Text style={styles.closeButton}>✕</Text>
//                                 </Pressable>
//                             </View>

//                             <FlatList
//                                 data={approversList}
//                                 renderItem={renderApproverItem}
//                                 keyExtractor={(item) => item.id.toString()}
//                                 style={styles.approversList}
//                             />
//                         </View>
//                     </View>
//                 </Modal>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     loader: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     approversList: {
//         maxHeight: 400,
//     },
//     scrollView: {
//         padding: 16,
//     },
//     header: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         color: '#333',
//     },
//     section: {
//         marginBottom: 20,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         marginTop: 16,
//         color: '#333',
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '500',
//         marginBottom: 8,
//         marginTop: 12,
//         color: '#333',
//     },
//     SelectResource: {
//         borderWidth: 1,
//         padding: 10,
//         borderColor: '#000078',
//         borderRadius: 5,
//         marginBottom: 10
//         // backgroundColor: '#f0f5ff',
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         padding: 12,
//         fontSize: 14,
//         backgroundColor: '#fff',
//     },
//     disabledInput: {
//         backgroundColor: '#f5f5f5',
//         color: '#666',
//     },
//     totalInput: {
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     textArea: {
//         height: 100,
//         textAlignVertical: 'top',
//     },
//     addSOWText: {
//         fontSize: 16,
//         fontWeight: '500',
//         marginTop: 16,
//         marginBottom: 16,
//         color: '#333',
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 16,
//     },
//     column: {
//         flex: 1,
//         marginRight: 8,
//     },
//     pickerContainer: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         overflow: 'hidden',
//         backgroundColor: '#fff',
//     },
//     picker: {
//         height: 50,
//     },
//     dateInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         padding: 12,
//         justifyContent: 'center',
//         backgroundColor: '#fff',
//         height: 50,
//     },
//     radioContainer: {
//         marginVertical: 8,
//     },
//     radioOption2: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 12,
//         borderRadius: 4,
//         marginBottom: 8,

//     },
//     radioOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 12,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         marginBottom: 8,
//         backgroundColor: '#fff',
//     },
//     radioSelected: {
//         borderColor: '#000078',
//         backgroundColor: '#f0f5ff',
//     },
//     radioText: {
//         fontSize: 14,
//     },
//     radioCircle: {
//         height: 20,
//         width: 20,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#000078',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     radioInnerCircle: {
//         height: 12,
//         width: 12,
//         borderRadius: 6,
//         backgroundColor: '#000078',
//     },
//     uploadButton: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         padding: 12,
//         alignItems: 'center',
//         marginBottom: 16,
//         backgroundColor: '#f9f9f9',
//     },
//     uploadButtonText: {
//         color: '#666',
//     },
//     approverSection: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginVertical: 16,
//         padding: 12,
//         backgroundColor: '#f9f9f9',
//         borderRadius: 4,
//     },
//     approverLabel: {
//         fontSize: 14,
//         fontWeight: '500',
//     },
//     changeText: {
//         color: '#0033CC',
//         fontWeight: '500',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 24,
//         marginBottom: 40,
//     },
//     submitButton: {
//         backgroundColor: '#0E3386',
//         padding: 16,
//         borderRadius: 4,
//         flex: 1,
//         marginRight: 8,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: 'white',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     cancelButton: {
//         borderWidth: 1,
//         borderColor: '#0E3386',
//         padding: 16,
//         borderRadius: 4,
//         flex: 1,
//         marginLeft: 8,
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     cancelButtonText: {
//         color: '#0E3386',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },

//     modalOverlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     modalContent: {
//         width: "90%",
//         backgroundColor: "#fff",
//         borderRadius: 10,
//         padding: 16,
//     },
//     modalHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 12,
//     },
//     modalTitle: {
//         fontSize: 16,
//         fontWeight: "700",
//     },
//     closeBtn: {
//         fontSize: 18,
//         color: "#666",
//     },
//     sectionLabel: {
//         fontWeight: "600",
//         marginTop: 10,
//         marginBottom: 6,
//     },
//     inputBox: {
//         borderWidth: 1,
//         borderColor: "#ddd",
//         borderRadius: 6,
//         padding: 10,
//     },
//     approverBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#ddd",
//         borderRadius: 6,
//         padding: 10,
//         marginTop: 6,
//     },
//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: "#ccc",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 10,
//     },
//     avatarText: {
//         fontWeight: "700",
//         color: "#fff",
//     },
//     name: {
//         fontWeight: "700",
//     },
//     details: {
//         fontSize: 12,
//         color: "#555",
//     },
//     statusDot: {
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: "green",
//         marginLeft: 10,
//     },
//     available: {
//         marginLeft: 4,
//         fontSize: 12,
//         color: "green",
//     },
//     approverItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     selectedApproverItem: {
//         backgroundColor: '#f0f5ff',
//     },
//     approverName: {
//         fontSize: 16,
//         fontWeight: '500',
//     },
//     approverDetails: {
//         fontSize: 12,
//         color: '#666',
//     },
//     statusContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },

//     availableText: {
//         fontSize: 12,
//         color: '#4CAF50',
//     },

//     avatarSmall: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         backgroundColor: '#0033CC',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 12,
//     },
//     avatarSmallText: {
//         color: 'white',
//         fontWeight: 'bold',
//         fontSize: 12,
//     },
//     selectedApproverContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     approverInfo: {
//         flex: 1,
//     },
//     approverEmail: {
//         fontSize: 12,
//         color: '#666',
//     },
// });

// export default CreateSOW;



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

const CreateSOW = ({ navigation }: any) => {
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
    const [sowApprover, setSowApprover] = useState("");
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
    const [modalVisible, setModalVisible] = useState(false);
    const [approverCoustom, setApproverCoustom] = useState<any>(null);
    const [approversList, setApproversList] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState(null);

    // Validation state
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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

        // Clear error when MSA is selected
        if (errors.msa) {
            setErrors(prev => ({ ...prev, msa: undefined }));
        }
    };

    const handleSelectApprover = (approver) => {
        setSelectedApprover(approver);
        setSowApprover('manual');
        setModalVisible(false);

        // Clear error when approver is selected
        if (errors.selectedApprover) {
            setErrors(prev => ({ ...prev, selectedApprover: undefined }));
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
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
            // Clear error when start date is selected
            if (errors.startDate) {
                setErrors(prev => ({ ...prev, startDate: undefined }));
            }
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
            // Clear error when end date is selected
            if (errors.endDate) {
                setErrors(prev => ({ ...prev, endDate: undefined }));
            }
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
                return !value ? 'Currency is required' : '';
            case 'rate':
                if (!value) return 'Rate is required';
                if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) return 'Rate must be a positive number';
                return '';
            case 'quantity':
                if (!value) return 'Quantity is required';
                if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) return 'Quantity must be a positive number';
                return '';
            case 'taxGroup':
                return !value ? 'Tax Group is required' : '';
            case 'taxPercentage':
                if (!value) return 'Tax Percentage is required';
                if (isNaN(parseFloat(value)) || parseFloat(value) < 0) return 'Tax Percentage must be a non-negative number';
                return '';
            case 'glAccount':
                return !value ? 'GL Account is required' : '';
            case 'costCenter':
                return !value ? 'Cost Center is required' : '';
            case 'description':
                return !value?.trim() ? 'Description is required' : '';
            case 'comments':
                return !value?.trim() ? 'Comments are required' : '';
            case 'sowApprover':
                return !value ? 'SOW Approver selection is required' : '';
            case 'selectedApprover':
                return sowApprover === 'manual' && !value ? 'Approver must be selected for manual approval' : '';
            default:
                return '';
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));

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
            setErrors(prev => ({ ...prev, [field]: error }));
        } else {
            setErrors(prev => ({ ...prev, [field]: undefined }));
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
        newErrors.selectedApprover = validateField('selectedApprover', selectedApprover);

        // Filter out empty error messages
        const filteredErrors = Object.fromEntries(
            Object.entries(newErrors).filter(([_, value]) => value !== '')
        );

        setErrors(filteredErrors);
        setTouched({
            msa: true, title: true, sowType: true, startDate: true, endDate: true,
            resourceType: true, workTimesheet: true, currency: true, rate: true,
            quantity: true, taxGroup: true, taxPercentage: true, glAccount: true,
            costCenter: true, description: true, comments: true, sowApprover: true,
            selectedApprover: true
        });

        return Object.keys(filteredErrors).length === 0;
    };

    // --- Fetch MSA List ---
    useEffect(() => {
        const fetchMSA = async () => {
            try {
                const data = {
                    limit: 30,
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

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix all errors before submitting');
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
            formData.append('sow_flow', '1');

            // Status and approval
            formData.append('status', 'pending_approval');

            // Handle approver based on selection
            if (sowApprover === 'manual' && selectedApprover) {
                formData.append('approver', selectedApprover.id);
            } else if (sowApprover === 'auto') {
                // For automatic approval, you might need to set a different value or leave it empty
                // Adjust this based on your API requirements
                formData.append('approver', 'auto');
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

    // Helper to check if field should show error
    const shouldShowError = (field: string): boolean => {
        return touched[field] && !!errors[field];
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Add Statement of Work</Text>

            <Text style={styles.label}>Master Service Agreement *</Text>

<View
  style={[
    styles.pickerContainer,
    shouldShowError("msa") && styles.errorBorder,
  ]}
>
  {msaList.length === 0 ? (
    // 👇 Show loader if list is empty
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 50,
      }}
    >
      <ActivityIndicator size="small" color="#007bff" />
    </View>
  ) : (
    // 👇 Normal picker when data exists
    <Picker
      selectedValue={selectedMsa?.id || ""}
      onValueChange={(value) => handleMsaChange(value)}
      onBlur={() => handleBlur("msa")}
    >
      <Picker.Item label="Select MSA" value="" />
      {msaList.map((item) => (
        <Picker.Item key={item.id} label={item.name} value={item.id} />
      ))}
    </Picker>
  )}
</View>


                {shouldShowError('msa') && <Text style={styles.errorText}>{errors.msa}</Text>}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>STATEMENT OF WORK DETAILS</Text>

                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            shouldShowError('title') && styles.errorBorder
                        ]}
                        placeholder="ENTER TITLE"
                        value={title}
                        onChangeText={setTitle}
                        onBlur={() => handleBlur('title')}
                    />
                    {shouldShowError('title') && <Text style={styles.errorText}>{errors.title}</Text>}

                    <Text style={styles.label}>Statement of Work Number</Text>
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
                            <View style={[
                                styles.pickerContainer,
                                shouldShowError('sowType') && styles.errorBorder
                            ]}>
                                <Picker
                                    selectedValue={sowType}
                                    onValueChange={(value) => setSowType(value)}
                                    style={styles.picker}
                                    onBlur={() => handleBlur('sowType')}
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
                            {shouldShowError('sowType') && <Text style={styles.errorText}>{errors.sowType}</Text>}
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Start Date *</Text>
                            <TouchableOpacity
                                style={[
                                    styles.dateInput,
                                    shouldShowError('startDate') && styles.errorBorder
                                ]}
                                onPress={() => setShowStartDatePicker(true)}
                                onBlur={() => handleBlur('startDate')}
                            >
                                <Text>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                            {shouldShowError('startDate') && <Text style={styles.errorText}>{errors.startDate}</Text>}
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>End Date *</Text>
                            <TouchableOpacity
                                style={[
                                    styles.dateInput,
                                    shouldShowError('endDate') && styles.errorBorder
                                ]}
                                onPress={() => setShowEndDatePicker(true)}
                                onBlur={() => handleBlur('endDate')}
                            >
                                <Text>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                            {shouldShowError('endDate') && <Text style={styles.errorText}>{errors.endDate}</Text>}
                        </View>
                    </View>

                    <Text style={styles.label}>Select Resource *</Text>
                    <View style={[
                        styles.SelectResource,
                        shouldShowError('resourceType') && styles.errorBorder
                    ]}>
                        <TouchableOpacity
                            style={[
                                styles.radioOption2,
                                resourceType === "sow"
                            ]}
                            onPress={() => {
                                setResourceType("sow");
                                if (errors.resourceType) {
                                    setErrors(prev => ({ ...prev, resourceType: undefined }));
                                }
                            }}
                            onBlur={() => handleBlur('resourceType')}
                        >
                            <Text>SOW for Resource</Text>
                            <View style={styles.radioCircle}>
                                {resourceType === "sow" && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity>

                        {selectedMsa?.resource_datail?.user_detail && (
                            <View style={styles.resourceDetails}>
                                <View style={styles.avatarSmall}>
                                    <Text style={styles.avatarSmallText}>
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
                                <Text style={styles.resourceName}>
                                    {selectedMsa.resource_datail.user_detail.first_name}{" "}
                                    {selectedMsa.resource_datail.user_detail.last_name}
                                </Text>
                            </View>
                        )}
                    </View>
                    {shouldShowError('resourceType') && <Text style={styles.errorText}>{errors.resourceType}</Text>}

                    <Text style={styles.label}>Work Timesheet *</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={[styles.radioOption, workTimesheet === 'Day' && styles.radioSelected]}
                            onPress={() => {
                                setWorkTimesheet('Day');
                                if (errors.workTimesheet) {
                                    setErrors(prev => ({ ...prev, workTimesheet: undefined }));
                                }
                            }}
                            onBlur={() => handleBlur('workTimesheet')}
                        >
                            <Text style={styles.radioText}>Day</Text>
                            <View style={styles.radioCircle}>
                                {workTimesheet === 'Day' && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.radioOption, workTimesheet === 'Hour' && styles.radioSelected]}
                            onPress={() => {
                                setWorkTimesheet('Hour');
                                if (errors.workTimesheet) {
                                    setErrors(prev => ({ ...prev, workTimesheet: undefined }));
                                }
                            }}
                            onBlur={() => handleBlur('workTimesheet')}
                        >
                            <Text style={styles.radioText}>Hour</Text>
                            <View style={styles.radioCircle}>
                                {workTimesheet === 'Hour' && <View style={styles.radioInnerCircle} />}
                            </View>
                        </TouchableOpacity>
                    </View>
                    {shouldShowError('workTimesheet') && <Text style={styles.errorText}>{errors.workTimesheet}</Text>}

                    <Text style={styles.sectionTitle}>Costing for Resource</Text>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Currency *</Text>
                            <View style={[
                                styles.pickerContainer,
                                shouldShowError('currency') && styles.errorBorder
                            ]}>
                                <Picker
                                    selectedValue={currency}
                                    onValueChange={(value) => setCurrency(value)}
                                    style={styles.picker}
                                    onBlur={() => handleBlur('currency')}
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
                            {shouldShowError('currency') && <Text style={styles.errorText}>{errors.currency}</Text>}
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Rate *</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    shouldShowError('rate') && styles.errorBorder
                                ]}
                                placeholder="ENTER RATE"
                                value={rate}
                                onChangeText={setRate}
                                keyboardType="numeric"
                                onBlur={() => handleBlur('rate')}
                            />
                            {shouldShowError('rate') && <Text style={styles.errorText}>{errors.rate}</Text>}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Quantity *</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    shouldShowError('quantity') && styles.errorBorder
                                ]}
                                placeholder="22"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                onBlur={() => handleBlur('quantity')}
                            />
                            {shouldShowError('quantity') && <Text style={styles.errorText}>{errors.quantity}</Text>}
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
                            <View style={[
                                styles.pickerContainer,
                                shouldShowError('taxGroup') && styles.errorBorder
                            ]}>
                                <Picker
                                    selectedValue={taxGroup}
                                    onValueChange={(value) => setTaxGroup(value)}
                                    style={styles.picker}
                                    onBlur={() => handleBlur('taxGroup')}
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
                            {shouldShowError('taxGroup') && <Text style={styles.errorText}>{errors.taxGroup}</Text>}
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Tax % *</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    shouldShowError('taxPercentage') && styles.errorBorder
                                ]}
                                placeholder="ENTER TAX IN %"
                                value={taxPercentage}
                                onChangeText={setTaxPercentage}
                                keyboardType="numeric"
                                onBlur={() => handleBlur('taxPercentage')}
                            />
                            {shouldShowError('taxPercentage') && <Text style={styles.errorText}>{errors.taxPercentage}</Text>}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>GI Account *</Text>
                            <View style={[
                                styles.pickerContainer,
                                shouldShowError('glAccount') && styles.errorBorder
                            ]}>
                                <Picker
                                    selectedValue={glAccount}
                                    onValueChange={(value) => setGlAccount(value)}
                                    style={styles.picker}
                                    onBlur={() => handleBlur('glAccount')}
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
                            {shouldShowError('glAccount') && <Text style={styles.errorText}>{errors.glAccount}</Text>}
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.label}>Cost Center *</Text>
                            <View style={[
                                styles.pickerContainer,
                                shouldShowError('costCenter') && styles.errorBorder
                            ]}>
                                <Picker
                                    selectedValue={costCenter}
                                    onValueChange={(value) => setCostCenter(value)}
                                    style={styles.picker}
                                    onBlur={() => handleBlur('costCenter')}
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
                            {shouldShowError('costCenter') && <Text style={styles.errorText}>{errors.costCenter}</Text>}
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
                        style={[
                            styles.input,
                            styles.textArea,
                            shouldShowError('description') && styles.errorBorder
                        ]}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        onBlur={() => handleBlur('description')}
                    />
                    {shouldShowError('description') && <Text style={styles.errorText}>{errors.description}</Text>}

                    <Text style={styles.label}>Comments *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            shouldShowError('comments') && styles.errorBorder
                        ]}
                        placeholder="Enter comments"
                        value={comments}
                        onChangeText={setComments}
                        multiline
                        numberOfLines={4}
                        onBlur={() => handleBlur('comments')}
                    />
                    {shouldShowError('comments') && <Text style={styles.errorText}>{errors.comments}</Text>}

                    <View style={styles.radioContainer}>
                        <View>
                            <Text style={styles.label}>SOW Approver *</Text>
                            <View style={styles.SelectResource}>
                                <TouchableOpacity
                                    style={[styles.radioOption2, sowApprover === 'manual' && styles.radioSelected]}
                                    onPress={() => setModalVisible(true)}
                                    onBlur={() => handleBlur('sowApprover')}
                                >
                                    <Text style={styles.radioText}>Sow Approver</Text>
                                    <View style={styles.radioCircle}>
                                        {sowApprover === 'manual' && <View style={styles.radioInnerCircle} />}
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

                            <TouchableOpacity
                                style={[styles.radioOption, sowApprover === 'auto' && styles.radioSelected]}
                                onPress={() => {
                                    setSowApprover('auto');
                                    setSelectedApprover(null);
                                    if (errors.sowApprover || errors.selectedApprover) {
                                        setErrors(prev => ({
                                            ...prev,
                                            sowApprover: undefined,
                                            selectedApprover: undefined
                                        }));
                                    }
                                }}
                                onBlur={() => handleBlur('sowApprover')}
                            >
                                <Text style={styles.radioText}>Automatic Approval</Text>
                                <View style={styles.radioCircle}>
                                    {sowApprover === 'auto' && <View style={styles.radioInnerCircle} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {shouldShowError('sowApprover') && <Text style={styles.errorText}>{errors.sowApprover}</Text>}
                    {shouldShowError('selectedApprover') && <Text style={styles.errorText}>{errors.selectedApprover}</Text>}
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
        marginBottom: 10
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
    // Validation styles
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
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        paddingLeft: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000078",
        paddingVertical: 5,
    },
    resourceName: {
        fontSize: 14,
        fontWeight: "600",
    },
    closeButton: {
        fontSize: 18,
        color: "#666",
    },
});

export default CreateSOW;