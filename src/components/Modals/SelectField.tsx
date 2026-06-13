import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value?: string;
  placeholder: string;
  error?: boolean;
  onPress: () => void;
};

export default function SelectField({
  label,
  value,
  placeholder,
  error,
  onPress,
}: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.field, error && styles.error]}
        onPress={onPress}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  field: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  value: {
    color: '#111827',
  },
  error: {
    borderColor: 'red',
  },
});
