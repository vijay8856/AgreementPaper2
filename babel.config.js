module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    '@babel/plugin-transform-runtime',
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
  
    }],
    '@babel/plugin-transform-class-static-block',

  ],
};
