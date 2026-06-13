import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import CreateInvoiceModal from '../components/CreateInvoiceModal';
import AppTextInput from '../components/AppTextInput';

type Invoice = {
  id: string;
  date: string;
  invoiceNumber: string;
  organization: string;
  resource: string;
  amount: string;
  status: 'Pending' | 'Accepted';
};

const InvoiceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Accepted'>(
    'All',
  );
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const invoices: Invoice[] = [
    {
      id: '1',
      date: '12 Mar 2025',
      invoiceNumber: 'INV-2025-001',
      organization: 'ABC Technologies Pvt Ltd',
      resource: 'Rahul Sharma',
      amount: '₹45,000',
      status: 'Pending',
    },
    {
      id: '2',
      date: '05 Mar 2025',
      invoiceNumber: 'INV-2025-002',
      organization: 'LegalEdge Solutions',
      resource: 'Anita Verma',
      amount: '₹62,500',
      status: 'Accepted',
    },
    {
      id: '3',
      date: '25 Feb 2025',
      invoiceNumber: 'INV-2025-003',
      organization: 'Prime Consulting Group',
      resource: 'Suresh Kumar',
      amount: '₹38,750',
      status: 'Pending',
    },
    {
      id: '4',
      date: '15 Feb 2025',
      invoiceNumber: 'INV-2025-004',
      organization: 'Global Law Associates',
      resource: 'Neha Singh',
      amount: '₹81,200',
      status: 'Accepted',
    },
  ];
  const filteredInvoices = invoices.filter(inv =>
    activeTab === 'All' ? true : inv.status === activeTab,
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Invoice</Text>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.createBtnText}>+ Create Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['All', 'Pending', 'Accepted'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search + Export */}
      <View style={styles.searchRow}>
        <AppTextInput
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportText}>↑ Export</Text>
        </TouchableOpacity>
      </View>

      {/* Invoice List (Card Style) */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop: 16}}
        renderItem={({item}) => (
          <View style={styles.card}>
            {/* Top Row */}
            <View style={styles.cardTopRow}>
              <Text style={styles.cardDate}>{item.date}</Text>

              <View
                style={[
                  styles.statusBadge,
                  item.status === 'Accepted' ? styles.accepted : styles.pending,
                ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.cardSection}>
              <Text style={styles.label}>Invoice No</Text>
              <Text style={styles.value}>{item.invoiceNumber}</Text>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.label}>Organisation</Text>
              <Text style={styles.value}>{item.organization}</Text>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.label}>Resource</Text>
              <Text style={styles.value}>{item.resource}</Text>
            </View>

            {/* Amount */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>{item.amount}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text>No invoices found!</Text>
          </View>
        }
      />
      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold'},

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  createBtn: {
    backgroundColor: '#0E3386',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createBtnText: {color: '#fff', fontWeight: '600'},

  tabs: {flexDirection: 'row', marginTop: 20},
  tab: {marginRight: 20, paddingBottom: 6},
  activeTab: {borderBottomWidth: 2, borderColor: '#0E3386'},
  tabText: {color: '#999'},
  activeTabText: {color: '#0E3386', fontWeight: '600'},

  searchRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
  },
  exportBtn: {
    marginLeft: 10,
    backgroundColor: '#0E3386',
    padding: 10,
    borderRadius: 6,
  },
  exportText: {color: '#fff'},

  tableHeader: {
    marginTop: 24,
    flexDirection: 'row',
    backgroundColor: '#0E3386',
    padding: 12,
    borderRadius: 8,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  emptyBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardDate: {
    fontSize: 13,
    color: '#6B7280',
  },

  cardSection: {
    marginTop: 10,
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },

  amountRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  amountLabel: {
    fontSize: 13,
    color: '#374151',
  },

  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E3386',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pending: {
    backgroundColor: '#FEF3C7',
  },

  accepted: {
    backgroundColor: '#DCFCE7',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});
