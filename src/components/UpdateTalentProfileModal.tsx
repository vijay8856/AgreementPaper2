
// ============================================================
//  UpdateTalentProfileModal.tsx
// ============================================================
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

import DocumentPicker from "react-native-document-picker";
import ImagePicker from "react-native-image-crop-picker";
import Services from "../Services/services";
import Toast from "react-native-toast-message";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------
interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profile: any;
}

interface Country {
  name: string;
}

interface StateItem {
  name: string;
}

interface SkillItem {
  id: number;
  name: string;
}

// -------------------------------------------------------------
// COMPONENT
// -------------------------------------------------------------
const UpdateTalentProfileModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  profile,
}) => {
  // Basic
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");

  const [experience, setExperience] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

  const [resumeFile, setResumeFile] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<any>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<any>(null);


  console.log("pinCode", pinCode);

  // -------------------------------------------------------------
  // LOAD DROPDOWNS
  // -------------------------------------------------------------
  useEffect(() => {
    if (visible) {
      loadCountries();
      loadSkills();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || !profile) return;
    console.log("profiles", profile);

    setOriginalProfile(profile);

    setFirstName(profile.user_detail.first_name || "");
    setLastName(profile.user_detail.last_name || "");
    setContactNumber(profile.user_detail.contact_number || "");
    setEmail(profile.user_detail.email || "");

    setCountry(profile.country_name || "");
    setState(profile.state_name || "");
    setDistrict(profile.district || "");
    setPinCode(
      profile?.pin_code !== null && profile?.pin_code !== undefined
        ? String(profile.pin_code)
        : ""
    );

    setAddress(profile.address || "");
    setAbout(profile.about || "");

    setExperience(profile.total_experience || "");
    setJobTitle(profile.current_job_title || "");

    setSelectedSkills(profile.skills?.map((s: any) => s.id) || []);
  }, [visible, profile]);

  const isChanged = (key: string, value: any) => {
    if (!originalProfile) return false;

    if (["first_name", "last_name", "contact_number", "email"].includes(key)) {
      return originalProfile.user_detail?.[key] !== value;
    }

    if (key === "pin_code") {
      return String(originalProfile.pin_code || "") !== String(value || "");
    }

    return String(originalProfile?.[key] || "") !== String(value || "");
  };


  // -------------------------------------------------------------
  // API CALLS
  // -------------------------------------------------------------
  const loadCountries = async () => {
    const res = await Services.getCountryList();
    if (res?.success) setCountries(res.data);
  };

  const loadSkills = async () => {
    const res = await Services.getSkillDropDownList();
    if (res?.success) setSkills(res.data);
  };

  const handleCountrySelect = async (name: string) => {
    setCountry(name);
    setState("");
    setStates([]);

    const res = await Services.getCountryDetailsState(name);
    if (res?.success) setStates(res.data);
  };

  // -------------------------------------------------------------
  // FILE PICKERS
  // -------------------------------------------------------------
  const pickResume = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      setResumeFile({
        uri: res.uri,
        name: res.name,
        type: res.type,
      });
    } catch (e) { }
  };

  const pickProfileImage = async () => {
    const img = await ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    });

    setProfilePic({
      uri: img.path,
      type: img.mime,
      name: "profile.jpg",
    });
  };

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  const updateBasicProfile = async (): Promise<boolean> => {
    const payload: any = {};

    if (isChanged("first_name", firstName)) payload.first_name = firstName;
    if (isChanged("last_name", lastName)) payload.last_name = lastName;
    if (isChanged("contact_number", contactNumber))
      payload.contact_number = contactNumber;
    if (isChanged("email", email)) payload.email = email;

    if (Object.keys(payload).length === 0) {
      return true; // nothing to update → treat as success
    }

    const res = await Services.updateUserProfileDetails(payload);
    return res?.success === true;
  };


  const updateTalentProfile = async (): Promise<boolean> => {
    const fd = new FormData();
    let hasData = false;

    if (isChanged("country_name", country)) {
      fd.append("country_name", country);
      hasData = true;
    }

    if (isChanged("state_name", state)) {
      fd.append("state_name", state);
      hasData = true;
    }

    if (isChanged("district", district)) {
      fd.append("district", district);
      hasData = true;
    }

    if (isChanged("pin_code", pinCode)) {
      fd.append("pin_code", pinCode);
      hasData = true;
    }

    if (isChanged("address", address)) {
      fd.append("address", address);
      hasData = true;
    }

    if (isChanged("about", about)) {
      fd.append("about", about);
      hasData = true;
    }

    if (isChanged("total_experience", experience)) {
      fd.append("total_experience", experience);
      hasData = true;
    }

    if (isChanged("current_job_title", jobTitle)) {
      fd.append("current_job_title", jobTitle);
      hasData = true;
    }

    const originalSkills =
      originalProfile?.skills?.map((s: any) => s.id) || [];

    if (JSON.stringify(originalSkills) !== JSON.stringify(selectedSkills)) {
      selectedSkills.forEach((id) =>
        fd.append("skill_set", id.toString())
      );
      hasData = true;
    }

    if (profilePic) {
      fd.append("profile_pic", profilePic);
      hasData = true;
    }

    if (resumeFile) {
      fd.append("cv", resumeFile);
      hasData = true;
    }

    if (!hasData) return true; // nothing to update, treat as success

    const res = await Services.updateTalentUserProfile(fd);
    return res?.success === true;
  };





  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  const handleSubmit = async () => {
    setLoading(true);

    let basicSuccess = false;
    let talentSuccess = false;

    try {
      basicSuccess = await updateBasicProfile();
    } catch (e) {
      console.log("Basic update error", e);
    }

    try {
      talentSuccess = await updateTalentProfile();
    } catch (e) {
      console.log("Talent update error", e);
    }

    setLoading(false);

    if (basicSuccess || talentSuccess) {
      console.log("basicSuccess", basicSuccess);
      console.log("talentSuccess", basicSuccess);


      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
      onSuccess();
      onClose(); // ✅ close if ANY succeeds
    } else {
      Toast.show({
        type: "error",
        text1: "Profile update failed",
      });
    }
  };


  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.heading}>Update Talent Profile</Text>

              <TouchableOpacity
                onPress={pickProfileImage}
                style={styles.picContainer}
              >
                {profilePic ? (
                  <Image source={{ uri: profilePic.uri }} style={styles.profilePic} />
                ) : (
                  <Text>Upload Profile Picture</Text>
                )}
              </TouchableOpacity>

              <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
              <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
              <TextInput style={styles.input} placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Country</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setCountryOpen(true)}>
                <Text>{country || "Select Country"}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>State</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => states.length && setStateOpen(true)}
              >
                <Text>{state || "Select State"}</Text>
              </TouchableOpacity>

              <TextInput style={styles.input} placeholder="District" value={district} onChangeText={setDistrict} />
              <TextInput style={styles.input} placeholder="Pin Code" value={pinCode} onChangeText={setPinCode} />

              {/* SKILLS DROPDOWN */}
              <Text style={styles.label}>Select Skills</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setSkillsOpen(true)}
              >
                <Text style={styles.dropdownText}>
                  {selectedSkills.length > 0
                    ? `${selectedSkills.length} skills selected`
                    : "Select Skills"}
                </Text>
              </TouchableOpacity>





              <TextInput
                style={[styles.input, { height: 90 }]}
                placeholder="About"
                multiline
                value={about}
                onChangeText={setAbout}
              />

              <TouchableOpacity style={styles.pdfButton} onPress={pickResume}>
                <Text style={{ color: "#fff" }}>
                  {resumeFile ? resumeFile.name : "Upload Resume (PDF)"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Update Profile</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* COUNTRY MODAL */}
      <Modal visible={countryOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.backdrop} onPress={() => setCountryOpen(false)}>
          <View style={styles.list}>
            <ScrollView>
              {countries.map((c) => (
                <TouchableOpacity
                  key={c.name}
                  style={styles.item}
                  onPress={() => {
                    handleCountrySelect(c.name);
                    setCountryOpen(false);
                  }}
                >
                  <Text>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* STATE MODAL */}
      <Modal visible={stateOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.backdrop} onPress={() => setStateOpen(false)}>
          <View style={styles.list}>
            <ScrollView>
              {states.map((s) => (
                <TouchableOpacity
                  key={s.name}
                  style={styles.item}
                  onPress={() => {
                    setState(s.name);
                    setStateOpen(false);
                  }}
                >
                  <Text>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* SKILLS MODAL */}
      <Modal visible={skillsOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.dropdownBackdrop}
          activeOpacity={1}
          onPress={() => setSkillsOpen(false)}
        >
          <View style={styles.dropdownModal}>
            <ScrollView>
              {skills.map((skill) => {
                const selected = selectedSkills.includes(skill.id);
                return (
                  <TouchableOpacity
                    key={skill.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (selected) {
                        setSelectedSkills(
                          selectedSkills.filter((id) => id !== skill.id)
                        );
                      } else {
                        setSelectedSkills([...selectedSkills, skill.id]);
                      }
                    }}
                  >
                    <Text style={{ color: selected ? "#007bff" : "#333" }}>
                      {selected ? "✓ " : ""}
                      {skill.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => setSkillsOpen(false)}
            >
              <Text style={styles.submitText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </>
  );
};

// -------------------------------------------------------------
// STYLES
// -------------------------------------------------------------
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
  modal: { backgroundColor: "#fff", padding: 20, borderRadius: 12, maxHeight: "90%" },
  heading: { fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 6 },
  dropdown: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 12 },
  pdfButton: { backgroundColor: "#0E46A3", padding: 12, borderRadius: 8, alignItems: "center" },
  submitBtn: { backgroundColor: "#007bff", padding: 14, borderRadius: 10, marginTop: 10, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600" },
  closeText: { color: "red", textAlign: "center", marginTop: 15 },
  picContainer: { alignItems: "center", marginBottom: 16 },
  profilePic: { width: 90, height: 90, borderRadius: 50 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", padding: 20 },
  list: { backgroundColor: "#fff", borderRadius: 10, maxHeight: "60%" },
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },

  dropdownBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "70%",
    paddingVertical: 10,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

});

export default UpdateTalentProfileModal;
