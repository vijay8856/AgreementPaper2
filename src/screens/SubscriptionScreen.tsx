// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import {
//   useIAP,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   finishTransaction,
// } from 'react-native-iap';
// import Services from '../Services/services';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// const SUB_IDS = ['base_plan_yearly'];

// export default function SubscriptionScreen() {
//   const {
//     connected,
//     subscriptions,
//     fetchProducts,
//     requestPurchase,
//     getAvailablePurchases,
//     hasActiveSubscriptions,
//   } = useIAP();

//   const [iapLog, setIapLog] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [purchaseResponse, setPurchaseResponse] = useState(null);
// const [activeSubscription, setActiveSubscription] = useState(null);

//   useEffect(() => {
//     if (!connected) return;
//     fetchProducts({ skus: SUB_IDS, type: 'subs' })
//       .then(() => setIapLog('✅ Products fetched successfully'))
//       .catch((e) => setIapLog('❌ Fetch failed: ' + e.message));
//   }, [connected]);

// // useEffect(() => {
// //   if (connected) {
// //     checkActive();
// //   }
// // }, [connected]);


//   // 📡 Listen for Purchase Updates
//   useEffect(() => {
//    const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
//   console.log('✅ Purchase received:', purchase);
//   setPurchaseResponse(purchase);
//   setIapLog('✅ Purchase successful!');

//   // ✅ Finish transaction to avoid double billing
//   try {
//     await finishTransaction({ purchase, isConsumable: false });
//   } catch (err) {
//     console.log('⚠️ finishTransaction error:', err);
//   }

//   // ✅ Extract purchaseToken and send to backend
//   const token = purchase?.purchaseToken;
//   if (token) {  
//     try {
//       const response = await Services.googleSubcription({ token });
//       console.log('✅ Subscription verified:', response);
//       Alert.alert('Success', 'Subscription validated successfully.');
//     } catch (error) {
//       console.log('❌ Subscription API failed:', error);
//       Alert.alert('Error', 'Failed to validate subscription.');
//     }
//   } else {
//     console.log('❌ No purchaseToken found in purchase response');
//   }
// });


//     const purchaseError = purchaseErrorListener((error) => {
//       console.log('❌ Purchase Error:', error);
//       setIapLog(`Purchase error: ${error.message}`);
//     });

//     return () => {
//       purchaseUpdate.remove();
//       purchaseError.remove();
//     };
//   }, []);

//   // 🛒 Purchase Function
//   const buySubscription = async (id) => {
//     try {
//       setLoading(true);
//       setIapLog('Starting purchase...');
//       await requestPurchase({
//         request: { android: { skus: [id] } },
//         type: 'subs',
//       });
//       setIapLog('Purchase flow started...');
//     } catch (err) {
//       console.error(err);
//       setIapLog('❌ Error: ' + JSON.stringify(err));
//       if (err?.code !== 'USER_CANCELLED') {
//         Alert.alert('Purchase error', err?.message || 'Failed to start purchase');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const restorePurchases = async () => {
//     try {
//       setLoading(true);
//       const purchases = await getAvailablePurchases();
//       Alert.alert('Restore', `Found ${purchases?.length || 0} purchases`);
//     } catch (err) {
//       Alert.alert('Restore failed', err?.message || String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

// const checkActive = async () => {
//   try {
//     const purchases = await getAvailablePurchases();

//     if (purchases && purchases.length > 0) {
//       const active = purchases.find((p) => SUB_IDS.includes(p.productId));

//       if (active) {
//         setActiveSubscription(active);
//         Alert.alert(
//           '✅ Active Subscription',
//           `You have an active plan: ${active.productId}`,
//           [
//             { text: 'Close', style: 'cancel' }, 
//           ]
//         );
//       } else {
//         setActiveSubscription(null);
//         Alert.alert(
//           'ℹ️ No Active Subscription',
//           'You do not have an active subscription.',
//           [
//             { text: 'Close', style: 'cancel' },
//           ]
//         );
//       }
//     } else {
//       setActiveSubscription(null);
//       Alert.alert(
//         'ℹ️ No Purchases Found',
//         'You haven’t made any purchases yet.',
//         [
//           { text: 'Close', style: 'cancel' },
//         ]
//       );
//     }
//   } catch (err) {
//     console.error('Check Active Error:', err);
//     Alert.alert(
//       'Error',
//       err?.message || String(err),
//       [
//         { text: 'Close', style: 'cancel' },
//       ]
//     );
//   }
// };


//   if (!connected) {
//     return (
//       <View style={styles.centered}>
//         <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
//         <ActivityIndicator size="large" color="#0E3386" />
//       </View>
//     );
//   }






//   const sub = subscriptions?.find((s) => s.id === SUB_IDS[0]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Agreement Paper Pro</Text>
// {sub ? (
//   <View style={styles.card}>
//     <Text style={styles.subTitle}>{sub.title}</Text>
//     <Text style={styles.description}>{sub.description}</Text>
//     <Text style={styles.price}>{sub.displayPrice}</Text>

//     {/* ✅ Subscription Benefits */}
//     {[
//       'Essential eSign and contracting for business users and freelancers',
//       'Everything included in the Personal Plan',
//       'Unlimited document and contract creation',
//       'Unlimited eSignatures',
//       'Unlimited team collaboration',
//       'Comprehensive audit trails',
//       'Priority email support',
//     ].map((item, index) => (
//       <View key={index} style={styles.benefitItem}>
//         <Icon
//           name="check-circle"
//           size={20}
//           color="#0E3386"
//           style={styles.benefitIcon}
//         />
//         <Text style={styles.benefitText}>{item}</Text>
//       </View>
//     ))}

//     <TouchableOpacity
//       style={[styles.button, loading && styles.buttonDisabled]}
//       onPress={() => buySubscription(sub.id)}
//       disabled={loading}
//     >
//       {loading ? (
//         <ActivityIndicator color="#fff" />
//       ) : (
//         <Text style={styles.buttonText}>Subscribe Now</Text>
//       )}
//     </TouchableOpacity>
//   </View>
// ) : (
//   <View style={styles.centered}>
//     <Text style={{ fontSize: 16, marginBottom: 10 }}>
//       Loading subscription details...
//     </Text>
//     <ActivityIndicator size="large" color="#0E3386" />
//   </View>
// )}


//       <View style={{ height: 20 }} />

//       <TouchableOpacity style={styles.outlineButton} onPress={restorePurchases}>
//         <Text style={styles.outlineButtonText}>Restore Purchases</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.outlineButton} onPress={checkActive}>
//         <Text style={styles.outlineButtonText}>Check Active Subscription</Text>
//       </TouchableOpacity>

//       {/* ✅ Show IAP Debug Info */}
//       {/* <Text style={{ marginTop: 20, color: 'gray', fontSize: 12 }}>
//         Debug Log: {iapLog}
//       </Text> */}

// {activeSubscription ? (
//   <View style={styles.activeBox}>
//     <Text style={styles.activeText}>
//       🎉 Active Plan: {activeSubscription.productId === SUB_IDS[0] ? 'Base Plan (1 Year)' : activeSubscription.productId}
//     </Text>
//     <Text style={styles.activeDate}>
//       Purchased on: {new Date(activeSubscription.transactionDate).toLocaleDateString()}
//     </Text>
//   </View>
// ) : (
//   <Text style={{ color: '#999', marginBottom: 10 }}>
//     No active subscription found.
//   </Text>
// )}

