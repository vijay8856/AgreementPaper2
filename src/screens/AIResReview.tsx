// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   Image,
//   SafeAreaView,

// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { Picker } from '@react-native-picker/picker';
// import DocumentPicker, { types } from 'react-native-document-picker';
// import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FileViewer from 'react-native-file-viewer';
// import Clipboard from '@react-native-clipboard/clipboard';
// import { WebView } from 'react-native-webview';
// import RNFS from 'react-native-fs';
// import Services from '../Services/services';
// import { FlatList, TextInput } from 'react-native-gesture-handler';
// import Share from 'react-native-share';
// const AIReviewScreen = () => {
//   // State declarations
//   const [contractType, setContractType] = useState('');
//   const [businessLine, setBusinessLine] = useState('');
//   const [country, setCountry] = useState('');
//   const [isPickerVisible, setPickerVisible] = useState(false);
//   const [currentPicker, setCurrentPicker] = useState<string | null>(null);
//   const [uploadedFile, setUploadedFile] = useState<any>(null);
//   const [isFileViewerVisible, setFileViewerVisible] = useState(false);
//   const [selectedText, setSelectedText] = useState<string>('');
//   const [aiSummary, setAiSummary] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [fileUri, setFileUri] = useState<string>('');
//   const [countries, setCountries] = useState<PickerItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [tempSearchText, setTempSearchText] = useState('');
//   const [showInstructionsModal, setShowInstructionsModal] = useState(false);

//   type PickerItem = {
//     label: string;
//     value: string;
//   };

//   const contractTypes = [
//     { label: "NON-DISCLOSURE AGREEMENTS", value: "NON-DISCLOSURE AGREEMENTS" },
//     { label: "CONFIDENTIALITY AGREEMENT", value: "CONFIDENTIALITY AGREEMENT" },
//     { label: "CONSULTING AGREEMENT", value: "CONSULTING AGREEMENT" },
//     { label: "SERVICE AGREEMENT", value: "SERVICE AGREEMENT" },
//     { label: "COMMISSION AGREEMENT", value: "COMMISSION AGREEMENT" },
//     { label: "DISTRIBUTION AGREEMENTS", value: "DISTRIBUTION AGREEMENTS" },
//     {
//       label: "EMPLOYEE DEPUTATION AGREEMENTS",
//       value: "EMPLOYEE DEPUTATION AGREEMENTS",
//     },
//     { label: "SECONDMENT AGREEMENT", value: "SECONDMENT AGREEMENT" },
//     { label: "FINANCE GUARANTEE", value: "FINANCE GUARANTEE" },
//     { label: "PERFORMANCE GUARANTEE", value: "PERFORMANCE GUARANTEE" },
//     { label: "INDEMNITY BOND", value: "INDEMNITY BOND" },
//     { label: "POWER OF ATTORNEY", value: "POWER OF ATTORNEY" },
//     {
//       label: "JOINT DEVELOPMENT AGREEMENTS",
//       value: "JOINT DEVELOPMENT AGREEMENTS",
//     },
//     { label: "JOINT VENTURE AGREEMENTS", value: "JOINT VENTURE AGREEMENTS" },
//     {
//       label: "LICENSE AGREEMENTS (TECHNOLOGY OR IPR)",
//       value: "LICENSE AGREEMENTS (TECHNOLOGY OR IPR)",
//     },
//     {
//       label: "PURCHASE AND SALE AGREEMENTS",
//       value: "PURCHASE AND SALE AGREEMENTS",
//     },
//     {
//       label: "SHARES PURCHASE AND SALE AGREEMENTS",
//       value: "SHARES PURCHASE AND SALE AGREEMENTS",
//     },
//     {
//       label: "SALE AND PURCHASE OF EQUIPMENT",
//       value: "SALE AND PURCHASE OF EQUIPMENT",
//     },
//     {
//       label: "INSTALLATION AGREEMENT OF THE EQUIPMENT",
//       value: "INSTALLATION AGREEMENT OF THE EQUIPMENT",
//     },
//     {
//       label: "SERVICE AGREEMENT OF THE EQUIPMENT",
//       value: "SERVICE AGREEMENT OF THE EQUIPMENT",
//     },
//     { label: "EPC CONTRACT", value: "EPC CONTRACT" },
//     {
//       label: "POWER PURCHASE AGREEMENT (OPEN ACCESS, TRADING ETC.)",
//       value: "POWER PURCHASE AGREEMENT (OPEN ACCESS, TRADING ETC.)",
//     },
//     { label: "WARRANTY DOCUMENTS", value: "WARRANTY DOCUMENTS" },
//     {
//       label: "ADVERTISING SERVICE AGREEMENT",
//       value: "ADVERTISING SERVICE AGREEMENT",
//     },
//     { label: "MEDIA SERVICE AGREEMENT", value: "MEDIA SERVICE AGREEMENT" },
//     {
//       label: "TECHNOLOGY COLLABORATION AGREEMENT",
//       value: "TECHNOLOGY COLLABORATION AGREEMENT",
//     },
//     { label: "LOGISTICS AGREEMENT", value: "LOGISTICS AGREEMENT" },
//     { label: "TRANSPORT AGREEMENT", value: "TRANSPORT AGREEMENT" },
//     { label: "FREIGHT AGREEMENT", value: "FREIGHT AGREEMENT" },
//     {
//       label: "RAW MATERIALS SUPPLY AGREEMENTS (INDIGENOUS OR IMPORTS)",
//       value: "RAW MATERIALS SUPPLY AGREEMENTS (INDIGENOUS OR IMPORTS)",
//     },
//     { label: "PRIVATE LABEL AGREEMENTS", value: "PRIVATE LABEL AGREEMENTS" },
//     { label: "BROKER AGREEMENTS", value: "BROKER AGREEMENTS" },
//     { label: "DEEDS", value: "DEEDS" },
//     { label: "EASEMENTS", value: "EASEMENTS" },
//     { label: "LEASES", value: "LEASES" },
//     { label: "OPTION AGREEMENTS", value: "OPTION AGREEMENTS" },
//     { label: "SETTLEMENT AGREEMENTS", value: "SETTLEMENT AGREEMENTS" },
//     { label: "SEVERANCE AGREEMENTS", value: "SEVERANCE AGREEMENTS" },
//     { label: "SUBCONTRACT AGREEMENTS", value: "SUBCONTRACT AGREEMENTS" },
//     { label: "JOB WORK AGREEMENTS", value: "JOB WORK AGREEMENTS" },
//     { label: "CONTRACT MANUFACTURING", value: "CONTRACT MANUFACTURING" },
//     {
//       label: "BUYING AND SELLING OF IMMOVABLE PROPERTY",
//       value: "BUYING AND SELLING OF IMMOVABLE PROPERTY",
//     },
//     { label: "BANKING FACILITY AGREEMENT", value: "BANKING FACILITY AGREEMENT" },
//     { label: "LEAVE & LICENSE AGREEMENT", value: "LEAVE & LICENSE AGREEMENT" },
//     { label: "LEASE AGREEMENT", value: "LEASE AGREEMENT" },
//     { label: "RENT AGREEMENT", value: "RENT AGREEMENT" },
//     {
//       label: "OVERRIDING COMMISSION AGREEMENT",
//       value: "OVERRIDING COMMISSION AGREEMENT",
//     },
//     {
//       label: "ANNUAL RATED CONTRACT (MRO CONTRACTS)",
//       value: "ANNUAL RATED CONTRACT (MRO CONTRACTS)",
//     },
//   ];

//   const businessLines = [
//     { value: "REAL ESTATE", label: "Real estate" },
//     { value: "INDIA", label: "Procurement" },
//     { value: "SALES", label: " Sales" },
//     { value: "FINANCE ACCOUNTING", label: "Finance & Accounting" },
//     { value: "HR", label: " Human Resources" },
//     { value: "PRODUCTION", label: "Production" },
//     { value: "QUALITY ASSURANCE", label: "Quality Assurance" },
//     { value: "MAINTENANCE", label: "Maintenance" },
//     { value: "VENDOR MANAGEMENT", label: "Vendor Management" },
//     { value: "INVENTORY MANAGEMENT", label: "Inventory Management" },
//     { value: "LOGISTICS WAREHOUSING", label: "Logistics & Warehousing" },
//     { value: "SUPPLY CHAIN MANAGEMENT", label: "Supply Chain Management" },
//     { value: "MARKETING", label: "Marketing" },
//     { value: "COSTING", label: "Costing" },
//     { value: "PAYROLL", label: "Payroll" },
//     { value: "ITERP MANAGEMENT", label: "IT & ERP Management" },
//     { value: "LEGAL COMPLIANCE", label: "Legal & Compliance" },
//     { value: "HSE", label: "Health, Safety & Environment (HSE)" },
//     { value: "RESEARCH DEVELOPMENT", label: "Research & Development (R&D)" },
//     { value: "BUSINESS STRATEGY", label: "Business Strategy" },
//     { value: "CUSTOMER SERVICE", label: "Customer Service" },
//     { value: "OTHERS", label: "Others" },
//   ];

//   const Clauses = [
//     { value: "SUMMARISE_CONTRACT", label: " Summary" },
//     { value: "FRAUD_DETECTION", label: " Fraud Detection" },
//     { value: "MISSING_CLAUSES", label: "Analyze" },

//   ];

//   useEffect(() => {
//     if (countries.length > 0) {
//       // Set default contract type
//       setContractType('SERVICE AGREEMENT OF THE EQUIPMENT');

//       // Set default business line
//       setBusinessLine('REAL ESTATE');

//       // Find and set Australia as default country
//       const australia = countries.find(
//         (c: PickerItem) => c.label === 'Australia'
//       );
//       if (australia) {
//         setCountry(australia.value);
//       }
//     }
//   }, [countries]);

//   const closePicker = () => {
//     setPickerVisible(false);
//     setTempSearchText('');
//   };
//   const handleSelect = (value: string) => {
//     switch (currentPicker) {
//       case 'contractType': setContractType(value); break;
//       case 'businessLine': setBusinessLine(value); break;
//       case 'country': setCountry(value); break;
//     }
//     closePicker();
//   };

//   // Derived state for run button
//   const isRunDisabled = !(
//     contractType &&
//     businessLine &&
//     country &&
//     uploadedFile
//   );

//   const fetchCountries = async (isRefresh = false) => {
//     if (!isRefresh) setLoading(true);
//     else setRefreshing(true);

//     const response = await Services.getCountryList({ limit: 1, offset: 0 });

//     if (response.success) {
//       const formattedCountries = response.data.map((country: any) => ({
//         label: country.name,
//         value: country.id,
//       }));
//       setCountries(formattedCountries);
//     } else {
//       Toast.show({
//         type: 'error',
//         text1: 'Failed to load countries',
//         text2: response.error?.message || 'Something went wrong',
//         position: 'top',
//       });
//     }

//     setLoading(false);
//     setRefreshing(false);
//   };
//   useEffect(() => {
//     fetchCountries();
//   }, []);
//   const onRefresh = useCallback(() => {
//     fetchCountries(true);
//   }, []);

//   const handleUpload = async () => {
//     try {
//       const res = await DocumentPicker.pickSingle({
//         type: types.pdf,
//         copyTo: 'cachesDirectory', // ✅ Ensures you can read the file later
//       });

//       // Use the copied file path (prefer fileCopyUri)
//       const safeUri = res.fileCopyUri || res.uri;

//       setUploadedFile({
//         ...res,
//         safeUri, // 👈 Save it separately
//       });

