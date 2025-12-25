// // src/iap/IAPProvider.js
// import React, { createContext, useContext } from 'react';
// import { Alert } from 'react-native';
// import { useIAP, ErrorCode } from 'react-native-iap';

// const IAPContext = createContext(null);

// export const IAPProvider = ({ children }) => {
//   const iap = useIAP({
//     // Called when a purchase is completed successfully
//     onPurchaseSuccess: async (purchase) => {
//       try {
//         console.log('Purchase succeeded:', purchase);

//         // 1) Validate on your server using purchaseToken (recommended)
//         //    send purchase.purchaseToken and purchase.productId + packageName
//         // await fetch('/verify', ...)

//         // 2) Finish / acknowledge the transaction (this handles Android ack and iOS finish)
//         await iap.finishTransaction({
//           purchase,
//           isConsumable: false, // subscriptions are non-consumable
//         });

//         Alert.alert('Purchase successful', 'Thank you!');
//       } catch (e) {
//         console.error('onPurchaseSuccess error:', e);
//         Alert.alert('Purchase processing failed', e.message || String(e));
//       }
//     },

//     onPurchaseError: (err) => {
//       // ignore user-cancelled
//       if (err?.code !== ErrorCode.UserCancelled) {
//         console.error('Purchase error:', err);
//         Alert.alert('Purchase error', err?.message || 'Unknown error');
//       }
//     },
//   });

//   return <IAPContext.Provider value={iap}>{children}</IAPContext.Provider>;
// };

// export const useIAPContext = () => {
//   const ctx = useContext(IAPContext);
//   if (!ctx) throw new Error('useIAPContext must be used within IAPProvider');
//   return ctx;
// };
// src/iap/IAPProvider.js
import React, { createContext, useEffect, useState } from 'react';
import { initConnection, endConnection } from 'react-native-iap';

export const IAPContext = createContext();

export const IAPProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initIAP = async () => {
      try {
        const result = await initConnection();
        console.log('IAP connection result:', result);
        setConnected(true);
      } catch (error) {
        console.error('IAP init failed:', error);
      }
    };

    initIAP();
    return () => {
      endConnection();
    };
  }, []);

  return (
    <IAPContext.Provider value={{ connected }}>
      {children}
    </IAPContext.Provider>
  );
};
