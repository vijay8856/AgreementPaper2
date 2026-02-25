// @ts-nocheck


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import Toast from 'react-native-toast-message';
// import Services from '../../../Services/services';

// /* ======================
//  INITIAL DATA
// ====================== */

// const initialData = {
//   material_number: '',
//   description: '',
//   location: null,
//   unit_of_measure: '',
//   old_material_number: '',
//   material_group: null,
//   ext_material_group: '',
//   gross_weight: '',
//   net_weight: '',
//   weight_unit: '',
//   volume: '',
//   volume_unit: '',
//   dimensions: '',
//   ean: '',
//   ean_category: '',
//   order_unit: '',
//   underdel_tolerance: '',
//   overdel_tolerance: '',
//   min_del_qty: '',
// };


// const baseUnitOptions = [
//   { value: "EA", label: "Each (EA)" },
//   { value: "PC", label: "Piece (PC)" },
//   { value: "DZ", label: "Dozen (DZ)" },
//   { value: "PK", label: "Pack (PK)" },
//   { value: "SET", label: "Set (SET)" },
//   { value: "LOT", label: "Lot (LOT)" },
//   { value: "BAG", label: "Bag (BAG)" },
//   { value: "BOX", label: "Box (BOX)" },
//   { value: "ROL", label: "Roll (ROL)" },
//   { value: "PAL", label: "Pallet (PAL)" },
//   { value: "KG", label: "Kilogram (KG)" },
//   { value: "G", label: "Gram (G)" },
//   { value: "MG", label: "Milligram (MG)" },
//   { value: "TON", label: "Metric Ton (TON)" },
//   { value: "LB", label: "Pound (LB)" },
//   { value: "OZ", label: "Ounce (OZ)" },
//   { value: "CWT", label: "Hundredweight (CWT)" },
//   { value: "T", label: "Long Ton (T)" },
//   { value: "M", label: "Meter (M)" },
//   { value: "CM", label: "Centimeter (CM)" },
//   { value: "MM", label: "Millimeter (MM)" },
//   { value: "IN", label: "Inch (IN)" },
//   { value: "FT", label: "Foot (FT)" },
//   { value: "YD", label: "Yard (YD)" },
//   { value: "KM", label: "Kilometer (KM)" },
//   { value: "MI", label: "Mile (MI)" },
//   { value: "L", label: "Liter (L)" },
//   { value: "ML", label: "Milliliter (ML)" },
//   { value: "M3", label: "Cubic Meter (M3)" },
//   { value: "CC", label: "Cubic Centimeter (CC)" },
//   { value: "GAL", label: "Gallon (GAL)" },
//   { value: "QT", label: "Quart (QT)" },
//   { value: "PT", label: "Pint (PT)" },
//   { value: "FL OZ", label: "Fluid Ounce (FL OZ)" },
//   { value: "KWH", label: "Kilowatt Hour (KWH)" },
//   { value: "J", label: "Joule (J)" },
//   { value: "BTU", label: "British Thermal Unit (BTU)" },
//   { value: "CAL", label: "Calorie (CAL)" },
//   { value: "HR", label: "Hour (HR)" },
//   { value: "MIN", label: "Minute (MIN)" },
//   { value: "SEC", label: "Second (SEC)" },
//   { value: "DAY", label: "Day (DAY)" },
//   { value: "WK", label: "Week (WK)" },
//   { value: "MO", label: "Month (MO)" },
//   { value: "YR", label: "Year (YR)" },
//   { value: "PR", label: "Pair (PR)" },
//   { value: "BATCH", label: "Batch (BATCH)" },
//   { value: "SHT", label: "Sheet (SHT)" },
//   { value: "CAN", label: "Can (CAN)" },
//   { value: "TUB", label: "Tub (TUB)" },
// ];