//       {/* {purchaseResponse && (
//         <View style={{ marginTop: 20 }}>
//           <Text style={{ fontWeight: '600', fontSize: 14, marginBottom: 5 }}>
//             Purchase Response:
//           </Text>
//           <Text
//             style={{
//               backgroundColor: '#f0f0f0',
//               padding: 10,
//               borderRadius: 8,
//               fontSize: 12,
//             }}
//           >
//             {JSON.stringify(purchaseResponse, null, 2)}
//           </Text>
//         </View>
//       )} */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f6f7fb',
//     flexGrow: 1,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   benefitItem: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   marginVertical: 4,
// },
// benefitIcon: {
//   marginRight: 8,
// },
// benefitText: {
//   flex: 1,
//   color: '#333',
//   fontSize: 14,
// },
//    activeBox: {
//     backgroundColor: '#E8F5E9',
//     borderColor: '#4CAF50',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//   },
//   activeText: {
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     fontSize: 15,
//   },
//   activeDate: {
//     color: '#388E3C',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#0E3386',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#0E3386',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 20,
//     color: '#fbbf24',
//   },
//   button: {
//     backgroundColor: '#0E3386',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop:10
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   outlineButton: {
//     borderWidth: 1,
//     borderColor: '#0E3386',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   outlineButtonText: {
//     color: '#0E3386',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });














// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   StyleSheet,
// //   ScrollView,
// // } from 'react-native';
// // import {
// //   useIAP,
// //   purchaseUpdatedListener,
// //   purchaseErrorListener,
// //   finishTransaction,
// // } from 'react-native-iap';
// // import Services from '../Services/services';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const SUB_IDS = ['agreement_subscription_3'];

// // export default function SubscriptionScreen() {
// //   const {
// //     connected,
// //     subscriptions,
// //     fetchProducts,
// //     requestPurchase,
// //     getAvailablePurchases,
// //     hasActiveSubscriptions,
// //   } = useIAP();

// //   const [iapLog, setIapLog] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [purchaseResponse, setPurchaseResponse] = useState(null);
// //   const [activeSubscription, setActiveSubscription] = useState(false);
// //   const [subscriptionInfo, setSubscriptionInfo] = useState(null);

// //   useEffect(() => {
// //     if (!connected) return;
// //     fetchProducts({ skus: SUB_IDS, type: 'subs' })
// //       .then((res) => {
// //         setIapLog('✅ Products fetched successfully');
// //         setSubscriptionInfo(res[0]);
// //       })
// //       .catch((e) => setIapLog('❌ Fetch failed: ' + e.message));
// //   }, [connected]);

// //   // 📡 Listen for Purchase Updates
// //   useEffect(() => {
// //     const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
// //       console.log('✅ Purchase received:', purchase);
// //       setPurchaseResponse(purchase);
// //       setIapLog('✅ Purchase successful!');

// //       try {
// //         await finishTransaction({ purchase, isConsumable: false });
// //       } catch (err) {
// //         console.log('⚠️ finishTransaction error:', err);
// //       }

// //       const token = purchase?.purchaseToken;
// //       if (token) {
// //          try {
// //     const response = await Services.googleSubcription({ token });
// //     console.log('✅ Subscription verified:', response);

// //     if (response?.isActive) {
// //       setActiveSubscription(true);
// //       await AsyncStorage.setItem('subscriptionStatus', JSON.stringify({
// //         isActive: true,
// //         planName: 'Agreement Paper Pro',
// //         updatedAt: new Date().toISOString(),
// //       }));
// //       Alert.alert('Success', 'Subscription validated successfully.');
// //     } else {
// //       setActiveSubscription(false);
// //       Alert.alert('Inactive', 'Subscription is not active.');
// //     }
// //   } catch (error) {
// //     console.log('❌ Subscription API failed:', error);
// //     Alert.alert('Error', 'Failed to validate subscription.');
// //   }
// //       } else {
// //         console.log('❌ No purchaseToken found in purchase response');
// //       }
// //     });

// //     const purchaseError = purchaseErrorListener((error) => {
// //       console.log('❌ Purchase Error:', error);
// //       setIapLog(`Purchase error: ${error.message}`);
// //     });

// //     return () => {
// //       purchaseUpdate.remove();
// //       purchaseError.remove();
// //     };
// //   }, []);

// //   // 🧾 Check Active Subscription on Mount
// // // useEffect(() => {
// // //   const checkActiveSub = async () => {
// // //     try {
// // //       const active = await hasActiveSubscriptions(SUB_IDS);
// // //       setActiveSubscription(active);
// // //       console.log('Active Subscription:', active);

// // //       // 🧠 Save to AsyncStorage
// // //       const subData = {
// // //         isActive: active,
// // //         planName: active ? 'Agreement Paper Pro' : null,
// // //         updatedAt: new Date().toISOString(),
// // //       };
// // //       await AsyncStorage.setItem('subscriptionStatus', JSON.stringify(subData));
// // //       console.log('✅ Saved subscription status:', subData);

// // //     } catch (err) {
// // //       console.error('Check active error:', err);
// // //     }
// // //   };
// // //   checkActiveSub();
// // // }, []);

// // useEffect(() => {
// //   const checkActiveSub = async () => {
// //     try {
// //       // 1️⃣ Get Google Play’s local active status
// //       const playStoreActive = await hasActiveSubscriptions(SUB_IDS);
// //       console.log('📱 Local PlayStore Active:', playStoreActive);

// //       // 2️⃣ Ask backend to confirm (to prevent false positives)
// //       const userToken = await AsyncStorage.getItem('userToken'); // or your auth key
// //       const response = await Services.googleSubcription({ token: userToken }); 
// //       // Example backend API to verify status from your DB or Google API
// //       console.log('🌐 Backend response:', response);

// //       // 3️⃣ Determine final active status
// //       const isActive = response?.isActive === true && playStoreActive === true;

// //       setActiveSubscription(isActive);

// //       const subData = {
// //         isActive,
// //         planName: isActive ? 'Agreement Paper Pro' : null,
// //         updatedAt: new Date().toISOString(),
// //       };

// //       await AsyncStorage.setItem('subscriptionStatus', JSON.stringify(subData));
// //       console.log('✅ Final subscription status saved:', subData);

// //     } catch (err) {
// //       console.error('❌ Check active error:', err);
// //       setActiveSubscription(false);
// //     }
// //   };

// //   checkActiveSub();
// // }, []);













// //   // 🛒 Purchase Function
// //   const buySubscription = async (id) => {
// //     try {
// //       setLoading(true);
// //       setIapLog('Starting purchase...');
// //       await requestPurchase({
// //         request: { android: { skus: [id] } },
// //         type: 'subs',
// //       });
// //       setIapLog('Purchase flow started...');
// //     } catch (err) {
// //       console.error(err);
// //       setIapLog('❌ Error: ' + JSON.stringify(err));
// //       if (err?.code !== 'USER_CANCELLED') {
// //         Alert.alert('Purchase error', err?.message || 'Failed to start purchase');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const restorePurchases = async () => {
// //     try {
// //       setLoading(true);
// //       const purchases = await getAvailablePurchases();
// //       Alert.alert('Restore', `Found ${purchases?.length || 0} purchases`);
// //     } catch (err) {
// //       Alert.alert('Restore failed', err?.message || String(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const checkActive = async () => {
// //     try {
// //       const active = await hasActiveSubscriptions(SUB_IDS);
// //       setActiveSubscription(active);
// //       Alert.alert('Active subscription', active ? 'Yes' : 'No');
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   if (!connected) {
// //     return (
// //       <View style={styles.centered}>
// //         <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
// //         <ActivityIndicator size="large" color="#0E3386" />
// //       </View>
// //     );
// //   }

// //   const sub = subscriptions?.find((s) => s.id === SUB_IDS[0]);

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.title}>Agreement Paper Pro</Text>
// // <View style={styles.benefitsSection}>
// //   <Text style={styles.sectionTitle}>What You’ll Get with This Plan</Text>
// //   <Text style={styles.sectionSubtitle}>
// //     Unlock all the essential tools for seamless business contracts and eSignatures.
// //   </Text>

// //   <View style={styles.benefitList}>
// //     {[
// //       "Essential eSign and contracting for business users and freelancers",
// //       "Everything included in the Personal Plan",
// //       "Unlimited document and contract creation",
// //       "Unlimited eSignatures",
// //       "Unlimited team collaboration",
// //       "Comprehensive audit trails",
// //       "Priority email support",
// //     ].map((item, index) => (
// //       <View key={index} style={styles.benefitItem}>
// //         <Icon name="check-circle" size={20} color="#0E3386" style={styles.benefitIcon} />
// //         <Text style={styles.benefitText}>{item}</Text>
// //       </View>
// //     ))}
// //   </View>
// // </View>

// //       {sub ? (
// //         <View style={styles.card}>
// //           <Text style={styles.subTitle}>{sub.title}</Text>
// //           <Text style={styles.description}>{sub.description}</Text>
// //           <Text style={styles.price}>{sub.displayPrice}</Text>

// //           {activeSubscription ? (
// //             <TouchableOpacity style={[styles.subscribedBtn]} disabled>
// //               <Text style={styles.subscribedText}>✅ Subscribed</Text>
// //             </TouchableOpacity>
// //           ) : (
// //             <TouchableOpacity
// //               style={[styles.button, loading && styles.buttonDisabled]}
// //               onPress={() => buySubscription(sub.id)}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <ActivityIndicator color="#fff" />
// //               ) : (
// //                 <Text style={styles.buttonText}>Subscribe Now</Text>
// //               )}
// //             </TouchableOpacity>
// //           )}

// //           {purchaseResponse && (
// //             <View style={styles.infoBox}>
// //               <Text style={styles.infoTitle}>Subscription Info</Text>
// //               <Text style={styles.infoText}>
// //                 Plan: {sub.title}
// //               </Text>
// //               <Text style={styles.infoText}>
// //                 Status: {activeSubscription ? 'Active' : 'Inactive'}
// //               </Text>
// //               <Text style={styles.infoText}>
// //                 Purchase Date:{' '}
// //                 {new Date(purchaseResponse.transactionDate).toLocaleString()}
// //               </Text>
// //               <Text style={styles.infoText}>
// //                 Platform: {purchaseResponse.platform}
// //               </Text>
// //             </View>
// //           )}
// //         </View>
// //       ) : (
// //         <View style={styles.centered}>
// //           <Text style={{ fontSize: 16, marginBottom: 10 }}>
// //             Loading subscription details...
// //           </Text>
// //           <ActivityIndicator size="large" color="#0E3386" />
// //         </View>
// //       )}

// //       <TouchableOpacity style={styles.outlineButton} onPress={restorePurchases}>
// //         <Text style={styles.outlineButtonText}>Restore Purchases</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity style={styles.outlineButton} onPress={checkActive}>
// //         <Text style={styles.outlineButtonText}>Check Active Subscription</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { padding: 20, backgroundColor: '#f6f7fb', flexGrow: 1 },
// //   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#0E3386',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 20,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,
// //     shadowOffset: { width: 0, height: 5 },
// //     elevation: 5,
// //   },
// //   subTitle: { fontSize: 20, fontWeight: '600', color: '#0E3386', marginBottom: 10 },
// //   description: { fontSize: 14, color: '#555', marginBottom: 15 },
// //   price: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: '#fbbf24' },
// //   button: {
// //     backgroundColor: '#0E3386',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   subscribedBtn: {
// //     backgroundColor: '#10B981',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   subscribedText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// //   buttonDisabled: { opacity: 0.6 },
// //   buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// //   outlineButton: {
// //     borderWidth: 1,
// //     borderColor: '#0E3386',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 16,
// //     backgroundColor: '#fff',
// //   },
// //   outlineButtonText: { color: '#0E3386', fontSize: 14, fontWeight: '600' },
// //   infoBox: {
// //     marginTop: 20,
// //     backgroundColor: '#f0f4ff',
// //     borderRadius: 10,
// //     padding: 15,
// //   },
// //   infoTitle: { fontWeight: '700', fontSize: 16, color: '#0E3386', marginBottom: 8 },
// //   infoText: { fontSize: 13, color: '#333', marginBottom: 3 },
// //   benefitsSection: {
// //   backgroundColor: '#f8faff',
// //   borderRadius: 10,
// //   padding: 16,
// //   marginVertical: 16,
// //   shadowColor: '#000',
// //   shadowOpacity: 0.1,
// //   shadowRadius: 4,
// //   shadowOffset: { width: 0, height: 2 },
// //   elevation: 3,
// // },
// // sectionTitle: {
// //   fontSize: 18,
// //   fontWeight: 'bold',
// //   color: '#0E3386',
// //   marginBottom: 6,
// // },
// // sectionSubtitle: {
// //   fontSize: 14,
// //   color: '#555',
// //   marginBottom: 14,
// // },
// // benefitList: {
// //   marginTop: 4,
// // },
// // benefitItem: {
// //   flexDirection: 'row',
// //   alignItems: 'flex-start',
// //   marginBottom: 10,
// // },
// // benefitIcon: {
// //   marginRight: 8,
// //   marginTop: 2,
// // },
// // benefitText: {
// //   flex: 1,
// //   fontSize: 14,
// //   color: '#333',
// //   lineHeight: 20,
// // },

// // });


// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   StyleSheet,
// //   ScrollView,
// // } from 'react-native';
// // import {
// //   useIAP,
// //   purchaseUpdatedListener,
// //   purchaseErrorListener,
// //   finishTransaction,
// // } from 'react-native-iap';
// // import Services from '../Services/services';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const SUB_IDS = ['agreement_subscription_3'];

// // export default function SubscriptionScreen() {
// //   const {
// //     connected,
// //     subscriptions,
// //     fetchProducts,
// //     requestPurchase,
// //     getAvailablePurchases,
// //     hasActiveSubscriptions,
// //   } = useIAP();

// //   const [loading, setLoading] = useState(false);
// //   const [purchaseResponse, setPurchaseResponse] = useState(null);
// //   const [activeSubscription, setActiveSubscription] = useState(false);
// //   const [subscriptionInfo, setSubscriptionInfo] = useState(null);

// //   // 🧩 Fetch product info when connected
// //   useEffect(() => {
// //     if (!connected) return;
// //     fetchProducts({ skus: SUB_IDS, type: 'subs' })
// //       .then((res) => {
// //         console.log('✅ Products fetched:', res);
// //         if (res && res.length > 0) setSubscriptionInfo(res[0]);
// //       })
// //       .catch((e) => console.log('❌ Fetch failed:', e.message));
// //   }, [connected]);

// //   // 📡 Listen for Purchase Updates
// //   useEffect(() => {
// //     const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
// //       console.log('✅ Purchase received:', purchase);
// //       setPurchaseResponse(purchase);

// //       try {
// //         await finishTransaction({ purchase, isConsumable: false });
// //       } catch (err) {
// //         console.log('⚠️ finishTransaction error:', err);
// //       }

// //       const token = purchase?.purchaseToken;
// //       if (token) {
// //         try {
// //           const response = await Services.googleSubcription({ token });
// //           console.log('🌐 Backend verify response:', response);

// //           if (response?.isActive) {
// //             setActiveSubscription(true);
// //             await AsyncStorage.setItem(
// //               'subscriptionStatus',
// //               JSON.stringify({
// //                 isActive: true,
// //                 planName: 'Agreement Paper Pro',
// //                 purchaseToken: token,
// //                 updatedAt: new Date().toISOString(),
// //               })
// //             );
// //             Alert.alert('Success', 'Subscription validated successfully.');
// //           } else {
// //             setActiveSubscription(false);
// //             Alert.alert('Inactive', 'Subscription is not active.');
// //           }
// //         } catch (error) {
// //           console.log('❌ Subscription API failed:', error);
// //           Alert.alert('Error', 'Failed to validate subscription.');
// //         }
// //       } else {
// //         console.log('❌ No purchaseToken found in purchase response');
// //       }
// //     });

// //     const purchaseError = purchaseErrorListener((error) => {
// //       console.log('❌ Purchase Error:', error);
// //       Alert.alert('Purchase Error', error.message);
// //     });

// //     return () => {
// //       purchaseUpdate.remove();
// //       purchaseError.remove();
// //     };
// //   }, []);

// //   // 🧾 Check Active Subscription on Mount
// //   useEffect(() => {
// //     const checkActiveSub = async () => {
// //       try {
// //         // 1️⃣ Local Play Store active status
// //         const playStoreActive = await hasActiveSubscriptions(SUB_IDS);
// //         console.log('📱 Local PlayStore Active:', playStoreActive);

// //         // 2️⃣ Get last saved purchase token
// //         const storedData = await AsyncStorage.getItem('subscriptionStatus');
// //         let token = null;
// //         if (storedData) {
// //           const parsed = JSON.parse(storedData);
// //           token = parsed?.purchaseToken;
// //         }

// //         // If no saved token, rely on local Play Store status
// //         if (!token) {
// //           console.log('⚠️ No stored purchase token found');
// //           setActiveSubscription(playStoreActive);
// //           return;
// //         }

// //         // 3️⃣ Verify with backend
// //         const response = await Services.googleSubcription({ token });
// //         console.log('🌐 Backend verification:', response);

// //         const isActive = response?.isActive === true && playStoreActive === true;
// //         setActiveSubscription(isActive);

// //         const subData = {
// //           isActive,
// //           planName: isActive ? 'Agreement Paper Pro' : null,
// //           purchaseToken: token,
// //           updatedAt: new Date().toISOString(),
// //         };
// //         await AsyncStorage.setItem('subscriptionStatus', JSON.stringify(subData));

// //         console.log('✅ Final subscription status saved:', subData);
// //       } catch (err) {
// //         console.error('❌ Check active error:', err);
// //         setActiveSubscription(false);
// //       }
// //     };

// //     checkActiveSub();
// //   }, []);

// //   // 🛒 Purchase Subscription
// //   const buySubscription = async (id) => {
// //     try {
// //       setLoading(true);
// //       await requestPurchase({
// //         request: { android: { skus: [id] } },
// //         type: 'subs',
// //       });
// //     } catch (err) {
// //       console.error('❌ Purchase failed:', err);
// //       if (err?.code !== 'USER_CANCELLED') {
// //         Alert.alert('Purchase error', err?.message || 'Failed to start purchase');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 🔄 Restore Purchases
// //   const restorePurchases = async () => {
// //     try {
// //       setLoading(true);
// //       const purchases = await getAvailablePurchases();
// //       Alert.alert('Restore', `Found ${purchases?.length || 0} purchases`);
// //     } catch (err) {
// //       Alert.alert('Restore failed', err?.message || String(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 🧠 Manual Active Check
// //   const checkActive = async () => {
// //     try {
// //       const active = await hasActiveSubscriptions(SUB_IDS);
// //       setActiveSubscription(active);
// //       Alert.alert('Active subscription', active ? 'Yes' : 'No');
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   if (!connected) {
// //     return (
// //       <View style={styles.centered}>
// //         <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
// //         <ActivityIndicator size="large" color="#0E3386" />
// //       </View>
// //     );
// //   }

// //   const sub = subscriptions?.find((s) => s.id === SUB_IDS[0]);

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.title}>Agreement Paper Pro</Text>

// //       <View style={styles.benefitsSection}>
// //         <Text style={styles.sectionTitle}>What You’ll Get with This Plan</Text>
// //         <Text style={styles.sectionSubtitle}>
// //           Unlock all the essential tools for seamless business contracts and eSignatures.
// //         </Text>

// //         <View style={styles.benefitList}>
// //           {[
// //             'Essential eSign and contracting for business users and freelancers',
// //             'Everything included in the Personal Plan',
// //             'Unlimited document and contract creation',
// //             'Unlimited eSignatures',
// //             'Unlimited team collaboration',
// //             'Comprehensive audit trails',
// //             'Priority email support',
// //           ].map((item, index) => (
// //             <View key={index} style={styles.benefitItem}>
// //               <Icon name="check-circle" size={20} color="#0E3386" style={styles.benefitIcon} />
// //               <Text style={styles.benefitText}>{item}</Text>
// //             </View>
// //           ))}
// //         </View>
// //       </View>

// //       {sub ? (
// //         <View style={styles.card}>
// //           <Text style={styles.subTitle}>{sub.title}</Text>
// //           <Text style={styles.description}>{sub.description}</Text>
// //           <Text style={styles.price}>{sub.displayPrice}</Text>

// //           {activeSubscription ? (
// //             <TouchableOpacity style={[styles.subscribedBtn]} disabled>
// //               <Text style={styles.subscribedText}>✅ Subscribed</Text>
// //             </TouchableOpacity>
// //           ) : (
// //             <TouchableOpacity
// //               style={[styles.button, loading && styles.buttonDisabled]}
// //               onPress={() => buySubscription(sub.id)}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <ActivityIndicator color="#fff" />
// //               ) : (
// //                 <Text style={styles.buttonText}>Subscribe Now</Text>
// //               )}
// //             </TouchableOpacity>
// //           )}

// //           {purchaseResponse && (
// //             <View style={styles.infoBox}>
// //               <Text style={styles.infoTitle}>Subscription Info</Text>
// //               <Text style={styles.infoText}>Plan: {sub.title}</Text>
// //               <Text style={styles.infoText}>
// //                 Status: {activeSubscription ? 'Active' : 'Inactive'}
// //               </Text>
// //               <Text style={styles.infoText}>
// //                 Purchase Date:{' '}
// //                 {new Date(purchaseResponse.transactionDate).toLocaleString()}
// //               </Text>
// //               <Text style={styles.infoText}>Platform: {purchaseResponse.platform}</Text>
// //             </View>
// //           )}
// //         </View>
// //       ) : (
// //         <View style={styles.centered}>
// //           <Text style={{ fontSize: 16, marginBottom: 10 }}>
// //             Loading subscription details...
// //           </Text>
// //           <ActivityIndicator size="large" color="#0E3386" />
// //         </View>
// //       )}

// //       <TouchableOpacity style={styles.outlineButton} onPress={restorePurchases}>
// //         <Text style={styles.outlineButtonText}>Restore Purchases</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity style={styles.outlineButton} onPress={checkActive}>
// //         <Text style={styles.outlineButtonText}>Check Active Subscription</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // // 🎨 Styles
// // const styles = StyleSheet.create({
// //   container: { padding: 20 },
// //   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
// //   card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
// //   subTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
// //   description: { color: '#555', marginBottom: 8 },
// //   price: { fontSize: 18, color: '#0E3386', marginBottom: 20 },
// //   button: {
// //     backgroundColor: '#0E3386',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   buttonDisabled: { opacity: 0.6 },
// //   buttonText: { color: '#fff', fontSize: 16 },
// //   subscribedBtn: {
// //     backgroundColor: '#e0e0e0',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   subscribedText: { color: '#333', fontSize: 16 },
// //   outlineButton: {
// //     borderWidth: 1,
// //     borderColor: '#0E3386',
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   outlineButtonText: { color: '#0E3386', fontSize: 16 },
// //   benefitsSection: { marginBottom: 20 },
// //   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
// //   sectionSubtitle: { fontSize: 14, color: '#555', marginBottom: 10 },
// //   benefitList: { marginTop: 8 },
// //   benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
// //   benefitIcon: { marginRight: 8 },
// //   benefitText: { fontSize: 14, color: '#333', flex: 1 },
// //   infoBox: { marginTop: 20, backgroundColor: '#f7f7f7', padding: 12, borderRadius: 8 },
// //   infoTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
// //   infoText: { fontSize: 14, color: '#444' },
// // });









// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   StyleSheet,
// //   ScrollView,
// // } from 'react-native';
// // import {
// //   useIAP,
// //   purchaseUpdatedListener,
// //   purchaseErrorListener,
// //   finishTransaction,
// // } from 'react-native-iap';
// // import Services from '../Services/services';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // const SUB_IDS = ['agreement_subscription_3'];

// // export default function SubscriptionScreen() {
// //   const {
// //     connected,
// //     subscriptions,
// //     fetchProducts,
// //     requestPurchase,
// //     getAvailablePurchases,
// //     hasActiveSubscriptions,
// //   } = useIAP();

// //   const [iapLog, setIapLog] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [purchaseResponse, setPurchaseResponse] = useState(null);

// //   // 🔹 Fetch product info when connected
// //   useEffect(() => {
// //     if (!connected) return;
// //     fetchProducts({ skus: SUB_IDS, type: 'subs' })
// //       .then(() => setIapLog('✅ Products fetched successfully'))
// //       .catch((e) => setIapLog('❌ Fetch failed: ' + e.message));
// //   }, [connected]);

// //   // 🔹 Listen for purchase updates
// //   useEffect(() => {
// //     const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
// //       console.log('✅ Purchase received:', purchase);
// //       setPurchaseResponse(purchase);
// //       setIapLog('✅ Purchase successful!');

// //       try {
// //         await finishTransaction({ purchase, isConsumable: false });
// //       } catch (err) {
// //         console.log('⚠️ finishTransaction error:', err);
// //       }

// //       const token = purchase?.purchaseToken;
// //       if (token) {
// //         try {
// //           // ✅ Save locally for later verification
// //           await AsyncStorage.setItem('purchaseToken', token);

// //           // ✅ Send ONLY purchaseToken to backend API
// //           const response = await Services.googleSubcription({ token });
// //           console.log('✅ Subscription verified:', response);

// //           if (response?.isActive) {
// //             Alert.alert('Success', 'Subscription active!');
// //           } else {
// //             Alert.alert('Inactive', 'Your subscription is not active.');
// //           }
// //         } catch (error) {
// //           console.log('❌ Subscription API failed:', error);
// //           Alert.alert('Error', 'Failed to validate subscription.');
// //         }
// //       } else {
// //         console.log('❌ No purchaseToken found in purchase response');
// //       }
// //     });

// //     const purchaseError = purchaseErrorListener((error) => {
// //       console.log('❌ Purchase Error:', error);
// //       setIapLog(`Purchase error: ${error.message}`);
// //     });

// //     return () => {
// //       purchaseUpdate.remove();
// //       purchaseError.remove();
// //     };
// //   }, []);

// //   // 🛒 Purchase Subscription
// //   const buySubscription = async (id) => {
// //     try {
// //       setLoading(true);
// //       setIapLog('Starting purchase...');
// //       await requestPurchase({
// //         request: { android: { skus: [id] } },
// //         type: 'subs',
// //       });
// //       setIapLog('Purchase flow started...');
// //     } catch (err) {
// //       console.error(err);
// //       setIapLog('❌ Error: ' + JSON.stringify(err));
// //       if (err?.code !== 'USER_CANCELLED') {
// //         Alert.alert('Purchase error', err?.message || 'Failed to start purchase');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 🔹 Restore purchases (optional)
// //   const restorePurchases = async () => {
// //     try {
// //       setLoading(true);
// //       const purchases = await getAvailablePurchases();
// //       Alert.alert('Restore', `Found ${purchases?.length || 0} purchases`);
// //     } catch (err) {
// //       Alert.alert('Restore failed', err?.message || String(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 🔹 Check Active Subscription (true verification)
// //   const checkActive = async () => {
// //     try {
// //       // Step 1: Check Play Store side
// //       const active = await hasActiveSubscriptions(SUB_IDS);
// //       console.log('Local PlayStore Active:', active);

// //       if (!active) {
// //         Alert.alert('Subscription', 'No active Play Store subscription found.');
// //         return;
// //       }

// //       // Step 2: Get stored token
// //       const token = await AsyncStorage.getItem('purchaseToken');
// //       console.log('Stored Purchase Token:', token);

// //       if (!token) {
// //         Alert.alert('Token Missing', 'No purchase token found. Please subscribe again.');
// //         return;
// //       }

// //       // Step 3: Send token to backend
// //       const response = await Services.googleSubcription({ token });
// //       console.log('✅ Backend verification response:', response);

// //       if (response?.isActive === true) {
// //         Alert.alert('Subscription', '✅ Active subscription verified successfully!');
// //       } else {
// //         Alert.alert('Subscription', '❌ Subscription not active.');
// //       }
// //     } catch (err) {
// //       console.error('❌ Check active error:', err);
// //       Alert.alert('Error', 'Failed to verify subscription.');
// //     }
// //   };

// //   if (!connected) {
// //     return (
// //       <View style={styles.centered}>
// //         <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
// //         <ActivityIndicator size="large" color="#0E3386" />
// //       </View>
// //     );
// //   }

// //   const sub = subscriptions?.find((s) => s.id === SUB_IDS[0]);

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.title}>Agreement Paper Pro</Text>
// //       <View style={styles.benefitsSection}>
// //         <Text style={styles.sectionTitle}>What You’ll Get with This Plan</Text>
// //         <Text style={styles.sectionSubtitle}>
// //           Unlock all the essential tools for seamless business contracts and eSignatures.
// //         </Text>

