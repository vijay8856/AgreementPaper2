
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import Toast from 'react-native-toast-message';
// import Services from '../Services/services';
// import { Picker } from '@react-native-picker/picker';

// const { width } = Dimensions.get('window');

// type Supplier = {
//   id: string;
//   user: number;
//   company_name: string;
//   email: string;
//   country_name: string;
//   state_name: string;
//   district: string;
//   is_active: boolean;
//   user_detail: {
//     first_name: string;
//     last_name: string;
//     email: string;
//     contact_number: string;
//     experience: string;
//     linkedin_url: string;
//   };
//   about_company: string;
//   company_website: string;
//   is_connection: boolean;
// };

// const SupplierAgencyScreen = () => {
//   const [supplierList, setSupplierList] = useState<Supplier[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
//   const [profileModalVisible, setProfileModalVisible] = useState(false);
//   const [connectModalVisible, setConnectModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [ratingFilter, setRatingFilter] = useState('');
//   const [locationFilter, setLocationFilter] = useState('');
//   const [message, setMessage] = useState('');

//   const ratings = [
//     { label: "All Ratings", value: "" },
//     { label: "5 Stars", value: "5" },
//     { label: "4+ Stars", value: "4" },
//     { label: "3+ Stars", value: "3" },
//   ];

//   const locations = [
//     { label: "All Locations", value: "" },
//     { label: "India", value: "India" },
//     { label: "Australia", value: "Australia" },
//     { label: "Canada", value: "Canada" },
//     { label: "Afghanistan", value: "Afghanistan" },
//     { label: "USA", value: "USA" },
//   ];

//   const fetchSupplierList = async (isRefresh = false) => {
//     if (!isRefresh) setLoading(true);
//     else setRefreshing(true);

//     try {
//       const response = await Services.getSuppliersList({ limit: 6, offset: 0 });

//       if (response.success) {
//         const formattedSuppliers = response.data.map((supplier: any) => ({
//           id: supplier.id,
//           user: supplier.user,
//           company_name: supplier.company_name,
//           email: supplier.user_detail?.email || supplier.email,
//           country_name: supplier.country_name,
//           state_name: supplier.state_name,
//           district: supplier.district,
//           is_active: supplier.is_active,
//           user_detail: {
//             first_name: supplier.user_detail?.first_name || '',
//             last_name: supplier.user_detail?.last_name || '',
//             email: supplier.user_detail?.email || '',
//             contact_number: supplier.user_detail?.contact_number || '',
//             experience: supplier.user_detail?.experience || '',
//             linkedin_url: supplier.user_detail?.linkedin_url || '',
//           },
//           about_company: supplier.about_company,
//           company_website: supplier.company_website,
//           is_connection: supplier.is_connection,
//         }));

//         setSupplierList(formattedSuppliers);
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: 'Failed to load suppliers',
//           text2: response.error?.message || 'Something went wrong',
//           position: 'top',
//         });
//       }
//     } catch (error) {
//       console.error('Supplier fetch error:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Network Error',
//         text2: 'Failed to connect to server',
//         position: 'top',
//       });
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchSupplierList();
//   }, []);

//   const onRefresh = useCallback(() => {
//     fetchSupplierList(true);
//   }, []);

//   const filteredSuppliers = supplierList.filter(supplier => {
//     const companyName = supplier.company_name?.toLowerCase() || '';
//     const email = supplier.email?.toLowerCase() || '';
//     const user = supplier.user;
//     const matchesSearch =
//       companyName.includes(searchQuery.toLowerCase()) ||
//       email.includes(searchQuery.toLowerCase());

//     const matchesRating = true;
//     const matchesLocation =
//       !locationFilter ||
//       supplier.country_name === locationFilter;

//     return matchesSearch && matchesRating && matchesLocation && user;
//   });
// console.log("filteredSuppliers",filteredSuppliers);

//   const handleSendConnection = () => {
//     sendConnection();
//   };

//   const sendConnection = async () => {
//     setLoading(true);
//     const payload = {
//       to_user: selectedSupplier?.user,
//       message: message?.trim() || '',
//     };

//     try {
//       const response = await Services.sendConnectionSupplier(payload);

