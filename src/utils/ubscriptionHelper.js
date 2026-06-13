import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from '../Services/services';

export const refreshSubscriptionStatus = async () => {
  try {
    const result = await Services.getSubscriptionStatus();
    console.log("🔄 Refreshed Subscription:", result);

    if (result.success) {
      const hasPremiumAccess = result.data?.has_premium_access || false;
      const purchasedProductId = result.data?.product_id || null;

      // Save premium status
      await AsyncStorage.setItem(
        'hasPremiumAccess',
        JSON.stringify(hasPremiumAccess)
      );

      // Save purchased product id
      if (purchasedProductId) {
        await AsyncStorage.setItem(
          'purchasedProductId',
          purchasedProductId
        );
      } else {
        await AsyncStorage.removeItem('purchasedProductId');
      }

    } else {
      // No subscription
      await AsyncStorage.setItem('hasPremiumAccess', JSON.stringify(false));
      await AsyncStorage.removeItem('purchasedProductId');
    }

  } catch (err) {
    await AsyncStorage.setItem('hasPremiumAccess', JSON.stringify(false));
    await AsyncStorage.removeItem('purchasedProductId');
    console.log('Error refreshing subscription:', err);
  }
};
