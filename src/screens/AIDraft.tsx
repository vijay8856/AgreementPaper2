

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  actsArray,
  contractTypeArray,
  businessLineArray,
  countryDataArray,
} from '../dataArrays';


import SearchableModal from '../components/Modals/SearchableModal';
import Services from '../Services/services';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/NavigationManager';
import { FlatList } from 'react-native-gesture-handler';

type AICoreAdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AICoreAdminScreen'>;
type Block = {
  type: 'h1' | 'h2' | 'h3' | 'h5' | 'li' | 'p' | 'strong' | 'td ';
  content: string;
};


const AICoreAdminScreen = () => {
  const [contractType, setContractType] = useState('');
  const [lineOfBusiness, setLineOfBusiness] = useState('');
  const [baseCountry, setBaseCountry] = useState('');
  const [partnerCountry, setPartnerCountry] = useState('');
  const [acts, setActs] = useState('');
  const [modal, setModal] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const navigation = useNavigation<AICoreAdminScreenNavigationProp>();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelect = (key: string, item: { label: string; value: string }) => {
    switch (key) {
      case 'contractType':
        setContractType(item.label);
        break;
      case 'lineOfBusiness':
        setLineOfBusiness(item.label);
        break;
      case 'baseCountry':
        setBaseCountry(item.label);
        break;
      case 'partnerCountry':
        setPartnerCountry(item.label);
        break;
      case 'acts':
        setActs(item.label);
        break;
    }
  };

  const parseHtmlToBlocks = (message: string): Block[] => {
    // Enhanced cleaning for the new format
    const cleaned = message
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const blocks: Block[] = [];
    const lines = cleaned.split('\n');
    let currentList: string[] = [];
    let lastHeading = '';

    const flushList = () => {
      if (currentList.length > 0) {
        currentList.forEach(item => {
          blocks.push({ type: 'li', content: item.trim() });
        });
        currentList = [];
      }
    };

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Extract and clean header content
      const headerMatch = line.match(/<h([1-6])[^>]*>(.*?)<\/h\1>/i);
      if (headerMatch) {
        flushList();
        const level = parseInt(headerMatch[1]);
        let content = headerMatch[2]
          .replace(/<[^>]*>/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        // Skip duplicate headings
        if (content !== lastHeading) {
          blocks.push({ type: `h${level}`, content });
          lastHeading = content;
        }
        continue;
      }

      // Process paragraphs
      const paragraphMatch = line.match(/<p[^>]*>(.*?)<\/p>/i);
      if (paragraphMatch) {
        flushList();
        const content = paragraphMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        if (content) {
          blocks.push({ type: 'p', content });
        }
        continue;
      }

      // Process list items
      const listItemMatch = line.match(/<li[^>]*>(.*?)<\/li>/i);
      if (listItemMatch) {
        const content = listItemMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        if (content) {
          currentList.push(content);
        }
        continue;
      }

      // Process div containers (like parties section)
      const divMatch = line.match(/<div[^>]*>(.*?)<\/div>/i);
      if (divMatch) {
        flushList();
        const content = divMatch[1]
          .replace(/<br\s?\/?>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        if (content) {
          // Split multi-line div content into separate blocks
          content.split('\n').forEach(text => {
            if (text.trim()) {
              blocks.push({ type: 'p', content: text.trim() });
            }
          });
        }
        continue;
      }

      // Process tables (like signature section)
      const tableMatch = line.match(/<table[^>]*>(.*?)<\/table>/i);
      if (tableMatch) {
        flushList();
        const tableContent = tableMatch[1]
          .replace(/<tr>/g, '\n')
          .replace(/<td>/g, ' • ')
          .replace(/<\/td>/g, '')
          .replace(/<\/tr>/g, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        if (tableContent) {
          tableContent.split('\n').forEach(row => {
            if (row.trim()) {
              blocks.push({ type: 'p', content: row.trim() });
            }
          });
        }
        continue;
      }

      // Process plain text lines
      if (!line.startsWith('<')) {
        flushList();
        const content = line.replace(/<[^>]*>/g, '').trim();

        if (content) {
          // Handle special cases like signature lines
          if (content.includes('<p>_________________________________') ||
            content.includes('Representative') ||
            content.includes('Date')) {
            blocks.push({ type: 'signature', content });
          } else {
            blocks.push({ type: 'p', content });
          }
        }
      }
    }

    flushList();
    return blocks;
  };

  const handleRun = async () => {
    if (!contractType || !lineOfBusiness || !baseCountry || !partnerCountry || !acts) {
      Alert.alert('Please fill all fields');
      return;
    }

    const payload = {
      country: baseCountry,
      recipient_country: partnerCountry,
      act: acts,
      contract_type: contractType,
      line_of_business: lineOfBusiness,

    };


    try {
      setLoading(true);
      const response = await Services.Ai_Draft(payload);
      const message = response?.data?.data?.message;

      if (message) {
        const formattedHTML = parseHtmlToBlocks(message);

        navigation.navigate('ContractPreviewScreen', { htmlContent: formattedHTML });
      } else {
        Alert.alert('Failed to get response from AI');
      }
    } catch (error) {
      console.error("AI draft error", error);
      Alert.alert('Something went wrong');
    } finally {
      setLoading(false);
    }

  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await Services.getAllTemplate({ limit: 20, offset: 0 });
      console.log("fetchTemplates of response",response);
      
      if (response?.results) {
        setTemplates(response.results);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };



  const renderTemplateItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.templateName}>{item.template_name}</Text>

      <View style={styles.templateLinks}>
        {item.template_pdf && (
          <TouchableOpacity onPress={() => Linking.openURL(item.template_pdf)} style={styles.linkButton}>
            <Text style={styles.linkText}>PDF</Text>
          </TouchableOpacity>
        )}

        {item.template_docx && (
          <TouchableOpacity onPress={() => Linking.openURL(item.template_docx)} style={styles.linkButton}>
            <Text style={styles.linkText}>DOCX</Text>
          </TouchableOpacity>
        )}

        {item.gdoc_url && (
          <TouchableOpacity onPress={() => Linking.openURL(item.gdoc_url)} style={styles.linkButton}>
            <Text style={styles.linkText}>Google Doc</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.status, { color: item.is_active ? '#2ECC71' : '#7F8C8D' }]}>
        {item.is_active ? 'Active' : 'Inactive'}
      </Text>
    </View>
  );


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Agreement AI Core Administration</Text>

      <Text style={styles.label}>1. What type of contract it is?</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModal('contractType')}
      >
        <Text>{contractType || 'Select contract type'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>2. Line of business?</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModal('lineOfBusiness')}
      >
        <Text>{lineOfBusiness || 'Select business line'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>3. Select your Base country?</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModal('baseCountry')}
      >
        <Text>{baseCountry || 'Select base country'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>4. Select Recipient Partner's country?</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModal('partnerCountry')}
      >
        <Text>{partnerCountry || 'Select partner country'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>5. As per Acts?</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModal('acts')}
      >
        <Text>{acts || 'Select act'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.runButton, loading && { opacity: 0.7 }]}
        onPress={handleRun}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.runButtonText}>Run</Text>
        )}
      </TouchableOpacity>


      <Text style={styles.sectionTitle}>Templates</Text>
      <FlatList
        data={templates}
        renderItem={renderTemplateItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No templates found</Text>
        }
      />

      <SearchableModal
        visible={modal === 'contractType'}
        title="Select Contract Type"
        options={contractTypeArray}
        onSelect={(item) => handleSelect('contractType', item)}
        onClose={() => setModal(null)}
      />
      <SearchableModal
        visible={modal === 'lineOfBusiness'}
        title="Select Business Line"
        options={businessLineArray}
        onSelect={(item) => handleSelect('lineOfBusiness', item)}
        onClose={() => setModal(null)}
      />
      <SearchableModal
        visible={modal === 'baseCountry'}
        title="Select Base Country"
        options={countryDataArray}
        onSelect={(item) => handleSelect('baseCountry', item)}
        onClose={() => setModal(null)}
      />
      <SearchableModal
        visible={modal === 'partnerCountry'}
        title="Select Partner Country"
        options={countryDataArray}
        onSelect={(item) => handleSelect('partnerCountry', item)}
        onClose={() => setModal(null)}
      />
      <SearchableModal
        visible={modal === 'acts'}
        title="Select Act"
        options={actsArray}
        onSelect={(item) => handleSelect('acts', item)}
        onClose={() => setModal(null)}
      />
    </ScrollView>
  );
};

export default AICoreAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0E3386',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 6,
  },
  runButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  runButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 20
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  templateLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  linkText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  status: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 5,
  },
});