// const weightUnits = [
//   { label: "Carat (ct)", value: "ct" },
//   { label: "Gram (g)", value: "g" },
//   { label: "Kilogram (kg)", value: "kg" },
//   { label: "Milligram (mg)", value: "mg" },
//   { label: "Metric Ton (t)", value: "t" },
//   { label: "Pound (lb)", value: "lb" },
//   { label: "Ounce (oz)", value: "oz" },
//   { label: "Stone (st)", value: "st" },
//   { label: "Ton (US) (ton)", value: "us_ton" },
//   { label: "Ton (UK) (ton)", value: "uk_ton" },
// ];

// const volumeUnits = [
//   { label: "Milliliter (mL)", value: "mL" },
//   { label: "Liter (L)", value: "L" },
//   { label: "Cubic Centimeter (cm³)", value: "cm3" },
//   { label: "Cubic Meter (m³)", value: "m3" },
//   { label: "Cubic Inch (in³)", value: "in3" },
//   { label: "Cubic Foot (ft³)", value: "ft3" },
//   { label: "Cubic Yard (yd³)", value: "yd3" },
//   { label: "Gallon (US) (gal)", value: "us_gal" },
//   { label: "Gallon (UK) (gal)", value: "uk_gal" },
//   { label: "Pint (US) (pt)", value: "us_pt" },
//   { label: "Pint (UK) (pt)", value: "uk_pt" },
//   { label: "Fluid Ounce (US) (fl oz)", value: "us_fl_oz" },
//   { label: "Fluid Ounce (UK) (fl oz)", value: "uk_fl_oz" },
//   { label: "Barrel (bbl)", value: "bbl" },
//   { label: "Teaspoon (tsp)", value: "tsp" },
//   { label: "Tablespoon (tbsp)", value: "tbsp" },
//   { label: "Cup (cup)", value: "cup" },
//   { label: "Quart (US) (qt)", value: "us_qt" },
//   { label: "Quart (UK) (qt)", value: "uk_qt" },
// ];




// /* ======================
//  DROPDOWN COMPONENT
// ====================== */

// const Dropdown = ({ label, value, data, onSelect }: any) => {
//   const [open, setOpen] = useState(false);

//   const selectedLabel =
//     data.find((i: any) => i.value === value || i.id === value)?.label ||
//     data.find((i: any) => i.id === value)?.name ||
//     `Select ${label}`;

//   return (
//     <View style={{ marginBottom: 16 }}>
//       <Text style={styles.label}>{label}</Text>

//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setOpen(!open)}
//       >
//         <Text style={styles.dropdownText}>{selectedLabel}</Text>
//         <Text>▼</Text>
//       </TouchableOpacity>

//       {open && (
//         <View style={styles.dropdownList}>
//           {data.map((item: any) => (
//             <TouchableOpacity
//               key={item.id || item.value}
//               style={styles.dropdownItem}
//               onPress={() => {
//                 onSelect(item.id ?? item.value);
//                 setOpen(false);
//               }}
//             >
//               <Text style={styles.dropdownItemText}>
//                 {item.label || item.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// /* ======================
//  MAIN COMPONENT
// ====================== */

// const MaterialMasterData = () => {
//   const insets = useSafeAreaInsets();

//   const [form, setForm] = useState(initialData);
//   const [loading, setLoading] = useState(false);

//   const [locations, setLocations] = useState([]);
//   const [materialGroups, setMaterialGroups] = useState([]);

//   /* ======================
//    LOAD DROPDOWNS
//   ====================== */

//   const loadDropdowns = async () => {
//     setLoading(true);

//     const [locRes, grpRes] = await Promise.all([
//       Services.getCompanyLocation(),
//       Services.getUnpscCode(),
//     ]);

//     if (locRes.success) setLocations(locRes.data.results || locRes.data);
//     if (grpRes.success) setMaterialGroups(grpRes.data.results || grpRes.data);

//     setLoading(false);
//   };

//   useEffect(() => {
//     loadDropdowns();
//   }, []);

//   /* ======================
//    SUBMIT
//   ====================== */

//   const submit = async () => {
//     if (!form.description || !form.location || !form.unit_of_measure) {
//       Toast.show({
//         type: 'error',
//         text1: 'Please fill required fields',
//       });
//       return;
//     }

