import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import SignatureModal from '../components/Modals/SignatureModal';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/NavigationManager';
import services from '../Services/services';

type WebViewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WebViewScreen'>;

const ESignatureScreen = () => {
  const navigation = useNavigation<WebViewScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  type Recipient = {
    id: number;
    name: string;
    email: string;
    filename: string;
    status: string;
    recipients: Recipient[];
    recipientNames?: string[];
  };

  const fetchEsignDocs = async () => {
    try {
      const response = await services.getEsignDocList({ limit: 10, offset: 0 });

      if (response.success && response.data.results) {
        const formattedDocs = response.data.results.map((doc: any, index: number) => {
          const recipientNames =
            doc.recipients?.map((r: any) => r.name).filter(Boolean) || [];
          return {
            id: index + 1,
            filename: doc.filename || 'Unknown',
            status: doc.status || 'Unknown',
            recipientNames: recipientNames.join(' and '),
          };
        });

        setDocs(formattedDocs);
      } else {
        console.log('API Error:', response.error);
      }
    } catch (error) {
      console.log('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEsignDocs();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>E-Signature,</Text>
        <Text style={styles.subtitle}>
          With our seamless E-Signature functionality, you can securely sign documents online,
          eliminating the need for physical paperwork and streamlining your workflow.
        </Text>
        <Image
          source={require('../assets/images/E-signature.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => { setModalVisible(true)
         }}
        >
          <Text style={styles.buttonText}>Sign Document</Text>
        </TouchableOpacity>

        <SignatureModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={docs}
          keyExtractor={(item: Recipient) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                padding: 12,
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <Text style={{ flex: 0.1 }}>{item.id}</Text>
              <View style={{ flex: 0.6 }}>
                <Text>{item.filename}</Text>
                <Text style={{ fontWeight: 'bold' }}>{item.recipientNames}</Text>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-start' }}>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor:
                      item.status === 'Sent'
                        ? '#ffe3b3'
                        : item.status === 'Completed'
                        ? '#b7f5c3'
                        : '#f0f0f0',
                    color: '#333',
                    fontWeight: '500',
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          // ListEmptyComponent={<Text>No documents found.</Text>}
        />
      </View>
    </>
  );
};

export default ESignatureScreen;
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center',marginTop:40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  image: { width: 200, height: 150, marginBottom: 30 },
  button: { backgroundColor: '#0E3386', padding: 15, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});