import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
    Keyboard
} from "react-native";
import Services from "../Services/services";
import RenderHtml from "react-native-render-html";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
type CountryType = {
    id: number;
    name: string;
    states?: { name: string }[];
    [k: string]: any;
};

type SkillType = {
    id: number | string;
    name: string;
};
const LatestJobsScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [jobId, setJobId] = useState('')
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<(string | number)[]>([]);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);
    const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
    const [skillsList, setSkillsList] = useState<SkillType[]>([]);
    const [countrySearchLoading, setCountrySearchLoading] = useState(false);
    const [countryQuery, setCountryQuery] = useState("");
    const [countryResults, setCountryResults] = useState<CountryType[]>([]);
    const [stateQuery, setStateQuery] = useState("");
    const [stateResults, setStateResults] = useState<{ name: string }[]>([]);
    // form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [locationCity, setLocationCity] = useState("");
    const [cvFileName, setCvFileName] = useState<string | null>(null);
    const [job, setJob] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [allCountries, setAllCountries] = useState<CountryType[]>([]);
  const [userType, setUserType] = useState<string | null>(null);

    // dynamic question answers
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const LIMIT = 10;
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);



useEffect(() => {
  const getUserType = async () => {
    try {
      const type = await AsyncStorage.getItem("userType");
      console.log("type",type);
      
      setUserType(type);
    } catch (error) {
      console.log("Error reading UserType", error);
    }
  };

  getUserType();
}, []);

    const toggleSkill = (id: number | string) => {
        setSelectedSkills(prev => {
            if (prev.includes(id)) return prev.filter(i => i !== id);
            return [...prev, id];
        });
    };


    useEffect(() => {
        fetchAllJobs(false);
        fetchSkills();
        fetchUserData();
        fetchCountries();
    }, []);

    const fetchCountries = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        // else setRefreshing(true);

        const response = await Services.getCountryList({ limit: 1, offset: 0 });

        if (response.success) {
            const formattedCountries = response.data.map((country: any) => ({
                label: country.name,
                value: country.id,
            }));
            setAllCountries(formattedCountries.data || []);
            setCountryResults(formattedCountries.data || []);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Failed to load countries',
                text2: response.error?.message || 'Something went wrong',
                position: 'top',
            });
        }

        setLoading(false);
        // setRefreshing(false);
    };
    const handleSearchCountry = async (query: string) => {
        setCountryQuery(query);
        setCountryDropdownOpen(true);
        setCountrySearchLoading(true);

        try {
            const res = await Services.searchCountry(query.trim());

            if (res.success) {
                setCountryResults(res.data || []);
            } else {
                setCountryResults([]);
            }
        } catch (e) {
            console.log("Country search error", e);
            setCountryResults([]);
        } finally {
            setCountrySearchLoading(false);
        }
    };


    const handleSearchState = (query: string) => {
        setStateQuery(query);

        if (!selectedCountry || !selectedCountry.states) {
            setStateResults([]);
            return;
        }

        const filteredStates = selectedCountry.states.filter(state =>
            state.name.toLowerCase().includes(query.toLowerCase())
        );
        setStateResults(filteredStates);
    };



    const fetchSkills = async () => {
        try {
            const res = await Services.getSkillDropDownList({});
            if (res.success) {
                setSkillsList(res.data || []);
            } else {
                console.warn("Skills fetch returned failure", res);
            }
        } catch (err) {
            console.warn("Error fetching skills", err);
        }
    };

    const fetchUserData = async () => {
        try {
            const fName = await AsyncStorage.getItem('first_Name');
            const lName = await AsyncStorage.getItem('last_Name');
            const userEmail = await AsyncStorage.getItem('email');
            if (fName) setFirstName(fName);
            if (lName) setLastName(lName);
            if (userEmail) setEmail(userEmail);
        } catch (e) {
            console.log('Error fetching user data:', e);
        }
    };

    const fetchAllJobs = async (loadMore = false) => {
        if (loading || loadingMore || !hasMore) return;

        loadMore ? setLoadingMore(true) : setLoading(true);

        try {
            const currentOffset = loadMore ? offset : 0;

            const payload = {
                limit: LIMIT,
                offset: currentOffset,
            };

            const response = await Services.getJobsList(payload);

            if (response.success) {
                const newJobs = response.data || [];

                setJobs(prev =>
                    loadMore ? [...prev, ...newJobs] : newJobs
                );

                setOffset(currentOffset + LIMIT);
                setHasMore(newJobs.length === LIMIT);
            }
        } catch (err) {
            console.log("fetchAllJobs error", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };


    // Remove HTML & limit to 10 lines
    const getShortDescription = (htmlText: string) => {
        if (!htmlText) return "No description available";

        // Remove HTML
        const plain = htmlText.replace(/<[^>]+>/g, "").trim();

        // Limit to 100 words
        const words = plain.split(/\s+/);
        let limitedText = words.slice(0, 100).join(" ");

        // Limit to max 2 lines
        const lines = limitedText.split("\n").slice(0, 2).join("\n");

        // Add ... if trimmed
        const wasTrimmed = plain !== lines;
        return wasTrimmed ? lines + "..." : lines;
    };


    const renderJobItem = ({ item }: any) => (
        <View style={styles.card}>
            {/* Title + Salary */}
            <View style={styles.rowBetween}>
                <Text style={styles.title}>{item.title}</Text>

                {item.pay_rate ? (
                    <Text style={styles.salary}>INR {item.pay_rate}/day</Text>
                ) : null}
            </View>

            {/* Job Type */}
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.job_type_value}</Text>
            </View>

            {/* Meta Info */}
            <View style={styles.rowWrap}>
                <Text style={styles.meta}>📍 {item.company_city}, {item.company_state}</Text>
                <Text style={styles.meta}>🏢 {item.company_name}</Text>
                <Text style={styles.meta}>💼 {item.job_location_type}</Text>
            </View>

            <Text style={styles.posted}>
                Posted on:{" "}
                {new Date(item.created_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </Text>

            {/* Section Header */}
            <Text style={styles.sectionHeader}>Job description</Text>

            {/* RENDER SHORT DESCRIPTION */}
            <Text style={styles.shortText}>
                {getShortDescription(item.job_description)}
                {"\n"}...
            </Text>

            {/* SKILLS */}
            <Text style={styles.sectionHeader}>Skills</Text>
            <View style={styles.skillsContainer}>
                {item.skills_data?.map((skill: any) => (
                    <View key={skill.id} style={styles.skillChip}>
                        <Text style={styles.skillText}>{skill.name}</Text>
                    </View>
                ))}
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
                {/* <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => alert("Apply API Coming Soon")}
                >
                    <Text style={styles.btnText}>Apply</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() =>
                        navigation.navigate("JobDetailScreen", {
                            jobId: item.id
                        })
                    }
                >
                    <Text style={styles.btnText}>View Details</Text>
                </TouchableOpacity>
                {/* APPLY BUTTON */}
          {userType !== "AGENCY_USER" && (
  <TouchableOpacity
    style={styles.applyBtn}
    onPress={() => openApplyModal(item.id)}
  >
    <Text style={styles.applyBtnText}>Apply Now</Text>
  </TouchableOpacity>
)}


            </View>
        </View>
    );
    const validateEmail = (v: string) =>
        /\S+@\S+\.\S+/.test(v);

    const handleSubmitApplication = async () => {
        if (!job) return Alert.alert("Error", "Job not loaded");

        if (!firstName.trim()) return Alert.alert("Validation", "Enter first name");
        if (!lastName.trim()) return Alert.alert("Validation", "Enter last name");
        if (!email.trim() || !validateEmail(email)) return Alert.alert("Validation", "Valid email required");
        if (!contact.trim()) return Alert.alert("Validation", "Contact required");
        if (!selectedCountry) return Alert.alert("Validation", "Country required");
        if (!selectedState) return Alert.alert("Validation", "State required");
        if (!locationCity.trim()) return Alert.alert("Validation", "City required");

        const job_application_answers = job.job_questions.map(
            (q: any, index: number) => ({
                question: q.question,
                answer: answers[index] || "",
            })
        );

        const payload = {
            job: String(job.id),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            contact: contact.trim(),
            company_name: companyName.trim(),
            skills: selectedSkills.map(String),
            location: locationCity.trim(),
            state: selectedState,
            country: String(selectedCountry.id),
            job_application_answers,
        };

        setSubmitting(true);
        try {
            const res = await Services.createJobApplication(payload);
            console.log("createJobApplication res ", res);

            if (res.success) {
                Alert.alert("Success", "Application submitted successfully");
                // resetApplyForm();
                setShowApplyModal(false);
            } else {
                Alert.alert("Error", res.error || "Submit failed");
            }
        } catch {
            Alert.alert("Error", "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to show country states list for selection
    const renderCountryItem = ({ item }: { item: CountryType }) => (
        <TouchableOpacity
            style={styles.dropdownItem}
            onPress={async () => {
                setSelectedCountry(item);
                setSelectedState(null);
                setStateQuery("");
                setStateResults([]);
                setCountryQuery(item.name);
                setCountryDropdownOpen(false);

                try {
                    const res = await Services.getCountryDetailsState(item.name);
                    if (res.success) {
                        setSelectedCountry({
                            ...item,
                            states: res.data,
                        });
                        setStateResults(res.data);
                    }
                } catch {
                    Alert.alert("Error", "Failed to load states");
                }
            }}

        >
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    // Helper to show state list for selection
    const renderStateItem = ({ item }: { item: { name: string } }) => (
        <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
                setSelectedState(item.name);
                setStateQuery(item.name);
                setStateDropdownOpen(false);
            }}
        >
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );
    const handleAnswerChange = (index: number, text: string) => {
        setAnswers(prev => ({ ...prev, [index]: text }));
    };
    const closeAllDropdowns = () => {
        setSkillsDropdownOpen(false);
        setCountryDropdownOpen(false);
        setStateDropdownOpen(false);
        Keyboard.dismiss();
    };
    const onPickCV = async () => {
        // Optional: DocumentPicker integration.
        // Keep placeholder for now.
        Alert.alert("Upload CV", "CV upload is optional — integrate DocumentPicker for file upload.");
    };

    const openApplyModal = async (jobId: number) => {
        setShowApplyModal(true);
        setJob(null);
        setAnswers({});

        try {
            setLoading(true);
            const res = await Services.getFullJobPost(jobId);
            if (res.success) {
                setJob(res.data);
            } else {
                Alert.alert("Error", "Unable to load job details");
                setShowApplyModal(false);
            }
        } catch {
            Alert.alert("Error", "Failed to load job");
            setShowApplyModal(false);
        } finally {
            setLoading(false);
        }
    };
    const openCountryDropdown = async () => {
        setCountryDropdownOpen(true);
        setSkillsDropdownOpen(false);
        setStateDropdownOpen(false);

        // If already loaded, do nothing
        if (countryResults.length > 0) return;

        setCountrySearchLoading(true);
        try {
            const res = await Services.searchCountry(""); // empty search = all / default
            if (res.success) {
                setCountryResults(res.data || []);
            }
        } catch (e) {
            console.log("Country load error", e);
        } finally {
            setCountrySearchLoading(false);
        }
    };


    return (

        <>
            <ScrollView style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Latest Jobs</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.back}>Back</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#00007B" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={jobs}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderJobItem}
                        scrollEnabled={false} // important because wrapped in ScrollView
                        ListFooterComponent={
                            hasMore ? (
                                <TouchableOpacity
                                    style={styles.loadMoreBtn}
                                    onPress={() => fetchAllJobs(true)}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.loadMoreText}>Load More</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.noMoreText}>No more jobs</Text>
                            )
                        }
                    />


                )}
            </ScrollView>




            {/* APPLY FORM MODAL */}
            <Modal visible={showApplyModal} transparent animationType="fade" onRequestClose={() => setShowApplyModal(false)}>
                <TouchableWithoutFeedback onPress={closeAllDropdowns}>
                    <View style={styles.modalOverlay}>
                        {/* inner container should not close modal on press */}
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalContainer}>
                                <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                                    <Text style={styles.modalTitle}>Review your profile</Text>

                                    <Text style={styles.sectionHeader}>User Details</Text>

                                    {/* First + Last Name */}
                                    <View style={styles.row}>
                                        <TextInput
                                            placeholder="First Name"
                                            value={firstName}
                                            onChangeText={setFirstName}
                                            style={styles.input}
                                        />
                                        <TextInput
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChangeText={setLastName}
                                            style={[styles.input,]}
                                        />
                                    </View>

                                    {/* Email + Contact */}
                                    <View style={styles.row}>
                                        <TextInput
                                            placeholder="Email"
                                            keyboardType="email-address"
                                            value={email}
                                            onChangeText={setEmail}
                                            style={styles.input}
                                        />
                                        <TextInput
                                            placeholder="Contact No."
                                            keyboardType="phone-pad"
                                            value={contact}
                                            onChangeText={setContact}
                                            style={[styles.input,]}
                                        />
                                    </View>

                                    {/* Skills (inline dropdown multi-select) */}
                                    <Text style={styles.label}>Select your skills</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSkillsDropdownOpen(!skillsDropdownOpen);
                                            setCountryDropdownOpen(false);
                                            setStateDropdownOpen(false);
                                        }}

                                        style={[styles.input, styles.dropdownTrigger]}
                                    >
                                        <Text style={selectedSkills.length > 0 ? {} : { color: "#999" }}>
                                            {selectedSkills.length > 0 ? `${selectedSkills.length} selected` : "Choose skills"}
                                        </Text>
                                        <Text style={{ color: "#666" }}>{skillsDropdownOpen ? "▲" : "▼"}</Text>
                                    </TouchableOpacity>

                                    {skillsDropdownOpen && (
                                        <View style={styles.dropdownContainer}>
                                            <FlatList
                                                data={skillsList}
                                                keyExtractor={(i) => String(i.id)}
                                                renderItem={({ item }) => {
                                                    const active = selectedSkills.includes(item.id);
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => toggleSkill(item.id)}
                                                            style={styles.skillItem}
                                                        >
                                                            <Text>{item.name}</Text>
                                                            <View style={[
                                                                styles.checkbox,
                                                                active && styles.checkboxActive
                                                            ]}>
                                                                {active && <Text style={styles.checkmark}>✓</Text>}
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                                nestedScrollEnabled={true}
                                            />
                                        </View>
                                    )}

                                    <View style={{ height: 8 }} />

                                    <TextInput
                                        placeholder="Company Name"
                                        value={companyName}
                                        onChangeText={setCompanyName}
                                        style={styles.input}
                                    />

                                    {/* Country dropdown */}
                                    <Text style={styles.label}>Country</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            openCountryDropdown()
                                            // setCountryDropdownOpen(!countryDropdownOpen);
                                            // setSkillsDropdownOpen(false);
                                            // setStateDropdownOpen(false);
                                            setCountryResults(allCountries);
                                        }}
                                        style={[styles.input, styles.dropdownTrigger]}
                                    >
                                        <Text style={selectedCountry ? {} : { color: "#999" }}>
                                            {selectedCountry ? selectedCountry.name : "Select country"}
                                        </Text>
                                        <Text style={{ color: "#666" }}>{countryDropdownOpen ? "▲" : "▼"}</Text>
                                    </TouchableOpacity>

                                    {countryDropdownOpen && (
                                        <View style={styles.dropdownContainer}>
                                            <TextInput
                                                placeholder="Search country..."
                                                value={countryQuery}
                                                onChangeText={handleSearchCountry}
                                                style={styles.searchInput}
                                                autoFocus={true}
                                            />
                                            {countrySearchLoading ? (
                                                <View style={styles.loadingContainer}>
                                                    <ActivityIndicator size="small" color="#00007B" />
                                                    <Text style={styles.loadingText}>Searching...</Text>
                                                </View>
                                            ) : (
                                                <FlatList
                                                    data={countryResults}
                                                    renderItem={renderCountryItem}
                                                    keyExtractor={(i: CountryType) => String(i.id)}
                                                    nestedScrollEnabled={true}
                                                    ListEmptyComponent={
                                                        <Text style={styles.noResults}>
                                                            {countryQuery.length < 2 ? "Type at least 2 characters" : "No countries found"}
                                                        </Text>
                                                    }
                                                />
                                            )}
                                        </View>
                                    )}

                                    {/* State dropdown - only shown when country is selected */}
                                    {selectedCountry && (
                                        <>
                                            <Text style={styles.label}>State</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (selectedCountry?.states && selectedCountry.states.length > 0) {
                                                        setStateDropdownOpen(!stateDropdownOpen);
                                                        setStateResults(selectedCountry.states);
                                                        setSkillsDropdownOpen(false);
                                                        setCountryDropdownOpen(false);
                                                    }
                                                }}
                                                style={[styles.input, styles.dropdownTrigger, !selectedCountry?.states && styles.disabledInput]}
                                                disabled={!selectedCountry?.states}
                                            >
                                                <Text style={selectedState ? {} : { color: "#999" }}>
                                                    {selectedState || "Select state"}
                                                </Text>
                                                <Text style={{ color: "#666" }}>{stateDropdownOpen ? "▲" : "▼"}</Text>
                                            </TouchableOpacity>

                                            {stateDropdownOpen && selectedCountry?.states && (
                                                <View style={styles.dropdownContainer}>
                                                    <TextInput
                                                        placeholder="Search state..."
                                                        value={stateQuery}
                                                        onChangeText={handleSearchState}
                                                        style={styles.searchInput}
                                                        autoFocus={true}
                                                    />
                                                    <FlatList
                                                        data={stateQuery ? stateResults : selectedCountry.states}
                                                        renderItem={renderStateItem}
                                                        keyExtractor={(item, index) => `${item.name}-${index}`}
                                                        nestedScrollEnabled={true}
                                                        ListEmptyComponent={
                                                            <Text style={styles.noResults}>No states found</Text>
                                                        }
                                                    />
                                                </View>
                                            )}
                                        </>
                                    )}

                                    <TextInput
                                        placeholder="Location / City"
                                        value={locationCity}
                                        onChangeText={setLocationCity}
                                        style={styles.input}
                                    />

                                    {/* Upload CV */}
                                    <TouchableOpacity style={styles.cvBox} onPress={onPickCV}>
                                        <Text style={styles.cvText}>
                                            {cvFileName ? `CV: ${cvFileName}` : "📄 Upload CV (PDF only)"}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.warning}>Warning : Only Pdf File Allowed</Text>

                                    {/* Job Questions */}
                                    {job?.job_questions?.length > 0 && (
                                        <>
                                            <Text style={styles.sectionHeader}>Questions</Text>
                                            {job.job_questions.map((q: any, i: number) => (
                                                <View key={i} style={styles.questionContainer}>
                                                    <Text style={styles.questionText}>{i + 1}. {q.question}</Text>
                                                    <TextInput
                                                        placeholder="Your answer"
                                                        value={answers[i] || ""}
                                                        onChangeText={(t) => handleAnswerChange(i, t)}
                                                        style={styles.textArea}
                                                        multiline
                                                    />
                                                </View>
                                            ))}
                                        </>
                                    )}

                                    {/* Buttons */}
                                    <View style={styles.btnRow}>
                                        <TouchableOpacity
                                            onPress={handleSubmitApplication}
                                            disabled={submitting}
                                            style={[styles.btnYes, submitting && styles.btnDisabled]}
                                        >
                                            {submitting ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={styles.btnText}>Submit </Text>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setShowApplyModal(false)}
                                            style={styles.btnNo}
                                        >
                                            <Text style={styles.btnText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export default LatestJobsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: "#F4F6FF" },

    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },

    header: { fontSize: 18, fontWeight: "700", color: "#00007B" },

    back: { fontSize: 14, color: "#00007B", fontWeight: "600" },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 6,
        borderLeftColor: "#000078",
    },

    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

    title: { fontSize: 18, fontWeight: "700", color: "#000" },

    salary: { fontSize: 14, fontWeight: "600", color: "#000" },

    badge: {
        backgroundColor: "#D9FCE1",
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: 6,
    },
    badgeText: { color: "#008C3B", fontWeight: "600", fontSize: 12 },

    rowWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },

    meta: { fontSize: 14, color: "#555", marginRight: 12, marginTop: 4 },

    posted: { marginTop: 10, fontSize: 13, color: "#777" },

    sectionHeader: { marginTop: 15, fontSize: 16, fontWeight: "700", color: "#000" },

    shortText: {
        marginTop: 8,
        fontSize: 14,
        color: "#444",
        lineHeight: 20
    },

    skillsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },

    skillChip: {
        backgroundColor: "#E3E6F9",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },

    skillText: {
        fontSize: 13,
        color: "#00007B",
        fontWeight: "500",
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15
    },

    applyBtn: {
        backgroundColor: "#00007B",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },

    detailBtn: {
        backgroundColor: "#00007B",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
    },






    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 12,
    },
    applyBtnText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        maxHeight: "90%",
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
        color: "#00007B",
    },

    row: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fff",
    },

    disabledInput: {
        backgroundColor: "#f5f5f5",
        opacity: 0.7,
    },

    label: {
        marginTop: 6,
        marginBottom: 6,
        fontWeight: "700",
        color: "#333",
    },

    dropdownTrigger: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dropdownContainer: {
        maxHeight: 180,
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 12,
    },

    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },

    searchInput: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        padding: 12,
        borderRadius: 0,
        marginBottom: 0,
    },

    skillItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },

    checkboxActive: {
        backgroundColor: "#00007B",
        borderColor: "#00007B",
    },

    checkmark: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    loadingContainer: {
        padding: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },

    loadingText: {
        marginLeft: 8,
        color: "#666",
    },

    noResults: {
        padding: 16,
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
    },

    cvBox: {
        borderWidth: 1,
        borderColor: "#999",
        borderStyle: "dashed",
        padding: 18,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: "#f9f9f9",
    },

    cvText: {
        textAlign: "center",
        color: "#666",
    },

    warning: {
        color: "red",
        marginBottom: 10,
        fontSize: 12,
        textAlign: "center",
    },

    questionContainer: {
        marginBottom: 16,
    },

    questionText: {
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
        lineHeight: 20,
    },

    textArea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        textAlignVertical: "top",
        backgroundColor: "#fff",
    },

    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        gap: 12,
    },

    btnYes: {
        backgroundColor: "#00007B",
        padding: 16,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
    },

    btnNo: {
        backgroundColor: "#777",
        padding: 16,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
    },

    btnDisabled: {
        opacity: 0.7,
    },

    loadMoreBtn: {
        backgroundColor: "#00007B",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 20,
    },

    loadMoreText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    noMoreText: {
        textAlign: "center",
        color: "#777",
        marginVertical: 20,
    },

});
