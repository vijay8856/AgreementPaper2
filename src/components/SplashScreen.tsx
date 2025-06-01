// // import React from 'react';
// // import {View, Image, StyleSheet, Dimensions} from 'react-native';
// // import LoaderVJ from '../assets/images/LoaderVJ.svg';

// // const {width} = Dimensions.get('window');

// // const SplashScreen: React.FC = () => {
// //   return (
// //     <View style={styles.container}>
// //       <Image
// //         source={require('../assets/images/a200.png')}
// //         style={styles.logo}
// //         resizeMode="contain"
// //       />

// //       <LoaderVJ width={80} height={80} />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   logo: {
// //     width: width * 0.5,
// //     height: width * 0.2,
// //     marginBottom: 20,
// //   },
// // });

// // export default SplashScreen;
// import React, {useRef, useEffect} from 'react';
// import {
//   Animated,
//   Easing,
//   View,
//   StyleSheet,
//   Dimensions,
//   Image,
// } from 'react-native';
// import LoaderVJ from '../assets/images/LoaderVJ.svg'; // Still using SVG

// const {width} = Dimensions.get('window');

// const SplashScreen: React.FC = () => {
//   const spinValue = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 1000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       }),
//     ).start();
//   }, [spinValue]);

//   const spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View style={{transform: [{rotate: spin}]}}>
//         <LoaderVJ width={80} height={80} />
//       </Animated.View>
//       <Image
//         source={require('../assets/images/a200.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: width * 0.5,
//     height: width * 0.2,
//     marginBottom: 20,
//   },
// });

// export default SplashScreen;
import React from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/a200.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <LottieView
        source={require('../assets/images/MainScene.json')} // path to your .json
        autoPlay
        loop
        style={{width: 200, height: 100}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.2,
    marginBottom: 20,
  },
});

export default SplashScreen;