//       Toast.show({
//         type: 'success',
//         text1: 'File uploaded',
//         text2: `${res.name} uploaded successfully`,
//       });
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         console.error('File selection error:', err);
//         Toast.show({
//           type: 'error',
//           text1: 'Upload failed',
//           text2: 'Could not pick file',
//         });
//       }
//     }
//   };

//   const openPdfInExternalApp = async (file: any) => {
//     try {
//       let filePath = file.fileCopyUri || file.uri;

//       // ✅ Copy content URI to accessible file path (for Android)
//       if (Platform.OS === 'android' && filePath.startsWith('content://')) {
//         const destPath = `${RNFS.CachesDirectoryPath}/${file.name}`;
//         await RNFS.copyFile(filePath, destPath);
//         filePath = destPath;
//       }

//       const shareOptions = {
//         title: 'Open PDF with...',
//         url: `file://${filePath}`,
//         type: 'application/pdf',
//         failOnCancel: false,
//       };

//       await Share.open(shareOptions);
//     } catch (err) {
//       console.error('Could not open PDF:', err);
//       Alert.alert('Error', 'Could not open PDF in external app');
//     }
//   };

//   // Process AI summary
//   const getAiSummary = async () => {
//     if (!selectedText) {
//       Alert.alert('Error', 'Please select or type some text first');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const payload = {
//         message: selectedText,
//         contract_type: contractType,
//         line_of_business: businessLine,
//         country: country,
//       };

//       console.log('AI Review Payload:', payload);

//       const response = await Services.ai_Review(payload);
//       console.log('AI Review Response:', response);

//       if (!response.success || !response.data) {
//         throw new Error(
//           typeof response.error === 'string'
//             ? response.error
//             : 'AI analysis failed'
//         );
//       }

//       setAiSummary(response.data.message || 'AI analysis completed');
//     } catch (error: any) {
//       console.error('AI Review Error:', error);
//       Alert.alert('Error', error.message || 'Failed to get AI summary');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRun = async () => {
//     if (!uploadedFile) {
//       Alert.alert('Error', 'Please upload a file first');
//       return;
//     }

//     setShowInstructionsModal(true);
//   };

//   const handleCopyToClipboard = () => {
//     if (selectedText) {
//       Clipboard.setString(selectedText);
//       Toast.show({
//         type: 'success',
//         text1: 'Copied to clipboard',
//         text2: 'Selected text is ready to paste',
//       });
//     }
//   };

//   // Reset selection
//   const resetSelection = () => {
//     setSelectedText('');
//     setAiSummary('');
//   };

//   const openPicker = (pickerType: 'contractType' | 'businessLine' | 'country') => {
//     setCurrentPicker(pickerType);
//     setPickerVisible(true);
//   };

//   const getLabelFromValue = (data: { label: string; value: any }[], selectedValue: any) => {
//     const found = data.find((item) => item.value === selectedValue);
//     return found?.label || 'Select...';
//   };

//   const QuestionItem = ({ label, value, onPress }: {
//     label: string;
//     value: string;
//     onPress: () => void
//   }) => (
//     <TouchableOpacity style={styles.questionItem} onPress={onPress}>
//       <Text style={styles.questionText}>{label}</Text>
//       <View style={styles.questionValue}>
//         <Text style={styles.valueText}>{value || 'Select...'}</Text>
//         <Icon name="arrow-drop-down" size={24} color="#666" />
//       </View>
//     </TouchableOpacity>
//   );

//   const getFilteredItems = (items: PickerItem[], search: string) => {
//     return items.filter(item =>
//       item.label.toLowerCase().includes(search.toLowerCase())
//     );
//   };
//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header */}
//         {Platform.OS === 'ios' ? (
//   <SafeAreaView style={{ backgroundColor: '#0E3386' }}>
//      <View style={styles.headerContentWrapper}>

//     <LinearGradient
//       colors={['#3959a5ff', '#3658a5ff']}
//       style={[styles.header, { paddingTop: 12 ,}]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 0 }}
//     >
//       <Text style={styles.headerTitle}>Upload Contract</Text>
//       <Text style={styles.headerSubtitle}>
//         Please upload contract to review its (PDF) format
//       </Text>

//     </LinearGradient>

//      <TouchableOpacity
//         style={styles.uploadButtonIos}
//         onPress={handleUpload}
//       >
//         <Icon name="cloud-upload" size={24} color="white" />
//         <Text style={styles.uploadButtonText}>
//           {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
//         </Text>
//       </TouchableOpacity>

//       {uploadedFile && (
//         <Text style={styles.fileSizeText}>
//           {Math.round(uploadedFile.size / 1024)} KB
//         </Text>
//       )}
//      </View>
//   </SafeAreaView>
// ) : (
//   <LinearGradient
//     colors={['#0E3386', '#1A3B8B']}
//     style={styles.header}
//     start={{ x: 0, y: 0 }}
//     end={{ x: 1, y: 0 }}
//   >
//     <Text style={styles.headerTitle}>Upload Contract</Text>
//     <Text style={styles.headerSubtitle}>
//       Please upload contract to review its (PDF) format
//     </Text>

//     <TouchableOpacity
//       style={styles.uploadButton}
//       onPress={handleUpload}
//     >
//       <Icon name="cloud-upload" size={24} color="white" />
//       <Text style={styles.uploadButtonText}>
//         {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
//       </Text>
//     </TouchableOpacity>

//     {uploadedFile && (
//       <Text style={styles.fileSizeText}>
//         {Math.round(uploadedFile.size / 1024)} KB
//       </Text>
//     )}
//   </LinearGradient>
// )}

//         {/* Questions Section */}
//         <View style={styles.card}>
//           <QuestionItem
//             label="1. What type of contract is it?"
//             value={contractType}
//             onPress={() => openPicker('contractType')}
//           />

//           <QuestionItem
//             label="2. Line of business?"
//             value={businessLine}
//             onPress={() => openPicker('businessLine')}
//           />

//           <QuestionItem
//             label="3. Select your country?"
//             value={getLabelFromValue(countries, country)}
//             onPress={() => openPicker('country')}
//           />

//           <View style={styles.addButtonQues}>
//             <Text style={styles.sectionTitle}>Selected Questions</Text>
//             <TouchableOpacity style={styles.addButton}>
//               <Text style={styles.addButtonText}>Add Questions</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Run Button */}
//         <TouchableOpacity
//           style={[styles.runButton, isRunDisabled && styles.disabledButton]}
//           onPress={handleRun}
//           disabled={isRunDisabled}
//         >
//           <Text style={styles.runButtonText}>Run AI Analysis</Text>
//         </TouchableOpacity>

//         {/* Note Section */}
//         <View style={styles.noteCard}>
//           <Text style={styles.noteText}>
//             Note* - AI - AIRES can make mistakes. Check important info with your legal team as well.
//             This doesn't replace legal services and advice provided is only for guidance
//           </Text>
//         </View>
//       </ScrollView>

//       {/* File Viewer Modal */}
//       <Modal visible={isFileViewerVisible} animationType="slide">
//         <View style={styles.fileViewerContainer}>
//           <View style={styles.fileViewerHeader}>
//             <TouchableOpacity onPress={() => setFileViewerVisible(false)}>
//               <Icon name="arrow-back" size={24} color="#0E3386" />
//             </TouchableOpacity>
//             <Text style={styles.fileViewerTitle}>Document Review</Text>
//             <TouchableOpacity onPress={resetSelection}>
//               <Icon name="refresh" size={24} color="#0E3386" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.selectionPanel}>
//             {/* Editable Selected Text Input (always visible) */}
//             <View style={styles.selectedTextContainer}>
//               <Text style={styles.selectedTextLabel}>Selected Text:</Text>

//               <TextInput
//                 style={styles.editableInput}
//                 multiline
//                 value={selectedText}
//                 onChangeText={setSelectedText}
//                 placeholder="Select or paste text here..."
//                 textAlignVertical="top"
//               />

//               {/* Copy to Clipboard Button */}
//               <TouchableOpacity
//                 style={styles.copyButton}
//                 onPress={handleCopyToClipboard}
//               >
//                 <Icon name="content-copy" size={20} color="white" />
//                 <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
//               </TouchableOpacity>
//             </View>

//             {/* AI Summary Section */}
//             <View style={styles.summaryContainer}>
//               <Text style={styles.summaryTitle}>AI Summary:</Text>
//               {isLoading ? (
//                 <ActivityIndicator size="large" color="#0E3386" />
//               ) : aiSummary ? (
//                 <ScrollView style={styles.summaryScroll}>
//                   <Text style={styles.summaryText}>{aiSummary}</Text>
//                 </ScrollView>
//               ) : (
//                 <Text style={styles.summaryPlaceholder}>
//                   {selectedText ? 'Press "Get Summary" to analyze' : 'Type or paste text above to analyze'}
//                 </Text>
//               )}
//             </View>

//             {/* Get Summary Button */}
//             <TouchableOpacity
//               style={[styles.summaryButton, !selectedText && styles.disabledButton]}
//               onPress={getAiSummary}
//               disabled={!selectedText || isLoading}
//             >
//               <Text style={styles.summaryButtonText}>
//                 {isLoading ? 'Processing...' : 'Get Summary'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//         </View>
//       </Modal>
//       <Modal
//         visible={isPickerVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={closePicker}
//       >
//         <View style={styles.pickerModal}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerTitle}>
//               {currentPicker === 'contractType' && 'Select Contract Type'}
//               {currentPicker === 'businessLine' && 'Select Business Line'}
//               {currentPicker === 'country' && 'Select Country'}
//             </Text>

//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search..."
//               value={tempSearchText}
//               onChangeText={setTempSearchText}
//               autoFocus={true}
//             />

//             <FlatList
//               data={
//                 currentPicker === 'contractType'
//                   ? getFilteredItems(contractTypes, tempSearchText)
//                   : currentPicker === 'businessLine'
//                     ? getFilteredItems(businessLines, tempSearchText)
//                     : getFilteredItems(countries, tempSearchText)
//               }
//               keyExtractor={(item) => item.value}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => handleSelect(item.value)}
//                   style={styles.listItem}
//                 >
//                   <Text style={styles.itemLabel}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//               keyboardShouldPersistTaps="handled"
//             />

//             <TouchableOpacity
//               style={styles.pickerCloseButton}
//               onPress={closePicker}
//             >
//               <Text style={styles.pickerCloseText}>Done</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

// <Modal
//   visible={showInstructionsModal}
//   transparent={true}
//   animationType="slide"
//   onRequestClose={() => setShowInstructionsModal(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={styles.modalTitle}>PDF Instructions</Text>

//       {/* Properly aligned content with image and text */}
//       <View style={styles.instructionContainer}>
//         <Text style={styles.modalMessage}>Please open  </Text>

//         <View style={styles.adobeContainer}>
//           <Image
//             source={require('../assets/images/acrobat.png')}
//             style={styles.adobeIcon}
//             resizeMode="contain"
//           />
//           <Text style={styles.adobeText}>Adobe Acrobat</Text>
//         </View>

//         <Text style={styles.modalMessage}>and copy the content which you want to review and paste later.</Text>
//       </View>

//       <View style={styles.modalButtons}>
//         <TouchableOpacity
//           style={[styles.modalButton, styles.cancelButton]}
//           onPress={() => setShowInstructionsModal(false)}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.modalButton, styles.okButton]}
//           onPress={async () => {
//             setShowInstructionsModal(false);
//             await openPdfInExternalApp(uploadedFile);
//             Toast.show({
//               type: 'info',
//               text1: 'Copy text from PDF',
//               text2: 'Then paste it back to analyze',
//             });
//             setFileViewerVisible(true);
//           }}
//         >
//           <Text style={styles.okButtonText}>OK</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

