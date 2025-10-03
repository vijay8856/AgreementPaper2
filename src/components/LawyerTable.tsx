// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import LawyerRow from './LawyerRow';
// import Services from '../Services/services';
// import Toast from 'react-native-toast-message';

// const LawyerTable: React.FC = () => {
//   const [lawyers, setLawyers] = useState<Array<{
//     id: number;
//     name: string;
//     email: string;
//     company_name: string;
//     country: string;
//     is_active: boolean;
//   }>>([]);
  
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchLawyers = async (isRefresh = false) => {
//     if (!isRefresh) setLoading(true);
//     else setRefreshing(true);

//     const response = await Services.getLawyerNetworkList({ limit: 6, offset: 0 });

//     if (response.success) {
//       setLawyers(response.data);
//     } else {
//       Toast.show({
//         type: 'error',
//         text1: 'Failed to load lawyer list',
//         text2: response.error?.message || 'Invalid credentials',
//         position: 'top',
//       });
//     }

//     setLoading(false);
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     fetchLawyers();
//   }, []);

//   const onRefresh = useCallback(() => {
//     fetchLawyers(true);
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#000078" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       horizontal
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <View>
//         <View style={styles.header}>
//           <Text style={styles.headerCellId}>ID</Text>
//           <Text style={styles.headerCell}>Lawyer's</Text>
//           <Text style={styles.headerCellEmail}>Email</Text>
//           <Text style={styles.headerCellLocation}>Location</Text>
//           <Text style={styles.headerCellStatus}>Status</Text>
//           <Text style={styles.headerCell}>Connect</Text>
//           <Text style={styles.headerCell}>Action</Text>
//         </View>

//         {lawyers.map((lawyer) => (
//           <LawyerRow key={lawyer.id} lawyerData={lawyer} />
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default LawyerTable;

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 200,
//   },
//   header: {
//     flexDirection: 'row',
//     backgroundColor: '#f5f5f5',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   headerCellId: {
//     marginLeft: 10,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 10,
//   },
//   headerCell: {
//     flex: 1,
//     marginLeft: 10,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 10,
//   },
//   headerCellEmail: {
//     flex: 1,
//     marginLeft: 100,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 10,
//   },
//   headerCellLocation: {
//     flex: 1,
//     marginLeft: 70,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 10,
//   },
//   headerCellStatus: {
//     flex: 1,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 10,
//   },
// });

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LawyerCard from './LawyerRow';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';

const LawyerTable: React.FC = () => {
  const [lawyers, setLawyers] = useState<Array<{
    id: number;
    name: string;
    email: string;
    company_name: string;
    country: string;
    is_active: boolean;
  }>>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLawyers = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await Services.getLawyerNetworkList({ limit: 6, offset: 0 });

      if (response.success) {
        setLawyers(response.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to load lawyer list',
          text2: response.error?.message || 'Invalid credentials',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: 'Please check your connection',
        position: 'top',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const onRefresh = useCallback(() => {
    fetchLawyers(true);
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000078" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {lawyers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No lawyers found</Text>
        </View>
      ) : (
        lawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyerData={lawyer} />
        ))
      )}
    </ScrollView>
  );
};

export default LawyerTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});