//     const payload = {
//       description: form.description,
//       location: form.location,
//       unit_of_measure: form.unit_of_measure,
//       old_material_number: form.old_material_number || null,
//       material_group: form.material_group,
//       ext_material_group: form.ext_material_group,
//       gross_weight: form.gross_weight || null,
//       net_weight: form.net_weight || null,
//       weight_unit: form.weight_unit || null,
//       volume: form.volume || null,
//       volume_unit: form.volume_unit || null,
//       dimensions: form.dimensions || null,
//       ean: form.ean,
//       ean_category: form.ean_category,
//       order_unit: form.order_unit,
//       underdel_tolerance: form.underdel_tolerance,
//       overdel_tolerance: form.overdel_tolerance,
//       min_del_qty: form.min_del_qty,
//     };

//     const res = await Services.addMaterialMasterData(null, payload);

//     if (res.success) {
//       Toast.show({ type: 'success', text1: 'Material Master Created' });
//       setForm(initialData);
//     } else {
//       Toast.show({ type: 'error', text1: 'Failed to save data' });
//     }
//   };

//   if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

//   /* ======================
//    UI
//   ====================== */

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F7FB' }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>Create Material Master Data</Text>

//         {/* BASIC */}
//         <TextInput
//           style={styles.input}
//           placeholder="Material Number *"
//           placeholderTextColor={"black"}
//           value={form.material_number}
//           onChangeText={v => setForm({ ...form, material_number: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Description *"
//           placeholderTextColor={"black"}

//           value={form.description}
//           onChangeText={v => setForm({ ...form, description: v })}
//         />

//         <Dropdown
//           label="Location *"
//           value={form.location}
//           data={locations}
//           onSelect={(v: any) => setForm({ ...form, location: v })}
//         />

//         <Text style={styles.section}>General Data</Text>

//         <Dropdown
//           label="Base Unit of Measure *"
//           value={form.unit_of_measure}
//           data={baseUnitOptions}
//           onSelect={(v: any) => setForm({ ...form, unit_of_measure: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Old Material Number"
//           placeholderTextColor={"black"}

//           keyboardType="numeric"
//           value={form.old_material_number}
//           onChangeText={v => setForm({ ...form, old_material_number: v })}
//         />

//         <Dropdown
//           label="Material Group"
//           value={form.material_group}
//           data={materialGroups}
//           onSelect={(v: any) => setForm({ ...form, material_group: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Ext. Material Group"
//           placeholderTextColor={"black"}

//           value={form.ext_material_group}
//           onChangeText={v => setForm({ ...form, ext_material_group: v })}
//         />

//         <Text style={styles.section}>Dimensions / EANs</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Gross Weight"
//           placeholderTextColor={"black"}

//           value={form.gross_weight}
//           onChangeText={v => setForm({ ...form, gross_weight: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Net Weight"
//           placeholderTextColor={"black"}

//           value={form.net_weight}
//           onChangeText={v => setForm({ ...form, net_weight: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholderTextColor={"black"}

//           placeholder="Volume"
//           value={form.volume}
//           onChangeText={v => setForm({ ...form, volume: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholderTextColor={"black"}

//           placeholder="Dimensions"
//           value={form.dimensions}
//           onChangeText={v => setForm({ ...form, dimensions: v })}
//         />
//         <Dropdown
//           label="Weight Unit"
//           value={form.weight_unit}
//           data={weightUnits}
//           onSelect={(v: any) => setForm({ ...form, weight_unit: v })}
//         />
//   <Dropdown
//           label="Select Volume Unit"
//           value={form.volume_unit}
//           data={volumeUnits}
//           onSelect={(v: any) => setForm({ ...form, volume_unit: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholderTextColor={"black"}