// //         <View style={styles.benefitList}>
// //           {[
// //             'Essential eSign and contracting for business users and freelancers',
// //             'Everything included in the Personal Plan',
// //             'Unlimited document and contract creation',
// //             'Unlimited eSignatures',
// //             'Unlimited team collaboration',
// //             'Comprehensive audit trails',
// //             'Priority email support',
// //           ].map((item, index) => (
// //             <View key={index} style={styles.benefitItem}>
// //               <Icon name="check-circle" size={20} color="#0E3386" style={styles.benefitIcon} />
// //               <Text style={styles.benefitText}>{item}</Text>
// //             </View>
// //           ))}
// //         </View>
// //       </View>
// //       {sub ? (
// //         <View style={styles.card}>
// //           <Text style={styles.subTitle}>{sub.title}</Text>
// //           <Text style={styles.description}>{sub.description}</Text>
// //           <Text style={styles.price}>{sub.displayPrice}</Text>

// //           <TouchableOpacity
// //             style={[styles.button, loading && styles.buttonDisabled]}
// //             onPress={() => buySubscription(sub.id)}
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <Text style={styles.buttonText}>Subscribe Now</Text>
// //             )}
// //           </TouchableOpacity>
// //         </View>
// //       ) : (
// //         <View style={styles.centered}>
// //           <Text style={{ fontSize: 16, marginBottom: 10 }}>
// //             Loading subscription details...
// //           </Text>
// //           <ActivityIndicator size="large" color="#0E3386" />
// //         </View>
// //       )}

