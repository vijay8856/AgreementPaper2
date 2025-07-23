import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, TextInput, StyleSheet } from 'react-native';

const helpData = [
  {
    question: 'What is AgreementPaper?',
    answer: 'AgreementPaper is a platform for managing contracts, uploading documents, Review Contracts By AI and  Invite Lawyers,Agencies,Suppliers .',
  },
  {
    question: 'How to use the AI-Full-Review?',
    answer: 'Click On AI-Full-Review Icon fill the Questions , Upload the pdf , click on Review button the AI give Automatic Replay.',
  },
  {
    question: 'How to upload a document?',
    answer: 'Go to Dashboard > AI-Full-Review > Upload  > Choose PDF file > Done .',
  },
  {
    question: 'How to make a payment?',
    answer: 'Go to Subscription section, pick a plan, and complete the payment via Stripe.',
  },
];

const HelpScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filteredData = helpData.filter(item =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  const handleSupportEmail = () => {
    Linking.openURL('mailto:support@agreementpaper.com?subject=Help Needed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Help & Support</Text>

      <TextInput
        placeholder="Search help topics..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.faqItem}>
            <TouchableOpacity onPress={() => setExpandedIndex(index === expandedIndex ? null : index)}>
              <Text style={styles.question}>{item.question}</Text>
            </TouchableOpacity>
            {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
          </View>
        )}
      />

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Need More Help?</Text>
        <TouchableOpacity onPress={handleSupportEmail} style={styles.supportButton}>
          <Text style={styles.supportButtonText}>📧 Email Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#0E3386' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingBottom: 8,
  },
  question: { fontSize: 16, fontWeight: '600', color: '#333' },
  answer: { fontSize: 14, color: '#555', marginTop: 5 },
  contactContainer: { marginTop: 20, alignItems: 'center' },
  contactTitle: { fontSize: 18, marginBottom: 10 },
  supportButton: {
    backgroundColor: '#0E3386',
    padding: 12,
    borderRadius: 8,
  },
  supportButtonText: { color: '#fff', fontWeight: 'bold' },
});
