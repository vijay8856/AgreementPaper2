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
import Services from '../../../Services/services';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

/* =======================
 TYPES
======================= */

interface CompanyLocation {
  id: number;
  slug: string;
  work_location: string;
  registration_no: string;

  tax_group: {id: number; name: string} | null;

  country: string; // used in form submit
  country_name: string; // used for display

  state: string; // used in form submit
  state_name: string; // used for display

  city: string;
  zip_code: string;
  street_address: string;
  contact_number: string;

  currency: number; // pk id
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DropdownItem {
  id: number;
  name: string;
}
interface CurrencyItem {
  id: number;
  currency: string; // "USD", "INR"
  country_name: string; // "United States", "India"
}

/* =======================
 COMPONENT
======================= */

const CompanyLocationScreen: React.FC = () => {
  const [locations, setLocations] = useState<CompanyLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [states, setStates] = useState<DropdownItem[]>([]);
  const [taxGroups, setTaxGroups] = useState<DropdownItem[]>([]);

  const [countryModal, setCountryModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [taxModal, setTaxModal] = useState(false);

  const [searchCountry, setSearchCountry] = useState('');

  const [activeView, setActiveView] = useState<ModalView>('FORM');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [currencySearch, setCurrencySearch] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyItem[]>(
    [],
  );
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    work_location: '',
    registration_no: '',
    tax_group: null as number | null,
    country: '',
    state: '',
    city: '',
    zip_code: '',
    street_address: '',
    contact_number: '',
    currency: null as number | null,
    is_active: true,
  });

  type ModalView = 'FORM' | 'COUNTRY' | 'STATE' | 'TAX' | 'CURRENCY';

  console.log('cureec', currencies);

  const openAdd = () => {
    setEditSlug(null);
    setActiveView('FORM');
    setModalVisible(true);
  };

  const openCountry = () => setActiveView('COUNTRY');
  const openState = () => setActiveView('STATE');
  const openTax = () => setActiveView('TAX');

  const closeModal = () => {
    setModalVisible(false);
    setActiveView('FORM');
  };

  /* =======================
     API CALLS
    ======================= */

  const loadLocations = async () => {
    setLoading(true);
    const res = await Services.getCompanyLocation();
    if (res.success) setLocations(res.data);
    setLoading(false);
  };

  const loadTaxGroups = async () => {
    const res = await Services.getTaxGroups();
    if (res.success) setTaxGroups(res.data);
  };

  const loadCountries = async (search = '') => {
    const res = search
      ? await Services.searchCountry(search)
      : await Services.getCountryList();

    if (res.success) setCountries(res.data);
  };

  const loadStates = async (country: string) => {
    const res = await Services.getCountryDetailsState(country);
    console.log('uuu', res);

    if (res.success) setStates(res.data);
  };

  const loadCurrencies = async () => {
    const res = await Services.getCurrency();
    if (res.success) {
      const list = res.data.results || res.data;
      setCurrencies(list);
      setFilteredCurrencies(list);
    }
  };

  const onCurrencySearch = (text: string) => {
    setCurrencySearch(text);

    if (!text.trim()) {
      setFilteredCurrencies(currencies);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = currencies.filter(
      item =>
        item.currency?.toLowerCase().includes(lower) ||
        item.country_name?.toLowerCase().includes(lower),
    );

    setFilteredCurrencies(filtered);
  };

  const openCurrency = () => {
    setCurrencySearch('');
    setFilteredCurrencies(currencies);
    setActiveView('CURRENCY');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const e: Record<string, string> = {};
    if (!form.work_location.trim()) {
      newErrors.work_location = 'Company location is required';
    }

    if (!form.registration_no.trim()) {
      newErrors.registration_no = 'Registration number is required';
    }

    if (!form.tax_group) {
      newErrors.tax_group = 'Tax group is required';
    }

    if (!form.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!form.zip_code.trim()) {
      newErrors.zip_code = 'Zip code is required';
    }

    if (!form.street_address.trim()) {
      newErrors.street_address = 'Street address is required';
    }

    if (!form.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (form.contact_number.length < 6) {
      newErrors.contact_number = 'Enter valid contact number';
    }

    if (!form.currency) {
      e.currency = 'Currency is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================
     EFFECTS
    ======================= */

  useEffect(() => {
    loadLocations();
    loadTaxGroups();
    loadCountries();
    loadCurrencies();
  }, []);

  useEffect(() => {
    loadCountries(searchCountry);
  }, [searchCountry]);

  /* =======================
     HANDLERS
    ======================= */

  const resetForm = () => {
    setForm({
      work_location: '',
      registration_no: '',
      tax_group: null,
      country: '',
      state: '',
      city: '',
      zip_code: '',
      street_address: '',
      contact_number: '',
      currency: null,
      is_active: true,
    });
  };

  const openEdit = (item: CompanyLocation) => {
    setEditSlug(item.slug);

    setForm({
      work_location: item.work_location || '',
      registration_no: item.registration_no || '',
      tax_group: item.tax_group?.id ?? null,
      country: item.country || '',
      state: item.state || '',
      city: item.city || '',
      zip_code: item.zip_code || '',
      street_address: item.street_address || '',
      contact_number: item.contact_number || '',
      currency: form.currency,
      is_active: item.is_active ?? true,
    });

    loadStates(item.country);
    setActiveView('FORM'); // important for single-modal flow
    setModalVisible(true);
  };

  const submit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    if (saving) return;
    setSaving(true);
    const payload = {
      work_location: form.work_location.trim(),
      registration_no: form.registration_no.trim(),
      tax_group: form.tax_group,
      country: form.country.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
      zip_code: form.zip_code.trim(),
      street_address: form.street_address.trim(),
      contact_number: form.contact_number.trim(),
      currency: form.currency, // pk id
      is_active: form.is_active,
    };

    const res = await Services.submitCompanyLocation(editSlug, payload);
    setSaving(false);
    if (res.success) {
      Toast.show({
        type: 'success',
        text1: editSlug ? 'Company location updated' : 'Company location added',
        text2: 'Saved successfully',
      });

      resetForm();
      setErrors({});
      setModalVisible(false);
      loadLocations();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to save',
        text2: 'Please try again',
      });
    }
  };

  /* =======================
     CARD
    ======================= */

  const renderCard = ({item}: {item: CompanyLocation}) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.work_location}</Text>
        {/* Action */}
        {!item.is_default && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => openEdit(item)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
        {item.is_default && <Text style={styles.defaultTag}>DEFAULT</Text>}
      </View>

      {/* ID */}
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{item.id}</Text>
      </View>

      {/* Company Location */}
      <View style={styles.row}>
        <Text style={styles.label}>Company Location</Text>
        <Text style={styles.value}>{item.work_location}</Text>
      </View>

      {/* Created At */}
      <View style={styles.row}>
        <Text style={styles.label}>Created At</Text>
        <Text style={styles.value}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Updated At */}
      <View style={styles.row}>
        <Text style={styles.label}>Updated At</Text>
        <Text style={styles.value}>
          {item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : '-'}
        </Text>
      </View>