// //       <View style={{ height: 20 }} />

// //       <TouchableOpacity style={styles.outlineButton} onPress={restorePurchases}>
// //         <Text style={styles.outlineButtonText}>Restore Purchases</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity style={styles.outlineButton} onPress={checkActive}>
// //         <Text style={styles.outlineButtonText}>Check Active Subscription</Text>
// //       </TouchableOpacity>

// //       <Text style={{ marginTop: 20, color: 'gray', fontSize: 12 }}>
// //         Debug Log: {iapLog}
// //       </Text>

// //       {purchaseResponse && (
// //         <View style={{ marginTop: 20 }}>
// //           <Text style={{ fontWeight: '600', fontSize: 14, marginBottom: 5 }}>
// //             Purchase Response:
// //           </Text>
// //           <Text
// //             style={{
// //               backgroundColor: '#f0f0f0',
// //               padding: 10,
// //               borderRadius: 8,
// //               fontSize: 12,
// //             }}
// //           >
// //             {JSON.stringify(purchaseResponse, null, 2)}
// //           </Text>
// //         </View>
// //       )}
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     backgroundColor: '#f6f7fb',
// //     flexGrow: 1,
// //   },
// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#0E3386',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 20,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,
// //     shadowOffset: { width: 0, height: 5 },
// //     elevation: 5,
// //   },
// //   subTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#0E3386',
// //     marginBottom: 10,
// //   },
// //   description: {
// //     fontSize: 14,
// //     color: '#555',
// //     marginBottom: 15,
// //   },
// //   price: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     marginBottom: 20,
// //     color: '#fbbf24',
// //   },
// //   button: {
// //     backgroundColor: '#0E3386',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   buttonDisabled: {
// //     opacity: 0.6,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   outlineButton: {
// //     borderWidth: 1,
// //     borderColor: '#0E3386',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginBottom: 12,
// //     backgroundColor: '#fff',
// //   },
// //   outlineButtonText: {
// //     color: '#0E3386',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //     //  outlineButtonText: { color: '#0E3386', fontSize: 16 },

