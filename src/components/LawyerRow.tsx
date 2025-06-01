import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type LawyerRowProps = {
  id: number;
  name: string;
  email: string;
  company_name: string;
  country: string;
  is_active: boolean;
};

const LawyerRow: React.FC<LawyerRowProps> = ({   id,
  name,
  email,
  company_name,
  country,
  is_active, }) => {
  return  (
    <View style={styles.row}>
      <Text style={styles.cell}>{id}</Text>
      <View style={[styles.cell, styles.avatarContainer]}>
        <Image source={require('../assets/images/user.png')} style={styles.avatar} />
        <Text style={styles.cell}>{name}</Text>
      </View>
      <Text style={styles.cell}>{email}</Text>
      <Text style={styles.cell1}>{country}</Text>
      <Text style={[styles.cell2, { color: is_active ? 'green' : 'red' }]}>
        {is_active ? 'Available' : 'Busy'}
      </Text>
      <TouchableOpacity style={styles.button1}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LawyerRow;

const styles = StyleSheet.create({
  row: {

    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  cell: {
    paddingHorizontal:10,
     maxWidth: '100%',
    flex:1,  
    fontSize:10,
  },
  cell1:{
    fontSize:10,
    marginLeft:20,

  },

   cell2:{
    fontSize:10,
    marginLeft:20,

  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  avatar: {
    width: 10,
    height: 10,
    borderRadius: 16,
  },
  button1:{
   marginLeft:20,

    backgroundColor: '#001f8e',
    padding: 3,
    borderRadius: 6,
    marginHorizontal: 1,
  },
  button: {
    marginLeft:14,
    backgroundColor: '#001f8e',
    padding: 3,
    borderRadius: 6,
    marginHorizontal: 1,
  },
  buttonText: {
    fontSize:10,
    color: '#fff',
  },
});
