import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Services from '../Services/services';
import {useNavigation} from '@react-navigation/native';
import {Share, Linking} from 'react-native';

const PostedJobsScreen = () => {
  const navigation = useNavigation<any>();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await Services.getPostedJob({limit: 100, offset: 0});
    console.log('get job ', res);

    if (res.success) {
      setJobs(res.data.results || []);
    } else {
      Alert.alert('Error', 'Failed to load jobs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const handleShare = async job => {
    const jobUrl = `https://play.google.com/store/apps/details?id=com.agreementpaperapp2`;

    const message = `
🚀 New Job Posted on Agreement Paper

📌 ${job.title}
💰 ${job.currency_code} ${job.pay_rate}
📍 ${job.company_city}, ${job.company_country_name}

Apply Now:
${jobUrl}

📲 Download App:
https://play.google.com/store/apps/details?id=com.agreementpaper
  `;

    Linking.openURL(
      `https://www.linkedin.com/sharing/share-offsite/?url=${jobUrl}`,
    );
  };

  const handleDelete = (jobId: number) => {
    Alert.alert('Delete Job', 'Are you sure you want to delete this job?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const res = await Services.deletePostedJob({
            id: jobId,
            is_active: false,
          });
          console.log('delete', res);

          if (res.success) {
            console.log('delete', res);

            Alert.alert('Success', 'Job deleted successfully');
            fetchJobs();
          } else {
            Alert.alert('Error', 'Failed to delete job');
          }
        },
      },
    ]);
  };

  const renderJobCard = ({item}: any) => {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Text
            style={[
              styles.status,
              item.is_active ? styles.active : styles.inactive,
            ]}>
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {item.job_description}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            📍 {item.company_city}, {item.company_country_name}
          </Text>
          <Text style={styles.metaText}>💼 {item.job_type_value}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            💰 {item.currency_code} {item.pay_rate}
          </Text>
          <Text style={styles.metaText}>👨‍💻 {item.experience_level} yrs</Text>
        </View>

        <View style={styles.skillsRow}>
          {item.skills_data?.map((skill: any) => (
            <View key={skill.id} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate('EditJobScreen', {jobId: item.id})
            }>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => handleShare(item)}>
            <Text style={styles.btnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobs.length === 0 ? (
        <Text style={styles.emptyText}>No jobs posted yet</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderJobCard}
          contentContainerStyle={{paddingBottom: 20}}
          refreshing={refreshing}
          onRefresh={fetchJobs}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F6FA',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#e3e3e3ff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0a0909ff',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {width: 2, height: 4},
    elevation: Platform.OS === 'android' ? 4 : 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  active: {
    backgroundColor: '#E6F4EA',
    color: '#1E7F43',
  },
  inactive: {
    backgroundColor: '#FDECEC',
    color: '#B00020',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaText: {
    fontSize: 13,
    color: '#444',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillChip: {
    backgroundColor: '#E8ECF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#0E3386',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  editBtn: {
    backgroundColor: '#0E3386',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#0E3386',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,

  },
    shareBtn: {
      backgroundColor: '#0E3386',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },

  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
export default PostedJobsScreen;