//       if (response.success === true) {
//         setConnectModalVisible(false);
//         setMessage('');
//         Toast.show({
//           type: 'success',
//           text1: 'Connection sent successfully',
//           position: 'top',
//         });
//       } else if (
//         response.status === 400 &&
//         response.error?.message === 'Connection request pending'
//       ) {
//         setConnectModalVisible(false);
//         Toast.show({
//           type: 'info',
//           text1: 'Connection Already Pending',
//           text2: 'You have already sent a connection request.',
//           position: 'top',
//         });
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: 'Failed to send connection',
//           text2: response.error?.message || 'Something went wrong',
//           position: 'top',
//         });
//       }
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Unexpected error',
//         text2: 'Please try again later',
//         position: 'top',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConnect = (supplier: Supplier) => {
//     setSelectedSupplier(supplier);
//     setConnectModalVisible(true);
//   };

//   const handleViewProfile = (supplier: Supplier) => {
//     setSelectedSupplier(supplier);
//     setProfileModalVisible(true);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0E3386" />
//       </View>
//     );
//   }

//   const DetailItem: React.FC<{
//     label: string;
//     value: string;
//     isLink?: boolean;
//     isEmail?: boolean;
//   }> = ({ label, value, isLink = false, isEmail = false }) => (
//     <View style={styles.infoGroup}>
//       <Text style={styles.infoLabel}>{label}</Text>
//       {isLink || isEmail ? (
//         <Text style={[styles.infoValue2, isLink && styles.linkText]}>
//           {value}
//         </Text>
//       ) : (
//         <Text style={styles.infoValue2}>{value}</Text>
//       )}
//     </View>
//   );

//   // Calculate dynamic widths based on screen size
//   const getColumnWidths = () => {
//     const baseWidth = Math.max(width, 768); // Minimum table width for better readability
//     return {
//       id: '8%',
//       org: '15%',
//       email: '20%',
//       location: '17%',
//       status: '12%',
//       connect: '13%',
//       action: '15%',
//     };
//   };

//   const columnWidths = getColumnWidths();

//   return (
//     <View style={styles.container}>
//       {/* Filter Section */}
//       <View style={styles.filterContainer}>
//         <View style={styles.searchContainer}>
//           <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search Organization"
//             placeholderTextColor="#999"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         <View style={styles.filterRow}>
//           <View style={styles.filterItem}>
//             <Text style={styles.filterLabel}>Select Rating</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={ratingFilter}
//                 onValueChange={setRatingFilter}
//                 style={styles.picker}
//                 dropdownIconColor="#666"
//               >
//                 {ratings.map((rating, index) => (
//                   <Picker.Item key={index} label={rating.label} value={rating.value} style={styles.pickerFont} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View style={styles.filterItem}>
//             <Text style={styles.filterLabel}>Select Location</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={locationFilter}
//                 onValueChange={setLocationFilter}
//                 style={styles.picker}
//                 dropdownIconColor="#666"
//               >
//                 {locations.map((location, index) => (
//                   <Picker.Item key={index} label={location.label} value={location.value} style={styles.pickerFont} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Table Container */}
//       <View style={styles.tableContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//           <View style={styles.tableWrapper}>
//             {/* Table Header */}
//             <View style={styles.tableHeader}>
//               <View style={[styles.idColumn, { width: columnWidths.id }]}><Text style={styles.headerText}>ID</Text></View>
//               <View style={[styles.orgColumn, { width: columnWidths.org }]}><Text style={styles.headerText}>AGENCY</Text></View>
//               <View style={[styles.emailColumn, { width: columnWidths.email }]}><Text style={styles.headerText}>EMAIL | COMPANY</Text></View>
//               <View style={[styles.locationColumn, { width: columnWidths.location }]}><Text style={styles.headerText}>LOCATION</Text></View>
//               <View style={[styles.statusColumn, { width: columnWidths.status }]}><Text style={styles.headerText}>STATUS</Text></View>
//               <View style={[styles.connectColumn, { width: columnWidths.connect }]}><Text style={styles.headerText}>CONNECT</Text></View>
//               <View style={[styles.actionColumn, { width: columnWidths.action }]}><Text style={styles.headerText}>ACTION</Text></View>
//             </View>

