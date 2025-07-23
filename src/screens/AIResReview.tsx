    

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Linking,
  
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileViewer from 'react-native-file-viewer';
import Clipboard from '@react-native-clipboard/clipboard';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import Services from '../Services/services';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
const AIReviewScreen = () => {
  // State declarations
  const [contractType, setContractType] = useState('');
  const [businessLine, setBusinessLine] = useState('');
  const [country, setCountry] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isFileViewerVisible, setFileViewerVisible] = useState(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUri, setFileUri] = useState<string>('');
  const [countries, setCountries] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tempSearchText, setTempSearchText] = useState('');



  type PickerItem = {
    label: string;
    value: string;
  };

  const contractTypes = [
    { label: "NON-DISCLOSURE AGREEMENTS", value: "NON-DISCLOSURE AGREEMENTS" },
    { label: "CONFIDENTIALITY AGREEMENT", value: "CONFIDENTIALITY AGREEMENT" },
    { label: "CONSULTING AGREEMENT", value: "CONSULTING AGREEMENT" },
    { label: "SERVICE AGREEMENT", value: "SERVICE AGREEMENT" },
    { label: "COMMISSION AGREEMENT", value: "COMMISSION AGREEMENT" },
    { label: "DISTRIBUTION AGREEMENTS", value: "DISTRIBUTION AGREEMENTS" },
    {
      label: "EMPLOYEE DEPUTATION AGREEMENTS",
      value: "EMPLOYEE DEPUTATION AGREEMENTS",
    },
    { label: "SECONDMENT AGREEMENT", value: "SECONDMENT AGREEMENT" },
    { label: "FINANCE GUARANTEE", value: "FINANCE GUARANTEE" },
    { label: "PERFORMANCE GUARANTEE", value: "PERFORMANCE GUARANTEE" },
    { label: "INDEMNITY BOND", value: "INDEMNITY BOND" },
    { label: "POWER OF ATTORNEY", value: "POWER OF ATTORNEY" },
    {
      label: "JOINT DEVELOPMENT AGREEMENTS",
      value: "JOINT DEVELOPMENT AGREEMENTS",
    },
    { label: "JOINT VENTURE AGREEMENTS", value: "JOINT VENTURE AGREEMENTS" },
    {
      label: "LICENSE AGREEMENTS (TECHNOLOGY OR IPR)",
      value: "LICENSE AGREEMENTS (TECHNOLOGY OR IPR)",
    },
    {
      label: "PURCHASE AND SALE AGREEMENTS",
      value: "PURCHASE AND SALE AGREEMENTS",
    },
    {
      label: "SHARES PURCHASE AND SALE AGREEMENTS",
      value: "SHARES PURCHASE AND SALE AGREEMENTS",
    },
    {
      label: "SALE AND PURCHASE OF EQUIPMENT",
      value: "SALE AND PURCHASE OF EQUIPMENT",
    },
    {
      label: "INSTALLATION AGREEMENT OF THE EQUIPMENT",
      value: "INSTALLATION AGREEMENT OF THE EQUIPMENT",
    },
    {
      label: "SERVICE AGREEMENT OF THE EQUIPMENT",
      value: "SERVICE AGREEMENT OF THE EQUIPMENT",
    },
    { label: "EPC CONTRACT", value: "EPC CONTRACT" },
    {
      label: "POWER PURCHASE AGREEMENT (OPEN ACCESS, TRADING ETC.)",
      value: "POWER PURCHASE AGREEMENT (OPEN ACCESS, TRADING ETC.)",
    },
    { label: "WARRANTY DOCUMENTS", value: "WARRANTY DOCUMENTS" },
    {
      label: "ADVERTISING SERVICE AGREEMENT",
      value: "ADVERTISING SERVICE AGREEMENT",
    },
    { label: "MEDIA SERVICE AGREEMENT", value: "MEDIA SERVICE AGREEMENT" },
    {
      label: "TECHNOLOGY COLLABORATION AGREEMENT",
      value: "TECHNOLOGY COLLABORATION AGREEMENT",
    },
    { label: "LOGISTICS AGREEMENT", value: "LOGISTICS AGREEMENT" },
    { label: "TRANSPORT AGREEMENT", value: "TRANSPORT AGREEMENT" },
    { label: "FREIGHT AGREEMENT", value: "FREIGHT AGREEMENT" },
    {
      label: "RAW MATERIALS SUPPLY AGREEMENTS (INDIGENOUS OR IMPORTS)",
      value: "RAW MATERIALS SUPPLY AGREEMENTS (INDIGENOUS OR IMPORTS)",
    },
    { label: "PRIVATE LABEL AGREEMENTS", value: "PRIVATE LABEL AGREEMENTS" },
    { label: "BROKER AGREEMENTS", value: "BROKER AGREEMENTS" },
    { label: "DEEDS", value: "DEEDS" },
    { label: "EASEMENTS", value: "EASEMENTS" },
    { label: "LEASES", value: "LEASES" },
    { label: "OPTION AGREEMENTS", value: "OPTION AGREEMENTS" },
    { label: "SETTLEMENT AGREEMENTS", value: "SETTLEMENT AGREEMENTS" },
    { label: "SEVERANCE AGREEMENTS", value: "SEVERANCE AGREEMENTS" },
    { label: "SUBCONTRACT AGREEMENTS", value: "SUBCONTRACT AGREEMENTS" },
    { label: "JOB WORK AGREEMENTS", value: "JOB WORK AGREEMENTS" },
    { label: "CONTRACT MANUFACTURING", value: "CONTRACT MANUFACTURING" },
    {
      label: "BUYING AND SELLING OF IMMOVABLE PROPERTY",
      value: "BUYING AND SELLING OF IMMOVABLE PROPERTY",
    },
    { label: "BANKING FACILITY AGREEMENT", value: "BANKING FACILITY AGREEMENT" },
    { label: "LEAVE & LICENSE AGREEMENT", value: "LEAVE & LICENSE AGREEMENT" },
    { label: "LEASE AGREEMENT", value: "LEASE AGREEMENT" },
    { label: "RENT AGREEMENT", value: "RENT AGREEMENT" },
    {
      label: "OVERRIDING COMMISSION AGREEMENT",
      value: "OVERRIDING COMMISSION AGREEMENT",
    },
    {
      label: "ANNUAL RATED CONTRACT (MRO CONTRACTS)",
      value: "ANNUAL RATED CONTRACT (MRO CONTRACTS)",
    },
  ];



  const businessLines = [
    { value: "REAL ESTATE", label: "Real estate" },
    { value: "INDIA", label: "Procurement" },
    { value: "SALES", label: " Sales" },
    { value: "FINANCE ACCOUNTING", label: "Finance & Accounting" },
    { value: "HR", label: " Human Resources" },
    { value: "PRODUCTION", label: "Production" },
    { value: "QUALITY ASSURANCE", label: "Quality Assurance" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "VENDOR MANAGEMENT", label: "Vendor Management" },
    { value: "INVENTORY MANAGEMENT", label: "Inventory Management" },
    { value: "LOGISTICS WAREHOUSING", label: "Logistics & Warehousing" },
    { value: "SUPPLY CHAIN MANAGEMENT", label: "Supply Chain Management" },
    { value: "MARKETING", label: "Marketing" },
    { value: "COSTING", label: "Costing" },
    { value: "PAYROLL", label: "Payroll" },
    { value: "ITERP MANAGEMENT", label: "IT & ERP Management" },
    { value: "LEGAL COMPLIANCE", label: "Legal & Compliance" },
    { value: "HSE", label: "Health, Safety & Environment (HSE)" },
    { value: "RESEARCH DEVELOPMENT", label: "Research & Development (R&D)" },
    { value: "BUSINESS STRATEGY", label: "Business Strategy" },
    { value: "CUSTOMER SERVICE", label: "Customer Service" },
    { value: "OTHERS", label: "Others" },
  ];


  const Clauses = [
    { value: "SUMMARISE_CONTRACT", label: " Summary" },
    { value: "FRAUD_DETECTION", label: " Fraud Detection" },
    { value: "MISSING_CLAUSES", label: "Analyze" },

  ];

  useEffect(() => {
    if (countries.length > 0) {
      // Set default contract type
      setContractType('SERVICE AGREEMENT OF THE EQUIPMENT');

      // Set default business line
      setBusinessLine('REAL ESTATE');

      // Find and set Australia as default country
      const australia = countries.find(
        (c: PickerItem) => c.label === 'Australia'
      );
      if (australia) {
        setCountry(australia.value);
      }
    }
  }, [countries]);

  const closePicker = () => {
    setPickerVisible(false);
    setTempSearchText('');
  };
  const handleSelect = (value: string) => {
    switch (currentPicker) {
      case 'contractType': setContractType(value); break;
      case 'businessLine': setBusinessLine(value); break;
      case 'country': setCountry(value); break;
    }
    closePicker();
  };

  // Derived state for run button
  const isRunDisabled = !(
    contractType &&
    businessLine &&
    country &&
    uploadedFile
  );

  // const handleSelect= (value: string) => {
  //   switch (currentPicker) {
  //     case 'contractType': setContractType(value); break;
  //     case 'businessLine': setBusinessLine(value); break;
  //     case 'country': setCountry(value); break;
  //   }
  //   setPickerVisible(false);
  // };
  const fetchCountries = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    const response = await Services.getCountryList({ limit: 1, offset: 0 });

    if (response.success) {
      const formattedCountries = response.data.map((country: any) => ({
        label: country.name,
        value: country.id,
      }));
      setCountries(formattedCountries);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to load countries',
        text2: response.error?.message || 'Something went wrong',
        position: 'top',
      });
    }

    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchCountries();
  }, []);
  const onRefresh = useCallback(() => {
    fetchCountries(true);
  }, []);


  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: types.pdf,
        copyTo: 'cachesDirectory', // ✅ Ensures you can read the file later
      });

      // Use the copied file path (prefer fileCopyUri)
      const safeUri = res.fileCopyUri || res.uri;

      setUploadedFile({
        ...res,
        safeUri, // 👈 Save it separately
      });

      Toast.show({
        type: 'success',
        text1: 'File uploaded',
        text2: `${res.name} uploaded successfully`,
      });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File selection error:', err);
        Toast.show({
          type: 'error',
          text1: 'Upload failed',
          text2: 'Could not pick file',
        });
      }
    }
  };

