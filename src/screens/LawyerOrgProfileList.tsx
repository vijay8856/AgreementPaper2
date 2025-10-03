import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Modal,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import Services from "../Services/services";
import Icon from 'react-native-vector-icons/MaterialIcons';


// import { Avatar } from "react-native-paper";
// import { useDispatch, useSelector } from "react-redux";
// import { LIMIT_DATA } from "../../../../Axios/axiosData";
// import Services from "../../../../ServiceProvider/Services";

const { width } = Dimensions.get("window");
const debounce = (func: any, delay: any) => {
    let timeoutId: any;
    return function (...args: any) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};
type Organization = {
    id: string;
    user: number,
    company_name: string;
    email: string;
    country_name: string;
    state_name: string;
    district: string;
    is_active: boolean;
    user_detail: {
        first_name: string;
        last_name: string;
        email: string;
        contact_number: string;
        experience: string;
        linkedin_url: string;
    };
    about_company: string;
    company_website: string;
    is_connection: boolean;
};
export default function LawyerOrgProfile() {
    const navigation = useNavigation();
    //   const dispatch = useDispatch();
    const LIMIT_DATA = 10
    const [ratingOptions] = useState([
        { id: 5, name: "Excellent" },
        { id: 4, name: "Good" },
        { id: 3, name: "Average" },
        { id: 2, name: "Poor" },
    ]);

    const [locationOptions] = useState([
        { id: 74, name: "India" },
        { id: 9, name: "Australia" },
    ]);



    const [message, setMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Organization | null>(null);
    const [connectModalVisible, setConnectModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    const [lawyers, setAllLawyer] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [payload, setPayload] = useState({
        user: {},
        user_id: "",
        message: "",
        email: "",
        isOpen: false,
        errorMes: "",
    });

    console.log("lawyers", lawyers);

    const handleSearch = debounce(async (searchQuery: any) => {
        setLoading(true);
        try {
            const payload = {
                limit: LIMIT_DATA,
                offset: (page - 1) * LIMIT_DATA,
                search: searchQuery,
            };

            const response = await Services.getOrganistionProfileList(payload);

            if (response.success) {
                setAllLawyer(response.data);
                setPageCount(Math.ceil(response.count / LIMIT_DATA));
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }, 500); // 500ms debounce delay

    // Handle text input changes
    const handleSearchChange = (text: any) => {
        setSearchText(text);
        if (text.length > 2 || text.length === 0) {
            handleSearch(text);
        }
    };


    useEffect(() => {
        const fetchAllLawyer = async () => {
            setLoading(true);
            try {
                const payload = {
                    limit: 100,
                    offset: 0,
                    search: searchText
                };
                const response = await Services.getOrganistionProfileList(payload);
                console.log("response43", response);

                if (response.success) {
                    setAllLawyer(response.data);
                    setPageCount(Math.ceil(response.data.length / LIMIT_DATA));
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: response.error || 'Failed to fetch lawyers',
                    });
                }
            } catch (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllLawyer();
    }, []);

    const handleSendConnection = () => {
        sendConnection()
    }

    const sendConnection = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        else setRefreshing(true);

        const payload = {
            to_user: selectedSupplier?.user,
            message: message?.trim() || '',
        };

        try {
            const response = await Services.sendConnectionSupplier(payload);


            if (response.success === true) {
                setConnectModalVisible(false);
                Toast.show({
                    type: 'success',
                    text1: 'Connection sent successfully',
                    position: 'top',
                });

            } else if (
                response.status === 400 &&
                response.error?.message === 'Connection request pending' &&
                setConnectModalVisible(false)
            ) {
                Toast.show({
                    type: 'info',
                    text1: 'Connection Already Pending',
                    text2: 'You have already sent a connection request.',
                    position: 'top',
                });

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to send connection',
                    text2: response.error?.message || 'Something went wrong',
                    position: 'top',
                });
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Unexpected error',
                text2: 'Please try again later',
                position: 'top',
            });
        }

        setLoading(false);
        setRefreshing(false);
    };


    const handleConnect = (item: Organization) => {
        setSelectedSupplier(item);
        setConnectModalVisible(true);
    };
    const handleNavigateAgnPro = (item: Organization) => {
        setSelectedSupplier(item);
        setProfileModalVisible(true);
    };
    const resetFilters = () => {
        setSelectedRating("");
        setSelectedLocation("");
        setSearchText("");
    };

    const renderItem = ({ item, index }: any) => (
        <View style={styles.lawyerCard}>
            <View style={styles.cardHeader}>

                <Image
                    source={
                        item.profilePic
                            ? { uri: item.profilePic }
                            : require('../assets/images/user.png')
                    }
                    style={styles.avatar}
                />
                <View style={styles.headerText}>
                    <Text style={styles.name}>
                        {item?.company_name || `${item?.user_detail?.first_name} ${item?.user_detail?.last_name}`}
                    </Text>
                    <Text style={styles.email}>{item?.
                        user_detail
                        ?.email}</Text>
                </View>
            </View>

            <View style={styles.cardDetails}>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{item?.address
                    }</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View style={styles.statusContainer}>
                        <View style={[
                            styles.statusDot,
                            item?.connection_request ? styles.pendingDot : styles.availableDot
                        ]} />
                        <Text style={styles.detailValue}>
                            {item?.connection_request || "Available"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.connectButton,
                        (item?.is_connection || item?.connection_request === "PENDING") && styles.disabledButton
                    ]}
                    onPress={() => handleConnect(item)}
                    disabled={item?.is_connection || item?.connection_request === "PENDING"}
                >
                    <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => handleNavigateAgnPro(item)}
                >
                    <Text style={styles.buttonText}>View Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    const DetailItem: React.FC<{
        label: string;
        value: string;
        isLink?: boolean;
        isEmail?: boolean;
    }> = ({ label, value, isLink = false, isEmail = false }) => (
        <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isLink || isEmail ? (
                <Text style={[styles.infoValue2, isLink && styles.linkText]}>
                    {value}
                </Text>
            ) : (
                <Text style={styles.infoValue2}>{value}</Text>
            )}
        </View>
    );
    return (
        <View style={styles.container}>
            {/* Search and Filter Section */}
            <View style={styles.filterSection}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Organization"
                    value={searchText}
                    onChangeText={handleSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedRating}
                        onValueChange={(itemValue) => setSelectedRating(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#666"
                    >
                        <Picker.Item label="Select Rating" value="" style={styles.pickertext} />
                        {ratingOptions.map((option) => (
                            <Picker.Item key={option.id} label={option.name} value={option.id} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedLocation}
                        onValueChange={(itemValue) => setSelectedLocation(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#666"
                    >
                        <Picker.Item label="Select Location" value="" style={styles.pickertext} />
                        {locationOptions.map((option) => (
                            <Picker.Item key={option.id} label={option.name} value={option.id} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/* Lawyers List */}
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <FlatList
                    data={lawyers}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No lawyers found</Text>
                        </View>
                    }
                />
            )}


            {/* Connection Modal would go here */}

            <Modal
                visible={profileModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Organization Profile</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setProfileModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {selectedSupplier && (
                            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                                {/* Company Information Card */}
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Icon name="business" size={20} color="#3B82F6" />
                                        <Text style={styles.sectionTitle}>Company Information</Text>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <DetailItem
                                            label="Company Name"
                                            value={selectedSupplier.company_name}
                                        />
                                        <DetailItem
                                            label="Email"
                                            value={selectedSupplier?.user_detail?.email}
                                            isEmail={true}
                                        />
                                        <DetailItem
                                            label="Website"
                                            value={
                                                !selectedSupplier?.company_website || selectedSupplier?.company_website === "null"
                                                    ? "N/A"
                                                    : selectedSupplier.company_website
                                            }
                                            isLink={true}
                                        />
                                        <View style={styles.infoGroup}>
                                            <Text style={styles.infoLabel}>About</Text>
                                            <Text style={styles.infoValue}>
                                                {selectedSupplier?.about_company && selectedSupplier?.about_company !== 'null'
                                                    ? selectedSupplier.about_company
                                                    : 'No description available'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Location Card */}
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Icon name="location-on" size={20} color="#EF4444" />
                                        <Text style={styles.sectionTitle}>Location</Text>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <DetailItem label="Country" value={selectedSupplier.country_name} />
                                        <DetailItem label="State" value={selectedSupplier.state_name} />
                                        <DetailItem label="District" value={selectedSupplier.district} />
                                    </View>
                                </View>

                                {/* Contact Card */}
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Icon name="person" size={20} color="#10B981" />
                                        <Text style={styles.sectionTitle}>Contact</Text>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <DetailItem
                                            label="Contact Person"
                                            value={`${selectedSupplier.user_detail.first_name} ${selectedSupplier.user_detail.last_name}`}
                                        />
                                        <DetailItem
                                            label="Phone"
                                            value={selectedSupplier.user_detail.contact_number || 'N/A'}
                                        />
                                        <DetailItem
                                            label="Experience"
                                            value={selectedSupplier.user_detail.experience || 'N/A'}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>




            {/* Connect Modal */}
            <Modal
                visible={connectModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setConnectModalVisible(false)}
            >
                <View style={styles.modalContainer2}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setConnectModalVisible(false)}
                        >
                            <Icon name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        {selectedSupplier && (
                            <>
                                <Text style={styles.modalTitle}>Connect with {selectedSupplier.company_name}</Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Your Message (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, styles.messageInput]}
                                        multiline
                                        numberOfLines={4}
                                        placeholder="Type your message here..."
                                        placeholderTextColor="#999"
                                        value={message}
                                        onChangeText={setMessage}
                                    />
                                </View>

                                <TouchableOpacity style={styles.connectActionButton} onPress={handleSendConnection}>
                                    <Text style={styles.connectActionButtonText}>Send Connection Request</Text>
                                </TouchableOpacity>

                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactText}>
                                        Or contact directly: {selectedSupplier.user_detail.contact_number || selectedSupplier.email}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    pickertext: {
        fontSize: 10,
        color: 'gray'
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    filterSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        fontSize: 10,
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 45,
        width: '100%',
        // color: '#333',
        backgroundColor: '#fff',
    },
    resetButton: {
        backgroundColor: '#0E3386',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    lawyerCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    cardDetails: {
        marginVertical: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    availableDot: {
        backgroundColor: '#2ecc71',
    },
    pendingDot: {
        backgroundColor: '#f39c12',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    connectButton: {
        backgroundColor: '#0E3386',
    },
    viewButton: {
        backgroundColor: '#0E3386',
    },
    disabledButton: {
        backgroundColor: '#0E3386',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 10,
    },
    pageButton: {
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 8,
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pageText: {
        fontSize: 14,
        color: '#333',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        backgroundColor: '#3B82F6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoGroup: {
        marginBottom: 16,
    },
    infoLabel2: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    infoValue2: {
        fontSize: 15,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 22,
    },
    linkText: {
        color: '#3B82F6',
        fontWeight: '500',
    },
    infoLabel: {
        width: '40%',
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0E3386',
        marginBottom: 16,
        textAlign: 'center',
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    contentScroll: {
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F9FAFB',
    },
    //   cardHeader: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 16,
    //     paddingBottom: 12,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#F3F4F6',
    //   },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 4,
    },
    cardBody: {
        paddingVertical: 4,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    connectActionButton: {
        backgroundColor: '#0E3386',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    connectActionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    contactInfo: {
        backgroundColor: '#F0F4FF',
        borderRadius: 8,
        padding: 12,
    },
    contactText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
});