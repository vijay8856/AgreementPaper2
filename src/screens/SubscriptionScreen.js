// import React, { useEffect, useState, useRef } from 'react';
// import {
//     View, Text, TouchableOpacity, Dimensions,
//     StyleSheet, ActivityIndicator, Linking, FlatList,
//     ScrollView
// } from 'react-native';
// import Toast from 'react-native-toast-message';
// import Services from '../Services/services';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/types';
// import { StackNavigationProp } from '@react-navigation/stack';
// const { width: screenWidth } = Dimensions.get('window');


// type NavigationProp = StackNavigationProp<RootStackParamList, 'SubscriptionHistoryScreen'>;


// const SubscriptionScreen = () => {
//      const navigation = useNavigation<NavigationProp>();
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [subStatus, setSubStatus] = useState(null);
//     const [checkoutProcessing, setCheckoutProcessing] = useState(false);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const flatListRef = useRef(null);

//     useEffect(() => {
//         fetchData();
//     }, []);


// useEffect(() => {
//   // Set header options
//   navigation.setOptions({
//     headerRight: () => (
//       <TouchableOpacity 
//         onPress={() => navigation.navigate('SubscriptionHistoryScreen')}
//         style={{ marginRight: 15 }}
//       >
//         <Icon name="history" size={28} color="#fff" />
//       </TouchableOpacity>
//     ),
//     headerStyle: {
//       backgroundColor: '#0E3386',
//     },
//     headerTintColor: '#fff',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     },
//   });
// }, [navigation]);



//     const fetchData = async () => {
//         try {
//             const [plansRes, statusRes] = await Promise.all([
//                 Services.getSubscriptionPlanDetails(),
//                 Services.getSubscriptionStatus(),
//             ]);

//             setPlans(plansRes.data || []);
//             setSubStatus(statusRes.data || null);
//         } catch (error) {
//             Toast.show({ type: 'error', text1: 'Failed to load data' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubscribe = async (plan) => {
//         try {
//             setCheckoutProcessing(true);
//             const res = await Services.initiatepaymentsub({ plan_id: plan.id });

//             if (res?.data?.checkout_url) {
//                 const supported = await Linking.canOpenURL(res.data.checkout_url);
//                 supported
//                     ? Linking.openURL(res.data.checkout_url)
//                     : Toast.show({ type: 'error', text1: 'Cannot open payment link' });
//             } else {
//                 Toast.show({ type: 'error', text1: 'Payment initialization failed' });
//             }
//         } catch (err) {
//             Toast.show({ type: 'error', text1: 'Failed to initiate subscription' });
//         } finally {
//             setCheckoutProcessing(false);
//         }
//     };

//     const handleCancel = async () => {
//         try {
//             await Services.cancelSubscription();
//             Toast.show({ type: 'success', text1: 'Subscription canceled' });
//             setSubStatus(null);
//         } catch (err) {
//             Toast.show({ type: 'error', text1: 'Cancel failed' });
//         }
//     };

//     const formatPrice = (plan) => {
//         const currencySymbols = { AUD: 'A$', USD: '$', EUR: '€' };
//         const periodMap = { month: 'mo', year: 'yr' };
//         const symbol = currencySymbols[plan.currency] || plan.currency;
//         const period = periodMap[plan.plan_type] || plan.plan_type;
//         return `${symbol}${plan.price}/${period}`;
//     };

//     const handleViewableItemsChanged = useRef(({ viewableItems }) => {
//         if (viewableItems.length > 0) {
//             setCurrentIndex(viewableItems[0].index);
//         }
//     }).current;

//     const viewabilityConfig = {
//         itemVisiblePercentThreshold: 50
//     };

//     const scrollToIndex = (index) => {
//         flatListRef.current?.scrollToIndex({ index, animated: true });
//     };

//     if (loading || checkoutProcessing) {
//         return (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#0E3386" />
//                 <Text style={styles.loaderText}>Processing...</Text>
//             </View>
//         );
//     }

//     const currentPlanId = subStatus?.plan_id;

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>Subscription Plans</Text>
//                 <Text style={styles.headerSubtitle}>Choose the plan that fits your needs</Text>
//             </View>

