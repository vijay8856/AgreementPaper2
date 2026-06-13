import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  title: string;
  options: Option[];
  onSelect: (item: Option) => void;
  onClose: () => void;
}

const SearchableModal = ({ visible, title, options, onSelect, onClose }: Props) => {
  const [search, setSearch] = useState('');

  const filtered = options.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onSelect(item); onClose(); }}>
                <Text style={styles.item}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SearchableModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: '#000078',
    padding: 12,
    borderRadius: 8,
  },
  doneText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
