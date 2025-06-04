
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Modal,
  RefreshControl,
  ActivityIndicator,
  PermissionsAndroid,

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-blob-util';
import FormattedTextComp from '../components/FormatedAIResponse';
const AIResFullReviewScreen = () => {
  const [contractType, setContractType] = useState('');
  const [businessLine, setBusinessLine] = useState('');
  const [country, setCountry] = useState('');
  const [activeTab, setActiveTab] = useState('Analysis');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  type PickerItem = {
    label: string;
    value: string;
  };
  console.log("analysisResult", analysisResult);

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
    { value: "MISSING_CLAUSES", label: "Analyze" },
    { value: "SUMMARISE_CONTRACT", label: " Summary" },
    { value: "FRAUD_DETECTION", label: " Fraud Detection" },
  ];


  const renderPickerItems = (items: PickerItem[]) => {
    return items.map((item, index) => (
      <Picker.Item label={item.label} value={item.value} key={index} />
    ));
  };


  const openPicker = (pickerType: 'contractType' | 'businessLine' | 'country') => {
    setCurrentPicker(pickerType);
    setPickerVisible(true);
  };


  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });

      const file = res[0];

      setSelectedFile({
        name: file.name,
        type: file.type,
        uri: file.uri,
        size: file.size
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('DocumentPicker Error:', err);
        Toast.show({
          type: 'error',
          text1: 'File Selection Failed',
          text2: 'Please try again',
          position: 'top',
        });
      }
    }
  };

  const handleSelect = (value: string) => {
    switch (currentPicker) {
      case 'contractType': setContractType(value); break;
      case 'businessLine': setBusinessLine(value); break;
      case 'country': setCountry(value); break;
    }
    setPickerVisible(false);
  };


  const fetchCountries = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    const response = await Services.getCountryList({ limit: 1, offset: 0 });
    console.log('response', response);

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

   if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000078" />
        </View>
      );
    }

  const submitContract = async (clauseType: string) => {
    if (!contractType || !businessLine || !country || !selectedFile) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill all fields and upload a file',
        position: 'top',
      });
      return;
    }

    setLoadingButton(clauseType);

    try {
      const formData = new FormData();

      formData.append('prompt_type', clauseType);

      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type || 'application/pdf',
      });
      console.log("formData", formData);

      const response = await Services.analysisContractByAi(formData);
      console.log("response analysisContractByAi", response);
      if (response.success) {
        setAnalysisResult(response.data);
        Toast.show({
          type: 'success',
          text1: 'Analysis Complete',
          text2: `Clause: ${clauseType} analyzed successfully`,
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Analysis Failed',
          text2: response.error || 'Something went wrong',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
        position: 'top',
      });
    } finally {
      setLoadingButton(null);
    }
  };


  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }  >
        <LinearGradient
          colors={['#0E3386', '#1A3B8B']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 0 }}
        >
          <Text style={styles.headerTitle}>Upload Contract</Text>
          <Text style={styles.headerSubtitle}>
            Please upload contract to review in (PDF) format
          </Text>
        </LinearGradient>

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


          <View style={styles.addButtonQues} > <Text style={styles.sectionTitle}>Selected Questions</Text> <TouchableOpacity><Text style={styles.tabItem1}>Add Questions</Text></TouchableOpacity> </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleFileUpload}
          >
            <Icon name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>
              {selectedFile ? 'Change File' : 'Upload'}
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileInfoContainer}>
              <Icon name="description" size={20} color="#0E3386" />
              <Text style={styles.selectedFileText}>
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </Text>
            </View>
          )}


        </View>

     
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI Response</Text>
    
        <View style={styles.noteCard}>
                  <Text style={styles.noteText}>
                    Note* - AI - AIRES can make mistakes. Check important info with your legal team as well.
                    This doesn't replace legal services and advice provided is only for guidance
                  </Text>
                </View>

          {analysisResult && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Analysis Result:</Text>
              <FormattedTextComp text={analysisResult} />
            </View>
          )}

        </View>
      </ScrollView>


      <View style={styles.tabContainer}>
        {Clauses.map((claus) => (
          <TouchableOpacity
            key={claus.value}
            style={[
              styles.tabItem,
              loadingButton === claus.value && styles.loadingTab,
            ]}
            onPress={() => submitContract(claus.value)}
            disabled={loadingButton !== null}
          >
            {loadingButton === claus.value ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.tabText}>{claus.label}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.pickerModal}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>
              {currentPicker === 'contractType' && 'Contract Type'}
              {currentPicker === 'businessLine' && 'Business Line'}
              {currentPicker === 'country' && 'Select Country'}
            </Text>

            {currentPicker && (
              <Picker
                selectedValue={
                  currentPicker === 'contractType'
                    ? contractType
                    : currentPicker === 'businessLine'
                      ? businessLine
                      : country
                }
                onValueChange={handleSelect}
                style={styles.picker}
              >
                {renderPickerItems(
                  currentPicker === 'contractType'
                    ? contractTypes
                    : currentPicker === 'businessLine'
                      ? businessLines
                      : currentPicker === 'country'
                        ? countries
                        : []
                )}
              </Picker>
            )}

            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.pickerCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const getLabelFromValue = (data: { label: string; value: any }[], selectedValue: any) => {
  const found = data.find((item) => item.value === selectedValue);
  return found?.label || 'Select...';
};


type QuestionItemProps = {
  label: string;
  value: string;
  onPress: () => void;
};

const QuestionItem: React.FC<QuestionItemProps> = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.questionItem} onPress={onPress}>
    <Text style={styles.questionText}>{label}</Text>
    <View style={styles.questionValue}>
      <Text style={styles.valueText}>{value || 'Select...'}</Text>
      <Icon name="arrow-drop-down" size={24} color="#666" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingTab: {
    backgroundColor: '#0E3386',
    opacity: 0.7,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    marginLeft: 15,
    fontSize: 10,
    color: '#666',
  },
  addButtonQues: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionTitleButton: {
    fontSize: 10,
    borderWidth: 1,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A5BDA',
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  selectedFileText: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  riskBadge: {
    backgroundColor: '#FF5252',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },

    noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C41E3A',
  },
  noteText: {
    fontSize: 12,
    color: '#C41E3A',
    lineHeight: 18,
  },
  summaryText: {
    paddingHorizontal: 17,
    fontSize: 10,
    color: '#C41E3A',
    lineHeight: 13,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainActionButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  mainActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryActionButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tabItem1: {
    fontSize: 10,
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000078',
    backgroundColor: '#0E3386',
    marginHorizontal: 5,
    marginTop: 8,

  },
  tabItem: {
    maxWidth:150,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000078',
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#0E3386',
  },
  tabText: {
    fontSize: 14,
    color: '#000078',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
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
  },
  pickerTitle: {
    fontSize: 20,
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
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
  },

});

export default AIResFullReviewScreen;