
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  FlatList,
  Animated,
  Dimensions,

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-blob-util';
import FormattedTextComp from '../components/FormatedAIResponse';
const screenWidth = Dimensions.get('window').width;
const AIResFullReviewScreen = () => {
  const [contractType, setContractType] = useState('');
  const [businessLine, setBusinessLine] = useState('');
  const [country, setCountry] = useState('');
  const [activeTab, setActiveTab] = useState('Analysis');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countries, setCountries] = useState<PickerItem[]>([]);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [tempSearchText, setTempSearchText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<PickerItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [chatRequestId, setChatRequestId] = useState("");
  const [firstQuerySent, setFirstQuerySent] = useState(false);






  const widthAnim = useRef(new Animated.Value(120)).current; // start with button width ~120
  const opacityMap = useRef<{ [key: string]: Animated.Value }>({}).current;
  type PickerItem = {
    label: string;
    value: string;
  };

  const contractTypes = [
    { label: " SECTION-32", value: "SECTION-32" },
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

  const generateRequestId = () => {
    return Math.random().toString(36).substring(2, 12);
  };


  useEffect(() => {
    return () => {
      setChatMessages([]);
      setUserQuery("");
      setFirstQuerySent(false);
      setChatRequestId("");
    };
  }, []);



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


  const Clauses = useMemo(() => {
    const baseClauses = [
      { value: "SUMMARISE_CONTRACT", label: " Summary" },
      { value: "FRAUD_DETECTION", label: " Fraud Detection" },
    ];

    if (contractType === 'SECTION-32') {
      return [...baseClauses, { value: "SECTION_32_REVIEW", label: "Analyze" }];
    } else {
      return [...baseClauses, { value: "MISSING_CLAUSES", label: "Analyze" }];
    }
  }, [contractType]);

  useEffect(() => {
    if (countries.length > 0) {

      setContractType('SECTION-32');


      setBusinessLine('REAL ESTATE');


      const australia = countries.find(
        (c: PickerItem) => c.label === 'Australia'
      );
      if (australia) {
        setCountry(australia.value);
      }
    }
  }, [countries]);

  const openPicker = (pickerType: 'contractType' | 'businessLine' | 'country') => {
    setCurrentPicker(pickerType);
    setTempSearchText('');
    setSearchText('');
    setPickerVisible(true);
  };
  useEffect(() => {
    setFilteredCountries(countries);
  }, [countries]);

  useEffect(() => {
    const filtered = countries.filter((item: PickerItem) =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchText, countries]);
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
  // Risk Level
  const getRiskLevel = (score: number) => {
    if (score <= 2) return 'LOW';
    if (score === 3) return 'MEDIUM';
    if (score === 4) return 'HIGH';
    return 'HIGH';
  };
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#4CAF50'; // Green
      case 'MEDIUM': return '#FFC107'; // Yellow
      case 'HIGH': return '#F44336'; // Orange
      // case 'RISK': return '#F44336'; // Red
      default: return '#9E9E9E'; // Grey
    }
  };

  const extractRiskScore = (result: string) => {
    const match = result.match(/Risk Score: (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };


  // End Risk Level



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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000078" />
      </View>
    );
  }
  // const submitContract = async (clauseType: string) => {
  //   if (!contractType || !businessLine || !country || !selectedFile) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Missing Information',
  //       text2: 'Please fill all fields and upload a file',
  //       position: 'top',
  //     });
  //     return;
  //   }

  //   setLoadingButton(clauseType);
  //   setProgress(0);

  //   Animated.timing(widthAnim, {
  //     toValue: screenWidth - 40,
  //     duration: 400,
  //     useNativeDriver: false,
  //   }).start();

  //   // Simulate loading progress (up to 90%)
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 98) return prev; // pause at 90%
  //       return prev + 2;
  //     });
  //   }, 400);

  //   try {
  //     const formData = new FormData();
  //     formData.append('prompt_type', clauseType);
  //     formData.append('file', {
  //       uri: selectedFile.uri,
  //       name: selectedFile.name,
  //       type: selectedFile.type || 'application/pdf',
  //     });

  //     console.log('formData', formData);

  //     const response = await Services.analysisContractByAi(formData);
  //     console.log('response23', response);

  //     clearInterval(interval);

  //     // Smoothly animate the last 10% to 100%
  //     setProgress(100);

  //     // Small delay for user to *see* 100%
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     if (response.success) {
  //       setAnalysisResult(response.data);
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Analysis Complete',
  //         text2: `Clause: ${clauseType} analyzed successfully`,
  //         position: 'top',
  //       });
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Analysis Failed',
  //         text2: response.error || 'Something went wrong',
  //         position: 'top',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Analysis error:', error);
  //     clearInterval(interval);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: 'An unexpected error occurred',
  //       position: 'top',
  //     });
  //   } finally {
  //     setTimeout(() => {
  //       setLoadingButton(null);
  //       setProgress(0);
  //       widthAnim.setValue(0);
  //     }, 1000);
  //   }
  // };




  // const submitContract = async (clauseType: string) => {
  //   if (!contractType || !businessLine || !country || !selectedFile) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Missing Information',
  //       text2: 'Please fill all fields and upload a file',
  //       position: 'top',
  //     });
  //     return;
  //   }

  //   setLoadingButton(clauseType);
  //   setProgress(0);


  //      Animated.timing(widthAnim, {
  //     toValue: screenWidth - 40,
  //     duration: 400,
  //     useNativeDriver: false,
  //   }).start();

  //   // Fake progress animation
  //   const interval = setInterval(() => {
  //     setProgress((p) => (p >= 87 ? p : p + 7));
  //   },400);
  //   try {
  //     const formData = new FormData();

  //     formData.append('prompt_type', clauseType);

  //     formData.append('file', {
  //       uri: selectedFile.uri,
  //       name: selectedFile.name,
  //       type: selectedFile.type || 'application/pdf',
  //     });
  //     console.log("formData", formData);

  //     const response = await Services.analysisContractByAi(formData);
  //     console.log("response23", response);

  //     if (response.success) {
  //       setProgress(100);
  //       setAnalysisResult(response.data);
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Analysis Complete',
  //         text2: `Clause: ${clauseType} analyzed successfully`,
  //         position: 'top',
  //       });
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Analysis Failed',
  //         text2: response.error || 'Something went wrong',
  //         position: 'top',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Analysis error:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: 'An unexpected error occurred',
  //       position: 'top',
  //     });
  //   } finally {
  //     setLoadingButton(null);
  //     clearInterval(interval);
  //     setTimeout(() => {
  //       setLoadingButton(null);
  //       setProgress(0);
  //       widthAnim.setValue(0); // reset for next time
  //     }, 800);
  //   }

  // };




  const submitContract = async (clauseType: string) => {
    if (!contractType || !businessLine || !country || !selectedFile) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all fields and upload a file",
        position: "top",
      });
      return;
    }

    setLoadingButton(clauseType);
    setProgress(0);

    Animated.timing(widthAnim, {
      toValue: screenWidth - 40,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // 📌 REALISTIC PROGRESS
    let current = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        current = prev;

        if (prev < 40) return prev + 2; // Fast start
        if (prev < 75) return prev + 1; // Mid-speed
        if (prev < 95) return prev + 1; // Slow finish

        return prev; // STOP at 95 until API done
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("prompt_type", clauseType);
      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type || "application/pdf",
      });

      // ---- API CALL ----
      const response = await Services.analysisContractByAi(formData);

      clearInterval(interval);

      // ✔ Smooth finish (95 → 100)
      const finishInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(finishInterval);
            return 100;
          }
          return prev + 1.5;
        });
      }, 40);

      // Give animation time to reach 100
      await new Promise((resolve) => setTimeout(resolve, 600));

      // ---- RESULT ----
      if (response.success) {
        setAnalysisResult(response.data);
        Toast.show({
          type: "success",
          text1: "Analysis Complete",
          text2: `Clause: ${clauseType} analyzed successfully`,
          position: "top",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Analysis Failed",
          text2: response.error || "Something went wrong",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      clearInterval(interval);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
        position: "top",
      });
    } finally {
      setTimeout(() => {
        setLoadingButton(null);
        setProgress(0);
        widthAnim.setValue(0);
      }, 900);
    }
  };

  const sendChatQuery = async () => {
    if (!userQuery.trim()) return;

    // 1️⃣ Add USER message to chat
    const newMsg = { role: "user", text: userQuery };
    setChatMessages(prev => [...prev, newMsg]);

    let payload: any = {};

    // 2️⃣ FIRST TIME → send analysisResult + query
    if (!firstQuerySent) {
      const id = generateRequestId();
      setChatRequestId(id);

      payload = {
        request_id: id,
        initial_context: analysisResult,     // ONLY FIRST TIME
        query: userQuery,
      };

      setFirstQuerySent(true);

    } else {
      // 3️⃣ NEXT TIME → only query
      payload = {
        request_id: chatRequestId,
        query: userQuery,
      };
    }

    setUserQuery("");

    // 4️⃣ hit API
    const response = await Services.aiContractQueries(payload);
    console.log('in', response);

    // 5️⃣ Show bot response
    if (response.success) {
      const botMsg = {
        role: "bot",
        text: response.data.data.response,     // 👈 API response key
      };

      setChatMessages(prev => [...prev, botMsg]);

    } else {
      const botMsg = {
        role: "bot",
        text: "❌ Error: Something went wrong.",
      };
      setChatMessages(prev => [...prev, botMsg]);
    }
  };



  const getFilteredItems = (items: PickerItem[], search: string) => {
    return items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
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
          <Text style={styles.headerSubtitle}>Please upload contract to review in (PDF) format</Text>
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


          <View style={styles.addButtonQues}>
            <Text style={styles.sectionTitle}>Selected Questions</Text>
            {/* <TouchableOpacity>
              <Text style={styles.tabItem1}>Add Questions</Text>
            </TouchableOpacity> */}
          </View>
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




              <View style={styles.riskContainer}>
                {['LOW', 'MEDIUM', 'HIGH',].map((level) => {
                  const riskScore = extractRiskScore(analysisResult);
                  const currentLevel = getRiskLevel(riskScore);
                  const isActive = level === currentLevel;

                  return (
                    <View key={level} style={styles.riskLevelWrapper}>
                      <View
                        style={[
                          styles.riskLevel,
                          {
                            backgroundColor: isActive
                              ? getRiskColor(level)
                              : '#E0E0E0'
                          }
                        ]}
                      >
                        <Text
                          style={[
                            styles.riskLevelText,
                            { color: isActive ? 'white' : '#9E9E9E' }
                          ]}
                        >
                          {level}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

        </View>


        {analysisResult && (
          <View style={styles.chatContainer}>
            <Text style={styles.chatTitle}>Ask Your Queries</Text>

            <FlatList
              data={chatMessages}
              keyExtractor={(_, index) => index.toString()}
              style={{ maxHeight: 250,  }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.chatBubble,
                    item.role === "user" ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text style={styles.chatText}>{item.text}</Text>
                </View>
              )}
            />


            {/* Chat Input */}
            <View style={styles.chatInputRow}>
              <TextInput
                value={userQuery}
                onChangeText={setUserQuery}
                placeholder="Ask something..."
                style={styles.chatInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendChatQuery}>
                <Icon name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>


      <View style={styles.tabContainer}>
        {Clauses.map((c) => {
          const isActive = loadingButton === c.value;
          // Hide others while one is active
          if (loadingButton && !isActive) return null;

          const ButtonContent = isActive ? (
            <View style={styles.progressWrapper}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          ) : (
            <Text style={styles.tabText}>{c.label}</Text>
          );

          return (
            <Animated.View
              key={c.value}
              style={[
                styles.animatedButtonContainer,
                isActive && { width: widthAnim },
              ]}
            >
              <TouchableOpacity
                style={[styles.tabItem, isActive && styles.loadingTab]}
                disabled={!!loadingButton}
                onPress={() => submitContract(c.value)}
                activeOpacity={0.8}
              >
                {ButtonContent}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>


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

// const QuestionItem: React.FC<QuestionItemProps> = ({ label, value, onPress }) => (
//   <TouchableOpacity style={styles.questionItem} onPress={onPress}>
//     <Text style={styles.questionText}>{label}</Text>
//     <View style={styles.questionValue}>
//       <Text style={styles.valueText}>{value || 'Select...'}</Text>
//       <Icon name="arrow-drop-down" size={24} color="#666" />
//     </View>
//   </TouchableOpacity>
// );
const QuestionItem: React.FC<QuestionItemProps> = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.questionItem} onPress={onPress}>
    <Text style={styles.questionText}>
      {label.split('').map((char, index) => (
        <Text key={index}>{char}</Text>
      ))}
    </Text>
    <View style={styles.questionValue}>
      <Text style={styles.valueText}>{value || 'Select...'}</Text>
      <Icon name="arrow-drop-down" size={24} color="#666" />
    </View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({

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
  pickerCloseButton: {
    backgroundColor: '#0E3386',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerCloseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  animatedButtonContainer: {
    overflow: 'hidden', // keep child inside while expanding
    // minWidth: 200,

    borderRadius: 25,
  },
  tabItem: {
    borderWidth: 1,
    borderColor: '#000078',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 5
  },
  loadingTab: {
    backgroundColor: '#000078',
  },
  tabText: {
    color: '#000078',
    fontWeight: '600',
  },
  progressWrapper: {
    width: '300%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  progressText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // loadingTab: {
  //   backgroundColor: '#0E3386',
  //   opacity: 0.7,
  // },
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
  // tabContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginVertical: 10,
  //   paddingHorizontal: 10,
  // },
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
  // tabItem: {
  //   maxWidth: 150,
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  //   borderRadius: 20,
  //   borderWidth: 1,
  //   borderColor: '#000078',
  //   backgroundColor: '#fff',
  //   marginHorizontal: 5,
  // },
  activeTab: {
    backgroundColor: '#0E3386',
  },
  // tabText: {
  //   fontSize: 14,
  //   color: '#000078',
  //   fontWeight: '600',
  // },
  activeTabText: {
    color: '#fff',
  },


  pickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  picker: {
    height: 100,
  },

  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
  },
  riskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  riskLevelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riskLevel: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  riskLevelText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  riskConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  chatContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
  },

  chatTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000078',
    marginBottom: 10,
  },

  chatBubble: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
    maxWidth: '85%',
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0E3386',
  },

  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E3386',
  },

  chatText: {
    color: '#fff',
    fontSize: 13,
  },

  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  chatInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  sendButton: {
    backgroundColor: '#000078',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },

});

export default AIResFullReviewScreen;