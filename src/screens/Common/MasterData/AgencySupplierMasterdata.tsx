import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Services from '../../../Services/services';

const AgencySupplierMasterdata = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address_1: '',
    address_2: '',
    city: '',
    country: 'India',
    state: '',
    zip_code: '',
    website: '',
    logo: null
  });
  const [tableData, setTableData] = useState([]);
 const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: false,
        mediaType: 'photo',
      });

      if (image) {
        setImageUri(image.path);
        
        // Create a file object for the form data
        const file = {
          uri: image.path,
          name: image.filename || 'profile_picture.jpg',
          type: image.mime,
        };
        
        setImageFile(file);
        setFormData({
          ...formData,
          logo: file
        });
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };


const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.city || !formData.country || !formData.state || !formData.zip_code) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      // Create FormData object
      const data = new FormData();
      
      // Append all fields to the FormData
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('mobile', formData.mobile);
      data.append('address_1', formData.address_1);
      data.append('address_2', formData.address_2);
      data.append('city', formData.city);
      data.append('country', formData.country);
      data.append('state', formData.state);
      data.append('zip_code', formData.zip_code);
      data.append('website', formData.website);
      
      // Append the image file if available
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      const response = await Services.createMasterData(data);
      console.log('Data created successfully:', response);
      setShowForm(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        address_1: '',
        address_2: '',
        city: '',
        country: 'India',
        state: '',
        zip_code: '',
        website: '',
        logo: null
      });
      setImageUri(null);
      setImageFile(null);
      
      // Refresh the table data
      fetchMasterData();
      
      Alert.alert('Success', 'Master data created successfully');
    } catch (error) {
      console.error('Error creating data:', error);
      Alert.alert('Error', 'Failed to create master data');
    }
  };

  const fetchMasterData = async () => {
    try {
      const response = await Services.getMasterData();
      console.log('successfully:', response);
      setTableData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with search and filters */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Resources"
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text>Select Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text>Select Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <ScrollView horizontal={true} style={styles.tableContainer}>
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
            <Text style={[styles.headerCell, styles.nameCell]}>NAME</Text>
            <Text style={[styles.headerCell, styles.nameCell]}>EMAIL | COMPANY</Text>
            <Text style={[styles.headerCell, styles.locationCell]}>LOCATION</Text>
            <Text style={[styles.headerCell, styles.statusCell]}>STATUS</Text>
            <Text style={[styles.headerCell, styles.connectCell]}>CONNECT</Text>
            <Text style={[styles.headerCell, styles.actionCell]}>ACTION</Text>
          </View>

          {/* Table Rows */}
          {tableData.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cell, styles.idCell]}>{item.id}</Text>
              <Text style={[styles.cell, styles.resourceCell]}>{item.name}</Text>
              <View style={[styles.cell, styles.nameCell]}>
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                {item.company ? <Text>{item.company}</Text> : null}
              </View>
              <Text style={[styles.cell, styles.locationCell]}>{item.city}</Text>
              <View style={[styles.cell, styles.statusCell]}>
                <View style={styles.statusIndicator} />
                <Text> {item.status}</Text>
              </View>
              <TouchableOpacity style={[styles.cell, styles.connectCell]}>
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cell, styles.actionCell]}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Create Master Data Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Master Data</Text>
          
          <ScrollView>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <Text>Upload Profile Picture</Text>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Name*"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email*"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Mobile"
              keyboardType="phone-pad"
              value={formData.mobile}
              onChangeText={(text) => handleInputChange('mobile', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Address 1"
              value={formData.address_1}
              onChangeText={(text) => handleInputChange('address_1', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Address 2"
              value={formData.address_2}
              onChangeText={(text) => handleInputChange('address_2', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="City*"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Country*"
              value={formData.country}
              onChangeText={(text) => handleInputChange('country', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="State*"
              value={formData.state}
              onChangeText={(text) => handleInputChange('state', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="ZIP Code*"
              keyboardType="numeric"
              value={formData.zip_code}
              onChangeText={(text) => handleInputChange('zip_code', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Website"
              keyboardType="url"
              value={formData.website}
              onChangeText={(text) => handleInputChange('website', text)}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.submitButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#0E3386',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    padding: 5,
    justifyContent: 'center',
  },
  idCell: {
    width: 80,
  },
  resourceCell: {
    width: 200,
  },
  nameCell: {
    width: 200,
  },
  locationCell: {
    width: 120,
  },
  statusCell: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectCell: {
    width: 180,
  },
  actionCell: {
    width: 180,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 5,
  },
  connectText: {
    color: '#007bff',
    textAlign: 'center',
  },
  viewProfileText: {
    color: '#007bff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    height: 150,
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#0E3386',
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',

  },
  submitButton: {
    backgroundColor: '#0E3386',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AgencySupplierMasterdata;