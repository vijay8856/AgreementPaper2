
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PRIMARY = '#0E3386';
const TEXT = '#333';
const MUTED = '#777';
const ACTIVE_BG = '#E9EFFA';

const CustomDrawerContent = ({ navigation, state }) => {
  const [open, setOpen] = useState(false);
  const activeRoute = state?.routeNames[state?.index];

  const isActive = (route) => activeRoute === route;

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>

      {/* APP SECTION */}
      <Text style={styles.section}>MAIN</Text>

      <DrawerItem label="Dashboard" route="OrganisationDashboard" navigation={navigation} active={isActive('OrganisationDashboard')} />
      <DrawerItem label="MSA" route="MasterAgreement" navigation={navigation} active={isActive('MasterAgreement')} />
      <DrawerItem label="SOW" route="StatementOfWork" navigation={navigation} active={isActive('StatementOfWork')} />
      <DrawerItem label="Approval" route="ApprovalScreen" navigation={navigation} active={isActive('ApprovalScreen')} />
      <DrawerItem label="Time Sheet" route="TimeSheet" navigation={navigation} active={isActive('TimeSheet')} />
      <DrawerItem label="AI-RES Full Review" route="AIResFullReview" navigation={navigation} active={isActive('AIResFullReview')} />
      <DrawerItem label="AI-Review" route="AIReview" navigation={navigation} active={isActive('AIReview')} />
      <DrawerItem label="AI-Draft" route="AIDraft" navigation={navigation} active={isActive('AIDraft')} />
      <DrawerItem label="Supplier / Agency" route="SupplierAgencyScreen" navigation={navigation} active={isActive('SupplierAgencyScreen')} />
      <DrawerItem label="E-Signature" route="ESignature" navigation={navigation} active={isActive('ESignature')} />
      <DrawerItem label="Invite Agency" route="InviteAgency" navigation={navigation} active={isActive('InviteAgency')} />
      <DrawerItem label="Invite Resource" route="InviteResource" navigation={navigation} active={isActive('InviteResource')} />
      <DrawerItem label="Invoice" route="InvoiceScreen" navigation={navigation} active={isActive('InvoiceScreen')} />

      {/* MASTER DATA */}
      <Text style={styles.section}>MASTER DATA</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownText}>Master Data</Text>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={MUTED}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.subMenu}>
          <SubItem label="Tax Group" route="TaxGroupScreen" navigation={navigation} active={isActive('TaxGroupScreen')} />
          <SubItem label="Company Location" route="CompanyLocationScreen" navigation={navigation} active={isActive('CompanyLocationScreen')} />
          <SubItem label="GL Account" route="GLAccountScreen" navigation={navigation} active={isActive('GLAccountScreen')} />
          <SubItem label="Business Unit" route="BusinessUnitScreen" navigation={navigation} active={isActive('BusinessUnitScreen')} />
          <SubItem label="Cost Center" route="CostCenter" navigation={navigation} active={isActive('CostCenter')} />
          <SubItem label="Msa Type" route="MsaType" navigation={navigation} active={isActive('MsaType')} />
          <SubItem label="UnpscCode" route="UnpscCode" navigation={navigation} active={isActive('UnpscCode')} />
          <SubItem label="Tax Rate" route="TaxRate" navigation={navigation} active={isActive('TaxRate')} />
          <SubItem label="Payment Terms" route="PaymentTerms" navigation={navigation} active={isActive('PaymentTerms')} />
          <SubItem label="Sow Type " route="SowTypeScreen" navigation={navigation} active={isActive('SowTypeScreen')} />
          <SubItem label="Expenses Category" route="ExpensesCategoryScreen" navigation={navigation} active={isActive('ExpensesCategoryScreen')} />
          <SubItem label="Income Tax Slabs" route="IncomeTaxSlabsScreen" navigation={navigation} active={isActive('IncomeTaxSlabsScreen')} />
          <SubItem label="Material Master Data" route="MaterialMasterData" navigation={navigation} active={isActive('MaterialMasterData')} />
 
         
          <SubItem label="Agency / Supplier Masterdata" route="AgencySupplierMasterdata" navigation={navigation} active={isActive('AgencySupplierMasterdata')} />
        </View>
      )}

      {/* SETTINGS */}
      <Text style={styles.section}>OTHER</Text>

      <DrawerItem label="Settings" route="Settings" navigation={navigation} active={isActive('Settings')} />
      <DrawerItem label="Help" route="HelpScreen" navigation={navigation} active={isActive('HelpScreen')} />

    </DrawerContentScrollView>
  );
};

/* MAIN ITEM */
const DrawerItem = ({ label, route, navigation, active }) => (
  <TouchableOpacity
    style={[styles.item, active && styles.activeItem]}
    onPress={() => navigation.navigate(route)}
  >
    <Text style={[styles.label, active && styles.activeText]}>{label}</Text>
  </TouchableOpacity>
);

/* SUB ITEM */
const SubItem = ({ label, route, navigation, active }) => (
  <TouchableOpacity
    style={[styles.subItem, active && styles.activeItem]}
    onPress={() => navigation.navigate(route)}
  >
    <Text style={[styles.subLabel, active && styles.activeText]}>{label}</Text>
  </TouchableOpacity>
);

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },

  section: {
    fontSize: 12,
    color: MUTED,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 8,
    marginBottom: 4,
  },

  label: {
    fontSize: 15,
    color: TEXT,
    fontWeight: '500',
  },

  dropdown: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },

  subMenu: {
    paddingLeft: 24,
    marginTop: 4,
  },

  subItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },

  subLabel: {
    fontSize: 14,
    color: TEXT,
  },

  activeItem: {
    backgroundColor: ACTIVE_BG,
  },

  activeText: {
    color: PRIMARY,
    fontWeight: '600',
  },
});