const openPdfInExternalApp = async (file) => {
  try {
    let filePath = file.fileCopyUri || file.uri;

    // ✅ Copy content URI to accessible file path (for Android)
    if (Platform.OS === 'android' && filePath.startsWith('content://')) {
      const destPath = `${RNFS.CachesDirectoryPath}/${file.name}`;
      await RNFS.copyFile(filePath, destPath);
      filePath = destPath;
    }

    const shareOptions = {
      title: 'Open PDF with...',
      url: `file://${filePath}`,
      type: 'application/pdf',
      failOnCancel: false,
    };

    await Share.open(shareOptions);  
  } catch (err) {
    console.error('Could not open PDF:', err);
    Alert.alert('Error', 'Could not open PDF in external app');
  }
};



  // Process AI summary
const getAiSummary = async () => {
  if (!selectedText) {
    Alert.alert('Error', 'Please select or type some text first');
    return;
  }

  setIsLoading(true);

  try {
    const payload = {
      message: selectedText,
      contract_type: contractType,
      line_of_business: businessLine,
      country: country,
    };

    console.log('AI Review Payload:', payload);

    const response = await Services.ai_Review(payload);
    console.log('AI Review Response:', response);

    if (!response.success || !response.data) {
      throw new Error(
        typeof response.error === 'string'
          ? response.error
          : 'AI analysis failed'
      );
    }

    setAiSummary(response.data.message || 'AI analysis completed');
  } catch (error: any) {
    console.error('AI Review Error:', error);
    Alert.alert('Error', error.message || 'Failed to get AI summary');
  } finally {
    setIsLoading(false);
  }
};


  // const handleRun = async () => {
  //   if (!uploadedFile) {
  //     Alert.alert('Error', 'Please upload a file first');
  //     return;
  //   }

  //   try {
  //     let uri = uploadedFile.uri;
  // console.log("uploadedFile",uri);

  //     // Convert content URI to file path for Android
  //     if (Platform.OS === 'android' && uri.startsWith('content://')) {
  //       const destPath = `${RNFS.CachesDirectoryPath}/${uploadedFile.name}`;
  //       await RNFS.copyFile(uri, destPath);
  //       uri = `file://${destPath}`;
  //     }

  //     // Upload PDF to a temporary file host (or your server)
  //     // For testing: skip upload and show with Google Docs
  //     const encodedUrl = encodeURIComponent(uri);
  //     const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;



  // //     const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}`;
  // // setFileUri(viewerUrl);
  // // setFileViewerVisible(true);
  //     setFileUri(googleViewerUrl);
  //     setFileViewerVisible(true);
  //   } catch (error) {
  //     console.error('File preparation error:', error);
  //     Alert.alert('Error', 'Could not prepare PDF for viewing.');
  //   }
  // };


  // Handle text copying

  // const handleRun = async () => {
  //   if (!uploadedFile) {
  //     Alert.alert('Error', 'Please upload a file first');
  //     return;
  //   }

  //   try {
  //     let uri = uploadedFile.safeUri || uploadedFile.uri;
  //     console.log('Uploaded File URI:', uri);

  //     // Convert content URI to file path for Android
  //     if (Platform.OS === 'android' && uri.startsWith('content://')) {
  //       const destPath = `${RNFS.CachesDirectoryPath}/${uploadedFile.name}`;
  //       await RNFS.copyFile(uri, destPath);
  //       uri = `file://${destPath}`;
  //     }

  //     // 🔁 Create FormData
  //     const formData = new FormData();
  //     formData.append('document', {
  //       uri,
  //       name: uploadedFile.name,
  //       type: uploadedFile.type || 'application/pdf',
  //     });

  //     // 🔁 Send to backend via generateUrl
  //     console.log("formData", formData);

  //     const result = await Services.generateUrl(formData);
  //     console.log("result22", result);
  //     if (!result.success || !result.data?.url) {
  //       throw new Error('Failed to generate file URL');
  //     }

  //     const backendUrl = result.data.url;
  //     const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(backendUrl)}`;
  //     console.log("backendUrl", backendUrl);

  //     setFileUri(googleViewerUrl);
  //     setFileViewerVisible(true);
  //   } catch (error) {
  //     console.error('Error preparing PDF:', error);
  //     Alert.alert('Error', 'Could not load PDF for viewing.');
  //   }
  // };



