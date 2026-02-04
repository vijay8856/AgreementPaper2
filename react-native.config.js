module.exports = {
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
  dependencies: {
   
    'react-native-reanimated': {
      platforms: {
        android: {
          packageImportPath: 'import com.swmansion.reanimated.ReanimatedPackage;',
        },
      },
    },
     '@react-native-firebase/app': {
      platforms: {
        ios: null,
      },
    },
    '@react-native-firebase/auth': {
      platforms: {
        ios: null,
      },
    },
    '@react-native-firebase/remote-config': {
      platforms: {
        ios: null,
      },
    },
  },
};