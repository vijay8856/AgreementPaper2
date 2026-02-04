import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Services from '../../Services/services';

interface CountryItem {
  id: number;
  name: string;
  flag: string;
  calling_code: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: CountryItem) => void;
}

const CountryPickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCountries = async () => {
    setLoading(true);

    const res = search
      ? await Services.searchCountry(search)
      : await Services.getCountryList();

    if (res.success) setCountries(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCountries();
  }, [search]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TextInput
            placeholder="Search country"
            style={styles.search}
            value={search}
            onChangeText={setSearch}
          />

          <FlatList
            data={countries}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.code}>+{item.calling_code}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CountryPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  search: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  flag: { fontSize: 22, width: 40 },
  name: { flex: 1, fontSize: 15 },
  code: { fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#0A1E8A',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  closeText: { color: '#fff', textAlign: 'center' },
});