      {/* Status */}
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

  const ErrorText = ({message}: {message?: string}) => {
    if (!message) return null;
    return <Text style={styles.errorText}>{message}</Text>;
  };
  /* =======================
     UI
    ======================= */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Company Location</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>Add </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalSafe} edges={['top']} />
        {/* ---------- FORM ---------- */}
        {activeView === 'FORM' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: 16}}>
            <Text style={styles.addTextForm}>Add Company Location</Text>

            {/* Company Location */}
            <Text style={{paddingLeft: 10, fontWeight: '600'}}>
              Company Location
            </Text>
            <TextInput
              style={[styles.input, errors.work_location && styles.inputError]}
              placeholder="Enter Company Location"
              placeholderTextColor={'black'}
              value={form.work_location}
              onChangeText={v => {
                setForm({...form, work_location: v});
                setErrors(p => ({...p, work_location: ''}));
              }}
            />
            <ErrorText message={errors.work_location} />

            {/* Registration No */}
            <TextInput
              style={[
                styles.input,
                errors.registration_no && styles.inputError,
              ]}
              placeholder="Registration No"
              placeholderTextColor={'black'}
              maxLength={21}
              value={form.registration_no}
              onChangeText={v => {
                setForm({...form, registration_no: v});
                setErrors(p => ({...p, registration_no: ''}));
              }}
            />
            <ErrorText message={errors.registration_no} />

            {/* Tax Group */}
            <TouchableOpacity
              style={[styles.input, errors.tax_group && styles.inputError]}
              onPress={openTax}>
              <Text>
                {taxGroups.find(t => t.id === form.tax_group)?.name ||
                  'Select Tax Group'}
              </Text>
            </TouchableOpacity>
            <ErrorText message={errors.tax_group} />

            {/* Country */}
            <TouchableOpacity
              style={[styles.input, errors.country && styles.inputError]}
              onPress={openCountry}>
              <Text>{form.country || 'Select Country'}</Text>
            </TouchableOpacity>
            <ErrorText message={errors.country} />

            {/* State */}
            <TouchableOpacity
              style={[styles.input, errors.state && styles.inputError]}
              onPress={openState}
              disabled={!form.country}>
              <Text>{form.state || 'Select State'}</Text>
            </TouchableOpacity>
            <ErrorText message={errors.state} />

            {/* City */}
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="City"
              placeholderTextColor={'black'}
              value={form.city}
              onChangeText={v => {
                setForm({...form, city: v});
                setErrors(p => ({...p, city: ''}));
              }}
            />
            <ErrorText message={errors.city} />

            {/* Zip Code */}
            <TextInput
              style={[styles.input, errors.zip_code && styles.inputError]}
              placeholder="Zip Code"
              placeholderTextColor={'black'}
              maxLength={10}
              keyboardType="number-pad"
              value={form.zip_code}
              onChangeText={v => {
                setForm({...form, zip_code: v});
                setErrors(p => ({...p, zip_code: ''}));
              }}
            />
            <ErrorText message={errors.zip_code} />

            {/* Street Address */}
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.street_address && styles.inputError,
              ]}
              placeholder="Street Address"
              placeholderTextColor={'black'}
              multiline
              value={form.street_address}
              onChangeText={v => {
                setForm({...form, street_address: v});
                setErrors(p => ({...p, street_address: ''}));
              }}
            />
            <ErrorText message={errors.street_address} />

            {/* Contact Number */}
            <TextInput
              style={[styles.input, errors.contact_number && styles.inputError]}
              placeholder="Contact Number"
              placeholderTextColor={'black'}
              maxLength={10}
              keyboardType="phone-pad"
              value={form.contact_number}
              onChangeText={v => {
                setForm({...form, contact_number: v});
                setErrors(p => ({...p, contact_number: ''}));
              }}
            />
            <ErrorText message={errors.contact_number} />

            {/* Currency */}
            <TouchableOpacity
              style={[styles.input, errors.currency && styles.inputError]}
              onPress={openCurrency}>
              <Text>
                {form.currency
                  ? currencies.find(c => c.id === form.currency)?.currency
                  : 'Select Currency'}
              </Text>
            </TouchableOpacity>

            <ErrorText message={errors.currency} />

            {/* Save */}
            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ---------- COUNTRY ---------- */}
        {activeView === 'COUNTRY' && (
          <>
            <Text style={styles.modalTitle}>Select Country</Text>

            <TextInput
              placeholder="Search country"
              style={styles.search}
              placeholderTextColor={'black'}
              onChangeText={setSearchCountry}
            />

            <FlatList
              data={countries}
              keyExtractor={i => i.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({...form, country: item.name, state: ''});
                    loadStates(item.name);
                    setActiveView('FORM');
                  }}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* ---------- STATE ---------- */}
        {activeView === 'STATE' && (
          <>
            <Text style={styles.modalTitle}>Select State</Text>

            <FlatList
              data={states}
              keyExtractor={(i, idx) => idx.toString()}
              renderItem={({item}: any) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({...form, state: item.name});
                    setActiveView('FORM');
                  }}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* ---------- TAX GROUP ---------- */}
        {activeView === 'TAX' && (
          <>
            <Text style={styles.modalTitle}>Select Tax Group</Text>

            <FlatList
              data={taxGroups}
              keyExtractor={i => i.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({...form, tax_group: item.id});
                    setActiveView('FORM');
                  }}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* ---------- CURRENCY ---------- */}
        {activeView === 'CURRENCY' && (
          <>
            <Text style={styles.modalTitle}>Select Currency</Text>

            {/* Search */}
            <TextInput
              style={styles.search}
              placeholder="Search currency"
              value={currencySearch}
              onChangeText={onCurrencySearch}
            />

            {/* List */}
            <FlatList
              data={filteredCurrencies}
              keyExtractor={item => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm(prev => ({
                      ...prev,
                      currency: item?.id,
                    }));
                    setErrors(prev => ({...prev, currency: ''}));
                    setCurrencySearch('');
                    setFilteredCurrencies(currencies);
                    setActiveView('FORM');
                  }}>
                  <Text>
                    {item.currency} – {item.country_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </Modal>
    </View>
  );
};

