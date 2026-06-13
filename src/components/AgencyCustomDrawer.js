import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PRIMARY = '#0E3386';
const TEXT = '#333';
const MUTED = '#777';
const ACTIVE_BG = '#E9EFFA';

const AgencyCustomDrawer = ({navigation, state}) => {
  const [open, setOpen] = useState(false);

  const currentRoute = state.routeNames[state.index];
  const isActive = route => currentRoute === route;

  const MainItem = ({label, route}) => (
    <TouchableOpacity
      style={[styles.item, isActive(route) && styles.activeItem]}
      onPress={() => navigation.navigate(route)}>
      <Text style={[styles.label, isActive(route) && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SubItem = ({label, route}) => (
    <TouchableOpacity
      style={[styles.subItem, isActive(route) && styles.activeItem]}
      onPress={() => navigation.navigate(route)}>
      <Text style={[styles.subLabel, isActive(route) && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView>
      {/* MAIN ITEMS */}
      <MainItem label="Agency Dashboard" route="Agency Dashboard" />
      <MainItem label="AI-RES Full Review" route="AIResFullReview" />
      <MainItem label="AI Review" route="AIReview" />
      <MainItem label="AI Draft" route="AIDraft" />
      <MainItem label="Master Service Agreement (MSA)" route="MasterAgreement" />
      <MainItem label="Statement Of Work (SOW)" route="StatementOfWork" />
      <MainItem label="Job Post" route="JobPostScreen" />
      <MainItem label="Talent Profile" route="TalentProfileList" />
      <MainItem label="Approval" route="ApprovalScreen" />
      <MainItem label="E-Signature" route="ESignature" />
      <MainItem label="Settings" route="Settings" />
      <MainItem label="Help" route="HelpScreen" />

      {/* MASTER DATA */}
      <Text style={styles.section}>MASTER DATA</Text>

      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(!open)}>
        <Text style={styles.dropdownText}>Master Data</Text>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={MUTED}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.subMenu}>
          <SubItem label="Tax Group" route="TaxGroupScreen" />
          <SubItem label="Company Location" route="CompanyLocationScreen" />
          <SubItem label="GL Account" route="GLAccountScreen" />
          <SubItem label="Business Unit" route="BusinessUnitScreen" />
          <SubItem label="Cost Center" route="CostCenter" />
          <SubItem label="Msa Type" route="MsaType" />
          <SubItem label="UnpscCode" route="UnpscCode" />
          <SubItem label="Tax Rate" route="TaxRate" />
          <SubItem label="Payment Terms" route="PaymentTerms" />
          <SubItem label="Sow Type" route="SowTypeScreen" />
          <SubItem label="Expenses Category" route="ExpensesCategoryScreen" />
          <SubItem label="Income Tax Slabs" route="IncomeTaxSlabsScreen" />
          <SubItem label="Material Master Data" route="MaterialMasterData" />
          <SubItem
            label="Agency / Supplier Masterdata"
            route="AgencySupplierMasterdata"
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
};

export default AgencyCustomDrawer;
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
