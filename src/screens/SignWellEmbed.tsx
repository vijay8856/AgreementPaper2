

// import React, { useState, useEffect } from "react";
// import { View, ActivityIndicator } from "react-native";
// import { WebView } from "react-native-webview";

// const SignWellEmbed = ({
//   embeddedSigningUrl,
//   id,
//   documentId,
//   requestingRedirectUrl,
//   onCompleted,
//   onClosed,
//   onError,
// }:any) => {
//   const [loading, setLoading] = useState(true);
//   const [uri, setUri] = useState(null);

//   // This mimics your web useEffect
//   useEffect(() => {
//     if (embeddedSigningUrl) {
//       // Add query params like "start=edit_recipients" (optional, same as web)
//       const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
//       setUri(urlWithParams);
//     }

//     return () => {
//       // Cleanup if needed
//       setUri(null);
//     };
//   }, [embeddedSigningUrl]);

//   // Handle SignWell redirects/events
//   const handleNavigationChange = (event:any) => {
//     const { url } = event;

//     if (url.includes("completed")) {
//       onCompleted && onCompleted({ id: documentId });
//     } else if (url.includes("closed")) {
//       onClosed && onClosed({ id: documentId });
//     } else if (url.includes("error")) {
//       onError && onError({ id: documentId });
//     } else if (requestingRedirectUrl && url.startsWith(requestingRedirectUrl)) {
//       onCompleted && onCompleted({ id: documentId });
//     }
//   };

//   if (!uri) return null;

//   return (
//     <View style={{ flex: 1 ,height:1000}}>
//       {loading && <ActivityIndicator size="large" color="#00BFFF" />}
//       <WebView
//         source={{ uri }}
//         onLoadEnd={() => setLoading(false)}
//         onNavigationStateChange={handleNavigationChange}
//         javaScriptEnabled
//         domStorageEnabled
//         originWhitelist={["*"]}
//         startInLoadingState
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// };

// export default SignWellEmbed;

// import React, { useState, useEffect } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";
// import Services from "../Services/services";
// const SignWellEmbed = ({ route, navigation }: any) => {
//   const { embeddedSigningUrl, documentId, requestingRedirectUrl, handleClear,  onCompleted,
//   onClosed,
//   onError, } =
//     route.params || {};








//   const [loading, setLoading] = useState(true);
//   const [uri, setUri] = useState<string | null>(null);
// console.log("documentId",documentId);

//   // build signing url
//   useEffect(() => {
//     if (embeddedSigningUrl) {
//       const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
//       setUri(urlWithParams);
//     }
//     return () => setUri(null);
//   }, [embeddedSigningUrl]);

//   // helper: extract docId from signwell url
//   const extractDocIdFromUrl = (url: string) => {
//     const match = url.match(/document\/([a-f0-9-]+)\//);
//     return match ? match[1] : null;
//   };

//   // const handleNavigationChange = async (event: any) => {
//   //   const { url } = event;
//   //   console.log("🌐 Navigated:", url);

//   //   // check if we're on the document "done" page (SignWell keeps it simple)
//   //   if (url.includes("signwell_embedded_iframe=1") && url.includes("document/")) {
//   //     try {
//   //       const idFromUrl = extractDocIdFromUrl(url) || documentId;
//   //       console.log("📄 Extracted documentId:", idFromUrl);

//   //       if (!idFromUrl) {
//   //         console.warn("⚠️ Could not extract documentId from URL");
//   //         return;
//   //       }

//   //       // 1. check signwell status
//   //       const response = await Services.checkStatusSignWellDocument(idFromUrl);
//   //       console.log("✅ checkStatusSignWellDocument:", response);

//   //       if (response?.status) {
//   //         // 2. normalize recipients
//   //         const recipients = response.data?.recipients?.map((item: any) => {
//   //           const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
//   //           return {
//   //             ...itemRest,
//   //             signing_order: itemRest.signing_order ?? 0,
//   //             bounced_detail: bounced_details,
//   //             recipient_id: id,
//   //           };
//   //         });

