
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Checkbox = ({ value, onValueChange, label = 'I agree to the Terms & Conditions' }:any) => {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      }}
    >
      <Icon
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={value ? '#000078' : '#aaa'}
      />
      <Text style={{ marginLeft: 10 }}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;