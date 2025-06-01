import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }, (_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.pageButton,
            currentPage === index + 1 && styles.activePage,
          ]}
        >
          <Text style={styles.pageText}>{index + 1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  pageButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  activePage: {
    backgroundColor: '#001f8e',
  },
  pageText: {
    color: '#fff',
  },
});