//   //         // 3. build payload
//   //         const payload = {
//   //           signwell_doc_id: response.data.id,
//   //           custom_requester_name: response.data.custom_requester_name,
//   //           embedded_edit_url: response.data.embedded_edit_url,
//   //           requester_email_address: response.data.requester_email_address,
//   //           status: response.data.status,
//   //           subject: response.data.subject,
//   //           filename: response.data.name,
//   //           recipients,
//   //         };

//   //         // 4. send to backend
//   //         const saveRes = await Services.sendEsignDocsAction(payload);
//   //         console.log("📩 sendEsignDocsAction:", saveRes);
//   //       }

//   //       onCompleted && onCompleted({ id: idFromUrl });
//   //     } catch (err) {
//   //       console.error("❌ Error during completion:", err);
//   //       onError && onError(err);
//   //     }
//   //   } else if (url.includes("closed")) {
//   //     console.log("❌ SignWell closed:", documentId);
//   //     handleClear && handleClear();
//   //     onClosed && onClosed({ id: documentId });
//   //   } else if (url.includes("error")) {
//   //     console.log("⚠️ SignWell error:", documentId);
//   //     onError && onError({ id: documentId });
//   //   } else if (requestingRedirectUrl && url.startsWith(requestingRedirectUrl)) {
//   //     onCompleted && onCompleted({ id: documentId });
//   //   }
//   // };
// const handleNavigationChange = async (event: any) => {
//   const { url } = event;
//   console.log("🌐 Navigated:", url);

//   if (url.includes("closed")) {
//     console.log("❌ SignWell closed:", documentId);
//     handleClear && handleClear();
//     onClosed && onClosed({ id: documentId });
//     return;
//   }

//   if (url.includes("error")) {
//     console.log("⚠️ SignWell error:", documentId);
//     onError && onError({ id: documentId });
//     return;
//   }

//   if (requestingRedirectUrl && url.startsWith(requestingRedirectUrl)) {
//     onCompleted && onCompleted({ id: documentId });
//     return;
//   }

//   if (url.includes("signwell_embedded_iframe=1") && url.includes("document/")) {
//     try {
//       const finalDocId = documentId || extractDocIdFromUrl(url);
//       console.log("📄 Using documentId for API calls:", finalDocId);

//       if (!finalDocId) {
//         console.warn("⚠️ Could not determine documentId");
//         return;
//       }

//       const response = await Services.checkStatusSignWellDocument(finalDocId);
//       console.log("✅ checkStatusSignWellDocument:", response);

//       if (response?.status) {
//         const recipients = response.data?.recipients?.map((item: any) => {
//           const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
//           return {
//             ...itemRest,
//             signing_order: itemRest.signing_order ?? 0,
//             bounced_detail: bounced_details,
//             recipient_id: id,
//           };
//         });

//         const payload = {
//           signwell_doc_id: response.data.id,
//           custom_requester_name: response.data.custom_requester_name,
//           embedded_edit_url: response.data.embedded_edit_url,
//           requester_email_address: response.data.requester_email_address,
//           status: response.data.status,
//           subject: response.data.subject,
//           filename: response.data.name,
//           recipients,
//         };

//         const saveRes = await Services.sendeSignDocsSaga(payload);
//         console.log("📩 sendeSignDocsSaga:", saveRes);
//       }

//       onCompleted && onCompleted({ id: finalDocId });
//     } catch (err) {
//       console.error("❌ Error during completion:", err);
//       onError && onError(err);
//     }
//   }
// };


//   if (!uri) return null;

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#00BFFF" />}
//       <WebView
//         source={{ uri }}
//         onLoadEnd={() => setLoading(false)}
//         onNavigationStateChange={handleNavigationChange}
//         javaScriptEnabled
//         domStorageEnabled
//         originWhitelist={["*"]}
//         startInLoadingState
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff",height:1000, },
// });
// export default SignWellEmbed;


// import React, { useState, useEffect } from "react";
// import { View, ActivityIndicator, StyleSheet, BackHandler } from "react-native";
// import { WebView } from "react-native-webview";
// import Services from "../Services/services";

// const SignWellEmbed = ({ route, navigation }: any) => {
//   const { 
//     embeddedSigningUrl, 
//     documentId, 
//     requestingRedirectUrl, 
//     handleClear 
//   } = route.params || {};

