// JobDetailScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import Services from '../Services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

type CountryType = {
  id: number;
  name: string;
  states?: {name: string}[];
  [k: string]: any;
};

type SkillType = {
  id: number | string;
  name: string;
};

const JobDetailScreen = ({route, navigation}: any) => {
  const {jobId} = route.params;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  // Modal + form
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Skills & country/state data
  const [skillsList, setSkillsList] = useState<SkillType[]>([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<(string | number)[]>([]);

  // Country dropdown
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const [countrySearchLoading, setCountrySearchLoading] = useState(false);
  const [countryResults, setCountryResults] = useState<CountryType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null,
  );

  // State dropdown

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState('');
  const [stateResults, setStateResults] = useState<{name: string}[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  // dynamic question answers
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  useEffect(() => {
    fetchFullJobDetails();
    fetchSkills();
    fetchUserData();
  }, []);

  const fetchFullJobDetails = async () => {
    setLoading(true);
    try {
      const response = await Services.getFullJobPost(jobId);
      if (response.success) {
        setJob(response.data);
      } else {
        Alert.alert('Error', 'Unable to load job details');
      }
    } catch (error) {
      console.error('getFullJobPost error:', error);
      Alert.alert('Error', 'Something went wrong while loading job');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await Services.getSkillDropDownList({});
      if (res.success) {
        setSkillsList(res.data || []);
      } else {
        console.warn('Skills fetch returned failure', res);
      }
    } catch (err) {
      console.warn('Error fetching skills', err);
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

  // Country search (automatic on typing)
  const handleSearchCountry = async (query: string) => {
    setCountryQuery(query);

    if (!query || query.trim().length < 2) {
      setCountryResults([]);
      setCountryDropdownOpen(false);
      return;
    }

    setCountrySearchLoading(true);
    try {
      const res = await Services.searchCountry(query.trim());
      if (res.success) {
        setCountryResults(res.data || []);
        setCountryDropdownOpen(true);
      } else {
        setCountryResults([]);
      }
    } catch (err) {
      console.error('searchCountry error', err);
      setCountryResults([]);
    } finally {
      setCountrySearchLoading(false);
    }
  };

  // State search/filter
  const handleSearchState = (query: string) => {
    setStateQuery(query);

    if (!selectedCountry || !selectedCountry.states) {
      setStateResults([]);
      return;
    }

    const filteredStates = selectedCountry.states.filter(state =>
      state.name.toLowerCase().includes(query.toLowerCase()),
    );
    setStateResults(filteredStates);
  };

  const toggleSkill = (id: number | string) => {
    setSelectedSkills(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      return [...prev, id];
    });
  };

  const onPickCV = async () => {
    // Optional: DocumentPicker integration.
    // Keep placeholder for now.
    Alert.alert(
      'Upload CV',
      'CV upload is optional — integrate DocumentPicker for file upload.',
    );
  };

  const handleAnswerChange = (index: number, text: string) => {
    setAnswers(prev => ({...prev, [index]: text}));
  };

  const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  const handleSubmitApplication = async () => {
    // Basic validations
    if (!firstName.trim())
      return Alert.alert('Validation', 'Please enter first name');
    if (!lastName.trim())
      return Alert.alert('Validation', 'Please enter last name');
    if (!email.trim() || !validateEmail(email))
      return Alert.alert('Validation', 'Please enter valid email');
    if (!contact.trim())
      return Alert.alert('Validation', 'Please enter contact number');
    if (!selectedCountry)
      return Alert.alert('Validation', 'Please select a country');
    if (!selectedState)
      return Alert.alert('Validation', 'Please select a state');
    if (!locationCity.trim())
      return Alert.alert('Validation', 'Please enter location/city');

    // Prepare question answers
    const jobQuestions = job?.job_questions || [];
    const job_application_answers = jobQuestions.map((q: any, idx: number) => ({
      question: q.question,
      answer: answers[idx] || '',
    }));

    const payload = {
      job_application_answers,
      job: String(jobId),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      contact: contact.trim(),
      company_name: companyName.trim(),
      skills: selectedSkills.map(s => String(s)),
      location: locationCity.trim(),
      state: selectedState,
      country: String(selectedCountry.id),
      // cv: if you upload and server expects file/url
    };

    setSubmitting(true);
    try {
      const res = await Services.createJobApplication(payload);
      if (res.success) {
        Alert.alert('Success', 'Application submitted successfully');
        fetchDashboardData();

        setShowApplyModal(false);
        // reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setContact('');
        setCompanyName('');
        setSelectedCountry(null);
        setSelectedState(null);
        setLocationCity('');
        setSelectedSkills([]);
        setAnswers({});
        setCvFileName(null);
      } else {
        console.error('createJobApplication response', res);
        Alert.alert('Error', res.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('createJobApplication error:', err);
      Alert.alert('Error', 'Something went wrong while submitting');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const response = await Services.getResourceDashboard();
      console.log('Dashboard API Response:', response);

      if (response.success) {
        // setDashboardData(response.data.payload);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error || 'Failed to fetch dashboard data',
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong while loading dashboard',
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  // Helper to show country states list for selection
  const renderCountryItem = ({item}: {item: CountryType}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedCountry(item);
        setSelectedState(null);
        setStateQuery('');
        setStateResults([]);
        setCountryQuery(item.name);
        setCountryDropdownOpen(false);
      }}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  // Helper to show state list for selection
  const renderStateItem = ({item}: {item: {name: string}}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedState(item.name);
        setStateQuery(item.name);
        setStateDropdownOpen(false);
      }}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setSkillsDropdownOpen(false);
    setCountryDropdownOpen(false);
    setStateDropdownOpen(false);
    Keyboard.dismiss();
  };

  if (loading || !job) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00007B" />
        <Text style={{marginTop: 10, color: '#00007B'}}>
          Loading Job Details...
        </Text>
      </View>
    );
  }

  const {
    title,
    job_description,
    pay_rate,
    company_name,
    company_city,
    company_state,
    job_location_type,
    job_type_value,
    skills_data,
    created_at,
  } = job;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Job Details</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* JOB TITLE */}
        <Text style={styles.title}>{title}</Text>

        {/* Salary */}
        {pay_rate ? (
          <Text style={styles.salary}>INR {pay_rate}/day</Text>
        ) : null}

        {/* BADGE */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{job_type_value}</Text>
        </View>

        {/* META INFO */}
        <Text style={styles.meta}>🏢 {company_name}</Text>
        <Text style={styles.meta}>
          📍 {company_city}, {company_state}
        </Text>
        <Text style={styles.meta}>💼 {job_location_type}</Text>

        <Text style={styles.posted}>
          Posted on:{' '}
          {new Date(created_at).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>

        {/* FULL DESCRIPTION */}
        <Text style={styles.sectionHeader}>Job Description</Text>

        <RenderHtml
          contentWidth={width - 40}
          source={{html: job_description || '<p>No description</p>'}}
          tagsStyles={{
            p: {fontSize: 15, lineHeight: 22, color: '#333'},
            li: {fontSize: 15, lineHeight: 22, color: '#333'},
            span: {color: '#333'},
          }}
        />

        {/* SKILLS (display only from job) */}
        <Text style={styles.sectionHeader}>Skills</Text>
        <View style={styles.skillContainer}>
          {skills_data?.map((skill: any) => (
            <View key={skill.id} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill.name}</Text>
            </View>
          ))}
        </View>

        {/* APPLY BUTTON */}
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => setShowApplyModal(true)}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* APPLY FORM MODAL */}
      <Modal
        visible={showApplyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowApplyModal(false)}>
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <View style={styles.modalOverlay}>
            {/* inner container should not close modal on press */}
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}>
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
                      style={[styles.input]}
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
                      style={[styles.input]}
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
                    style={[styles.input, styles.dropdownTrigger]}>
                    <Text
                      style={selectedSkills.length > 0 ? {} : {color: '#999'}}>
                      {selectedSkills.length > 0
                        ? `${selectedSkills.length} selected`
                        : 'Choose skills'}
                    </Text>
                    <Text style={{color: '#666'}}>
                      {skillsDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {skillsDropdownOpen && (
                    <View style={styles.dropdownContainer}>
                      <FlatList
                        data={skillsList}
                        keyExtractor={i => String(i.id)}
                        renderItem={({item}) => {
                          const active = selectedSkills.includes(item.id);
                          return (
                            <TouchableOpacity
                              onPress={() => toggleSkill(item.id)}
                              style={styles.skillItem}>
                              <Text>{item.name}</Text>
                              <View
                                style={[
                                  styles.checkbox,
                                  active && styles.checkboxActive,
                                ]}>
                                {active && (
                                  <Text style={styles.checkmark}>✓</Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                        nestedScrollEnabled={true}
                      />
                    </View>
                  )}

                  <View style={{height: 8}} />

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
                      setCountryDropdownOpen(!countryDropdownOpen);
                      setSkillsDropdownOpen(false);
                      setStateDropdownOpen(false);
                    }}
                    style={[styles.input, styles.dropdownTrigger]}>
                    <Text style={selectedCountry ? {} : {color: '#999'}}>
                      {selectedCountry
                        ? selectedCountry.name
                        : 'Select country'}
                    </Text>
                    <Text style={{color: '#666'}}>
                      {countryDropdownOpen ? '▲' : '▼'}
                    </Text>
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
                              {countryQuery.length < 2
                                ? 'Type at least 2 characters'
                                : 'No countries found'}
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
                          if (
                            selectedCountry?.states &&
                            selectedCountry.states.length > 0
                          ) {
                            setStateDropdownOpen(!stateDropdownOpen);
                            setStateResults(selectedCountry.states);
                            setSkillsDropdownOpen(false);
                            setCountryDropdownOpen(false);
                          }
                        }}
                        style={[
                          styles.input,
                          styles.dropdownTrigger,
                          !selectedCountry?.states && styles.disabledInput,
                        ]}
                        disabled={!selectedCountry?.states}>
                        <Text style={selectedState ? {} : {color: '#999'}}>
                          {selectedState || 'Select state'}
                        </Text>
                        <Text style={{color: '#666'}}>
                          {stateDropdownOpen ? '▲' : '▼'}
                        </Text>
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
                            data={
                              stateQuery ? stateResults : selectedCountry.states
                            }
                            renderItem={renderStateItem}
                            keyExtractor={(item, index) =>
                              `${item.name}-${index}`
                            }
                            nestedScrollEnabled={true}
                            ListEmptyComponent={
                              <Text style={styles.noResults}>
                                No states found
                              </Text>
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
                      {cvFileName
                        ? `CV: ${cvFileName}`
                        : '📄 Upload CV (PDF only)'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.warning}>
                    Warning : Only Pdf File Allowed
                  </Text>

                  {/* Job Questions */}
                  {job?.job_questions?.length > 0 && (
                    <>
                      <Text style={styles.sectionHeader}>Questions</Text>
                      {job.job_questions.map((q: any, i: number) => (
                        <View key={i} style={styles.questionContainer}>
                          <Text style={styles.questionText}>
                            {i + 1}. {q.question}
                          </Text>
                          <TextInput
                            placeholder="Your answer"
                            value={answers[i] || ''}
                            onChangeText={t => handleAnswerChange(i, t)}
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
                      style={[styles.btnYes, submitting && styles.btnDisabled]}>
                      {submitting ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.btnText}>Submit </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowApplyModal(false)}
                      style={styles.btnNo}>
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

export default JobDetailScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#F4F6FF',
    paddingBottom: 40,
  },

  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00007B',
  },

  backBtn: {
    fontSize: 14,
    color: '#00007B',
    fontWeight: '600',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },

  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  badge: {
    backgroundColor: '#D9FCE1',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: {
    color: '#008C3B',
    fontWeight: '600',
    fontSize: 13,
  },

  meta: {
    fontSize: 15,
    color: '#555',
    marginTop: 6,
  },

  posted: {
    marginTop: 10,
    fontSize: 13,
    color: '#777',
  },

  sectionHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },

  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  skillChip: {
    backgroundColor: '#E3E6F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },

  skillText: {
    fontSize: 13,
    color: '#00007B',
    fontWeight: '500',
  },

  applyBtn: {
    backgroundColor: '#00007B',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },

  applyBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 12,
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '90%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#00007B',
  },

  row: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  disabledInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },

  label: {
    marginTop: 6,
    marginBottom: 6,
    fontWeight: '700',
    color: '#333',
  },

  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownContainer: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
    borderRadius: 0,
    marginBottom: 0,
  },

  skillItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  checkboxActive: {
    backgroundColor: '#00007B',
    borderColor: '#00007B',
  },

  checkmark: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  loadingText: {
    marginLeft: 8,
    color: '#666',
  },

  noResults: {
    padding: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },

  cvBox: {
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'dashed',
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
  },

  cvText: {
    textAlign: 'center',
    color: '#666',
  },

  warning: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
    textAlign: 'center',
  },

  questionContainer: {
    marginBottom: 16,
  },

  questionText: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    lineHeight: 20,
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },

  btnYes: {
    backgroundColor: '#00007B',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },

  btnNo: {
    backgroundColor: '#777',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },

  btnDisabled: {
    opacity: 0.7,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});