//       <Toast />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 30,
//     borderRadius: 10,
//     width: '90%',
//     maxWidth: 500,

//   },
//     inlineRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//    instructionContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: 25,
//   },
//     adobeIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 5,
//   },
//   adobeText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color:'#666',
//     // color: '#D1432E', // Adobe's brand color
//   },

//   adobeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//   },
//   modalTitle: {

//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   modalMessage: {

//     fontSize: 16,
//     color: '#666',
//     lineHeight: 22,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   modalButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//     minWidth: 80,
//   },
//   cancelButton: {
//     backgroundColor: '#0E3386',
//   },
//   okButton: {
//     backgroundColor: '#0E3386',
//   },
//   cancelButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   okButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   editableInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     minHeight: 100,
//     maxHeight: 200,
//     fontSize: 16,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FC',
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   headerContentWrapper: {
//   paddingHorizontal: 16,   // 🔥 controls width for BOTH
//   marginTop: 12,
// },
//   header: {
//     padding: 15,
//     borderTopLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: 'white',
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 25,
//   },
//   fileSizeText: {
//     color: 'white',
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 5,
//     marginBottom:10
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     margin: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   noteCard: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     margin: 16,
//     padding: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#C41E3A',
//   },
//   questionItem: {
//     marginBottom: 20,
//   },
//   questionText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   questionValue: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//     paddingBottom: 8,
//   },
//   valueText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   addButtonQues: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#2A5BDA',
//   },
//   addButton: {
//     backgroundColor: '#0E3386',
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#000078',
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 12,
//   },
//   uploadButton: {
//     flexDirection: 'row',
//     backgroundColor: '#355192ff',
//     borderRadius: 10,
//     padding: 15,
//     margin:5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//     uploadButtonIos: {
//     flexDirection: 'row',
//     backgroundColor: '#355192ff',
//     borderRadius: 10,
//     // padding: 15,
// paddingVertical:20,
//     margin:10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   uploadButtonText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//     marginLeft: 10,
//   },
//   noteText: {
//     fontSize: 12,
//     color: '#C41E3A',
//     lineHeight: 18,
//   },
//   pickerModal: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   pickerContainer: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   pickerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 15,
//     color: '#333',
//   },
//   picker: {
//     height: 180,
//   },
//   pickerCloseButton: {
//     backgroundColor: '#0E3386',
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   pickerCloseText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   runButton: {
//     backgroundColor: '#0E3386',
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//     marginTop: 20,
//     marginHorizontal: 16,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   runButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   fileViewerContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   fileViewerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: '#f8f9fa',
//   },
//   fileViewerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   webviewContainer: {
//     flex: 1,
//     height: '50%',
//   },
//   selectionHint: {
//     textAlign: 'center',
//     color: '#666',
//     padding: 10,
//   },
//   textPreviewContainer: {
//     maxHeight: 100,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     padding: 10,
//     marginVertical: 8,
//   },
//   copyButton: {
//     flexDirection: 'row',
//     backgroundColor: '#0E3386',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 5,
//   },
//   copyButtonText: {
//     color: 'white',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   unsupportedText: {
//     textAlign: 'center',
//     padding: 20,
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   selectionPanel: {
//     padding: 16,
//   },
//   selectedTextContainer: {
//     marginTop: 10,
//   },
//   selectedTextLabel: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   selectedPreview: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 5,
//   },
//   summaryContainer: {
//     marginTop: 15,
//   },
//   summaryTitle: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#0E3386',
//   },
//   summaryText: {
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 5,
//   },
//   summaryPlaceholder: {
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 5,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   summaryButton: {
//     backgroundColor: '#0E3386',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 15,
//   },
//   summaryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   summaryScroll: {
//     maxHeight: 300,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   listItem: {
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   itemLabel: {
//     fontSize: 16,
//   },
// });

// export default AIReviewScreen;

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   Modal, Alert, ActivityIndicator, Platform, Image,
//   SafeAreaView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import DocumentPicker, { types } from 'react-native-document-picker';
// import Toast from 'react-native-toast-message';
// import RNFS from 'react-native-fs';
// import { WebView } from 'react-native-webview';
// import { FlatList, TextInput } from 'react-native-gesture-handler';
// import Services from '../Services/services';

// // ── Types ──────────────────────────────────────────────────────
// type PickerItem = { label: string; value: string };

// type Suggestion = {
//   id: number;
//   type: 'risk' | 'improve' | 'missing';
//   title: string;
//   reason: string;
//   paragraphIndex: number;
//   original: string | null;
//   suggested: string;
//   status: 'pending' | 'accepted' | 'rejected';
// };

// // ── Claude API call ────────────────────────────────────────────

// const analyzeContractWithClaude = async (
//   contractText: string,
//   contractType: string,
//   businessLine: string,
//   country: string,
// ): Promise<Suggestion[]> => {
//   const prompt = `You are a senior contract lawyer. Analyze the following ${contractType} contract for the ${businessLine} business line in ${country}.

// Return ONLY a valid JSON array (no markdown, no explanation) of redline suggestions. Each object must have:
// - "id": number
// - "type": "risk" | "improve" | "missing"
// - "title": short title of the issue
// - "reason": why this needs to change (1-2 sentences)
// - "paragraphIndex": 0-based index of the paragraph this applies to (-1 for missing clauses)
// - "original": the exact original text to replace (null if it's a missing clause to add)
// - "suggested": the improved replacement text

// Contract text:
// ${contractText}`;

//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-key': ANTHROPIC_API_KEY,
//       'anthropic-version': '2023-06-01',
//     },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 2000,
//       messages: [{ role: 'user', content: prompt }],
//     }),
//   });

//   const data = await response.json();
//   const raw = data.content?.[0]?.text || '[]';

//   try {
//     const clean = raw.replace(/```json|```/g, '').trim();
//     const parsed = JSON.parse(clean);
//     return parsed.map((s: any, i: number) => ({ ...s, id: i + 1, status: 'pending' }));
//   } catch {
//     return [];
//   }
// };

// // ── PDF Text Extractor via WebView ─────────────────────────────
// const pdfJsHtml = (base64: string) => `
// <!DOCTYPE html>
// <html>
// <head>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
// </head>
// <body>
// <script>
//   pdfjsLib.GlobalWorkerOptions.workerSrc =
//     'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

//   async function extract() {
//     try {
//       const binary = atob('${base64}');
//       const bytes = new Uint8Array(binary.length);
//       for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

//       const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
//       let fullText = '';

//       for (let p = 1; p <= pdf.numPages; p++) {
//         const page = await pdf.getPage(p);
//         const content = await page.getTextContent();
//         const pageText = content.items.map(i => i.str).join(' ');
//         fullText += pageText + '\\n\\n';
//       }

//       window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'text', text: fullText }));
//     } catch (e) {
//       window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: e.message }));
//     }
//   }
//   extract();
// </script>
// </body>
// </html>`;

// // ── Main Component ─────────────────────────────────────────────
// const AIReviewScreen = () => {
//   const [contractType, setContractType]       = useState('');
//   const [businessLine, setBusinessLine]       = useState('');
//   const [country, setCountry]                 = useState('');
//   const [uploadedFile, setUploadedFile]       = useState<any>(null);
//   const [isPickerVisible, setPickerVisible]   = useState(false);
//   const [currentPicker, setCurrentPicker]     = useState<string | null>(null);
//   const [tempSearchText, setTempSearchText]   = useState('');
//   const [countries, setCountries]             = useState<PickerItem[]>([]);
//   const [loading, setLoading]                 = useState(true);

//   // ── Redline states ──
//   const [extractedText, setExtractedText]     = useState('');
//   const [paragraphs, setParagraphs]           = useState<string[]>([]);
//   const [suggestions, setSuggestions]         = useState<Suggestion[]>([]);
//   const [isExtracting, setIsExtracting]       = useState(false);
//   const [isAnalyzing, setIsAnalyzing]         = useState(false);
//   const [showRedlineScreen, setShowRedlineScreen] = useState(false);
//   const [pdfBase64, setPdfBase64]             = useState('');
//   const [extractionDone, setExtractionDone]   = useState(false);
//   const webViewRef = useRef<any>(null);

//   const contractTypes = [
//     { label: 'NON-DISCLOSURE AGREEMENTS',   value: 'NON-DISCLOSURE AGREEMENTS' },
//     { label: 'CONFIDENTIALITY AGREEMENT',   value: 'CONFIDENTIALITY AGREEMENT' },
//     { label: 'CONSULTING AGREEMENT',        value: 'CONSULTING AGREEMENT' },
//     { label: 'SERVICE AGREEMENT',           value: 'SERVICE AGREEMENT' },
//     { label: 'COMMISSION AGREEMENT',        value: 'COMMISSION AGREEMENT' },
//     { label: 'LEASE AGREEMENT',             value: 'LEASE AGREEMENT' },
//     { label: 'RENT AGREEMENT',              value: 'RENT AGREEMENT' },
//     { label: 'JOINT VENTURE AGREEMENTS',    value: 'JOINT VENTURE AGREEMENTS' },
//     { label: 'EPC CONTRACT',               value: 'EPC CONTRACT' },
//   ];

//   const businessLines = [
//     { value: 'REAL ESTATE',        label: 'Real Estate' },
//     { value: 'SALES',              label: 'Sales' },
//     { value: 'FINANCE ACCOUNTING', label: 'Finance & Accounting' },
//     { value: 'HR',                 label: 'Human Resources' },
//     { value: 'LEGAL COMPLIANCE',   label: 'Legal & Compliance' },
//     { value: 'OTHERS',             label: 'Others' },
//   ];

//   // ── Fetch countries ──
//   const fetchCountries = async () => {
//     setLoading(true);
//     const response = await Services.getCountryList({ limit: 1, offset: 0 });
//     if (response.success) {
//       setCountries(response.data.map((c: any) => ({ label: c.name, value: c.id })));
//     }
//     setLoading(false);
//   };

//   useEffect(() => { fetchCountries(); }, []);

//   const isRunDisabled = !(contractType && businessLine && country && uploadedFile);

//   // ── Picker helpers ──
//   const openPicker = (type: 'contractType' | 'businessLine' | 'country') => {
//     setCurrentPicker(type);
//     setPickerVisible(true);
//   };
//   const closePicker = () => { setPickerVisible(false); setTempSearchText(''); };
//   const handleSelect = (value: string) => {
//     if (currentPicker === 'contractType') setContractType(value);
//     if (currentPicker === 'businessLine') setBusinessLine(value);
//     if (currentPicker === 'country') setCountry(value);
//     closePicker();
//   };
//   const getLabelFromValue = (data: PickerItem[], val: any) =>
//     data.find(i => i.value === val)?.label || 'Select...';
//   const getFilteredItems = (items: PickerItem[], search: string) =>
//     items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));

//   // ── Upload PDF & encode to base64 ──
//   const handleUpload = async () => {
//     try {
//       const res = await DocumentPicker.pickSingle({
//         type: types.pdf,
//         copyTo: 'cachesDirectory',
//       });

//       const safeUri = res.fileCopyUri || res.uri;
//       let filePath = safeUri;

//       if (Platform.OS === 'android' && filePath.startsWith('content://')) {
//         const destPath = `${RNFS.CachesDirectoryPath}/${res.name}`;
//         await RNFS.copyFile(filePath, destPath);
//         filePath = destPath;
//       } else {
//         filePath = filePath.replace('file://', '');
//       }

//       const base64 = await RNFS.readFile(filePath, 'base64');
//       setPdfBase64(base64);
//       setUploadedFile({ ...res, safeUri });
//       setExtractionDone(false);
//       setSuggestions([]);
//       setParagraphs([]);

//       Toast.show({ type: 'success', text1: 'PDF uploaded', text2: res.name });
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         Toast.show({ type: 'error', text1: 'Upload failed' });
//       }
//     }
//   };

//   // ── WebView message handler — receives extracted text ──
// const handleWebViewMessage = async (event: any) => {
//   try {
//     const msg = JSON.parse(event.nativeEvent.data);
//     console.log('WebView message received:', msg.type);  // ← add this

//     if (msg.type === 'error') {
//       console.log('Extraction error:', msg.message);     // ← add this
//       setIsExtracting(false);
//       Alert.alert('Extraction failed', msg.message);
//       return;
//     }

//     if (msg.type === 'text') {
//       console.log('Extracted text length:', msg.text.length);  // ← add this
//       console.log('Extracted text preview:', msg.text.slice(0, 300)); // ← add this
//       // ...rest of code
//     }
//   } catch (e) {
//     console.log('WebView message parse error:', e);  // ← add this
//   }
// };

//   // ── Run Claude redline analysis ──
//   const runClaudeAnalysis = async (text: string, paras: string[]) => {
//     setIsAnalyzing(true);
//     try {
//       const results = await analyzeContractWithClaude(
//         text, contractType, businessLine, country
//       );
//       setSuggestions(results);
//     } catch (e: any) {
//       Alert.alert('Analysis failed', e.message);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   // ── Handle Run button ──
//   const handleRun = () => {
//     if (!uploadedFile) { Alert.alert('Error', 'Please upload a file first'); return; }
//     setShowRedlineScreen(true);
//     setIsExtracting(true);
//   };

//   // ── Accept / Reject a suggestion ──
//   const decide = (id: number, status: 'accepted' | 'rejected') => {
//     setSuggestions(prev =>
//       prev.map(s => s.id === id ? { ...s, status } : s)
//     );
//   };

//   // ── Render a paragraph with inline highlights ──
//   const renderParagraph = (para: string, index: number) => {
//     const related = suggestions.filter(
//       s => s.paragraphIndex === index && s.status === 'accepted' && s.original
//     );

//     let display = para;
//     related.forEach(s => {
//       if (s.original) display = display.replace(s.original, `[[ACCEPTED:${s.suggested}]]`);
//     });

//     const parts = display.split(/(\[\[ACCEPTED:.*?\]\])/g);
//     return (
//       <Text style={styles.paraText}>
//         {parts.map((part, i) => {
//           if (part.startsWith('[[ACCEPTED:')) {
//             const text = part.replace('[[ACCEPTED:', '').replace(']]', '');
//             return <Text key={i} style={styles.acceptedInline}>{text}</Text>;
//           }
//           return <Text key={i}>{part}</Text>;
//         })}
//       </Text>
//     );
//   };

//   // ── Suggestion card ──
//   const SuggestionCard = ({ suggestion }: { suggestion: Suggestion }) => (
//     <View style={styles.suggestionCard}>
//       <View style={styles.suggestionHeader}>
//         <View style={[
//           styles.typeTag,
//           suggestion.type === 'risk'    && styles.tagRisk,
//           suggestion.type === 'improve' && styles.tagImprove,
//           suggestion.type === 'missing' && styles.tagMissing,
//         ]}>
//           <Text style={[
//             styles.typeTagText,
//             suggestion.type === 'risk'    && styles.tagRiskText,
//             suggestion.type === 'improve' && styles.tagImproveText,
//             suggestion.type === 'missing' && styles.tagMissingText,
//           ]}>
//             {suggestion.type === 'risk' ? 'High Risk' : suggestion.type === 'improve' ? 'Improvement' : 'Missing Clause'}
//           </Text>
//         </View>
//         <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
//       </View>

//       <Text style={styles.suggestionReason}>{suggestion.reason}</Text>

//       {suggestion.original && (
//         <View style={styles.diffBlock}>
//           <Text style={styles.diffLabelRemove}>Remove</Text>
//           <Text style={styles.diffTextRemove}>{suggestion.original}</Text>
//         </View>
//       )}

//       <View style={styles.diffBlock}>
//         <Text style={styles.diffLabelAdd}>{suggestion.original ? 'Replace with' : 'Add'}</Text>
//         <Text style={styles.diffTextAdd}>{suggestion.suggested}</Text>
//       </View>

//       <View style={styles.actionRow}>
//         {suggestion.status === 'pending' ? (
//           <>
//             <TouchableOpacity
//               style={styles.btnAccept}
//               onPress={() => decide(suggestion.id, 'accepted')}
//             >
//               <Text style={styles.btnAcceptText}>Accept</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.btnReject}
//               onPress={() => decide(suggestion.id, 'rejected')}
//             >
//               <Text style={styles.btnRejectText}>Reject</Text>
//             </TouchableOpacity>
//           </>
//         ) : suggestion.status === 'accepted' ? (
//           <View style={styles.chipAccepted}><Text style={styles.chipAcceptedText}>Accepted</Text></View>
//         ) : (
//           <View style={styles.chipRejected}><Text style={styles.chipRejectedText}>Rejected</Text></View>
//         )}
//       </View>
//     </View>
//   );

//   // ── Stats bar ──
//   const pending  = suggestions.filter(s => s.status === 'pending').length;
//   const accepted = suggestions.filter(s => s.status === 'accepted').length;
//   const rejected = suggestions.filter(s => s.status === 'rejected').length;

//   // ── Picker modal ──
//   const QuestionItem = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
//     <TouchableOpacity style={styles.questionItem} onPress={onPress}>
//       <Text style={styles.questionText}>{label}</Text>
//       <View style={styles.questionValue}>
//         <Text style={styles.valueText}>{value || 'Select...'}</Text>
//         <Icon name="arrow-drop-down" size={24} color="#666" />
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>

//       {/* ── Hidden WebView for PDF text extraction ── */}
//       {showRedlineScreen && pdfBase64 && !extractionDone && (
//         <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
//           <WebView
//             ref={webViewRef}
//             originWhitelist={['*']}
//             source={{ html: pdfJsHtml(pdfBase64) }}
//             onMessage={handleWebViewMessage}
//             javaScriptEnabled={true}
//           />
//         </View>
//       )}

//       {/* ── Upload Screen ── */}
//       {!showRedlineScreen && (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {Platform.OS === 'ios' ? (
//             <SafeAreaView style={{ backgroundColor: '#0E3386' }}>
//               <View style={styles.headerContentWrapper}>
//                 <LinearGradient
//                   colors={['#3959a5ff', '#3658a5ff']}
//                   style={[styles.header, { paddingTop: 12 }]}
//                   start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                 >
//                   <Text style={styles.headerTitle}>Upload Contract</Text>
//                   <Text style={styles.headerSubtitle}>Upload your PDF contract for AI redline review</Text>
//                 </LinearGradient>
//                 <TouchableOpacity style={styles.uploadButtonIos} onPress={handleUpload}>
//                   <Icon name="cloud-upload" size={24} color="white" />
//                   <Text style={styles.uploadButtonText}>
//                     {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
//                   </Text>
//                 </TouchableOpacity>
//                 {uploadedFile && (
//                   <Text style={styles.fileSizeText}>{Math.round(uploadedFile.size / 1024)} KB</Text>
//                 )}
//               </View>
//             </SafeAreaView>
//           ) : (
//             <LinearGradient
//               colors={['#0E3386', '#1A3B8B']}
//               style={styles.header}
//               start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.headerTitle}>Upload Contract</Text>
//               <Text style={styles.headerSubtitle}>Upload your PDF contract for AI redline review</Text>
//               <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
//                 <Icon name="cloud-upload" size={24} color="white" />
//                 <Text style={styles.uploadButtonText}>
//                   {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
//                 </Text>
//               </TouchableOpacity>
//               {uploadedFile && (
//                 <Text style={styles.fileSizeText}>{Math.round(uploadedFile.size / 1024)} KB</Text>
//               )}
//             </LinearGradient>
//           )}

//           <View style={styles.card}>
//             <QuestionItem
//               label="1. What type of contract is it?"
//               value={contractType}
//               onPress={() => openPicker('contractType')}
//             />
//             <QuestionItem
//               label="2. Line of business?"
//               value={businessLine}
//               onPress={() => openPicker('businessLine')}
//             />
//             <QuestionItem
//               label="3. Select your country?"
//               value={getLabelFromValue(countries, country)}
//               onPress={() => openPicker('country')}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.runButton, isRunDisabled && styles.disabledButton]}
//             onPress={handleRun}
//             disabled={isRunDisabled}
//           >
//             <Text style={styles.runButtonText}>Run AI Redline Analysis</Text>
//           </TouchableOpacity>

//           <View style={styles.noteCard}>
//             <Text style={styles.noteText}>
//               Note* — AI can make mistakes. Always verify suggestions with your legal team.
//             </Text>
//           </View>
//         </ScrollView>
//       )}

//       {/* ── Redline Review Screen ── */}
//       {showRedlineScreen && (
//         <View style={styles.redlineContainer}>

//           {/* Header */}
//           <View style={styles.redlineHeader}>
//             <TouchableOpacity onPress={() => setShowRedlineScreen(false)}>
//               <Icon name="arrow-back" size={24} color="#0E3386" />
//             </TouchableOpacity>
//             <Text style={styles.redlineTitle}>AI Redline Review</Text>
//             <TouchableOpacity
//               onPress={() => runClaudeAnalysis(extractedText, paragraphs)}
//               disabled={isAnalyzing || isExtracting}
//             >
//               <Icon name="refresh" size={24} color="#0E3386" />
//             </TouchableOpacity>
//           </View>

//           {/* Stats bar */}
//           {!isExtracting && !isAnalyzing && suggestions.length > 0 && (
//             <View style={styles.statsBar}>
//               <Text style={styles.statItem}>{suggestions.length} suggestions</Text>
//               <Text style={[styles.statItem, styles.statAccepted]}>{accepted} accepted</Text>
//               <Text style={[styles.statItem, styles.statRejected]}>{rejected} rejected</Text>
//               <Text style={styles.statItem}>{pending} pending</Text>
//             </View>
//           )}

//           {/* Loading states */}
//           {(isExtracting || isAnalyzing) && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#0E3386" />
//               <Text style={styles.loadingText}>
//                 {isExtracting ? 'Extracting text from PDF...' : 'AI is analyzing your contract...'}
//               </Text>
//             </View>
//           )}

//           {/* Content */}
//           {!isExtracting && !isAnalyzing && (
//             <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

//               {/* Contract paragraphs */}
//               {paragraphs.length > 0 && (
//                 <View style={styles.contractCard}>
//                   <Text style={styles.sectionLabel}>Contract</Text>
//                   {paragraphs.map((para, idx) => (
//                     <View key={idx} style={styles.paraBlock}>
//                       {renderParagraph(para, idx)}
//                     </View>
//                   ))}
//                 </View>
//               )}

//               {/* Suggestions */}
//               {suggestions.length > 0 && (
//                 <>
//                   <Text style={styles.sectionLabel}>
//                     AI Suggestions ({suggestions.length})
//                   </Text>
//                   {suggestions.map(s => (
//                     <SuggestionCard key={s.id} suggestion={s} />
//                   ))}
//                 </>
//               )}

//               {suggestions.length === 0 && extractionDone && (
//                 <View style={styles.emptyState}>
//                   <Icon name="check-circle" size={48} color="#3B6D11" />
//                   <Text style={styles.emptyStateText}>No issues found in this contract</Text>
//                 </View>
//               )}
//             </ScrollView>
//           )}
//         </View>
//       )}

//       {/* ── Picker Modal ── */}
//       <Modal
//         visible={isPickerVisible}
//         transparent animationType="slide"
//         onRequestClose={closePicker}
//       >
//         <View style={styles.pickerModal}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerTitle}>
//               {currentPicker === 'contractType' && 'Select Contract Type'}
//               {currentPicker === 'businessLine' && 'Select Business Line'}
//               {currentPicker === 'country' && 'Select Country'}
//             </Text>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search..."
//               value={tempSearchText}
//               onChangeText={setTempSearchText}
//               autoFocus
//             />
//             <FlatList
//               data={
//                 currentPicker === 'contractType' ? getFilteredItems(contractTypes, tempSearchText)
//                 : currentPicker === 'businessLine' ? getFilteredItems(businessLines, tempSearchText)
//                 : getFilteredItems(countries, tempSearchText)
//               }
//               keyExtractor={item => item.value}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => handleSelect(item.value)} style={styles.listItem}>
//                   <Text style={styles.itemLabel}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//               keyboardShouldPersistTaps="handled"
//             />
//             <TouchableOpacity style={styles.pickerCloseButton} onPress={closePicker}>
//               <Text style={styles.pickerCloseText}>Done</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Toast />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container:            { flex: 1, backgroundColor: '#F5F7FC' },
//   scrollContainer:      { paddingBottom: 20 },
//   headerContentWrapper: { paddingHorizontal: 16, marginTop: 12 },
//   header:               { padding: 15, borderTopLeftRadius: 20, borderBottomRightRadius: 20 },
//   headerTitle:          { fontSize: 18, fontWeight: '700', color: 'white', marginBottom: 8 },
//   headerSubtitle:       { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 25 },
//   uploadButton:         { flexDirection: 'row', backgroundColor: '#355192ff', borderRadius: 10, padding: 15, margin: 5, justifyContent: 'center', alignItems: 'center' },
//   uploadButtonIos:      { flexDirection: 'row', backgroundColor: '#355192ff', borderRadius: 10, paddingVertical: 20, margin: 10, justifyContent: 'center', alignItems: 'center' },
//   uploadButtonText:     { color: 'white', fontSize: 10, fontWeight: '600', marginLeft: 10 },
//   fileSizeText:         { color: 'white', fontSize: 12, textAlign: 'center', marginTop: 5, marginBottom: 10 },
//   card:                 { backgroundColor: 'white', borderRadius: 16, margin: 16, padding: 16, elevation: 3 },
//   noteCard:             { backgroundColor: 'white', borderRadius: 16, margin: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#C41E3A' },
//   noteText:             { fontSize: 12, color: '#C41E3A', lineHeight: 18 },
//   questionItem:         { marginBottom: 20 },
//   questionText:         { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
//   questionValue:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 8 },
//   valueText:            { fontSize: 16, color: '#666' },
//   runButton:            { backgroundColor: '#0E3386', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 20, marginHorizontal: 16 },
//   disabledButton:       { backgroundColor: '#cccccc' },
//   runButtonText:        { color: 'white', fontWeight: 'bold', fontSize: 16 },

//   // ── Redline screen ──
//   redlineContainer:     { flex: 1, backgroundColor: '#F5F7FC' },
//   redlineHeader:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
//   redlineTitle:         { fontSize: 17, fontWeight: '700', color: '#0E3386' },
//   statsBar:             { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', flexWrap: 'wrap' },
//   statItem:             { fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, borderWidth: 0.5, borderColor: '#ccc', color: '#555' },
//   statAccepted:         { borderColor: '#3B6D11', color: '#3B6D11', backgroundColor: '#EAF3DE' },
//   statRejected:         { borderColor: '#791F1F', color: '#791F1F', backgroundColor: '#FCEBEB' },
//   loadingContainer:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
//   loadingText:          { marginTop: 16, fontSize: 14, color: '#666', textAlign: 'center' },
//   sectionLabel:         { fontSize: 11, fontWeight: '500', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },

//   // ── Contract ──
//   contractCard:         { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#e0e0e0' },
//   paraBlock:            { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
//   paraText:             { fontSize: 13, lineHeight: 1.7 * 13, color: '#333' },
//   acceptedInline:       { backgroundColor: '#EAF3DE', color: '#173404', borderRadius: 3 },

//   // ── Suggestion card ──
//   suggestionCard:       { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 0.5, borderColor: '#e0e0e0', overflow: 'hidden' },
//   suggestionHeader:     { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#f8f9fa' },
//   typeTag:              { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
//   tagRisk:              { backgroundColor: '#FCEBEB' },
//   tagImprove:           { backgroundColor: '#E6F1FB' },
//   tagMissing:           { backgroundColor: '#FAEEDA' },
//   typeTagText:          { fontSize: 11, fontWeight: '500' },
//   tagRiskText:          { color: '#791F1F' },
//   tagImproveText:       { color: '#0C447C' },
//   tagMissingText:       { color: '#633806' },
//   suggestionTitle:      { fontSize: 13, fontWeight: '500', color: '#222', flex: 1 },
//   suggestionReason:     { fontSize: 12, color: '#666', paddingHorizontal: 12, paddingBottom: 10, lineHeight: 18 },
//   diffBlock:            { marginHorizontal: 12, marginBottom: 8 },
//   diffLabelRemove:      { fontSize: 11, fontWeight: '500', color: '#791F1F', marginBottom: 4 },
//   diffLabelAdd:         { fontSize: 11, fontWeight: '500', color: '#27500A', marginBottom: 4 },
//   diffTextRemove:       { fontSize: 12, backgroundColor: '#FCEBEB', color: '#501313', padding: 8, borderRadius: 6, textDecorationLine: 'line-through', lineHeight: 18 },
//   diffTextAdd:          { fontSize: 12, backgroundColor: '#EAF3DE', color: '#173404', padding: 8, borderRadius: 6, lineHeight: 18 },
//   actionRow:            { flexDirection: 'row', gap: 8, padding: 12 },
//   btnAccept:            { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8, backgroundColor: '#EAF3DE', borderWidth: 0.5, borderColor: '#3B6D11' },
//   btnAcceptText:        { fontSize: 13, fontWeight: '500', color: '#27500A' },
//   btnReject:            { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8, backgroundColor: '#f5f5f5', borderWidth: 0.5, borderColor: '#ccc' },
//   btnRejectText:        { fontSize: 13, color: '#555' },
//   chipAccepted:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#EAF3DE' },
//   chipAcceptedText:     { fontSize: 12, fontWeight: '500', color: '#27500A' },
//   chipRejected:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f5f5f5' },
//   chipRejectedText:     { fontSize: 12, color: '#888' },
//   emptyState:           { alignItems: 'center', padding: 40 },
//   emptyStateText:       { fontSize: 15, color: '#3B6D11', marginTop: 12, fontWeight: '500' },

//   // ── Picker ──
//   pickerModal:          { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
//   pickerContainer:      { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
//   pickerTitle:          { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 15, color: '#333' },
//   pickerCloseButton:    { backgroundColor: '#0E3386', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
//   pickerCloseText:      { color: 'white', fontSize: 16, fontWeight: '600' },
//   searchInput:          { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
//   listItem:             { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   itemLabel:            { fontSize: 16 },
// });

// export default AIReviewScreen;

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker, {types} from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import {WebView} from 'react-native-webview';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import Services from '../Services/services';
import RNPrint from 'react-native-print';
import { OPENAI_API_KEY } from '@env';

console.log("open",OPENAI_API_KEY);

// ── Types ──────────────────────────────────────────────────────
type PickerItem = {label: string; value: string};

type Suggestion = {
  id: number;
  type: 'risk' | 'improve' | 'missing';
  title: string;
  reason: string;
  paragraphIndex: number;
  original: string | null;
  suggested: string;
  explanation?: string; // ✅ ADD THIS LINE
  status: 'pending' | 'accepted' | 'rejected';
};

// ── Anthropic API Key ──────────────────────────────────────────
const detectClauses = (text: string) => {
  const clauses = text
    .split(/\n\d+\.|\n[A-Z][A-Z\s]+:/g)
    .map(c => c.trim())
    .filter(c => c.length > 50);

  return clauses.map((clause, index) => ({
    id: index,
    text: clause,
  }));
};
// ── Claude API call ────────────────────────────────────────────
const analyzeClauseAI = async (clause: string, index: number) => {
  const endpoint = 'https://agreement-ai-openai-redlining.openai.azure.com/';
  const apiKey =
  OPENAI_API_KEY;
  const deployment = 'gpt-5.4-mini';

  const response = await fetch(
    `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a senior contract lawyer.',
          },
          {
            role: 'user',
            content: `
You are a perfect senior professional contract lawyer.

Analyze the clause and identify legal issues.

STRICT RULES (VERY IMPORTANT):

1. You MUST extract the EXACT problematic text from the clause.
2. "original" MUST be an EXACT substring from the clause.
3. "original" MUST be SHORT (5–20 words MAX).
4. NEVER return full paragraph as "original".
5. If no exact phrase exists, return null for "original".

6. "suggested" MUST be a COMPLETE legally drafted clause or sentence.
7. DO NOT write instructions like "Add..." or "Improve..."
8. Write like a professional contract.

9. Each issue must target DIFFERENT part of the clause.

Return ONLY JSON array:

[
  {
    "type": "risk" | "missing" | "improve",
    "title": "...",
    "reason": "...",
    "paragraphIndex": ${index},
    "original": "...EXACT TEXT FROM CLAUSE...",
    "suggested": "...FINAL LEGAL TEXT...",
    "explanation": "Simple explanation"
  }
]

CLAUSE:
${clause}
`,
          },
        ],
        temperature: 0.3,
      }),
    },
  );

  const data = await response.json();
  console.log('data', data);

  const raw = data.choices?.[0]?.message?.content || '[]';

  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.log('Parse error:', clean);
    return [];
  }
};
const askClauseAI = async (clause: string) => {
  const endpoint = 'https://agreement-ai-openai-redlining.openai.azure.com/';
  const apiKey =OPENAI_API_KEY;
  const deployment = 'gpt-5.4-mini';

  const response = await fetch(
    `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `
You are a very senior professional contract lawyer.

STRICT RULES:
1. Answer ONLY based on the clause
2. Quote exact text from clause
3. Explain legal meaning
4. Identify risks (if any)
5. Suggest improved version if needed

FORMAT:

Answer:
...

Risk:
...

Suggestion:
...
`,
          },
          {
            role: 'user',
            content: `CLAUSE:\n${clause}`,
          },
        ],
        temperature: 0.2,
      }),
    },
  );

  const data = await response.json();
  console.log('datas', data);

  return data.choices?.[0]?.message?.content || 'No response';
};

