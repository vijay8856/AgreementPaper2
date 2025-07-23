import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SubscriptionHistoryScreen = () => {
    const [paymentData, setPaymentData] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [paymentRes, orderRes] = await Promise.all([
                Services.getPaymentdetails(),
                Services.getOrderdetails(),
            ]);

            if (paymentRes.success) {
                setPaymentData(paymentRes.data);
            } else {
                Toast.show({ type: 'error', text1: 'Failed to load payment details' });
            }

            if (orderRes.success) {
                setOrderData(orderRes.data.results || []);
            } else {
                Toast.show({ type: 'error', text1: 'Failed to load order history' });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

   
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', // "Jul"
            day: 'numeric', // "15"
            year: 'numeric', // "2025"
        }).format(date); // "Jul 15, 2025"
    };
    const formatCurrency = (amount, currency) => {
        const symbols = { AUD: 'A$', USD: '$', EUR: '€' };
        return `${symbols[currency] || currency}${parseFloat(amount).toFixed(2)}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: '#10B981',
            pending: '#F59E0B',
            failed: '#EF4444',
            canceled: '#6B7280'
        };
        return colors[status.toLowerCase()] || '#6B7280';
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0E3386" />
                <Text style={styles.loaderText}>Loading history...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Payment History Card */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Icon name="credit-card" size={24} color="#0E3386" />
                    <Text style={styles.sectionTitle}>Payment History</Text>
                </View>

                {paymentData ? (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Plan:</Text>
                            <Text style={styles.value}>{paymentData.plan_details.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Amount:</Text>
                            <Text style={styles.value}>
                                {formatCurrency(paymentData.amount, paymentData.currency)}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Status:</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(paymentData.payment_status) }]}>
                                <Text style={styles.statusText}>{paymentData.payment_status}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Transaction ID:</Text>
                            <Text style={styles.value}>{paymentData.transaction_id}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Purchased:</Text>
                            <Text style={styles.value}>{formatDate(paymentData.purchase_date)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Expires:</Text>
                            <Text style={styles.value}>{formatDate(paymentData.expire_at)}</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.noData}>No payment history available</Text>
                )}
            </View>

            {/* Order History Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Icon name="history" size={24} color="#0E3386" />
                    <Text style={styles.sectionTitle}>Order History</Text>
                </View>

                {orderData.length > 0 ? (
                    <FlatList
                        data={orderData}
                        keyExtractor={(item) => item.transaction_id}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View style={styles.orderCard}>
                                <View style={styles.orderHeader}>
                                    <Text style={styles.orderId}>Order #{item.transaction_id}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.payment_status) }]}>
                                        <Text style={styles.statusText}>{item.payment_status}</Text>
                                    </View>
                                </View>

                                <View style={styles.orderDetails}>
                                    <View style={styles.orderRow}>
                                        <Text style={styles.orderLabel}>Plan:</Text>
                                        <Text style={styles.orderValue}>{item.plan_details.name}</Text>
                                    </View>

                                    <View style={styles.orderRow}>
                                        <Text style={styles.orderLabel}>Amount:</Text>
                                        <Text style={styles.orderValue}>
                                            {formatCurrency(item.amount, item.currency)}
                                        </Text>
                                    </View>

                                    <View style={styles.orderRow}>
                                        <Text style={styles.orderLabel}>Date:</Text>
                                        <Text style={styles.orderValue}>{formatDate(item.purchase_date)}</Text>
                                    </View>

                                    <View style={styles.orderRow}>
                                        <Text style={styles.orderLabel}>Expires:</Text>
                                        <Text style={styles.orderValue}>{formatDate(item.expire_at)}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noData}>No order history available</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loaderText: {
        marginTop: 16,
        color: '#64748b',
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0E3386',
        marginLeft: 8,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    label: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    statusBadge: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    statusText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    noData: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 16,
        paddingVertical: 16,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    orderDetails: {
        paddingVertical: 4,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    orderValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f172a',
    },
});

export default SubscriptionHistoryScreen;