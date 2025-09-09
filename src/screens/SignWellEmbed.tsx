// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { RouteProp } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

// import Services from '../Services/services';
// import { RootStackParamList } from '../navigation/types';

// type SignWellEmbedRouteProp = RouteProp<RootStackParamList, 'SignWellScreen'>;
// type SignWellEmbedNavigationProp = StackNavigationProp<RootStackParamList, 'SignWellScreen'>;

// const SignWellEmbed: React.FC<Props> = ({ embeddedSigningUrl, id, requestingRedirectUrl, documentId }) => {
//   const route = useRoute<SignWellEmbedRouteProp>();
//   const navigation = useNavigation<SignWellEmbedNavigationProp>();
//   console.log("embeddedSigningUrl",embeddedSigningUrl);
  
//   const webviewRef = useRef<WebView>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     return () => {
//       if (webviewRef.current) {
//         webviewRef.current.stopLoading();
//       }
//     };
//   }, []);

//   const handleMessage = async (event: any) => {
//     try {
//       const data = JSON.parse(event.nativeEvent.data);
//       console.log("Message from SignWell:", data);

//       if (data.event === "completed" && documentId) {
//         const response = await Services.checkStatusSignWellDocument(documentId);
        
//         if (response && response.data) {
//           const recipients = response.data.recipients.map((item: any) => {
//             const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
//             return {
//               ...itemRest,
//               bounced_detail: bounced_details,
//               recipient_id: id,
//               signing_order: itemRest.signing_order || 0,
//             };
//           });

//           const payload = {
//             signwell_doc_id: response.data.id,
//             custom_requester_name: response.data.custom_requester_name,
//             embedded_edit_url: response.data.embedded_edit_url,
//             requester_email_address: response.data.requester_email_address,
//             status: response.data.status,
//             subject: response.data.subject,
//             filename: response.data.name,
//             recipients,
//           };

//           const saveRes = await Services.sendeSignDocsSaga(payload);
//           if (saveRes.success) {
//             Alert.alert("Success", "Document signed and saved successfully!");
//             navigation.goBack();
//           } else {
//             Alert.alert("Error", "Failed to save document.");
//           }
//         }
//       }

//       if (data.event === "closed") {
//         Alert.alert("Closed", "The signing window was closed.");
//         navigation.goBack();
//       }

//       if (data.event === "error") {
//         setError("There was an error with the signing process.");
//         Alert.alert("Error", "There was an error with SignWell.");
//       }
//     } catch (err) {
//       console.error("Error parsing SignWell message:", err);
//     }
//   };

//   const handleLoadStart = () => {
//     setLoading(true);
//     setError(null);
//   };

//   const handleLoadEnd = () => {
//     setLoading(false);
//   };

//   const handleError = (syntheticEvent: any) => {
//     const { nativeEvent } = syntheticEvent;
//     setLoading(false);
//     setError(`Failed to load document: ${nativeEvent.description}`);
//     console.error('WebView error:', nativeEvent);
//   };

//   if (!embeddedSigningUrl) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>No signing URL provided</Text>
//       </View>
//     );
//   }
//  console.log("embeddedSigningUrl, documentId,",embeddedSigningUrl);
//           console.log("documentId",documentId);
//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007bff" />
//           <Text style={styles.loadingText}>Loading document...</Text>
//         </View>
//       )}
      
//       {error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : (
//         <WebView
//           ref={webviewRef}
//           source={{ uri: embeddedSigningUrl }}
//           // onMessage={handleMessage}
//           onLoadStart={handleLoadStart}
//           onLoadEnd={handleLoadEnd}
//           onError={handleError}
//           onHttpError={handleError}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//           startInLoadingState={true}
//           style={styles.webview}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   webview: {
//     flex: 1,
//     height:1000
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#dc3545',
//     textAlign: 'center',
//   },
// });

// export default SignWellEmbed;



import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Services from '../Services/services';
import { RootStackParamList } from '../navigation/types';

