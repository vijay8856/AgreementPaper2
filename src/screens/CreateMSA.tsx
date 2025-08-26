import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Switch,
    Platform,
    Alert,
    FlatList,
    Modal,
} from "react-native";


const SearchableModal = ({ visible, onClose, title, data, onSelect }: any) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredData(data || []);
        } else {
            const filtered = (data || []).filter((item: any) =>
                item && (
                    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, data]);

    const renderListItem = useCallback((item: any) => {
        if (!item) return null;

        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                    onSelect(item);
                    setSearchQuery(""); // Reset search when item is selected
                }}
            >
                <Text style={styles.listItemText}>{item.name || 'Unnamed'}</Text>
                {item.code && <Text style={styles.codeText}>({item.code})</Text>}
            </TouchableOpacity>
        );
    }, [onSelect]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />

                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => renderListItem(item)}
                        style={styles.list}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No items found</Text>
                        }
                        keyboardShouldPersistTaps="handled" // Important for keeping keyboard open
                    />

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setSearchQuery(""); // Reset search when closing
                            onClose();
                        }}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
const ProfileModal = ({ visible, onClose, title, data, onSelect, selectedProfile }: any) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredData(data || []);
        } else {
            const filtered = (data || []).filter((item: any) =>
                item &&
                (
                    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            setFilteredData(filtered);
        }
    }, [searchQuery, data]);

    const renderListItem = useCallback((item: any) => {
        if (!item) return null;

        // Extract user details for agency/resource or use direct properties for master data
        const userDetail = item.user_detail || item;
        const firstName = userDetail.first_name || '';
        const lastName = userDetail.last_name || '';
        const email = userDetail.email || item.email;
        const companyName = item.name || userDetail.company_name;
        const status = item.status || userDetail.status;

        const fullName = `${firstName} ${lastName}`.trim();
        const displayName = fullName || companyName || 'Unnamed';

        return (
            <TouchableOpacity
                style={[styles.listItem, selectedProfile?.id === item.id && styles.selectedListItem]}
                onPress={() => {
                    onSelect(item);
                    setSearchQuery("");
                }}
            >
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                        {displayName}
                    </Text>
                    {email && (
                        <Text style={styles.profileEmail}>{email}</Text>
                    )}
                    {status && (
                        <Text style={styles.profileStatus}>
                            • {status}
                        </Text>
                    )}
                </View>
                {selectedProfile?.id === item.id && (
                    <Text style={styles.selectedText}>✓ Selected</Text>
                )}
            </TouchableOpacity>
        );
    }, [onSelect, selectedProfile]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />

                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item }) => renderListItem(item)}
                        style={styles.list}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No {title.toLowerCase()} found</Text>
                        }
                        keyboardShouldPersistTaps="handled"
                    />

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setSearchQuery("");
                            onClose();
                        }}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from "react-native-paper";