//           placeholder="EAN"
//           value={form.ean}
//           onChangeText={v => setForm({ ...form, ean: v })}
//         />
//          <Dropdown
//           label="Select Order unit  *"
//           value={form.order_unit}
//           data={baseUnitOptions}
//           onSelect={(v: any) => setForm({ ...form, order_unit: v })}
//         />
// <TextInput
//           style={styles.input}
//           placeholderTextColor={"black"}
//           placeholder="EAN Category"
//           value={form.ean_category}
//           onChangeText={v => setForm({ ...form, ean_category: v })}
//         />
//         <Text style={styles.section}>Shipping Instructions</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Underdelivery Tolerance (%)"
//           placeholderTextColor={"black"}

//           keyboardType="numeric"
//           value={form.underdel_tolerance}
//           onChangeText={v => setForm({ ...form, underdel_tolerance: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Overdelivery Tolerance (%)"
//           placeholderTextColor={"black"}

//           keyboardType="numeric"
//           value={form.overdel_tolerance}
//           onChangeText={v => setForm({ ...form, overdel_tolerance: v })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Min Delivery Qty (%)"
//           placeholderTextColor={"black"}

//           keyboardType="numeric"
//           value={form.min_del_qty}
//           onChangeText={v => setForm({ ...form, min_del_qty: v })}
//         />

//         {/* ACTIONS */}
//         <View style={styles.btnRow}>
//           <TouchableOpacity style={styles.cancelBtn}>
//             <Text style={styles.btnText}>Close</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.submitBtn} onPress={submit}>
//             <Text style={styles.btnText}>Submit</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default MaterialMasterData;

