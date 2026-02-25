// utils/imagePicker.ts
import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

export const pickProfileImage = async () => {
  const image = await ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true,
    compressImageQuality: 0.8,
    mediaType: 'photo',
    includeExif: false,
  });

  if (!image?.path) {
    throw new Error('No image selected');
  }

  // Destination path (PERMANENT)
  const fileName = image.filename || `profile_${Date.now()}.jpg`;
  const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  // Copy image out of temp folder (IMPORTANT for iOS)
  await RNFS.copyFile(image.path, destPath);

  const uri =
    Platform.OS === 'ios'
      ? `file://${destPath}`
      : destPath;

  return {
    uri,
    type: image.mime || 'image/jpeg',
    name: fileName,
  };
};