//             {/* {subStatus && (
//         <View style={styles.currentPlanContainer}>
//           <View style={styles.currentPlanBadge}>
//             <Text style={styles.currentPlanBadgeText}>ACTIVE</Text>
//           </View>
//           {
//             subStatus?.plan_name ? (
//               <Text style={styles.currentPlanText}>
//                 Current Plan: <Text style={styles.planNameHighlight}>{subStatus.plan_name}</Text>
//               </Text>
//             ) : (
//               <Text style={styles.currentPlanText}>
//                 You don't have any active plan. Please upgrade the plan.
//               </Text>
//             )
//           }
//           <TouchableOpacity 
//             style={styles.cancelBtn} 
//             onPress={handleCancel}
//           >
//             <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
//           </TouchableOpacity>
//         </View>
//       )} */}

//             {/* Horizontal Plan Slider */}
//             <View style={styles.sliderContainer}>
//                 <FlatList
//                     ref={flatListRef}
//                     data={plans}
//                     keyExtractor={(item) => item.id.toString()}
//                     horizontal
//                     pagingEnabled
//                     showsHorizontalScrollIndicator={false}
//                     onViewableItemsChanged={handleViewableItemsChanged}
//                     viewabilityConfig={viewabilityConfig}
//                     renderItem={({ item }) => {
//                         const isCurrentPlan = currentPlanId === item.id;
//                         const isPopular = item.name === "Team";

//                         return (
//                             <View style={[
//                                 styles.card,
//                                 isCurrentPlan && styles.currentCard,
//                                 isPopular && styles.popularCard
//                             ]}>
//                                 {/* {isPopular && (
//                   <View style={styles.popularBadge}>
//                     <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
//                   </View>
//                 )} */}

//                                 <Text style={styles.planName}>{item.name}</Text>
//                                 <Text style={styles.price}>{formatPrice(item)}</Text>

//                                 <View style={styles.divider} />

//                                 <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
//                                     <View style={styles.descriptionContainer}>
//                                         {item.description.split('\r\n\r\n').map((feature: string, idx: React.Key | null | undefined) => (
//                                             <View key={idx} style={styles.featureItem}>
//                                                 <Icon name="check-circle" size={10} color="#10b981" />
//                                                 <Text style={styles.featureText}>{feature.trim()}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 </ScrollView>

//                                 <TouchableOpacity
//                                     style={[
//                                         styles.subscribeBtn,
//                                         isCurrentPlan && styles.currentPlanBtn
//                                     ]}
//                                     onPress={() => !isCurrentPlan && handleSubscribe(item)}
//                                     disabled={isCurrentPlan}
//                                 >
//                                     <Text style={styles.subscribeBtnText}>
//                                         {isCurrentPlan ? 'Current Plan' : 'Get Started'}
//                                     </Text>
//                                 </TouchableOpacity>
//                             </View>
//                         );
//                     }}
//                 />
//             </View>

//             {/* Pagination Dots */}
//             <View style={styles.pagination}>
//                 {plans.map((_, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={[
//                             styles.dot,
//                             index === currentIndex && styles.activeDot
//                         ]}
//                         onPress={() => scrollToIndex(index)}
//                     />
//                 ))}
//             </View>
//         </View>
//     );
// };

