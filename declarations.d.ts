// declarations.d.ts

// SVG file support
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// react-native-vector-icons module support
declare module 'react-native-vector-icons/MaterialCommunityIcons';
declare module 'react-native-vector-icons/Ionicons' {
  const content: any;
  export default content;
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  const content: typeof Icon;
  export default content;
}