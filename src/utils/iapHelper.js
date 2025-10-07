// import * as RNIap from 'react-native-iap';

// // Replace with your actual product ID from Play Console
// export const subscriptionSkus = ['agreement_subscription_1'];

// export const initIAP = async () => {
//   try {
//     await RNIap.initConnection();
//     console.log('IAP connection initialized');
//   } catch (err) {
//     console.warn('IAP init error:', err);
//   }
// };

// export const getSubscriptions = async () => {
//   try {
//     const subs = await RNIap.getSubscriptions({ skus: subscriptionSkus });
//     console.log('Available subscriptions:', subs);
//     return subs;
//   } catch (err) {
//     console.warn('Error fetching subscriptions:', err);
//     return [];
//   }
// };

// export const requestSubscription = async (sku) => {
//   try {
//     await RNIap.requestSubscription({ sku });
//   } catch (err) {
//     console.warn('Subscription request error:', err);
//   }
// };
