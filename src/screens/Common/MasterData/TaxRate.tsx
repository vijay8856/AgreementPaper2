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

interface TaxRateItem {
  id: number;
  slug: string;
  name: string;
  percentage: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/* =======================
 COMPONENT
======================= */

const TaxRate: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [taxRates, setTaxRates] = useState<TaxRateItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    percentage: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
 API CALLS
======================= */

  const loadTaxRates = async () => {
    setLoading(true);
    const res = await Services.getTaxRate();
    if (res.success) setTaxRates(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTaxRates();
  }, []);

  /* =======================
 HANDLERS
======================= */

  const openAdd = () => {
    setEditSlug(null);
    setForm({
      name: '',
      percentage: '',
      is_active: true,
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (item: TaxRateItem) => {
    setEditSlug(item.slug);
    setForm({
      name: item.name,
      percentage: String(item.percentage),
      is_active: item.is_active,
    });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Tax Rate name is required';
    if (!form.percentage.trim()) e.percentage = 'Percentage is required';
    if (isNaN(Number(form.percentage)))
      e.percentage = 'Percentage must be a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      percentage: Number(form.percentage),
      is_active: form.is_active,
    };

    const res = await Services.addTaxRate(editSlug, payload);

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug ? 'Tax Rate updated' : 'Tax Rate added',
      });
      setModalVisible(false);
      loadTaxRates();
    } else {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };

  const disableTaxRate = async () => {
    if (!editSlug) return;

    const res = await Services.addTaxRate(editSlug, { is_active: false });

    if (res.success) {
      Toast.show({ type: 'success', text1: 'Tax Rate disabled' });
      setModalVisible(false);
      loadTaxRates();
    }
  };

  const confirmDisable = () => {
    Alert.alert(
      'Disable Tax Rate',
      'Are you sure you want to disable this tax rate?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disable', style: 'destructive', onPress: disableTaxRate },
      ],
    );
  };

  /* =======================
 CARD
======================= */

  const renderCard = ({ item }: { item: TaxRateItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {item.name} ({item.percentage}%)
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
        <Text style={styles.title}>Tax Rate</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add Tax Rate</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={taxRates}
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
              {editSlug ? 'Edit Tax Rate' : 'Add Tax Rate'}
            </Text>

            {/* Disable */}
            {editSlug && form.is_active && (
              <TouchableOpacity style={styles.disableBtn} onPress={confirmDisable}>
                <Text style={styles.disableText}>Disable Tax Rate</Text>
              </TouchableOpacity>
            )}

            {/* Tax Rate Name */}
            <TextInput
              style={styles.input}
              placeholder="Tax Rate *"
              placeholderTextColor={'black'}
              value={form.name}
              onChangeText={v => setForm({ ...form, name: v })}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            {/* Percentage */}
            <TextInput
              style={styles.input}
              placeholder="Percentage *"
              placeholderTextColor={'black'}

              keyboardType="numeric"
              value={form.percentage}
              onChangeText={v => setForm({ ...form, percentage: v })}
            />
            {errors.percentage && (
              <Text style={styles.error}>{errors.percentage}</Text>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>
                {editSlug ? 'Update Tax Rate' : 'Add Tax Rate'}
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

export default TaxRate;
const styles = StyleSheet.create({
  /* ===== SCREEN ===== */
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },

  addBtn: {
    backgroundColor: '#0A1E8A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },

  addText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* ===== CARD ===== */
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  editText: {
    color: '#0A1E8A',
    fontWeight: '600',
  },

  status: {
    marginTop: 10,
    fontWeight: '600',
  },

  /* ===== MODAL ===== */
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },

  fieldLabel: {
    fontSize: 13,
    marginBottom: 6,
    color: '#2563EB',
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: '#626262ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    color: '#111827',
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },

  /* ===== DROPDOWN ===== */
  dropdown: {
    height: 48,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },

  dropdownList: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  dropdownItemText: {
    fontSize: 14,
    color: '#111827',
  },

  /* ===== BUTTONS ===== */
  saveBtn: {
    backgroundColor: '#0A1E8A',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  cancelBtn: {
     backgroundColor: '#0A1E8A',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  cancelText: {
     color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /* ===== DISABLE ===== */
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