//             {/* Supplier List */}
//             <ScrollView
//               style={styles.verticalScroll}
//               showsVerticalScrollIndicator={true}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//             >
//               {filteredSuppliers.map((supplier, index) => (
//                 <View key={supplier.id} style={styles.tableRow}>
//                   <View style={[styles.idColumn, { width: columnWidths.id }]}><Text style={styles.cellText}>{index + 1}</Text></View>

//                   <View style={[styles.orgColumn, { width: columnWidths.org }]}>
//                     <Text style={styles.cellText} numberOfLines={2}>{supplier.company_name}</Text>
//                   </View>

//                   <View style={[styles.emailColumn, { width: columnWidths.email }]}>
//                     <Text style={styles.cellText} numberOfLines={1}>{supplier.email}</Text>
//                     <Text style={styles.companyText} numberOfLines={1}>{supplier.company_name}</Text>
//                   </View>

//                   <View style={[styles.locationColumn, { width: columnWidths.location }]}>
//                     <Text style={styles.cellText} numberOfLines={2}>{supplier.country_name}</Text>
//                   </View>

//                   <View style={[styles.statusColumn, { width: columnWidths.status }]}>
//                     <View style={styles.statusIndicator}>
//                       <View style={[styles.statusDot, supplier.is_active && styles.activeDot]} />
//                       <Text style={styles.statusText}>
//                         {supplier.is_active ? 'Available' : 'Unavailable'}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={[styles.connectColumn, { width: columnWidths.connect }]}>
//                     <TouchableOpacity
//                       style={[styles.connectButton, supplier.is_connection && styles.connectedButton]}
//                       onPress={() => handleConnect(supplier)}
//                     >
//                       <Text style={styles.connectButtonText}>
//                         {supplier.is_connection ? 'Connected' : 'Connect'}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={[styles.actionColumn, { width: columnWidths.action }]}>
//                     <TouchableOpacity
//                       style={styles.actionButton}
//                       onPress={() => handleViewProfile(supplier)}
//                     >
//                       <Text style={styles.actionButtonText}>View Profile</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ))}
              
//               {/* Empty space fix */}
//               {filteredSuppliers.length === 0 && (
//                 <View style={styles.emptyState}>
//                   <Text style={styles.emptyStateText}>No suppliers found</Text>
//                 </View>
//               )}
//             </ScrollView>
//           </View>
//         </ScrollView>
//       </View>

//       {/* View Profile Modal */}
//       <Modal
//         visible={profileModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setProfileModalVisible(false)}
//       >
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Supplier Profile</Text>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setProfileModalVisible(false)}
//               >
//                 <Icon name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             {selectedSupplier && (
//               <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
//                 <View style={styles.card}>
//                   <View style={styles.cardHeader}>
//                     <Icon name="business" size={20} color="#3B82F6" />
//                     <Text style={styles.sectionTitle}>Company Information</Text>
//                   </View>
//                   <View style={styles.cardBody}>
//                     <DetailItem label="Company Name" value={selectedSupplier.company_name} />
//                     <DetailItem label="Email" value={selectedSupplier.email} isEmail={true} />
//                     <DetailItem label="Website" value={selectedSupplier.company_website || 'N/A'} isLink={true} />
//                     <View style={styles.infoGroup}>
//                       <Text style={styles.infoLabel}>About</Text>
//                       <Text style={styles.infoValue}>
//                         {selectedSupplier.about_company || 'No description available'}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.card}>
//                   <View style={styles.cardHeader}>
//                     <Icon name="location-on" size={20} color="#EF4444" />
//                     <Text style={styles.sectionTitle}>Location</Text>
//                   </View>
//                   <View style={styles.cardBody}>
//                     <DetailItem label="Country" value={selectedSupplier.country_name} />
//                     <DetailItem label="State" value={selectedSupplier.state_name} />
//                     <DetailItem label="District" value={selectedSupplier.district} />
//                   </View>
//                 </View>

//                 <View style={styles.card}>
//                   <View style={styles.cardHeader}>
//                     <Icon name="person" size={20} color="#10B981" />
//                     <Text style={styles.sectionTitle}>Contact</Text>
//                   </View>
//                   <View style={styles.cardBody}>
//                     <DetailItem
//                       label="Contact Person"
//                       value={`${selectedSupplier.user_detail.first_name} ${selectedSupplier.user_detail.last_name}`}
//                     />
//                     <DetailItem label="Phone" value={selectedSupplier.user_detail.contact_number || 'N/A'} />
//                     <DetailItem label="Experience" value={selectedSupplier.user_detail.experience || 'N/A'} />
//                   </View>
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Connect Modal */}
//       <Modal
//         visible={connectModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setConnectModalVisible(false)}
//       >
//         <View style={styles.modalContainer2}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setConnectModalVisible(false)}
//             >
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>

