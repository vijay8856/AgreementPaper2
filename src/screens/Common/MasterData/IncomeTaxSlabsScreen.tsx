// @ts-nocheck

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Services from '../../../Services/services';

const LIMIT = 100;

const IncomeTaxSlabs = () => {
  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchCountry, setSearchCountry] = useState('');
  const [hasMore, setHasMore] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  const fetchSlabs = async (reset = false) => {
    if (loading) return;

    setLoading(true);

    const res = await Services.getIncomeTaxSlabs({
      limit: LIMIT,
      offset: reset ? 0 : offset,
      country: searchCountry || undefined,
    });
  console.log("res hu ",res);

    if (res.success) {
      const results = res.data.results || [];

      setSlabs(prev =>
        reset ? results : [...prev, ...results],
      );

      setOffset(prev =>
        reset ? results.length : prev + results.length,
      );

      setHasMore(results.length === LIMIT);
    }

    setLoading(false);
  };

  /* =======================
     INITIAL LOAD
  ======================= */
  useEffect(() => {
    fetchSlabs(true);
  }, []);

  /* =======================
     SEARCH FILTER
  ======================= */
  useEffect(() => {
    fetchSlabs(true);
  }, [searchCountry]);

  /* =======================
     RENDER CARD
  ======================= */
  const renderItem = ({ item }:any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.country_name}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Tax Year</Text>
        <Text style={styles.value}>
          {item.start_year} - {item.end_year}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Income Range</Text>
        <Text style={styles.value}>
          {item.min_income} - {item.max_income} {item.currency}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tax %</Text>
        <Text style={styles.percentage}>
          {item.tax_percentage}%
        </Text>
      </View>
    </View>
  );

  /* =======================
     UI
  ======================= */
  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        placeholder="Search by country"
        placeholderTextColor={'black'}
        value={searchCountry}
        onChangeText={setSearchCountry}
        style={styles.search}
      />

      {/* List */}
      <FlatList
        data={slabs}
        keyExtractor={item => item.id.toString()} // ✅ FIXED
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={() => hasMore && fetchSlabs()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ marginTop: 16 }} /> : null
        }
      />
    </View>
  );
};

export default IncomeTaxSlabs;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e1e1ff',
    padding: 16,
  },

  search: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#515050ff',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
  },

card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  padding: 16,
  marginBottom: 20,

  // iOS – shadow on all sides
  shadowColor: '#666667ff',
  shadowOffset: { width: 0, height: 0 }, // 🔑 KEY POINT
  shadowOpacity: 0.48,
  shadowRadius: 10,

  // Android
  elevation: 8,
},


  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0A1E8A',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  label: {
    fontSize: 12,
    color: '#64748B',
  },

  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },

  percentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
});
