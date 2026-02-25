// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Dropdown from '../components/Dropdown';

import {SafeAreaView} from 'react-native-safe-area-context';
import Services from '../Services/services';
import {useNavigation} from '@react-navigation/native';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

// --- Types ---
type DropdownItem = {
  id?: string;
  name?: string;
  currency?: string;
};

const JobPostScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<DropdownItem[]>([]);
  const [languages, setLanguages] = useState<DropdownItem[]>([]);
  const [currencies, setCurrencies] = useState<DropdownItem[]>([]);
  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [states, setStates] = useState<DropdownItem[]>([]);
  const [questions, setQuestions] = useState<string[]>(['']);

  const [jobLocation, setJobLocation] = useState<
    'REMOTE' | 'HYBRID' | 'ONSITE' | ''
  >('');
  const [jobVisibility, setJobVisibility] = useState<
    'EVERYONE' | 'INVITED' | 'ONLY_ME' | ''
  >('');

  const [form, setForm] = useState({
    jobTitle: '',
    experience: '',
    description: '',
    payRate: '',
    city: '',
    companyName: '',
    companyWebsite: '',
    skills: [] as number[],
    language: '',
    jobType: '',
    currency: '',
    country: '',
    state: '',
  });
  const resetForm = () => {
    setForm({
      jobTitle: '',
      experience: '',
      description: '',
      payRate: '',
      city: '',
      companyName: '',
      companyWebsite: '',
      skills: [] as number[],

      language: '',
      jobType: '',
      currency: '',
      country: '',
      state: '',
    });

    setQuestions([]);
    setJobVisibility('EVERYONE');
    setJobLocation('REMOTE'); // or your default
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [skillRes, langRes, currencyRes, countryRes] = await Promise.all([
        Services.getSkillDropDownList({}),
        Services.getLanguagesList({}),
        Services.getCurrency(),
        Services.getCountryList({}),
      ]);

      if (skillRes.success) setSkills(skillRes.data || []);

    if (langRes.success) {
  const languageList = langRes.data || [];

  const sortedLanguages = [
    ...languageList.filter(
      (l) => l.name?.toLowerCase() === "english"
    ),
    ...languageList.filter(
      (l) => l.name?.toLowerCase() !== "english"
    ),
  ];

  setLanguages(sortedLanguages);
}

if (currencyRes.success) {
  const list = currencyRes.data || [];

  const finalCurrencies = [
    ...list.filter(
      i =>
        (i.currency === "INR" && i.country_name?.toLowerCase() === "india") ||
        (i.currency === "AUD" && i.country_name?.toLowerCase() === "australia")
    ),
    ...list.filter(
      i => !["INR", "AUD"].includes(i.currency)
    ),
  ];

  setCurrencies(finalCurrencies);
}


console.log("sorted currencies",currencies);

  if (countryRes.success) {
  const countryList = countryRes.data || [];

  const priorityCountries = ["India", "Australia"];

  const sortedCountries = [
    ...countryList.filter((c) => priorityCountries.includes(c.name)),
    ...countryList.filter((c) => !priorityCountries.includes(c.name)),
  ];

  setCountries(sortedCountries);
}

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onCountryChange = async (countryName: string) => {
    setForm(prev => ({...prev, country: countryName, state: ''}));
    setStates([]);
    const res = await Services.getCountryDetailsState(countryName);
    if (res.success) setStates(res.data || []);
  };
  const addQuestion = () => {
    setQuestions(prev => [...prev, '']);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (text: string, index: number) => {
    const updated = [...questions];
    updated[index] = text;
    setQuestions(updated);
  };

  const validateForm = () => {
    if (!form.jobTitle) return 'Job title is required';
    if (!form.description) return 'Job description is required';
    if (!form.experience) return 'Experience is required';
    if (!form.skills) return 'Skill is required';
    if (!form.language) return 'Language is required';
    if (!form.jobType) return 'Job type is required';
    if (!form.payRate) return 'Pay rate is required';
    if (!form.currency) return 'Currency is required';
    if (!form.companyName) return 'Company name is required';
    // if (!form.companyWebsite) return 'Company website is required';
    if (!form.country || !form.state || !form.city)
      return 'Location is required';
    if (!jobLocation) return 'Job location type required';
    if (!jobVisibility) return 'Job visibility required';
    const filledQuestions = questions.filter(q => q.trim());
    if (filledQuestions.length < 1)
      return 'Please add at least one screening question';

    return null;
  };

  const submitJob = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    const payload = {
      title: form.jobTitle,
      job_description: form.description,
      skills: form.skills,
      experience_level: Number(form.experience),
      language: [form.language],
      job_type: form.jobType,
      pay_rate: Number(form.payRate),
      currency_code: form.currency,
      company_name: form.companyName,
      company_website: form.companyWebsite || null,
      company_country: countries.find(c => c.name === form.country)?.id,
      company_state: form.state,
      company_city: form.city,
      job_visibility:
        jobVisibility === 'EVERYONE' ? 1 : jobVisibility === 'INVITED' ? 2 : 3,
      questions: questions.filter(q => q.trim()).map(q => ({question: q})),
      job_location_type:
        jobLocation.charAt(0) + jobLocation.slice(1).toLowerCase(),
      is_active: true,
    };
    console.log('form', payload);

    try {
      const res = await Services.jobPost(payload);

      if (res.success) {
        alert('✅ Job posted successfully');
        resetForm();
        navigation.goBack(); // ✅ go back
      } else {
        alert(res.error || 'Failed to post job');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0A2FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1 ,marginBottom:30}}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Post a Job</Text>
            <Text style={styles.subtitle}>
              Fill in the details to find your next hire
            </Text>
          </View>

          <Card title="Job Details">
            <Input
              label="Job Title"
              placeholder="e.g. Senior Product Designer"
              value={form.jobTitle}
              onChangeText={v => setForm({...form, jobTitle: v})}
            />
            {/* <Dropdown
              label="Primary Skill"
              value={form.skill}
              items={skills}
              labelKey="name"
              valueKey="id"
              onChange={(v: string) => setForm({ ...form, skill: v })}
            /> */}

            <MultiSelectDropdown
              label="Primary Skill"
              values={form.skills}
              items={skills}
              labelKey="name"
              valueKey="id"
              onChange={(selectedIds: number[]) =>
                setForm(prev => ({
                  ...prev,
                  skills: selectedIds, // ✅ already an array
                }))
              }
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 8}}>
                <Input
                  label="Experience"
                  placeholder="Years"
                  keyboardType="numeric"
                  value={form.experience}
                  onChangeText={v => setForm({...form, experience: v})}
                />
              </View>
              <View style={{flex: 1, marginLeft: 8}}>
                <Dropdown
                  label="Language"
                  placeholderTextColor={'black'}
                  value={form.language}
                  items={languages}
                  labelKey="name"
                  valueKey="id"
                  onChange={(v: string) => setForm({...form, language: v})}
                />
              </View>
            </View>
            <Input
              label="Job Description"
              multiline
              placeholder="Describe the role..."
              value={form.description}
              onChangeText={v => setForm({...form, description: v})}
              style={styles.textArea}
            />
          </Card>

          <Card title="Compensation & Type">
            <Dropdown
              label="Job Type"
              value={form.jobType}
              items={[
                {label: 'Full Time', value: 1},
                {label: 'Part Time', value: 2},
                {label: 'Contract', value: 3},
              ]}
              labelKey="label"
              valueKey="value"
              onChange={v => setForm({...form, jobType: v})}
            />
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 8}}>
                <Dropdown
                  label="Currency"
                  value={form.currency}
                  items={currencies}
                  labelKey="currency"
                  valueKey="currency"
                  onChange={(v: string) => setForm({...form, currency: v})}
                />
              </View>
              <View style={{flex: 1, marginLeft: 8}}>
                <Input
                  label="Pay Rate / Per Day "
                  placeholder="Amt as PerDay"
                  keyboardType="numeric"
                  value={form.payRate}
                  onChangeText={v => setForm({...form, payRate: v})}
                />
              </View>
            </View>
          </Card>
          <Card title="Screening Questions">
            <Text style={{color: '#ced3daff', marginBottom: 12}}>
              Ask at least one question to filter candidates
            </Text>

            {questions.map((q, index) => (
              <View key={index} style={styles.questionRow}>
                <TextInput
                  style={styles.questionInput}
                  placeholder={`Question ${index + 1}`}
                  placeholderTextColor="#94A3B8"
                  value={q}
                  onChangeText={text => updateQuestion(text, index)}
                />

                {questions.length > 1 && (
                  <TouchableOpacity onPress={() => removeQuestion(index)}>
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.addQuestionBtn}
              onPress={addQuestion}>
              <Text style={styles.addQuestionText}>+ Add Question</Text>
            </TouchableOpacity>
          </Card>

          <Card title="Company & Location">
            <Input
              label="Company Name"
              placeholder="Your company name"
              value={form.companyName}
              onChangeText={v => setForm({...form, companyName: v})}
            />
            <Dropdown
              label="Country"
              value={form.country}
              items={countries}
              labelKey="name"
              valueKey="name"
              onChange={onCountryChange}
            />
            <Input
              label="Company Website (Optional)"
              placeholder="https://example.com"
              value={form.companyWebsite}
              onChangeText={v => setForm({...form, companyWebsite: v})}
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 8}}>
                <Dropdown
                  label="State"
                  value={form.state}
                  items={states}
                  labelKey="name"
                  valueKey="name"
                  disabled={!states.length}
                  onChange={(v: string) => setForm({...form, state: v})}
                />
              </View>
              <View style={{flex: 1, marginLeft: 8}}>
                <Input
                  label="City"
                  placeholder="City"
                  value={form.city}
                  onChangeText={v => setForm({...form, city: v})}
                />
              </View>
            </View>
          </Card>

          <Card title="Work Arrangement">
            <Segment
              options={['REMOTE', 'HYBRID', 'ONSITE']}
              value={jobLocation}
              onChange={setJobLocation}
            />
          </Card>

          <Card title="Job Visibility">
            <Segment
              options={['EVERYONE', 'INVITED', 'ONLY_ME']}
              value={jobVisibility}
              onChange={setJobVisibility}
            />
          </Card>

          <View style={{height: 120}} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submitJob}
            activeOpacity={0.8}>
            <Text style={styles.submitText}>Post Job — 60 Days Free</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Custom Components ---

const Card = ({title, children}: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardDivider} />
    {children}
  </View>
);

