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
import { OrganisationDrawer } from './src/components/DrawerNavigator';
// import UpdateChecker from './UpdateChecker';
import { ToastProvider } from './src/components/ToastContext';
function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading delay (e.g., for 3 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LoaderProvider>
        {/* <UpdateChecker /> */}
              <ToastProvider>
        <SafeAreaProvider>
              <PaperProvider>
          {isLoading ? (
            <SplashScreen />
          ) : (
            <StripeProvider
              publishableKey={REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE}
              merchantIdentifier="merchant.com.yourapp.identifier"
              urlScheme="your-url-scheme"
            >
              <NavigationContainer>
                <NavigationManager />
                <AppLoader />
                <Toast />
              </NavigationContainer>
            </StripeProvider>
          )}
          </PaperProvider>
        </SafeAreaProvider>
        </ToastProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
    </>
  );
}

export default App;
