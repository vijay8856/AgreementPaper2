// // UpdateChecker.tsx

// import React, { useEffect } from 'react';
// import { Platform, Alert } from 'react-native';
// import SpInAppUpdates, {
//   StartUpdateOptions,
//   IAUUpdateKind,
// } from 'sp-react-native-in-app-updates';

// const UpdateChecker = () => {
//   useEffect(() => {
//     // Only run on Android, Play In-App Updates works only on Android devices
//     if (Platform.OS !== 'android') return;

//     const checkUpdate = async () => {
//       try {
//         const inAppUpdates = new SpInAppUpdates(false);  // false for isDebug
//         const result = await inAppUpdates.checkNeedsUpdate();

//         if (result.shouldUpdate) {
//           // Choose update type: Flexible vs Immediate
//           const updateOptions: StartUpdateOptions = {
//             updateType: IAUUpdateKind.IMMEDIATE,  // or FLEXIBLE if you want background
//           };

//           // you may want to show a confirmation dialog
//           Alert.alert(
//             'Update available',
//             'A new version is available. Would you like to update now?',
//             [
//               {
//                 text: 'Later',
//                 style: 'cancel',
//               },
//               {
//                 text: 'Update',
//                 onPress: () => {
//                   inAppUpdates.startUpdate(updateOptions);
//                 },
//               },
//             ],
//             { cancelable: false }
//           );
//         }
//       } catch (updateError) {
//         console.log('Error checking app update:', updateError);
//         // handle error or ignore
//       }
//     };

//     checkUpdate();
//   }, []);

//   return null;  // If this component is just for checking, it doesn’t need to render UI
// };

// export default UpdateChecker;
