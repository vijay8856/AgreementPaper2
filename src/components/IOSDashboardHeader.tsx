import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Notifications from './Modals/Notifications';

const IOSDashboardHeader = ({
  companyName,
  hasPremiumAccess,
  onProfilePress,
  onUpgradePress,
}:any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        <Text style={styles.title}>Lawyer Dashboard</Text>
        {companyName ? <Text style={styles.subtitle}>{companyName}</Text> : null}
      </View>

      <View style={styles.right}>
            <Notifications />
        {/* <TouchableOpacity
          onPress={onUpgradePress}
          style={styles.upgradeBtn}>
          <Text style={styles.upgradeText}>
           
            Upgrade Plan
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={onProfilePress}>
          <Icon name="account-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IOSDashboardHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E3386',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  left: {
    flex: 1,
  },
  title: {
    paddingBottom:10,
    color: '#f2f2f2ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upgradeBtn: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upgradeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
