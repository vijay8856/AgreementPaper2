import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    SafeAreaView,
    RefreshControl,
    Modal,
    FlatList,
    Platform,
    Pressable,
    Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Picker } from "@react-native-picker/picker";
import Services from '../../Services/services';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
const SOWServiceDetailScreen = ({ route }: any) => {
    const { data } = route.params;

    // State management
    const [isEditing, setIsEditing] = useState(false);
    const [serviceData, setServiceData] = useState(data);
    const [refreshing, setRefreshing] = useState(false);
    const [originalSlug, setOriginalSlug] = useState(data.slug);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [dropdownData, setDropdownData] = useState({
        account: [],
        cost_center: [],
        sow_type: [],
        tax_group: [],
        unpsc_code: [],
        business_unit: [],
        tax_service_type: [],
    });
    const [dropdownModal, setDropdownModal] = useState({
        visible: false,
        type: null,
        data: [],
    });
    const [currencies, setCurrencies] = useState([]);
    const [fields, setFields] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [masterMaterialList, setMasterMaterialList] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [msaId, setMsaId] = useState<string>('');
    const [msa, setMsa] = useState<string>('');
    const [msaList, setMsaList] = useState<any[]>([]);
    const [selectedSowTypes, setSelectedSowTypes] = useState({});

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
    const [milestoneDatePicker, setMilestoneDatePicker] = useState({
        visible: false,
        type: null, // 'start' or 'end'
        milestoneIndex: null,
        date: new Date(),
    });

    const onMilestoneDateChange = (event: any, selectedDate: any) => {
        setMilestoneDatePicker(prev => ({
            ...prev,
            visible: Platform.OS === 'ios' // Keep visible on iOS, hide on Android
        }));

        if (selectedDate && milestoneDatePicker.milestoneIndex !== null) {
            const updatedMilestones = [...serviceData.milestones];
            const field = milestoneDatePicker.type === 'start' ? 'start_date' : 'end_date';

            // Format date to ISO string
            updatedMilestones[milestoneDatePicker.milestoneIndex][field] = selectedDate.toISOString();

            setServiceData({
                ...serviceData,
                milestones: updatedMilestones
            });
        }
    };
    const handleMsaSelect = (item: any) => {
        setMsa(item.name);
        setMsaId(item.id); // Store the MSA ID for API
        setShowDropdown(false);
    };
    // Destructure params from serviceData
    const {
        milestones = [],
        materials = [],
        msa_detail,
        title,
        sow_number,
        start_date,
        end_date,
    } = serviceData || {};
    console.log("data 32", data);

    // Map to your local names
    const msaName = msa_detail?.name || "N/A";
    const sowNumber = sow_number;
    const startDate = start_date;
    const endDate = end_date;

    // Format date function
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Refresh function
    const onRefresh = async () => {
        try {
            setRefreshing(true);
            // You'll need to implement a service to fetch service details
            const res = await Services.getSOWDetail(serviceData.slug);

            if (res.success) {
                setServiceData(res.data);
            }
        } catch (err) {
            console.log("Unexpected refresh error:", err);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchServiceDetail = async () => {
        try {
            setRefreshing(true);
            const response = await Services.getSOWDetail(originalSlug);
            if (response.success) {
                setServiceData(response.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setRefreshing(false);
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
            setMsaList(res.data.results || []);
        } else {
            setMsaList([]);
        }
    };
    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await Services.getSOWFields();
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

    const handleSave = async () => {
        try {
            const formData = new FormData();
            const formatDate = (date: string | undefined | null) => {
                if (!date) return '';
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            };

            // Add all the fields you want to update
            formData.append('sow_id', serviceData.id || '');
            formData.append('sow_flow', serviceData.sow_flow || '');
            formData.append('title', serviceData.title || '');
            formData.append('sow_number', serviceData.sow_number || '');
            formData.append('start_date', formatDate(serviceData.start_date));
            formData.append('end_date', formatDate(serviceData.end_date));

            // Process milestones to handle both field names
            const updatedMilestones = serviceData.milestones.map((milestone, index) => {
                const originalMilestone = data.milestones[index] || {};

                return {
                    ...milestone,
                    // Handle SOW type
                    sow_type: milestone.sow_type || originalMilestone.sow_type ||
                        (originalMilestone.sow_type_detail ? originalMilestone.sow_type_detail.id : null),
                    // Handle tax - prioritize tax_percent but fall back to tax
                    tax_percent: milestone.tax_percent || milestone.tax ||
                        originalMilestone.tax_percent || originalMilestone.tax || 0,
                    tax: milestone.tax || milestone.tax_percent ||
                        originalMilestone.tax || originalMilestone.tax_percent || 0,
                    // Handle tax group
                    tax_group: milestone.tax_group || originalMilestone.tax_group ||
                        (originalMilestone.tax_group_detail ? originalMilestone.tax_group_detail.id : null),
                    // Handle currency
                    currency: milestone.currency || originalMilestone.currency ||
                        (originalMilestone.currency_detail ? originalMilestone.currency_detail.id : null)
                };
            });

            // Process materials to preserve original values if not changed
            const updatedMaterials = serviceData.materials.map((material, index) => {
                const originalMaterial = data.materials[index] || {};
                return {
                    ...material,
                    // Preserve tax_group if not changed
                    tax_group: material.tax_group || originalMaterial.tax_group ||
                        (originalMaterial.tax_group_detail ? originalMaterial.tax_group_detail.id : null),
                    // Preserve currency if not changed
                    currency: material.currency || originalMaterial.currency ||
                        (originalMaterial.currency_detail ? originalMaterial.currency_detail.id : null)
                };
            });

            if (updatedMilestones.length > 0) {
                formData.append('milestones', JSON.stringify(updatedMilestones));
            }

            if (updatedMaterials.length > 0) {
                formData.append('materials', JSON.stringify(updatedMaterials));
            }

            // You'll need to implement a service to update service details
            const response = await Services.updateServiceDetail(originalSlug, formData);
            if (response.success) {
                Toast.show({ type: 'success', text1: "Service details updated successfully!" });
                await fetchServiceDetail(); // 👈 refresh here
                setIsEditing(false);
            } else {
                let errorMsg = "Failed to update service details";

                if (typeof response.error === "string") {
                    errorMsg = response.error;
                } else if (response.error?.message) {
                    errorMsg = response.error.message;
                } else if (response.error?.errors) {
                    errorMsg = JSON.stringify(response.error.errors);
                }
                Toast.show({ type: 'error', text1: errorMsg });

            }
        } catch (error) {
            Toast.show({ type: 'error', text1: "Failed to update service details. Please try again." });
        }
    };
    // Handle cancel function
    const handleCancel = () => {
        setServiceData(data);
        setIsEditing(false);
    };
    const prepareForEdit = () => {
        // Ensure all fields are populated from their detail objects
        const updatedServiceData = { ...serviceData };

        // Process milestones
        if (updatedServiceData.milestones) {
            updatedServiceData.milestones = updatedServiceData.milestones.map(milestone => ({
                ...milestone,
                sow_type: milestone.sow_type || (milestone.sow_type_detail ? milestone.sow_type_detail.id : null),
                tax_group: milestone.tax_group || (milestone.tax_group_detail ? milestone.tax_group_detail.id : null),
                currency: milestone.currency || (milestone.currency_detail ? milestone.currency_detail.id : null),
                // Handle both tax field names
                tax: milestone.tax || milestone.tax_percent || 0,
                tax_percent: milestone.tax_percent || milestone.tax || 0
            }));
        }

        // Process materials
        if (updatedServiceData.materials) {
            updatedServiceData.materials = updatedServiceData.materials.map(material => ({
                ...material,
                tax_group: material.tax_group || (material.tax_group_detail ? material.tax_group_detail.id : null),
                currency: material.currency || (material.currency_detail ? material.currency_detail.id : null)
            }));
        }

        setServiceData(updatedServiceData);
        setIsEditing(true);
    };

    // Date change handlers
    const onStartDateChange = (event: any, selectedDate: any) => {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setServiceData({
                ...serviceData,
                start_date: selectedDate.toISOString(),
            });
        }
    };

    const onEndDateChange = (event: any, selectedDate: any) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setServiceData({
                ...serviceData,
                end_date: selectedDate.toISOString(),
            });
        }
    };

    // Dropdown functions
    const openDropdownModal = (type: any) => {
        setDropdownModal({
            visible: true,
            type,
            data: dropdownData[type] || [],
        });
    };

    const selectDropdownItem = (item: any) => {
        const fieldMap = {
            sow_type: "sow_type",
            unpsc_code: "unpsc_code",
            account: "account",
            business_unit: "business_unit",
            tax_service_type: "tax_service_type",
            tax_group: "tax_group",
        };

        setServiceData({
            ...serviceData,
            [fieldMap[dropdownModal.type]]: item.id,
        });

        setDropdownModal({
            visible: false,
            type: null,
            data: [],
        });
    };

    const getSelectedValue = (type: any, id: any) => {
        const items = dropdownData[type] || [];
        const selectedItem = items.find((item: any) => item.id === id);
        return selectedItem ? selectedItem.name : "Select option";
    };

    // Render functions
    const renderEditableField = (label: any, value: any, onChange: any, key: any, placeholder = "", keyboardType = "default") => {
        return (
            <View style={styles.inputGroup} key={key}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                    style={styles.input}
                    value={value?.toString() || ""}
                    onChangeText={(text) => onChange(text)}
                    placeholder={placeholder}
                    editable={isEditing}
                    keyboardType={keyboardType}
                />
            </View>
        );
    };

    const renderDateField = (label: any, dateString: any, onPress: any, key: any) => {
        if (isEditing) {
            return (
                <View style={styles.inputGroup} key={key}>
                    <Text style={styles.inputLabel}>{label}</Text>
                    <TouchableOpacity onPress={onPress} style={styles.dateInput}>
                        <Text>{formatDate(dateString) || "Select date"}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.fieldContainer} key={key}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Text style={styles.fieldValue}>{formatDate(dateString) || "N/A"}</Text>
            </View>
        );
    };

    const renderDropdownField = (label: any, type: any, value: any, key: any) => {
        if (isEditing) {
            return (
                <View style={styles.inputGroup} key={key}>
                    <Text style={styles.inputLabel}>{label}</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => openDropdownModal(type)}
                    >
                        <Text style={styles.dropdownButtonText}>
                            {getSelectedValue(type, value)}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.fieldContainer} key={key}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Text style={styles.fieldValue}>
                    {getSelectedValue(type, value) || "N/A"}
                </Text>
            </View>
        );
    };
    const renderDropdownModal = () => (
        <Modal
            visible={dropdownModal.visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setDropdownModal({ visible: false, type: null, data: [] })}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Option</Text>
                    <FlatList
                        data={dropdownModal.data}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => selectDropdownItem(item)}
                            >
                                <Text style={styles.modalItemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setDropdownModal({ visible: false, type: null, data: [] })}
                    >
                        <Text style={styles.modalCloseButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
    const openMilestoneDatePicker = (type: 'start' | 'end', index: number, currentDate: string) => {
        setMilestoneDatePicker({
            visible: true,
            type,
            milestoneIndex: index,
            date: currentDate ? new Date(currentDate) : new Date()
        });
    };
    // Render editable milestone details
    const renderMilestoneDetails = () => {
        if (milestones.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Milestone Details</Text>
                {milestones.map((milestone, index) => (
                    <View key={index} style={styles.detailCard}>
                        {isEditing ? (
                            renderEditableField(
                                "Title",
                                milestone.title,
                                (text) => {
                                    const updatedMilestones = [...milestones];
                                    updatedMilestones[index].title = text;
                                    setServiceData({ ...serviceData, milestones: updatedMilestones });
                                },
                                `milestone-title-${index}`
                            )
                        ) : (
                            <Text style={styles.detailTitle}>{milestone.title}</Text>
                        )}

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>SOW Type:</Text>
                            {isEditing ? (
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={milestone.sow_type || (milestone.sow_type_detail ? milestone.sow_type_detail.id : '')}
                                        onValueChange={(value) => {
                                            const updatedMilestones = [...milestones];
                                            updatedMilestones[index].sow_type = value;
                                            setServiceData({ ...serviceData, milestones: updatedMilestones });
                                        }}
                                        style={styles.picker}
                                        dropdownIconColor="#333"
                                    >
                                        <Picker.Item label="Select SOW Type" value="" />
                                        {fields?.sow_type?.map((item: any) => (
                                            <Picker.Item
                                                key={item.id}
                                                label={item.name}
                                                value={item.id}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            ) : (
                                <Text style={styles.detailValue}>
                                    {milestone.sow_type_detail?.name || 'N/A'}
                                </Text>
                            )}
                        </View>

                        <Text style={styles.detailLabel}>Currency:</Text>
                        {isEditing ? (
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}

                                    selectedValue={milestone.currency || (milestone.currency_detail ? milestone.currency_detail.id : '')}
                                    onValueChange={(value) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index].currency = value;
                                        setServiceData({ ...serviceData, milestones: updatedMilestones });
                                    }}
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
                        ) : (
                            <Text style={styles.detailValue}>
                                {milestone.currency_detail?.name}
                            </Text>
                        )}


                        <Text style={styles.detailLabel}>Tax Group:</Text>
                        {isEditing ? (
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={milestone.tax_group || (milestone.tax_group_detail ? milestone.tax_group_detail.id : '')}
                                    onValueChange={(value) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index].tax_group = value;
                                        setServiceData({ ...serviceData, milestones: updatedMilestones });
                                    }}
                                >
                                    <Picker.Item label="Select Tax Group" value="" />
                                    {fields?.tax_group?.map((item: any) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    ))}
                                </Picker>
                            </View>
                        ) : (
                            <Text style={styles.detailValue}>
                                {milestone.tax_group_detail?.name || 'N/A'}
                            </Text>
                        )}

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Rate:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={milestone.rate?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index].rate = text;
                                        setServiceData({ ...serviceData, milestones: updatedMilestones });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>{milestone.rate}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Quantity:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={milestone.quantity?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index].quantity = text;
                                        setServiceData({ ...serviceData, milestones: updatedMilestones });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>{milestone.quantity}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Tax %:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={milestone.tax_percent?.toString() || milestone.tax?.toString() || ''}
                                    onChangeText={(text) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index].tax_percent = text;
                                        // Also update the tax field for backward compatibility if needed
                                        updatedMilestones[index].tax = text;
                                        setServiceData({ ...serviceData, milestones: updatedMilestones });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>
                                    {(milestone.tax_percent || milestone.tax || 0)}%
                                </Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Grand Total:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.detailValueInput, styles.totalValueInput]}
                                    value={milestone.grand_total?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index].grand_total = text;
                                        setServiceData({ ...serviceData, milestones: updatedMilestones });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={[styles.detailValue, styles.totalValue]}>
                                    {milestone.grand_total}
                                </Text>
                            )}
                        </View>

                        {milestone.start_date && milestone.end_date && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Duration:</Text>
                                {isEditing ? (
                                    <View style={styles.dateInputRow}>
                                        <View style={{ display: "flex", justifyContent: "space-between" }}>

                                            <Text style={{ fontSize: 14, fontWeight: "600" }}> Start</Text>
                                            <TouchableOpacity
                                                style={styles.dateInputSmall}
                                                onPress={() => openMilestoneDatePicker('start', index, milestone.start_date)}
                                            >
                                                <Text>{formatDate(milestone.start_date)}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.dateToText}> to </Text>
                                        <View>
                                            <Text style={{ fontSize: 14, fontWeight: "600" }}> End</Text>

                                            <TouchableOpacity
                                                style={styles.dateInputSmall}
                                                onPress={() => openMilestoneDatePicker('end', index, milestone.end_date)}
                                            >
                                                <Text>{formatDate(milestone.end_date)}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {/* Date picker for milestones */}
                                        {milestoneDatePicker.visible && milestoneDatePicker.milestoneIndex === index && (
                                            <DateTimePicker
                                                value={milestoneDatePicker.date}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={onMilestoneDateChange}
                                            />
                                        )}
                                    </View>
                                ) : (
                                    <Text style={styles.detailValue}>
                                        {formatDate(milestone.start_date)} - {formatDate(milestone.end_date)}
                                    </Text>
                                )}
                            </View>
                        )}

                        {milestone.description && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Description:</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.detailValueInput}
                                        value={milestone.description}
                                        onChangeText={(text) => {
                                            const updatedMilestones = [...milestones];
                                            updatedMilestones[index].description = text;
                                            setServiceData({ ...serviceData, milestones: updatedMilestones });
                                        }}
                                        editable={isEditing}
                                        multiline
                                    />
                                ) : (
                                    <Text style={styles.detailValue}>{milestone.description}</Text>
                                )}
                            </View>
                        )}

                        {milestone.comments && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Comments:</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.detailValueInput}
                                        value={milestone.comments}
                                        onChangeText={(text) => {
                                            const updatedMilestones = [...milestones];
                                            updatedMilestones[index].comments = text;
                                            setServiceData({ ...serviceData, milestones: updatedMilestones });
                                        }}
                                        editable={isEditing}
                                        multiline
                                    />
                                ) : (
                                    <Text style={styles.detailValue}>{milestone.comments}</Text>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    // Render editable material details
    const renderMaterialDetails = () => {
        if (materials.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Material Details</Text>
                {materials.map((material, index) => (
                    <View key={index} style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Material Title:</Text>
                            {isEditing ? (
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}

                                        selectedValue={material.title}
                                        onValueChange={(value) => {
                                            const updatedMaterials = [...materials];
                                            updatedMaterials[index].title = value;
                                            setServiceData({ ...serviceData, materials: updatedMaterials });
                                        }}
                                    >
                                        <Picker.Item label="Select Material" value="" />
                                        {materialOptions.map((item, idx) => (
                                            <Picker.Item key={idx} label={item} value={item} style={styles.pickerItem} />
                                        ))}
                                    </Picker>
                                </View>
                            ) : (
                                <Text style={styles.detailValue}>{material.title}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Description:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.description}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].description = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                    multiline
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.description}</Text>
                            )}
                        </View>

                        <Text style={styles.detailLabel}>Material Number:</Text>
                        {isEditing ? (
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}

                                    selectedValue={material.material_number}
                                    onValueChange={(value) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].material_number = value;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                >
                                    <Picker.Item label="Select Material Number" value="" />
                                    {masterMaterialList.map((item, idx) => (
                                        <Picker.Item
                                            key={item.uid || idx}
                                            label={`${item.material_number} (${item.description})`}
                                            value={item.material_number}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        ) : (
                            <Text style={styles.detailValue}>{material.material_number}</Text>


                        )}

                        <Text style={styles.detailLabel}>Tax Group:</Text>
                        {isEditing ? (
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={material.tax_group || (material.tax_group_detail ? material.tax_group_detail.id : '')}
                                    onValueChange={(value) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].tax_group = value;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                >
                                    <Picker.Item label="Select Tax Group" value="" />
                                    {fields?.tax_group?.map((item: any) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    ))}
                                </Picker>
                            </View>
                        ) : (
                            <Text style={styles.detailValue}>
                                {material.tax_group_detail?.name || 'N/A'}
                            </Text>
                        )}

                        <Text style={styles.detailLabel}>Currency:</Text>
                        {isEditing ? (
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={material.currency || (material.currency_detail ? material.currency_detail.id : '')}
                                    onValueChange={(value) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].currency = value;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
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
                        ) : (
                            <Text style={styles.detailValue}>
                                {material.currency_detail?.name || 'N/A'}
                            </Text>
                        )}

                        {material.order_unit_of_measure && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Unit of Measure:</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.detailValueInput}
                                        value={material.order_unit_of_measure?.toString()}
                                        onChangeText={(text) => {
                                            const updatedMaterials = [...materials];
                                            updatedMaterials[index].order_unit_of_measure = text;
                                            setServiceData({ ...serviceData, materials: updatedMaterials });
                                        }}
                                        editable={isEditing}
                                    />
                                ) : (
                                    <Text style={styles.detailValue}>{material.order_unit_of_measure}</Text>
                                )}
                            </View>
                        )}

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Price:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.price?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].price = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.price}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Quantity:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.quantity?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].quantity = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.quantity}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Tax %:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.tax?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].tax = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.tax}%</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Grand Total:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.detailValueInput, styles.totalValueInput]}
                                    value={material.grand_total?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].grand_total = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={[styles.detailValue, styles.totalValue]}>
                                    {material.grand_total}
                                </Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Old Material Number:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.old_material_number?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].old_material_number = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.old_material_number}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Lead Time:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.lead_time?.toString()}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].lead_time = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.lead_time} days</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Order Unit:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.order_unit_of_measure?.toString() ?? ""}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].order_unit_of_measure = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.order_unit_of_measure?.toString() || "N/A"}</Text>
                            )}
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Unit Of Measure:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailValueInput}
                                    value={material.unit_of_measure ?? ""}
                                    onChangeText={(text) => {
                                        const updatedMaterials = [...materials];
                                        updatedMaterials[index].unit_of_measure = text;
                                        setServiceData({ ...serviceData, materials: updatedMaterials });
                                    }}
                                    editable={isEditing}
                                />
                            ) : (
                                <Text style={styles.detailValue}>{material.unit_of_measure || "N/A"}</Text>
                            )}
                        </View>

                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.editContainer}>
                    {!isEditing ? (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={prepareForEdit}
                        >
                            <Icon name="edit" size={22} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.editActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Header Information */}
                <View style={styles.headerCard}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>


                    </View>
                    <View style={styles.divider}></View>

                    {isEditing ? (
                        <View>
                            <Text style={styles.sectionTitle}>Select Master Service Agreement</Text>
                            
                            {/* Input with dropdown toggle */}
                            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                                <TextInput
                                    style={styles.input}
                                    value={msaName} // 👈 showing selected MSA name
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
                                                    onPress={() => {
                                                        handleMsaSelect(item);
                                                        setShowDropdown(false);

                                                        setServiceData({
                                                            ...serviceData,
                                                            msa_detail: item,
                                                        });
                                                    }}
                                                >
                                                    <Text>{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    ) : (
                        <>
                            <Text style={styles.headerTitle}>Selected MSA</Text>
                            <Text style={styles.headerValue}>{msaName}</Text>
                        </>
                    )}


                    {isEditing ? (
                        renderEditableField(
                            "Title",
                            title,
                            (text) => setServiceData({ ...serviceData, title: text }),
                            "title"
                        )
                    ) : (
                        <>
                            <Text style={styles.headerTitle}>Title</Text>
                            <Text style={styles.headerValue}>{title}</Text>
                        </>
                    )}

                    {isEditing ? (
                        renderEditableField(
                            "SOW Number",
                            sowNumber,
                            (text) => setServiceData({ ...serviceData, sow_number: text }),
                            "sow-number"
                        )
                    ) : (
                        <>
                            <Text style={styles.headerTitle}>SOW Number</Text>
                            <Text style={styles.headerValue}>{sowNumber}</Text>
                        </>
                    )}

                    <View style={styles.dateRow}>
                        <View style={styles.dateColumn}>
                            {renderDateField(
                                "Start Date",
                                startDate,
                                () => setShowStartDatePicker(true),
                                "start_date"
                            )}
                        </View>
                        <View style={styles.dateColumn}>
                            {renderDateField(
                                "End Date",
                                endDate,
                                () => setShowEndDatePicker(true),
                                "end_date"
                            )}
                        </View>
                    </View>
                </View>

                {/* Render appropriate details based on what exists */}
                {renderMilestoneDetails()}
                {renderMaterialDetails()}

                {/* Show message if no details available */}
                {milestones.length === 0 && materials.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No milestone or material details available</Text>
                    </View>
                )}

                {/* Date Pickers */}
                {showStartDatePicker && (
                    <DateTimePicker
                        value={new Date(startDate || Date.now())}
                        mode="date"
                        display="default"
                        onChange={onStartDateChange}
                    />
                )}

                {showEndDatePicker && (
                    <DateTimePicker
                        value={new Date(endDate || Date.now())}
                        mode="date"
                        display="default"
                        onChange={onEndDateChange}
                    />
                )}

                {/* Dropdown Modal */}
                {renderDropdownModal()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 5,
    },
    editContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    divider: {
        borderBottomWidth: 1.5,
        borderBottomColor: 'gray',
        marginBottom: 15,
    },
    editButton: {
        backgroundColor: '#0E3386',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    editActions: {
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: '#0E3386',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#0E3386',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        overflow: "hidden",
        fontSize: 10

    },
    picker: {
        height: 50,
        width: "100%",
    },
    pickerItem: {
    },
    headerValue: {
        fontSize: 16,
        marginBottom: 16,
    },
    headerValueInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateColumn: {
        flex: 1,
        marginRight: 8,
    },
    section: {
        marginVertical: 16,
        paddingHorizontal: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#222",
    },
    detailCard: {
        backgroundColor: "#fff",
        padding: 12,
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    detailRow: {
        marginBottom: 14,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 6,
        color: "#555",
    },
    detailValue: {
        fontSize: 15,
        color: "#333",
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    detailValueInput: {
        fontSize: 15,
        color: "#000",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },

    totalValue: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
    totalValueInput: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
    emptyState: {
        alignItems: 'center',
        padding: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        backgroundColor: '#fff',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 16,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateInputSmall: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 20,
    },
    dateInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: "space-between"
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#fff',
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
    },
    modalCloseButton: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#007AFF',
        borderRadius: 4,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },


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

    dateToText: {
        marginHorizontal: 3,
        color: '#666',
    },
});

export default SOWServiceDetailScreen;