// const CARD_WIDTH = screenWidth - 60;
// const CARD_MARGIN = 30;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8fafc',
//     },
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f8fafc',
//     },
//     loaderText: {
//         marginTop: 16,
//         color: '#64748b',
//         fontSize: 16,
//     },
//     header: {
//         padding: 24,
//         backgroundColor: '#0E3386',
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//         paddingBottom: 36,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '800',
//         color: 'white',
//         marginBottom: 8,
//     },
//     headerSubtitle: {
//         fontSize: 16,
//         color: '#e0e7ff',
//     },
//     currentPlanContainer: {
//         backgroundColor: '#dbeafe',
//         margin: 20,
//         borderRadius: 16,
//         padding: 20,
//         marginTop: -20,
//         shadowColor: '#3b82f6',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 3,
//         zIndex: 10,
//     },
//     currentPlanBadge: {
//         backgroundColor: '#3b82f6',
//         alignSelf: 'flex-start',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 20,
//         marginBottom: 8,
//     },
//     currentPlanBadgeText: {
//         color: 'white',
//         fontWeight: '700',
//         fontSize: 12,
//     },
//     currentPlanText: {
//         fontSize: 13,
//         color: '#1e293b',
//         marginBottom: 16,
//     },
//     planNameHighlight: {
//         fontWeight: '800',
//         color: '#1d4ed8',
//     },
//     cancelBtn: {
//         backgroundColor: 'white',
//         padding: 12,
//         borderRadius: 12,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#ef4444',
//     },
//     cancelBtnText: {
//         color: '#ef4444',
//         fontWeight: '600',
//     },
//     sliderContainer: {
//         height: CARD_WIDTH * 1.5,
//         marginTop: 30,
//     },
//     card: {
//         width: CARD_WIDTH,
//         marginHorizontal: CARD_MARGIN,
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 24,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//         elevation: 3,
//         borderWidth: 2,
//         borderColor: '#0E3386',
//     },
//     //   popularCard: {
//     //     // borderColor: '#0E3386',
//     //     transform: [{ scale: 1.02 }],
//     //   },
//     currentCard: {

//         borderColor: '#60a5fa',
//     },
//     popularBadge: {
//         backgroundColor: '#0E3386',
//         alignSelf: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//         // position: 'absolute',
//         // top: -9,
//     },
//     popularBadgeText: {
//         color: 'white',
//         fontWeight: '800',
//         fontSize: 12,
//     },
//     planName: {
//         fontSize: 24,
//         fontWeight: '800',
//         color: '#1e293b',
//         textAlign: 'center',
//         marginBottom: 4,
//     },
//     price: {
//         fontSize: 32,
//         fontWeight: '800',
//         color: '#0E3386',
//         textAlign: 'center',
//         marginBottom: 16,
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#e2e8f0',
//         marginVertical: 16,
//     },
//     descriptionContainer: {
//         marginBottom: 5,
//     },
//     featureItem: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         marginBottom: 10,
//     },
//     featureText: {
//         fontSize: 15,
//         color: '#334155',
//         marginLeft: 12,
//         flex: 1,
//         lineHeight: 22,
//     },
//     subscribeBtn: {
//         backgroundColor: '#0E3386',
//         padding: 16,
//         borderRadius: 14,
//         alignItems: 'center',
//     },
//     currentPlanBtn: {
//         backgroundColor: '#c7d2fe',
//     },
//     subscribeBtnText: {
//         color: 'white',
//         fontWeight: '700',
//         fontSize: 16,
//     },
//     pagination: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 30,
//         marginBottom: 20,
//     },
//     dot: {
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: '#cbd5e1',
//         marginHorizontal: 5,
//     },
//     activeDot: {
//         backgroundColor: '#0E3386',
//         width: 12,
//         height: 12,
//     },
// });

// export default SubscriptionScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
// import { initIAP, getSubscriptions, requestSubscription, subscriptionSkus } from '../utils/iapHelper';

// const SubscriptionScreen = () => {
//   const [loading, setLoading] = useState(true);
//   const [plans, setPlans] = useState([]);

//   useEffect(() => {
//     const init = async () => {
//       await initIAP();
//       const subs = await getSubscriptions();
//       setPlans(subs);
//       setLoading(false);
//     };
//     init();

//     return () => {
//       // cleanup connection
//     };
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#000" />;
//   }

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Available Subscriptions</Text>

//       {plans.length > 0 ? (
//         plans.map((plan) => (
//           <View key={plan.productId} style={{ marginVertical: 10 }}>
//             <Text style={{ fontSize: 16 }}>{plan.title}</Text>
//             <Text>{plan.description}</Text>
//             <Text style={{ fontWeight: 'bold' }}>{plan.localizedPrice}</Text>

//             <Button
//               title="Subscribe"
//               onPress={() => requestSubscription(plan.productId)}
//             />
//           </View>
//         ))
//       ) : (
//         <Text>No plans found. Check Play Console setup.</Text>
//       )}
//     </View>
//   );
// };

// export default SubscriptionScreen;



