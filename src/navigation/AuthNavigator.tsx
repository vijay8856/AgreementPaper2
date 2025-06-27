// // src/navigation/AuthNavigator.tsx
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../screens/Login';
// import SignUpScreen from '../screens/SignUpScreen';
// import VerifyEmailScreen from '../screens/VerifyEmailScreen';

// export type AuthStackParamList = {
//   Login: undefined;
//   SignUp: undefined;
//   VerifyEmail: undefined;
// };

// const AuthStack = createStackNavigator<AuthStackParamList>();

// const AuthNavigator = () => (
//   <AuthStack.Navigator
//     screenOptions={{
//       headerShown: false,
//     }}
//   >
//     <AuthStack.Screen name="Login" component={LoginScreen} />
//     <AuthStack.Screen name="SignUp" component={SignUpScreen} />
//     <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
//   </AuthStack.Navigator>
// );

// export default AuthNavigator;