import Services from "../Services/services";
import DocumentPicker from "react-native-document-picker";
import { launchImageLibrary } from "react-native-image-picker";
import ApproverModal from "../components/Modals/ApproverModal";
const CreateMSA = ({ route, navigation }: any) => {
    const { type } = route.params;
    console.log("log",type);
    
    const [fields, setFields] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [currentDateField, setCurrentDateField] = useState("");
    const [jurisdiction, setJurisdiction] = useState("no");

    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [district, setDistrict] = useState("");
    // Form values
    const [msaName, setMsaName] = useState("");
    const [refNumber, setRefNumber] = useState("");
    const [msaType, setMsaType] = useState("");
    const [industry, setIndustry] = useState("");
    const [businessUnit, setBusinessUnit] = useState("");
    const [glAccount, setGlAccount] = useState("");
    const [taxService, setTaxService] = useState("");
    const [taxGroup, setTaxGroup] = useState("");
    const [savingsPercentage, setSavingsPercentage] = useState("");
    const [paymentTermsList, setPaymentTermsList] = useState<any[]>([]);
    const [paymentTerms, setPaymentTerms] = useState<any[]>([]);

    const [frequency, setFrequency] = useState("");
    const [terminationClause, setTerminationClause] = useState("");
    const [confidentiality, setConfidentiality] = useState("");
    const [specialClauses, setSpecialClauses] = useState("");
    const [comments, setComments] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [currency, setCurrency] = useState("");
    const [budget, setBudget] = useState("");
    const [assignAgency, setAssignAgency] = useState(false);
    const [assignResource, setAssignResource] = useState(false);
    const [assignMasterData, setAssignMasterData] = useState(false);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedPaymentTerm, setSelectedPaymentTerm] = useState("");


    const [countryModalVisible, setCountryModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
    const [filteredStates, setFilteredStates] = useState<any[]>([]);

    // New states for profile selection
    const [agencyModalVisible, setAgencyModalVisible] = useState(false);
    const [resourceModalVisible, setResourceModalVisible] = useState(false);
    const [masterDataModalVisible, setMasterDataModalVisible] = useState(false);

    const [agencyList, setAgencyList] = useState<any[]>([]);
    const [resourceList, setResourceList] = useState<any[]>([]);
    const [masterDataList, setMasterDataList] = useState<any[]>([]);

    const [selectedAgency, setSelectedAgency] = useState<any>(null);
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [selectedMasterData, setSelectedMasterData] = useState<any>(null);

    const [isMSAApproverEnabled, setIsMSAApproverEnabled] = useState(false);
    const [selectedApprover, setSelectedApprover] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);



    const frequencyOptions = [
        { value: "1", label: "Recurring Monthly" },
        { value: "2", label: "Recurring Yearly" },
        { value: "3", label: "One Time" },
    ];

    const terminationClauseOptions = [
        { value: "1", label: "Termination for Convenience" },
        { value: "2", label: "Termination for Cause" },
        { value: "3", label: "Termination for Insolvency" },
        { value: "4", label: "Termination for Force Majeure" },
        { value: "5", label: "Termination by Mutual Agreement" },
        { value: "6", label: "Termination Due to Legal/Compliance Changes" },
    ];

    const confidentialityOptions = [
        { value: "1", label: "Client Owns All IP" },
        { value: "2", label: "Service Provider Owns, Client Gets License" },
        { value: "3", label: "Joint IP Ownership" },
        { value: "4", label: "Pre-Existing IP Remains With Original Owner" },
        { value: "5", label: "Assign All IP to Client" },
        { value: "6", label: "Limited License for Use Only" },
    ];





    const formatDate = (date: any) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
    // Fetch data for each profile type
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = {
                    limit: 10,
                };
                // Fetch agencies
                const agencyRes = await Services.getSuppliersList(data);
                if (agencyRes.success) {
                    console.log("agencyRes", agencyRes);

                    setAgencyList(agencyRes.data || []);
                }

                // Fetch resources
                const resourceRes = await Services.getTopResource();
                if (resourceRes.success) {
                    console.log("resourceRes", resourceRes);

                    setResourceList(resourceRes.data || []);
                }

                // Fetch master data
                const masterDataRes = await Services.getMasterDataList(data);
                if (masterDataRes.success) {
                    console.log("masterDataRes", masterDataRes);

                    setMasterDataList(masterDataRes.data || []);
                }
            } catch (err) {
                console.error("Error fetching profile data:", err);
            }
        };

        fetchProfileData();
    }, []);


    const handleSwitchToggle = (value: any) => {
        setIsMSAApproverEnabled(value);
        if (value) {
            setIsModalVisible(true);
        } else {
            setSelectedApprover(null);
        }
    };

    const handleSelectApprover = (approver: any) => {
        setSelectedApprover(approver);
    };

    const handleChangeApprover = () => {
        setIsModalVisible(true);
    };







    // Handle switch toggles - only allow one to be active
    const handleAgencyToggle = (value: boolean) => {
        if (value) {
            // Turn off other switches
            setAssignResource(false);
            setAssignMasterData(false);
            setSelectedResource(null);
            setSelectedMasterData(null);
            setAgencyModalVisible(true);
        }
        setAssignAgency(value);
    };

    const handleResourceToggle = (value: boolean) => {
        if (value) {
            // Turn off other switches
            setAssignAgency(false);
            setAssignMasterData(false);
            setSelectedAgency(null);
            setSelectedMasterData(null);
            setResourceModalVisible(true);
        }
        setAssignResource(value);
    };

    const handleMasterDataToggle = (value: boolean) => {
        if (value) {
            // Turn off other switches
            setAssignAgency(false);
            setAssignResource(false);
            setSelectedAgency(null);
            setSelectedResource(null);
            setMasterDataModalVisible(true);
        }
        setAssignMasterData(value);
    };

    // Handle profile selection
    const handleAgencySelect = (agency: any) => {
        setSelectedAgency(agency);
        setAgencyModalVisible(false);
    };

    const handleResourceSelect = (resource: any) => {
        setSelectedResource(resource);
        setResourceModalVisible(false);
    };

    const handleMasterDataSelect = (masterData: any) => {
        setSelectedMasterData(masterData);
        setMasterDataModalVisible(false);
    };




    // Country selection handler
    const handleCountrySelect = useCallback((country: any) => {
        if (!country) return;
        setSelectedCountry(country.name || '');
        setSelectedState("");
        setCountryModalVisible(false);
    }, []);

    const handleStateSelect = useCallback((state: any) => {
        if (!state) return;
        setSelectedState(state.name || '');
        setStateModalVisible(false);
    }, []);
    // Filter countries based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCountries(countries || []);
        } else {
            const filtered = (countries || []).filter(country =>
                country && ( // Check if country exists
                    country.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    country.code?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setFilteredCountries(filtered);
        }
    }, [searchQuery, countries]);

    // Filter states based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredStates(states || []);
        } else {
            const filtered = (states || []).filter(state =>
                state && state.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStates(filtered);
        }
    }, [searchQuery, states]);

    // ... existing functions ...
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await Services.getCountryList();
                if (res.success) {

                    console.log("??????", res.data.name);

                    setCountries(res.data || []);
                } else {
                    Alert.alert("Error", "Failed to fetch countries");
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCountries();
    }, []);

    // Fetch states when a country is selected
    useEffect(() => {
        if (!selectedCountry) return;

        const fetchStates = async () => {
            try {
                const res = await Services.getCountryDetailsState({ country: selectedCountry });
                if (res.success) {
                    console.log("??????/////", res);

                    setStates(res.data || []);
                } else {
                    setStates([]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStates();
    }, [selectedCountry]);
    console.log("states", states);

    useEffect(() => {
        const fetchPaymentTerms = async () => {
            try {
                const response = await Services.getPaymentTermsList();
                if (response.success) {
                    console.log("response getPaymentTermsList", response);
                    setPaymentTermsList(response.data || []);
                }
            } catch (err) {
                console.error("Error fetching Payment Terms", err);
            }
        };

        fetchPaymentTerms();
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


    const pickDocument = async (type: string) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            if (res && res[0]) {
                setFiles((prev) => [...prev, { ...res[0], fileType: type }]);
                console.log("Picked File:", res[0]);
            }

        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled document picker");
            } else {
                console.log("Error picking document:", err);
            }
        }
    };

    const pickImage = async (type: string) => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                quality: 1,
            });

            if (result.assets && result.assets.length > 0) {
                const img = result.assets[0];
                setFiles((prev) => [...prev, { type, ...img }]);
                console.log("Picked Image:", img);
            }
        } catch (err) {
            console.log("Error picking image:", err);
        }
    };
    const showDatePicker = (field: any) => {
        setCurrentDateField(field);
        setDatePickerVisible(true);
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        setDatePickerVisible(Platform.OS === 'ios');
        if (selectedDate) {
            if (currentDateField === "start") {
                setStartDate(selectedDate);
            } else if (currentDateField === "end") {
                setEndDate(selectedDate);
            }
        }
    };

    // const formatDate = (date: any) => {
    //     return date.toISOString().split('T')[0];
    // };

    // const handleSubmit = async () => {
    //     // Validate required fields
    //     if (!msaName || !industry || !description || !businessUnit || !msaType ||
    //         !glAccount || !taxService || !taxGroup || !savingsPercentage ||
    //         !paymentTerms || !frequency || !terminationClause) {
    //         Alert.alert("Error", "Please fill all required fields");
    //         return;
    //     }

    //     try {
    //         // Prepare the data for API
    //         const formData = {
    //             name: msaName,
    //             msa_number: refNumber,
    //             msa_type: msaType,
    //             unpsc_code: industry,
    //             business_unit: businessUnit,
    //             gl_account: glAccount,
    //             tax_service_type: taxService,
    //             tax_group: taxGroup,
    //             savings_percentage: savingsPercentage,
    //             payment_term: paymentTerms,
    //             frequency: frequency,
    //             termination_clause: terminationClause,
    //             confidentiality_ownership: confidentiality,
    //             special_clause: specialClauses,
    //             comments: comments,
    //             description: description,
    //             start_date: formatDate(startDate),
    //             end_date: formatDate(endDate),
    //             currency_code: currency,
    //             budget: budget,
    //             jurisdiction_country: jurisdiction === "yes" ? "India" : "",
    //             jurisdiction_state: jurisdiction === "yes" ? "Madhya Pradesh" : "",
    //             jurisdiction_district: jurisdiction === "yes" ? "Indore" : "",
    //             assign_msa_agency: assignAgency,
    //             assign_msa_resource: assignResource,
    //             assign_msa_masterdata: assignMasterData,
    //         };

    //         // Call your API to create MSA
    //         // const response = await Services.createMSA(formData);

    //         Alert.alert("Success", "MSA created successfully!");
    //         navigation.goBack();
    //     } catch (error) {
    //         console.error("Error creating MSA:", error);
    //         Alert.alert("Error", "Failed to create MSA");
    //     }
    // };
 const handleSubmit = async () => {
    // Validate required fields
    if (!msaName || !industry || !description || !businessUnit || !msaType ||
        !glAccount || !taxService || !taxGroup || !savingsPercentage ||
        !selectedPaymentTerm || !frequency || !terminationClause || !selectedCurrency || !budget) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // Validate approver if enabled
    if (isMSAApproverEnabled && !selectedApprover) {
      Alert.alert("Error", "Please select an approver");
      return;
    }

    try {
         if (jurisdiction === "yes" && (!selectedCountry || !selectedState || !district)) {
    Alert.alert("Error", "Please fill all jurisdiction fields");
    return;
  }
        
 const attachmentData = files.map(file => ({
      name: file.name || file.fileName,
      type: file.type || 'application/octet-stream',
      uri: file.uri || file.path,
      fileType: file.fileType || 'other'
    }));
      // Prepare the data for API
      const formData = {
        msa_number: refNumber || null,
        name: msaName,
        budget: parseFloat(budget),
        start_date: `${formatDate(startDate)} 00:00:00`,
        end_date: `${formatDate(endDate)} 23:59:59`,
        description: description,
        savings_percentage: parseFloat(savingsPercentage),
        comments: comments,
        status: "in_progress",
        is_active: true,
        msa_type: parseInt(msaType),
        msa_flow: type === "contractor" ? 1 : 2, // 1 for Contractor, 2 for Service
        unpsc_code: parseInt(industry),
        business_unit: parseInt(businessUnit),
        gl_account: parseInt(glAccount),
        resource: assignResource && selectedResource ? selectedResource.id : null,
        agency: assignAgency && selectedAgency ? selectedAgency.id : null,
        tax_service_type: parseInt(taxService),
        tax_group: parseInt(taxGroup),
        approver: isMSAApproverEnabled && selectedApprover ? selectedApprover.id : null,
        currency_code: selectedCurrency,
        organisation: null,
        masterdata: assignMasterData && selectedMasterData ? selectedMasterData.id : null,
        for_organisation: false,
         attachments: files.map(file => file.name || file.fileName),
      attachment_data: attachmentData,
        payment_term: parseInt(selectedPaymentTerm),
        frequency: parseInt(frequency),
        termination_clause: parseInt(terminationClause),
        confidentiality_ownership: parseInt(confidentiality),
        special_clause: specialClauses,
        jurisdiction_country: jurisdiction === "yes" ? selectedCountry : "",
        jurisdiction_state: jurisdiction === "yes" ? selectedState : "",
        jurisdiction_district: jurisdiction === "yes" ? district : ""
      };
// Call your API to create MSA

console.log("formData",formData);

      const response = await Services.createMSA(formData);
console.log("createMSA",response);
      
      if (response.success) {
        Alert.alert("Success", "MSA created successfully!");
        navigation.goBack();
      } else {
        console.error("Error creating MSA:", response.error);
        Alert.alert("Error", response.error?.message || "Failed to create MSA");
      }
    } catch (error) {
      console.error("Error creating MSA:", error);
      Alert.alert("Error", "Failed to create MSA");
    }
  };
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0033CC" />
            </View>
        );
    }

    // Open country modal
    const openCountryModal = () => {
        setFilteredCountries(countries);
        setSearchQuery("");
        setCountryModalVisible(true);
    };

    // Open state modal
    const openStateModal = () => {
        if (!selectedCountry) {
            Alert.alert("Info", "Please select a country first");
            return;
        }
        setFilteredStates(states);
        setSearchQuery("");
        setStateModalVisible(true);
    };

    // Render item for country/state list
    const renderListItem = (item: any, onSelect: any) => {
        if (!item) return null; // Handle undefined items

        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={() => onSelect(item)}
            >
                <Text style={styles.listItemText}>{item.name || 'Unnamed'}</Text>
                {item.code && <Text style={styles.codeText}>({item.code})</Text>}
            </TouchableOpacity>
        );
    };

    // Render selected profile
    const renderSelectedProfile = (profile: any, type: string) => {
        if (!profile) return null;

        // Extract user details for agency/resource or use direct properties for master data
        const userDetail = profile.user_detail || profile;
        const firstName = userDetail.first_name || '';
        const lastName = userDetail.last_name || '';
        const email = userDetail.email || profile.email;
        const companyName = profile.company_name || userDetail.company_name;
        const status = profile.status || userDetail.status;

        const fullName = `${firstName} ${lastName}`.trim();
        const displayName = fullName || companyName || 'Unnamed';

        return (
            <View style={styles.selectedProfileContainer}>
                <Text style={styles.selectedProfileTitle}>Selected {type}:</Text>
                <View style={styles.selectedProfileCard}>
                    <Text style={styles.selectedProfileName}>
                        {displayName}
                    </Text>
                    {email && (
                        <Text style={styles.selectedProfileEmail}>{email}</Text>
                    )}
                    {status && (
                        <Text style={styles.selectedProfileStatus}>Status: {status}</Text>
                    )}
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => {
                            if (type === 'Agency') setAgencyModalVisible(true);
                            if (type === 'Resource') setResourceModalVisible(true);
                            if (type === 'Master Data') setMasterDataModalVisible(true);
                        }}
                    >
                        <Text style={styles.changeButtonText}>Change</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };





    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll}>
                <Text style={styles.title}>Master Service Agreement({type}) </Text>

                {/* MSA Name */}
                <Text style={styles.label}>MSA Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="MSA NAME"
                    value={msaName}
                    onChangeText={setMsaName}
                />

                {/* Industry Material Group */}
                <Text style={styles.label}>Industry Material Group *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={industry}
                        onValueChange={(val) => setIndustry(val)}
                    >
                        <Picker.Item label="Select Industry Material Group" value="" />
                        {fields?.unpsc_code?.map((item: any) => (
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />

                {/* Select Assignee */}
                <Text style={styles.label}>Select Assignee *</Text>
                <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxRow}>
                        <Switch
                            value={assignAgency}
                            onValueChange={handleAgencyToggle}
                        />
                        <Text style={styles.checkboxLabel}>MSA For Agency/Supplier</Text>
                    </View>
                    {assignAgency && renderSelectedProfile(selectedAgency, 'Agency')}

                    <View style={styles.checkboxRow}>
                        <Switch
                            value={assignResource}
                            onValueChange={handleResourceToggle}
                        />
                        <Text style={styles.checkboxLabel}>MSA For Resource/Services</Text>
                    </View>
                    {assignResource && renderSelectedProfile(selectedResource, 'Resource')}

                    <View style={styles.checkboxRow}>
                        <Switch
                            value={assignMasterData}
                            onValueChange={handleMasterDataToggle}
                        />
                        <Text style={styles.checkboxLabel}>MSA with Master data</Text>
                    </View>
                    {assignMasterData && renderSelectedProfile(selectedMasterData, 'Master Data')}
                </View>

                {/* Reference Number */}
                <Text style={styles.label}>Reference Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="REFERENCE NUMBER"
                    value={refNumber}
                    onChangeText={setRefNumber}
                />

                {/* Business Unit */}
                <Text style={styles.label}>Business Unit *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={businessUnit}
                        onValueChange={(val) => setBusinessUnit(val)}
                    >
                        <Picker.Item label="Select Business Unit" value="" />
                        {fields?.business_unit?.map((item: any) => (
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>
                </View>

                {/* MSA Type */}
                <Text style={styles.label}>MSA Type *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={msaType}
                        onValueChange={(val) => setMsaType(val)}
                    >
                        <Picker.Item label="Select MSA Type" value="" />
                        {fields?.msa_type?.map((item: any) => (
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>
                </View>

                {/* GL Account */}
                <Text style={styles.label}>GL Account *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={glAccount}
                        onValueChange={(val) => setGlAccount(val)}
                    >
                        <Picker.Item label="Select GL Account" value="" />
                        {fields?.gl_account?.map((item: any) => (
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.divider} />
                {/* Date and Currency Row */}
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Start Date *</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => showDatePicker("start")}
                        >
                            <Text>{formatDate(startDate)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>End Date *</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => showDatePicker("end")}
                        >
                            <Text>{formatDate(endDate)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Currency *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCurrency}
                                onValueChange={(val) => setSelectedCurrency(val)}
                            >
                                <Picker.Item label="Select Currency" value="" />
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

                </View>

                {/* Budget */}
                <Text style={styles.label}>Budget *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Budget"
                    value={budget}
                    onChangeText={setBudget}
                    keyboardType="numeric"
                />

                {/* Tax Information Row */}
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Tax Service Type *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={taxService}
                                onValueChange={(val) => setTaxService(val)}
                            >
                                <Picker.Item label="Select Tax Service" value="" />
                                {fields?.tax_service_type?.map((item: any) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Tax Group *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={taxGroup}
                                onValueChange={(val) => setTaxGroup(val)}
                            >
                                <Picker.Item label="Select Tax Group" value="" />
                                {fields?.tax_group?.map((item: any) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Savings Percentage *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="SAVINGS PERCENTAGE"
                            value={savingsPercentage}
                            onChangeText={setSavingsPercentage}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <View style={styles.divider} />
                {/* Payment Terms */}
                <Text style={styles.label}>Payment Terms *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedPaymentTerm}
                        onValueChange={(val) => setSelectedPaymentTerm(val)}
                    >
                        <Picker.Item label="Select Payment Term" value="" />
                        {paymentTermsList?.map((item: any) => (   // ✅ safe optional chaining
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>
                </View>

                {/* Confidentiality and IP Ownership */}
                <Text style={styles.label}>Confidentiality and IP Ownership *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={confidentiality}
                        onValueChange={(val) => setConfidentiality(val)}
                    >
                        <Picker.Item label="Select Confidentiality" value="" />
                        {confidentialityOptions.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>

                {/* Frequency */}
                <Text style={styles.label}>Frequency *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={frequency}
                        onValueChange={(val) => setFrequency(val)}
                    >
                        <Picker.Item label="Select Frequency" value="" />
                        {frequencyOptions.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>Special Clauses *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="SPECIAL CLAUSES"
                        value={specialClauses}
                        onChangeText={setSpecialClauses}
                    />
                </View>
                {/* Termination Clause */}
                <Text style={styles.label}>Termination Clause *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={terminationClause}
                        onValueChange={(val) => setTerminationClause(val)}
                    >
                        <Picker.Item label="Select Termination Clause" value="" />
                        {terminationClauseOptions.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>



                <View>
                    <Text style={styles.label}>Location/Jurisdiction *</Text>
                    <View style={styles.radioContainer}>
                        <View style={styles.radioRow}>
                            <RadioButton
                                value="yes"
                                status={jurisdiction === "yes" ? "checked" : "unchecked"}
                                onPress={() => setJurisdiction("yes")}
                            />
                            <Text style={styles.radioLabel}>Yes</Text>
                        </View>
                        <View style={styles.radioRow}>
                            <RadioButton
                                value="no"
                                status={jurisdiction === "no" ? "checked" : "unchecked"}
                                onPress={() => setJurisdiction("no")}
                            />
                            <Text style={styles.radioLabel}>No</Text>
                        </View>
                    </View>

                    {/* If jurisdiction YES → show dropdowns & input */}
                    {jurisdiction === "yes" && (
                        <View>
                            {/* Country */}
                            <Text style={styles.label}>Country *</Text>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={openCountryModal}
                            >
                                <Text style={selectedCountry ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                                    {selectedCountry || "Select Country"}
                                </Text>
                            </TouchableOpacity>

                            {/* State */}
                            <Text style={styles.label}>State *</Text>
                            <TouchableOpacity
                                style={[styles.dropdownButton, !selectedCountry && styles.dropdownDisabled]}
                                onPress={openStateModal}
                                disabled={!selectedCountry}
                            >
                                <Text style={selectedState ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                                    {selectedState || (selectedCountry ? "Select State" : "Select country first")}
                                </Text>
                            </TouchableOpacity>

                            {/* District */}
                            <Text style={styles.label}>District *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter District"
                                value={district}
                                onChangeText={setDistrict}
                            />
                        </View>
                    )}
                </View>



                <View style={styles.divider} />

                {/* Comments */}
                <Text style={styles.label}>Comments *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Comments"
                    value={comments}
                    onChangeText={setComments}
                    multiline
                    numberOfLines={4}
                />

                {/* Previous Contract / Other */}
                <View style={styles.container}>
                    <Text style={styles.label}>Previous Contract / Other *</Text>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => pickDocument("previous_contract")}
                        >
                            <Text style={styles.buttonText}>📂 Previous Contracts</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => pickDocument("supporting_docs")}
                        >
                            <Text style={styles.buttonText}>📂 Supporting Documents</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => pickImage("due_diligence")}
                        >
                            <Text style={styles.buttonText}>📸 Due Diligence</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Show selected files */}
                    {files.length > 0 && (
                        <View style={styles.filesList}>
                            {files.map((file, index) => (
                                <Text key={index} style={styles.fileText}>
                                    ✅ {file.name || file.fileName || file.uri?.split("/").pop()}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>

                {/* Version */}
                <Text style={styles.label}>Version</Text>
                <TextInput
                    style={styles.input}
                    placeholder="UPDATED VERSION"
                    value={version}
                    onChangeText={setVersion}
                />



                {/* Select Approver */}
                <Text style={styles.label}>Select Approver *</Text>

                <View style={styles.checkboxRow}>
                    <Switch
                        value={isMSAApproverEnabled}
                        onValueChange={handleSwitchToggle}
                    />
                    <Text style={styles.checkboxLabel}>MSA Approver *</Text>
                </View>

                {/* Display selected approver */}
                {isMSAApproverEnabled && selectedApprover && (
                    <View style={styles.selectedApproverContainer}>
                        <View style={styles.approverInfo}>
                            {/* <Text style={styles.approverName}>{selectedApprover.name}</Text> */}
                            <Text style={styles.approverName}>
                                {`${(selectedApprover as any)?.first_name ?? ""} ${(selectedApprover as any)?.last_name ?? ""}`}
                            </Text>
                            <Text style={styles.approverEmail}>{(selectedApprover as any)?.email}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.changeButton}
                            onPress={handleChangeApprover}
                        >
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Show placeholder if switch is on but no approver selected */}
                {isMSAApproverEnabled && !selectedApprover && (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>No approver selected</Text>
                    </View>
                )}

                {/* Modal for selecting approver */}
                <ApproverModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSelectApprover={handleSelectApprover}
                    selectedApprover={selectedApprover}
                />

                {/* Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Picker */}
                {datePickerVisible && (
                    <DateTimePicker
                        value={currentDateField === "start" ? startDate : endDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}


                {/* Searchable Modals */}
                <SearchableModal
                    visible={countryModalVisible}
                    onClose={() => setCountryModalVisible(false)}
                    title="Select Country"
                    data={countries}
                    onSelect={handleCountrySelect}
                />

                <SearchableModal
                    visible={stateModalVisible}
                    onClose={() => setStateModalVisible(false)}
                    title="Select State"
                    data={states}
                    onSelect={handleStateSelect}
                />
                <ProfileModal
                    visible={agencyModalVisible}
                    onClose={() => setAgencyModalVisible(false)}
                    title="Select Agency"
                    data={agencyList}
                    onSelect={handleAgencySelect}
                    selectedProfile={selectedAgency}
                />

                <ProfileModal
                    visible={resourceModalVisible}
                    onClose={() => setResourceModalVisible(false)}
                    title="Select Resource"
                    data={resourceList}
                    onSelect={handleResourceSelect}
                    selectedProfile={selectedResource}
                />

                <ProfileModal
                    visible={masterDataModalVisible}
                    onClose={() => setMasterDataModalVisible(false)}
                    title="Select Master Data"
                    data={masterDataList}
                    onSelect={handleMasterDataSelect}
                    selectedProfile={selectedMasterData}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    scroll: { padding: 16 },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
        textAlign: "center"
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        marginBottom: 8,
        overflow: "hidden",
    },
    row: {
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    column: {
        flex: 1,
        marginRight: 8,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
        justifyContent: "center",
    },
    checkboxContainer: {
        marginBottom: 16,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
    },
    radioContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    radioRow: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
    },
    radioLabel: {
        marginLeft: 8,
        fontSize: 14,
    },
    placeholderText: {
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 6,
        marginBottom: 16,
        color: "#666",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 30,
    },
    submitButton: {
        flex: 1,
        backgroundColor: "#0E3386",
        padding: 14,
        borderRadius: 8,
        marginRight: 6,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#ccc",
        padding: 14,
        borderRadius: 8,
        marginLeft: 6,
    },
    submitText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center"
    },
    cancelText: {
        color: "#333",
        fontWeight: "600",
        textAlign: "center"
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    divider: {
        borderBottomWidth: 2,
        borderBottomColor: "#0E3386",
        marginVertical: 10,
    },
    uploadButton: {
        flex: 1,
        backgroundColor: "#0E3386",
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
        marginVertical: 10,

    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
    filesList: {
        marginTop: 10,
    },
    fileText: {
        fontSize: 14,
        color: "#333",
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    dropdownTextSelected: {
        color: '#000',
    },
    dropdownTextPlaceholder: {
        color: '#999',
    },
    dropdownDisabled: {
        backgroundColor: '#f0f0f0',
        opacity: 0.7,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    list: {
        flex: 1,
        marginBottom: 15,
    },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listItemText: {
        fontSize: 16,
    },
    codeText: {
        fontSize: 14,
        color: '#666',
    },
    closeButton: {
        backgroundColor: '#0033CC',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
        fontStyle: 'italic',
    },
    // New styles for profile selection
    selectedProfileContainer: {
        marginTop: 10,
        marginLeft: 40,
        marginBottom: 15,
    },
    selectedProfileTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    selectedProfileCard: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedProfileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0033CC',
        marginBottom: 5,
    },
    selectedProfileEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    selectedProfileStatus: {
        fontSize: 14,
        color: '#28a745',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    changeButton: {
        backgroundColor: '#6c757d',
        padding: 8,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    changeButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },

    selectedListItem: {
        backgroundColor: '#e3f2fd',
        borderLeftWidth: 3,
        borderLeftColor: '#0033CC',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 3,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    profileStatus: {
        fontSize: 14,
        color: '#28a745',
        fontStyle: 'italic',
    },
    selectedText: {
        color: '#0033CC',
        fontWeight: 'bold',
        fontSize: 12,
    },

    selectedApproverContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    approverInfo: {
        flex: 1,
    },
    approverName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    approverEmail: {
        fontSize: 14,
        color: '#666',
    },


    placeholderContainer: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },

});

export default CreateMSA;