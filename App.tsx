import React, { useEffect, useState } from 'react';
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
import { OrganisationDrawer } from './src/components/DrawerNavigator';
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
        <SafeAreaProvider>
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
        </SafeAreaProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
    </>
  );
}

export default App;