// /* ======================
//  STYLES
// ====================== */

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   section: {
//     marginTop: 20,
//     marginBottom: 8,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   input: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#5d5d5dff',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     backgroundColor: '#FFF',
//     marginBottom: 16,
//   },
//   label: {
//     marginBottom: 6,
//     color: '#374151',
//   },
//   dropdown: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#828283ff',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     backgroundColor: '#FFF',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dropdownList: {
//     marginTop: 6,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     elevation: 4,
//   },
//   dropdownItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   dropdownItemText: {
//     fontSize: 14,
//   },
//   dropdownText: {
//     color: '#111827',
//   },
//   btnRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 24,
//   },
//   submitBtn: {
//     backgroundColor: '#0A1E8A',
//     padding: 14,
//     borderRadius: 10,
//     flex: 1,
//     marginLeft: 8,
//   },
//   cancelBtn: {
//     backgroundColor: '#6B7280',
//     padding: 14,
//     borderRadius: 10,
//     flex: 1,
//     marginRight: 8,
//   },
//   btnText: {
//     color: '#FFF',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Services from '../../../Services/services';

/* ======================
 INITIAL FORM DATA
====================== */

const initialData = {
  material_number: '',
  description: '',
  location: null,
  unit_of_measure: '',
  old_material_number: '',
  material_group: null,
  ext_material_group: '',
  gross_weight: '',
  net_weight: '',
  weight_unit: '',
  volume: '',
  volume_unit: '',
  dimensions: '',
  ean: '',
  ean_category: '',
  order_unit: '',
  underdel_tolerance: '',
  overdel_tolerance: '',
  min_del_qty: '',
};

/* ======================
 STATIC DROPDOWNS
====================== */



 const baseUnitOptions = [
   { value: "EA", label: "Each (EA)" },
   { value: "PC", label: "Piece (PC)" },
   { value: "DZ", label: "Dozen (DZ)" },
   { value: "PK", label: "Pack (PK)" },
   { value: "SET", label: "Set (SET)" },
   { value: "LOT", label: "Lot (LOT)" },
   { value: "BAG", label: "Bag (BAG)" },
   { value: "BOX", label: "Box (BOX)" },
   { value: "ROL", label: "Roll (ROL)" },
   { value: "PAL", label: "Pallet (PAL)" },
   { value: "KG", label: "Kilogram (KG)" },
   { value: "G", label: "Gram (G)" },
   { value: "MG", label: "Milligram (MG)" },
   { value: "TON", label: "Metric Ton (TON)" },
   { value: "LB", label: "Pound (LB)" },
   { value: "OZ", label: "Ounce (OZ)" },
   { value: "CWT", label: "Hundredweight (CWT)" },
   { value: "T", label: "Long Ton (T)" },
   { value: "M", label: "Meter (M)" },
   { value: "CM", label: "Centimeter (CM)" },
   { value: "MM", label: "Millimeter (MM)" },
   { value: "IN", label: "Inch (IN)" },
   { value: "FT", label: "Foot (FT)" },
   { value: "YD", label: "Yard (YD)" },
   { value: "KM", label: "Kilometer (KM)" },
   { value: "MI", label: "Mile (MI)" },
   { value: "L", label: "Liter (L)" },
   { value: "ML", label: "Milliliter (ML)" },
   { value: "M3", label: "Cubic Meter (M3)" },
   { value: "CC", label: "Cubic Centimeter (CC)" },
   { value: "GAL", label: "Gallon (GAL)" },
   { value: "QT", label: "Quart (QT)" },
   { value: "PT", label: "Pint (PT)" },
   { value: "FL OZ", label: "Fluid Ounce (FL OZ)" },
   { value: "KWH", label: "Kilowatt Hour (KWH)" },
   { value: "J", label: "Joule (J)" },
   { value: "BTU", label: "British Thermal Unit (BTU)" },
   { value: "CAL", label: "Calorie (CAL)" },
   { value: "HR", label: "Hour (HR)" },
   { value: "MIN", label: "Minute (MIN)" },
   { value: "SEC", label: "Second (SEC)" },
   { value: "DAY", label: "Day (DAY)" },
   { value: "WK", label: "Week (WK)" },
   { value: "MO", label: "Month (MO)" },
   { value: "YR", label: "Year (YR)" },
   { value: "PR", label: "Pair (PR)" },
   { value: "BATCH", label: "Batch (BATCH)" },
   { value: "SHT", label: "Sheet (SHT)" },
   { value: "CAN", label: "Can (CAN)" },
   { value: "TUB", label: "Tub (TUB)" },
 ];

 const weightUnits = [
   { label: "Carat (ct)", value: "ct" },
   { label: "Gram (g)", value: "g" },
   { label: "Kilogram (kg)", value: "kg" },
   { label: "Milligram (mg)", value: "mg" },
   { label: "Metric Ton (t)", value: "t" },
   { label: "Pound (lb)", value: "lb" },
   { label: "Ounce (oz)", value: "oz" },
   { label: "Stone (st)", value: "st" },
   { label: "Ton (US) (ton)", value: "us_ton" },
   { label: "Ton (UK) (ton)", value: "uk_ton" },
 ];

const volumeUnits = [
  { label: "Milliliter (mL)", value: "mL" },
  { label: "Liter (L)", value: "L" },
  { label: "Cubic Centimeter (cm³)", value: "cm3" },
  { label: "Cubic Meter (m³)", value: "m3" },
  { label: "Cubic Inch (in³)", value: "in3" },
  { label: "Cubic Foot (ft³)", value: "ft3" },
  { label: "Cubic Yard (yd³)", value: "yd3" },
  { label: "Gallon (US) (gal)", value: "us_gal" },
  { label: "Gallon (UK) (gal)", value: "uk_gal" },
  { label: "Pint (US) (pt)", value: "us_pt" },
  { label: "Pint (UK) (pt)", value: "uk_pt" },
  { label: "Fluid Ounce (US) (fl oz)", value: "us_fl_oz" },
  { label: "Fluid Ounce (UK) (fl oz)", value: "uk_fl_oz" },
  { label: "Barrel (bbl)", value: "bbl" },
  { label: "Teaspoon (tsp)", value: "tsp" },
  { label: "Tablespoon (tbsp)", value: "tbsp" },
  { label: "Cup (cup)", value: "cup" },
  { label: "Quart (US) (qt)", value: "us_qt" },
  { label: "Quart (UK) (qt)", value: "uk_qt" },
 ];


/* ======================
 DROPDOWN COMPONENT
====================== */

const Dropdown = ({ label, value, data, onSelect }:any) => {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    data.find(i => i.value === value || i.id === value)?.label ||
    data.find(i => i.id === value)?.name ||
    `Select ${label}`;
console.log("data",data);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.dropdownText}>{selectedLabel}</Text>
        <Text>▼</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
         {data.map((item:any) => (
  <TouchableOpacity
    key={item.id || item.value}
    style={styles.dropdownItem}
    onPress={() => {
      onSelect(item.id ?? item.value);
      setOpen(false);
    }}
  >
    <Text>{item.label || item.name}</Text>
  </TouchableOpacity>
))}

        </View>
      )}
    </View>
  );
};