const handleRun = async () => {
    if (!uploadedFile) {
      Alert.alert('Error', 'Please upload a file first');
      return;
    }

    await openPdfInExternalApp(uploadedFile);

    Toast.show({
      type: 'info',
      text1: 'Copy text from PDF',
      text2: 'Then paste it back to analyze',
    });
    setFileViewerVisible(true);
  };


  const handleCopyToClipboard = () => {
    if (selectedText) {
      Clipboard.setString(selectedText);
      Toast.show({
        type: 'success',
        text1: 'Copied to clipboard',
        text2: 'Selected text is ready to paste',
      });
    }
  };

  // Reset selection
  const resetSelection = () => {
    setSelectedText('');
    setAiSummary('');
  };

  const openPicker = (pickerType: 'contractType' | 'businessLine' | 'country') => {
    setCurrentPicker(pickerType);
    setPickerVisible(true);
  };

  const getLabelFromValue = (data: { label: string; value: any }[], selectedValue: any) => {
    const found = data.find((item) => item.value === selectedValue);
    return found?.label || 'Select...';
  };


  const QuestionItem = ({ label, value, onPress }: {
    label: string;
    value: string;
    onPress: () => void
  }) => (
    <TouchableOpacity style={styles.questionItem} onPress={onPress}>
      <Text style={styles.questionText}>{label}</Text>
      <View style={styles.questionValue}>
        <Text style={styles.valueText}>{value || 'Select...'}</Text>
        <Icon name="arrow-drop-down" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const getFilteredItems = (items: PickerItem[], search: string) => {
    return items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#0E3386', '#1A3B8B']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>Upload Contract</Text>
          <Text style={styles.headerSubtitle}>
            Please upload contract to review its (PDF) format
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
          >
            <Icon name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>
              {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
            </Text>
          </TouchableOpacity>
          {uploadedFile && (
            <Text style={styles.fileSizeText}>
              {Math.round(uploadedFile.size / 1024)} KB
            </Text>
          )}
        </LinearGradient>

        {/* Questions Section */}
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

          <View style={styles.addButtonQues}>
            <Text style={styles.sectionTitle}>Selected Questions</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Questions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Run Button */}
        <TouchableOpacity
          style={[styles.runButton, isRunDisabled && styles.disabledButton]}
          onPress={handleRun}
          disabled={isRunDisabled}
        >
          <Text style={styles.runButtonText}>Run AI Analysis</Text>
        </TouchableOpacity>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Note* - AI - AIRES can make mistakes. Check important info with your legal team as well.
            This doesn't replace legal services and advice provided is only for guidance
          </Text>
        </View>
      </ScrollView>

      {/* File Viewer Modal */}
      <Modal visible={isFileViewerVisible} animationType="slide">
        <View style={styles.fileViewerContainer}>
          <View style={styles.fileViewerHeader}>
            <TouchableOpacity onPress={() => setFileViewerVisible(false)}>
              <Icon name="arrow-back" size={24} color="#0E3386" />
            </TouchableOpacity>
            <Text style={styles.fileViewerTitle}>Document Review</Text>
            <TouchableOpacity onPress={resetSelection}>
              <Icon name="refresh" size={24} color="#0E3386" />
            </TouchableOpacity>
          </View>

          {/* WebView for PDF with text selection */}
          {/* {uploadedFile?.name?.endsWith('.pdf') ? (
            <View style={styles.webviewContainer}>
              <WebView
                source={{ uri: fileUri }}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                onMessage={(event) => {
                  setSelectedText(event.nativeEvent.data);
                }}
                injectedJavaScript={`
                  // Enable text selection
                  document.body.style.userSelect = 'text';
                  document.body.style.webkitUserSelect = 'text';
                  
                  // Send selected text to React Native
                  document.addEventListener('selectionchange', () => {
                    const selection = window.getSelection().toString();
                    if (selection) {
                      window.ReactNativeWebView.postMessage(selection);
                    }
                  });
                  
                  true; // required for injectedJavaScript
                `}
              />
            </View>
          ) : (
            <Text style={styles.unsupportedText}>
              Unsupported file format. Please upload a PDF.
            </Text>
          )} */}
 <View style={styles.selectionPanel}>
  {/* Editable Selected Text Input (always visible) */}
  <View style={styles.selectedTextContainer}>
    <Text style={styles.selectedTextLabel}>Selected Text:</Text>

    <TextInput
      style={styles.editableInput}
      multiline
      value={selectedText}
      onChangeText={setSelectedText}
      placeholder="Select or paste text here..."
      textAlignVertical="top"
    />

    {/* Copy to Clipboard Button */}
    <TouchableOpacity
      style={styles.copyButton}
      onPress={handleCopyToClipboard}
    >
      <Icon name="content-copy" size={20} color="white" />
      <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
    </TouchableOpacity>
  </View>

  {/* AI Summary Section */}
  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>AI Summary:</Text>
    {isLoading ? (
      <ActivityIndicator size="large" color="#0E3386" />
    ) : aiSummary ? (
      <ScrollView style={styles.summaryScroll}>
        <Text style={styles.summaryText}>{aiSummary}</Text>
      </ScrollView>
    ) : (
      <Text style={styles.summaryPlaceholder}>
        {selectedText ? 'Press "Get Summary" to analyze' : 'Type or paste text above to analyze'}
      </Text>
    )}
  </View>

  {/* Get Summary Button */}
  <TouchableOpacity
    style={[styles.summaryButton, !selectedText && styles.disabledButton]}
    onPress={getAiSummary}
    disabled={!selectedText || isLoading}
  >
    <Text style={styles.summaryButtonText}>
      {isLoading ? 'Processing...' : 'Get Summary'}
    </Text>
  </TouchableOpacity>
</View>


        </View>
      </Modal>
      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
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
              autoFocus={true}
            />

            <FlatList
              data={
                currentPicker === 'contractType'
                  ? getFilteredItems(contractTypes, tempSearchText)
                  : currentPicker === 'businessLine'
                    ? getFilteredItems(businessLines, tempSearchText)
                    : getFilteredItems(countries, tempSearchText)
              }
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={styles.listItem}
                >
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />

            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={closePicker}
            >
              <Text style={styles.pickerCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({

  editableInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  minHeight: 100,
  maxHeight: 200,
  fontSize: 16,
  backgroundColor: '#fff',
  marginBottom: 10,
},
  container: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 18,
  },
  fileSizeText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C41E3A',
  },
  questionItem: {
    marginBottom: 20,
  },
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
  valueText: {
    fontSize: 16,
    color: '#666',
  },
  addButtonQues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A5BDA',
  },
  addButton: {
    backgroundColor: '#0E3386',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#000078',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#C41E3A',
    lineHeight: 18,
  },
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
  picker: {
    height: 180,
  },
  pickerCloseButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  runButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  runButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileViewerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fileViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  fileViewerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  webviewContainer: {
    flex: 1,
    height: '50%',
  },
  selectionHint: {
    textAlign: 'center',
    color: '#666',
    padding: 10,
  },
  textPreviewContainer: {
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  copyButton: {
    flexDirection: 'row',
    backgroundColor: '#0E3386',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  copyButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  unsupportedText: {
    textAlign: 'center',
    padding: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  selectionPanel: {
    padding: 16,
  },
  selectedTextContainer: {
    marginTop: 10,
  },
  selectedTextLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  selectedPreview: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  summaryContainer: {
    marginTop: 15,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0E3386',
  },
  summaryText: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  summaryPlaceholder: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    color: '#999',
    fontStyle: 'italic',
  },
  summaryButton: {
    backgroundColor: '#0E3386',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  summaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  summaryScroll: {
    maxHeight: 300,
  },
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
  itemLabel: {
    fontSize: 16,
  },
});

export default AIReviewScreen;
