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
