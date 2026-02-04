import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Services from '../Services/services';
import { CreateDocumentProps, RootStackParamList, UserData } from '../navigation/types';

type CreateDocumentNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const CreateDocument: React.FC<CreateDocumentProps> = (props) => {
  const navigation = useNavigation<CreateDocumentNavigationProp>();
  const {
    setSignwellRes,
    setUrl,
    setRequestingRedirectUrl,
    fileName,
    recipientName,
    recipientEmail,
    passcode,
    setFileName,
    setRecipientName,
    setRecipientEmail,
    setPasscode,
    isDocumentOpen,
    setIsDocumentOpen,
    handleClear,
    documentResponse,
    loading,
    setDocumentResponse,
    setLoading,
    id,
    error,
    setError,
  } = props;

  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileUri, setFileUri] = useState<string>('');

  const handleFileUpload = async (): Promise<void> => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const file = Array.isArray(res) ? res[0] : res;

      if (!file.uri) {
        setError('Unable to get file path');
        return;
      }

      setFileName(file.name || 'Document.pdf');
      setFileUri(file.uri);

      // Convert file to base64
      const filePath = Platform.OS === 'android' ? file.uri.replace('file://', '') : file.uri;
      const base64Data = await RNFS.readFile(filePath, 'base64');

      setFileBase64(base64Data);
      console.log('File selected and converted to base64', base64Data);
      console.log('File selected and converted to filePath', filePath);


    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker Error:', err);
        setError('Failed to pick document');
      }
    }
  };

  const handleCreateDocument = async (): Promise<void> => {


    setLoading(true);
    setError(null);

    const documentData = {



      test_mode: false,
      draft: true,
      with_signature_page: true,
      reminders: true,
      apply_signing_order: false,
      embedded_signing: true,
      embedded_signing_notifications: true,
      text_tags: true,
      allow_decline: true,
      allow_reassign: true,
      name: fileName,
      subject: "Please sign this document",
      message: "Please review and sign this document.",
      custom_requester_name: "Agreementpaper.com",
      files: [
        {
          name: fileName,
          file_base64: fileBase64,
        },
      ],

      recipients: [
        {
          email: recipientEmail,
          id: id,
          message: 'Please review and sign this document.',
          name: recipientName,
          passcode: passcode,
          send_email: true,
          send_email_delay: 0,
          subject: 'Please sign this document',
        },
      ],

    };

    try {
      const response = await Services.createSignWellDocument(documentData);
      console.log("response,response", response);

      if (response.recipients[0].embedded_signing_url) {
        setRequestingRedirectUrl(response.recipients[0].embedded_signing_url);
        // setRequestingRedirectUrl(response.embedded_edit_url);

        setUrl(response.embedded_edit_url);
        // setUrl(response.recipients[0].embedded_signing_url );

      }
      setLoading(false);
      setDocumentResponse(response);
      // setSignwellRes(true);
      setSignwellRes(response);
      setIsDocumentOpen(false);
    } catch (error) {
      handleClear();
      setError(error.message);
    }
  };

  return (
    <Modal
      visible={isDocumentOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setIsDocumentOpen(false);
        handleClear();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create e-Sign Document</Text>
            <TouchableOpacity
              onPress={() => {
                setIsDocumentOpen(false);
                handleClear();
              }}
            >
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recipient Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient Name"
                value={recipientName}
                onChangeText={setRecipientName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recipient Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient Email"
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recipient Passcode *</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient Passcode"
                value={passcode}
                onChangeText={setPasscode}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Files *</Text>
              <TouchableOpacity
                style={styles.fileUploadButton}
                onPress={handleFileUpload}
              >
                <Text style={styles.fileUploadText}>📎 Upload Files</Text>
              </TouchableOpacity>
              {fileName ? (
                <View style={styles.fileNameContainer}>
                  <Text style={styles.fileName}>{fileName}</Text>
                  <TouchableOpacity onPress={() => {
                    setFileName('');
                    setFileBase64('');
                    setFileUri('');
                  }}>
                    <Text style={styles.removeFile}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {error ? (
              <Text style={styles.errorText}>Error: {error}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.createButton, (loading || !fileBase64 || !recipientName || !recipientEmail) && styles.disabledButton]}
              onPress={handleCreateDocument}
              disabled={loading || !fileBase64 || !recipientName || !recipientEmail}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Creating Document...' : 'Sign Your Document'}
              </Text>
            </TouchableOpacity>

            {documentResponse ? (
              <Text style={styles.successText}>Document created successfully</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  modalBody: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  fileUploadButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  fileUploadText: {
    color: '#007bff',
    fontSize: 16,
  },
  fileNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  fileName: {
    color: '#28a745',
    flex: 1,
  },
  removeFile: {
    color: '#dc3545',
    marginLeft: 10,
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    marginTop: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#28a745',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CreateDocument;