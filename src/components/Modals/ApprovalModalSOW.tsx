import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Pressable,
    SafeAreaView,
} from 'react-native';
import Services from '../../Services/services';

const ApprovalModalSOW = ({
    visible,
    onClose,
    onSelectApprover,
    selectedApprover,
}: any) => {
    const [approvers, setApprovers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchApprovers = async () => {
        //   setLoading(true);

        try {
            const payload = { limit: 10, msa: 'sow' };
            const response = await Services.getApproverCoustom(payload);

            // 🔑 ensure JSON
            if (response?.success && Array.isArray(response.data)) {
                setApprovers(response.data);
            } else {
                setApprovers([]);
            }

        } catch (error) {
            console.error('SOW Approver error:', error);
            setApprovers([]);   // 🔑 prevents stuck modal
        } finally {
            // setLoading(false);
        }
    };


    useEffect(() => {
        if (visible) {
            fetchApprovers();
        }
    }, [visible]);

    const renderItem = ({ item }: any) => {
        const isSelected = selectedApprover?.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    isSelected && styles.selectedItem,
                ]}
                onPress={() => {
                    onSelectApprover(item);
                    onClose();
                }}
            >
                <Text style={styles.name}>
                    {`${item?.first_name ?? ''} ${item?.last_name ?? ''}`}
                </Text>
                <Text style={styles.email}>{item.email}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.overlay}>
                {/* Backdrop */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                {/* Modal */}
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select SOW Approver</Text>
                        <Pressable hitSlop={10} onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </Pressable>
                    </View>

                    {loading ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : (
                        <FlatList
                            data={approvers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            keyboardShouldPersistTaps="handled"
                            removeClippedSubviews={false}
                        />
                    )}
                </View>

                <TouchableOpacity onPress={onClose}>
                    <Text style={{ color: '#007AFF', textAlign: 'center', padding: 16 }}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Modal>
    );
};

export default ApprovalModalSOW;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '75%',
        paddingBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    close: {
        fontSize: 20,
        color: '#444',
    },
    loader: {
        paddingVertical: 30,
    },
    item: {
        padding: 16,
    },
    selectedItem: {
        backgroundColor: '#EAF2FF',
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
    },
    email: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
});