// ── PDF extractor HTML (pdf.js via WebView) ────────────────────
const getPdfJsHtml = (base64: string) => `
<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  async function extract() {
    try {
      const binary = atob('${base64}');
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let fullText = '';

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        const pageText = content.items.map(function(i){ return i.str; }).join(' ');
        fullText += pageText + '\\n\\n';
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'text', text: fullText }));
    } catch (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: e.message }));
    }
  }
  extract();
</script>
</body>
</html>`;
// ── Main Component ─────────────────────────────────────────────
const AIReviewScreen = () => {
  const [contractType, setContractType] = useState('');
  const [businessLine, setBusinessLine] = useState('');
  const [country, setCountry] = useState('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<string | null>(null);
  const [tempSearchText, setTempSearchText] = useState('');
  const [countries, setCountries] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [extractedText, setExtractedText] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRedlineScreen, setShowRedlineScreen] = useState(false);
  const [pdfBase64, setPdfBase64] = useState('');
  const [extractionDone, setExtractionDone] = useState(false);
  const webViewRef = useRef<any>(null);

  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [askResponse, setAskResponse] = useState('');

  const scrollRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState('Indore, Madhya Pradesh');

  const contractTypes: PickerItem[] = [
    {label: 'NON-DISCLOSURE AGREEMENTS', value: 'NON-DISCLOSURE AGREEMENTS'},
    {label: 'CONFIDENTIALITY AGREEMENT', value: 'CONFIDENTIALITY AGREEMENT'},
    {label: 'CONSULTING AGREEMENT', value: 'CONSULTING AGREEMENT'},
    {label: 'SERVICE AGREEMENT', value: 'SERVICE AGREEMENT'},
    {label: 'COMMISSION AGREEMENT', value: 'COMMISSION AGREEMENT'},
    {label: 'DISTRIBUTION AGREEMENTS', value: 'DISTRIBUTION AGREEMENTS'},
    {
      label: 'EMPLOYEE DEPUTATION AGREEMENTS',
      value: 'EMPLOYEE DEPUTATION AGREEMENTS',
    },
    {label: 'SECONDMENT AGREEMENT', value: 'SECONDMENT AGREEMENT'},
    {label: 'FINANCE GUARANTEE', value: 'FINANCE GUARANTEE'},
    {label: 'PERFORMANCE GUARANTEE', value: 'PERFORMANCE GUARANTEE'},
    {label: 'INDEMNITY BOND', value: 'INDEMNITY BOND'},
    {label: 'POWER OF ATTORNEY', value: 'POWER OF ATTORNEY'},
    {
      label: 'JOINT DEVELOPMENT AGREEMENTS',
      value: 'JOINT DEVELOPMENT AGREEMENTS',
    },
    {label: 'JOINT VENTURE AGREEMENTS', value: 'JOINT VENTURE AGREEMENTS'},
    {
      label: 'LICENSE AGREEMENTS (TECHNOLOGY/IPR)',
      value: 'LICENSE AGREEMENTS (TECHNOLOGY OR IPR)',
    },
    {
      label: 'PURCHASE AND SALE AGREEMENTS',
      value: 'PURCHASE AND SALE AGREEMENTS',
    },
    {label: 'EPC CONTRACT', value: 'EPC CONTRACT'},
    {label: 'WARRANTY DOCUMENTS', value: 'WARRANTY DOCUMENTS'},
    {label: 'LEASE AGREEMENT', value: 'LEASE AGREEMENT'},
    {label: 'RENT AGREEMENT', value: 'RENT AGREEMENT'},
    {label: 'LOGISTICS AGREEMENT', value: 'LOGISTICS AGREEMENT'},
    {label: 'BANKING FACILITY AGREEMENT', value: 'BANKING FACILITY AGREEMENT'},
  ];

  const businessLines: PickerItem[] = [
    {value: 'REAL ESTATE', label: 'Real Estate'},
    {value: 'SALES', label: 'Sales'},
    {value: 'FINANCE ACCOUNTING', label: 'Finance & Accounting'},
    {value: 'HR', label: 'Human Resources'},
    {value: 'PRODUCTION', label: 'Production'},
    {value: 'LEGAL COMPLIANCE', label: 'Legal & Compliance'},
    {value: 'MARKETING', label: 'Marketing'},
    {value: 'LOGISTICS', label: 'Logistics & Warehousing'},
    {value: 'OTHERS', label: 'Others'},
  ];

  // ── Fetch countries ──────────────────────────────────────────
  const fetchCountries = async () => {
    setLoading(true);
    const response = await Services.getCountryList({limit: 1, offset: 0});
    if (response.success) {
      setCountries(
        response.data.map((c: any) => ({label: c.name, value: c.id})),
      );
    } else {
      Toast.show({type: 'error', text1: 'Failed to load countries'});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // ── Picker helpers ───────────────────────────────────────────
  const openPicker = (type: 'contractType' | 'businessLine' | 'country') => {
    setCurrentPicker(type);
    setPickerVisible(true);
  };
  const closePicker = () => {
    setPickerVisible(false);
    setTempSearchText('');
  };
  const handleSelect = (value: string) => {
    if (currentPicker === 'contractType') setContractType(value);
    if (currentPicker === 'businessLine') setBusinessLine(value);
    if (currentPicker === 'country') setCountry(value);
    closePicker();
  };
  const getLabelFromValue = (data: PickerItem[], val: any) =>
    data.find(i => i.value === val)?.label || 'Select...';
  const getFilteredItems = (items: PickerItem[], search: string) =>
    items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));

  const isRunDisabled = !(
    contractType &&
    businessLine &&
    country &&
    uploadedFile
  );
  const detectCity = (text: string) => {
    if (text.includes('Indore')) return 'Indore, Madhya Pradesh';
    if (text.includes('Delhi')) return 'Delhi, India';
    return '';
  };

  // ── Upload PDF ───────────────────────────────────────────────
  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: types.pdf,
        copyTo: 'cachesDirectory',
      });

      let filePath = (res.fileCopyUri || res.uri) ?? '';

      if (Platform.OS === 'android' && filePath.startsWith('content://')) {
        const destPath = `${RNFS.CachesDirectoryPath}/${res.name}`;
        await RNFS.copyFile(filePath, destPath);
        filePath = destPath;
      } else {
        filePath = filePath.replace('file://', '');
      }

      const base64 = await RNFS.readFile(filePath, 'base64');
      setPdfBase64(base64);
      setUploadedFile({...res, filePath});
      setExtractionDone(false);
      setSuggestions([]);
      setParagraphs([]);
      setExtractedText('');

      Toast.show({
        type: 'success',
        text1: 'PDF uploaded',
        text2: res.name ?? 'File ready',
      });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Toast.show({type: 'error', text1: 'Upload failed'});
      }
    }
  };

  // ── WebView message — text extracted from PDF ────────────────
  const handleWebViewMessage = async (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', msg.type);

      if (msg.type === 'error') {
        console.log('Extraction error:', msg.message);
        setIsExtracting(false);
        Alert.alert('Extraction failed', msg.message);
        return;
      }

      if (msg.type === 'text') {
        const text: string = msg.text;
        console.log('Extracted text length:', text.length);
        console.log('Extracted text preview:', text.slice(0, 300));

        if (text.trim().length < 50) {
          setIsExtracting(false);
          Alert.alert(
            'Cannot read PDF',
            'This PDF appears to be scanned or image-based. Please use a text-based PDF.',
          );
          return;
        }

        setExtractedText(text);

        // ── Clean up PDF artifacts ──
        const cleaned = text
          .replace(/[ \t]{2,}/g, ' ')
          .replace(/([a-z,])\n([a-zA-Z])/g, '$1 $2')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        // ── Split into paragraphs ──
        let paras = cleaned
          .split(/\n{2,}/)
          .map((p: string) => p.replace(/\s+/g, ' ').trim())
          .filter((p: string) => p.length > 40);

        // ── Fallback: chunk by sentences if too few paragraphs ──
        if (paras.length < 3) {
          const sentences = cleaned
            .replace(/([.!?])\s+/g, '$1\n')
            .split('\n')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 40);

          const chunks: string[] = [];
          for (let i = 0; i < sentences.length; i += 3) {
            chunks.push(sentences.slice(i, i + 3).join(' '));
          }
          paras = chunks;
        }

        // ── Limit to 30 paragraphs ──
        const limitedParas = paras.slice(0, 30);
        console.log('Paragraphs found:', limitedParas.length);
        console.log('First para preview:', limitedParas[0]?.slice(0, 100));

        const clauses = detectClauses(cleaned);
        const clauseTexts = clauses.map(c => c.text);

       setParagraphs(clauseTexts);

setIsExtracting(false);
setExtractionDone(true);

// ✅ START ANALYZING LOADER
setIsAnalyzing(true);

await runAIAnalysis(clauseTexts);

// ✅ STOP LOADER
setIsAnalyzing(false);
      }
    } catch (e) {
      console.log('WebView message parse error:', e);
      setIsExtracting(false);
    }
  };

  // ── Run Claude analysis ──────────────────────────────────────
