
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   PermissionsAndroid,
//   Platform,
//   Linking
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { Picker } from '@react-native-picker/picker';
// import DocumentPicker, { types } from 'react-native-document-picker';
// import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Pdf from 'react-native-pdf';
// import FileViewer from 'react-native-file-viewer';

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
//   const [textSelectionMode, setTextSelectionMode] = useState<boolean>(false);

//   // Data options
//   const contractTypes = ["NON-DISCLOSURE AGREEMENTS", "CONFIDENTIALITY AGREEMENT", "CONSULTING AGREEMENT"];
//   const businessLines = ["REAL ESTATE", "PROCUREMENT", "SALES"];
//   const countries = ["United States", "India", "United Kingdom"];

//   // Derived state for run button
//   const isRunDisabled = !(
//     contractType &&
//     businessLine &&
//     country &&
//     uploadedFile
//   );

//   // Handle file upload
//   const handleUpload = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [types.docx, types.doc, types.pdf],
//       });

//       const file = res[0];
//       setUploadedFile(file);
//       Toast.show({
//         type: 'success',
//         text1: 'File uploaded',
//         text2: `${file.name} uploaded successfully`,
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

//   // Handle text selection
//   const handleTextSelection = () => {
//     setTextSelectionMode(!textSelectionMode);
//     if (!textSelectionMode) {
//       setSelectedText('');
//     }
//   };

//   // Process AI summary
//   const getAiSummary = async () => {
//     if (!selectedText) {
//       Alert.alert('Error', 'Please select some text first');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const token = await AsyncStorage.getItem('Token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const body = JSON.stringify({
//         message: selectedText,
//         contract_type: contractType,
//         line_of_business: businessLine,
//         country: country,
//       });

//       const response = await fetch('https://api.agreementpaper.site/settings/openai/analyze-contract/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Token ${token}`,
//         },
//         body
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`AI analysis failed: ${errorText}`);
//       }

//       const data = await response.json();
//       setAiSummary(data.message || "AI analysis completed");
//     } catch (error: any) {
//       console.error("Fetch error:", error);
//       Alert.alert('Error', error.message || 'Failed to get AI summary');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Run AI analysis
//   const handleRun = async () => {
//     if (!uploadedFile) {
//       Alert.alert('Error', 'Please upload a file first');
//       return;
//     }

//     setFileViewerVisible(true);
//   };

//   // Reset selection
//   const resetSelection = () => {
//     setSelectedText('');
//     setAiSummary('');
//   };

//   // FIXED: Open Word document using react-native-file-viewer
//   const openWordDocument = async () => {
//     try {
//       if (!uploadedFile) return;

//       // On Android, we need to request storage permission
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to your storage to open files',
//             buttonPositive: 'OK',
//           }
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           // Show a more helpful message with options to install apps
//           Alert.alert(
//             'Permission Required', 
//             'App needs storage permission to open documents. Would you like to install a document viewer?',
//             [
//               {
//                 text: 'Install WPS Office',
//                 onPress: () => Linking.openURL('market://details?id=cn.wps.moffice_eng')
//               },
//               {
//                 text: 'Install MS Word',
//                 onPress: () => Linking.openURL('market://details?id=com.microsoft.office.word')
//               },
//               { text: 'Cancel' }
//             ]
//           );
//           return;
//         }
//       }

//       // Open the file using react-native-file-viewer
//       await FileViewer.open(uploadedFile.uri, {
//         displayName: uploadedFile.name,
//         showOpenWithDialog: true,
//         showAppsSuggestions: true,
//       });
//     } catch (error) {
//       console.error('Failed to open Word file:', error);
//       Alert.alert(
//         'Error', 
//         'Could not open file. Make sure you have a document viewer installed.',
//         [
//           {
//             text: 'Install WPS Office',
//             onPress: () => Linking.openURL('market://details?id=cn.wps.moffice_eng')
//           },
//           {
//             text: 'Install MS Word',
//             onPress: () => Linking.openURL('market://details?id=com.microsoft.office.word')
//           },
//           { text: 'OK' }
//         ]
//       );
//     }
//   };

//   const openPicker = (pickerType: 'contractType' | 'businessLine' | 'country') => {
//     setCurrentPicker(pickerType);
//     setPickerVisible(true);
//   };

//   const handleSelect = (value: string) => {
//     switch (currentPicker) {
//       case 'contractType': setContractType(value); break;
//       case 'businessLine': setBusinessLine(value); break;
//       case 'country': setCountry(value); break;
//     }
//     setPickerVisible(false);
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

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header */}
//         <LinearGradient
//           colors={['#0E3386', '#1A3B8B']}
//           style={styles.header}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <Text style={styles.headerTitle}>Upload Contract</Text>
//           <Text style={styles.headerSubtitle}>
//             Please upload contract to review its (DOC/DOCX) format
//           </Text>
//           <TouchableOpacity
//             style={styles.uploadButton}
//             onPress={handleUpload}
//           >
//             <Icon name="cloud-upload" size={24} color="white" />
//             <Text style={styles.uploadButtonText}>
//               {uploadedFile ? uploadedFile.name : 'Upload Word Document'}
//             </Text>
//           </TouchableOpacity>
//           {uploadedFile && (
//             <Text style={styles.fileSizeText}>
//               {Math.round(uploadedFile.size / 1024)} KB
//             </Text>
//           )}
//         </LinearGradient>

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
//             value={country}
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
//       <Modal
//         visible={isFileViewerVisible}
//         animationType="slide"
//       >
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