// //   benefitsSection: { marginBottom: 20 },

// //  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },

// //  sectionSubtitle: { fontSize: 14, color: '#555', marginBottom: 10 },

// //  benefitList: { marginTop: 8 },

// //  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },

// //  benefitIcon: { marginRight: 8 },

// //  benefitText: { fontSize: 14, color: '#333', flex: 1 },

// //  infoBox: { marginTop: 20, backgroundColor: '#f7f7f7', padding: 12, borderRadius: 8 },

// //  infoTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },

// //  infoText: { fontSize: 14, color: '#444' },
// // });





// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import {
//   useIAP,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   finishTransaction,
// } from 'react-native-iap';
// import Services from '../Services/services';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SUB_IDS = ['base_plan_yearly'];

// export default function SubscriptionScreen() {
//   const { connected, subscriptions, fetchProducts, requestPurchase } = useIAP();
//   const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [iapLog, setIapLog] = useState('');

//   // ✅ Load subscription status from AsyncStorage
//   useEffect(() => {
//     AsyncStorage.getItem('hasPremiumAccess').then(value => {
//       setHasPremiumAccess(JSON.parse(value || 'false'));
//     });
//   }, []);
// console.log("hasPremiumAccess sub ",hasPremiumAccess);

//   // ✅ Fetch available subscription product
//   useEffect(() => {
//     if (!connected) return;
//     fetchProducts({ skus: SUB_IDS, type: 'subs' })
//       .then(() => setIapLog('✅ Products fetched successfully'))
//       .catch(e => setIapLog('❌ Fetch failed: ' + e.message));
//   }, [connected]);

//   // ✅ Handle purchase updates and send token to backend
//   useEffect(() => {
//     const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
//       console.log('✅ Purchase received:', purchase);

//       try {
//         await finishTransaction({ purchase, isConsumable: false });

//         const token = purchase?.purchaseToken;
//         if (token) {
//           console.log('🔹 Sending token to backend:', token);
//           try {
//             const response = await Services.googleSubcription({ token });
//             console.log('✅ Subscription verified:', response);
//             Alert.alert('Success', 'Subscription validated successfully.');
//             await AsyncStorage.setItem('hasPremiumAccess', JSON.stringify(true));
//             setHasPremiumAccess(true);
//           } catch (error) {
//             console.log('❌ Subscription API failed:', error);
//             Alert.alert('Error', 'Failed to validate subscription.');
//           }
//         } else {
//           console.log('❌ No purchaseToken found in purchase response');
//         }
//       } catch (err) {
//         console.log('⚠️ finishTransaction error:', err);
//       }
//     });

//     const purchaseError = purchaseErrorListener((error) => {
//       console.log('❌ Purchase Error:', error);
//       setIapLog(`Purchase error: ${error.message}`);
//     });

//     return () => {
//       purchaseUpdate.remove();
//       purchaseError.remove();
//     };
//   }, []);

//   // ✅ Handle purchase start
//   const buySubscription = async (id) => {
//     try {
//       setLoading(true);
//       setIapLog('Starting purchase...');
//       await requestPurchase({
//         request: { android: { skus: [id] } },
//         type: 'subs',
//       });
//     } catch (err) {
//       console.error('❌ Purchase Error:', err);
//       if (err?.code !== 'USER_CANCELLED') {
//         Alert.alert('Purchase error', err?.message || 'Failed to start purchase');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ UI rendering
//   if (!connected) {
//     return (
//       <View style={styles.centered}>
//         <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
//         <ActivityIndicator size="large" color="#0E3386" />
//       </View>
//     );
//   }

//   const sub = subscriptions?.find((s) => s.id === SUB_IDS[0]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Agreement Paper Pro</Text>

//       {sub ? (
//         <View style={styles.card}>
//           <Text style={styles.subTitle}>{sub.title}</Text>
//           <Text style={styles.description}>{sub.description}</Text>
//           <Text style={styles.price}>{sub.displayPrice}</Text>

//           {/* ✅ Subscription Benefits */}
//           {[
//             'Essential eSign and contracting for business users and freelancers',
//             'Everything included in the Personal Plan',
//             'Unlimited document and contract creation',
//             'Unlimited eSignatures',
//             'Unlimited team collaboration',
//             'Comprehensive audit trails',
//             'Priority email support',
//           ].map((item, index) => (
//             <View key={index} style={styles.benefitItem}>
//               <Icon
//                 name="check-circle"
//                 size={20}
//                 color="#0E3386"
//                 style={styles.benefitIcon}
//               />
//               <Text style={styles.benefitText}>{item}</Text>
//             </View>
//           ))}

//           {/* ✅ Subscribe button */}
//           <TouchableOpacity
//             disabled={hasPremiumAccess || loading}
//             onPress={() => !hasPremiumAccess && buySubscription(SUB_IDS[0])}
//             style={{
//               backgroundColor: hasPremiumAccess ? '#ccc' : '#0E3386',
//               padding: 12,
//               borderRadius: 8,
//               alignItems: 'center',
//               marginTop: 16,
//               opacity: loading ? 0.7 : 1,
//             }}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={{ color: '#fff', fontWeight: 'bold' }}>
//                 {hasPremiumAccess ? 'Already Subscribed' : 'Subscribe Now'}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={styles.centered}>
//           <Text style={{ fontSize: 16, marginBottom: 10 }}>
//             Loading subscription details...
//           </Text>
//           <ActivityIndicator size="large" color="#0E3386" />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f6f7fb',
//     flexGrow: 1,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   benefitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   benefitIcon: {
//     marginRight: 8,
//   },
//   benefitText: {
//     flex: 1,
//     color: '#333',
//     fontSize: 14,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#0E3386',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#0E3386',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 20,
//     color: '#fbbf24',
//   },
// });



// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import {
//   useIAP,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   finishTransaction,
// } from 'react-native-iap';
// import Services from '../Services/services';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SUB_IDS = ['base_plan_yearly'];

// export default function SubscriptionScreen() {
//   const {
//     connected,
//     subscriptions,
//     fetchProducts,
//     requestPurchase,
//   } = useIAP();

