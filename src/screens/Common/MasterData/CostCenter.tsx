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

interface CostCenterItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  business_unit: number;
  gl_account: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/* =======================
 COMPONENT
======================= */

const CostCenter: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [glAccounts, setGlAccounts] = useState<any[]>([]);
  const [loadingMsa, setLoadingMsa] = useState(false);

  const [costCenter, setCostCenter] = useState<CostCenterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    business_unit: null as number | null,
    gl_account: null as number | null,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
     API CALLS
    ======================= */
  const loadMsaFields = async () => {
    setLoadingMsa(true);
    const res = await Services.getMsaFileds();

    if (res.success) {
      const payload = res.data.payload;
      setBusinessUnits(payload.business_unit || []);
      setGlAccounts(payload.gl_account || []);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to load MSA fields',
      });
    }
    setLoadingMsa(false);
  };

  const loadCostCenter = async () => {
    setLoading(true);
    const res = await Services.getCostCenter();
    console.log('cost centers ', res);

    if (res.success) setCostCenter(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCostCenter();
  }, []);

  /* =======================
     HANDLERS
    ======================= */

  const openAdd = () => {
    setEditSlug(null);
    setForm({
      name: '',
      description: '',
      business_unit: null,
      gl_account: null,
      is_active: true,
    });
    setErrors({});
    loadMsaFields();
    setModalVisible(true);
  };

  const openEdit = (item: CostCenterItem) => {
    setEditSlug(item.slug);
    setForm({
      name: item.name,
      description: item.description,
      business_unit: item.business_unit,
      gl_account: item.gl_account,
      is_active: item.is_active,
    });
    setErrors({});
    loadMsaFields();
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = 'Cost Center Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.business_unit) e.business_unit = 'Business Unit is required';
    if (!form.gl_account) e.gl_account = 'GL Account is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      business_unit: form.business_unit,
      gl_account: form.gl_account,
      is_active: form.is_active,
    };
    console.log('slug', editSlug);
    console.log('payload', payload);

    const res = await Services.addCostCenter(editSlug, payload);

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug
          ? 'Cost Center updated successfully'
          : 'Cost Center added successfully',
      });

      setModalVisible(false);
      loadCostCenter();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Something went wrong',
      });
    }
  };
  const disableCostCenter = async () => {
    if (!editSlug) return;

    const res = await Services.addCostCenter(editSlug, {
      is_active: false,
    });

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: 'Cost Center disabled successfully',
      });

      setModalVisible(false);
      loadCostCenter();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to disable Cost Center',
      });
    }
  };

  const confirmDisable = () => {
    Alert.alert(
      'Disable Cost Center',
      'Are you sure you want to disable this cost center?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Disable',
          style: 'destructive',
          onPress: disableCostCenter,
        },
      ],
    );
  };
  /* =======================
    DROPDOWN RENDER
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

    const selectedLabel =
      data.find(item => item.id === value)?.name || `Select ${label}`;

    return (
      <View style={{marginBottom: 16}}>
        <Text style={styles.fieldLabel}>{label} *</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setOpen(!open)}>
          <Text style={styles.dropdownText}>{selectedLabel}</Text>
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
                }}>
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  /* =======================
     CARD RENDER
    ======================= */

  const renderCard = ({item}: {item: CostCenterItem}) => (
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
        {item.is_default && <Text style={styles.defaultTag}>DEFAULT</Text>}
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
            {color: item.is_active ? '#2E7D32' : '#D32F2F'},
          ]}>
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
        <Text style={styles.title}>Cost Center</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add Cost Center </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={costCenter}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{paddingBottom: 20}}
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
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: insets.top, // ✅ THIS IS THE KEY FIX
          }}>
          <ScrollView contentContainerStyle={{padding: 16}}>
            <Text style={styles.modalTitle}>
              {editSlug ? 'Edit Cost Center' : 'Add Cost Center '}
            </Text>
            {/* Disable – only when editing AND currently active */}
            {editSlug && form.is_active && (
              <TouchableOpacity
                style={styles.disableBtn}
                onPress={confirmDisable}>
                <Text style={styles.disableText}>Disable Cost Center</Text>
              </TouchableOpacity>
            )}

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Cost Center Name *</Text>
              <TextInput
                placeholder="Enter Cost Center Name "
                placeholderTextColor={'black'}
                style={styles.input}
                value={form.name}
                onChangeText={v => setForm({...form, name: v})}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>

            {loadingMsa ? (
              <ActivityIndicator />
            ) : (
              <>
                <Dropdown
                  label="Business Unit"
                  value={form.business_unit}
                  data={businessUnits}
                  onSelect={id => setForm({...form, business_unit: id})}
                />

                <Dropdown
                  label="GL Account"
                  value={form.gl_account}
                  data={glAccounts}
                  onSelect={id => setForm({...form, gl_account: id})}
                />
              </>
            )}

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Short Description *</Text>
              <TextInput
                style={[styles.input, {height: 80}]}
                placeholder="Enter Description"
                placeholderTextColor="black"
                multiline
                value={form.description}
                onChangeText={v => setForm({...form, description: v})}
              />
              {errors.description && (
                <Text style={styles.error}>{errors.description}</Text>
              )}

              {errors.short_description && (
                <Text style={styles.error}>{errors.short_description}</Text>
              )}
            </View>

            {/* Save */}
            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>
                {editSlug ? 'Update Cost Center' : 'Add Cost Center'}
              </Text>
            </TouchableOpacity>

            {/* Close */}
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

export default CostCenter;

/* =======================
 STYLES
======================= */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F6F7FB', padding: 16},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {fontSize: 20, fontWeight: '600'},

  addBtn: {
    backgroundColor: '#0A1E8A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addText: {color: '#fff', fontWeight: '600'},

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  cardTitle: {fontSize: 16, fontWeight: '600'},

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
  label: {fontSize: 12, color: '#777'},
  value: {fontSize: 13, color: '#111', fontWeight: '500'},

  status: {fontWeight: '600'},

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

  modalContainer: {flex: 1, backgroundColor: '#fff'},
  modalTitle: {fontSize: 18, fontWeight: '600', marginBottom: 16},

  field: {marginBottom: 16},
  fieldLabel: {fontSize: 13, marginBottom: 6, color: '#444'},

  input: {
    borderWidth: 1,
    borderColor: '#313335ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#f5eaeaff',
  },

  error: {color: '#D32F2F', fontSize: 12, marginTop: 4},

  saveBtn: {
    backgroundColor: '#0A1E8A',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveText: {color: '#fff', fontSize: 16, fontWeight: '600'},

  cancelBtn: {marginTop: 16, alignItems: 'center'},
  cancelText: {fontSize: 15, color: '#555'},
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#000000ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownOpen: {
    borderColor: '#2563EB', // 🔵 blue focus
    backgroundColor: '#14358aff',
  },

  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },

  placeholderText: {
    color: '#9CA3AF',
  },

  dropdownArrow: {
    fontSize: 12,
    color: '#374151',
  },

  dropdownList: {
    marginTop: 6,
    backgroundColor: '#0A1E8A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f6f8fcff',
    overflow: 'hidden',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    color: '#ffffffff',
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  dropdownItemText: {
    fontSize: 14,
    color: '#ffffffff',
  },

  dropdownItemActive: {
    backgroundColor: '#F0F6FF',
  },
  disableBtn: {
    marginTop: 12,
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
