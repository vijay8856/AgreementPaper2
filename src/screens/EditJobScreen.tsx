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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Dropdown from '../components/Dropdown';
import Services from '../Services/services';

// --- Types ---
type DropdownItem = {
  id?: number;
  name?: string;
  currency?: string;
};

const EditJobScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {jobId} = route.params;
  console.log('joid', jobId);

  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState<DropdownItem[]>([]);
  const [languages, setLanguages] = useState<DropdownItem[]>([]);
  const [currencies, setCurrencies] = useState<DropdownItem[]>([]);
  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [states, setStates] = useState<DropdownItem[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

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
    skill: '',
    language: '',
    jobType: '',
    currency: '',
    country: '',
    state: '',
  });

  // ---------------- LOAD INITIAL DATA ----------------
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [skillRes, langRes, currencyRes, countryRes, jobRes] =
        await Promise.all([
          Services.getSkillDropDownList({}),
          Services.getLanguagesList({}),
          Services.getCurrency(),
          Services.getCountryList({}),
          Services.getPostedJob({limit: 1, offset: 0, id: jobId}),
        ]);

      if (skillRes.success) setSkills(skillRes.data || []);
      if (langRes.success) setLanguages(langRes.data || []);
      if (currencyRes.success) setCurrencies(currencyRes.data || []);
      if (countryRes.success) setCountries(countryRes.data || []);

      const job = jobRes?.data?.results?.[0];
      if (job) prefillJob(job);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PREFILL DATA ----------------
  const prefillJob = async (job: any) => {
    setForm({
      jobTitle: job.title || '',
      experience: String(job.experience_level || ''),
      description: job.job_description || '',
      payRate: String(job.pay_rate || ''),
      city: job.company_city || '',
      companyName: job.company_name || '',
      companyWebsite: job.company_website || '',
      skill: job.skills?.[0] || '',
      language: job.language?.[0] || '',
      jobType: job.job_type || '',
      currency: job.currency_code || '',
      country: job.company_country_name || '',
      state: job.company_state || '',
    });

    setJobLocation(job.job_location_type?.toUpperCase());
    setJobVisibility(
      job.job_visibility === 1
        ? 'EVERYONE'
        : job.job_visibility === 2
        ? 'INVITED'
        : 'ONLY_ME',
    );

    setQuestions(job.job_questions?.map((q: any) => q.question) || []);

    // Load states for selected country
    const stateRes = await Services.getCountryDetailsState(
      job.company_country_name,
    );
    if (stateRes.success) setStates(stateRes.data || []);
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    if (!form.jobTitle) return 'Job title is required';
    if (!form.description) return 'Job description is required';
    if (!form.experience) return 'Experience is required';
    if (!form.skill) return 'Skill is required';
    if (!form.language) return 'Language is required';
    if (!form.jobType) return 'Job type is required';
    if (!form.payRate) return 'Pay rate is required';
    if (!form.currency) return 'Currency is required';
    if (!form.companyName) return 'Company name is required';
    if (!form.country || !form.state || !form.city)
      return 'Location is required';
    if (!jobLocation) return 'Job location type required';
    if (!jobVisibility) return 'Job visibility required';
    if (questions.filter(q => q.trim()).length === 0)
      return 'At least one question required';
    return null;
  };

  // ---------------- UPDATE JOB (PATCH) ----------------
  const submitJob = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    const payload = {
      id: jobId,
      title: form.jobTitle,
      job_description: form.description,
      skills: [form.skill],
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
    };
    console.log('payload', payload);

    try {
      const res = await Services.updatePostedJob(payload);
      if (res.success) {
        alert('✅ Job updated successfully');
        navigation.goBack();
      } else {
        console.log('err', res.error);

        alert(res.error || 'Failed to update job');
      }
    } catch {
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
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Job</Text>
            <Text style={styles.subtitle}>Update your job details</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Job Details</Text>
            <View style={styles.cardDivider} />

            <View style={styles.field}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={form.jobTitle}
                onChangeText={v => setForm({...form, jobTitle: v})}
              />
            </View>

            <Dropdown
              label="Primary Skill"
              value={form.skill}
              items={skills}
              labelKey="name"
              valueKey="id"
              onChange={(v: any) => setForm({...form, skill: v})}
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 8}}>
                <Text style={styles.label}>Experience (Years)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.experience}
                  onChangeText={v => setForm({...form, experience: v})}
                />
              </View>

              <View style={{flex: 1, marginLeft: 8}}>
                <Dropdown
                  label="Language"
                  value={form.language}
                  items={languages}
                  labelKey="name"
                  valueKey="id"
                  onChange={(v: any) => setForm({...form, language: v})}
                />
              </View>
            </View>

            <Text style={styles.label}>Job Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={form.description}
              onChangeText={v => setForm({...form, description: v})}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Compensation & Type</Text>
            <View style={styles.cardDivider} />

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
              onChange={(v: any) => setForm({...form, jobType: v})}
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 8}}>
                <Dropdown
                  label="Currency"
                  value={form.currency}
                  items={currencies}
                  labelKey="currency"
                  valueKey="currency"
                  onChange={(v: any) => setForm({...form, currency: v})}
                />
              </View>

              <View style={{flex: 1, marginLeft: 8}}>
                <Text style={styles.label}>Pay Rate</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.payRate}
                  onChangeText={v => setForm({...form, payRate: v})}
                />
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Screening Questions</Text>
            <View style={styles.cardDivider} />

            {questions.map((q, index) => (
              <View key={index} style={styles.questionRow}>
                <TextInput
                  style={styles.questionInput}
                  value={q}
                  onChangeText={text => {
                    const updated = [...questions];
                    updated[index] = text;
                    setQuestions(updated);
                  }}
                />
                {questions.length > 1 && (
                  <TouchableOpacity
                    onPress={() =>
                      setQuestions(questions.filter((_, i) => i !== index))
                    }>
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.addQuestionBtn}
              onPress={() => setQuestions(prev => [...prev, ''])}>
              <Text style={styles.addQuestionText}>+ Add Question</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Company & Location</Text>
            <View style={styles.cardDivider} />

            <TextInput
              style={styles.input}
              value={form.companyName}
              onChangeText={v => setForm({...form, companyName: v})}
            />

            <Dropdown
              label="Country"
              value={form.country}
              items={countries}
              labelKey="name"
              valueKey="name"
              onChange={async (v: any) => {
                setForm(prev => ({...prev, country: v, state: ''}));
                const res = await Services.getCountryDetailsState(v);
                if (res.success) setStates(res.data || []);
              }}
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 8}}>
                <Dropdown
                  label="State"
                  value={form.state}
                  items={states}
                  labelKey="name"
                  valueKey="name"
                  onChange={(v: any) => setForm({...form, state: v})}
                />
              </View>

              <View style={{flex: 1, marginLeft: 8}}>
                <TextInput
                  style={styles.input}
                  value={form.city}
                  onChangeText={v => setForm({...form, city: v})}
                />
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Work Arrangement</Text>
            <View style={styles.segment}>
              {['REMOTE', 'HYBRID', 'ONSITE'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.segmentItem,
                    jobLocation === opt && styles.segmentActive,
                  ]}
                  onPress={() => setJobLocation(opt as any)}>
                  <Text
                    style={[
                      styles.segmentText,
                      jobLocation === opt && styles.segmentTextActive,
                    ]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Job Visibility</Text>
            <View style={styles.segment}>
              {['EVERYONE', 'INVITED', 'ONLY_ME'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.segmentItem,
                    jobVisibility === opt && styles.segmentActive,
                  ]}
                  onPress={() => setJobVisibility(opt as any)}>
                  <Text
                    style={[
                      styles.segmentText,
                      jobVisibility === opt && styles.segmentTextActive,
                    ]}>
                    {opt.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submitJob}
            activeOpacity={0.8}>
            <Text style={styles.submitText}>Update Job</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditJobScreen;
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F8FAFC'},
  scroll: {paddingHorizontal: 20},
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

  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },

  field: {marginBottom: 18},

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a4a9b0ff',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  segment: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},

  segmentItem: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  segmentActive: {
    backgroundColor: '#0A2FFF',
    borderColor: '#0A2FFF',
  },

  segmentText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },

  segmentTextActive: {
    color: '#FFFFFF',
  },

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

  submitBtn: {
    backgroundColor: '#0E3386',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
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
});
