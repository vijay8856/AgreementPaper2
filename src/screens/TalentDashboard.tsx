import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OrganizationProfileModal from '../components/Modals/OrganizationProfileModal';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get("window");

const TalentDashboard = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [lawyers, setAllLawyer] = useState([]);
    const [jobProfiles, setJobProfiles] = useState([]);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchUserData = async () => {
        try {
            const fName = await AsyncStorage.getItem('first_Name');
            const lName = await AsyncStorage.getItem('last_Name');
            if (fName) setFirstName(fName);
            if (lName) setLastName(lName);
        } catch (e) {
            console.log('Error fetching user data:', e);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);
  useEffect(() => {
    const checkProfileStatus = async () => {
      const isActive = await AsyncStorage.getItem('isActive');
      console.log("isActive",isActive);
      
      if (isActive !== 'true') {
        setShowProfileModal(true);
      }
    };
    
    checkProfileStatus();
  }, []);
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


    useEffect(() => {
        const fetchJobProfiles = async () => {
            setLoading(true);
            try {
                const payload = {
                    limit: 6,
                    offset: 0,
                };
                const response = await Services.getJobProfileList(payload);
                console.log("response46", response);

                if (response.success) {
                    setJobProfiles(response.data);
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

        fetchJobProfiles();
    }, []);

    const earningCategories = [
        { title: 'SOW', icon: 'description' },
        { title: 'Timesheet', icon: 'event-note' },
        { title: 'Invoke', icon: 'receipt' },
        { title: 'Half Yearly', icon: 'calendar-today' },
    ];

    //   const renderProgressItem = ({ item }:any) => (
    //     <View style={styles.progressCard}>
    //       <View style={styles.progressHeader}>
    //         <MaterialIcons name={item.icon} size={20} color="#2E5BFF" />
    //         <Text style={styles.progressTitle}>{item.title}</Text>
    //       </View>
    //       <Text style={styles.progressValue}>{item.value}</Text>
    //       {item.subtitle && <Text style={styles.progressSubtitle}>{item.subtitle}</Text>}
    //       <View style={styles.progressBarContainer}>
    //         <View style={styles.progressBar}>
    //           <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
    //         </View>
    //         <Text style={styles.progressText}>{item.progress}%</Text>
    //       </View>
    //       {item.status && <Text style={styles.statusText}>{item.status}</Text>}
    //     </View>
    //   );

    const renderOrganization = ({ item }: any) => (
        <View style={styles.orgCard}>
            <Text style={styles.orgName}>{item.company_name
            }</Text>
            <Text style={styles.orgCategory}>Location:
                {item.country_name}{item.state_name ? `, ${item.state_name}` : ''}
            </Text>
            <Text style={styles.orgCategory}>Email:
                {item.user_detail?.
                    email}
            </Text>
        </View>
    );

    const renderEarningCategory = ({ item }: any) => (
        <View style={styles.earningCard}>
            {/* <MaterialIcons name={item.icon} size={24} color="#2E5BFF" /> */}
            <Text style={styles.earningTitle}>{item.title}</Text>
        </View>
    );

    const renderJobItem = ({ item }: any) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <View style={styles.jobMeta}>
                <Text style={styles.jobBureau}>Job type : {item.job_type_value}</Text>
                <Text style={styles.jobCompany}>{item.company_name}</Text>
            </View>
            <View style={styles.jobDetails}>
                <Text style={styles.jobExperience}>Exp.
                    {item.experience_value ? `${item.experience_value} Years` : 'N/A'}
                </Text>

                <Text style={styles.jobType}>{item.type}</Text>
            </View>
            <Text style={styles.jobPosted}>
                Posted on: {new Date(item.created_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })}
            </Text>

            <Text style={styles.jobDescription}>
                {`Job as a ${item.job_type_value || ''} ${item.title || ''}`.trim()}
            </Text>

        </View>
    );

    // const renderInvoiceItem = ({ item }: any) => (
    //     <View style={styles.invoiceCard}>
    //         <View style={styles.invoiceRow}>
    //             <Text style={styles.invoiceDate}>{item.date}</Text>
    //             <Text style={styles.invoiceNumber}>{item.number}</Text>
    //         </View>
    //         <View style={styles.invoiceRow}>
    //             <Text style={styles.invoiceOrg}>{item.organization}</Text>
    //             <Text style={styles.invoiceResource}>{item.resource}</Text>
    //         </View>
    //         <View style={styles.invoiceRow}>
    //             <Text style={styles.invoiceAmount}>{item.amount}</Text>
    //             <View style={[
    //                 styles.statusBadge,
    //                 item.status === 'Approved' && styles.statusApproved,
    //                 item.status === 'Pending ' && styles.statusPending,
    //                 item.status === 'Rejected' && styles.statusRejected
    //             ]}>
    //                 <Text style={styles.statusText}>{item.status}</Text>
    //             </View>
    //         </View>
    //     </View>
    // );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scrollView}>


                <View style={styles.header2}>
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        style={styles.menuButton}
                    >
                        <Icon name="menu" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Talent Dashboard</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MyProfile')}
                        style={styles.profileButton}
                    >
                        <Icon name="account-circle" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome, </Text>
                    <Text style={styles.username}>{firstName} {lastName}</Text>
                    <Text style={styles.subtitle}>Explore new ways of working with compliance and best pay</Text>
                </View>

                {/* InProgress SOW Amt Section */}
                {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>InProgress SOW Amt.</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {progressItems.map((item, index) => (
              <View key={index} style={styles.progressItem}>
                {renderProgressItem({ item })}
              </View>
            ))}
          </ScrollView>
        </View> */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top Organization</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.horizontalScroll}
                    >
                        {lawyers.map((org, index) => (
                            <View key={index} style={styles.orgItem}>
                                {renderOrganization({ item: org })}
                            </View>
                        ))}
                    </ScrollView>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Total Earning</Text>
                    <View style={styles.earningContainer}>
                        {earningCategories.map((category, index) => (
                            <View key={index} style={styles.earningItem}>
                                {renderEarningCategory({ item: category })}
                            </View>
                        ))}
                    </View>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Latest Jobs</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.horizontalScroll}
                    >

                        {jobProfiles.map((job: any) => (
                            <View key={job.id} style={styles.jobItem}>
                                {renderJobItem({ item: job })}
                            </View>
                        ))}

                    </ScrollView>
                </View>

                {/* Applied Jobs Section */}
                {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>You have Applied this Jobs</Text>
          <View style={styles.noDataContainer}>
            <MaterialIcons name="alert-circle-outline" size={40} color="#ccc" />
            <Text style={styles.noDataText}>No data found!</Text>
          </View>
        </View> */}

                {/* Pending Invoices Section */}
                {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Invoices</Text>
          <View style={styles.invoicesContainer}>
            {invoices.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceItem}>
                {renderInvoiceItem({ item: invoice })}
              </View>
            ))}
          </View>
        </View> */}
         <OrganizationProfileModal
        visible={showProfileModal}
        onComplete={() => setShowProfileModal(false)}
        onClose={() => setShowProfileModal(false)}
      />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    menuButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileButton: {
        padding: 5,
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0E3386',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    header2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0E3386',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',

    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
    },
    section: {
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 15,
    },
    horizontalScroll: {
        marginHorizontal: -15,
    },
    progressItem: {
        width: width * 0.7,
        marginRight: 15,
    },
    progressCard: {
        backgroundColor: '#f7f9fc',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        color: '#2d3748',
    },
    progressValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E5BFF',
        marginBottom: 5,
    },
    progressSubtitle: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 10,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        marginRight: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2E5BFF',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#718096',
    },
    statusText: {
        fontSize: 12,
        color: '#718096',
        fontStyle: 'italic',
    },
    orgItem: {
        width: width * 0.7,
        marginRight: 15,
    },
    orgCard: {
        height: height * 0.15,

        marginHorizontal: 10,
        backgroundColor: '#f7f9fc',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    orgName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 5,
    },
    orgCategory: {
        fontSize: 14,
        color: '#718096',
    },
    earningContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    earningItem: {
        width: '48%',
        marginBottom: 15,
    },
    earningCard: {
        backgroundColor: '#f7f9fc',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eaeaea',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    earningTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginTop: 10,
    },
    jobItem: {
        width: width * 0.9,
        marginHorizontal: 15,
    },
    jobCard: {
        height: height * 0.25,

        backgroundColor: '#f7f9fc',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 10,
    },
    jobMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    jobBureau: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    jobCompany: {
        fontSize: 14,
        color: '#2E5BFF',
        fontWeight: '500',
    },
    jobDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    jobExperience: {
        fontSize: 14,
        color: '#718096',
    },
    jobType: {
        fontSize: 14,
        color: '#38a169',
        fontWeight: '500',
    },
    jobPosted: {
        fontSize: 12,
        color: '#a0aec0',
        marginBottom: 10,
    },
    jobDescription: {
        fontSize: 14,
        color: '#4a5568',
        fontStyle: 'italic',
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#f7f9fc',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    noDataText: {
        fontSize: 16,
        color: '#a0aec0',
        marginTop: 10,
    },
    invoicesContainer: {
        marginHorizontal: -15,
    },
    invoiceItem: {
        marginBottom: 15,
    },
    invoiceCard: {
        backgroundColor: '#f7f9fc',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    invoiceDate: {
        fontSize: 14,
        color: '#718096',
    },
    invoiceNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d3748',
    },
    invoiceOrg: {
        fontSize: 14,
        color: '#2d3748',
    },
    invoiceResource: {
        fontSize: 14,
        color: '#718096',
    },
    invoiceAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusApproved: {
        backgroundColor: '#c6f6d5',
    },
    statusPending: {
        backgroundColor: '#fefcbf',
    },
    statusRejected: {
        backgroundColor: '#fed7d7',
    },

});

export default TalentDashboard;