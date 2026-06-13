import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PostNewJobScreen = () => {
  const navigation = useNavigation();
  const [jobTitle, setJobTitle] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [jobType, setJobType] = useState("Full time");
  const [description, setDescription] = useState("");
  const [postedOn] = useState(new Date().toDateString());

  const handlePostJob = () => {
    console.log({
      jobTitle,
      organisation,
      location,
      skills,
      jobType,
      description,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Add Job Post</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handlePostJob}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Job Title */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Job Posting Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senior Next.js Developer"
              placeholderTextColor="#888"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
          </View>

          {/* Organisation */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Organisation / Agency</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Eminence Infotech"
              placeholderTextColor="#888"
              value={organisation}
              onChangeText={setOrganisation}
            />
          </View>

          {/* Location */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Indore"
              placeholderTextColor="#888"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Skills */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Skills</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. React, Next.js, TypeScript"
              placeholderTextColor="#888"
              value={skills}
              onChangeText={setSkills}
            />
          </View>

          {/* Job Type */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Job Type</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setJobType(jobType === "Full time" ? "Part time" : "Full time")
              }
            >
              <Text style={styles.dropdownText}>{jobType}</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Job Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write job details..."
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Posted On */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Posted On</Text>
            <View style={styles.disabledBox}>
              <Text style={styles.disabledText}>{postedOn}</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.postButton} onPress={handlePostJob}>
            <Text style={styles.postButtonText}>Post Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostNewJobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e1e1e",
  },
  saveButton: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  formContainer: {
    marginBottom: 40,
  },
  inputBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: "#111",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 15,
    color: "#111",
  },
  disabledBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  disabledText: {
    fontSize: 15,
    color: "#333",
  },
  postButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  postButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});
