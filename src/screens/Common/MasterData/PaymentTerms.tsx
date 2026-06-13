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
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Services from '../../../Services/services';

/* =======================
 TYPES
======================= */

interface PaymentTermItem {
  id: number;
  slug: string;
  name: string;
  code: string;
  description: string;
  percentage_absolute: number;
  due_days: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
percentage:string

}

/* =======================
 COMPONENT
======================= */

const PaymentTerms: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [terms, setTerms] = useState<PaymentTermItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    percentage_absolute: '',
    due_days: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
 API CALLS
======================= */

  const loadTerms = async () => {
    setLoading(true);
    const res = await Services.getPayementTerms();
    if (res.success) setTerms(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTerms();
  }, []);

  /* =======================
 HANDLERS
======================= */

  const openAdd = () => {
    setEditSlug(null);
    setForm({
      name: '',
      code: '',
      description: '',
      percentage_absolute: '',
      due_days: '',
      is_active: true,
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (item: PaymentTermItem) => {
    setEditSlug(item.slug);
    setForm({
      name: item.name,
      code: item.code,
      description: item.description,
      percentage_absolute: String(item.percentage_absolute),
      due_days: String(item.due_days),
      is_active: item.is_active,
    });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = 'Payment Terms Name is required';
    if (!form.code.trim()) e.code = 'Payment Terms Code is required';
    if (!form.description.trim()) e.description = 'Description is required';

    if (!form.percentage_absolute.trim())
      e.percentage_absolute = 'Percentage is required';
    else if (isNaN(Number(form.percentage_absolute)))
      e.percentage_absolute = 'Must be a number';

    if (!form.due_days.trim())
      e.due_days = 'Due days is required';
    else if (isNaN(Number(form.due_days)))
      e.due_days = 'Must be a number';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim(),
      percentage_absolute: Number(form.percentage_absolute),
      due_days: Number(form.due_days),
      is_active: form.is_active,
    };

    const res = await Services.addPaymentTerms(editSlug, payload);

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug
          ? 'Payment Terms updated'
          : 'Payment Terms added',
      });
      setModalVisible(false);
      loadTerms();
    } else {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };

  const disableTerm = async () => {
    if (!editSlug) return;

    const res = await Services.addPaymentTerms(editSlug, { is_active: false });

    if (res.success) {
      Toast.show({ type: 'success', text1: 'Payment Terms disabled' });
      setModalVisible(false);
      loadTerms();
    }
  };

  const confirmDisable = () => {
    Alert.alert(
      'Disable Payment Terms',
      'Are you sure you want to disable this payment term?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disable', style: 'destructive', onPress: disableTerm },
      ],
    );
  };

  /* =======================
 CARD
======================= */

  const renderCard = ({ item }: { item: PaymentTermItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {item.name} ({item.code})
        </Text>

        {!item.is_default && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => openEdit(item)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.desc}>{item.description}</Text>

<Text style={styles.desc}>
        {item.percentage}% • Due in {item.due_days} days
      </Text>
      <Text style={styles.desc}>
       Percentage : {item.percentage}
      </Text>
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
      <Text
        style={[
          styles.status,
          { color: item.is_active ? '#2E7D32' : '#D32F2F' },
        ]}
      >
        {item.is_active ? 'Active' : 'Inactive'}
      </Text>
    </View>
  );

  /* =======================
 UI
======================= */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Terms</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add Payment Terms</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={terms}
          keyExtractor={i => i.id.toString()}
          renderItem={renderCard}
        />
      )}

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} animationType="slide"  presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0A1E8A' }} />
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.modalTitle}>
              {editSlug ? 'Edit Payment Terms' : 'Add Payment Terms'}
            </Text>

            {editSlug && form.is_active && (
              <TouchableOpacity style={styles.disableBtn} onPress={confirmDisable}>
                <Text style={styles.disableText}>Disable Payment Terms</Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.input}
              placeholder="Payment Terms Name *"
              placeholderTextColor={'black'}
              value={form.name}
              onChangeText={v => setForm({ ...form, name: v })}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Payment Terms Code *"
              placeholderTextColor={'black'}

              value={form.code}
              onChangeText={v => setForm({ ...form, code: v })}
            />
            {errors.code && <Text style={styles.error}>{errors.code}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Short Description *"
              placeholderTextColor={'black'}

              value={form.description}
              onChangeText={v => setForm({ ...form, description: v })}
            />
            {errors.description && (
              <Text style={styles.error}>{errors.description}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Percentage of Absolute *"
              placeholderTextColor={'black'}

              keyboardType="numeric"
              value={form.percentage_absolute}
              onChangeText={v =>
                setForm({ ...form, percentage_absolute: v })
              }
            />
            {errors.percentage_absolute && (
              <Text style={styles.error}>{errors.percentage_absolute}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Due days (Number of days) *"
              placeholderTextColor={'black'}

              keyboardType="numeric"
              value={form.due_days}
              onChangeText={v => setForm({ ...form, due_days: v })}
            />
            {errors.due_days && (
              <Text style={styles.error}>{errors.due_days}</Text>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>
                {editSlug ? 'Update Payment Terms' : 'Add Payment Terms'}
              </Text>
            </TouchableOpacity>

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

export default PaymentTerms;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: 16,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },

  addBtn: {
    backgroundColor: '#0A1E8A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  /* ===== Card ===== */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  editBtn: {
    backgroundColor: '#EEF1FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  editText: {
    color: '#0A1E8A',
    fontWeight: '600',
    fontSize: 13,
  },

  desc: {
    marginTop: 6,
    fontSize: 13,
    color: '#374151',
  },

  status: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ===== Modal ===== */
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },

  field: {
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 13,
    marginBottom: 6,
    color: '#444',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#464646ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#111827',
    marginBottom: 14,
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 2,
  },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    label: { fontSize: 12, color: '#777' },
    value: { fontSize: 13, color: '#111', fontWeight: '500' },
  /* ===== Buttons ===== */
  saveBtn: {
    backgroundColor: '#0A1E8A',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  cancelBtn: {
      backgroundColor: '#0A1E8A',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  cancelText: {
   color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  /* ===== Disable Button ===== */
  disableBtn: {
    marginBottom: 16,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#DC2626',
  },

  disableText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
