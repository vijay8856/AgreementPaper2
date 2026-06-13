

import React from 'react';
import { TextInput, StyleSheet, TextInputProps, useColorScheme } from 'react-native';

const AppTextInput = ({ style, ...props }: TextInputProps) => {
  const theme = useColorScheme();

  const isDark = theme === 'dark';

  return (
    <TextInput
      {...props}
      keyboardAppearance={isDark ? 'dark' : 'light'}
      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
      style={[
        styles.input,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          color: isDark ? '#111010ff' : '#111827',
          borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        style,
      ]}
    />
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
});