//   const [loading, setLoading] = useState(true);
//   const [uri, setUri] = useState<string | null>(null);
//   const [isDocumentCompleted, setIsDocumentCompleted] = useState(false);

//   console.log("documentId", documentId);

//   // Build signing URL
//   useEffect(() => {
//     if (embeddedSigningUrl) {
//       const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
//       setUri(urlWithParams);
//     }
//     return () => setUri(null);
//   }, [embeddedSigningUrl]);

//   // Handle Android back button
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         handleCloseDocument();
//         return true;
//       }
//     );

//     return () => backHandler.remove();
//   }, []);

//   const handleCloseDocument = () => {
//     console.log("❌ Document closed by user");
//     handleClear && handleClear();
//     navigation.goBack();
//   };

//   const handleDocumentCompleted = async (finalDocId: string) => {
//     try {
//       console.log("✅ Document completed, finalDocId:", finalDocId);

//       // 1. Check SignWell status
//       const response = await Services.checkStatusSignWellDocument(finalDocId);
//       console.log("✅ checkStatusSignWellDocument:", response);

//       if (response?.status) {
//         // 2. Normalize recipients
//         const recipients = response.data?.recipients?.map((item: any) => {
//           const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
//           return {
//             ...itemRest,
//             signing_order: itemRest.signing_order ?? 0,
//             bounced_detail: bounced_details,
//             recipient_id: id,
//           };
//         });

//         // 3. Build payload
//         const payload = {
//           signwell_doc_id: response.data.id,
//           custom_requester_name: response.data.custom_requester_name,
//           embedded_edit_url: response.data.embedded_edit_url,
//           requester_email_address: response.data.requester_email_address,
//           status: response.data.status,
//           subject: response.data.subject,
//           filename: response.data.name,
//           recipients,
//         };

//         // 4. Send to backend (only when document is completed/sent)
//         const saveRes = await Services.sendeSignDocsSaga(payload);
//         console.log("📩 sendeSignDocsSaga response:", saveRes);

//         // Mark as completed
//         setIsDocumentCompleted(true);

//         // Navigate back after a short delay
//         setTimeout(() => {
//           navigation.goBack();
//         }, 1500);
//       }
//     } catch (err) {
//       console.error("❌ Error during completion:", err);
//     }
//   };

//   const extractDocIdFromUrl = (url: string) => {
//     const match = url.match(/document\/([a-f0-9-]+)\//);
//     return match ? match[1] : null;
//   };

//   const handleNavigationChange = async (event: any) => {
//     const { url } = event;
//     console.log("🌐 Navigated:", url);

//     // Check if document was completed (sent)
//     if (url.includes("signwell_embedded_iframe=1#") || url.includes("signwell_embedded_iframe=1#")) {
//       const finalDocId = documentId || extractDocIdFromUrl(url);
//       if (finalDocId && !isDocumentCompleted) {
//         await handleDocumentCompleted(finalDocId);
//       }
//       return;
//     }

//     // Check if document was closed without sending
//     if (url.includes("closed") || url.includes("action=closed")) {
//       console.log("❌ SignWell closed without sending:", documentId);
//       handleCloseDocument();
//       return;
//     }

//     // Check for errors
//     if (url.includes("error")) {
//       console.log("⚠️ SignWell error:", documentId);
//       handleCloseDocument();
//       return;
//     }

//     // Check for redirect URL completion
//     if (requestingRedirectUrl && url.startsWith(requestingRedirectUrl)) {
//       const finalDocId = documentId || extractDocIdFromUrl(url);
//       if (finalDocId && !isDocumentCompleted) {
//         await handleDocumentCompleted(finalDocId);
//       }
//       return;
//     }
//   };

//   if (!uri) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00BFFF" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#00BFFF" />
//         </View>
//       )}
//       <WebView
//         source={{ uri }}
//         onLoadEnd={() => setLoading(false)}
//         onNavigationStateChange={handleNavigationChange}
//         javaScriptEnabled
//         domStorageEnabled
//         originWhitelist={["*"]}
//         startInLoadingState
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#fff" 
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     zIndex: 999
//   }
// });