//   const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [iapLog, setIapLog] = useState('');
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [checkingPayment, setCheckingPayment] = useState(false);

//   // Load subscription status
//   useEffect(() => {
//     AsyncStorage.getItem('hasPremiumAccess').then(value => {
//       setHasPremiumAccess(JSON.parse(value || 'false'));
//     });
//   }, []);

//   // Fetch subscription products
//   useEffect(() => {
//     if (!connected) return;
//     fetchProducts({ skus: SUB_IDS, type: 'subs' })
//       .then(() => setIapLog('✅ Products fetched successfully'))
//       .catch((e) => setIapLog('❌ Fetch failed: ' + e.message));
//   }, [connected]);

//   // Purchase listener
//   useEffect(() => {
//     const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
//       console.log('✅ Purchase received:', purchase);

//       try {
//         await finishTransaction({ purchase, isConsumable: false });

//         const token = purchase?.purchaseToken;
//         if (token) {
//           console.log('🔹 Sending token:', token);

//           try {
//             const response = await Services.googleSubcription({ token });
//             console.log('✅ Subscription verified:', response);
//             Alert.alert('Success', 'Subscription validated successfully.');
//             AsyncStorage.setItem('hasPremiumAccess', JSON.stringify(true));
//             setHasPremiumAccess(true);
//           } catch (error) {
//             console.log('❌ Subscription API failed:', error);
//             Alert.alert('Error', 'Failed to validate subscription.');
//           }
//         }
//       } catch (err) {
//         console.log('⚠️ finishTransaction error:', err);
//       }
//     });

//     const purchaseError = purchaseErrorListener((error) => {
//       console.log('❌ Purchase Error:', error);
//       setIapLog(`Purchase error: ${error.message}`);
//     });

//     return () => {
//       purchaseUpdate.remove();
//       purchaseError.remove();
//     };
//   }, []);

//   // Start purchase
//   const buySubscription = async (id) => {
//     try {
//       setLoading(true);
//       await requestPurchase({
//         request: { android: { skus: [id] } },
//         type: 'subs',
//       });
//     } catch (err) {
//       console.error('❌ Purchase Error:', err);
//       if (err?.code !== 'USER_CANCELLED') {
//         Alert.alert('Purchase error', err?.message || 'Failed to start purchase');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Check payment details
//   const handleCheckPayment = async () => {
//     try {
//       setCheckingPayment(true);
//       const res = await Services.getPaymentdetails();
//       console.log('Payment Details Response:', res);

//       if (res.success && res.data) {
//         setPaymentDetails(res.data);
//       } else {
//         Alert.alert('Error', res.error || 'Failed to fetch payment details');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Something went wrong');
//     } finally {
//       setCheckingPayment(false);
//     }
//   };

//   if (!connected) {
//     return (
//       <View style={styles.centered}>
//         <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
//         <ActivityIndicator size="large" color="#0E3386" />
//       </View>
//     );
//   }

//   const sub = subscriptions?.find((s) => s.id === SUB_IDS[0]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Agreement Paper Pro</Text>

//       {sub ? (
//         <View style={styles.card}>
//           <Text style={styles.subTitle}>{sub.title}</Text>
//           <Text style={styles.description}>{sub.description}</Text>
//           <Text style={styles.price}>{sub.displayPrice}</Text>

//           {/* ✅ Benefits */}
//           {[
//             'Essential eSign and contracting for business users and freelancers',
//             'Everything included in the Personal Plan',
//             'Unlimited document and contract creation',
//             'Unlimited eSignatures',
//             'Unlimited team collaboration',
//             'Comprehensive audit trails',
//             'Priority email support',
//           ].map((item, index) => (
//             <View key={index} style={styles.benefitItem}>
//               <Icon name="check-circle" size={20} color="#0E3386" style={styles.benefitIcon} />
//               <Text style={styles.benefitText}>{item}</Text>
//             </View>
//           ))}

//           {/* ✅ Subscribe Button */}
//           <TouchableOpacity
//             disabled={hasPremiumAccess || loading}
//             onPress={() => buySubscription(sub.id)}
//             style={[
//               styles.button,
//               { backgroundColor: hasPremiumAccess ? '#ccc' : '#0E3386' },
//             ]}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>
//                 {hasPremiumAccess ? 'Already Subscribed' : 'Subscribe Now'}
//               </Text>
//             )}
//           </TouchableOpacity>

//           {/* ✅ Check Payment Details Button */}
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: '#0E3386', marginTop: 15 }]}
//             onPress={handleCheckPayment}
//           >
//             {checkingPayment ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Check Payment Details</Text>
//             )}
//           </TouchableOpacity>

//           {/* ✅ Display Payment Details */}
//           {paymentDetails && (
//             <View style={styles.paymentCard}>
//               <Text style={styles.paymentTitle}>Payment Details</Text>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Transaction ID:</Text>
//                 <Text style={styles.detailValue}>{paymentDetails.transaction_id}</Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Plan:</Text>
//                 <Text style={styles.detailValue}>{paymentDetails.plan_details?.name}</Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Amount:</Text>
//                 <Text style={styles.detailValue}>
//                   {paymentDetails.plan_details?.price} {paymentDetails.plan_details?.currency}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Status:</Text>
//                 <Text
//                   style={[
//                     styles.detailValue,
//                     { color: paymentDetails.payment_status === 'pending' ? '#d97706' : '#16a34a' },
//                   ]}
//                 >
//                   {paymentDetails.payment_status?.toUpperCase()}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Purchase Date:</Text>
//                 <Text style={styles.detailValue}>{paymentDetails.purchase_date}</Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Expires On:</Text>
//                 <Text style={styles.detailValue}>{paymentDetails.expire_at}</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       ) : (
//         <View style={styles.centered}>
//           <Text style={{ fontSize: 16, marginBottom: 10 }}>
//             Loading subscription details...
//           </Text>
//           <ActivityIndicator size="large" color="#0E3386" />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f6f7fb',
//     flexGrow: 1,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   benefitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   benefitIcon: {
//     marginRight: 8,
//   },
//   benefitText: {
//     flex: 1,
//     color: '#333',
//     fontSize: 14,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#0E3386',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#0E3386',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 20,
//     color: '#fbbf24',
//   },
//   button: {
//     marginTop:10,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   paymentCard: {
//     marginTop: 20,
//     backgroundColor: '#f9fafb',
//     borderRadius: 10,
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   paymentTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0E3386',
//     marginBottom: 10,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 4,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#444',
//   },
// });







import { requestSubscription } from 'react-native-iap';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  useIAP,
  purchaseUpdatedListener,

  purchaseErrorListener,
  finishTransaction,
  getSubscriptions, // <--- add this top-level import
} from 'react-native-iap';

import Services from '../Services/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshSubscriptionStatus } from '../utils/ubscriptionHelper';

const SUB_IDS = [
  "agreement_subscription_1",
  "agreement_subscription_2",
  "base_plan_yearly",
];

// ---------- DYNAMIC PRICE CALCULATION (WORKS FOR ALL CURRENCIES) ----------
const DISCOUNT_MULTIPLIER = 2; // Means original price = current price × 2 (50% OFF)

const parsePrice = (displayPrice) => {
  if (!displayPrice || typeof displayPrice !== "string") {
    return { currencySymbol: "", numericValue: 0 };
  }

  const currencySymbol = displayPrice.replace(/[0-9.,]/g, "").trim();
  const numericValue = parseFloat(displayPrice.replace(/[^0-9.]/g, ""));

  return { currencySymbol, numericValue };
};
const getOriginalPrice = (displayPrice) => {
  const { currencySymbol, numericValue } = parsePrice(displayPrice);
  if (!numericValue) return "";
  const originalValue = (numericValue * DISCOUNT_MULTIPLIER).toFixed(2);
  return `${currencySymbol}${originalValue}`;
};

// ⭐ Extract actual Play Store price from Billing v6 structure
const getStorePrice = (plan) => {
  try {
    const offer = plan?.subscriptionOfferDetails?.[0];
    const pricing = offer?.pricingPhases?.pricingPhaseList?.[0];
    return pricing?.formattedPrice || null; // ex: "₹249.00"
  } catch {
    return null;
  }
};



