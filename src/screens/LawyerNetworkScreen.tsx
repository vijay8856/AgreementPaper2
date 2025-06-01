import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FilterBar from '../components/FilterBar';
import LawyerTable from '../components/LawyerTable';
import Pagination from '../components/Pagination';

const LawyerDirectoryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <FilterBar />
      <LawyerTable />
      {/* <Pagination currentPage={1} totalPages={7} /> */}
    </ScrollView>
  );
};

export default LawyerDirectoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: '#fff',
  },
});
