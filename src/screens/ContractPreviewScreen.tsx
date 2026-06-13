// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/NavigationManager';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import RenderHTML from 'react-native-render-html';
type ContractPreviewScreenRouteProp = RouteProp<
  RootStackParamList,
  'ContractPreviewScreen'
>;

type Props = {
  route: ContractPreviewScreenRouteProp;
};

GoogleSignin.configure({
  webClientId:
    '601221483061-eadrdpe1opnslp4sug89v8mpugebj68f.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive.file',
  ],
});
const formatBlocksToHtml = (blocks: any[]) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return '<div><p>No content</p></div>';
  }

  const style = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 10px; color: #111; }
      h1,h2,h3 { margin: 18px 0 8px; font-weight: 700; color: #0E3386; }
      h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
      h3 { font-size: 18px; }
      p { margin: 8px 0; font-size: 15px; line-height: 22px; color:#222; }
      ul { margin: 8px 0 12px 18px; }
      li { margin-bottom: 6px; font-size: 15px; line-height: 22px; }
      hr { border: none; border-bottom: 1px solid #e6e6e6; margin: 18px 0; }
      .signature-row { display:flex; gap:20px; margin-top:18px; }
      .signature-item { flex:1; min-width:140px; }
      .signature-box { border-top:1px solid #333; height: 18px; margin-top: 8px; width:100%; }
      .signature-label { font-weight:600; margin-bottom:6px; }
      .signature-large { margin-top:10px; font-weight:700; }
      .doc-meta { color:#666; font-size:13px; margin:6px 0 14px; }
      .container { padding: 2px 4px; }
    </style>
  `;

  let htmlParts: string[] = [];
  let pendingList: string[] = [];
  let pendingSignatures: string[] = [];

  const flushList = () => {
    if (pendingList.length) {
      htmlParts.push('<ul>');
      pendingList.forEach(li => htmlParts.push(`<li>${li}</li>`));
      htmlParts.push('</ul>');
      pendingList = [];
    }
  };

  const flushSignatures = () => {
    if (!pendingSignatures.length) return;
    // If 2 or more signature lines in a row, render two-column signature layout
    if (pendingSignatures.length >= 2) {
      // take pairs
      const pairs: string[][] = [];
      for (let i = 0; i < pendingSignatures.length; i += 2) {
        pairs.push(pendingSignatures.slice(i, i + 2));
      }
      pairs.forEach(pair => {
        htmlParts.push('<div class="signature-row">');
        // render exactly two columns if two available, else single column takes full width
        if (pair.length === 2) {
          htmlParts.push(
            `<div class="signature-item"><div class="signature-label">For the Seller:</div><div>${pair[0]}</div><div class="signature-box"></div></div>`,
          );
          htmlParts.push(
            `<div class="signature-item"><div class="signature-label">For the Buyer:</div><div>${pair[1]}</div><div class="signature-box"></div></div>`,
          );
        } else {
          htmlParts.push(
            `<div class="signature-item"><div>${pair[0]}</div><div class="signature-box"></div></div>`,
          );
        }
        htmlParts.push('</div>');
      });
    } else {
      // single signature -> bold paragraph
      htmlParts.push(`<p class="signature-large">${pendingSignatures[0]}</p>`);
    }
    pendingSignatures = [];
  };

  // iterate
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const t = (b?.type || 'p').toLowerCase();
    const c = String(b?.content ?? '').trim();

    // If content is empty skip
    if (!c) continue;

    if (t === 'li') {
      // collect into pendingList
      pendingList.push(c);
      continue; // continue collecting
    }

    // non-li: flush any pending lists
    flushList();

    if (t === 'signature') {
      pendingSignatures.push(c);
      const next = blocks[i + 1];
      if (!next || (next.type || '').toLowerCase() !== 'signature') {
        flushSignatures();
      }
      continue;
    }

    flushSignatures();

    if (/^h[1-6]$/.test(t)) {
      // For h2/h3 we want nicer section style
      if (t === 'h2') {
        htmlParts.push(`<h2>${c}</h2>`);
      } else if (t === 'h3') {
        htmlParts.push(`<h3>${c}</h3>`);
      } else {
        htmlParts.push(`<${t}>${c}</${t}>`);
      }
      continue;
    }

    if (t === 'p') {
      htmlParts.push(`<p>${c}</p>`);
      continue;
    }

    if (t === 'hr') {
      htmlParts.push('<hr/>');
      continue;
    }

    // default fallback
    htmlParts.push(`<p>${c}</p>`);
  }

  // flush anything left
  flushList();
  flushSignatures();

  // join
  const body = `<div class="container">${htmlParts.join('\n')}</div>`;

  return `<!doctype html><html><head>${style}</head><body>${body}</body></html>`;
};

const ContractPreviewScreen = ({route}: Props) => {
  const navigation = useNavigation();
  const {blocks: incomingBlocks} = route.params || {};

  const {width} = useWindowDimensions();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [html, setHtml] = useState('');

  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [savedTemplateId, setSavedTemplateId] = useState<number | null>(null);
  const [finalHtmlPreview, setFinalHtmlPreview] = useState('');

  const updateBlock = (index: number, text: string) => {
    const updated = [...blocks];
    updated[index].content = text;
    setBlocks(updated);

    setHtml(formatBlocksToHtml(updated));
  };

  useEffect(() => {
    if (Array.isArray(incomingBlocks)) {
      setBlocks(incomingBlocks);

      const builtHTML = formatBlocksToHtml(incomingBlocks);
      setHtml(builtHTML);
    }
  }, [incomingBlocks]);

  const handleSave = async () => {
    if (!templateName.trim()) {
      Toast.show({type: 'error', text1: 'Please enter template name!'});
      return;
    }

    const finalStyledHTML = formatBlocksToHtml(blocks);
    setFinalHtmlPreview(finalStyledHTML);

    const payload = {
      template_name: templateName,
      content: finalStyledHTML,
    };

    setLoading(true);

    try {
      const response = await Services.saveDraftTemplate(payload);

      if (response.success) {
        Toast.show({type: 'success', text1: 'Template saved successfully!'});

        const templateId = response.data?.data?.id;
        if (templateId) {
          setSavedTemplateId(templateId);
          await fetchPdfUrl(templateId);
          await fetchDocxUrl(templateId);
          setIsModalVisible(true);
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
        console.warn('No PDF URL returned');
      }
    } catch (err) {
      console.error('fetchPdfUrl error:', err);
    }
  };

  const fetchDocxUrl = async (templateId: number) => {
    try {
      const response = await Services.getTemplateDocx(templateId);
      const url = response?.docx_file_url;

      if (url) {
        setDocxUrl(url);
      } else {
        console.warn('No DOCX URL returned');
      }
    } catch (err) {
      console.error('fetchDocxUrl error:', err);
    }
  };

  // Google Docs functionality
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningIn(true);

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      Toast.show({
        type: 'success',
        text1: 'Google account connected successfully!',
      });

      return userInfo;
    } catch (error: any) {
      console.error('Google Sign-In error:', error);

      if (error.code === 'SIGN_IN_CANCELLED') {
        Toast.show({
          type: 'info',
          text1: 'Google Sign-In was cancelled',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to connect Google account',
        });
      }
      throw error;
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleDownloadGoogleDoc = async () => {
    try {
      // Check if template is saved
      if (!savedTemplateId) {
        Toast.show({
          type: 'error',
          text1: 'Please save the template first',
        });
        return;
      }

      // Sign in with Google
      const userInfo = await handleGoogleSignIn();
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;
      console.log('accessToken', accessToken);

      // Check if the downloadGoogleDoc method exists
      if (!Services.downloadGoogleDoc) {
        throw new Error('Google Docs download service is not available');
      }

      // Download Google Doc
      console.log('Calling downloadGoogleDoc with:', {
        templateId: savedTemplateId,
        accessToken: accessToken.substring(0, 20) + '...',
      });

      const gdocResponse = await Services.downloadGoogleDoc(
        savedTemplateId,
        accessToken,
      );

      console.log('Google Docs response:', gdocResponse);

      if (gdocResponse && gdocResponse.doc_url) {
        Toast.show({
          type: 'success',
          text1: 'Google Doc created successfully!',
        });

        // Open the Google Doc
        Linking.openURL(gdocResponse.doc_url).catch(() => {
          Toast.show({
            type: 'error',
            text1: 'Could not open Google Doc',
          });
        });
      } else {
        throw new Error('No Google Doc URL returned from server');
      }
    } catch (error: any) {
      console.error('Google Docs download error:', error);

      let errorMessage = 'Failed to create Google Doc';
      if (error.message.includes('not available')) {
        errorMessage = 'Google Docs feature is currently unavailable';
      } else if (error.message.includes('No Google Doc URL')) {
        errorMessage = 'Server did not return Google Doc URL';
      }

      Toast.show({
        type: 'error',
        text1: errorMessage,
        text2: 'Please try again later',
      });
    }
  };

  const reconstructHtml = () => {
    let reconstructedHtml = '';
    blocks.forEach(block => {
      switch (block.type) {
        case 'h1':
          reconstructedHtml += `<h1>${block.content}</h1>\n`;
          break;
        case 'h2':
          reconstructedHtml += `<h2>${block.content}</h2>\n`;
          break;
        case 'h3':
          reconstructedHtml += `<h3>${block.content}</h3>\n`;
          break;
        case 'h4':
          reconstructedHtml += `<h4>${block.content}</h4>\n`;
          break;
        case 'h5':
          reconstructedHtml += `<h5>${block.content}</h5>\n`;
          break;
        case 'h6':
          reconstructedHtml += `<h6>${block.content}</h6>\n`;
          break;
        case 'p':
          reconstructedHtml += `<p>${block.content}</p>\n`;
          break;
        case 'li':
          reconstructedHtml += `<li>${block.content}</li>\n`;
          break;
        case 'signature':
          reconstructedHtml += `<p class="signature">${block.content}</p>\n`;
          break;
        case 'hr':
          reconstructedHtml += `<hr />\n`;
          break;
        default:
          reconstructedHtml += `<p>${block.content}</p>\n`;
          break;
      }
    });
    return reconstructedHtml;
  };
  const handleDownloadPdf = () => {
    if (pdfUrl) {
      Linking.openURL(pdfUrl).catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Could not open PDF link',
        });
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'PDF is not ready yet',
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
    } else {
      Toast.show({
        type: 'error',
        text1: 'DOCX is not ready yet',
      });
    }
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {blocks.map((b, i) => (
          <TextInput
            key={i}
            multiline
            style={styles[b.type] || styles.p}
            value={b.content}
            onChangeText={text => updateBlock(i, text)}
          />
        ))}
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Template Saved!</Text>
            <Text style={styles.modalSubtitle}>
              Preview of formatted template
            </Text>

            {/* HTML PREVIEW */}
            <ScrollView style={{maxHeight: 250, width: '100%'}}>
              <RenderHTML
                contentWidth={width - 60}
                source={{html: finalHtmlPreview}}
              />
            </ScrollView>
            <TouchableOpacity
              onPress={handleDownloadPdf}
              style={[
                styles.modalDownloadButton,
                !pdfUrl && styles.disabledButton,
              ]}
              disabled={!pdfUrl}>
              <Text style={styles.downloadText}>
                {pdfUrl ? 'Download PDF' : 'Preparing PDF...'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownloadDocx}
              style={[
                styles.modalDownloadButton,
                !docxUrl && styles.disabledButton,
              ]}
              disabled={!docxUrl}>
              <Text style={styles.downloadText}>
                {docxUrl ? 'Download DOCX' : 'Preparing DOCX...'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownloadGoogleDoc}
              style={[
                styles.modalDownloadButton,
                styles.googleButton,
                !savedTemplateId && styles.disabledButton,
              ]}
              disabled={!savedTemplateId}>
              <Text style={styles.downloadText}>Save as Google Doc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
                navigation.goBack();
              }}
              style={styles.closeButton}>
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
    backgroundColor: '#0E3386',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentScroll: {
    flex: 1,
  },
  // ... your existing block styles (h1, h2, p, etc.)
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
  // Download section styles
  downloadContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  downloadButton: {
    backgroundColor: '#0E3386',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalDownloadButton: {
    backgroundColor: '#0E3386',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  googleButton: {
    backgroundColor: '#0E3386', // Google blue
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
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
    textAlign: 'center',
  },
  closeModal: {
    color: '#333',
    marginTop: 10,
  },
  closeButton: {
    marginTop: 15,
  },
});

export default ContractPreviewScreen;
