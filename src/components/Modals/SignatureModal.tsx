import axios from 'axios';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
    TouchableWithoutFeedback,
     Keyboard,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/NavigationManager';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SignWebViewScreen'>;

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SignatureModal = ({ visible, onClose }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [document, setDocument] = useState<any>(null);

  const API_KEY = 'YWNjZXNzOjhlMDI4YTlhODAyMjcwYzU3ZmE0ZjRiZWM4YzRjYjFj';

const pickDocument = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });

    const fileName = res.name || 'temp.pdf';
    const destPath = RNBlobUtil.fs.dirs.DocumentDir + '/' + fileName;

    console.log('Selected file URI:', res.uri);

    // Read file as base64
    const base64Data = await RNBlobUtil.fs.readFile(res.uri, 'base64');

    await RNBlobUtil.fs.writeFile(destPath, base64Data, 'base64');

    const fileUri = 'file://' + destPath;

    setDocument({
      ...res,
      uri: fileUri,
    });

    console.log('Prepared file path for upload:', fileUri);
  } catch (err) {
    console.error('Document selection error:', err);
  }
};
  const handleNext = async () => {
    if (name && email && document) {
      try {
        const result = await createSignWellDocument({ name, email, file: document });
        const signingUrl = result.recipients?.[0]?.embedded_signing_url;
        if (signingUrl) {
          onClose();
          navigation.navigate('SignWebViewScreen', { url: signingUrl });
        } else {
          Alert.alert('Error', 'Signing URL not received.');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to send document for signature.');
      }
    } else {
      Alert.alert('Validation', 'Please fill all fields and upload a PDF.');
    }
  };

 const createSignWellDocument = async ({
  name,
  email,
  file, 
}: {
  name: string;
  email: string;
  file: { uri: string; name: string };
}) => {
  try {
    const base64 = await RNFS.readFile(file.uri, 'base64');

    const body = {
      name: file.name,
      draft: false,
      test_mode: false,
      with_signature_page: true,
      reminders: true,
      apply_signing_order: false,
      allow_decline: true,
      allow_reassign: true,
      custom_requester_name: 'Agreementpaper.com',
      embedded_signing: true,
      embedded_signing_notifications: true,
      text_tags: true,
      subject: 'Please sign this document',
      message: 'Please review and sign this document.',

      recipients: [
    {
      name: name,
      email: email,
      role: "Signer",
      embedded_signing: true,
       id: 14123
    }
  ],
   
      files: [
        {
          name: file.name,
          file_base64: base64,
        },
      ],
      
    };

    const response = await axios.post('https://www.signwell.com/api/v1/documents/', body, {
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log("body",body);

console.log("Document creation response:", response.data);

    return response.data;
  } catch (err: any) {
    console.error('SignWell API Error:', err.response?.data || err.message);
    throw err;
  }
};

  return (
<Modal visible={visible} transparent animationType="slide">
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => null}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Create e-Sign Document</Text>
            <TextInput placeholder="Recipient Name" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="Recipient Email" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Recipient Passcode" style={styles.input} value={passcode} onChangeText={setPasscode} secureTextEntry />
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Text style={styles.uploadText}>{document ? document.name : 'Upload PDF'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signButton} onPress={handleNext}>
              <Text style={styles.signText}>Sign Your Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
  );
};

export default SignatureModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  uploadButton: { padding: 12, borderWidth: 1, borderColor: '#0E3386', borderRadius: 6, marginBottom: 10 },
  uploadText: { color: '#0E3386', textAlign: 'center' },
  signButton: { backgroundColor: '#0E3386', padding: 12, borderRadius: 6 },
  signText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  closeButton: {
  position: 'absolute',
  right: 10,
  top: 10,
  zIndex: 1,
  padding: 4,
},
});
