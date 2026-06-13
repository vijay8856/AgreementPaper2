// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

type AICoreAdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AICoreAdminScreen'>;

type Block = {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'li' | 'p' | 'hr' | 'signature';
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
  const [includeFields, setIncludeFields] = useState<'yes' | 'no'>('no');
  const [selectedFields, setSelectedFields] = useState<any[]>([]);
  const [fieldOptions, setFieldOptions] = useState<any[]>([]);
  const [fetchingMSA, setFetchingMSA] = useState(false);
  const [allData, setAllData] = useState('');

  const nodeTextFast = (node: any): string => {
    if (!node) return '';

    // text node
    if (node.nodeType === 3) {
      return node.rawText ?? node.text ?? '';
    }

    // element with children
    if (!node.childNodes || node.childNodes.length === 0) {
      return node.text ?? '';
    }

    return node.childNodes.map((c: any) => nodeTextFast(c)).join('');
  };

  useFocusEffect(
    useCallback(() => {
      console.log("AICoreAdminScreen re-focused → Refreshing templates...");
      fetchTemplates();
    }, [])
  );
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) {
          const result = await AsyncStorage.multiGet(keys);

          type AsyncData = Record<string, any>;

          const dataObj = result.reduce<AsyncData>((acc, [key, value]) => {
            if (value !== null) {
              try {
                acc[key] = JSON.parse(value);
              } catch (e) {
                acc[key] = value;
              }
            }
            return acc;
          }, {});

          setAllData(dataObj?.userType);

          // userId may be number or string → normalize
          // setUserId(String(dataObj?.userId ?? ""));
          console.log("All AsyncStorage userId:", dataObj?.userId);
        }
      } catch (error) {
        console.error("Error fetching all AsyncStorage data:", error);
      }
    };

    fetchAllData();
  }, []);




  useEffect(() => {
    fetchTemplates();
    fetchMSAList();
  }, []);

  const fetchMSAList = async () => {
    try {
      setLoading(true);

      setFetchingMSA(true);
      const response = await Services.getAllMSAList({
        limit: 10,
        offset: 0,
      });

      console.log('MSA Response:', response); // Debug log

      // Handle different response structures
      if (response && response.success) {
        const list = response.data || response.results || [];
        const options = list.map((item: any) => ({
          label: item.name || item.template_name || 'Unnamed',
          value: item.id || item.value,
        }));
        setFieldOptions(options);
      } else {
        Alert.alert('Error', 'Failed to fetch MSA list');
      }
    } catch (err: any) {
      console.error('MSA Fetch Error:', err);
      Alert.alert('Error', err.message || 'Failed to fetch MSA list');
    } finally {

      setFetchingMSA(false);
      setLoading(false);
    }
  };

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

  const handleFieldSelection = (item: any) => {
    setSelectedFields([item]);
  };
  const parseHtmlToBlocks = (html) => {
    if (!html || typeof html !== "string") return [];

    let cleaned = html
      .replace(/```html|```/g, "")
      .replace(/\r/g, "")
      .replace(/\\n/g, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .trim();

    const blocks = [];
    const push = (type, content) => {
      content = content?.trim();
      if (content) blocks.push({ type, content });
    };

    // Split by tags
    const tagRegex = /<(h[1-6]|p|li|ul|ol|div|table|tr|td|hr)[^>]*>([\s\S]*?)<\/\1>|<(hr)\s*\/?>/gi;
    let match;
    let lastIndex = 0;

    while ((match = tagRegex.exec(cleaned)) !== null) {
      const before = cleaned.substring(lastIndex, match.index).trim();
      if (before) push("p", before);

      const tag = match[1] || match[3];
      const content = match[2] || "";

      switch (tag) {
        case "hr":
          push("hr", "---");
          break;

        case "p":
          push("p", stripHtml(content));
          break;

        case "li":
          push("li", stripHtml(content));
          break;

        case "ul":
        case "ol":
          content
            .split(/<\/li>/gi)
            .map(x => x.replace(/<li[^>]*>/i, "").trim())
            .filter(Boolean)
            .forEach(li => push("li", li));
          break;

        case "div":
          stripHtml(content)
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean)
            .forEach(x => push("p", x));
          break;

        case "table":
          content.split(/<\/tr>/gi).forEach(row => {
            const rowText = row
              .replace(/<td[^>]*>/gi, " • ")
              .replace(/<[^>]+>/g, "")
              .trim();
            if (rowText) push("p", rowText);
          });
          break;

        default:
          if (/h[1-6]/.test(tag)) push(tag, stripHtml(content));
          break;
      }

      lastIndex = tagRegex.lastIndex;
    }

    const remainder = cleaned.substring(lastIndex).trim();
    if (remainder) {
      remainder.split("\n")
        .map(x => x.trim())
        .filter(Boolean)
        .forEach(x => push("p", x));
    }

    return blocks;
  };

  const stripHtml = (text) =>
    text
      .replace(/<strong>(.*?)<\/strong>/gi, "**$1**") // convert strong → bold marker
      .replace(/<[^>]+>/g, "")                       // remove all other tags
      .replace(/\s{2,}/g, " ")
      .trim();





  const canRun =
    contractType &&
    lineOfBusiness &&
    baseCountry &&
    partnerCountry &&
    acts &&
    (includeFields === 'no' || (includeFields === 'yes' && selectedFields.length > 0));

  const handleRun = async () => {
    // Validate required fields
    if (!contractType || !lineOfBusiness || !baseCountry || !partnerCountry || !acts) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Validate MSA selection if includeFields is 'yes'
    if (includeFields === 'yes' && selectedFields.length === 0) {
      Alert.alert('Error', 'Please select MSA fields to include');
      return;
    }

    let payload: any = {
      country: baseCountry,
      recipient_country: partnerCountry,
      act: acts,
      contract_type: contractType,
      line_of_business: lineOfBusiness,
    };

    // Add MSA data if included
    if (includeFields === 'yes' && selectedFields.length > 0) {
      const normalizeValue = (value: string) => {
        return value
          .split('_')
          .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };

      payload = {
        ...payload,
        msa_id: Number(selectedFields[0].value),
        country: normalizeValue(payload.country),
        contract_type: normalizeValue(payload.contract_type),
        line_of_business: normalizeValue(payload.line_of_business),
        recipient_country: normalizeValue(payload.recipient_country),
        PartyType: "Enterprise"
      };
    }

    try {
      setLoading(true);
      let response;

      console.log('Sending payload:', payload); // Debug log

      if (allData === 'INDIVIDUAL_USER' || allData === 'LAWYER_USER') {
        // Directly call Ai_Draft for these two user types
        response = await Services.Ai_Draft(payload);
        console.log('API Response (Direct Ai_Draft for userType):', response);
      } else {
        // For other users, apply condition
        if (includeFields === 'yes' && selectedFields.length > 0) {
          response = await Services.getAiResponseV2(payload);
          console.log('API Response (getAiResponseV2):', response);
        } else {
          response = await Services.Ai_Draft(payload);
          console.log('API Response (Ai_Draft fallback):', response);
        }
      }
      // Handle different response structures safely
      let message = '';

      if (response && response.data) {
        // Try different possible response structures
        message = response.data?.data?.message ||
          response.data?.message ||
          response.data?.content ||
          JSON.stringify(response.data);
      } else if (typeof response === 'string') {
        message = response;
      } else {
        message = JSON.stringify(response);
      }

      if (message && typeof message === 'string') {
        const blocks = parseHtmlToBlocks(message);
        navigation.navigate("ContractPreviewScreen", { blocks });
      } else {
        Alert.alert('Error', 'Failed to get valid response from AI');
      }
    } catch (error: any) {
      console.error("AI draft error", error);

      // Safe error message extraction
      let errorMessage = 'Something went wrong';
      if (error && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await Services.getAllTemplate({ limit: 20, offset: 0 });
      console.log("fetchTemplates response:", response);

      // Handle different response structures
      if (response && response.results) {
        setTemplates(response.results);
      } else if (Array.isArray(response)) {
        setTemplates(response);
      } else if (response && response.data) {
        setTemplates(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      Alert.alert('Error', error.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const renderTemplateItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.templateName}>{item.template_name || item.name}</Text>

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

  const renderMSAFieldItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedFields.some(field => field.value === item.value) && styles.optionItemSelected
      ]}
      onPress={() => handleFieldSelection(item)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
      {selectedFields.some(field => field.value === item.value) && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }

  return (
    <FlatList
      data={[]}
      keyExtractor={() => "dummy"}
      renderItem={() => null}
      style={styles.container}
      ListHeaderComponent={
        <>


          <Text style={styles.pageTitle}>Agreement AI Core Administration</Text>

          <Text style={styles.label}>1. What type of contract it is?</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModal('contractType')}
          >
            <Text style={styles.dropdownText}>{contractType || 'Select contract type'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>2. Line of business?</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModal('lineOfBusiness')}
          >
            <Text style={styles.dropdownText}>{lineOfBusiness || 'Select business line'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>3. Select your Base country?</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModal('baseCountry')}
          >
            <Text style={styles.dropdownText}>{baseCountry || 'Select base country'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>4. Select Recipient Partner's country?</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModal('partnerCountry')}
          >
            <Text style={styles.dropdownText}>{partnerCountry || 'Select partner country'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>5. As per Acts?</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModal('acts')}
          >
            <Text style={styles.dropdownText}>{acts || 'Select act'}</Text>
          </TouchableOpacity>

          {/* MSA Fields Section */}
          {allData !== 'INDIVIDUAL_USER' && allData !== 'LAWYER_USER' && (
            <View style={styles.msaContainer}>
              <View style={styles.msaHeader}>
                <Text style={styles.msaLabel}>Do you want to include fields From contract?</Text>
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => {
                      setIncludeFields('yes');
                      if (includeFields === 'yes') {
                        setSelectedFields([]);
                      }
                    }}
                  >
                    <View style={styles.radioCircle}>
                      {includeFields === 'yes' && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>Yes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => {
                      setIncludeFields('no');
                      setSelectedFields([]);
                    }}
                  >
                    <View style={styles.radioCircle}>
                      {includeFields === 'no' && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {includeFields === 'yes' && (
                <View style={styles.fieldSelectionContainer}>
                  <Text style={styles.fieldSelectionLabel}>Select MSA field to include:</Text>
                  {fetchingMSA ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#0E3386" />
                      <Text style={styles.loadingText}>Loading MSA fields...</Text>
                    </View>
                  ) : fieldOptions.length > 0 ? (
                    <View style={styles.selectContainer}>
                      <View style={{ maxHeight: 200 }}>
                        <FlatList
                          data={fieldOptions}
                          keyExtractor={(item) => item.value?.toString()}
                          renderItem={renderMSAFieldItem}
                          nestedScrollEnabled={true}
                          scrollEnabled={false}
                        />
                      </View>

                      {selectedFields.length > 0 && (
                        <Text style={styles.selectedText}>
                          Selected: {selectedFields[0].label}
                        </Text>
                      )}
                    </View>

                  ) : (
                    <Text style={styles.noOptionsText}>No MSA fields available</Text>
                  )}
                </View>
              )}
            </View>
          )}


          <TouchableOpacity
            style={[
              styles.runButton,
              (!canRun || loading) && styles.runButtonDisabled
            ]}
            onPress={handleRun}
            disabled={!canRun || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.runButtonText}>Run</Text>
            )}
          </TouchableOpacity>
            <View>

              <Text style={styles.sectionTitle}>Templates</Text>
              <FlatList
                data={templates}
                renderItem={renderTemplateItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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


            </View>

        </>
      }
    />

  );
};

export default AICoreAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0E3386',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 6,
  },
  dropdownText: {
    color: '#333',
  },
  runButton: {
    backgroundColor: '#0E3386',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  runButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
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
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
    fontStyle: 'italic',
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
    marginBottom: 20,
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
  // MSA Styles
  msaContainer: {
    borderWidth: 1,
    borderColor: '#072188',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  msaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    flexWrap: 'wrap',
    backgroundColor: '#f8f9fa',
  },
  msaLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    padding: 5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#072188',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#072188',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  fieldSelectionContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  fieldSelectionLabel: {
    marginBottom: 12,
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  selectContainer: {
    maxHeight: 200,
  },
  flatList: {
    flexGrow: 0,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  optionItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#072188',
  },
  optionText: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  checkmark: {
    color: '#072188',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedText: {
    marginTop: 8,
    fontSize: 12,
    color: '#072188',
    fontStyle: 'italic',
  },
  noOptionsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
});