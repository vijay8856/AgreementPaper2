import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
  Pressable,
  useColorScheme,
  Alert,
} from 'react-native';
import Services from '../../../Services/services';

type TaxGroup = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
};

const TaxGroupScreen = () => {
  const isDark = useColorScheme() === 'dark';

  /* ---------------- THEME ---------------- */
  const COLORS = {
    bg: isDark ? '#000000' : '#F9FAFB',
    card: isDark ? '#111827' : '#FFFFFF',
    border: isDark ? '#374151' : '#292b2eff',
    text: isDark ? '#F9FAFB' : '#111827',
    placeholder: isDark ? '#9CA3AF' : '#9AA0A6',
    primary: '#0E3386',
    danger: '#DC2626',
  };

  /* ---------------- STATE ---------------- */
  const [taxGroups, setTaxGroups] = useState<TaxGroup[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    total_choice: '1', // 1 = Add, 2 = Subtract
  });
  useEffect(() => {
    fetchTaxGroups();
  }, []);

  const fetchTaxGroups = async () => {
    const res = await Services.getTaxGroups();

    if (res.success) {
      setTaxGroups(res.data);
    } else {
      Alert.alert('Error', 'Unable to load tax groups');
    }
  };
  /* ---------------- HANDLERS ---------------- */
  const handleChange = (key: string, value: string) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const openModal = () => {
    setForm({name: '', description: '', total_choice: '1'});
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      total_choice: form.total_choice, // 1 or 2
    };
    console.log('pay', payload);

    const res = await Services.submitTaxGroup(null, payload);

    console.log('submit tax group', res);

    if (res.success) {
      setModalVisible(false);
      fetchTaxGroups(); // 🔥 refresh list
    } else {
      Alert.alert('Error', 'Failed to add tax group');
    }
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({item}: {item: TaxGroup}) => (
    <View
      style={[
        styles.card,
        {backgroundColor: COLORS.card, borderColor: COLORS.border},
      ]}>
      <Text style={[styles.name, {color: COLORS.text}]}>{item.name}</Text>
      <Text style={{color: COLORS.placeholder}}>{item.description}</Text>
      <Text
        style={{
          marginTop: 6,
          color: item.is_active ? 'green' : COLORS.danger,
        }}>
        {item.is_active ? 'Active' : 'Disabled'}
      </Text>
    </View>
  );

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: COLORS.text}]}>
          Tax Groups
        </Text>
        <TouchableOpacity
          style={[styles.addBtn, {backgroundColor: COLORS.primary}]}
          onPress={openModal}>
          <Text style={styles.addBtnText}>Add Tax Group</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={taxGroups}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{padding: 16}}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={{
              color: COLORS.placeholder,
              textAlign: 'center',
              marginTop: 40,
            }}>
            No Tax Groups Found
          </Text>
        }
      />

      {/* ---------------- MODAL ---------------- */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: COLORS.text}]}>
              Add Tax Group
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{color: COLORS.primary}}>Close</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{padding: 16}}>
            {/* Name */}
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: COLORS.card,
                  borderColor: COLORS.border,
                  color: COLORS.text,
                },
              ]}
              placeholder="Tax Group Name *"
              placeholderTextColor={COLORS.placeholder}
              value={form.name}
              onChangeText={t => handleChange('name', t)}
            />

            {/* Description */}
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: COLORS.card,
                  borderColor: COLORS.border,
                  color: COLORS.text,
                },
              ]}
              placeholder="Short Description *"
              placeholderTextColor={COLORS.placeholder}
              value={form.description}
              onChangeText={t => handleChange('description', t)}
            />

            {/* Radio Buttons */}
            <View style={styles.radioRow}>
              <Pressable
                style={styles.radioItem}
                onPress={() => handleChange('total_choice', '1')}>
                <View
                  style={[
                    styles.radioCircle,
                    form.total_choice === '1' && styles.radioActive,
                  ]}
                />
                <Text style={{color: COLORS.text}}>Add in Total</Text>
              </Pressable>

              <Pressable
                style={styles.radioItem}
                onPress={() => handleChange('total_choice', '2')}>
                <View
                  style={[
                    styles.radioCircle,
                    form.total_choice === '2' && styles.radioActive,
                  ]}
                />
                <Text style={{color: COLORS.text}}>Subtract from Total</Text>
              </Pressable>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, {backgroundColor: COLORS.primary}]}
              onPress={handleSubmit}>
              <Text style={styles.submitText}>Save Tax Group</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 8,

    // Android shadow
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  radioRow: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0E3386',
    marginRight: 8,
  },
  radioActive: {
    backgroundColor: '#0E3386',
  },
  submitBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaxGroupScreen;
