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

interface UnpscItem {
  id: number;
  slug: string;
  name: string;
  business_unit: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/* =======================
 COMPONENT
======================= */

const UnpscCode: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [unpscList, setUnpscList] = useState<UnpscItem[]>([]);
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsa, setLoadingMsa] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    business_unit: null as number | null,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
 API CALLS
======================= */

  const loadUnpsc = async () => {
    setLoading(true);
    const res = await Services.getUnpscCode();
    if (res.success) setUnpscList(res.data);
    setLoading(false);
  };

  const loadBusinessUnits = async () => {
    setLoadingMsa(true);
    const res = await Services.getMsaFileds();
    if (res.success) {
      setBusinessUnits(res.data.payload.business_unit || []);
    }
    setLoadingMsa(false);
  };

  useEffect(() => {
    loadUnpsc();
  }, []);

  /* =======================
 HANDLERS
======================= */

  const openAdd = () => {
    setEditSlug(null);
    setForm({
      name: '',
      business_unit: null,
      is_active: true,
    });
    setErrors({});
    loadBusinessUnits();
    setModalVisible(true);
  };

  const openEdit = (item: UnpscItem) => {
    setEditSlug(item.slug);
    setForm({
      name: item.name,
      business_unit: item.business_unit,
      is_active: item.is_active,
    });
    setErrors({});
    loadBusinessUnits();
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'UNSPSC Code Name is required';
    if (!form.business_unit) e.business_unit = 'Business Unit is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      business_unit: form.business_unit,
      is_active: form.is_active,
    };

    const res = await Services.addUnpscCode(editSlug, payload);

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug ? 'UNSPSC updated' : 'UNSPSC added',
      });
      setModalVisible(false);
      loadUnpsc();
    } else {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };

  const disableUnpsc = async () => {
    if (!editSlug) return;

    const res = await Services.addUnpscCode(editSlug, { is_active: false });

    if (res.success) {
      Toast.show({ type: 'success', text1: 'UNSPSC disabled' });
      setModalVisible(false);
      loadUnpsc();
    }
  };

  const confirmDisable = () => {
    Alert.alert(
      'Disable UNSPSC Code',
      'Are you sure you want to disable this UNSPSC code?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disable', style: 'destructive', onPress: disableUnpsc },
      ],
    );
  };

  /* =======================
 DROPDOWN
======================= */

  const Dropdown = ({
    label,
    value,
    data,
    onSelect,
  }: {
    label: string;
    value: number | null;
    data: any[];
    onSelect: (id: number) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const selected =
      data.find(i => i.id === value)?.name || `Select ${label}`;

    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.fieldLabel}>{label} *</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setOpen(!open)}
        >
          <Text style={styles.dropdownText}>{selected}</Text>
          <Text>▼</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownList}>
            {data.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item.id);
                  setOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  /* =======================
 CARD
======================= */

  const renderCard = ({ item }: { item: UnpscItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        {!item.is_default && (
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.status, { color: item.is_active ? '#2E7D32' : '#D32F2F' }]}>
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
        <Text style={styles.title}>UNSPSC Code</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add UNSPSC Code</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={unpscList}
          keyExtractor={i => i.id.toString()}
          renderItem={renderCard}
        />
      )}

      {/* ===== MODAL ===== */}
      {/* <Modal visible={modalVisible} animationType="slide"  presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}>
            <View style={{ height: 6, backgroundColor: '#ff0000ff' }} />
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0A1E8A' }} />
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.modalTitle}>
              {editSlug ? 'Edit UNSPSC Code' : 'Add UNSPSC Code'}
            </Text>

            {editSlug && form.is_active && (
              <TouchableOpacity style={styles.disableBtn} onPress={confirmDisable}>
                <Text style={styles.disableText}>Disable UNSPSC Code</Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.input}
              placeholder="UNSPSC Code Name *"
              value={form.name}
              onChangeText={v => setForm({ ...form, name: v })}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            {loadingMsa ? (
              <ActivityIndicator />
            ) : (
              <Dropdown
                label="Business Unit"
                value={form.business_unit}
                data={businessUnits}
                onSelect={id => setForm({ ...form, business_unit: id })}
              />
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>
                {editSlug ? 'Update UNSPSC Code' : 'Add UNSPSC Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal> */}
     <Modal
  visible={modalVisible}
  animationType="slide"
  presentationStyle="pageSheet"
  onDismiss={() => setModalVisible(false)}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={{ flex: 1, backgroundColor: 'transparent' }}>
    {/* ROUNDED CLIP CONTAINER */}
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden', // 🔑 MOST IMPORTANT
      }}
    >
      {/* TOP BORDER STRIP (ROUNDED TOO) */}
      <View
        style={{
          height: 8,
          backgroundColor: '#2F6BFF', // your blue
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      />

      {/* OPTIONAL DRAG INDICATOR */}
      <View
        style={{
          width: 40,
          height: 4,
          backgroundColor: '#ccc',
          borderRadius: 2,
          alignSelf: 'center',
          marginVertical: 8,
        }}
      />

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.modalTitle}>
          {editSlug ? 'Edit UNSPSC Code' : 'Add UNSPSC Code'}
        </Text>
          {editSlug && form.is_active && (
            <TouchableOpacity style={styles.disableBtn} onPress={confirmDisable}>
              <Text style={styles.disableText}>Disable UNSPSC Code</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder="UNSPSC Code Name *"
            value={form.name}
            onChangeText={v => setForm({ ...form, name: v })}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          {loadingMsa ? (
            <ActivityIndicator />
          ) : (
            <Dropdown
              label="Business Unit"
              value={form.business_unit}
              data={businessUnits}
              onSelect={id => setForm({ ...form, business_unit: id })}
            />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={submit}>
            <Text style={styles.saveText}>
              {editSlug ? 'Update UNSPSC Code' : 'Add UNSPSC Code'}
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
  </View>
</Modal>

    </View>
  );
};

export default UnpscCode;
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
    borderColor: '#757575ff',
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
