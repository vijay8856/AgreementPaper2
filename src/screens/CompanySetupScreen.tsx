// @ts-nocheck

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
import Icon from 'react-native-vector-icons/Ionicons';
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
console.log("logo",logo);

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

        setLogo(profile?.logo);


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
        } );
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
      
      <View style={styles.companyProfileContainer}>
        <ScrollView>
          <Text style={styles.sectionTitle}>Company Logo</Text>

          {/* Upload Logo */}
      <TouchableOpacity onPress={pickLogo} style={styles.logoBox}>
  {logo ? (
    <Image
      source={{
        uri: typeof logo === 'string' ? logo : logo.uri,
      }}
      style={styles.logoImg}
    />
  ) : (
    <View style={styles.placeholder}>
      <Icon name="camera" size={16} color="#353333ff" />
      <Text style={styles.placeholderText}>Upload Logo</Text>
    </View>
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
                    {filteredStateList.map((item:any) => (
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
    marginVertical: 12,
fontWeight: "700",
  },
  companyProfileContainer: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3,
    elevation: 1,
  },
  title: { fontSize: 15, fontWeight: "700", marginTop: 20 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#a3a3a3ff",
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
    borderColor: "#adadadff",
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
  placeholder: {
    width:48,
    height:30,
  alignItems: 'center',
  justifyContent: 'center',
},

placeholderText: {
  marginTop: 6,
  color: '#090909ff',
  fontSize: 14,
},

});
