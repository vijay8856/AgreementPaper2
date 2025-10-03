import React, { createContext, useContext, useState } from 'react';
import Toast from 'react-native-toast-message';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
 const showToast = (message, type = 'success', title) => {
  Toast.show({
    type,
    text1: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'),
    text2: message,
    position: 'top',
  });
};

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast position="top" />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};