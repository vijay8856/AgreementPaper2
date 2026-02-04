import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  visible: boolean;
  date: Date;
  onChange: (event: any, date?: Date) => void;
  onClose: () => void;
};

const DatePickerSheet = ({visible, date, onChange, onClose}: Props) => {
  if (!visible) return null;

  // ✅ ANDROID (native dialog – already perfect)
  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(e, d) => {
          onChange(e, d);
          onClose();
        }}
      />
    );
  }

  // ✅ IOS CUSTOM BOTTOM SHEET
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}>
      {/* 🔥 Backdrop (tap outside closes) */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* 🔒 Bottom Sheet */}
      <SafeAreaView style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.done}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
       <View style={{ backgroundColor: '#fff' }}>
  <DateTimePicker
    value={date}
    mode="date"
    display="spinner"
    onChange={onChange}
    style={styles.picker}
    textColor="black"
    themeVariant="light"
  />
</View>

      </SafeAreaView>
    </Modal>
  );
};

export default DatePickerSheet;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // ✅ FULL WIDTH FIX
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },

  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },

  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },

  picker: {
    backgroundColor: '#fff',
  },
});
