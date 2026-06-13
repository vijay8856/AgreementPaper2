import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Services from '../../../Services/services';

/* =======================
 TYPES
======================= */

interface GLAccount {
    id: number;
    slug: string;
    name: string;
    gl_code: string;
    short_description: string;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

/* =======================
 COMPONENT
======================= */

const GLAccountScreen: React.FC = () => {
    const insets = useSafeAreaInsets();

    const [accounts, setAccounts] = useState<GLAccount[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [editSlug, setEditSlug] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        gl_code: '',
        short_description: '',
        is_active: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* =======================
     API CALLS
    ======================= */

    const loadAccounts = async () => {
        setLoading(true);
        const res = await Services.getGlAccounts();
        if (res.success) setAccounts(res.data);
        setLoading(false);
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    /* =======================
     HANDLERS
    ======================= */

    const openAdd = () => {
        setEditSlug(null);
        setForm({
            name: '',
            gl_code: '',
            short_description: '',
            is_active: true,
        });
        setErrors({});
        setModalVisible(true);
    };

    const openEdit = (item: GLAccount) => {
        setEditSlug(item.slug);
        setForm({
            name: item.name,
            gl_code: item.gl_code,
            short_description: item.short_description,
            is_active: item.is_active,
        });
        setErrors({});
        setModalVisible(true);
    };

    const validate = () => {
        const e: Record<string, string> = {};

        if (!form.name.trim()) e.name = 'GL Account Name is required';
        if (!form.gl_code.trim()) e.gl_code = 'GL Code is required';
        if (!form.short_description.trim())
            e.short_description = 'Short description is required';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            gl_code: form.gl_code.trim(),
            short_description: form.short_description.trim(),
            is_active: form.is_active,
        };

        const res = await Services.addGlAccount(editSlug, payload);

        if (res.success) {
            Toast.show({
                type: 'success',
                text1: editSlug
                    ? 'GL Account updated successfully'
                    : 'GL Account added successfully',
            });

            setModalVisible(false);
            loadAccounts();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Something went wrong',
            });
        }
    };

    /* =======================
     CARD RENDER
    ======================= */

    const renderCard = ({ item }: { item: GLAccount }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                  {!item.is_default && (
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEdit(item)}
                >
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            )}
                {item.is_default && <Text style={styles.defaultTag}>DEFAULT</Text>}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>GL Code</Text>
                <Text style={styles.value}>{item.gl_code}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Created At</Text>
                <Text style={styles.value}>
                    {new Date(item.created_at).toDateString()}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Updated At</Text>
                <Text style={styles.value}>
                    {new Date(item.updated_at).toDateString()}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Status</Text>
                <Text
                    style={[
                        styles.status,
                        { color: item.is_active ? '#2E7D32' : '#D32F2F' },
                    ]}
                >
                    {item.is_active ? 'Active' : 'Inactive'}
                </Text>
            </View>

          
        </View>
    );

    /* =======================
     UI
    ======================= */

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>GL Account</Text>
                <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
                    <Text style={styles.addText}>Add GL Account</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={accounts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderCard}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            {/* ================= MODAL ================= */}
            <Modal visible={modalVisible} animationType="slide" 
              presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView edges={['top']} style={{ backgroundColor: '#0A1E8A' }} />
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        paddingTop: insets.top,   // ✅ THIS IS THE KEY FIX
                    }}
                >
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <Text style={styles.modalTitle}>
                            {editSlug ? 'Edit GL Account' : 'Add GL Account'}
                        </Text>

                        {/* Name */}
                        <View style={styles.field}>
                            <Text style={styles.fieldLabel}>GL Account Name *</Text>
                            <TextInput
                                placeholder='Enter Gl Account Name '
                                placeholderTextColor={"black"}
                                style={styles.input}
                                value={form.name}
                                onChangeText={v => setForm({ ...form, name: v })}
                            />
                            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
                        </View>

                        {/* Code */}
                        <View style={styles.field}>
                            <Text style={styles.fieldLabel}>GL Code *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Enter GL Code'
                                placeholderTextColor={"black"}
                                value={form.gl_code}
                                onChangeText={v => setForm({ ...form, gl_code: v })}
                            />
                            {errors.gl_code && (
                                <Text style={styles.error}>{errors.gl_code}</Text>
                            )}
                        </View>

                        {/* Description */}
                        <View style={styles.field}>
                            <Text style={styles.fieldLabel}>Short Description *</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                placeholder='Enter Short Description'
                                placeholderTextColor={"black"}
                                multiline
                                value={form.short_description}
                                onChangeText={v =>
                                    setForm({ ...form, short_description: v })
                                }
                            />
                            {errors.short_description && (
                                <Text style={styles.error}>{errors.short_description}</Text>
                            )}
                        </View>

                        {/* Save */}
                        <TouchableOpacity style={styles.saveBtn} onPress={submit}>
                            <Text style={styles.saveText}>
                                {editSlug ? 'Update GL Account' : 'Add GL Account'}
                            </Text>
                        </TouchableOpacity>

                        {/* Close */}
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default GLAccountScreen;

/* =======================
 STYLES
======================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F7FB', padding: 16 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: '600' },

    addBtn: {
        backgroundColor: '#0A1E8A',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addText: { color: '#fff', fontWeight: '600' },

    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    cardTitle: { fontSize: 16, fontWeight: '600' },

    defaultTag: {
        backgroundColor: '#EEF1FF',
        color: '#0A1E8A',
        fontSize: 11,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    label: { fontSize: 12, color: '#777' },
    value: { fontSize: 13, color: '#111', fontWeight: '500' },

    status: { fontWeight: '600' },

    editBtn: {
        marginTop: 12,
        backgroundColor: '#EEF1FF',
        paddingVertical: 8,
        borderRadius: 8,
    },
    editText: {
        color: '#0A1E8A',
        textAlign: 'center',
        fontWeight: '600',
    },

    modalContainer: { flex: 1, backgroundColor: '#fff' },
    modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },

    field: { marginBottom: 16 },
    fieldLabel: { fontSize: 13, marginBottom: 6, color: '#444' },

    input: {
        borderWidth: 1,
        borderColor: '#313335ff',
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 48,
        backgroundColor: '#f5eaeaff',
    },

    error: { color: '#D32F2F', fontSize: 12, marginTop: 4 },

    saveBtn: {
        backgroundColor: '#0A1E8A',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },

    cancelBtn: { marginTop: 16, alignItems: 'center' },
    cancelText: { fontSize: 15, color: '#555' },
});
