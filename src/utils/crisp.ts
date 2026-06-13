// import { Platform } from 'react-native';

// let Crisp: any = null;

// if (Platform.OS === 'android') {
//   Crisp = require('react-native-crisp-chat-sdk');
// }

// // Safe no-op functions for iOS
// export const configure = (..._args: any[]) => {
//   if (Crisp?.configure) Crisp.configure(..._args);
// };

// export const setTokenId = (..._args: any[]) => {
//   if (Crisp?.setTokenId) Crisp.setTokenId(..._args);
// };

// export const setUserEmail = (..._args: any[]) => {
//   if (Crisp?.setUserEmail) Crisp.setUserEmail(..._args);
// };

// export const setUserNickname = (..._args: any[]) => {
//   if (Crisp?.setUserNickname) Crisp.setUserNickname(..._args);
// };

// export const setUserCompany = (..._args: any[]) => {
//   if (Crisp?.setUserCompany) Crisp.setUserCompany(..._args);
// };

// export const resetSession = () => {
//   if (Crisp?.resetSession) Crisp.resetSession();
// };

// export const CrispChat = Platform.OS === 'android'
//   ? Crisp?.default
//   : () => null;
