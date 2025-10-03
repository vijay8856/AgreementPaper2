// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Linking
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Services from '../Services/services';
// import Toast from 'react-native-toast-message';

// const SignedDocument = () => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchDocuments = async (isRefresh = false) => {
//     if (!isRefresh) setLoading(true);
//     else setRefreshing(true);

//     try {
//       const response = await Services.getEsignDocList();

//       if (response.success) {
//         setDocuments(response.data || []);
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: 'Failed to load documents',
//           text2: response.error?.message || 'Please try again',
//         });
//       }
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Network error',
//         text2: 'Unable to fetch documents',
//       });
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const handleViewDocument = (document) => {
//     if (document.embedded_edit_url) {
//       Linking.openURL(document.embedded_edit_url);
//     } else {
//       Toast.show({
//         type: 'info',
//         text1: 'No viewable URL available',
//       });
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'draft': return '#FFA500';
//       case 'completed': return '#4CAF50';
//       case 'sent': return '#2196F3';
//       case 'declined': return '#F44336';
//       default: return '#666';
//     }
//   };

//   const getRecipientsText = (recipients) => {
//     if (!recipients || recipients.length === 0) return 'No recipients';

//     const names = recipients.map(recipient => recipient.name).filter(Boolean);
//     if (names.length === 0) return 'Recipients added';

//     return names.join(', ');
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#001f8e" />
//         <Text style={styles.loadingText}>Loading documents...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerCell}>ID</Text>
//         <Text style={[styles.headerCell, styles.documentHeader]}>Document</Text>
//         <Text style={styles.headerCell}>Status</Text>
//         <Text style={styles.headerCell2}>Action</Text>
//       </View>

//       {/* Documents List */}
//       <ScrollView style={styles.scrollView}>
//         {documents.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Icon name="description" size={50} color="#ccc" />
//             <Text style={styles.emptyText}>No documents found</Text>
//           </View>
//         ) : (
//           documents.map((doc) => (
//             <View key={doc.id} style={styles.row}>
//               {/* ID Column */}
//               <Text style={styles.cell}>{doc.id}</Text>

//               {/* Document Column */}
//               <View style={styles.documentCell}>
//                 <Icon name="picture-as-pdf" size={16} color="#e74c3c" />
//                 <View style={styles.documentInfo}>
//                   <Text style={styles.filename} numberOfLines={1}>
//                     {doc.filename || 'Unnamed Document'}
//                   </Text>
//                   <Text style={styles.recipients} numberOfLines={1}>
//                     {getRecipientsText(doc.recipients)}
//                   </Text>
//                 </View>
//               </View>

//               {/* Status Column */}
//               <View style={styles.statusCell}>
//                 <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) }]}>
//                   <Text style={styles.statusText}>{doc.status || 'Unknown'}</Text>
//                 </View>
//               </View>

//               {/* Action Column */}
//               <TouchableOpacity 
//                 style={styles.actionButton}
//                 onPress={() => handleViewDocument(doc)}
//               >
//                 <Icon name="visibility" size={16} color="#001f8e" />
//                 <Text style={styles.actionText}>View</Text>
//               </TouchableOpacity>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Refresh Control */}
//       <TouchableOpacity 
//         style={styles.refreshButton}
//         onPress={() => fetchDocuments(true)}
//         disabled={refreshing}
//       >
//         <Icon name="refresh" size={20} color="#001f8e" />
//         <Text style={styles.refreshText}>
//           {refreshing ? 'Refreshing...' : 'Refresh'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({

//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#001f8e',
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     backgroundColor: '#001f8e',
//     paddingVertical: 15,
//     paddingHorizontal: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   headerCell: {
//     flex: 1,
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//     textAlign: 'center',

//   },
//    headerCell2: {
//     flex: 1,
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//     textAlign: 'center',
//     marginLeft:10
//   },
//   documentHeader: {
//     flex: 3,
//     textAlign: 'left',
//     marginLeft: 5,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     minHeight: 60,
//   },
//   cell: {
//     flex: 1,
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   documentCell: {
//     flex: 3,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   documentInfo: {
//     marginLeft: 8,
//     flex: 1,
//   },
//   filename: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   recipients: {
//     fontSize: 10,
//     color: '#666',
//   },
//   statusCell: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     minWidth: 60,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f0f4ff',
//     paddingVertical: 6,
//     paddingHorizontal: 2,
//     borderRadius: 6,
//     marginHorizontal: 5,
//   },
//   actionText: {
//     fontSize: 10,
//     color: '#001f8e',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     marginTop: 10,
//     color: '#666',
//     fontSize: 16,
//   },
//   refreshButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 15,
//     backgroundColor: '#f8f9fa',
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   refreshText: {
//     marginLeft: 8,
//     color: '#001f8e',
//     fontWeight: '500',
//   },
// });

// export default SignedDocument;



import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import Services, { API_KEY, SIGNWELL_API_URL } from '../Services/services';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import { useToast } from '../../src/components/ToastContext';
const SignedDocument = () => {
    const { showToast } = useToast();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Request storage permission for Android
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'App needs access to your storage to download documents',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // iOS doesn't need this permission
    };

    const fetchDocuments = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        else setRefreshing(true);

        try {
            const response = await Services.getEsignDocList();

            if (response.success) {
                setDocuments(response.data || []);


            } else {
                showToast('Failed to load documents', 'error');

            }
        } catch (error) {
            showToast('Network error unable to fetch documents', 'error');

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);
    console.log("doc", documents);
    const handleDownload = async (signwell_doc_id, id, status) => {
        setDownloadingId(id);
        console.log("signwell_doc_id", signwell_doc_id);
        console.log("id", id);
        console.log("status", status);



        try {
            if (!signwell_doc_id) {
                showToast('Document ID not found', 'error');

                return;
            }

            // Check document status first
            const statusResult = await Services.checkStatusSignWellDocument(signwell_doc_id);
            console.log(
                "statusResult", statusResult
            );

            if (!statusResult.status) {
                showToast('Unable to check document status', 'error');


                return;
            }

            const documentStatus = statusResult.data.status;

            // Handle different statuses
            switch (documentStatus) {
                case 'Bounced':
                case 'Sent':
                case 'Pending':
                    showToast(
                        documentStatus === 'Sent'
                            ? 'The document has been sent but is not yet completed'
                            : documentStatus === 'Pending'
                                ? 'The document is pending'
                                : documentStatus === 'draft'
                                    ? 'The document is in draft not completed yet'
                                    : statusResult.data.error_message || 'Document bounced',
                        'info',
                        `Document ${documentStatus}`
                    );

                    // Update status if different from current status
                    if (status !== documentStatus) {
                        await updateDocumentStatus(id, documentStatus);
                    }
                    break;

                case 'Completed':
                    // Download the completed PDF
                    await downloadCompletedDocument(signwell_doc_id, id, status);
                    break;

                default:
                    showToast('Document status is not downloadable', 'info');

            }
        } catch (error) {
            console.error('Download error:', error);
            showToast('An error occurred while downloading', 'error');


        } finally {
            setDownloadingId(null);
        }
    };

    const downloadCompletedDocument = async (signwell_doc_id, id, currentStatus) => {
        try {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                showToast('Storage permission is required to download files', 'error');

                return;
            }

            // Get the PDF data from SignWell
            const pdfResult = await getCompletedSignWellDocument(signwell_doc_id);

            if (!pdfResult.status) {
                throw new Error(pdfResult.message || 'Failed to get PDF');
            }

            // Update status if different
            if (currentStatus !== 'Completed') {
                await updateDocumentStatus(id, 'Completed');
            }

            // Save file to device
            const downloadPath = `${RNFS.DownloadDirectoryPath}/document_${id}_${Date.now()}.pdf`;

            await RNFS.writeFile(downloadPath, pdfResult.blob, 'base64');
            showToast('Document saved to Downloads folder', 'success');



            // Optionally open the document
            Linking.openURL(`file://${downloadPath}`); // Uncomment if you want to auto-open

        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    };

    const getCompletedSignWellDocument = async (id) => {
        try {
            const response = await fetch(`${SIGNWELL_API_URL}${id}/completed_pdf/?url_only=false&audit_page=true`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': API_KEY,
                    'Accept': 'application/pdf',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                return { status: false, message: `HTTP ${response.status}: ${errorText}` };
            }

            // Get the PDF as base64
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

            return { status: true, blob: base64 };

        } catch (error) {
            console.error('Error retrieving document:', error);
            return { status: false, message: error.message };
        }
    };

    const updateDocumentStatus = async (id, status) => {
        try {
            // Assuming you have an API endpoint to update document status
            const response = await Services.updateEsignDocStatus(id, { status });
            if (response.success) {
                // Refresh documents list to show updated status
                fetchDocuments();
            }
        } catch (error) {
            console.error('Status update error:', error);
        }
    };
    const handleDelete = (id) => {
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this document? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingId(id);
                        try {
                            const response = await Services.deleteEsignDoc(id);
                            console.log("response1", response);

                            if (response.success) {
                                showToast('Document has been deleted successfully', 'success');
                                // Remove from local state
                                setDocuments(prev => prev.filter(doc => doc.id !== id));
                            } else {
                                showToast('Unable to delete document', 'error');
                            }
                        } catch (error) {
                            showToast('Failed to delete document', 'error');
                        } finally {
                            setDeletingId(null);
                        }
                    },
                },
            ]
        );
    };


    const handleViewDocument = (document) => {
        if (document.embedded_edit_url) {
            Linking.openURL(document.embedded_edit_url);
        } else {
            showToast('No viewable URL available', 'info');

        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'draft': return '#FFA500';
            case 'completed': return '#4CAF50';
            case 'sent': return '#2196F3';
            case 'declined': return '#F44336';
            case 'bounced': return '#FF5722';
            case 'pending': return '#FFC107';
            default: return '#666';
        }
    };

    const getRecipientsText = (recipients) => {
        if (!recipients || recipients.length === 0) return 'No recipients';

        const names = recipients.map(recipient => recipient.name).filter(Boolean);
        if (names.length === 0) return 'Recipients added';

        return names.join(', ');
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#001f8e" />
                <Text style={styles.loadingText}>Loading documents...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerCell}>ID</Text>
                <Text style={[styles.headerCell, styles.documentHeader]}>Document</Text>
                <Text style={styles.headerCell}>Status</Text>
                <Text style={styles.headerCell2}>Actions</Text>
            </View>

            {/* Documents List */}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchDocuments(true)}
                        colors={['#001f8e']}
                    />
                }
            >
                {documents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="description" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No documents found</Text>
                    </View>
                ) : (
                    documents.map((doc) => (
                        <View key={doc.id} style={styles.row}>
                            {/* ID Column */}
                            <Text style={styles.cell}>{doc.id}</Text>

                            {/* Document Column */}
                            <View style={styles.documentCell}>
                                <Icon name="picture-as-pdf" size={16} color="#e74c3c" />
                                <View style={styles.documentInfo}>
                                    <Text style={styles.filename} numberOfLines={1}>
                                        {doc.filename || 'Unnamed Document'}
                                    </Text>
                                    <Text style={styles.recipients} numberOfLines={1}>
                                        {getRecipientsText(doc.recipients)}
                                    </Text>
                                </View>
                            </View>

                            {/* Status Column */}
                            <View style={styles.statusCell}>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) }]}>
                                    <Text style={styles.statusText}>{doc.status || 'Unknown'}</Text>
                                </View>
                            </View>

                            {/* Actions Column */}
                            <View style={styles.actionsCell}>
                                {/* View Button */}
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleViewDocument(doc)}
                                >
                                    <Icon name="visibility" size={13} color="#001f8e" />
                                    {/* <Text style={styles.actionText}>View</Text> */}
                                </TouchableOpacity>

                                {/* Download Button */}
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleDownload(doc.signwell_doc_id, doc.id, doc.status)}
                                    disabled={downloadingId === doc.id}
                                >
                                    {downloadingId === doc.id ? (
                                        <ActivityIndicator size="small" color="#001f8e" />
                                    ) : (
                                        <Icon name="file-download" size={13} color="#4CAF50" />
                                    )}
                                    {/* <Text style={[styles.actionText, { color: '#4CAF50' }]}>
                    {downloadingId === doc.id ? 'Downloading' : 'Download'}
                  </Text> */}
                                </TouchableOpacity>

                                {/* Delete Button */}
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleDelete(doc.id)}
                                    disabled={deletingId === doc.id}
                                >
                                    {deletingId === doc.id ? (
                                        <ActivityIndicator size="small" color="#FF0000" />
                                    ) : (
                                        <Icon name="delete" size={13} color="#F44336" />
                                    )}

                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#001f8e',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    headerCell: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    documentHeader: {
        flex: 2,
    },
    headerCell2: {
        flex: 1.5,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginVertical: 5,
        padding: 15,
        paddingHorizontal: 20,

        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
    },
    documentCell: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    documentInfo: {
        marginLeft: 10,
        flex: 1,
    },
    filename: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    recipients: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    statusCell: {
        flex: 1,
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    actionsCell: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        padding: 5,
        minWidth: "auto",
    },
    actionText: {
        fontSize: 10,
        marginTop: 2,
        fontWeight: '500',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
    },
    emptyText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
});

export default SignedDocument;