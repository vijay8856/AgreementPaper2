import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
} from 'react-native';

type Props = {
  label: string;
  values: any[];
  items: any[];
  labelKey: string;
  valueKey: string;
  onChange: (values: any[]) => void;
};

const MultiSelectDropdown = ({
  label,
  values = [],
  items = [],
  labelKey,
  valueKey,
  onChange,
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item =>
      String(item[labelKey]).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const toggleSelect = (item: any) => {
    const id = item[valueKey];

    if (values.includes(id)) {
      onChange(values.filter(v => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const selectedItems = items.filter(item =>
    values.includes(item[valueKey])
  );

  return (
    <>
      {/* INPUT */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        {selectedItems.length === 0 ? (
          <Text style={styles.placeholder}>Select {label}</Text>
        ) : (
          <View style={styles.chipsContainer}>
            {selectedItems.map(item => (
              <View key={item[valueKey]} style={styles.chip}>
                <Text style={styles.chipText}>{item[labelKey]}</Text>
                <TouchableOpacity
                  onPress={() => toggleSelect(item)}
                >
                  <Text style={styles.remove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)} />

        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{label}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.done}>Done</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search..."
            placeholderTextColor={'black'}
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          <FlatList
            data={filteredItems}
            keyExtractor={item => String(item[valueKey])}
            renderItem={({ item }) => {
              const selected = values.includes(item[valueKey]);
              return (
                <TouchableOpacity
                  style={[
                    styles.item,
                    selected && styles.selectedItem,
                  ]}
                  onPress={() => toggleSelect(item)}
                >
                  <Text style={styles.itemText}>
                    {item[labelKey]}
                  </Text>
                  {selected && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default MultiSelectDropdown;
const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  placeholder: {
    color: '#9CA3AF',
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5EDFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 4,
  },

  chipText: {
    color: '#1E40AF',
    fontSize: 13,
    marginRight: 6,
  },

  remove: {
    color: '#1E40AF',
    fontWeight: 'bold',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    maxHeight: '70%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  done: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },

  search: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    margin: 12,
    paddingHorizontal: 12,
  },

  item: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  selectedItem: {
    backgroundColor: '#EEF2FF',
  },

  itemText: {
    fontSize: 15,
  },

  check: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});
