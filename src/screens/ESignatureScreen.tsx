import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import CreateDocument from './CreateDocument';
import SignWellEmbed from './SignWellEmbed';
// import SignedDocument from './SignedDocument';
import { SignWellDocument, DocumentResponse, RootStackParamList, UserData } from '../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Embed: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [signwellRes, setSignwellRes] = useState<boolean | SignWellDocument>(false);
  const [url, setUrl] = useState<string | null>(null);
  const [requestingRedirectUrl, setRequestingRedirectUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");
  const [isDocumentOpen, setIsDocumentOpen] = useState<boolean>(false);
  const [isImageOpn, setisImageOpn] = useState<boolean>(false);
  const [documentResponse, setDocumentResponse] = useState<DocumentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<UserData | null>(null);
  console.log("url", url);
  console.log("requestingRedirectUrl", requestingRedirectUrl);
  console.log("userId", userId);


  const handleClear = (): void => {
    setSignwellRes(false);
    setFileName("");
    setRecipientName("");
    setRecipientEmail("");
    setPasscode("");
    setDocumentResponse(null);
    setError(null);
    setLoading(false);
    setisImageOpn(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const userData = JSON.parse(userId);
          setUserData(userId);
          setUserId(userId);
          console.log("userData.id", userData.id);

        }
      } catch (error) {
        console.error("Error getting user data from AsyncStorage:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>E-Signature</Text>
          <Text style={styles.heroDescription}>
            With our seamless E-Signature functionality, you can securely sign
            documents online, eliminating the need for physical paperwork and
            streamlining your workflow.
          </Text>
          <TouchableOpacity
            style={[styles.signButton, signwellRes && styles.disabledButton]}
            onPress={() => {
              setisImageOpn(true);
              setIsDocumentOpen(true);
            }}
          // disabled={!!signwellRes}
          >
            <Text style={styles.signButtonText}>Sign Document</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroImage}>
          <Image
            source={require('../assets/images/E-signature.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* {!isImageOpn && (
          <View style={styles.signedDocumentContainer}>
            <SignedDocument />
          </View>
        )} */}

        <CreateDocument
          signwellRes={signwellRes}
          setSignwellRes={setSignwellRes}
          setUrl={setUrl}
          setRequestingRedirectUrl={setRequestingRedirectUrl}
          fileName={fileName}
          recipientName={recipientName}
          recipientEmail={recipientEmail}
          passcode={passcode}
          setFileName={setFileName}
          setRecipientName={setRecipientName}
          setRecipientEmail={setRecipientEmail}
          setPasscode={setPasscode}
          isDocumentOpen={isDocumentOpen}
          setIsDocumentOpen={setIsDocumentOpen}
          handleClear={handleClear}
          documentResponse={documentResponse}
          setDocumentResponse={setDocumentResponse}
          loading={loading}
          setLoading={setLoading}
          id={userId}
          error={error}
          setError={setError}

        />

        {signwellRes && (
          <SignWellEmbed
            embeddedSigningUrl={url}
            id={typeof signwellRes === 'object' ? signwellRes.id || "" : ""}
            documentId={typeof signwellRes === 'object' ? signwellRes.id || "" : ""}
            requestingRedirectUrl={requestingRedirectUrl}
          />

        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
    paddingRight: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  heroDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  signButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  signButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  signedDocumentContainer: {
    marginBottom: 20,
  },
});

export default Embed;