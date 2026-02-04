import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CreateInvoiceModal: React.FC<Props> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide">
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Invoice</Text>

        {/* spacer to center title */}
        <View style={{ width: 30 }} />
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tax invoice for organisation</Text>

        {/* Row 1 */}
        <View style={styles.row}>
          <AppTextInput placeholder="SOW" style={styles.input} />
          <AppTextInput placeholder="Resource User" style={styles.input} />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <AppTextInput placeholder="Tax Number" style={styles.input} />
          <AppTextInput placeholder="Timesheet" style={styles.input} />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <AppTextInput placeholder="Invoice Date" style={styles.input} />
          <AppTextInput placeholder="Invoice Number" style={styles.input} />
        </View>

        {/* Invoice Items Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colDate]}>DATE</Text>
          <Text style={[styles.th, styles.colAttendance]}>ATTENDENCE</Text>
          <Text style={[styles.th, styles.colAmount]}>AMOUNT</Text>
          <Text style={[styles.th, styles.colExpenses]}>EXPENSES</Text>
        </View>


        {/* Empty items */}
        <View style={styles.noData}>
          <Text>No data found</Text>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          {['Sub Total', 'Expenses', 'Tax / GST', 'Grand Total'].map(t => (
            <View key={t} style={styles.totalRow}>
              <Text>{t}</Text>
              <Text>0</Text>
            </View>
          ))}
        </View>

        {/* Terms */}
        <Text style={styles.section}>Terms & Conditions</Text>
        <AppTextInput
          style={styles.textArea}
          multiline
          placeholder="Enter terms & conditions"
        />

        {/* Approver */}
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox} />
          <Text>Invoice Approver</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.generateBtn}>
          <Text style={styles.btnText}>Generate Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default CreateInvoiceModal;



const styles = StyleSheet.create({
  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 30,
  },
  backText: {
    fontSize: 22,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  /* CONTENT */
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },

  tableHeader: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 4,
  },

  th: {
    fontWeight: '600',
    fontSize: 12,
  },

  colDate: {
    width: '20%',
  },

  colAttendance: {
    width: '30%',
  },

  colAmount: {
    width: '25%',
    textAlign: 'right',
  },

  colExpenses: {
    width: '25%',
    textAlign: 'right',
  },

  noData: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 6,
    marginTop: 10,
  },

  totals: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '50%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  section: {
    marginTop: 20,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 80,
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },

  generateBtn: {
    backgroundColor: '#0E3386',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  closeBtn: {
    backgroundColor: '#0E3386',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