type SignWellEmbedRouteProp = RouteProp<RootStackParamList, 'SignWellScreen'>;
type SignWellEmbedNavigationProp = StackNavigationProp<RootStackParamList, 'SignWellScreen'>;

interface Props {
  embeddedSigningUrl?: string | null;
  id: string;
  requestingRedirectUrl?: string | null;
  documentId?: string;
}

const SignWellEmbed: React.FC<Props> = ({
  embeddedSigningUrl,
  id,
  requestingRedirectUrl,
  documentId
}) => {
  const route = useRoute<SignWellEmbedRouteProp>();
  const navigation = useNavigation<SignWellEmbedNavigationProp>();
  
  const signingUrl = embeddedSigningUrl || route.params?.embeddedSigningUrl;
  const docId = documentId || route.params?.documentId;
  const redirectUrl = requestingRedirectUrl || route.params?.requestingRedirectUrl;
  
  console.log("Signing URL:", signingUrl);
  console.log("Redirect URL:", redirectUrl);
  console.log("Document ID:", docId);
  
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);

  useEffect(() => {
    // Check if URL points to a PDF
    if (signingUrl && signingUrl.toLowerCase().endsWith('.pdf')) {
      setIsPdf(true);
    }
  }, [signingUrl]);

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Message from SignWell:", data);

      if (data.event === "completed" && docId) {
        const response = await Services.checkStatusSignWellDocument(docId);
        
        if (response && response.data) {
          const recipients = response.data.recipients.map((item: any) => {
            const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
            return {
              ...itemRest,
              bounced_detail: bounced_details,
              recipient_id: id,
              signing_order: itemRest.signing_order || 0,
            };
          });

          const payload = {
            signwell_doc_id: response.data.id,
            custom_requester_name: response.data.custom_requester_name,
            embedded_edit_url: response.data.embedded_edit_url,
            requester_email_address: response.data.requester_email_address,
            status: response.data.status,
            subject: response.data.subject,
            filename: response.data.name,
            recipients,
          };

          const saveRes = await Services.sendeSignDocsSaga(payload);
          if (saveRes.success) {
            Alert.alert("Success", "Document signed and saved successfully!");
            navigation.goBack();
          } else {
            Alert.alert("Error", "Failed to save document.");
          }
        }
      }

      if (data.event === "closed") {
        Alert.alert("Closed", "The signing window was closed.");
        navigation.goBack();
      }

      if (data.event === "error") {
        setError("There was an error with the signing process.");
        Alert.alert("Error", "There was an error with SignWell.");
      }
    } catch (err) {
      console.error("Error parsing SignWell message:", err);
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    setError(`Failed to load document: ${nativeEvent.description}`);
    console.error('WebView error:', nativeEvent);
  };

  const openInBrowser = () => {
    if (signingUrl) {
      Linking.openURL(signingUrl).catch(err => {
        Alert.alert("Error", "Failed to open document in browser");
        console.error('Failed to open URL:', err);
      });
    }
  };

  // For PDFs, we need a different approach
  const pdfHtml = (url: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .pdf-container {
          width: 100%;
          height: 100%;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .fallback {
          padding: 20px;
          text-align: center;
        }
        .button {
          background-color: #3498db;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="pdf-container">
          <iframe src="https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}" />
        </div>
      </div>
    </body>
    </html>
  `;

  if (!signingUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No signing URL provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={openInBrowser}>
            <Text style={styles.buttonText}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
      ) : isPdf ? (
        // Render PDF using Google Docs viewer
        <WebView
          ref={webviewRef}
          source={{ html: pdfHtml(signingUrl) }}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          javaScriptEnabled={true}
          style={styles.webview}
        />
      ) : (
        // Render regular web content
        <WebView
          ref={webviewRef}
          source={{ uri: signingUrl }}
          onMessage={handleMessage}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          style={styles.webview}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          userAgent="Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Mobile Safari/537.36"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    height:1000
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignWellEmbed;