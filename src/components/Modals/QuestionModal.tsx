import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (questions: any[]) => void;
}
const sections = [
  {
    title: 'Legal & Compliance',
    items: [
      {
        key: 'Governing Law',
        label: "Governing Law – Which jurisdiction's laws will apply?",
        type: 'text',
      },
      {
        key: 'Regulatory Requirements',
        label:
          'Regulatory Requirements – Any industry-specific regulations that must be addressed?',
        type: 'text',
      },
      {
        key: 'Dispute Resolution',
        label:
          'Dispute Resolution – Should disputes be settled through arbitration, mediation, or courts?',
        type: 'dropdown',
        options: ['Arbitration', 'Mediation', 'Courts'],
      },
    ],
  },
  {
    title: 'Parties Involved',
    items: [
      {
        key: 'Party Type',
        label:
          'Party Type – Is the recipient an individual, small business, or enterprise?',
        type: 'dropdown',
        options: ['Individual', 'Small Business', 'Enterprise'],
      },
      {
        key: 'Contract Duration',
        label:
          'Contract Duration – Is it a fixed-term, auto-renewal, or indefinite contract?',
        type: 'dropdown',
        options: ['Fixed-term', 'Auto-renewal', 'Indefinite'],
      },
      {
        key: 'Termination Conditions',
        label:
          'Termination Conditions – Under what conditions can either party terminate the contract?',
        type: 'text',
      },
    ],
  },
  {
    title: 'Financial Terms',
    items: [
      {
        key: 'Payment Terms',
        label:
          'Payment Terms – What are the payment milestones, methods, and currency?',
        type: 'text',
      },
      {
        key: 'Tax Implications',
        label:
          'Tax Implications – Who is responsible for local/international taxes?',
        type: 'text',
      },
      {
        key: 'Penalties Late Fees',
        label:
          'Penalties & Late Fees – Are there any penalties for late payments or non-compliance?',
        type: 'text',
      },
    ],
  },
  {
    title: 'Scope & Obligations',
    items: [
      {
        key: 'Scope Of Work',
        label:
          'Scope of Work/Services – What specific deliverables or services are covered?',
        type: 'text',
      },
      {
        key: 'Confidentiality Requirements',
        label:
          'Confidentiality Requirements – Should an NDA or confidentiality clause be included?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
      {
        key: 'Intellectual Property',
        label:
          'Intellectual Property (IP) Ownership – Who owns the IP of work produced?',
        type: 'text',
      },
      {
        key: 'Liability Indemnity',
        label:
          'Liability & Indemnity – Who is responsible for damages, breaches, or legal disputes?',
        type: 'text',
      },
    ],
  },
  {
    title: 'Execution & Signatures',
    items: [
      {
        key: 'Signatory Authority',
        label:
          'Signatory Authority – Who has the legal authority to sign on behalf of each party?',
        type: 'text',
      },
      {
        key: 'E-Signature',
        label:
          'E-signature or Wet Signature – Will it be signed digitally (eIDAS, Indian IT Act) or physically?',
        type: 'dropdown',
        options: ['E-signature', 'Wet signature'],
      },
      {
        key: 'Witness Requirement',
        label:
          'Witness Requirement – Does the contract need to be witnessed or notarized?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
    ],
  },
  {
    title: 'Financial & Compensation Terms',
    items: [
      {
        key: 'Currency Of Payment',
        label:
          'Currency of Payment – What currency will be used for transactions?',
        type: 'text',
      },
      {
        key: 'Billing Cycle',
        label:
          'Billing Cycle – Weekly, monthly, quarterly, or upon project completion?',
        type: 'dropdown',
        options: ['Weekly', 'Monthly', 'Quarterly', 'Upon project completion'],
      },
      {
        key: 'Reimbursement Terms',
        label: 'Reimbursement Terms – Are there any reimbursable expenses?',
        type: 'text',
      },
      {
        key: 'Commission Bonus Structure',
        label:
          'Commission or Bonus Structure – If applicable, how are commissions calculated?',
        type: 'text',
      },
    ],
  },
  {
    title: 'Risk Management & Liability',
    items: [
      {
        key: 'Force Majeure Clause',
        label:
          'Force Majeure Clause – What happens in case of unforeseen events (natural disasters, war, etc.)?',
        type: 'text',
      },
      {
        key: 'Insurance Requirements',
        label:
          'Insurance Requirements – Are there any insurance obligations for either party?',
        type: 'text',
      },
      {
        key: 'Warranties Guarantees',
        label:
          'Warranties & Guarantees – Are there any quality or performance guarantees?',
        type: 'text',
      },
      {
        key: 'Breach O fContract Consequences',
        label:
          'Breach of Contract Consequences – What happens if either party fails to comply?',
        type: 'text',
      },
    ],
  },
  {
    title: 'Data Protection & Privacy',
    items: [
      {
        key: 'GDPR/CCPA Compliance',
        label:
          'GDPR/CCPA Compliance – Does the contract involve handling personal data?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
      {
        key: 'Data Ownership & Usage',
        label:
          'Data Ownership & Usage – Who owns the collected data, and how can it be used?',
        type: 'text',
      },
      {
        key: 'Data Retention Policy',
        label:
          'Data Retention Policy – How long should data be stored and who is responsible?',
        type: 'text',
      },
      {
        key: 'Cybersecurity Requirements',
        label:
          'Cybersecurity Requirements – Are there security standards that must be met?',
        type: 'text',
      },
    ],
  },
  {
    title: 'Employment & HR Considerations',
    items: [
      {
        key: 'Non-Compete Clause',
        label:
          'Non-Compete Clause – Is the recipient restricted from working with competitors?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
      {
        key: 'Non-Solicitation Clause',
        label:
          'Non-Solicitation Clause – Can the recipient recruit employees/customers?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
      {
        key: 'Work Hours & Leave Policies',
        label:
          'Work Hours & Leave Policies – What are the expectations for availability and time off?',
        type: 'text',
      },
      {
        key: 'Remote Work & Office Location',
        label:
          'Remote Work & Office Location – Is there a requirement for on-site work?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
    ],
  },
  {
    title: 'Contract Execution & Enforcement',
    items: [
      {
        key: 'Renewal & Expiry Terms',
        label:
          'Renewal & Expiry Terms – How long does the contract last, and how can it be renewed?',
        type: 'text',
      },
      {
        key: 'Amendment Procedure',
        label: 'Amendment Procedure – How can the contract be modified?',
        type: 'text',
      },
      {
        key: 'Third-Party Beneficiaries',
        label:
          'Third-Party Beneficiaries – Are any outside entities involved in enforcement?',
        type: 'text',
      },
      {
        key: 'Assignment Rights',
        label:
          'Assignment Rights – Can the contract be transferred to another entity?',
        type: 'dropdown',
        options: ['Yes', 'No'],
      },
    ],
  },
];
const QuestionModal: React.FC<Props> = ({visible, onClose, onSave}) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleQuestion = (question: any) => {
    setSelected(prev => ({
      ...prev,
      [question.key]: !prev[question.key],
    }));
  };

  const handleSave = () => {
    const selectedQuestions = sections.flatMap(section =>
      section.items.filter(item => selected[item.key]),
    );

    onSave(selectedQuestions);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      statusBarTranslucent={false}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar barStyle="light-content" backgroundColor="#ffffffff" />
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sections.map(section => (
              <View key={section.title} style={{marginBottom: 20}}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>

                {section.items.map(item => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.questionRow}
                    onPress={() => toggleQuestion(item)}>
                    <Text style={{flex: 1}}>{item.label}</Text>
                    <Text>{selected[item.key] ? '☑' : '☐'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={handleSave}>
            <Text style={{color: '#fff'}}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={{textAlign: 'center', color: '#fff'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default QuestionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionHeader: {
    backgroundColor: '#1E2A78',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  questionRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  doneBtn: {
    backgroundColor: '#0E3386',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
});
