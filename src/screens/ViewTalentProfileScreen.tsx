import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Services from "../Services/services";

// 👉 Import YOUR custom Header component (NOT react-navigation one)
import AppHeader from "../components/AppHeader";
import UpdateTalentProfileModal from "../components/UpdateTalentProfileModal";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------
interface IUserDetail {
  email: string;
  first_name: string;
  last_name: string;
  profile_pic: string | null;
  contact_number: string;
  last_login: string;
  date_joined: string;
  role: number;
}

interface ISkill {
  id: number;
  name: string;
}

interface ICurrencyDetail {
  id: number;
  country: string;
  currency: string;
}

interface IPrivacy {
  show_contact_number: boolean;
  show_email: boolean;
  show_city: boolean;
}

interface IProfileResponse {
  id: number;
  user: number;
  user_detail: IUserDetail;
  address: string;
  country_name: string;
  state_name: string;
  district: string;
  pin_code: number;
  about: string;
  skill_set_data: ISkill[];
  currency_detail: ICurrencyDetail;
  is_available: boolean;
  slug: string;
  total_experience: string;
  average_rating: string;
}

const ViewTalentProfileScreen = ({ navigation }: any) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [profile, setProfile] = useState<IProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // -------------------------------------------------------------
  // 1️⃣ LOAD SLUG FROM STORAGE
  // -------------------------------------------------------------
  useEffect(() => {
    console.log("hello");

    const loadUser = async () => {
      console.log("hello1");

      try {
        console.log("hello2");

        const storedUser = await AsyncStorage.getItem('slug');
        console.log("hello2");

        // if (!data) return;
        console.log("hello3", storedUser);

        // const parsed = JSON.parse(storedUser);
        setSlug(storedUser);
        console.log("📌 Loaded Slug From AsyncStorage:", storedUser);

      } catch (e) {
        console.log("Async error:", e);
      }
    };
    loadUser();
  }, []);

  // -------------------------------------------------------------
  // 2️⃣ FETCH PROFILE WHEN SCREEN IS FOCUSED
  // -------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      if (!slug) return;
      console.log("slug", slug);

      const fetchProfile = async () => {
        setLoading(true);

        console.log("📡 Calling Profile API with slug:", slug);
        const res = await Services.getTalentUserProfile(slug);

        console.log("📥 Profile API Response:", res);

        if (res.success) setProfile(res.data);
        else console.log("API Error:", res.error);

        setLoading(false);
      };

      fetchProfile();
    }, [slug])
  );

  // -------------------------------------------------------------
  // 3️⃣ LOADING UI
  // -------------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  // -------------------------------------------------------------
  // 4️⃣ NO PROFILE
  // -------------------------------------------------------------
  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  const user = profile.user_detail;

  // -------------------------------------------------------------
  // 5️⃣ RENDER PROFILE UI
  // -------------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title="Talent Profile"
        showBack
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* TOP CARD */}
        <View style={styles.headerCard}>
          <Image
            source={{
              uri:
                user.profile_pic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>

          <Text style={styles.role}>
            {profile.current_job_title || "Not Provided"}
          </Text>
        </View>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
            style={{
              backgroundColor: "#0E3386",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* BASIC INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Text style={styles.item}>Email: {user.email}</Text>
          <Text style={styles.item}>Contact: {user.contact_number}</Text>
          <Text style={styles.item}>Country: {profile.country_name}</Text>
          <Text style={styles.item}>State: {profile.state_name}</Text>
          <Text style={styles.item}>District: {profile.district}</Text>
          <Text style={styles.item}>Pincode: {profile.pin_code}</Text>
        </View>

        {/* ABOUT */}
        {profile.about ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </View>
        ) : null}

        {/* SKILLS */}
        {profile.skill_set_data?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>

            <View style={styles.skillContainer}>
              {profile.skill_set_data.map((s) => (
                <Text key={s.id} style={styles.skillChip}>
                  {s.name}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* EXPERIENCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.item}>
            {profile.total_experience || "0"} years
          </Text>
        </View>
    {/* CV */}
       <View style={styles.section}>
  <Text style={styles.sectionTitle}>Uploaded CV</Text>

  {profile?.cv ? (
    <Text
      style={[styles.item, styles.link]}
      onPress={async () => {
        const url = profile.cv;

        const supported = await Linking.canOpenURL(url);
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open CV link");
        }
      }}
    >
      View CV
    </Text>
  ) : (
    <Text style={styles.item}>No Uploaded CV</Text>
  )}
</View>

        {/* RATING */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating</Text>
          <Text style={styles.item}>⭐ {profile.average_rating || "0.0"}</Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
      <UpdateTalentProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSuccess={() => {
          setShowEditModal(false);
          if (slug) {
            Services.getTalentUserProfile(slug).then(res => {
              if (res.success) setProfile(res.data);
            });
          }
        }}
      />

    </View>
  );
};

export default ViewTalentProfileScreen;

// -------------------------------------------------------------
// STYLES
// -------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  errorText: {
    fontSize: 16,
    color: "red",
  },

  headerCard: {
    alignItems: "center",
    marginBottom: 22,
    paddingTop: 10,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#eaeaea",
  },

  name: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
  },

  role: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },

  section: {
    backgroundColor: "#F7F8FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  item: {
    fontSize: 15,
    marginVertical: 2,
  },

  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },

  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skillChip: {
    backgroundColor: "#E6F1FF",
    color: "#0057D9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    marginBottom: 6,
  },
});
