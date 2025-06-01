import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
} from 'react-native';

interface CommonInputProps extends TextInputProps {
  fontSize?: number;
  placeholderTextColor?: string;
  style?: StyleProp<TextStyle>;
}

const CommonInput: React.FC<CommonInputProps> = ({
  placeholder,
  value,
  onChangeText,
  fontSize = 10,
  placeholderTextColor = '#999',
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { fontSize }, style]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height:33,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    color: '#000',
  },
});

export default CommonInput;