// export default SignWellEmbed;


import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, BackHandler, Linking, Alert, Button } from "react-native";
import { WebView } from "react-native-webview";
import Services from "../Services/services";

const SignWellEmbed = ({ route, navigation }: any) => {
  const { 
    embeddedSigningUrl, 
    documentId, 
    requestingRedirectUrl, 
    handleClear 
  } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [uri, setUri] = useState<string | null>(null);
  const [isDocumentCompleted, setIsDocumentCompleted] = useState(false);
const [isDesktop, setIsDesktop] = useState(true);
  console.log("documentId", documentId);
const isCompletedRef = useRef(false);
  // Build signing URL
  useEffect(() => {
    if (embeddedSigningUrl) {
      const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
      setUri(urlWithParams);
    }
    return () => setUri(null);
  }, [embeddedSigningUrl]);
  // useEffect(() => {
  //   if (embeddedSigningUrl) {
  //     const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
  //     console.log("🌐 Opening SignWell URL in browser:", urlWithParams);
  //     Linking.openURL(urlWithParams).catch(err => {
  //       console.error("❌ Failed to open URL:", err);
  //       Alert.alert("Error", "Unable to open signing link.");
  //     });
  //   }
  // }, [embeddedSigningUrl]);
  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleCloseDocument();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  // Safe navigation back function
  const safeGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } 
  };

  const handleCloseDocument = () => {
    console.log("❌ Document closed by user");
    handleClear && handleClear();
    safeGoBack();
  };
console.log("Initial ref:", isCompletedRef); 
// 👉 { current: false }

  const handleDocumentCompleted = async (finalDocId: string) => {
      if (isCompletedRef.current) return;
console.log("Initial ref value:", isCompletedRef.current); 

        isCompletedRef.current = true;
    try {
      console.log("✅ Document completed, finalDocId:", finalDocId);

      // 1. Check SignWell status
      const response = await Services.checkStatusSignWellDocument(finalDocId);
      console.log("✅ checkStatusSignWellDocument:", response);

      if (response?.status) {
        // 2. Normalize recipients
        const recipients = response.data?.recipients?.map((item: any) => {
          const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
          return {
            ...itemRest,
            signing_order: itemRest.signing_order ?? 0,
            bounced_detail: bounced_details,
            recipient_id: id,
          };
        });

        // 3. Build payload
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

        // 4. Send to backend (only when document is completed/sent)
        const saveRes = await Services.sendeSignDocsSaga(payload);
        console.log("📩 sendeSignDocsSaga response:", saveRes);

        // Mark as completed
        setIsDocumentCompleted(true);
handleClear && handleClear();
        // Navigate back after a short delay
        setTimeout(() => {
          safeGoBack();
        }, 10000);
      }
    } catch (err) {
      console.error("❌ Error during completion:", err);
    }
  };

  const extractDocIdFromUrl = (url: string) => {
    const match = url.match(/document\/([a-f0-9-]+)\//);
    return match ? match[1] : null;
  };

  const handleNavigationChange = async (event: any) => {
    const { url } = event;
    console.log("🌐 Navigated:", url);

    // Check if document was completed (sent)
    if (url.includes("signwell_embedded_iframe=1#") || url.includes("signwell_embedded_iframe=1#")) {
      const finalDocId = documentId || extractDocIdFromUrl(url);
      if (finalDocId && !isDocumentCompleted) {
        await handleDocumentCompleted(finalDocId);
      }
      return;
    }

    // Check if document was closed without sending
    if (url.includes("closed") || url.includes("action=closed")) {
      console.log("❌ SignWell closed without sending:", documentId);
      handleCloseDocument();
      return;
    }

    // Check for errors
    if (url.includes("error")) {
      console.log("⚠️ SignWell error:", documentId);
      handleCloseDocument();
      return;
    }

    // Check for redirect URL completion
    if (requestingRedirectUrl && url.startsWith(requestingRedirectUrl)) {
      const finalDocId = documentId || extractDocIdFromUrl(url);
      if (finalDocId && !isDocumentCompleted) {
        await handleDocumentCompleted(finalDocId);
      }
      return;
    }
  };

  if (!uri) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BFFF" />
        </View>
      )}
      {/* <WebView
        source={{ uri }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        startInLoadingState
        style={{ flex: 1 }}
      /> */}
      {/* <WebView
         style={{ flex: 1 ,width:"200%",height:'auto'}}
  source={{ uri }}
       onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationChange}
  userAgent={
    isDesktop
      ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
  }
/> */}
<WebView
  source={{ uri }}
  onLoadEnd={() => setLoading(false)}
  onNavigationStateChange={handleNavigationChange}
  javaScriptEnabled
  domStorageEnabled
  originWhitelist={["*"]}
  startInLoadingState
  style={{ flex: 1 }}
  // 👇 Force desktop user agent (Chrome on Windows)
  userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
