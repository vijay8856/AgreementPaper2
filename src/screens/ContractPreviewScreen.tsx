

import React, { useState } from 'react';
import {
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationManager';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
type ContractPreviewScreenRouteProp = RouteProp<RootStackParamList, 'ContractPreviewScreen'>;

type Props = {
  route: ContractPreviewScreenRouteProp;
};

const ContractPreviewScreen = ({ route }: Props) => {
  const { htmlContent } = route.params;
  const [blocks, setBlocks] = useState<Block[]>(htmlContent);
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateBlock = (index: number, text: string) => {
    const updated = [...blocks];
    updated[index].content = text;
    setBlocks(updated);
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter template name!' });
      return;
    }

    let reconstructedHtml = '';
    blocks.forEach(block => {
      switch (block.type) {
        case 'h1': reconstructedHtml += `<h1>${block.content}</h1>\n`; break;
        case 'h2': reconstructedHtml += `<h2>${block.content}</h2>\n`; break;
        case 'h3': reconstructedHtml += `<h3>${block.content}</h3>\n`; break;
        case 'h4': reconstructedHtml += `<h4>${block.content}</h4>\n`; break;
        case 'h5': reconstructedHtml += `<h5>${block.content}</h5>\n`; break;
        case 'h6': reconstructedHtml += `<h6>${block.content}</h6>\n`; break;
        case 'p':  reconstructedHtml += `<p>${block.content}</p>\n`;  break;
        case 'li': reconstructedHtml += `<li>${block.content}</li>\n`; break;
        case 'signature': reconstructedHtml += `<p class="signature">${block.content}</p>\n`; break;
      }
    });

    const payload = {
      template_name: templateName,
      content: reconstructedHtml,
    };

    setLoading(true);

    try {
      const response = await Services.saveDraftTemplate(payload);

      if (response.success) {
        Toast.show({ type: 'success', text1: 'Template saved successfully!' });

        const templateId = response.data?.data?.id;
        if (templateId) {
          await fetchPdfUrl(templateId);
          await fetchDocxUrl(templateId);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to save template',
          text2: response.error || 'Please try again',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Unexpected error occurred',
      });
      console.error('handleSave error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPdfUrl = async (templateId: number) => {
    try {
      const response = await Services.getTemplatePDF(templateId); 
      const url = response?.template_pdf;

      if (url) {
        setPdfUrl(url);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to generate PDF.',
        });
      }
    } catch (err) {
      console.error('fetchPdfUrl error:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch PDF.',
      });
    }
  };

  const fetchDocxUrl = async (templateId: number) => {
    try {
      const response = await Services.getTemplateDocx(templateId); 
      const url = response?.docx_file_url; 
console.log("response12",response);

      if (url) {
        setDocxUrl(url);
        setIsModalVisible(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to generate DOCX.',
        });
      }
    } catch (err) {
      console.error('fetchDocxUrl error:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch DOCX.',
      });
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      Linking.openURL(pdfUrl).catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Could not open PDF link',
        });
      });
    }
  };

  const handleDownloadDocx = () => {
    if (docxUrl) {
      Linking.openURL(docxUrl).catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Could not open DOCX link',
        });
      });
    }
  };

  const renderBlock = (block: Block, index: number) => {
    const style = styles[block.type] || styles.p;

    return (
      <TextInput
        key={`block-${index}`}
        multiline
        style={style}
        value={block.content}
        onChangeText={(text) => updateBlock(index, text)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Template Name:"
          placeholderTextColor="#888"
          style={styles.input}
          value={templateName}
          onChangeText={setTemplateName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {blocks.map((block, index) => renderBlock(block, index))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Template Saved!</Text>
            <Text style={styles.modalSubtitle}>Your documents are ready to download.</Text>

            <TouchableOpacity 
              onPress={handleDownloadPdf} 
              style={[styles.downloadButton, !pdfUrl && styles.disabledButton]}
              disabled={!pdfUrl}
            >
              <Text style={styles.downloadText}>
                {pdfUrl ? 'Download PDF' : 'Preparing PDF...'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDownloadDocx} 
              style={[styles.downloadButton1, !docxUrl && styles.disabledButton]}
              disabled={!docxUrl}
            >
              <Text style={styles.downloadText}>
                {docxUrl ? 'Download DOCX' : 'Preparing DOCX...'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeModal}>Close</Text>
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
    padding: 16,
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
    textAlign: 'center',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#555',
  },
  h4: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#666',
  },
  h5: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 6,
    color: '#777',
  },
  h6: {
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 4,
    color: '#888',
  },
  p: {
    fontSize: 16,
    marginVertical: 8,
    lineHeight: 24,
    color: '#333',
  },
  li: {
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 20,
    lineHeight: 24,
    color: '#333',
  },
  signature: {
    fontSize: 16,
    marginVertical: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    fontStyle: 'italic',
    color: '#555',
  },
   modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#10b981',
    padding: 15,
    paddingVertical:14,
    borderRadius: 8,
    marginBottom: 10,
  },
  downloadButton1:{
    backgroundColor: '#10b981',
    padding: 11,
    borderRadius: 8,
    paddingVertical:13,

    marginBottom: 10,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeModal: {
    color: '#333',
    marginTop: 10,
  },
   disabledButton: {
    opacity: 0.6,
  },
   closeButton: {
    marginTop: 15,
  },
});

export default ContractPreviewScreen;