/* ======================
 MAIN SCREEN
====================== */

const MaterialMasterData = () => {
  const [materials, setMaterials] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(initialData);

  const [locations, setLocations] = useState([]);
  const [materialGroups, setMaterialGroups] = useState([]);

  /* ======================
   LOAD MATERIAL LIST
  ====================== */

  const loadMaterials = async () => {
    setLoadingList(true);
    const res = await Services.getMaterialMasterData();
    if (res.success) {
      setMaterials(res.data.results || res.data || []);
    }
    setLoadingList(false);
  };
console.log("locations",locations);

  /* ======================
   LOAD DROPDOWNS
  ====================== */

  const loadDropdowns = async () => {
    const locRes = await Services.getCompanyLocation();
    const grpRes = await Services.getUnpscCode();

    if (locRes.success) setLocations(locRes.data.results || locRes.data);
    if (grpRes.success) setMaterialGroups(grpRes.data.results || grpRes.data);
  };

  useEffect(() => {
    loadMaterials();
    loadDropdowns();
  }, []);

  /* ======================
   SUBMIT FORM
  ====================== */

  const submit = async () => {
    if (!form.description || !form.location || !form.unit_of_measure) {
      Toast.show({
        type: 'error',
        text1: 'Please fill required fields',
      });
      return;
    }

    setSaving(true);

    const payload = {
      description: form.description,
      location: form.location,
      unit_of_measure: form.unit_of_measure,
      old_material_number: form.old_material_number || null,
      material_group: form.material_group,
      ext_material_group: form.ext_material_group,
      gross_weight: form.gross_weight || null,
      net_weight: form.net_weight || null,
      weight_unit: form.weight_unit || null,
      volume: form.volume || null,
      volume_unit: form.volume_unit || null,
      dimensions: form.dimensions || null,
      ean: form.ean,
      ean_category: form.ean_category,
      order_unit: form.order_unit,
      underdel_tolerance: form.underdel_tolerance,
      overdel_tolerance: form.overdel_tolerance,
      min_del_qty: form.min_del_qty,
    };

    const res = await Services.addMaterialMasterData(null, payload);

    if (res.success) {
      Toast.show({ type: 'success', text1: 'Material Created' });
      setForm(initialData);
      setModalVisible(false);
      loadMaterials();
    } else {
      Toast.show({ type: 'error', text1: 'Failed to save material' });
    }

    setSaving(false);
  };

  /* ======================
   CARD VIEW
  ====================== */

  const renderCard = (item:any, index:any) => (
    <View key={item.id || index} style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.material_number || `Material ${index + 1}`}
      </Text>
      <Text>Description: {item.description}</Text>
      <Text>Base Unit: {item.unit_of_measure}</Text>
      <Text>Location: {item.location_name || item.location}</Text>
    </View>
  );

  /* ======================
   UI
  ====================== */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F7FB' }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TextInput
            placeholder="Search Material"
            style={styles.searchInput}
          />

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>

        {loadingList ? (
          <ActivityIndicator />
        ) : materials.length === 0 ? (
          <Text style={styles.noData}>No data found!</Text>
        ) : (
          <ScrollView>{materials.map(renderCard)}</ScrollView>
        )}
      </View>

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} animationType="slide"
        presentationStyle="pageSheet"
        onDismiss={() => setModalVisible(false)} // 👈 iOS swipe-down
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Material Master Data</Text>

            <TextInput
              style={styles.input}
              placeholder="Description *"
              placeholderTextColor={'black'}

              value={form.description}
              onChangeText={v => setForm({ ...form, description: v })}
            />

            <Dropdown
              label="Location *"
              value={form.location}
              data={locations}
              onSelect={v => setForm({ ...form, location: v })}
            />

            <Dropdown
              label="Base Unit of Measure *"
              value={form.unit_of_measure}
              data={baseUnitOptions}
              onSelect={v => setForm({ ...form, unit_of_measure: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="Old Material Number"
              placeholderTextColor={'black'}

              value={form.old_material_number}
              onChangeText={v =>
                setForm({ ...form, old_material_number: v })
              }
            />

            <Dropdown
              label="Material Group"
              value={form.material_group}
              data={materialGroups}
              onSelect={v => setForm({ ...form, material_group: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="Ext. Material Group"
              placeholderTextColor={'black'}
              value={form.ext_material_group}
              onChangeText={v =>
                setForm({ ...form, ext_material_group: v })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Gross Weight"
              placeholderTextColor={'black'}

              value={form.gross_weight}
              onChangeText={v => setForm({ ...form, gross_weight: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="Net Weight"
              placeholderTextColor={'black'}

              value={form.net_weight}
              onChangeText={v => setForm({ ...form, net_weight: v })}
            />

            <Dropdown
              label="Weight Unit"
              value={form.weight_unit}
              data={weightUnits}
              onSelect={v => setForm({ ...form, weight_unit: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="Volume"
              placeholderTextColor={'black'}

              value={form.volume}
              onChangeText={v => setForm({ ...form, volume: v })}
            />

            <Dropdown
              label="Volume Unit"
              value={form.volume_unit}

              data={volumeUnits}
              onSelect={v => setForm({ ...form, volume_unit: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="Dimensions"
              placeholderTextColor={'black'}

              value={form.dimensions}
              onChangeText={v => setForm({ ...form, dimensions: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="EAN"
              placeholderTextColor={'black'}

              value={form.ean}
              onChangeText={v => setForm({ ...form, ean: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="EAN Category"
              placeholderTextColor={'black'}

              value={form.ean_category}
              onChangeText={v => setForm({ ...form, ean_category: v })}
            />

            <Dropdown
              label="Order Unit"
              value={form.order_unit}
              data={baseUnitOptions}
              onSelect={v => setForm({ ...form, order_unit: v })}
            />

            <TextInput
              style={styles.input}
              placeholder="Underdelivery Tolerance (%)"
              placeholderTextColor={'black'}

              value={form.underdel_tolerance}
              onChangeText={v =>
                setForm({ ...form, underdel_tolerance: v })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Overdelivery Tolerance (%)"
              placeholderTextColor={'black'}

              value={form.overdel_tolerance}
              onChangeText={v =>
                setForm({ ...form, overdel_tolerance: v })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Min Delivery Qty (%)"
              placeholderTextColor={'black'}

              value={form.min_del_qty}
              onChangeText={v => setForm({ ...form, min_del_qty: v })}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={submit}
                disabled={saving}
              >
                <Text style={styles.btnText}>
                  {saving ? 'Saving...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MaterialMasterData;

/* ======================
 STYLES
====================== */

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },

  headerRow: { flexDirection: 'row', marginBottom: 16 },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  createBtn: {
    backgroundColor: '#0A1E8A',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 10,
  },
  createText: { color: '#FFF', fontWeight: '600' },

  noData: { textAlign: 'center', marginTop: 40 },

  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A1E8A',
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  label: { marginBottom: 6 },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  btnRow: { flexDirection: 'row', marginTop: 24 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#6B7280',
    padding: 14,
    borderRadius: 10,
    marginRight: 8,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#0A1E8A',
    padding: 14,
    borderRadius: 10,
    marginLeft: 8,
  },
  btnText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