//   const runAIAnalysis = async (clauses: string[]) => {
    
//     const all: Suggestion[] = [];
//     let counter = 0;

//     for (let i = 0; i < clauses.length; i++) {
//       const res = await analyzeClauseAI(clauses[i], i);

//       const mapped = res.map((item: any) => ({
//         id: counter++,
//         type: item.type,
//         title: item.title,
//         reason: item.reason,
//         paragraphIndex: item.paragraphIndex ?? i,
//         original: item.original || null,
//         suggested: item.suggested,
//         explanation: item.explanation, // ✅ ADD THIS
//         status: 'pending',
//       }));

// const valid = mapped.filter(item => {
//   if (!item.original) return true;

//   return clauses[item.paragraphIndex]?.includes(item.original);
// });

// all.push(...valid);
//     }

//     setSuggestions(all);
//   };
const runAIAnalysis = async (clauses: string[]) => {
  setIsAnalyzing(true); // ✅ ALWAYS START

  const all: Suggestion[] = [];
  let counter = 0;

  try {
    for (let i = 0; i < clauses.length; i++) {
      const res = await analyzeClauseAI(clauses[i], i);

      const mapped = res.map((item: any) => ({
        id: counter++,
        type: item.type,
        title: item.title,
        reason: item.reason,
        paragraphIndex: item.paragraphIndex ?? i,
        original: item.original || null,
        suggested: item.suggested,
        explanation: item.explanation,
        status: 'pending',
      }));

      // ✅ VALID FILTER
      const valid = mapped.filter((item:any) => {
        if (!item.original) return true;
        return clauses[item.paragraphIndex]?.includes(item.original);
      });

      all.push(...valid);
    }

    setSuggestions(all);
  } catch (e) {
    console.log('AI ERROR:', e);
  } finally {
    setIsAnalyzing(false); // ✅ ALWAYS STOP
  }
};
  // ── Run button ───────────────────────────────────────────────
  const handleRun = () => {
    if (!uploadedFile) {
      Alert.alert('Error', 'Please upload a file first');
      return;
    }
    setSuggestions([]);
    setParagraphs([]);
    setExtractionDone(false);
    setShowRedlineScreen(true);
  setIsExtracting(true);   // PDF extraction
setIsAnalyzing(false); 
  };
  const contractText = paragraphs.join(' ');
  const finalLocation = userLocation || detectCity(contractText) || 'India';

  const decide = (id: number, status: 'accepted' | 'rejected') => {
    setSuggestions(prev =>
      prev.map(s => {
        if (s.id !== id) return s;

        // ✅ prevent duplicate click
        if (s.status !== 'pending') return s;

        let updatedSuggested = s.suggested;

        // ✅ Only process placeholders on ACCEPT
        if (status === 'accepted') {
          updatedSuggested = updatedSuggested
            .replace(/\[Insert City, State\]/gi, finalLocation)
            .replace(/\[City, State\]/gi, finalLocation)
            .replace(/\[Insert City\]/gi, finalLocation.split(',')[0])
            .replace(/\[City\]/gi, finalLocation.split(',')[0])
            .replace(
              /\[Insert State\]/gi,
              finalLocation.split(',')[1]?.trim() || '',
            )
            .replace(/\[State\]/gi, finalLocation.split(',')[1]?.trim() || '');
        }

        // ❌ DO NOT MODIFY PARAGRAPHS HERE
        // (important for redline UI)

        return {
          ...s,
          status,
          suggested: updatedSuggested,
        };
      }),
    );
  };
  const renderParagraph = (para: string, index: number) => {
    const relevant = suggestions.filter(s => s.paragraphIndex === index);

    let segments = [{text: para, id: null as number | null}];

    // 🔹 STEP 1: Split text into segments
    relevant.forEach(s => {
      if (!s.original) return;

      const original = s.original;

      segments = segments.flatMap(seg => {
        if (seg.id !== null) return [seg];
        if (!seg.text.includes(original)) return [seg]; // ✅ SAFE CHECK

        const parts = seg.text.split(original);

        const result: {text: string; id: number | null}[] = [];

        parts.forEach((p, i) => {
          if (p) result.push({text: p, id: null});

          if (i < parts.length - 1) {
            result.push({text: original, id: s.id});
          }
        });

        return result;
      });
    });

    // 🔹 STEP 2: Render
    return (
      <View style={styles.paraBlock}>
        {segments.map((seg, i) => {
          // 🟢 NORMAL TEXT
          if (seg.id === null) {
            return (
              <Text key={i} style={{fontSize: 14, lineHeight: 22}}>
                {seg.text}
              </Text>
            );
          }

          // 🔴 MATCHED ISSUE
          const s = relevant.find(x => x.id === seg.id);

          // ❌ If rejected → show original normal text
          if (!s || s.status === 'rejected') {
            return (
              <Text key={i} style={{fontSize: 14, lineHeight: 22}}>
                {seg.text}
              </Text>
            );
          }

          // ✅ If accepted → DO NOT show suggestion UI
          // (because text already replaced in paragraph)
          if (s.status === 'accepted') {
            return (
              <View key={i} style={{marginVertical: 6}}>
                <Text
                  style={{
                    color: 'red',
                    textDecorationLine: 'line-through',
                  }}>
                  {seg.text}
                </Text>

                <Text
                  style={{
                    color: 'green',
                    fontWeight: '600',
                  }}>
                  {s.suggested}
                </Text>
              </View>
            );
          }

          // 🟡 Pending → show inline editor
          return (
            <View key={i} style={{marginVertical: 8}}>
              {/* ❌ Removed text */}
              <Text
                style={{
                  backgroundColor: '#ffe6e6',
                  color: 'red',
                  textDecorationLine: 'line-through',
                }}>
                {seg.text}
              </Text>

              {/* ✅ Suggestion box */}
              <View style={styles.inlineSuggestionBox}>
                <Text style={styles.inlineTitle}>⚠ {s.title}</Text>

                <Text style={styles.inlineReason}>{s.reason}</Text>

                {s.explanation && (
                  <Text style={styles.inlineExplain}>💡 {s.explanation}</Text>
                )}

                <Text style={styles.inlineAdd}>✅ {s.suggested}</Text>

                <View style={{flexDirection: 'row', gap: 10, marginTop: 8}}>
                  <TouchableOpacity
                    style={styles.btnAccept}
                    onPress={() => decide(s.id, 'accepted')}>
                    <Text style={styles.btnAcceptText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnReject}
                    onPress={() => decide(s.id, 'rejected')}>
                    <Text style={styles.btnRejectText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const generateFinalContract = () => {
    let finalParagraphs = [...paragraphs];

    suggestions.forEach(s => {
      if (s.status !== 'accepted') return;

      if (s.original) {
        finalParagraphs = finalParagraphs.map((para, i) => {
          if (i !== s.paragraphIndex) return para;

          // ✅ Safe replace (handles multiple occurrences)
          return para.split(s.original!).join(s.suggested);
        });
      } else {
        // ✅ Add clause case
        finalParagraphs = finalParagraphs.map((para, i) => {
          if (i !== s.paragraphIndex) return para;

          return para + '\n\n' + s.suggested;
        });
      }
    });

    return finalParagraphs.join('\n\n');
  };

  const exportFinalPDF = async () => {
    try {
      const contractText = generateFinalContract();

      const html = `
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: "Times New Roman", serif;
          font-size: 13.5px;
          line-height: 1.8;
          padding: 40px;
          color: #000;
        }

        .container {
          max-width: 800px;
          margin: auto;
        }

        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 25px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .subtitle {
          text-align: center;
          font-size: 13px;
          margin-bottom: 30px;
        }

        p {
          margin-bottom: 12px;
          text-align: justify;
        }

        .section-title {
          font-weight: bold;
          margin-top: 24px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        ul {
          margin-left: 25px;
          margin-bottom: 15px;
        }

        li {
          margin-bottom: 6px;
        }

        .signature-section {
          margin-top: 50px;
        }

        .signature-block {
          margin-top: 30px;
        }

        .signature-line {
          margin-top: 40px;
          border-top: 1px solid #000;
          width: 250px;
        }

        .footer {
          margin-top: 40px;
          font-size: 11px;
          text-align: center;
          color: #666;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="title">NON-DISCLOSURE AGREEMENT</div>

        <div class="subtitle">
          This Agreement is made and entered into on the Effective Date between the parties.
        </div>

        ${contractText
          .split('\n\n')
          .map(p => {
            // Bullet handling
            if (p.includes('•')) {
              const items = p.split('•').filter(Boolean);
              return `
                <ul>
                  ${items.map(i => `<li>${i.trim()}</li>`).join('')}
                </ul>
              `;
            }

            // Section detection (simple heuristic)
            if (p.length < 80 && p === p.toUpperCase()) {
              return `<div class="section-title">${p}</div>`;
            }

            return `<p>${p}</p>`;
          })
          .join('')}

        <div class="signature-section">

          <div class="section-title">SIGNATURES</div>

          <div class="signature-block">
            <p><strong>For the Seller:</strong></p>
            <div class="signature-line"></div>
            <p>Name</p>
            <p>Title</p>
            <p>Date</p>
          </div>

          <div class="signature-block">
            <p><strong>For the Buyer:</strong></p>
            <div class="signature-line"></div>
            <p>Name</p>
            <p>Title</p>
            <p>Date</p>
          </div>

        </div>

        <div class="footer">
          This document is electronically generated and legally valid.
        </div>

      </div>
    </body>
    </html>
    `;

      await RNPrint.print({html});
    } catch (error) {
      console.log('PRINT ERROR:', error);
    }
  };

  // ── Stats ────────────────────────────────────────────────────
  const pendingCount = suggestions.filter(s => s.status === 'pending').length;
  const acceptedCount = suggestions.filter(s => s.status === 'accepted').length;
  const rejectedCount = suggestions.filter(s => s.status === 'rejected').length;

  // ── Picker question row ──────────────────────────────────────
  const QuestionItem = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.questionItem} onPress={onPress}>
      <Text style={styles.questionText}>{label}</Text>
      <View style={styles.questionValue}>
        <Text style={styles.valueText} numberOfLines={1}>
          {value || 'Select...'}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const handleAskCustom = async () => {
    if (!question.trim() || !selectedClause) return;

    setAskLoading(true);

    const res = await askClauseAI(
      `QUESTION: ${question}\n\nCLAUSE:\n${selectedClause}`,
    );

    setAskResponse(res);
    setAskLoading(false);
    setQuestion('');
  };
  const askWithType = async (type: string) => {
    if (!selectedClause) return;

    setAskLoading(true);

    let instruction = '';

    if (type === 'explain') instruction = 'Explain this clause in simple terms';
    if (type === 'risk') instruction = 'Identify legal risks in this clause';
    if (type === 'rewrite') instruction = 'Rewrite this clause professionally';
    if (type === 'safer')
      instruction = 'Rewrite this clause to reduce legal risk';

    const res = await askClauseAI(
      `${instruction}\n\nCLAUSE:\n${selectedClause}`,
    );

    setAskResponse(res);
    setAskLoading(false);
  };
  // ── Render ───────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Hidden WebView for PDF extraction */}
      {showRedlineScreen && pdfBase64 !== '' && !extractionDone && (
        <View style={{height: 0, width: 0, overflow: 'hidden'}}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: getPdfJsHtml(pdfBase64)}}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
          />
        </View>
      )}

      {/* ── Upload Screen ── */}
      {!showRedlineScreen && (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContainer}>
          {Platform.OS === 'ios' ? (
            <SafeAreaView style={{backgroundColor: '#0E3386'}}>
              <View style={styles.headerContentWrapper}>
                <LinearGradient
                  colors={['#3959a5ff', '#3658a5ff']}
                  style={[styles.header, {paddingTop: 12}]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.headerTitle}>Upload Contract</Text>
                  <Text style={styles.headerSubtitle}>
                    Upload your PDF contract for AI redline review
                  </Text>
                </LinearGradient>
                <TouchableOpacity
                  style={styles.uploadButtonIos}
                  onPress={handleUpload}>
                  <Icon name="cloud-upload" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>
                    {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
                  </Text>
                </TouchableOpacity>
                {uploadedFile && (
                  <Text style={styles.fileSizeText}>
                    {Math.round((uploadedFile.size ?? 0) / 1024)} KB
                  </Text>
                )}
              </View>
            </SafeAreaView>
          ) : (
            <LinearGradient
              colors={['#0E3386', '#1A3B8B']}
              style={styles.header}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.headerTitle}>Upload Contract</Text>
              <Text style={styles.headerSubtitle}>
                Upload your PDF contract for AI redline review
              </Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}>
                <Icon name="cloud-upload" size={24} color="white" />
                <Text style={styles.uploadButtonText}>
                  {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
                </Text>
              </TouchableOpacity>
              {uploadedFile && (
                <Text style={styles.fileSizeText}>
                  {Math.round((uploadedFile.size ?? 0) / 1024)} KB
                </Text>
              )}
            </LinearGradient>
          )}

          <View style={styles.card}>
            <QuestionItem
              label="1. What type of contract is it?"
              value={contractType}
              onPress={() => openPicker('contractType')}
            />
            <QuestionItem
              label="2. Line of business?"
              value={businessLine}
              onPress={() => openPicker('businessLine')}
            />
            <QuestionItem
              label="3. Select your country?"
              value={getLabelFromValue(countries, country)}
              onPress={() => openPicker('country')}
            />
          </View>

          <TouchableOpacity
            style={[styles.runButton, isRunDisabled && styles.disabledButton]}
            onPress={handleRun}
            disabled={isRunDisabled}>
            <Text style={styles.runButtonText}>Run AI Redline Analysis</Text>
          </TouchableOpacity>

          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              Note* — AI can make mistakes. Always verify suggestions with your
              legal team. This does not replace legal services and advice
              provided is for guidance only.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* ── Redline Review Screen ── */}
      {showRedlineScreen && (
        <View style={styles.redlineContainer}>
          {/* Header */}
          <View style={styles.redlineHeader}>
            <TouchableOpacity onPress={() => setShowRedlineScreen(false)}>
              <Icon name="arrow-back" size={24} color="#0E3386" />
            </TouchableOpacity>
            <Text style={styles.redlineTitle}>AI Redline Review</Text>
            <TouchableOpacity
          onPress={async () => {
  if (extractedText) {
    setIsAnalyzing(true); // ✅ START LOADER
    setSuggestions([]);   // optional reset

    await runAIAnalysis(paragraphs);

    setIsAnalyzing(false); // ✅ STOP
  }
}}
              disabled={isAnalyzing || isExtracting}>
              <Icon
                name="refresh"
                size={24}
                color={isAnalyzing || isExtracting ? '#ccc' : '#0E3386'}
              />
            </TouchableOpacity>
          </View>

          {/* Stats bar */}
          {!isExtracting && !isAnalyzing && suggestions.length > 0 && (
            <View style={styles.statsBar}>
              <View style={styles.statPill}>
                <Text style={styles.statText}>{suggestions.length} total</Text>
              </View>
              <View style={[styles.statPill, styles.statPillAccepted]}>
                <Text style={[styles.statText, styles.statTextAccepted]}>
                  {acceptedCount} accepted
                </Text>
              </View>
              <View style={[styles.statPill, styles.statPillRejected]}>
                <Text style={[styles.statText, styles.statTextRejected]}>
                  {rejectedCount} rejected
                </Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statText}>{pendingCount} pending</Text>
              </View>
            </View>
          )}

          {/* Loading */}
          {(isExtracting || isAnalyzing) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E3386" />
              <Text style={styles.loadingText}>
                {isExtracting
                  ? 'Extracting text from PDF...'
                  : 'AI is analyzing your contract...'}
              </Text>
              <Text style={styles.loadingSubText}>
                {isAnalyzing ? 'Checking risks, missing clauses, and improvements. This may take 10–20 seconds' : ''}
              </Text>
            </View>
          )}
          {!isExtracting && !isAnalyzing && (
            <>
              {/* ✅ Scrollable Content */}
              <ScrollView
                contentContainerStyle={{padding: 16, paddingBottom: 120}}>
                {/* Contract paragraphs */}
                {paragraphs.length > 0 && (
                  <View style={styles.contractCard}>
                    <Text style={styles.sectionLabel}>Contract text</Text>

                    {paragraphs.map((para, idx) => (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        onPress={() => {
                          console.log('CLICKED CLAUSE:', idx); // ✅ debug
                          setSelectedClause(para);
                          setSelectedIndex(idx);
                          setAskResponse('');
                        }}
                        style={{
                          borderWidth: selectedIndex === idx ? 2 : 0, // ✅ highlight
                          borderColor: '#0E3386',
                          borderRadius: 8,
                          marginBottom: 6,
                        }}>
                        {renderParagraph(para, idx)}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Empty state */}
                {suggestions.length === 0 && extractionDone && (
                  <View style={styles.emptyState}>
                    <Icon name="check-circle" size={52} color="#3B6D11" />
                    <Text style={styles.emptyStateTitle}>No issues found</Text>
                    <Text style={styles.emptyStateText}>
                      This contract looks clean. Tap refresh to re-analyze.
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* ✅ FLOATING ASK AI BUTTON */}
              {/* {selectedClause && (*/}
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 12,
                  right: 12,
                  zIndex: 999,
                  elevation: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}>
                  {/* Generate */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0E3386',
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      const final = generateFinalContract();
                      console.log(final);
                      Alert.alert('Final Contract Ready');
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      Generate
                    </Text>
                  </TouchableOpacity>

                  {/* Export */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0E3386',
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={exportFinalPDF}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      Export
                    </Text>
                  </TouchableOpacity>

                  {/* Ask AI */}
                  <TouchableOpacity
                    style={{
                      flex: 1.4,
                      backgroundColor: '#0E3386',
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                      elevation: 5,
                    }}
                    onPress={() => setShowAskModal(true)}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: '700',
                      }}>
                      Ask AI
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* )} */}
            </>
          )}
        </View>
      )}

      {/* ── Picker Modal ── */}
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={closePicker}>
        <View style={styles.pickerModal}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>
              {currentPicker === 'contractType' && 'Select Contract Type'}
              {currentPicker === 'businessLine' && 'Select Business Line'}
              {currentPicker === 'country' && 'Select Country'}
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={tempSearchText}
              onChangeText={setTempSearchText}
              autoFocus
            />
            <FlatList
              data={
                currentPicker === 'contractType'
                  ? getFilteredItems(contractTypes, tempSearchText)
                  : currentPicker === 'businessLine'
                  ? getFilteredItems(businessLines, tempSearchText)
                  : getFilteredItems(countries, tempSearchText)
              }
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={styles.listItem}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={closePicker}>
              <Text style={styles.pickerCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showAskModal}
        animationType="slide"
        onRequestClose={() => setShowAskModal(false)}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1, padding: 16, justifyContent: 'flex-start'}}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Ask AI (Clause)
              </Text>

              <TouchableOpacity onPress={() => setShowAskModal(false)}>
                <Text style={{color: '#0E3386', fontWeight: '600'}}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Clause Preview */}
            <ScrollView
              style={{marginBottom: 10}}
              contentContainerStyle={{padding: 1, paddingBottom: 120}}>
              <View style={styles.clauseCard}>
                <Text style={styles.clauseTitle}>Selected Clause</Text>

                <ScrollView style={{maxHeight: 140}}>
                  <Text style={styles.clauseText}>{selectedClause}</Text>
                </ScrollView>
              </View>
            </ScrollView>

            {/* Actions */}
            {/* Actions */}
            <View style={{marginBottom: 12}}>
              <Text style={{fontSize: 12, color: '#888', marginBottom: 6}}>
                Quick Actions
              </Text>

              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => askWithType('explain')}>
                  <Text style={styles.chipText}>🧠 Explain</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => askWithType('risk')}>
                  <Text style={styles.chipText}>⚠ Risk</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => askWithType('rewrite')}>
                  <Text style={styles.chipText}>✍ Rewrite</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => askWithType('safer')}>
                  <Text style={styles.chipText}>🛡 Safer</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.askBox}>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Ask anything about this clause..."
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleAskCustom}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
            {askLoading ? (
              <ActivityIndicator size="large" color="#0E3386" />
            ) : askResponse ? (
              <ScrollView>
                <View style={styles.answerCard}>
                  <Text style={styles.answerTitle}>✨ AI Answer</Text>
                  <Text style={styles.answerText}>{askResponse}</Text>
                </View>
              </ScrollView>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
      <Toast />
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FC'},
  scrollContainer: {paddingBottom: 20},
  headerContentWrapper: {paddingHorizontal: 16, marginTop: 12},
  header: {padding: 15, borderTopLeftRadius: 20, borderBottomRightRadius: 20},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },

  clauseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },

  clauseTitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
  },

  clauseText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 25,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#355192',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonIos: {
    flexDirection: 'row',
    backgroundColor: '#355192',
    borderRadius: 10,
    paddingVertical: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
    flexShrink: 1,
  },
  fileSizeText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C41E3A',
  },
  noteText: {fontSize: 12, color: '#C41E3A', lineHeight: 18},
  questionItem: {marginBottom: 20},
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  questionValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  valueText: {fontSize: 14, color: '#666', flex: 1},
  runButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
  },
  disabledButton: {backgroundColor: '#cccccc'},
  runButtonText: {color: 'white', fontWeight: 'bold', fontSize: 16},

  // Redline screen
  redlineContainer: {flex: 1, backgroundColor: '#F5F7FC'},
  redlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  redlineTitle: {fontSize: 17, fontWeight: '700', color: '#0E3386'},
  statsBar: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexWrap: 'wrap',
  },
  statPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  statPillAccepted: {borderColor: '#3B6D11', backgroundColor: '#EAF3DE'},
  statPillRejected: {borderColor: '#791F1F', backgroundColor: '#FCEBEB'},
  statText: {fontSize: 12, color: '#555'},
  statTextAccepted: {color: '#3B6D11'},
  statTextRejected: {color: '#791F1F'},
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingSubText: {
    marginTop: 6,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // Contract
  contractCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  paraBlock: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  paraText: {fontSize: 13, lineHeight: 22, color: '#333'},
  acceptedInline: {backgroundColor: '#EAF3DE', color: '#173404'},
  pendingInline: {backgroundColor: '#FCEBEB', color: '#501313'},

  // Suggestion card
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    flexWrap: 'wrap',
  },
  typeTag: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99},
  tagRisk: {backgroundColor: '#FCEBEB'},
  tagImprove: {backgroundColor: '#E6F1FB'},
  tagMissing: {backgroundColor: '#FAEEDA'},
  typeTagText: {fontSize: 11, fontWeight: '500'},
  tagRiskText: {color: '#791F1F'},
  tagImproveText: {color: '#0C447C'},
  tagMissingText: {color: '#633806'},
  suggestionTitle: {fontSize: 13, fontWeight: '500', color: '#222', flex: 1},
  suggestionReason: {
    fontSize: 12,
    color: '#666',
    padding: 12,
    paddingTop: 6,
    lineHeight: 18,
  },
  diffBlock: {marginHorizontal: 12, marginBottom: 10},
  diffLabelRemove: {
    fontSize: 11,
    fontWeight: '500',
    color: '#791F1F',
    marginBottom: 4,
  },
  diffLabelAdd: {
    fontSize: 11,
    fontWeight: '500',
    color: '#27500A',
    marginBottom: 4,
  },
  diffTextRemove: {
    fontSize: 12,
    backgroundColor: '#FCEBEB',
    color: '#501313',
    padding: 8,
    borderRadius: 6,
    textDecorationLine: 'line-through',
    lineHeight: 18,
  },
  diffTextAdd: {
    fontSize: 12,
    backgroundColor: '#EAF3DE',
    color: '#173404',
    padding: 8,
    borderRadius: 6,
    lineHeight: 18,
  },
  actionRow: {flexDirection: 'row', gap: 8, padding: 12, paddingTop: 4},
  btnAccept: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EAF3DE',
    borderWidth: 0.5,
    borderColor: '#3B6D11',
  },
  btnAcceptText: {fontSize: 13, fontWeight: '500', color: '#27500A'},
  btnReject: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  btnRejectText: {fontSize: 13, color: '#555'},
  chipAccepted: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EAF3DE',
  },
  chipAcceptedText: {fontSize: 12, fontWeight: '500', color: '#27500A'},
  chipRejected: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  chipRejectedText: {fontSize: 12, color: '#888'},
  emptyState: {alignItems: 'center', padding: 48},
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B6D11',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },

  // Picker
  pickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  pickerCloseButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerCloseText: {color: 'white', fontSize: 16, fontWeight: '600'},
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLabel: {fontSize: 16, color: '#333'},
  inlineSuggestionBox: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },

  inlineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  inlineReason: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  inlineExplain: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },

  inlineRemove: {
    fontSize: 12,
    color: 'red',
    textDecorationLine: 'line-through',
    marginTop: 6,
  },

  inlineAdd: {
    fontSize: 12,
    color: 'green',
    marginTop: 4,
    fontWeight: '500',
  },

  chip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,

    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  chipText: {
    fontSize: 12,
    color: '#3730A3',
    fontWeight: '500',
  },

  askBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#0F172A',
  },

  sendBtn: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  sendText: {
    color: '#fff',
    fontWeight: '600',
  },

  answerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,

    // 👇 ADD THIS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  answerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E3386',
    marginBottom: 8,
  },

  answerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
  },
});

export default AIReviewScreen;
