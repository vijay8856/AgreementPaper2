import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const AIReviewScreen = () => {
  const [contractType, setContractType] = useState('');
  const [businessLine, setBusinessLine] = useState('');
  const [country, setCountry] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<string | null>(null);

  const contractTypes = [
    "NON-DISCLOSURE AGREEMENTS",
    "CONFIDENTIALITY AGREEMENT",
    "CONSULTING AGREEMENT",
    // ... other contract types
  ];

  const businessLines = [
    "REAL ESTATE",
    "PROCUREMENT",
    "SALES",
    // ... other business lines
  ];

  const countries = [
    "United States",
    "India",
    "United Kingdom",
    // ... other countries
  ];

  const openPicker = (pickerType: 'contractType' | 'businessLine' | 'country') => {
    setCurrentPicker(pickerType);
    setPickerVisible(true);
  };

  const handleSelect = (value: string) => {
    switch (currentPicker) {
      case 'contractType': setContractType(value); break;
      case 'businessLine': setBusinessLine(value); break;
      case 'country': setCountry(value); break;
    }
    setPickerVisible(false);
  };

  const QuestionItem = ({ label, value, onPress }: { 
    label: string; 
    value: string; 
    onPress: () => void 
  }) => (
    <TouchableOpacity style={styles.questionItem} onPress={onPress}>
      <Text style={styles.questionText}>{label}</Text>
      <View style={styles.questionValue}>
        <Text style={styles.valueText}>{value || 'Select...'}</Text>
        <Icon name="arrow-drop-down" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#0E3386', '#1A3B8B']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerTitle}>Upload Contract</Text>
          <Text style={styles.headerSubtitle}>
            Please upload contract to review its (PDF) format
          </Text>
           <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {}} // Add actual upload logic
          >
            <Icon name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Questions Section */}
        <View style={styles.card}>
          <QuestionItem
            label="1. What type of contract is it?"
            value={contractType}
            onPress={() => openPicker('contractType')}
          />

          <QuestionItem
            label="2. Line of business?"
            value={businessLine}
            onPress={() => openPicker('businessLine')}
          />

          <QuestionItem
            label="3. Select your country?"
            value={country}
            onPress={() => openPicker('country')}
          />

          <View style={styles.addButtonQues}>
            <Text style={styles.sectionTitle}>Selected Questions</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Questions</Text>
            </TouchableOpacity>
          </View>

         
        </View>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Note* - AI - AIRES can make mistakes. Check important info with your legal team as well.
            This doesn't replace legal services and advice provided is only for guidance
          </Text>
        </View>
      </ScrollView>

      {/* Custom Picker Modal */}
      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.pickerModal}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>
              {currentPicker === 'contractType' && 'Contract Type'}
              {currentPicker === 'businessLine' && 'Business Line'}
              {currentPicker === 'country' && 'Select Country'}
            </Text>

            <Picker
              selectedValue={
                currentPicker === 'contractType' ? contractType :
                currentPicker === 'businessLine' ? businessLine : country
              }
              onValueChange={handleSelect}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              {currentPicker === 'contractType' && 
                contractTypes.map((type, index) => (
                  <Picker.Item label={type} value={type} key={index} />
                ))
              }
              {currentPicker === 'businessLine' && 
                businessLines.map((line, index) => (
                  <Picker.Item label={line} value={line} key={index} />
                ))
              }
              {currentPicker === 'country' && 
                countries.map((country, index) => (
                  <Picker.Item label={country} value={country} key={index} />
                ))
              }
            </Picker>

            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.pickerCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 18,

  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C41E3A',
  },
  questionItem: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  questionValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#666',
  },
  addButtonQues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A5BDA',
  },
  addButton: {
    backgroundColor: '#0E3386',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#000078',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  
  noteText: {
    fontSize: 12,
    color: '#C41E3A',
    lineHeight: 18,
  },
  pickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  picker: {
    height: 180,
  },
  pickerCloseButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AIReviewScreen;