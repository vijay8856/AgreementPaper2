import React, { useState } from 'react';
import { View, TextInput, Text,StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import CommonInput from './CommonInput';

const FilterBar: React.FC = () => {
    const [text, setText] = useState('');
  return (
    <View style={styles.container}>
         <View style={styles.inputContainer}>
            <CommonInput
             style={styles.input}
        placeholder="Enter your name"
        value={text}
        onChangeText={setText}
        fontSize={12}
        placeholderTextColor="#888"
      />
      {/* {value.length === 0 && (
        <Text style={styles.placeholder}>Search Organization</Text>
      )}
      <TextInput
        value={value}
        onChangeText={setValue}
        style={styles.input}
      /> */}
    </View>
       <View style={styles.pickerWrapper}>
    <RNPickerSelect
      onValueChange={(value) => {}}
      placeholder={{ label: 'Select Rating', value: null }}
      items={[{ label: '5 Stars', value: '5' }, { label: '4 Stars', value: '4' }]}
      style={pickerSelectStyles}
      useNativeAndroidPickerStyle={false}
    />
  </View>

  <View style={styles.pickerWrapper}>
    <RNPickerSelect
      onValueChange={(value) => {}}
      placeholder={{ label: 'Select Location', value: null }}
      items={[{ label: 'Delhi', value: 'delhi' }, { label: 'Mumbai', value: 'mumbai' }]}
      style={pickerSelectStyles}
      useNativeAndroidPickerStyle={false}
    />
  </View>
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    marginTop:10,
    marginBottom: 5,
    alignItems: 'center',
  },
  pickerWrapper: {
  flex: 1,
},
 inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    left: 5,
    top: 6,
    fontSize: 10, // custom font size
    color: '#888',
  },
 input: {
    width:120,
    
  },
});

const pickerSelectStyles = {
  inputIOS: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    height: 45,
    marginLeft: 6,
  },
  inputAndroid: {
    width:125,

    fontSize: 10, 
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 33,

    borderRadius: 4,
    borderColor: '#ccc',

  },
  placeholder: {
    
    fontSize: 10, 
    color: '#999',
  },
};
