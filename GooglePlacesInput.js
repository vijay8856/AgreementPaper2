// import React from 'react';
// import { View, Image } from 'react-native';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import GOOGLE_API_KEY from '././src/utils/validations'
// const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
// const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

// const GooglePlacesInput = () => {
//   return (
//     <GooglePlacesAutocomplete
//       placeholder='Search'
//       minLength={2} // minimum length of text to search

//       returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
//       listViewDisplayed='auto'    // true/false/undefined
//       fetchDetails={true}
//       renderDescription={row => row.description} // custom description render
//       onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
//         console.log(data, details);
//       }}
      
//       getDefaultValue={() => ''}
      
//       query={{
//         // available options: https://developers.google.com/places/web-service/autocomplete
//         key:GOOGLE_API_KEY,
//         language: 'en', // language of the results
//         types: '(cities)' // default: 'geocode'
//       }}
      
//       styles={{
//         textInputContainer: {
//           width: '100%'
//         },
//         description: {
//           fontWeight: 'bold'
//         },
//         predefinedPlacesDescription: {
//           color: '#1faadb'
//         }
//       }}
      
//       currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
//       currentLocationLabel="Current location"
//       nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
//       GoogleReverseGeocodingQuery={{
//         // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
//       }}
//       GooglePlacesSearchQuery={{
//         // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
//         rankby: 'distance',
//         types: 'food'
//       }}

//       filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
//       predefinedPlaces={[homePlace, workPlace]}

//       debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
//       renderLeftButton={()  => <Image source={require('./src/assets/images/user.png')} />}
//       renderRightButton={() => <Text>Custom text after the input</Text>}
//     />
//   );
// }

// export default GooglePlacesInput;


// GooglePlacesInput.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from '@env';

const GOOGLE_API_KEY = GOOGLE_API_KEY;

const GooglePlacesInput = () => {
  const query = {
    key: GOOGLE_API_KEY,
    language: "en",
  };

  console.log("Query:", query);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log("DATA:", data);
          console.log("DETAILS:", details);
        }}
        query={query}   
        styles={{
          textInput: styles.textInput,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textInput: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
});

export default GooglePlacesInput;