export default function SubscriptionScreen() {
  const { connected, subscriptions, requestPurchase } = useIAP();

  const [plans, setPlans] = useState<any[]>([]);

  const [purchasedProductId, setPurchasedProductId] = useState<string | null>(null);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iapLog, setIapLog] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const originalPrices: any = {
    agreement_subscription_2: 500,
    base_plan_yearly: 620,
    agreement_subscription_1: 2600,
  };
  const [showCongrats, setShowCongrats] = useState(false);


  // Load subscription status
  useEffect(() => {
    AsyncStorage.getItem('hasPremiumAccess').then(value => {
      setHasPremiumAccess(JSON.parse(value || 'false'));
    });
    AsyncStorage.getItem('purchasedProductId').then(value => {
      if (value) setPurchasedProductId(value);
    });
  }, []);
  // Fetch subscription products once connected
  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        const subs = await getSubscriptions({ skus: SUB_IDS });
        console.log('getSubscriptions ->', subs);
        setPlans(subs);
      } catch (e) {
        console.warn('getSubscriptions err', e);
      }
    })();
  }, [connected]);






  useEffect(() => {
    const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
      console.log("✅ Purchase received:", purchase);

      try {
        await finishTransaction({ purchase, isConsumable: false });

        const token = purchase?.purchaseToken || purchase?.transactionReceipt;

        if (token) {
          try {
            const response = await Services.googleSubcription({ token });
            console.log("✅ Subscription verified:", response);

            if (response?.success) {
              setShowCongrats(true); // Open modal


              // 🔄 Auto-refresh backend status
              await refreshSubscriptionStatus();

              console.log("🔄 UI updated after purchase");
            }
          } catch (error) {
            console.log("❌ Subscription API failed:", error);
          }
        }
      } catch (err) {
        console.log("⚠️ finishTransaction error:", err);
      }
    });

    return () => {
      purchaseUpdate.remove();
    };
  }, []);





  // 🔄 Refresh subscription status from server & update UI + AsyncStorage
  const refreshSubscriptionStatus = async () => {
    try {
      const result = await Services.getSubscriptionStatus();
      console.log("🔄 Live subscription refresh:", result);

      if (result.success) {
        const premium = result.data?.has_premium_access || false;
        const productId = result.data?.product_id || null;

        // Save to local storage
        await AsyncStorage.setItem("hasPremiumAccess", JSON.stringify(premium));

        if (productId) {
          await AsyncStorage.setItem("purchasedProductId", productId);
        } else {
          await AsyncStorage.removeItem("purchasedProductId");
        }

        // Update UI
        setHasPremiumAccess(premium);
        setPurchasedProductId(productId);

      } else {
        // No subscription
        await AsyncStorage.setItem("hasPremiumAccess", JSON.stringify(false));
        await AsyncStorage.removeItem("purchasedProductId");

        setHasPremiumAccess(false);
        setPurchasedProductId(null);
      }

    } catch (err) {
      console.log("❌ refreshSubscriptionStatus error:", err);

      await AsyncStorage.setItem("hasPremiumAccess", JSON.stringify(false));
      await AsyncStorage.removeItem("purchasedProductId");

      setHasPremiumAccess(false);
      setPurchasedProductId(null);
    }
  };





const buySubscription = async (plan: any) => {
  try {
    setLoading(true);

    const productId = plan?.productId || plan?.id || plan?.sku;
    const offerToken = plan?.subscriptionOfferDetails?.[0]?.offerToken ?? null;

    if (!productId) {
      Alert.alert('Error', 'Invalid product id.');
      return;
    }

    // If there is an offer token, send subscriptionOffers with sku (required by types)
    if (offerToken) {
      await requestSubscription({
        // top-level sku required
        sku: productId,
        // subscriptionOffers items must include sku (TypeScript expects this)
        subscriptionOffers: [
          {
            sku: productId,        // <- REQUIRED
            offerToken: offerToken // <- the offer token from Play API
          },
        ],
      });
    } else {
      // No special offer token — request subscription using only sku (basic flow)
      await requestSubscription({
        sku: productId,
      });
    }

    console.log('Purchase flow started for', productId);
  } catch (err: any) {
    console.log('❌ Purchase Error:', err);
    Alert.alert('Purchase Error', err?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};




  const noPaymentData =
    !paymentDetails?.transaction_id &&
    !paymentDetails?.amount &&
    !paymentDetails?.purchase_date &&
    !paymentDetails?.expire_at;
    
  // Check payment details
  const handleCheckPayment = async () => {
    try {
      setCheckingPayment(true);
      const res = await Services.getPaymentdetails();
      console.log('Payment Details Response:', res);

      if (res.success && res.data) {
        setPaymentDetails(res.data);
      } else {
        Alert.alert('Error', res.error || 'Failed to fetch payment details');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setCheckingPayment(false);
    }
  };

  if (!connected) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }

  // Benefit list (same for all plans)
  // Benefit lists based on plan type
  const benefitLists: any = {
    agreement_subscription_2: [
      'Essential eSign and contracting for business users and freelancers',
      'Everything included in the Personal Plan',
      'Unlimited document and contract creation',
      'Unlimited eSignatures',
      'Unlimited team collaboration',
      'Comprehensive audit trails',
      'Priority email support',
    ],

    base_plan_yearly: [
      'For growing businesses to automate their eSign/contracting workflow.',
      'Everything in Pro',
      'Role based user management',
      'Workflows for internal approvals',
      'Advance document/eSign controls',
      'Customizable alerts/notifications',
      'Business template library',
      'Unlimited Custom templates',
      'Business Integrations',
      'Advance platform controls',
      'Custom branding',
      'Priority support',
    ],

    agreement_subscription_1: [
      'For advanced automation, security, custom terms and compliance.',
      'Everything in team',
      'Advance user management',
      'Advance eSign settings',
      'Premium integrations',
      'Customizable platform security',
      'Custom success manager',
      'Uptime SLAs with service credit',
      'Custom contract terms',
    ],
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agreement Paper Pro</Text>

      {/* If subscriptions array exists, show each plan in a card */}
      {plans && plans.length > 0 ? (
        <View style={{ width: '100%' }}>
          {plans.map((plan: any, idx: number) => {
            // Use productId (newer), fallback to id
            const planId = plan.productId || plan.id || plan.sku || plan.skus?.[0];
            const isSubscribed = planId === purchasedProductId;
            return (
              <View key={planId || idx} style={styles.card}>
                <Text style={styles.subTitle}>{plan.title || planId}</Text>
                {plan.description ? (
                  <Text style={styles.description}>{plan.description}</Text>
                ) : null}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  {/** SAFE PRICE HANDLING */}
                  {(() => {
                    const priceToShow = getStorePrice(plan);


                    return (
                      <>
                        {/* Current Price */}
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: '#000',
                          }}
                        >
                          {priceToShow || 'Price N/A'}
                        </Text>

                        {/* Original Price (Strikethrough) */}
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            color: 'gray',
                            marginLeft: 6,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}
                        >
                          {priceToShow ? getOriginalPrice(priceToShow) : ''}
                        </Text>
                      </>
                    );
                  })()}
                </View>





                {/* Benefits */}
                {/* Benefits */}
                <View style={{ marginTop: 10 }}>
                  {(benefitLists[planId] || []).map((item: string, index: number) => (
                    <View key={index} style={styles.benefitItem}>
                      <Icon
                        name="check-circle"
                        size={20}
                        color="#0E3386"
                        style={styles.benefitIcon}
                      />
                      <Text style={styles.benefitText}>{item}</Text>
                    </View>
                  ))}
                </View>


                {/* Subscribe Button */}
                <TouchableOpacity
                  disabled={loading || isSubscribed}
                  onPress={() => buySubscription(plan)}

                  style={[
                    styles.button,
                    {
                      backgroundColor: isSubscribed ? '#ccc' : '#0E3386',
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {isSubscribed ? 'Already Subscribed' : 'Subscribe Now'}
                  </Text>
                </TouchableOpacity>

              </View>
            );
          })}

          {/* Check payment details action (single button) */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#0E3386', marginTop: 15 }]}
            onPress={handleCheckPayment}
          >
            {checkingPayment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check Payment Details</Text>
            )}
          </TouchableOpacity>

          {/* Payment details display */}
          {/* Payment details display */}
          {paymentDetails && (
            <View style={styles.paymentCard}>
              {noPaymentData ? (
                <Text style={{ color: '#374151', fontSize: 14 }}>
                  No subscription details available. You have not purchased any plan yet.
                </Text>
              ) : (
                <>
                  <Text style={styles.paymentTitle}>Payment Details</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID:</Text>
                    <Text style={styles.detailValue}>{paymentDetails.transaction_id}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Plan:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.plan_details?.name || "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.plan_details?.price
                        ? `${paymentDetails.plan_details.price} ${paymentDetails.plan_details.currency}`
                        : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            paymentDetails.payment_status === 'pending'
                              ? '#d97706'
                              : '#16a34a',
                        },
                      ]}
                    >
                      {paymentDetails.payment_status
                        ? paymentDetails.payment_status.toUpperCase()
                        : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purchase Date:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.purchase_date || "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Expires On:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.expire_at || "N/A"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Loading subscription plans...</Text>
          <ActivityIndicator size="large" color="#0E3386" />
        </View>
      )}

      {/* debug / log */}
      <Text style={{ marginTop: 12, color: '#666' }}>{iapLog}</Text>




      {/* 🎉 Congratulations Modal */}
      {showCongrats && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalMsg}>
              Your subscription is now active.
            </Text>

            <TouchableOpacity
              onPress={() => setShowCongrats(false)}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },


  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },

  modalCard: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },

  modalEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0E3386",
    marginBottom: 6,
  },

  modalMsg: {
    textAlign: "center",
    color: "#374151",
    fontSize: 14,
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: "#0E3386",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  modalBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00007B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F4FF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E3386',
    marginBottom: 6,
  },
  description: {
    color: '#374151',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    color: '#374151',
    flex: 1,
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  paymentCard: {
    marginTop: 15,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  paymentTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#374151',
    fontWeight: '600',
  },
  detailValue: {
    color: '#111827',
  },
});




// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';

// import {
//   useIAP,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   finishTransaction,
// } from 'react-native-iap';

