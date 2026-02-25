import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
} from 'react-native';

const SelectPickerModal = ({
  visible,
  title,
  data = [],
  selectedValue,
  onSelect,
  onClose,
  labelExtractor,
}: any) => {

  const getLabel = (item: any) => {
    if (typeof labelExtractor === 'function') {
      return labelExtractor(item);
    }

    // 🔒 Safe fallback (prevents crashes)
    if (item?.name) return item.name;
    if (item?.label) return item.label;
    if (item?.currency && item?.country_name) {
      return `${item.currency} - ${item.country_name}`;
    }

    return String(item?.id ?? '');
  };

  return (

<Modal
  visible={visible}
  transparent
  animationType="slide"
  presentationStyle="overFullScreen"
  onRequestClose={onClose}
>
  {/* 🔥 Backdrop */}
  <Pressable
    style={styles.overlay}
    onPress={onClose}
  />

  {/* 🔒 Bottom Sheet */}
  <SafeAreaView style={styles.sheet}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.done}>
          {Platform.OS === 'ios' ? 'Done' : 'Close'}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Options */}
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        const selected = selectedValue === item.id;

        return (
          <TouchableOpacity
            style={[styles.item, selected && styles.selected]}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <Text
              style={[
                styles.itemText,
                selected && styles.selectedText,
              ]}
            >
              {getLabel(item)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  </SafeAreaView>
</Modal>

  );
};

export default SelectPickerModal;
const styles = StyleSheet.create({

overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.45)',
},

sheet: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,        // ✅ FULL WIDTH FIX
  backgroundColor: '#FFFFFF',
  maxHeight: '70%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 10,
},

  /* Header */
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  done: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A66C2',
  },

  /* List Item */
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF', // ✅ FIX
  },

  selected: {
    backgroundColor: '#EAF2FF',
  },

  itemText: {
    fontSize: 15,
    color: '#1C1C1E', // ✅ FIX (darker, readable)
  },

  selectedText: {
    fontWeight: '600',
    color: '#0A66C2',
  },
});