/>


<Button
  title={isDesktop ? "Switch to Mobile View" : "Switch to Desktop View"}
  onPress={() => setIsDesktop(!isDesktop)}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999
  }
});

export default SignWellEmbed;



// import React, { useState, useEffect } from "react";
// import { View, ActivityIndicator, StyleSheet, BackHandler, Alert } from "react-native";
// import { WebView } from "react-native-webview";
// import Services from "../Services/services";

// const SignWellEmbed = ({ route, navigation }: any) => {
//   const { 
//     embeddedSigningUrl, 
//     documentId, 
//     requestingRedirectUrl, 
//     handleClear 
//   } = route.params || {};

//   const [loading, setLoading] = useState(true);
//   const [uri, setUri] = useState<string | null>(null);
//   const [isDocumentCompleted, setIsDocumentCompleted] = useState(false);

//   console.log("📄 documentId:", documentId);

//   // Build signing URL
//   useEffect(() => {
//     if (embeddedSigningUrl) {
//       const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
//       setUri(urlWithParams);
//     }
//     return () => setUri(null);
//   }, [embeddedSigningUrl]);

//   // Handle Android back button
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       () => {
//         handleCloseDocument();
//         return true;
//       }
//     );

//     return () => backHandler.remove();
//   }, []);

//   const safeGoBack = () => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     }
//   };

//   // 🔴 Handle Close
//   const handleCloseDocument = () => {
//     console.log("❌ Document closed by user");
//     handleClear && handleClear();
//     Alert.alert("Closed", "You closed the signing process.");
//     safeGoBack();
//   };

//   // 🟢 Handle Completed
//   const handleDocumentCompleted = async (finalDocId: string) => {
//     try {
//       console.log("✅ Document completed, finalDocId:", finalDocId);

//       const response = await Services.checkStatusSignWellDocument(finalDocId);
//       console.log("✅ checkStatusSignWellDocument:", response);

//       if (response?.status) {
//         const recipients = response.data?.recipients?.map((item: any) => {
//           const { id, bounced_details, attachment_requests, ...itemRest } = item || {};
//           return {
//             ...itemRest,
//             signing_order: itemRest.signing_order ?? 0,
//             bounced_detail: bounced_details,
//             recipient_id: id,
//           };
//         });

//         const payload = {
//           signwell_doc_id: response.data.id,
//           custom_requester_name: response.data.custom_requester_name,
//           embedded_edit_url: response.data.embedded_edit_url,
//           requester_email_address: response.data.requester_email_address,
//           status: response.data.status,
//           subject: response.data.subject,
//           filename: response.data.name,
//           recipients,
//         };

//         // Save to backend
//         await Services.sendeSignDocsSaga(payload);

//         setIsDocumentCompleted(true);
//         Alert.alert("Completed", "The document has been signed successfully.");

//         // Go back after short delay
//         setTimeout(() => {
//           safeGoBack();
//         }, 3000);
//       }
//     } catch (err) {
//       console.error("❌ Error during completion:", err);
//       handleError("Something went wrong while completing the document.");
//     }
//   };

//   // ⚠️ Handle Error
//   const handleError = (msg: string) => {
//     console.log("⚠️ SignWell error:", msg);
//     Alert.alert("Error", msg);
//     handleClear && handleClear();
//     safeGoBack();
//   };

//   const extractDocIdFromUrl = (url: string) => {
//     const match = url.match(/document\/([a-f0-9-]+)\//);
//     return match ? match[1] : null;
//   };

//   // 📡 Watch navigation inside WebView for events
//   const handleNavigationChange = async (event: any) => {
//     const { url } = event;
//     console.log("🌐 Navigated:", url);

//     // Completed
//     if (url.includes("signwell_embedded_iframe=1#")) {
//       const finalDocId = documentId || extractDocIdFromUrl(url);
//       if (finalDocId && !isDocumentCompleted) {
//         await handleDocumentCompleted(finalDocId);
//       }
//       return;
//     }

//     // Closed
//     if (url.includes("closed") || url.includes("action=closed")) {
//       handleCloseDocument();
//       return;
//     }

//     // Error
//     if (url.includes("error")) {
//       handleError("There was an error in the signing process.");
//       return;
//     }

//     // Redirect after completion
//     if (requestingRedirectUrl && url.startsWith(requestingRedirectUrl)) {
//       const finalDocId = documentId || extractDocIdFromUrl(url);
//       if (finalDocId && !isDocumentCompleted) {
//         await handleDocumentCompleted(finalDocId);
//       }
//     }
//   };

//   if (!uri) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00BFFF" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#00BFFF" />
//         </View>
//       )}
//       <WebView
//         source={{ uri }}
//         onLoadEnd={() => setLoading(false)}
//         onNavigationStateChange={handleNavigationChange}
//         javaScriptEnabled
//         domStorageEnabled
//         originWhitelist={["*"]}
//         startInLoadingState
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   loadingContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     zIndex: 999,
//   },
// });

// export default SignWellEmbed;



// import React, { useEffect } from "react";
// import { Alert, BackHandler, Linking } from "react-native";
// import Services from "../Services/services";

// const SignWellEmbed = ({ route, navigation }: any) => {
//   const { 
//     embeddedSigningUrl, 
//     documentId, 
//     requestingRedirectUrl, 
//     handleClear 
//   } = route.params || {};

//   // Build and open signing URL in system browser
//   useEffect(() => {
//     if (embeddedSigningUrl) {
//       const urlWithParams = `${embeddedSigningUrl}?start=edit_recipients&type=request_signature`;
//       console.log("🌐 Opening SignWell URL in browser:", urlWithParams);
//       Linking.openURL(urlWithParams).catch(err => {
//         console.error("❌ Failed to open URL:", err);
//         Alert.alert("Error", "Unable to open signing link.");
//       });
//     }
//   }, [embeddedSigningUrl]);

//   // Handle Android back button
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
//       handleCloseDocument();
//       return true;
//     });

//     return () => backHandler.remove();
//   }, []);

//   const safeGoBack = () => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     }
//   };

//   // 🔴 Handle Close
//   const handleCloseDocument = () => {
//     console.log("❌ Document closed by user");
//     handleClear && handleClear();
//     Alert.alert("Closed", "You closed the signing process.");
//     safeGoBack();
//   };

//   // 🟢 Handle Completed (optional — triggered after redirect/callback)
//   const handleDocumentCompleted = async (finalDocId: string) => {
//     try {
//       console.log("✅ Document completed, finalDocId:", finalDocId);

//       const response = await Services.checkStatusSignWellDocument(finalDocId);
//       console.log("✅ checkStatusSignWellDocument:", response);

//       if (response?.status) {
//         await Services.sendeSignDocsSaga(response.data);

//         Alert.alert("Completed", "The document has been signed successfully.");
//         setTimeout(() => safeGoBack(), 3000);
//       }
//     } catch (err) {
//       console.error("❌ Error during completion:", err);
//       handleError("Something went wrong while completing the document.");
//     }
//   };

//   // ⚠️ Handle Error
//   const handleError = (msg: string) => {
//     console.log("⚠️ SignWell error:", msg);
//     Alert.alert("Error", msg);
//     handleClear && handleClear();
//     safeGoBack();
//   };

//   return null; // nothing to render, since we open the browser directly
// };

// export default SignWellEmbed;