// import Services from '../Services/services';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// /////////////////////////////////////////////////////////
// //  PRODUCT IDs — Correct ones
// /////////////////////////////////////////////////////////
// const SUB_IDS = [
//   'base_plan_yearly',    // Yearly subscription product
//   'agreement_subscription_1',  // Pro plan
//   'agreement_subscription_2',  // Basic plan
// ];

// export default function SubscriptionScreen() {
//   const { connected, subscriptions, fetchProducts, requestPurchase } = useIAP();

//   const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [checkingPayment, setCheckingPayment] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [iapLog, setIapLog] = useState('');

//   ////////////////////////////////////////////////////////
//   // Load user premium access
//   ////////////////////////////////////////////////////////
//   useEffect(() => {
//     AsyncStorage.getItem('hasPremiumAccess').then(val => {
//       setHasPremiumAccess(JSON.parse(val || 'false'));
//     });
//   }, []);

//   ////////////////////////////////////////////////////////
//   // Fetch subscription products from Google Play
//   ////////////////////////////////////////////////////////
//   useEffect(() => {
//     if (!connected) return;

//     fetchProducts({ skus: SUB_IDS, type: 'subs' })
//       .then(() => setIapLog('Products loaded successfully'))
//       .catch(e => setIapLog('Fetch failed: ' + (e?.message || e)));
//   }, [connected]);

//   ////////////////////////////////////////////////////////
//   // Purchase Listener
//   ////////////////////////////////////////////////////////
//   useEffect(() => {
//     const purchaseUpdate = purchaseUpdatedListener(async purchase => {
//       try {
//         await finishTransaction({ purchase, isConsumable: false });

//         const token = purchase?.purchaseToken || purchase?.transactionReceipt;

//         if (token) {
//           await Services.googleSubcription({ token });

//           Alert.alert('Success', 'Subscription validated.');
//           AsyncStorage.setItem('hasPremiumAccess', JSON.stringify(true));
//           setHasPremiumAccess(true);
//         }
//       } catch (err) {
//         console.log('Finish TX Error:', err);
//       }
//     });

//     const purchaseError = purchaseErrorListener(error => {
//       console.log('Purchase Error:', error);
//     });

//     return () => {
//       purchaseUpdate.remove();
//       purchaseError.remove();
//     };
//   }, []);

//   ////////////////////////////////////////////////////////
//   // BUY BUTTON HANDLER — CORRECT OFFER PURCHASE LOGIC
//   ////////////////////////////////////////////////////////
// const buySubscription = async (productId: string, offerToken?: string) => {
//   try {
//     setLoading(true);

//     const purchaseConfig: any = {
//       sku: productId,
//       type: 'subs',
//     };

//     if (offerToken) {
//       purchaseConfig.subscriptionOffers = [
//         { sku: productId, offerToken },
//       ];
//     }

//     await requestPurchase(purchaseConfig);

//   } catch (err) {
//     console.log('IAP Purchase Error: ', err);
//     Alert.alert('Purchase Error', err?.message || 'Something went wrong');
//   } finally {
//     setLoading(false);
//   }
// };


//   ////////////////////////////////////////////////////////
//   // Fetch Payment Details
//   ////////////////////////////////////////////////////////
//   const handleCheckPayment = async () => {
//     try {
//       setCheckingPayment(true);
//       const res = await Services.getPaymentdetails();

//       if (res.success) {
//         setPaymentDetails(res.data);
//       } else {
//         Alert.alert('Error', res.error || 'Failed to load details');
//       }
//     } finally {
//       setCheckingPayment(false);
//     }
//   };

//   ////////////////////////////////////////////////////////
//   // Benefits List
//   ////////////////////////////////////////////////////////
//   const benefitList = [
//     'Essential eSign and contracting for business users and freelancers',
//     'Everything included in the Personal Plan',
//     'Unlimited document and contract creation',
//     'Unlimited eSignatures',
//     'Unlimited team collaboration',
//     'Comprehensive audit trails',
//     'Priority email support',
//   ];

//   ////////////////////////////////////////////////////////
//   // UI RETURN
//   ////////////////////////////////////////////////////////
//   if (!connected) {
//     return (
//       <View style={styles.centered}>
//         <Text>Connecting to Google Play…</Text>
//         <ActivityIndicator size="large" color="#00007B" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Agreement Paper Pro</Text>

//       {subscriptions.length > 0 ? (
//         <>
//           {subscriptions.map((plan, index) => {
//             const planId = plan.productId;

//             // Yearly plan
//             const isYearly = planId === 'agreement-paper-yearly';

//             // Offer detection
//             const offer = isYearly
//               ? plan.subscriptionOfferDetails?.find(
//                   o => o.offerId === 'yearly-50-off'
//                 )
//               : null;

//             const pricePhase =
//               offer?.pricingPhases?.pricingPhaseList?.[0];

//             // Label for different plans
//             const planLabel =
//               planId === 'agreement_subscription_1'
//                 ? 'Pro Plan'
//                 : planId === 'agreement_subscription_2'
//                 ? 'Basic Plan'
//                 : 'Yearly Plan';

//             return (
//               <View key={index} style={styles.card}>

//                 {/* DISCOUNT BADGE */}
//                 {offer && (
//                   <View style={styles.offerTag}>
//                     <Text style={styles.offerText}>50% OFF — First Year Only</Text>
//                   </View>
//                 )}

//                 <Text style={styles.subTitle}>{planLabel}</Text>
//                 <Text style={styles.description}>{plan.description}</Text>

//                 {/* PRICE BLOCK */}
//                 {offer && pricePhase ? (
//                   <>
//                     <Text style={styles.price}>{pricePhase.formattedPrice}</Text>
//                     <Text style={styles.originalPrice}>{plan.displayPrice}</Text>
//                   </>
//                 ) : (
//                   <Text style={styles.price}>{plan.displayPrice}</Text>
//                 )}

//                 {/* BENEFITS */}
//                 <View style={{ marginTop: 8 }}>
//                   {benefitList.map((b, i) => (
//                     <View key={i} style={styles.benefitItem}>
//                       <Icon name="check-circle" color="#0E3386" size={20} />
//                       <Text style={styles.benefitText}>{b}</Text>
//                     </View>
//                   ))}
//                 </View>

//                 {/* BUY BUTTON */}
//                 <TouchableOpacity
//                   disabled={hasPremiumAccess || loading}
//                   onPress={() => buySubscription(planId, offer?.offerToken)}
//                   style={[
//                     styles.button,
//                     { backgroundColor: hasPremiumAccess ? '#999' : '#00007B' },
//                   ]}
//                 >
//                   <Text style={styles.buttonText}>
//                     {hasPremiumAccess ? 'Already Subscribed' : 'Subscribe Now'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             );
//           })}

//           {/* PAYMENT DETAILS BUTTON */}
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: '#00007B', marginTop: 15 }]}
//             onPress={handleCheckPayment}
//           >
//             {checkingPayment ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Check Payment Details</Text>
//             )}
//           </TouchableOpacity>

//           {/* PAYMENT DETAILS */}
//           {paymentDetails && (
//             <View style={styles.paymentCard}>
//               <Text style={styles.paymentTitle}>Payment Details</Text>
//               <Text>Transaction: {paymentDetails.transaction_id}</Text>
//               <Text>Plan: {paymentDetails.plan_details?.name}</Text>
//               <Text>
//                 Amount: {paymentDetails.plan_details?.price}{' '}
//                 {paymentDetails.plan_details?.currency}
//               </Text>
//               <Text>Status: {paymentDetails.payment_status}</Text>
//               <Text>Purchased: {paymentDetails.purchase_date}</Text>
//               <Text>Expires: {paymentDetails.expire_at}</Text>
//             </View>
//           )}

//           <Text style={{ marginTop: 10 }}>{iapLog}</Text>
//         </>
//       ) : (
//         <View style={styles.centered}>
//           <Text>Loading plans…</Text>
//           <ActivityIndicator size="large" color="#00007B" />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// /////////////////////////////////////////////////////////
// // STYLES
// /////////////////////////////////////////////////////////
// const styles = StyleSheet.create({
//   container: { padding: 16, backgroundColor: '#fff' },
//   centered: { alignItems: 'center', padding: 20 },
//   title: { fontSize: 22, fontWeight: '800', color: '#00007B', marginBottom: 10 },
//   card: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E6EBFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   offerTag: {
//     backgroundColor: '#FF4545',
//     padding: 6,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//     marginBottom: 6,
//   },
//   offerText: { color: '#fff', fontWeight: '700', fontSize: 12 },
//   subTitle: { fontSize: 18, fontWeight: '700', color: '#0E3386' },
//   description: { color: '#666', marginTop: 4 },
//   price: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 8 },
//   originalPrice: {
//     fontSize: 14,
//     color: '#999',
//     textDecorationLine: 'line-through',
//     marginTop: 2,
//   },
//   benefitItem: { flexDirection: 'row', marginTop: 6, alignItems: 'center' },
//   benefitText: { marginLeft: 8, color: '#333' },
//   button: {
//     marginTop: 14,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: { color: '#fff', fontWeight: '700' },
//   paymentCard: {
//     marginTop: 12,
//     backgroundColor: '#F4F6FF',
//     padding: 12,
//     borderRadius: 12,
//   },
//   paymentTitle: { fontWeight: '700', marginBottom: 8 },
// });
