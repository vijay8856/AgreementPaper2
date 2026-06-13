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
