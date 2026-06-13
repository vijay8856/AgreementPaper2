
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