//           {/* Document Preview */}
//           <View style={styles.documentContainer}>
//             {uploadedFile?.name?.endsWith?.('.pdf') && (
//               <Pdf
//                 source={{ uri: uploadedFile.uri }}
//                 style={{ flex: 1, height: 500, width: '100%' }}
//                 onError={(error) => {
//                   console.log('PDF error', error);
//                 }}
//               />
//             )}

//             {uploadedFile ? (
//               <Text style={{ textAlign: 'center', padding: 10 }}>
//                 {uploadedFile.name} is ready to view. Use the button below to open in Word viewer.
//               </Text>
//             ) : (
//               <Text>No document uploaded.</Text>
//             )}
//           </View>

//           <View style={styles.selectionPanel}>
//             <TouchableOpacity
//               style={styles.selectButton}
//               onPress={handleTextSelection}
//             >
//               <Text style={styles.selectButtonText}>
//                 {textSelectionMode ? 'Cancel Selection' : 'Select Text'}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.openButton}
//               onPress={openWordDocument}
//             >
//               <Text style={styles.openButtonText}>Open in Word</Text>
//             </TouchableOpacity>

//             {selectedText ? (
//               <View style={styles.selectedTextContainer}>
//                 <Text style={styles.selectedTextLabel}>Selected Text:</Text>
//                 <Text style={styles.selectedPreview} numberOfLines={2}>
//                   {selectedText}
//                 </Text>
//               </View>
//             ) : null}
//           </View>

//           <View style={styles.summaryContainer}>
//             <Text style={styles.summaryTitle}>AI Summary:</Text>
//             {isLoading ? (
//               <ActivityIndicator size="large" color="#0E3386" />
//             ) : aiSummary ? (
//               <ScrollView><Text style={styles.summaryText}>{aiSummary}</Text></ScrollView>
//             ) : (
//               <Text style={styles.summaryPlaceholder}>
//                 {selectedText ? 'Press "Get Summary" to analyze' : 'Select text to analyze'}
//               </Text>
//             )}
//           </View>

//           <TouchableOpacity
//             style={[styles.summaryButton, !selectedText && styles.disabledButton]}
//             onPress={getAiSummary}
//             disabled={!selectedText || isLoading}
//           >
//             <Text style={styles.summaryButtonText}>Get Summary</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <Modal
//         visible={isPickerVisible}
//         transparent={true}
//         animationType="slide"
//       >
//         <View style={styles.pickerModal}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerTitle}>
//               {currentPicker === 'contractType' && 'Contract Type'}
//               {currentPicker === 'businessLine' && 'Business Line'}
//               {currentPicker === 'country' && 'Select Country'}
//             </Text>

//             <Picker
//               selectedValue={
//                 currentPicker === 'contractType' ? contractType :
//                   currentPicker === 'businessLine' ? businessLine : country
//               }
//               onValueChange={handleSelect}
//               style={styles.picker}
//             >
//               <Picker.Item label="Select..." value="" />
//               {currentPicker === 'contractType' &&
//                 contractTypes.map((type, index) => (
//                   <Picker.Item label={type} value={type} key={index} />
//                 ))
//               }
//               {currentPicker === 'businessLine' &&
//                 businessLines.map((line, index) => (
//                   <Picker.Item label={line} value={line} key={index} />
//                 ))
//               }
//               {currentPicker === 'country' &&
//                 countries.map((country, index) => (
//                   <Picker.Item label={country} value={country} key={index} />
//                 ))
//               }
//             </Picker>

//             <TouchableOpacity
//               style={styles.pickerCloseButton}
//               onPress={() => setPickerVisible(false)}
//             >
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
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FC',
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   header: {
//     padding: 24,
//     borderBottomLeftRadius: 20,
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
//     marginBottom: 18,
//   },
//   fileSizeText: {
//     color: 'white',
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 5
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
//     backgroundColor: '#0E3386',
//     borderRadius: 10,
//     padding: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   uploadButtonText: {
//     color: 'white',
//     fontSize: 16,
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
//   documentContainer: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   webView: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   selectionPanel: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//   },
//   selectButton: {
//     backgroundColor: '#0E3386',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//     minWidth: 150,
//   },
//   openButton: {
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//     minWidth: 120,
//   },
//   selectButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   openButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   selectedTextContainer: {
//     backgroundColor: '#f0f0f0',
//     padding: 12,
//     borderRadius: 8,
//     width: '100%',
//     marginTop: 10,
//   },
//   selectedTextLabel: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//     color: '#666',
//   },
//   selectedPreview: {
//     color: '#333',
//     fontStyle: 'italic',
//   },
//   summaryContainer: {
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     flex: 1,
//   },
//   summaryTitle: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#0E3386',
//   },
//   summaryText: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     color: '#333',
//     flex: 1,
//   },
//   summaryPlaceholder: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     color: '#999',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },
//   summaryButton: {
//     backgroundColor: '#0E3386',
//     padding: 16,
//     alignItems: 'center',
//   },
//   summaryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default AIReviewScreen;     



import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const AIReviewScreen = () => {
  const handleRedirect = () => {
    Linking.openURL('https://app.agreementpaper.site/organisation/agreement_draft');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>AI-Review Is Coming Soon  on Mobile</Text>
        <Text style={styles.message}>
          For now please visit our web app using the same credentials to access this feature.{" "}
          {"                                                        "}
          Under AI - AI-Review Section.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleRedirect}>
          <Text style={styles.buttonText}>Go to Web App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FC',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E3386',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AIReviewScreen;