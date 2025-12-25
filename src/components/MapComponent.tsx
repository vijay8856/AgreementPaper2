// // components/MapComponent.tsx
// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// interface MapComponentProps {
//   countryList: any[];
// }

// const MapComponent: React.FC<MapComponentProps> = ({
//   countryList,
// }) => {
//   // Sample coordinates for demonstration
//   const sampleCoordinates = [
//     { lat: 37.7749, lng: -122.4194, title: 'USA' },
//     { lat: 51.5074, lng: -0.1278, title: 'UK' },
//     { lat: 35.6762, lng: 139.6503, title: 'Japan' },
//     { lat: 28.6139, lng: 77.2090, title: 'India' },
//     { lat: -33.8688, lng: 151.2093, title: 'Australia' },
//   ];

//   return (
//     <View style={styles.mapContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={{
//           latitude: 20,
//           longitude: 0,
//           latitudeDelta: 100,
//           longitudeDelta: 100,
//         }}
//         zoomEnabled={true}
//         scrollEnabled={true}
//       >
//         {sampleCoordinates.map((coord, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: coord.lat,
//               longitude: coord.lng,
//             }}
//             title={coord.title}
//             description={`Active suppliers in ${coord.title}`}
//           />
//         ))}
//       </MapView>
      
//       <View style={styles.countryLegend}>
//         {countryList?.slice(0, 5).map((item, index) => (
//           <View key={index} style={styles.legendItem}>
//             <View style={[styles.colorDot, { backgroundColor: getColorForPercentage(item.percentage) }]} />
//             <Text style={styles.legendText}>{item.country}: {item.percentage}%</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// const getColorForPercentage = (percentage: number) => {
//   if (percentage > 30) return '#10B981';
//   if (percentage > 15) return '#F59E0B';
//   return '#EF4444';
// };

// const styles = StyleSheet.create({
//   mapContainer: {
//     width: '100%',
//     height: 300,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 15,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   countryLegend: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     padding: 10,
//     borderRadius: 5,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   colorDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 5,
//   },
//   legendText: {
//     fontSize: 12,
//   },
// });

// export default MapComponent;