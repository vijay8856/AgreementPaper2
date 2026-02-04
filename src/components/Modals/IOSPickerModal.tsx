import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';

const IOSPickerModal = ({
  visible,
  title,
  data = [],
  selectedValue,
  onSelect,
  onClose,
  labelExtractor = (item: any) => item.name,
  searchKeys = [],
}: any) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return data;

    const keyword = search.toLowerCase();
    return data.filter((item: any) =>
      searchKeys.some((key: string) =>
        String(item[key] || '').toLowerCase().includes(keyword)
      )
    );
  }, [search, data]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      {/* ✅ BACKDROP */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* ✅ BOTTOM SHEET */}
      <SafeAreaView style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.done}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        {searchKeys.length > 0 && (
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
        )}

        {/* LIST */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const selected = selectedValue?.id === item.id;

            return (
              <TouchableOpacity
                style={[styles.item, selected && styles.selected]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.itemText}>
                  {labelExtractor(item)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {filteredData.length === 0 && (
          <Text style={styles.noData}>No results found</Text>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default IOSPickerModal;



const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,          // ✅ FULL WIDTH FIX
    backgroundColor: '#fff',
    maxHeight: '70%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  done: {
    color: '#007AFF',
    fontSize: 16,
  },

  searchBox: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  searchInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    fontSize: 14,
  },

  item: {
    padding: 16,
  },

  selected: {
    backgroundColor: '#EAF2FF',
  },

  itemText: {
    fontSize: 15,
  },

  noData: {
    textAlign: 'center',
    padding: 16,
    color: '#888',
  },
});

