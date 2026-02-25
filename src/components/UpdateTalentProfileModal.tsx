// ============================================================
//  UpdateTalentProfileModal.tsx
// ============================================================
import React, {useEffect, useState} from 'react';
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
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Services from '../Services/services';
import Toast from 'react-native-toast-message';

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
  id: number;
  name: string;
}

interface SkillItem {
  id: number;
  name: string;
}
type ActiveDropdown = 'skills' | 'country' | 'state' | null;

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  const [district, setDistrict] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');

  const [experience, setExperience] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const [skills, setSkills] = useState<SkillItem[]>([]);

  const [resumeFile, setResumeFile] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<any>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]); // ids only

  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [country, setCountry] = useState<{id: number; name: string} | null>(
    null,
  );
  const [state, setState] = useState<{id: number; name: string} | null>(null);
  const [companyName, setCompanyName] = useState('');

  console.log('pinCode', pinCode);

  // -------------------------------------------------------------
  // LOAD DROPDOWNS
  // -------------------------------------------------------------
  useEffect(() => {
    if (visible) {
      loadCountries();
      loadSkills();
      setLoading(false);
    }
  }, [visible]);
  useEffect(() => {
    if (!profile) return;

    setCountry({
      id: profile.country_id,
      name: profile.country_name,
    });

    setState({
      id: profile.state_id,
      name: profile.state_name,
    });

    setSelectedSkills(profile.skills?.map((s: any) => s.id) || []);
  }, [profile]);

  useEffect(() => {
    if (!visible || !profile) return;
    console.log('profiles', profile);

    setOriginalProfile(profile);

    setFirstName(profile.user_detail.first_name || '');
    setLastName(profile.user_detail.last_name || '');
    setContactNumber(profile.user_detail.contact_number || '');
    setEmail(profile.user_detail.email || '');

    setCountry(
      profile.country_id
        ? {id: profile.country_id, name: profile.country_name}
        : null,
    );

    setState(
      profile.state_id
        ? {id: profile.state_id, name: profile.state_name}
        : null,
    );

    setDistrict(profile.district || '');
    setPinCode(
      profile?.pin_code !== null && profile?.pin_code !== undefined
        ? String(profile.pin_code)
        : '',
    );

    setAddress(profile.address || '');
    setAbout(profile.about || '');

    setExperience(profile.total_experience || '');
    setJobTitle(profile.current_job_title || '');

    setSelectedSkills(profile.skills?.map((s: any) => s.id) || []);
  }, [visible, profile]);

  const isChanged = (key: string, value: any) => {
    if (!originalProfile) return false;

    if (['first_name', 'last_name', 'contact_number', 'email'].includes(key)) {
      return originalProfile.user_detail?.[key] !== value;
    }

    if (key === 'pin_code') {
      return String(originalProfile.pin_code || '') !== String(value || '');
    }

    return String(originalProfile?.[key] || '') !== String(value || '');
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

  const handleCountrySelect = async (item: {id: number; name: string}) => {
    setCountry(item);
    setState(null);
    setStates([]);

    const res = await Services.getCountryDetailsState(item.name);
    console.log('loggg', res);

    if (res?.success) setStates(res.data);
  };
  // useEffect(() => {
  //   if (!profile?.country_id) return;

  //   (async () => {
  //     const res = await Services.getCountryDetailsState(profile.country_id);
  //     if (res?.success) {
  //       setStates(res.data);
  //     }
  //   })();
  // }, [profile?.country_id]);

  const handleStateSelect = (item: {id: number; name: string}) => {
    setState(item);
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
    } catch (e) {}
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
      name: 'profile.jpg',
    });
  };
  const resolveValue = (key: string, current: any, original: any) => {
    if (current === undefined || current === null || current === '') {
      return original ?? '';
    }
    return current;
  };

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  const updateBasicProfile = async (): Promise<boolean> => {
    const payload: any = {};

    if (isChanged('first_name', firstName)) payload.first_name = firstName;
    if (isChanged('last_name', lastName)) payload.last_name = lastName;
    if (isChanged('contact_number', contactNumber))
      payload.contact_number = contactNumber;
    if (isChanged('email', email)) payload.email = email;

    if (Object.keys(payload).length === 0) {
      return true; // nothing to update → treat as success
    }

    const res = await Services.updateUserProfileDetails(payload);
    return res?.success === true;
  };

  const updateTalentProfile = async (): Promise<boolean> => {
    if (!originalProfile) return false;

    const fd = new FormData();
    console.log('fd', fd);

    // 📍 ADDRESS INFO
    fd.append(
      'address',
      resolveValue('address', address, originalProfile.address),
    );
    // fd.append("country", String(country?.id));
    fd.append('state', String(state?.name));

    fd.append(
      'district',
      resolveValue('district', district, originalProfile.district),
    );
    fd.append(
      'pin_code',
      resolveValue('pin_code', pinCode, originalProfile.pin_code),
    );

    // 📍 PROFILE INFO
    fd.append(
      'current_job_title',
      resolveValue(
        'current_job_title',
        jobTitle,
        originalProfile.current_job_title,
      ),
    );

    fd.append('about', resolveValue('about', about, originalProfile.about));

    fd.append(
      'total_experience',
      resolveValue(
        'total_experience',
        experience,
        originalProfile.total_experience,
      ),
    );

    // // 📍 SKILLS (always send)
    // const skillsToSend =
    //   selectedSkills.length > 0
    //     ? selectedSkills
    //     : originalProfile.skills?.map((s: any) => s.id) || [];

    // skillsToSend.forEach((id: number) => {
    //   fd.append("skill_set", id.toString());
    // });
    selectedSkills.forEach(id => {
      fd.append('skill_set', String(id));
    });

    // 📍 COMPANY
    fd.append(
      'company_name',
      resolveValue('company_name', companyName, originalProfile.company_name),
    );
    // 📍 AVAILABILITY
    fd.append('is_available', String(originalProfile.is_available ?? true));

    // 📍 TAX INFO
    fd.append('tax_setting', String(originalProfile.tax_setting ?? 1));

    fd.append(
      'tax_number',
      resolveValue(
        'tax_number',
        originalProfile.tax_number,
        originalProfile.tax_number,
      ),
    );

    fd.append('currency', String(originalProfile.currency ?? 1));

    // 📄 FILES (ONLY if changed)
    if (profilePic) {
      fd.append('profile_pic', profilePic);
    }

    if (resumeFile) {
      fd.append('cv', resumeFile);
    }

    const res = await Services.updateTalentUserProfile(fd);
    return res?.success === true;
  };

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  const handleSubmit = async () => {
    if (loading) return; // prevent double submit

    setLoading(true);

    let basicSuccess = false;
    let talentSuccess = false;

    try {
      basicSuccess = await updateBasicProfile();
    } catch (e) {
      console.log('Basic update error', e);
    }

    try {
      talentSuccess = await updateTalentProfile();
    } catch (e) {
      console.log('Talent update error', e);
    }

    setLoading(false);

    if (basicSuccess || talentSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
      onSuccess();
      onClose();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
      });
    }
  };

  const renderCountry = () => (
    <ScrollView>
      {countries.map((c: any) => (
        <TouchableOpacity
          key={c.id}
          onPress={() => {
            handleCountrySelect({id: c.id, name: c.name});
            setActiveDropdown(null);
          }}>
          <Text>{c.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderState = () => (
    <ScrollView>
      {states.map(s => (
        <TouchableOpacity
          key={s.id}
          style={styles.item}
          onPress={() => {
            handleStateSelect({id: s.id, name: s.name});
            setActiveDropdown(null);
          }}>
          <Text>{s.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSkills = () => (
    <>
      <ScrollView>
        {skills.map(skill => {
          const selected = selectedSkills.includes(skill.id);
          return (
            <TouchableOpacity
              key={skill.id}
              style={styles.dropdownItem}
              onPress={() =>
                selected
                  ? setSelectedSkills(
                      selectedSkills.filter(id => id !== skill.id),
                    )
                  : setSelectedSkills([...selectedSkills, skill.id])
              }>
              <Text style={{color: selected ? '#007bff' : '#333'}}>
                {selected ? '✓ ' : ''}
                {skill.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => setActiveDropdown(null)}>
        <Text style={styles.submitText}>Done</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.heading}>Update Talent Profile</Text>

              <TouchableOpacity
                onPress={pickProfileImage}
                style={styles.picContainer}>
                {profilePic ? (
                  <Image
                    source={{uri: profilePic.uri}}
                    style={styles.profilePic}
                  />
                ) : (
                  <Text>Upload Profile Picture</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.label}>First Name</Text>

              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={'black'}
                value={firstName}
                onChangeText={setFirstName}
              />
              <Text style={styles.label}>Last Name</Text>

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={'black'}
                value={lastName}
                onChangeText={setLastName}
              />
              <Text style={styles.label}>Contact Number</Text>

              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                placeholderTextColor={'black'}
                value={contactNumber}
                onChangeText={setContactNumber}
              />
              <Text style={styles.label}>Email</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'black'}
                value={email}
                onChangeText={setEmail}
              />
              <Text style={styles.label}>Experince</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Experince"
                placeholderTextColor={'black'}
                value={experience}
                onChangeText={setExperience}
              />

              <Text style={styles.label}>Country</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setActiveDropdown('country')}>
                <Text>{country?.name || 'Select Country'}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>State</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => states.length && setActiveDropdown('state')}>
                <Text>{state?.name || 'Select State'}</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="District"
                placeholderTextColor={'black'}
                value={district}
                onChangeText={setDistrict}
              />
              <TextInput
                style={styles.input}
                placeholder="Pin Code"
                placeholderTextColor={'black'}
                value={pinCode}
                onChangeText={setPinCode}
              />

              {/* SKILLS DROPDOWN */}
              <Text style={styles.label}>Select Skills</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setActiveDropdown('skills')}>
                <Text>
                  {selectedSkills.length
                    ? `${selectedSkills.length} skills selected`
                    : 'Select Skills'}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={[styles.input, {height: 90}]}
                placeholder="About"
                placeholderTextColor={'black'}
                multiline
                value={about}
                onChangeText={setAbout}
              />

              <TouchableOpacity style={styles.pdfButton} onPress={pickResume}>
                <Text style={{color: '#fff'}}>
                  {resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Update Profile</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
            {activeDropdown && (
              <View style={styles.inlineOverlay}>
                <TouchableOpacity
                  style={styles.overlayTouch}
                  activeOpacity={1}
                  onPress={() => setActiveDropdown(null)}>
                  <View style={styles.dropdownModal}>
                    {activeDropdown === 'country' && renderCountry()}
                    {activeDropdown === 'state' && renderState()}
                    {activeDropdown === 'skills' && renderSkills()}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
      {/* 

 


s
{/* INLINE DROPDOWNS */}
      {/* {activeDropdown && (
  <View style={styles.inlineOverlay}>
    <TouchableOpacity
      style={styles.overlayTouch}
      activeOpacity={1}
      onPress={() => setActiveDropdown(null)}
    >
      <View style={styles.dropdownModal}>
        {activeDropdown === 'country' && (
          <ScrollView>
            {countries.map(c => (
              <TouchableOpacity
                key={c.name}
                style={styles.item}
                onPress={() => {
                  handleCountrySelect(c.name);
                  setActiveDropdown(null);
                }}
              >
                <Text>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {activeDropdown === 'state' && (
          <ScrollView>
            {states.map(s => (
              <TouchableOpacity
                key={s.name}
                style={styles.item}
                onPress={() => {
                  setState(s.name);
                  setActiveDropdown(null);
                }}
              >
                <Text>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {activeDropdown === 'skills' && (
          <>
            <ScrollView>
              {skills.map(skill => {
                const selected = selectedSkills.includes(skill.id);
                return (
                  <TouchableOpacity
                    key={skill.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      selected
                        ? setSelectedSkills(
                            selectedSkills.filter(id => id !== skill.id)
                          )
                        : setSelectedSkills([...selectedSkills, skill.id]);
                    }}
                  >
                    <Text style={{ color: selected ? '#007bff' : '#333' }}>
                      {selected ? '✓ ' : ''}
                      {skill.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => setActiveDropdown(null)}
            >
              <Text style={styles.submitText}>Done</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  </View>
)} */}
    </>
  );
};

// -------------------------------------------------------------
// STYLES
// -------------------------------------------------------------
const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  label: {fontWeight: '600', marginBottom: 6},
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pdfButton: {
    backgroundColor: '#0E46A3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  submitText: {color: '#fff', fontWeight: '600'},
  closeText: {color: 'red', textAlign: 'center', marginTop: 15},
  picContainer: {alignItems: 'center', marginBottom: 16},
  profilePic: {width: 90, height: 90, borderRadius: 50},
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  list: {backgroundColor: '#fff', borderRadius: 10, maxHeight: '60%'},
  item: {padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee'},
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },

  dropdownBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  overlayTouch: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdownModal: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
});

export default UpdateTalentProfileModal;
