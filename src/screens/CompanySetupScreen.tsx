// // import React, { useState, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   ScrollView,
// //   TouchableWithoutFeedback,
// //   Image,
// //   Keyboard,
// //   StyleSheet,
// //   ActivityIndicator,
// // } from "react-native";
// // import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// // import Services from "../Services/services";

// // const CompanySetupScreen = () => {
// //   const placesRef = useRef(null);
// //   const [showResults, setShowResults] = useState(false);

// //   // Address fields
// //   const [geoSearch, setGeoSearch] = useState("");
// //   const [address, setAddress] = useState("");
// //   const [country, setCountry] = useState("");
// //   const [state, setState] = useState("");
// //   const [city, setCity] = useState("");
// //   const [pinCode, setPinCode] = useState("");
// //   const [currency, setCurrency] = useState("");

// //   // Dropdowns
// //   const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
// //   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

// //   // Search fields
// //   const [countryQuery, setCountryQuery] = useState("");
// //   const [stateQuery, setStateQuery] = useState("");

// //   // API data
// //   const [countryResults, setCountryResults] = useState<any[]>([]);
// //   const [stateResults, setStateResults] = useState<any[]>([]);

// //   const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
// //   const [selectedState, setSelectedState] = useState<any | null>(null);

// //   const [countrySearchLoading, setCountrySearchLoading] = useState(false);

// //   // PROFILE
// //   const [logo, setLogo] = useState(null as any);
// //   const [companyName, setCompanyName] = useState("");
// //   const [companyProfile, setCompanyProfile] = useState("");
// //   const [companyWebsite, setCompanyWebsite] = useState("");
// //   const [taxId, setTaxId] = useState("");

// //   const handleLogoUpload = () => {
// //     console.log("Upload Logo");
// //   };

// //   /** ============================
// //    * COUNTRY SEARCH (CASE-INSENSITIVE)
// //    ============================= */
// //   const handleSearchCountry = async (query: string) => {
// //     setCountryQuery(query);




// //     setCountrySearchLoading(true);
// // console.log("clean",query);

// //     try {
// //       const res = await Services.searchCountry(query);

// //       if (res.success && Array.isArray(res.data)) {
// //         const filtered = res.data

// //         setCountryResults(filtered);
// //       } else {
// //         setCountryResults([]);
// //       }
// //     } catch (err) {
// //       console.log("Country fetch error:", err);
// //       setCountryResults([]);
// //     }

// //     setCountrySearchLoading(false);
// //   };

// //   /** ============================
// //    * SELECT COUNTRY
// //    ============================= */
// //   const handleSelectCountry = (item: any) => {
// //     setSelectedCountry(item);
// //     setCountry(item.name);
// //     setCurrency(item.currency?.currency || "");

// //     setCountryDropdownOpen(false);

// //     // load states
// //     setStateResults(item.states || []);
// //     setSelectedState(null);
// //     setState("");
// //     setStateQuery("");
// //   };

// //   /** ============================
// //    * SELECT STATE
// //    ============================= */
// //   const handleSelectState = (item: any) => {
// //     setSelectedState(item.name);
// //     setState(item.name);
// //     setStateDropdownOpen(false);
// //   };

// //   const findComponent = (list: any[], type: string) => {
// //     let result: any = null;
// //     for (let i = 0; i < list.length; i++) {
// //       if (list[i].types?.includes(type)) {
// //         result = list[i];
// //         break;
// //       }
// //     }
// //     return result;
// //   };

// //   return (
// //     <TouchableWithoutFeedback
// //       onPress={() => {
// //         setCountryDropdownOpen(false);
// //         setStateDropdownOpen(false);
// //         setShowResults(false);
// //         Keyboard.dismiss();
// //       }}
// //     >
// //       <View style={{ flex: 1, backgroundColor: "#fff" }}>
// //         <ScrollView
// //           style={{ flex: 1 }}
// //           contentContainerStyle={{ padding: 16 }}
// //           showsVerticalScrollIndicator={false}
// //           onScrollBeginDrag={() => {
// //             setCountryDropdownOpen(false);
// //             setStateDropdownOpen(false);
// //             setShowResults(false);
// //           }}
// //         >
// //           {/* ADDRESS SECTION */}
// //           <Text style={styles.title}>Company Address</Text>

// //           {/* Google Autocomplete */}
// //           <GooglePlacesAutocomplete
// //             ref={placesRef}
// //             placeholder="Search for places"
// //             fetchDetails={true}
// //             minLength={2}
// //             debounce={300}
// //             enablePoweredByContainer={false}
// //             styles={{
// //               textInput: styles.autoInput,
// //               listView: {
// //                 backgroundColor: "#fff",
// //                 borderRadius: 6,
// //                 marginTop: 5,
// //                 borderWidth: showResults ? 1 : 0,
// //                 borderColor: "#ccc",
// //                 maxHeight: showResults ? 200 : 0,
// //               },
// //             }}
// //             textInputProps={{
// //               value: geoSearch,
// //               onChangeText: (text) => {
// //                 setGeoSearch(text);
// //                 setShowResults(text.length > 1);
// //               },
// //             }}
// //             onPress={(data, details = null) => {
// //               setShowResults(false);