//             {selectedSupplier && (
//               <>
//                 <Text style={styles.modalTitle}>Connect with {selectedSupplier.company_name}</Text>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Your Message (Optional)</Text>
//                   <TextInput
//                     style={[styles.input, styles.messageInput]}
//                     multiline
//                     numberOfLines={4}
//                     placeholder="Type your message here..."
//                     placeholderTextColor="#999"
//                     value={message}
//                     onChangeText={setMessage}
//                   />
//                 </View>

//                 <TouchableOpacity style={styles.connectActionButton} onPress={handleSendConnection}>
//                   <Text style={styles.connectActionButtonText}>Send Connection Request</Text>
//                 </TouchableOpacity>

//                 <View style={styles.contactInfo}>
//                   <Text style={styles.contactText}>
//                     Or contact directly: {selectedSupplier.user_detail.contact_number || selectedSupplier.email}
//                   </Text>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FC',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filterContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F4FF',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 16,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     color: '#333',
//     fontSize: 14,
//   },
//   filterRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   filterItem: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   filterLabel: {
//     fontSize: 10,
//     color: 'black',
//     marginBottom: 4,
//     fontWeight: '600',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#F8F9FA',
//   },
//   picker: {
//     color: 'black',
//     height: 45,
//   },
//   pickerFont: {
//     fontSize: 11,
//     color: 'black',
//   },
//   tableContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     marginBottom:40
//   },
//   tableWrapper: {
//     minWidth: Math.max(Dimensions.get('window').width, 768),
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#0E3386',
//     paddingVertical: 12,
//     paddingHorizontal: 4,
//     minHeight: 50,
//   },
//   headerText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: 'white',
//     textAlign: 'center',
//   },
//   idColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 2,
//   },
//   orgColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   emailColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   locationColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   statusColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   connectColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   actionColumn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   verticalScroll: {
//     flex: 1,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     paddingVertical: 12,
//     paddingHorizontal: 4,
//     minHeight: 60,
//   },
//   cellText: {
//     fontSize: 11,
//     color: '#333',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   companyText: {
//     fontSize: 10,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   statusIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#FF5252',
//     marginRight: 4,
//   },
//   activeDot: {
//     backgroundColor: '#4CAF50',
//   },
//   statusText: {
//     fontSize: 10,
//     color: '#333',
//     fontWeight: '500',
//   },
//   connectButton: {
//     backgroundColor: '#0E3386',
//     borderRadius: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     minWidth: 80,
//   },
//   connectedButton: {
//     backgroundColor: '#4CAF50',
//   },
//   connectButtonText: {
//     fontSize: 11,
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   actionButton: {
//     backgroundColor: '#0E3386',
//     borderRadius: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     minWidth: 90,
//   },
//   actionButtonText: {
//     fontSize: 11,
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   emptyState: {
//     padding: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   modalContainer2: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     width: '90%',
//     borderRadius: 16,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginBottom: 10,
//     padding: 4,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0E3386',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#333',
//     backgroundColor: '#F8F9FA',
//   },
//   messageInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   connectActionButton: {
//     backgroundColor: '#0E3386',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   connectActionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   contactInfo: {
//     backgroundColor: '#F0F4FF',
//     borderRadius: 8,
//     padding: 12,
//   },
//   contactText: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '90%',
//     paddingBottom: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 24,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   contentScroll: {
//     paddingHorizontal: 24,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 6,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#F9FAFB',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginLeft: 12,
//   },
//   cardBody: {
//     paddingVertical: 4,
//   },
//   infoGroup: {
//     marginBottom: 16,
//   },
//   infoLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#6B7280',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: '#374151',
//     lineHeight: 22,
//   },
//   infoValue2: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: '#374151',
//     lineHeight: 22,
//   },
//   linkText: {
//     color: '#3B82F6',
//     fontWeight: '500',
//   },
// });

// export default SupplierAgencyScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

type Supplier = {
  id: string;
  user: number;
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

const SupplierAgencyScreen = () => {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [message, setMessage] = useState('');
  
  // Infinite scrolling states
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;
console.log("supplierList",supplierList);

  const ratings = [
    { label: "All Ratings", value: "" },
    { label: "5 Stars", value: "5" },
    { label: "4+ Stars", value: "4" },
    { label: "3+ Stars", value: "3" },
  ];

  const locations = [
    { label: "All Locations", value: "" },
    { label: "India", value: "India" },
    { label: "Australia", value: "Australia" },
    { label: "Canada", value: "Canada" },
    { label: "Afghanistan", value: "Afghanistan" },
    { label: "USA", value: "USA" },
  ];

  // Generate unique key for each item
  const generateUniqueKey = (supplier: Supplier, index: number) => {
    // Use combination of id and user to create unique key
    return `${supplier.id}-${supplier.user}-${index}`;
  };

  const fetchSupplierList = async (isRefresh = false, loadMore = false) => {
    if (loadMore) {
      if (!hasMore || loadingMore) return;
      setLoadingMore(true);
    } else if (!isRefresh) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const currentOffset = isRefresh ? 0 : (loadMore ? offset : 0);

    try {
      const response = await Services.getSuppliersList({ 
        limit: limit, 
        offset: currentOffset 
      });
console.log("responseresponse",response);

      if (response.success) {
        const formattedSuppliers = response.data.map((supplier: any, index: number) => ({
          id: supplier.id || `temp-${currentOffset + index}`, // Fallback for missing id
          user: supplier.user,
          company_name: supplier.company_name,
          email: supplier.user_detail?.email || supplier.email,
          country_name: supplier.country_name,
          state_name: supplier.state_name,
          district: supplier.district,
          is_active: supplier.is_active,
          connection_request:supplier.connection_request,


          user_detail: {
            first_name: supplier.user_detail?.first_name || '',
            last_name: supplier.user_detail?.last_name || '',
            email: supplier.user_detail?.email || '',
            contact_number: supplier.user_detail?.contact_number || '',
            experience: supplier.user_detail?.experience || '',
            linkedin_url: supplier.user_detail?.linkedin_url || '',
          },
          about_company: supplier.about_company,
          company_website: supplier.company_website,
          is_connection: supplier.is_connection,
        }));

        if (isRefresh) {
          setSupplierList(formattedSuppliers);
          setOffset(limit);
        } else if (loadMore) {
          setSupplierList(prev => [...prev, ...formattedSuppliers]);
          setOffset(prev => prev + limit);
        } else {
          setSupplierList(formattedSuppliers);
          setOffset(limit);
        }

        // Check if there are more items to load
        setHasMore(formattedSuppliers.length === limit);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to load suppliers',
          text2: response.error?.message || 'Something went wrong',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Supplier fetch error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to connect to server',
        position: 'top',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchSupplierList();
  }, []);

  const onRefresh = useCallback(() => {
    fetchSupplierList(true);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchSupplierList(false, true);
    }
  }, [hasMore, loadingMore]);

  const filteredSuppliers = supplierList.filter(supplier => {
    const companyName = supplier.company_name?.toLowerCase() || '';
    const email = supplier.email?.toLowerCase() || '';
    const user = supplier.user;
    const matchesSearch =
      companyName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    const matchesRating = true;
    const matchesLocation =
      !locationFilter ||
      supplier.country_name === locationFilter;

    return matchesSearch && matchesRating && matchesLocation && user;
  });

  const handleSendConnection = () => {
    sendConnection();
  };

  const sendConnection = async () => {
    setLoading(true);
    const payload = {
      to_user: selectedSupplier?.user,
      message: message?.trim() || '',
    };

    try {
      const response = await Services.sendConnectionSupplier(payload);

      if (response.success === true) {
        setConnectModalVisible(false);
        setMessage('');
        Toast.show({
          type: 'success',
          text1: 'Connection sent successfully',
          position: 'top',
        });
      } else if (
        response.status === 400 &&
        response.error?.message === 'Connection request pending'
      ) {
        setConnectModalVisible(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setConnectModalVisible(true);
  };

  const handleViewProfile = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setProfileModalVisible(true);
  };

  const renderSupplierCard = ({ item, index }: { item: Supplier; index: number }) => (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName} numberOfLines={1}>
            {item.company_name}
          </Text>
          <Text style={styles.companyEmail} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, item.is_active && styles.activeDot]} />
          <Text style={styles.statusText}>
            {item.is_active ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.country_name} {item.state_name && `, ${item.state_name}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="language" size={16} color="#666" />
          <Text style={styles.websiteText} numberOfLines={1}>
            {item.company_website || 'No website'}
          </Text>
        </View>

        {item.about_company ? (
          <Text style={styles.aboutText} numberOfLines={2}>
            {item.about_company}
          </Text>
        ) : null}
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.connectButton, item.connection_request && styles.connectedButton]}
          onPress={() => handleConnect(item)}
          disabled={!!item?.connection_request}
        >
          <Text style={styles.connectButtonText}>
            {item?.connection_request
      ? item.connection_request // Show PENDING / COMPLETED / etc.
      : 'Connect'}
            {/* {item.is_connection ? 'Connected' : 'Connect'} */}
          </Text>
        </TouchableOpacity>
     
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() => handleViewProfile(item)}
        >
          <Text style={styles.viewProfileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0E3386" />
        <Text style={styles.loadingText}>Loading more suppliers...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Icon name="business" size={64} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>No Suppliers Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery || locationFilter 
          ? 'Try adjusting your search or filters' 
          : 'No suppliers available at the moment'
        }
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0E3386" />
        <Text style={styles.loadingText}>Loading suppliers...</Text>
      </View>
    );
  }

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
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Organization"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Select Rating</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ratingFilter}
                onValueChange={setRatingFilter}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {ratings.map((rating, index) => (
                  <Picker.Item key={index} label={rating.label} value={rating.value} style={styles.pickerFont} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Select Location</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={locationFilter}
                onValueChange={setLocationFilter}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {locations.map((location, index) => (
                  <Picker.Item key={index} label={location.label} value={location.value} style={styles.pickerFont} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {/* Supplier Cards List */}
      <FlatList
        data={filteredSuppliers}
        renderItem={renderSupplierCard}
        keyExtractor={(item, index) => generateUniqueKey(item, index)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* View Profile Modal */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Supplier Profile</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setProfileModalVisible(false)}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedSupplier && (
              <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                  <View style={styles.cardHeader}>
                    <Icon name="business" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Company Information</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <DetailItem label="Company Name" value={selectedSupplier.company_name} />
                    <DetailItem label="Email" value={selectedSupplier.email} isEmail={true} />
                    <DetailItem label="Website" value={selectedSupplier.company_website || 'N/A'} isLink={true} />
                    <View style={styles.infoGroup}>
                      <Text style={styles.infoLabel}>About</Text>
                      <Text style={styles.infoValue}>
                        {selectedSupplier.about_company || 'No description available'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.profileCard}>
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

                <View style={styles.profileCard}>
                  <View style={styles.cardHeader}>
                    <Icon name="person" size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Contact</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <DetailItem
                      label="Contact Person"
                      value={`${selectedSupplier.user_detail.first_name} ${selectedSupplier.user_detail.last_name}`}
                    />
                    <DetailItem label="Phone" value={selectedSupplier.user_detail.contact_number || 'N/A'} />
                    <DetailItem label="Experience" value={selectedSupplier.user_detail.experience || 'N/A'} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 10,
    color: 'black',
    marginBottom: 4,
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
  },
  picker: {
    color: 'black',
    height: 45,
  },
  pickerFont: {
    fontSize: 11,
    color: 'black',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flex: 1,
    marginRight: 12,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E3386',
    marginBottom: 4,
  },
  companyEmail: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  websiteText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 8,
    flex: 1,
  },
  aboutText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#0E3386',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  connectedButton: {
    backgroundColor: '#4CAF50',
  },
  connectButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  viewProfileButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0E3386',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  viewProfileButtonText: {
    fontSize: 14,
    color: '#0E3386',
    textAlign: 'center',
    fontWeight: '600',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    paddingTop: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
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
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0E3386',
    marginBottom: 16,
    textAlign: 'center',
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
    backgroundColor: '#F8F9FA',
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
  profileCard: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  infoGroup: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 22,
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
});

export default SupplierAgencyScreen;