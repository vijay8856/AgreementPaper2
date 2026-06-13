// import React, { useEffect } from 'react';
// import { View, ActivityIndicator, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useNavigation } from '@react-navigation/native';
// import { Linking } from 'react-native';
// import Services from '../Services/services';
// import Toast from 'react-native-toast-message';
// import CookieManager from '@react-native-cookies/cookies';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/types';





// const CLIENT_ID = '86qalaty2f662f';
// const REDIRECT_URI = 'https://app.agreementpaper.com/login-with-linkedin';
// const STATE = 'random_secure_state';
// const SCOPE = 'r_liteprofile';
// type LinkedInLoginScreenProp = StackNavigationProp<RootStackParamList, 'LinkedInLoginScreen'>;
// const LinkedInLoginScreen = () => {
//     const navigation = useNavigation<LinkedInLoginScreenProp>();



//     useEffect(() => {
//         const clearCookies = async () => {
//             try {
//                 await CookieManager.clearAll();
//                 console.log('✅ Cookies cleared — LinkedIn login will be fresh.');
//             } catch (error) {
//                 console.log('❌ Failed to clear cookies:', error);
//             }
//         };

//         clearCookies();
//     }, []);



//     const linkedInAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&c
// lient_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
//         REDIRECT_URI
//     )}&scope=profile%20email%20openid%20`;

//     const handleNavigationChange = async (navState: any) => {
//         const { url } = navState;

//         if (url.startsWith(REDIRECT_URI)) {
//             const codeMatch = url.match(/code=([^&]+)/);
//             const code = codeMatch?.[1];
//             console.log("cocdematch", codeMatch);
//             console.log("code", code);

//             if (code) {
//                 console.log("code2", code);

//                 navigation.goBack();
//                 await sendCodeToBackend(code);
//             } else {
//                 Alert.alert('Error', 'LinkedIn login failed.');
//                 navigation.goBack();
//             }
//         }
//     };

//     const sendCodeToBackend = async (code: string) => {
//         try {
//             const formData = new FormData();
//             formData.append('code', code);
//             formData.append('user_type', 'INDIVIDUAL_USER');

//             const response = await Services.linkedinLogin(formData);
//             console.log("response00", response);

//             if (response.success) {


//                 Toast.show({
//                     type: 'success',
//                     text1: 'Login Success:',
//                     text2: 'Logged in with LinkedIn!',
//                     position: 'top',
//                 });

//             } else {
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Error',
//                     text2: response.error?.error || 'Something went wrong',
//                     position: 'top',
//                 });
//             }
//         } catch (err) {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error',
//                 text2: 'Something went wrong',
//                 position: 'top',
//             });
//         }
//     };

//     return (
//         <View style={{ flex: 1 }}>
//             <WebView
//                 source={{ uri: linkedInAuthURL }}
//                 onNavigationStateChange={handleNavigationChange}
//                 startInLoadingState
//                 renderLoading={() => <ActivityIndicator size="large" />}

//             />
//         </View>
//     );
// };

// export default LinkedInLoginScreen;
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Services from '../Services/services';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type LinkedInLoginScreenProp = StackNavigationProp<
  RootStackParamList,
  'LinkedInLoginScreen'
>;

const CLIENT_ID = '86qalaty2f662f';

// 🔴 IMPORTANT: Use custom scheme, NOT https
const REDIRECT_URI = 'https://app.agreementpaper.com/login-with-linkedin';
const STATE = 'secure_random_state';
const SCOPE = 'openid profile email';

const LinkedInLoginScreen = () => {
  const navigation = useNavigation<LinkedInLoginScreenProp>();

  const linkedInAuthURL =
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&state=${STATE}`;

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      if (url.startsWith(REDIRECT_URI)) {
        const code = new URL(url).searchParams.get('code');

        if (code) {
          sendCodeToBackend(code);
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Authorization code not found',
          });
          navigation.goBack();
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Open LinkedIn login page
    Linking.openURL(linkedInAuthURL);

    return () => {
      subscription.remove();
    };
  }, []);

  const sendCodeToBackend = async (code: string) => {
    try {
      const formData = new FormData();
      formData.append('code', code);
      formData.append('user_type', 'INDIVIDUAL_USER');

      const response = await Services.linkedinLogin(formData);

      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Logged in with LinkedIn',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response?.error?.error || 'Something went wrong',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to login with LinkedIn',
      });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LinkedInLoginScreen;
