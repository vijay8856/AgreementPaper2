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
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Services from '../../../Services/services';

/* =======================
 TYPES
======================= */

interface BusinessUnit {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
}
interface OrgUser {
  id: number;
  full_name: string;
  email?: string;
}
interface BusinessUnitForm {
  name: string;
  short_description: string;
  user_id: number | null;
  is_active: boolean;
}
type BusinessUnitPayload = {
  name: string;
  short_description: string;
  is_active: boolean;
  user_id?: number;
};

/* =======================
 COMPONENT
======================= */
type ModalView = 'FORM' | 'USER';

const BusinessUnitScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [users, setUsers] = useState<OrgUser[]>([]);

  const [activeView, setActiveView] = useState<ModalView>('FORM');

  const [form, setForm] = useState<BusinessUnitForm>({
    name: '',
    short_description: '',
    user_id: null,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
     API CALLS
    ======================= */
  const loadUsers = async () => {
    const res = await Services.getOrganisationDashboardUser();
    if (res.success) {
      setUsers(res.data?.results || []);
    }
  };

  const loadUnits = async () => {
    setLoading(true);
    const res = await Services.getBusineUnit();
    if (res.success) setUnits(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUnits();
    loadUsers();
  }, []);

  /* =======================
     HANDLERS
    ======================= */

  const openAdd = () => {
    setEditSlug(null);
    setForm({
      name: '',
      short_description: '',
      user_id: null,
      is_active: true,
    });
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (item: BusinessUnit) => {
    setEditSlug(item.slug);
    setForm({
      name: item.name,
      short_description: item.short_description,
      user_id: item.user_id,
      is_active: item.is_active,
    });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = 'Business Unit name is required';
    if (!form.short_description.trim())
      e.short_description = 'Short description is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload: BusinessUnitPayload = {
      name: form.name.trim(),
      short_description: form.short_description.trim(),
      is_active: form.is_active,
    };

    if (form.user_id) {
      payload.user_id = form.user_id;
    }

    const res = await Services.addBusinessUnit(editSlug, payload);

    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug
          ? 'Business Unit updated successfully'
          : 'Business Unit added successfully',
      });

      setModalVisible(false);
      loadUnits();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Something went wrong',
      });
    }
  };

  /* =======================
     CARD
    ======================= */

  const renderCard = ({item}: {item: BusinessUnit}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
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

      {!item.is_default && (
        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /* =======================
     UI
    ======================= */
  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.title}>Business Unit</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add Business Unit</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={units}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}

      {/* ================= SINGLE MODAL ================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView edges={['top']} style={{backgroundColor: '#0A1E8A'}} />

        <View style={[styles.modalContainer, {paddingTop: insets.top}]}>
          {/* ========== FORM VIEW ========== */}
          {activeView === 'FORM' && (
            <ScrollView contentContainerStyle={{padding: 16}}>
              <Text style={styles.modalTitle}>
                {editSlug ? 'Edit Business Unit' : 'Add Business Unit'}
              </Text>

              {/* Name */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Name"
                  placeholderTextColor={'black'}
                  value={form.name}
                  onChangeText={v => setForm({...form, name: v})}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}
              </View>

              {/* Description */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Short Description *</Text>
                <TextInput
                  style={[styles.input, {height: 80, paddingTop: 30}]}
                  placeholder="Enter Short Description"
                  placeholderTextColor={'black'}
                  multiline
                  value={form.short_description}
                  onChangeText={v => setForm({...form, short_description: v})}
                />
                {errors.short_description && (
                  <Text style={styles.error}>{errors.short_description}</Text>
                )}
              </View>

              {/* User (Optional) */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>User (Optional)</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setActiveView('USER')}>
                  <Text
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 13,
                    }}>
                    {users.find(u => u.id === form.user_id)?.full_name ||
                      'Select User'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Save */}
              <TouchableOpacity style={styles.saveBtn} onPress={submit}>
                <Text style={styles.saveText}>
                  {editSlug ? 'Update Business Unit' : 'Add Business Unit'}
                </Text>
              </TouchableOpacity>

              {/* Close */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ========== USER VIEW ========== */}
          {activeView === 'USER' && (
            <>
              <TouchableOpacity onPress={() => setActiveView('FORM')}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              <View style={styles.userHeader}>
                <Text style={styles.modalTitle}>Select User</Text>
              </View>

              {users.length === 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  No users found
                </Text>
              ) : (
                <FlatList
                  data={users}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm(prev => ({
                          ...prev,
                          user_id: item.id,
                        }));
                        setActiveView('FORM');
                      }}>
                      <Text style={{fontWeight: '600'}}>{item.full_name}</Text>
                      {item.email && (
                        <Text style={{fontSize: 12, color: '#666'}}>
                          {item.email}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default BusinessUnitScreen;

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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },

  backText: {
    fontSize: 16,
    color: '#0A1E8A',
    fontWeight: '600',
  },

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
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },

  input: {
    borderWidth: 1,
    borderColor: '#232425ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#fff',
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
});
