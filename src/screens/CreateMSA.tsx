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
            const filtered = (data || []).filter(item =>
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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from "react-native-paper";
import Services from "../Services/services";
import DocumentPicker from "react-native-document-picker";
import { launchImageLibrary } from "react-native-image-picker";
const CreateMSA = ({ route, navigation }: any) => {
    const { type } = route.params;
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
                setFiles((prev) => [...prev, { type, ...res[0] }]);
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

    const formatDate = (date: any) => {
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!msaName || !industry || !description || !businessUnit || !msaType ||
            !glAccount || !taxService || !taxGroup || !savingsPercentage ||
            !paymentTerms || !frequency || !terminationClause) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }

        try {
            // Prepare the data for API
            const formData = {
                name: msaName,
                msa_number: refNumber,
                msa_type: msaType,
                unpsc_code: industry,
                business_unit: businessUnit,
                gl_account: glAccount,
                tax_service_type: taxService,
                tax_group: taxGroup,
                savings_percentage: savingsPercentage,
                payment_term: paymentTerms,
                frequency: frequency,
                termination_clause: terminationClause,
                confidentiality_ownership: confidentiality,
                special_clause: specialClauses,
                comments: comments,
                description: description,
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                currency_code: currency,
                budget: budget,
                jurisdiction_country: jurisdiction === "yes" ? "India" : "",
                jurisdiction_state: jurisdiction === "yes" ? "Madhya Pradesh" : "",
                jurisdiction_district: jurisdiction === "yes" ? "Indore" : "",
                assign_msa_agency: assignAgency,
                assign_msa_resource: assignResource,
                assign_msa_masterdata: assignMasterData,
            };

            // Call your API to create MSA
            // const response = await Services.createMSA(formData);

            Alert.alert("Success", "MSA created successfully!");
            navigation.goBack();
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
                            onValueChange={setAssignAgency}
                        />
                        <Text style={styles.checkboxLabel}>MSA For Agency/Supplier</Text>
                    </View>
                    <View style={styles.checkboxRow}>
                        <Switch
                            value={assignResource}
                            onValueChange={setAssignResource}
                        />
                        <Text style={styles.checkboxLabel}>MSA For Resource/Services</Text>
                    </View>
                    <View style={styles.checkboxRow}>
                        <Switch
                            value={assignMasterData}
                            onValueChange={setAssignMasterData}
                        />
                        <Text style={styles.checkboxLabel}>MSA with Master data</Text>
                    </View>
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

                {/* Location/Jurisdiction */}
                {/* <View>
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

                    {jurisdiction === "yes" && (
                        <View>
                         
                            <Text style={styles.label}>Country *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedCountry}
                                    onValueChange={(val) => {
                                        setSelectedCountry(val);
                                        setSelectedState(""); // reset state when country changes
                                    }}
                                >
                                    <Picker.Item label="Select Country" value="" />
                                    {countries.map((item) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.name} />
                                    ))}
                                </Picker>
                            </View>

                        
                            <Text style={styles.label}>State *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedState}
                                    onValueChange={(val) => setSelectedState(val)}
                                    enabled={states.length > 0} // disable until states are loaded
                                >
                                    <Picker.Item label="Select State" value="" />
                                    {states.map((item, index) => (
                                        <Picker.Item key={index} label={item.name} value={item.name} />
                                    ))}
                                </Picker>
                            </View>


                        
                            <Text style={styles.label}>District *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter District"
                                value={district}
                                onChangeText={setDistrict}
                            />
                        </View>
                    )}
                </View> */}

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

                {/* Supporting Documents - Placeholder */}
                <Text style={styles.label}>Supporting Documents</Text>
                <Text style={styles.placeholderText}>Due diligence documents</Text>
                <View style={styles.divider} />

                {/* Select Approver */}
                <Text style={styles.label}>Select Approver *</Text>
                <Text style={styles.placeholderText}>MSA Approver *</Text>

                {/* Automatic Approval */}
                <View style={styles.checkboxRow}>
                    <Switch />
                    <Text style={styles.checkboxLabel}>Automatic Approval</Text>
                </View>

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
                {/* <SearchableModal
                    visible={countryModalVisible}
                    onClose={() => setCountryModalVisible(false)}
                    title="Select Country"
                    data={filteredCountries}
                    renderItem={({ item }: any) => renderListItem(item, handleCountrySelect)}
                    onSelect={handleCountrySelect}
                />

                <SearchableModal
                    visible={stateModalVisible}
                    onClose={() => setStateModalVisible(false)}
                    title="Select State"
                    data={filteredStates}
                    renderItem={({ item }: any) => renderListItem(item, handleStateSelect)}
                    onSelect={handleStateSelect}
                /> */}
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
});

export default CreateMSA;