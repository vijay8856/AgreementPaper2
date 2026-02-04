// import React, {useEffect, useState} from 'react';
// import 'react-native-get-random-values';
// import {StatusBar} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import {StripeProvider} from '@stripe/stripe-react-native';
// import {LoaderProvider} from './src/context/LoaderContext';
// import AppLoader from './src/components/AppLoader';
// import NavigationManager from './src/navigation/NavigationManager';
// import SplashScreen from './src/components/SplashScreen';
// import Toast from 'react-native-toast-message';
// import {REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE} from '@env';
// import 'react-native-gesture-handler';
// import {Provider as PaperProvider} from 'react-native-paper';
// import {OrganisationDrawer} from './src/components/DrawerNavigator';
// import {IAPProvider} from './src/utils/IAPProvider';
// import UpdateChecker from './src/components/UpdateChecker';
// // import UpdateChecker from './UpdateChecker';
// import {ToastProvider} from './src/components/ToastContext';


// function App(): React.JSX.Element {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate initial loading delay (e.g., for 3 seconds)
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 3000); // 3 seconds

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <GestureHandlerRootView style={{flex: 1}}>
//         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//         <LoaderProvider>
//           {/* <UpdateChecker /> */}
//           <ToastProvider>
//             <SafeAreaProvider>
//               <PaperProvider>
//                 {isLoading ? (
//                   <SplashScreen />
//                 ) : (
//                   <IAPProvider>
//                     <StripeProvider
//                       publishableKey={REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE}
//                       merchantIdentifier="merchant.com.yourapp.identifier"
//                       urlScheme="your-url-scheme">
//                       <NavigationContainer>
//                         <NavigationManager />
//                         <UpdateChecker />
//                         <AppLoader />
//                         <Toast />
//                       </NavigationContainer>
//                     </StripeProvider>
//                   </IAPProvider>
//                 )}
//               </PaperProvider>
//             </SafeAreaProvider>
//           </ToastProvider>
//         </LoaderProvider>
//       </GestureHandlerRootView>
//     </>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { LoaderProvider } from './src/context/LoaderContext';
import AppLoader from './src/components/AppLoader';
import NavigationManager from './src/navigation/NavigationManager';
import SplashScreen from './src/components/SplashScreen';
import Toast from 'react-native-toast-message';
import { REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE } from '@env';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { IAPProvider } from './src/utils/IAPProvider';
import UpdateChecker from './src/components/UpdateChecker';
import { ToastProvider } from './src/components/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withIAPContext } from 'react-native-iap';   // ← IMPORTANT
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//   configure,
//   setTokenId,
//   setUserEmail,
//   setUserNickname,
//   setUserCompany,
//   resetSession
// } from './src/utils/crisp';


const CRISP_WEBSITE_ID = "03838c24-284f-44fa-8de1-2702cc316c7b";
function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
// useEffect(() => {
//   const initCrisp = async () => {
//     try {
//       // 1️⃣ Initialize Crisp with your website ID
//       configure("03838c24-284f-44fa-8de1-2702cc316c7b");

//       // 2️⃣ Get user details saved at login
//       const [
//         userId,
//         email,
//         firstName,
//         lastName,
//         company,
//         hasLoggedIn,
//       ] = await AsyncStorage.multiGet([
//         "userId",
//         "email",
//         "first_Name",
//         "last_Name",
//         "company",
//         "hasLoggedIn",
//       ]).then((pairs) => pairs.map(p => p[1]));

//       // 3️⃣ If NOT logged in → clean Crisp session
//       if (!hasLoggedIn || !userId) {
//         setTokenId(null);
//         resetSession();
//         return;
//       }

//       // 4️⃣ Bind Crisp session using userId (very important)
//       setTokenId(userId);

//       // 5️⃣ Set identity values
//       if (email) setUserEmail(email);
//       if (firstName || lastName)
//         setUserNickname(`${firstName ?? ""} ${lastName ?? ""}`.trim());

//       // 6️⃣ Set company info (optional)
//       if (company) {
//         setUserCompany({
//           name: company,
//         });
//       }

//     } catch (error) {
//       console.log("CRISP INIT ERROR:", error);
//     }
//   };

//   initCrisp();
// }, []);

MaterialCommunityIcons.loadFont();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LoaderProvider>
        <ToastProvider>
          <SafeAreaProvider>
            <PaperProvider>
              {isLoading ? (
                <SplashScreen />
              ) : (
                <IAPProvider>
                  <StripeProvider
                    publishableKey={REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE}
                    merchantIdentifier="merchant.com.yourapp.identifier"
                    urlScheme="your-url-scheme">
                    <NavigationContainer>
                      <NavigationManager />
                <UpdateChecker />
                      
                      <AppLoader />
                      <Toast />
                    </NavigationContainer>
                  </StripeProvider>
                </IAPProvider>
              )}
            </PaperProvider>
          </SafeAreaProvider>
        </ToastProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}

export default withIAPContext(App);   // ← MUST wrap here