export default CompanyLocationScreen;

/* =======================
 STYLES
======================= */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F6F7FB', padding: 16},
  modalSafe: {flex: 1, backgroundColor: '#0A1E8A'},

  header: {flexDirection: 'row', justifyContent: 'space-between'},
  title: {fontSize: 20, fontWeight: '600'},
  addBtn: {
    backgroundColor: '#0A1E8A',
    padding: 10,
    borderRadius: 6,
  },
  addText: {color: '#fff'},
  addTextForm: {
    color: '#151313ff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  card: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 8,

    // Android shadow
    elevation: 10,
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  cardTitle: {fontSize: 16, fontWeight: '600'},
  defaultTag: {color: '#0A1E8A', fontWeight: '600'},
  cardText: {marginTop: 4, color: '#555'},
  editBtn: {
    marginTop: 10,
    backgroundColor: '#EEF1FF',
    padding: 8,
    borderRadius: 6,
  },
  editText: {color: '#0A1E8A', textAlign: 'center'},

  modal: {padding: 16},
  modalTitle: {fontSize: 18, fontWeight: '600', marginBottom: 12},
  input: {
    borderWidth: 1,
    borderColor: '#0f0d0dff',
    borderRadius: 30,
    padding: 12,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: '#0A1E8A',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  saveText: {color: '#fff', textAlign: 'center'},

  cancelBtn: {
    padding: 14,
    alignItems: 'center',
  },

  dropdown: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 10,
    maxHeight: '80%',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  search: {
    borderWidth: 1,
    borderColor: '#121111ff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: '#0A1E8A',
  },

  activeText: {
    fontSize: 14,
  },
  inputError: {
    borderColor: '#D32F2F',
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  label: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },

  value: {
    fontSize: 13,
    color: '#111',
    fontWeight: '500',
  },

  status: {
    fontSize: 13,
    fontWeight: '600',
  },
});
