import React, {useEffect, useState} from 'react';
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
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Services from '../../../Services/services';

/* =======================
 TYPES
======================= */
interface SowTypeItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  time_materials: boolean;
  fixed_price_service: boolean;
  recurring_service: boolean;
  is_active: boolean;
  created_at: string;
  is_default: string;
}

/* =======================
 COMPONENT
======================= */
const SowTypeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [list, setList] = useState<SowTypeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    time_materials: null as boolean | null,
    fixed_price_service: null as boolean | null,
    recurring_service: null as boolean | null,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
     API
    ======================= */
  const loadSowTypes = async () => {
    setLoading(true);
    const res = await Services.getSowType();
    if (res.success) setList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSowTypes();
  }, []);

  /* =======================
     HANDLERS
    ======================= */
  const openAdd = () => {
    setEditSlug(null);
    setForm({
      name: '',
      description: '',
      time_materials: null,
      fixed_price_service: null,
      recurring_service: null,
      is_active: true,
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (item: SowTypeItem) => {
    setEditSlug(item.slug);
    setForm({
      name: item.name,
      description: item.description,
      time_materials: item.time_materials,
      fixed_price_service: item.fixed_price_service,
      recurring_service: item.recurring_service,
      is_active: item.is_active,
    });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.time_materials === null) e.time_materials = 'Required';
    if (form.fixed_price_service === null) e.fixed_price_service = 'Required';
    if (form.recurring_service === null) e.recurring_service = 'Required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      time_materials: form.time_materials,
      fixed_price_service: form.fixed_price_service,
      recurring_service: form.recurring_service,
      is_active: form.is_active,
    };

    const res = await Services.addSowType(editSlug, payload);

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug ? 'SOW Type updated' : 'SOW Type added',
      });
      setModalVisible(false);
      loadSowTypes();
    } else {
      Toast.show({type: 'error', text1: 'Failed'});
    }
  };

  const disableSowType = async () => {
    if (!editSlug) return;

    const res = await Services.addSowType(editSlug, {is_active: false});
    if (res.success) {
      Toast.show({type: 'success', text1: 'SOW Type disabled'});
      setModalVisible(false);
      loadSowTypes();
    }
  };

  const confirmDisable = () =>
    Alert.alert('Disable SOW Type', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Disable', style: 'destructive', onPress: disableSowType},
    ]);

  /* =======================
     YES / NO DROPDOWN
    ======================= */
  const YesNoDropdown = ({
    label,
    value,
    onSelect,
  }: {
    label: string;
    value: boolean | null;
    onSelect: (v: boolean) => void;
  }) => {
    const [open, setOpen] = useState(false);

    const display = value === null ? `Select ${label}` : value ? 'Yes' : 'No';

    return (
      <View style={{marginBottom: 16}}>
        <Text style={styles.fieldLabel}>{label} *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setOpen(!open)}>
          <Text style={styles.dropdownText}>{display}</Text>
          <Text>▼</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownList}>
            {[true, false].map(v => (
              <TouchableOpacity
                key={String(v)}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(v);
                  setOpen(false);
                }}>
                <Text style={styles.dropdownItemText}>{v ? 'Yes' : 'No'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  /* =======================
     RENDER
    ======================= */
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SOW Type</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add SOW Type</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={list}
          keyExtractor={i => i.id.toString()}
          renderItem={({item}) => (
            <>
              {/* <View style={styles.card}>
                
              <Text style={styles.cardTitle}>{item.name}</Text>
                {!item.is_active ? null : (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEdit(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              )}
              <Text
                style={[
                  styles.status,
                  {color: item.is_active ? '#2E7D32' : '#D32F2F'},
                ]}>
                {item.is_active ? 'Active' : 'Inactive'}
              </Text>

            
            </View> */}

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.name}</Text>

                  {!item.is_default && (
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => openEdit(item)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text
                  style={[
                    styles.status,
                    {color: item.is_active ? '#2E7D32' : '#D32F2F'},
                  ]}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </>
          )}
        />
      )}

      {/* ================= MODAL ================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
         presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}
        >
        <SafeAreaView edges={['top']} style={{backgroundColor: '#0A1E8A'}} />
        <View style={{flex: 1, paddingTop: insets.top}}>
          <ScrollView contentContainerStyle={{padding: 16}}>
            <Text style={styles.modalTitle}>
              {editSlug ? 'Edit SOW Type' : 'Add SOW Type'}
            </Text>

            {editSlug && form.is_active && (
              <TouchableOpacity
                style={styles.disableBtn}
                onPress={confirmDisable}>
                <Text style={styles.disableText}>Disable SOW Type</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.fieldLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name *"
              placeholderTextColor={'black'}
              value={form.name}
              onChangeText={v => setForm({...form, name: v})}
            />
            <Text style={styles.fieldLabel}>Short Description *</Text>

            <TextInput
              style={[styles.input, {height: 80}]}
              placeholder="Enter Description *"
              placeholderTextColor={'black'}
              multiline
              value={form.description}
              onChangeText={v => setForm({...form, description: v})}
            />

            <YesNoDropdown
              label="Time & Materials"
              value={form.time_materials}
              onSelect={v => setForm({...form, time_materials: v})}
            />

            <YesNoDropdown
              label="Fixed Price Service"
              value={form.fixed_price_service}
              onSelect={v => setForm({...form, fixed_price_service: v})}
            />

            <YesNoDropdown
              label="Recurring Service"
              value={form.recurring_service}
              onSelect={v => setForm({...form, recurring_service: v})}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>
                {editSlug ? 'Update SOW Type' : 'Add SOW Type'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default SowTypeScreen;
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
    borderWidth: 2,
    borderColor: '#2563EB',
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
    shadowOffset: {width: 0, height: 4},
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
