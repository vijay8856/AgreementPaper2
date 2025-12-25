// // src/components/UpdateChecker.js
// import React, { useEffect } from 'react';
// import { Alert } from 'react-native';
// import InAppUpdates from 'sp-react-native-in-app-updates';

// const UpdateChecker = () => {
//   const inAppUpdates = new InAppUpdates();

//   useEffect(() => {
//     const checkForUpdate = async () => {
//       try {
//         const update = await inAppUpdates.checkNeedsUpdate();
//         if (update.shouldUpdate) {
//           Alert.alert(
//             'Update Available',
//             'A new version of the app is available. Please update to continue.',
//             [
//               {
//                 text: 'Update Now',
//                 onPress: () => startUpdate(),
//               },
//               {
//                 text: 'Later',
//                 style: 'cancel',
//               },
//             ]
//           );
//         }
//       } catch (err) {
//         console.log('Update check error:', err);
//       }
//     };

//     const startUpdate = async () => {
//       try {
//         await inAppUpdates.startUpdate({
//           updateType: inAppUpdates.UpdateType.FLEXIBLE, 
//         });
//       } catch (err) {
//         console.log('Update start error:', err);
//       }
//     };

//     checkForUpdate();
//   }, []);

//   return null; 
// };

// export default UpdateChecker;


import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import InAppUpdates from "sp-react-native-in-app-updates";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.agreementpaperapp2";

const UpdateChecker = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const iap = new InAppUpdates(false);
        const result = await iap.checkNeedsUpdate();

        console.log("CHECK RESULT:", result);

        if (result.shouldUpdate) {
          setVisible(true);
        }
      } catch (error) {
        console.log("Update Check Error:", error);
      }
    };

    checkUpdate();
  }, []);

  const startUpdate = () => {
    Linking.openURL(PLAY_STORE_URL);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={require("../assets/images/a200.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            A new version of Agreement Paper is available. Please update to
            continue.
          </Text>

          <TouchableOpacity style={styles.button} onPress={startUpdate}>
            <Text style={styles.buttonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateChecker;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 10,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#00007B",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#00007B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  progressContainer: {
    width: "100%",
    backgroundColor: "#00007B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  progressText: {
    marginTop: 8,
    color: "#fff",
    fontSize: 15,
  },
});