const Input = ({label, style, ...props}: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#94A3B8"
      {...props}
    />
  </View>
);

const Segment = ({options, value, onChange}: any) => (
  <View style={styles.segment}>
    {options.map((opt: string) => (
      <TouchableOpacity
        key={opt}
        style={[styles.segmentItem, value === opt && styles.segmentActive]}
        onPress={() => onChange(opt)}>
        <Text
          style={[
            styles.segmentText,
            value === opt && styles.segmentTextActive,
          ]}>
          {opt.replace('_', ' ')}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F8FAFC'},
  scroll: {paddingHorizontal: 20, paddingTop: 10},
  header: {marginBottom: 24},
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {fontSize: 15, color: '#64748B', marginTop: 4},

  row: {flexDirection: 'row', justifyContent: 'space-between'},

  card: {
    backgroundColor: '#0E3386',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {elevation: 3},
    }),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ced3daff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardDivider: {height: 1, backgroundColor: '#F1F5F9', marginBottom: 16},

  field: {marginBottom: 18},
  label: {fontSize: 14, fontWeight: '600', color: '#a4a9b0ff', marginBottom: 8},
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  textArea: {height: 120, textAlignVertical: 'top', paddingTop: 14},

  pickerBox: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  disabledBox: {opacity: 0.5, backgroundColor: '#F1F5F9'},

  segment: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  segmentItem: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  segmentActive: {backgroundColor: '#0A2FFF', borderColor: '#0A2FFF'},
  segmentText: {color: '#64748B', fontWeight: '600', fontSize: 13},
  segmentTextActive: {color: '#FFFFFF'},

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: {elevation: 10},
    }),
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  questionInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
  },

  deleteIcon: {
    fontSize: 18,
    color: '#EF4444',
    marginLeft: 10,
  },

  addQuestionBtn: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },

  addQuestionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  submitBtn: {
    backgroundColor: '#0E3386',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitText: {color: '#FFFFFF', fontSize: 17, fontWeight: '700'},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default JobPostScreen;