// //               const fullAddress = data.description;
// //               setAddress(fullAddress);

// //               const comps = details.address_components || [];

// //               setCity(findComponent(comps, "locality")?.long_name || "");
// //               setState(
// //                 findComponent(comps, "administrative_area_level_1")?.long_name ||
// //                   ""
// //               );
// //               setPinCode(findComponent(comps, "postal_code")?.long_name || "");
// //               setCountry(findComponent(comps, "country")?.long_name || "");
// //             }}
// //             query={{
// //               key: "AIzaSyAkWxbuO-maU16USeyELd3UP0hPLITP3Ec",
// //               language: "en",
// //             }}
// //           />

// //           {/* MANUAL ADDRESS */}
// //           <Text style={styles.label}>Address</Text>
// //           <TextInput style={styles.input} value={address} />

// //           {/* COUNTRY */}

// //           <Text style={styles.label}>Country</Text>

// //           <TouchableOpacity
// //             style={[styles.input, styles.dropdownTrigger]}
// //             onPress={() => setCountryDropdownOpen(!countryDropdownOpen)}
// //           >
// //             <Text style={selectedCountry ? {} : styles.placeholderText}>
// //               {selectedCountry ? selectedCountry.name : "Select country"}
// //             </Text>
// //             <Text style={styles.arrow}>{countryDropdownOpen ? "▲" : "▼"}</Text>
// //           </TouchableOpacity>

// //           {countryDropdownOpen && (
// //             <View style={styles.dropdownContainer}>
// //               {/* Search Box */}
// //               <TextInput
// //                 placeholder="Search country..."
// //                 style={styles.searchInput}
// //                 value={countryQuery}
// //                 onChangeText={handleSearchCountry}
// //                 autoFocus
// //               />

// //               {/* Results */}
// //               <ScrollView style={{ maxHeight: 220 }}>
// //                 {countrySearchLoading ? (
// //                   <ActivityIndicator color="#000" />
// //                 ) : (
// //                   countryResults.map((item, index) => (
// //                     <TouchableOpacity
// //                       key={index}
// //                       onPress={() => handleSelectCountry(item)}
// //                       style={styles.dropdownItem}
// //                     >
// //                       <Text>{item.name}</Text>
// //                     </TouchableOpacity>
// //                   ))
// //                 )}
// //               </ScrollView>
// //             </View>
// //           )}

// //           {/* STATE */}
// //           {selectedCountry && (
// //             <>
// //               <Text style={styles.label}>State</Text>

// //               <TouchableOpacity
// //                 style={[styles.input, styles.dropdownTrigger]}
// //                 onPress={() => setStateDropdownOpen(!stateDropdownOpen)}
// //               >
// //                 <Text style={selectedState ? {} : styles.placeholderText}>
// //                   {selectedState || "Select state"}
// //                 </Text>
// //                 <Text style={styles.arrow}>
// //                   {stateDropdownOpen ? "▲" : "▼"}
// //                 </Text>
// //               </TouchableOpacity>

// //               {stateDropdownOpen && (
// //                 <View style={styles.dropdownContainer}>
// //                   <TextInput
// //                     placeholder="Search state..."
// //                     style={styles.searchInput}
// //                     value={stateQuery}
// //                     onChangeText={(txt) => setStateQuery(txt)}
// //                     autoFocus
// //                   />

// //                   <ScrollView style={{ maxHeight: 220 }}>
// //                     {stateResults
// //                       .filter((s) =>
// //                         s.name
// //                           .toLowerCase()
// //                           .includes(stateQuery.toLowerCase())
// //                       )
// //                       .map((item, index) => (
// //                         <TouchableOpacity
// //                           key={index}
// //                           onPress={() => handleSelectState(item)}
// //                           style={styles.dropdownItem}
// //                         >
// //                           <Text>{item.name}</Text>
// //                         </TouchableOpacity>
// //                       ))}
// //                   </ScrollView>
// //                 </View>
// //               )}
// //             </>
// //           )}

// //           {/* CITY */}
// //           <Text style={styles.label}>City</Text>
// //           <TextInput style={styles.input} value={city} />

// //           {/* PIN CODE */}
// //           <Text style={styles.label}>Zip / Pin Code</Text>
// //           <TextInput style={styles.input} value={pinCode} />

// //           {/* CURRENCY */}
// //           <Text style={styles.label}>Currency</Text>
// //           <TextInput style={styles.input} editable={false} value={currency} />

// //           {/* COMPANY PROFILE SECTION */}
// //           <Text style={[styles.title, { marginTop: 35 }]}>
// //             Company Profile
// //           </Text>

// //           <View style={{ alignItems: "center" }}>
// //             <View style={styles.logoCircle}>
// //               {logo ? (
// //                 <Image source={{ uri: logo }} style={styles.logoImage} />
// //               ) : (
// //                 <Text>No Logo</Text>
// //               )}
// //             </View>

// //             <TouchableOpacity style={styles.uploadButton}>
// //               <Text style={{ color: "#fff" }}>Upload Logo</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <Text style={styles.label}>Company Name</Text>
// //           <TextInput style={styles.input} value={companyName} />

// //           <Text style={styles.label}>Company Profile</Text>
// //           <TextInput
// //             style={[styles.input, { height: 100 }]}
// //             multiline
// //             value={companyProfile}
// //           />

// //           <Text style={styles.rightText}>{companyProfile.length}/500</Text>

// //           <Text style={styles.label}>Website</Text>
// //           <TextInput style={styles.input} value={companyWebsite} />

// //           <Text style={styles.label}>Tax ID</Text>
// //           <TextInput style={styles.input} value={taxId} />

// //           <TouchableOpacity style={styles.continueBtn}>
// //             <Text style={styles.continueText}>Continue</Text>
// //           </TouchableOpacity>
// //         </ScrollView>
// //       </View>
// //     </TouchableWithoutFeedback>
// //   );
// // };

// // export default CompanySetupScreen;

// // /** ============================
// //  * STYLES
// //  ============================= */
// // const styles = StyleSheet.create({
// //   title: { fontSize: 22, fontWeight: "700", marginVertical: 10 },
// //   label: { fontSize: 15, fontWeight: "600", marginTop: 15 },

// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 8,
// //     padding: 12,
// //     fontSize: 15,
// //     marginTop: 5,
// //   },

// //   dropdownTrigger: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },

// //   placeholderText: { color: "#999" },
// //   arrow: { fontSize: 14, color: "#333" },

// //   dropdownContainer: {
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     backgroundColor: "#fff",
// //     borderRadius: 8,
// //     padding: 10,
// //     marginTop: 5,
// //   },

// //   searchInput: {
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //     padding: 10,
// //     borderRadius: 6,
// //     marginBottom: 10,
// //   },

// //   dropdownItem: {
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#eee",
// //   },

// //   dropdownText: { fontSize: 15 },

// //   autoInput: {
// //     height: 50,
// //     borderColor: "#ccc",
// //     borderWidth: 1,
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     fontSize: 15,
// //   },

// //   logoCircle: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     borderWidth: 2,
// //     borderColor: "#ccc",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: 10,
// //   },

// //   logoImage: { width: "100%", height: "100%", borderRadius: 60 },

// //   uploadButton: {
// //     backgroundColor: "#2A55E5",
// //     padding: 10,
// //     marginTop: 10,
// //     borderRadius: 8,
// //   },

// //   rightText: { textAlign: "right", color: "gray", marginTop: 5 },

// //   continueBtn: {
// //     backgroundColor: "#2A55E5",
// //     padding: 15,
// //     marginVertical: 30,
// //     borderRadius: 8,
// //   },

// //   continueText: {
// //     color: "#fff",
// //     fontSize: 17,
// //     fontWeight: "700",
// //     textAlign: "center",
// //   },
// // });



// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Image,
//   Keyboard,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import Services from "../Services/services";
// import { DeviceEventEmitter } from "react-native";
// const CompanySetupScreen = () => {
//   const placesRef = useRef(null);

//   /* -------------------------------
//         MAIN INPUT STATES
//     ------------------------------- */
//   const [geoSearch, setGeoSearch] = useState("");
//   const [address, setAddress] = useState("");
//   const [country, setCountry] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [city, setCity] = useState("");
//   const [pinCode, setPinCode] = useState("");
//   const [currency, setCurrency] = useState("");

//   /* -------------------------------
//         PROFILE FIELDS
//     ------------------------------- */
//   const [logo, setLogo] = useState(null);
//   const [companyName, setCompanyName] = useState("");
//   const [companyProfile, setCompanyProfile] = useState("");
//   const [companyWebsite, setCompanyWebsite] = useState("");
//   const [taxId, setTaxId] = useState("");

//   /* -------------------------------
//         COUNTRY / STATE DROPDOWN
//     ------------------------------- */
//   const [countryList, setCountryList] = useState<any[]>([]);
//   const [stateList, setStateList] = useState<any[]>([]);
//   const [filteredCountryList, setFilteredCountryList] = useState<any[]>([]);
//   const [filteredStateList, setFilteredStateList] = useState<any[]>([]);

//   const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
//   const [selectedState, setSelectedState] = useState<any | null>(null);

//   const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
//   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

//   const [countryQuery, setCountryQuery] = useState("");
//   const [stateQuery, setStateQuery] = useState("");

//   const [loadingCountry, setLoadingCountry] = useState(false);
//   const [showResults, setShowResults] = useState(false);

//   /* -------------------------------
//         HELPERS
//     ------------------------------- */
//   const findComponent = (list: any[], type: string) =>
//     list.find((c) => c.types?.includes(type)) || null;

//   const matchInitialCountryState = (countries: any[], profile: any) => {
//     if (!profile) return;

//     const countryMatch = countries.find(
//       (c) => c.name.toLowerCase() === profile.country_name.toLowerCase()
//     );

//     if (countryMatch) {
//       setSelectedCountry(countryMatch);
//       setCountry(countryMatch.name);
//       setCurrency(countryMatch.currency?.currency || "");

//       const states = countryMatch.states || [];
//       setStateList(states);
//       setFilteredStateList(states);

//       const stateMatch = states.find(
//         (s) => s.name.toLowerCase() === profile.state_name.toLowerCase()
//       );

//       if (stateMatch) {
//         setSelectedState(stateMatch);
//         setStateName(stateMatch.name);
//       }
//     }
//   };

//   /* -------------------------------
//         INITIAL LOAD
//     ------------------------------- */
//   // useEffect(() => {
//   //   const loadInitial = async () => {
//   //     const stored = await AsyncStorage.getItem("userData");
//   //     if (!stored) return;

//   //     const user = JSON.parse(stored);
//   //     const profile = user.profile;

//   //     setAddress(profile.address);
//   //     setGeoSearch(profile.address);
//   //     setCity(profile.district);
//   //     setPinCode(String(profile.pin_code));
//   //     setCompanyName(profile.company_name);
//   //     setCompanyProfile(profile.about_company);
//   //     setCompanyWebsite(profile.company_website);
//   //     setTaxId(profile.tax_number);
//   //     setCurrency(profile.currency_detail?.currency || "");

//   //     setLogo(
//   //       profile.logo ? `http://api.agreementpaper.com${profile.logo}` : null
//   //     );

//   //     setLoadingCountry(true);
//   //     const res = await Services.searchCountry(""); // backend returns all countries
//   //     setLoadingCountry(false);

//   //     if (res.success && Array.isArray(res.data)) {
//   //       setCountryList(res.data);
//   //       setFilteredCountryList(res.data);

//   //       matchInitialCountryState(res.data, profile);
//   //     }
//   //   };

//   //   loadInitial();
//   // }, []);

//   const loadInitial = async () => {
//     try {
//       // 1️⃣ Fresh profile from API (not async storage)
//       const resProfile = await Services.getUserProfileDetails();
// console.log("resprofile",resProfile);

//       if (resProfile?.success) {
//         const profile = resProfile.data.profile;
// await AsyncStorage.multiSet([
//   ["company", profile.company_name?.toString() || ""],
// ]);
// DeviceEventEmitter.emit("COMPANY_UPDATED", profile.company_name);
//         // Prefill form
//         setAddress(profile.address);
//         setGeoSearch(profile.address);
//         setCity(profile.district);
//         setPinCode(String(profile.pin_code));
//         setCompanyName(profile.company_name);
//         setCompanyProfile(profile.about_company);
//         setCompanyWebsite(profile.company_website);
//         setTaxId(profile.tax_number);
//         setCurrency(profile.currency_detail?.currency || "");

//         setLogo(
//           profile.logo
//             ? `http://api.agreementpaper.com${profile.logo}`
//             : null
//         );

//         // 2️⃣ Load country list (works for search + initial)
//         setLoadingCountry(true);
//         const resCountry = await Services.searchCountry("");
//         setLoadingCountry(false);

//         if (resCountry?.success && Array.isArray(resCountry.data)) {
//           setCountryList(resCountry.data);
//           setFilteredCountryList(resCountry.data);

//           matchInitialCountryState(resCountry.data, profile);
//         }
//       }
//     } catch (error) {
//       console.log("Initial Load Error:", error);
//     }
//   };
// useEffect(() => {
//   loadInitial();
// }, []);


//   /* -------------------------------
//         SEARCH COUNTRY
//     ------------------------------- */
//   const handleSearchCountry = (txt: string) => {
//     setCountryQuery(txt);

//     const q = txt.toLowerCase();
//     const filtered = countryList.filter((c) =>
//       c.name.toLowerCase().includes(q)
//     );
//     setFilteredCountryList(filtered);
//   };

//   /* -------------------------------
//         SELECT COUNTRY
//     ------------------------------- */
//   const handleSelectCountry = (item: any) => {
//     setSelectedCountry(item);
//     setCountry(item.name);
//     setCurrency(item.currency?.currency || "");
//     setCountryDropdownOpen(false);

//     setStateList(item.states || []);
//     setFilteredStateList(item.states || []);
//     setSelectedState(null);
//     setStateName("");
//     setStateQuery("");
//   };

//   /* -------------------------------
//         SELECT STATE
//     ------------------------------- */
//   const handleSearchState = (txt: string) => {
//     setStateQuery(txt);

//     const q = txt.toLowerCase();
//     const filtered = stateList.filter((s) =>
//       s.name.toLowerCase().includes(q)
//     );
//     setFilteredStateList(filtered);
//   };

//   const handleSelectState = (item: any) => {
//     setSelectedState(item);
//     setStateName(item.name);
//     setStateDropdownOpen(false);
//   };

//   /* -------------------------------
//         UPDATE PROFILE
//     ------------------------------- */
//   // const handleUpdateProfile = async () => {
//   //   try {
//   //     const stored = await AsyncStorage.getItem("userData");
//   //     const profile = JSON.parse(stored).profile;

//   //     const payload = new FormData();

//   //     payload.append("address", address);
//   //     payload.append("district", city);
//   //     payload.append("pin_code", String(pinCode));

//   //     payload.append("country", selectedCountry?.name || profile.country_name);
//   //     payload.append("state", selectedState?.name || profile.state_name);
//   //     payload.append(
//   //       "currency",
//   //       String(selectedCountry?.currency?.id || profile.currency_detail?.id)
//   //     );

//   //     payload.append("company_name", companyName);
//   //     payload.append("about_company", companyProfile);
//   //     payload.append("company_website", companyWebsite);
//   //     payload.append("tax_number", taxId);

//   //     if (logo && typeof logo === "object") {
//   //       payload.append("logo", {
//   //         uri: logo.uri,
//   //         name: logo.fileName || "company_logo.jpg",
//   //         type: logo.type || "image/jpeg",
//   //       });
//   //     }

//   //     console.log("📤 Final Payload:", payload);

//   //     const res = await Services.updateOrganizationProfile(payload);

//   //     console.log("📥 Server Response:", res);

//   //     if (res.success) {
//   //       Alert.alert("Success", "Profile Updated!");
//   //     } else {
//   //       Alert.alert("Failed", res.error || "Could not update profile");
//   //     }
//   //   } catch (error) {
//   //     console.log("Update Error:", error);
//   //     Alert.alert("Error", "Something went wrong!");
//   //   }
//   // };



// const handleUpdateProfile = async () => {
//   try {
//     const stored = await AsyncStorage.getItem("userData");
//     const profile = JSON.parse(stored).profile;
//     console.log("profiles",profile);
//     const user_type = await AsyncStorage.getItem("userType");


//     const payload = {
//       address,
//       district: city,
//       pin_code: String(pinCode),
//       country: selectedCountry?.name || profile.country_name,
//       state: selectedState?.name || profile.state_name,
//       currency: String(
//         selectedCountry?.currency?.id || profile.currency_detail?.id
//       ),
//       company_name: companyName,
//       about_company: companyProfile,
//       company_website: companyWebsite,
//       tax_number: taxId,
//     };

//     if (logo?.uri) {
//       payload.logo = {
//         uri: logo.uri,
//         name: logo.fileName || "company_logo.jpg",
//         type: logo.type || "image/jpeg",
//       };
//     }

//     console.log("📤 Sending payload:", payload);

//     let res;

//     if (user_type === "ORGANISATION_USER") {
//       res = await Services.updateOrganizationProfile(payload);
//       console.log("📤 updateOrganizationProfile res:", res);
//     } else if (user_type === "AGENCY_USER") {
//       res = await Services.updateAgencyProfile(payload);
//       console.log("📤 updateAgencyProfile res:", res);
//     }

//     if (res.success) {
//       Alert.alert(
//     "Success",
//     "Profile Updated!",
//     [
//       {
//         text: "OK",
//       onPress: async () => {
//         await loadInitial();   // 🔥 refresh instantly from backend
//       }
//       }
//     ]
//   );

//     } else {
//       Alert.alert("Failed", res.error || "Could not update profile");
//     }

//   } catch (error) {
//     console.log("Update Error:", error);
//     Alert.alert("Error", "Something went wrong!");
//   }
// };


//   /* -------------------------------
//         UI
//     ------------------------------- */
//   return (
//     <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//       <View style={{ flex: 1, backgroundColor: "#fff" }}>
//         <ScrollView contentContainerStyle={{ padding: 16 }}>
//           <Text style={styles.title}>Company Address</Text>

//           {/* GOOGLE AUTOCOMPLETE */}
//           <GooglePlacesAutocomplete
//             ref={placesRef}
//             placeholder="Search location"
//             fetchDetails
//             enablePoweredByContainer={false}
//             minLength={2}
//             debounce={300}
//             styles={{
//               textInput: styles.autoInput,
//               listView: {
//                 maxHeight: showResults ? 180 : 0,
//                 borderWidth: showResults ? 1 : 0,
//                 borderColor: "#ccc",
//                 marginTop: 5,
//               },
//             }}
//             textInputProps={{
//               value: geoSearch,
//               onChangeText: (txt) => {
//                 setGeoSearch(txt);
//                 setShowResults(txt.length > 1);
//               },
//             }}
//             onPress={(data, details = null) => {
//               setShowResults(false);

//               const comps = details.address_components;

//               const c = findComponent(comps, "country");
//               const s = findComponent(comps, "administrative_area_level_1");
//               const ci = findComponent(comps, "locality");
//               const pc = findComponent(comps, "postal_code");

//               setAddress(data.description);
//               setCity(ci?.long_name || "");
//               setStateName(s?.long_name || "");
//               setPinCode(pc?.long_name || "");
//               setCountry(c?.long_name || "");

//               // auto match google country to dropdown country
//               const match = countryList.find(
//                 (x) =>
//                   x.name.toLowerCase() === c?.long_name?.toLowerCase()
//               );

//               if (match) handleSelectCountry(match);
//             }}
//             query={{
//               key: "YOUR_GOOGLE_KEY",
//               language: "en",
//             }}
//           />

//           {/* ADDRESS */}
//           <Text style={styles.label}>Address</Text>
//           <TextInput
//             style={styles.input}
//             value={address}
//             onChangeText={setAddress}
//           />

//           {/* COUNTRY */}
//           <Text style={styles.label}>Country</Text>

//           <TouchableOpacity
//             style={[styles.input, styles.trigger]}
//             onPress={() => setCountryDropdownOpen(!countryDropdownOpen)}
//           >
//             <Text style={!selectedCountry && styles.placeholder}>
//               {selectedCountry ? selectedCountry.name : "Select country"}
//             </Text>
//             <Text>{countryDropdownOpen ? "▲" : "▼"}</Text>
//           </TouchableOpacity>

//           {countryDropdownOpen && (
//             <View style={styles.dropdown}>
//               <TextInput
//                 placeholder="Search..."
//                 style={styles.searchBox}
//                 value={countryQuery}
//                 onChangeText={handleSearchCountry}
//               />

//               <ScrollView style={{ maxHeight: 220 }}>
//                 {loadingCountry ? (
//                   <ActivityIndicator />
//                 ) : (
//                   filteredCountryList.map((item, i) => (
//                     <TouchableOpacity
//                       key={i}
//                       style={styles.item}
//                       onPress={() => handleSelectCountry(item)}
//                     >
//                       <Text>{item.name}</Text>
//                     </TouchableOpacity>
//                   ))
//                 )}
//               </ScrollView>
//             </View>
//           )}

//           {/* STATE */}
//           {selectedCountry && (
//             <>
//               <Text style={styles.label}>State</Text>

//               <TouchableOpacity
//                 style={[styles.input, styles.trigger]}
//                 onPress={() => setStateDropdownOpen(!stateDropdownOpen)}
//               >
//                 <Text style={!selectedState && styles.placeholder}>
//                   {selectedState ? selectedState.name : "Select state"}
//                 </Text>
//                 <Text>{stateDropdownOpen ? "▲" : "▼"}</Text>
//               </TouchableOpacity>

//               {stateDropdownOpen && (
//                 <View style={styles.dropdown}>
//                   <TextInput
//                     placeholder="Search..."
//                     style={styles.searchBox}
//                     value={stateQuery}
//                     onChangeText={handleSearchState}
//                   />

//                   <ScrollView style={{ maxHeight: 220 }}>
//                     {filteredStateList.map((item, i) => (
//                       <TouchableOpacity
//                         key={i}
//                         style={styles.item}
//                         onPress={() => handleSelectState(item)}
//                       >
//                         <Text>{item.name}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                 </View>
//               )}
//             </>
//           )}

//           {/* CITY */}
//           <Text style={styles.label}>City</Text>
//           <TextInput
//             value={city}
//             onChangeText={setCity}
//             style={styles.input}
//           />

//           {/* PINCODE */}
//           <Text style={styles.label}>Pin Code</Text>
//           <TextInput
//             value={pinCode}
//             onChangeText={setPinCode}
//             style={styles.input}
//           />

//           {/* CURRENCY */}
//           <Text style={styles.label}>Currency</Text>
//           <TextInput value={currency} editable={false} style={styles.input} />

//           {/* PROFILE SECTION */}
//           <Text style={[styles.title, { marginTop: 30 }]}>
//             Company Profile
//           </Text>

//           <Text style={styles.label}>Company Name</Text>
//           <TextInput
//             value={companyName}
//             onChangeText={setCompanyName}
//             style={styles.input}
//           />

//           <Text style={styles.label}>About Company</Text>
//           <TextInput
//             value={companyProfile}
//             onChangeText={setCompanyProfile}
//             style={[styles.input, { height: 100 }]}
//             multiline
//           />

//           <Text style={styles.label}>Website</Text>
//           <TextInput
//             value={companyWebsite}
//             onChangeText={setCompanyWebsite}
//             style={styles.input}
//           />

//           <Text style={styles.label}>Tax ID</Text>
//           <TextInput
//             value={taxId}
//             onChangeText={setTaxId}
//             style={styles.input}
//           />

//           <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
//             <Text style={styles.saveText}>Save</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default CompanySetupScreen;

// /* -------------------------------
//         STYLES
// ------------------------------- */
// const styles = StyleSheet.create({
//   title: { fontSize: 22, fontWeight: "700", marginVertical: 10 },
//   label: { fontSize: 15, fontWeight: "600", marginTop: 15 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
//     marginTop: 5,
//   },
//   autoInput: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 15,
//   },
//   trigger: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   placeholder: { color: "#999" },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 5,
//   },
//   searchBox: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 10,
//     borderRadius: 6,
//     marginBottom: 10,
//   },
//   item: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   saveBtn: {
//     backgroundColor: "#2A55E5",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 25,
//     marginBottom: 40,
//   },
//   saveText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//   },
// });


// CompanySetupScreen.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ImagePicker from "react-native-image-crop-picker";
import Services from "../Services/services";
import { DeviceEventEmitter } from "react-native";

const CompanySetupScreen = () => {
  const placesRef = useRef(null);

  /* -------------------------------
        ALL INPUT STATES
  ------------------------------- */
  const [geoSearch, setGeoSearch] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [currency, setCurrency] = useState("");

  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [taxId, setTaxId] = useState("");

  /* -------------------------------
        COUNTRY / STATE DROPDOWN
  ------------------------------- */
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [filteredCountryList, setFilteredCountryList] = useState([]);
  const [filteredStateList, setFilteredStateList] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  const [countryQuery, setCountryQuery] = useState("");
  const [stateQuery, setStateQuery] = useState("");

  const [loadingCountry, setLoadingCountry] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const findComponent = (list, type) =>
    list.find((c) => c.types?.includes(type)) || null;


  /* -------------------------------
        LOAD PROFILE + COUNTRY LIST
  ------------------------------- */
  const loadInitial = async () => {
    try {
      const resProfile = await Services.getUserProfileDetails();
      console.log("logogog", resProfile);

      if (resProfile?.success) {
        const profile = resProfile.data.profile;

        // Fill inputs
        setAddress(profile.address);
        setGeoSearch(profile.address);
        setCity(profile.district);
        setPinCode(String(profile.pin_code));
        setCompanyName(profile.company_name);
        setCompanyProfile(profile.about_company);
        setCompanyWebsite(profile.company_website);
        setTaxId(profile.tax_number);
        setCurrency(profile.currency_detail?.currency || "");

        setLogo(`http://api.agreementpaper.com${profile.logo}`);


        // SAVE COMPANY NAME GLOBALLY
        await AsyncStorage.setItem("company", profile.company_name || "");
        DeviceEventEmitter.emit("COMPANY_UPDATED", profile.company_name);

        setLoadingCountry(true);
        const resCountry = await Services.searchCountry("");
        setLoadingCountry(false);

        if (resCountry?.success) {
          setCountryList(resCountry.data);
          setFilteredCountryList(resCountry.data);

          // Match initial dropdown values
          const cMatch = resCountry.data.find(
            (c) =>
              c.name.toLowerCase() === profile.country_name?.toLowerCase()
          );

          if (cMatch) {
            setSelectedCountry(cMatch);
            setCountry(cMatch.name);
            setCurrency(cMatch.currency?.currency || "");
            setStateList(cMatch.states);
            setFilteredStateList(cMatch.states);

            const sMatch = cMatch.states?.find(
              (s) =>
                s.name.toLowerCase() === profile.state_name?.toLowerCase()
            );

            if (sMatch) {
              setSelectedState(sMatch);
              setStateName(sMatch.name);
            }
          }
        }
      }
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  /* -------------------------------
        COUNTRY SEARCH
  ------------------------------- */
  const handleSearchCountry = (txt) => {
    setCountryQuery(txt);
    const q = txt.toLowerCase();
    setFilteredCountryList(
      countryList.filter((c) => c.name.toLowerCase().includes(q))
    );
  };

  const handleSelectCountry = (item) => {
    setSelectedCountry(item);
    setCountry(item.name);
    setCurrency(item.currency?.currency || "");
    setCountryDropdownOpen(false);

    setStateList(item.states);
    setFilteredStateList(item.states);

    setSelectedState(null);
    setStateName("");
  };

  /* -------------------------------
        STATE SEARCH
  ------------------------------- */
  const handleSearchState = (txt) => {
    setStateQuery(txt);
    const q = txt.toLowerCase();
    setFilteredStateList(
      stateList.filter((s) => s.name.toLowerCase().includes(q))
    );
  };

  const handleSelectState = (item) => {
    setSelectedState(item);
    setStateName(item.name);
    setStateDropdownOpen(false);
  };

  /* -------------------------------
        IMAGE PICKER
  ------------------------------- */
  const pickLogo = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then((img) => {
        setLogo({
          uri: img.path,
          type: img.mime,
          fileName: `logo_${Date.now()}.jpg`,
        });

      })
      .catch(() => { });
  };

  /* -------------------------------
        UPDATE PROFILE
  ------------------------------- */
  const handleUpdateProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      const profile = JSON.parse(stored).profile;
      const userType = await AsyncStorage.getItem("userType");

      const payload = new FormData();

      payload.append("address", address);
      payload.append("district", city);
      payload.append("pin_code", pinCode);
      payload.append(
        "country",
        selectedCountry?.name || profile.country_name
      );
      payload.append(
        "state",
        selectedState?.name || profile.state_name
      );
      payload.append(
        "currency",
        selectedCountry?.currency?.id ||
        profile.currency_detail?.id
      );

      payload.append("company_name", companyName);
      payload.append("about_company", companyProfile);
      payload.append("company_website", companyWebsite);
      payload.append("tax_number", taxId);

      if (logo?.uri) {
        payload.append("logo", {
          uri: logo.uri,
          name: logo.fileName,
          type: logo.type,
        });
      }

      let res;
      if (userType === "ORGANISATION_USER") {
        res = await Services.updateOrganizationProfile(payload);
      } else {
        res = await Services.updateAgencyProfile(payload);
      }

      if (res.success) {
        Alert.alert("Success", "Profile Updated!", [
          {
            text: "OK",
            onPress: () => loadInitial(),
          },
        ]);
      } else {
        Alert.alert("Failed", res.error || "Update failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  /* -------------------------------
        UI
  ------------------------------- */
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Company Logo</Text>

          {/* Upload Logo */}
          <TouchableOpacity onPress={pickLogo} style={styles.logoBox}>
            {logo ? (
              <Image
                source={{
                  uri: typeof logo === "string" ? logo : logo.uri
                }}
                style={styles.logoImg}
              />
            ) : (
              <Text style={{ color: "#777" }}>Tap to upload logo</Text>
            )}
          </TouchableOpacity>



          <Text style={styles.title}>Company Address</Text>

          {/* GOOGLE PICKER */}
          <GooglePlacesAutocomplete
            ref={placesRef}
            placeholder="Search location"
            fetchDetails
            enablePoweredByContainer={false}
            minLength={2}
            debounce={300}
            styles={{
              textInput: styles.autoInput,
            }}
            textInputProps={{
              value: geoSearch,
              onChangeText: setGeoSearch,
            }}
            onPress={(data, details) => {
              const comps = details.address_components;

              const c = findComponent(comps, "country");
              const s = findComponent(comps, "administrative_area_level_1");
              const ci = findComponent(comps, "locality");
              const pc = findComponent(comps, "postal_code");

              setAddress(data.description);
              setCity(ci?.long_name || "");
              setStateName(s?.long_name || "");
              setPinCode(pc?.long_name || "");
            }}
            query={{
              key: "YOUR_GOOGLE_KEY",
              language: "en",
            }}
          />

          {/* ADDRESS */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />

          {/* COUNTRY */}
          <Text style={styles.label}>Country</Text>
          <TouchableOpacity
            style={[styles.input, styles.trigger]}
            onPress={() => setCountryDropdownOpen(!countryDropdownOpen)}
          >
            <Text>{selectedCountry?.name || "Select Country"}</Text>
            <Text>{countryDropdownOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {countryDropdownOpen && (
            <View style={styles.dropdown}>
              <TextInput
                placeholder="Search..."
                style={styles.searchBox}
                value={countryQuery}
                onChangeText={handleSearchCountry}
              />
              <ScrollView style={{ maxHeight: 220 }}>
                {filteredCountryList.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.item}
                    onPress={() => handleSelectCountry(item)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* STATE */}
          {selectedCountry && (
            <>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity
                style={[styles.input, styles.trigger]}
                onPress={() => setStateDropdownOpen(!stateDropdownOpen)}
              >
                <Text>{selectedState?.name || "Select State"}</Text>
                <Text>{stateDropdownOpen ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {stateDropdownOpen && (
                <View style={styles.dropdown}>
                  <TextInput
                    placeholder="Search..."
                    style={styles.searchBox}
                    value={stateQuery}
                    onChangeText={handleSearchState}
                  />

                  <ScrollView style={{ maxHeight: 220 }}>
                    {filteredStateList.map((item) => (
                      <TouchableOpacity
                        key={item.name}
                        style={styles.item}
                        onPress={() => handleSelectState(item)}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* OTHER FIELDS */}
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />

          <Text style={styles.label}>Pin Code</Text>
          <TextInput
            style={styles.input}
            value={pinCode}
            onChangeText={setPinCode}
          />

          <Text style={styles.label}>Currency</Text>
          <TextInput style={styles.input} editable={false} value={currency} />

          <Text style={styles.sectionTitle}>Company Profile</Text>

          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
          />

          <Text style={styles.label}>About Company</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            value={companyProfile}
            onChangeText={setCompanyProfile}
          />

          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={companyWebsite}
            onChangeText={setCompanyWebsite}
          />

          <Text style={styles.label}>Tax ID</Text>
          <TextInput
            style={styles.input}
            value={taxId}
            onChangeText={setTaxId}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CompanySetupScreen;

/* -------------------------------
        STYLES
------------------------------- */
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
  },
  title: { fontSize: 22, fontWeight: "700", marginTop: 20 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginTop: 5,
  },
  autoInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginTop: 8,
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  logoImg: { width: "100%", height: "100%", borderRadius: 12 },
  saveBtn: {
    backgroundColor: "#2A55E5",
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
