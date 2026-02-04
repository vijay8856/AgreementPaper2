import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Dropdown = ({
  label,
  value,
  items = [],
  onChange,
  labelKey,
  valueKey,
  disabled = false,
}: any) => {
  const [visible, setVisible] = useState(false);

  /* ================= ANDROID ================= */
  if (Platform.OS === 'android') {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>

        <View style={[styles.pickerBox, disabled && styles.disabled]}>
          <Picker
            enabled={!disabled}
            selectedValue={value}
            onValueChange={onChange}
             style={styles.picker}
          >
            <Picker.Item label="Select..." value="" 
            
            color='black'/>
            {items.map((item: any, idx: number) => (
              <Picker.Item
                key={idx}
                label={item[labelKey]}
                value={item[valueKey]}

                  color="#e5e5e5ff"
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  /* ================= IOS ================= */
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.inputBox, disabled && styles.disabled]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {items.find((i: any) => i[valueKey] === value)?.[labelKey] ||
            'Select...'}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>

            <FlatList
              data={items}
              keyExtractor={(_, i) => i.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item[valueKey]);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {item[labelKey]}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  field: { marginBottom: 18 },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d6dbe3ff',
    marginBottom: 8,
  },
picker:{
color:'black'
},
  pickerBox: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },

  inputBox: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },

  valueText: {
    fontSize: 16,
    color: '#1E293B',
  },

  placeholder: {
    color: '#171717ff',
  },

  disabled: {
    opacity: 0.5,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    padding: 20,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E293B',
  },

  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  optionText: {
    fontSize: 16,
    color: '#1E293B',
  },
});
