import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState<'permission' | 'email' | 'addQuestion'>('permission');
  const [isPermissionMode, setIsPermissionMode] = useState<'privacy' | 'password'>('privacy');
  const [emailPrivacySettings, setEmailPrivacySettings] = useState({
    sendMBA: true,
    send80W: true,
    sendInvoice: true,
    sendAgencyProfile: true,
    sendResourceProfile: true,
    emailContent: "Enter email content here",
  });
  
  const [password, setPassword] = useState({
    old: '',
    new: '',
    confirm: '',
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showContact: false,
    showEmail: true,
    showAddress: false,
    showExperience: false,
    showLinkedIn: false,
    shareCV: false,
    shareRate: false,
  });
  
  const [newQuestion, setNewQuestion] = useState({
    sectionName: '',
    uniqueKey: '',
    question: '',
  });

  // Toggle privacy setting
  const togglePrivacy = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle email privacy settings
  const toggleEmailSetting = (setting: keyof typeof emailPrivacySettings) => {
    if (setting === 'emailContent') return;
    
    setEmailPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0E3386', '#1A3B8B']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Manage settings</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'permission' && styles.activeTab]}
          onPress={() => setActiveTab('permission')}
        >
          <Text style={[styles.tabText, activeTab === 'permission' && styles.activeTabText]}>
            Permission
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'email' && styles.activeTab]}
          onPress={() => setActiveTab('email')}
        >
          <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
            Email Privacy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'addQuestion' && styles.activeTab]}
          onPress={() => setActiveTab('addQuestion')}
        >
          <Text style={[styles.tabText, activeTab === 'addQuestion' && styles.activeTabText]}>
            Add AI Question
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'permission' && (
          <PermissionSection 
            isPasswordMode={isPermissionMode === 'password'}
            toggleMode={() => setIsPermissionMode(
              isPermissionMode === 'privacy' ? 'password' : 'privacy'
            )}
            privacySettings={privacySettings}
            togglePrivacy={togglePrivacy}
            password={password}
            setPassword={setPassword}
          />
        )}
        
        {activeTab === 'email' && (
          <EmailPrivacySection 
            settings={emailPrivacySettings}
            toggleSetting={toggleEmailSetting}
            setEmailContent={(text:string) => setEmailPrivacySettings(prev => ({
              ...prev,
              emailContent: text
            }))}
          />
        )}
        
        {activeTab === 'addQuestion' && (
          <AddQuestionSection 
            question={newQuestion}
            setQuestion={setNewQuestion}
          />
        )}
      </ScrollView>
    </View>
  );
};

// Permission Section Component
const PermissionSection = ({ 
  isPasswordMode, 
  toggleMode, 
  privacySettings, 
  togglePrivacy,
  password,
  setPassword
}:any) => (
  <View style={styles.sectionCard}>
    <View style={styles.modeToggleContainer}>
      <TouchableOpacity 
        style={[styles.modeButton, !isPasswordMode && styles.activeModeButton]}
        onPress={toggleMode}
      >
        <Text style={[styles.modeButtonText, !isPasswordMode && styles.activeModeButtonText]}>
          Data Privacy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.modeButton, isPasswordMode && styles.activeModeButton]}
        onPress={toggleMode}
      >
        <Text style={[styles.modeButtonText, isPasswordMode && styles.activeModeButtonText]}>
          Change Password
        </Text>
      </TouchableOpacity>
    </View>
    
    {!isPasswordMode ? (
      <>
        <Text style={styles.sectionTitle}>Permissions/Data Privacy</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Permission/Data Privacy</Text>
          <Text style={styles.tableHeaderText}>Yes/No</Text>
        </View>
        
        <PermissionRow 
          label="Show my Contact number" 
          value={privacySettings.showContact} 
          onToggle={() => togglePrivacy('showContact')} 
        />
        <PermissionRow 
          label="Show my Email address" 
          value={privacySettings.showEmail} 
          onToggle={() => togglePrivacy('showEmail')} 
        />
        <PermissionRow 
          label="Show my Address" 
          value={privacySettings.showAddress} 
          onToggle={() => togglePrivacy('showAddress')} 
        />
        <PermissionRow 
          label="Show my Experience" 
          value={privacySettings.showExperience} 
          onToggle={() => togglePrivacy('showExperience')} 
        />
        <PermissionRow 
          label="Show my LinkedIn URL" 
          value={privacySettings.showLinkedIn} 
          onToggle={() => togglePrivacy('showLinkedIn')} 
        />
        <PermissionRow 
          label="Share my CV/Resume" 
          value={privacySettings.shareCV} 
          onToggle={() => togglePrivacy('shareCV')} 
        />
        <PermissionRow 
          label="Share my Rate" 
          value={privacySettings.shareRate} 
          onToggle={() => togglePrivacy('shareRate')} 
        />
      </>
    ) : (
      <>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <PasswordField 
          label="Old Password *" 
          value={password.old} 
          onChangeText={(text:string) => setPassword((prev :any) => ({...prev, old: text}))} 
        />
        <PasswordField 
          label="New Password *" 
          value={password.new} 
          onChangeText={(text:string) => setPassword((prev :any) => ({...prev, new: text}))} 
        />
        <PasswordField 
          label="Confirm New Password *" 
          value={password.confirm} 
          onChangeText={(text:string) => setPassword((prev :any) => ({...prev, confirm: text}))} 
        />
      </>
    )}
  </View>
);

// Email Privacy Section Component
const EmailPrivacySection = ({ settings, toggleSetting, setEmailContent }:any) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Email Privacy Settings</Text>
    
    <EmailSettingRow 
      label="Send Organisation MBA details email" 
      value={settings.sendMBA} 
      onToggle={() => toggleSetting('sendMBA')} 
    />
    <EmailSettingRow 
      label="Send Organisation 80W details email" 
      value={settings.send80W} 
      onToggle={() => toggleSetting('send80W')} 
    />
    
    <EmailSettingRow 
      label="Send Invoice details email" 
      value={settings.sendInvoice} 
      onToggle={() => toggleSetting('sendInvoice')} 
    />
    <EmailSettingRow 
      label="Send Agency Profile details email" 
      value={settings.sendAgencyProfile} 
      onToggle={() => toggleSetting('sendAgencyProfile')} 
    />
    <EmailSettingRow 
      label="Send Resource Profile details email" 
      value={settings.sendResourceProfile} 
      onToggle={() => toggleSetting('sendResourceProfile')} 
    />
    <Text style={styles.emailContentLabel}>Email Content</Text>
    <TextInput
      style={styles.emailContentInput}
      multiline
      numberOfLines={4}
      value={settings.emailContent}
      onChangeText={setEmailContent}
      placeholder="Enter email content here"
    />
  </View>
);

// Add Question Section Component
const AddQuestionSection = ({ question, setQuestion }:any) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Add New Question</Text>
    
    <QuestionCategory title="Legal & Compliance">
      <BulletPoint text="Governing Law – Which jurisdictions laws will apply?" />
      <BulletPoint text="Regulatory Requirements – Any industry-specific regulations that must be addressed?" />
      <BulletPoint text="Dispute Resolution – Should disputes be settled through arbitration, mediation, or courts?" />
    </QuestionCategory>
    
    <QuestionCategory title="Parties involved">
      <BulletPoint text="Party Type – Is the recipient an individual, small business, or enterprise?" />
      <BulletPoint text="Contract Duration – Is it a fixed-term, auto-renewal, or indefinite contract?" />
      <BulletPoint text="Termination Conditions – Under what conditions can either party terminate the contract?" />
    </QuestionCategory>
    
    <QuestionCategory title="Financial Terms">
      <BulletPoint text="Payment Terms – What are the payment milestones, methods, and currency?" />
      <BulletPoint text="Tax Implications – Who is responsible for local/international taxes?" />
      <BulletPoint text="Penalties & Late Fees – Are there any penalties for late payments or non-compliance?" />
    </QuestionCategory>
    
    <QuestionCategory title="Scope & Obligations">
      <BulletPoint text="Scope of Work/Services – What specific deliverables or services are covered?" />
      <BulletPoint text="Confidentiality Requirements – Should an NDA or confidentiality clause be included?" />
      <BulletPoint text="Intellectual Property (IP) Ownership – Who owns the IP of work produced?" />
      <BulletPoint text="Liability & Indemnity – Who is responsible for damages, breaches, or legal disputes?" />
    </QuestionCategory>
    
    <QuestionCategory title="Execution & Signatures">
      <BulletPoint text="Signatory Authority – Who has the legal authority to sign on behalf of each party?" />
      <BulletPoint text="Signature Structure – Will it be signed digitally (HINA Index IT Act) or physically?" />
    </QuestionCategory>
    
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Enter Section Name</Text>
      <TextInput
        style={styles.input}
        value={question.sectionName}
        onChangeText={(text) => setQuestion((prev :any) => ({...prev, sectionName: text}))}
        placeholder="Section name"
      />
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Enter Unique Key</Text>
      <TextInput
        style={styles.input}
        value={question.uniqueKey}
        onChangeText={(text) => setQuestion((prev :any) => ({...prev, uniqueKey: text}))}
        placeholder="Unique key identifier"
      />
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Enter Question</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={3}
        value={question.question}
        onChangeText={(text) => setQuestion((prev :any) => ({...prev, question: text}))}
        placeholder="Enter your question here"
      />
    </View>
    
    <TouchableOpacity style={styles.addButton}>
      <Text style={styles.addButtonText}>Add More Question</Text>
    </TouchableOpacity>
  </View>
);

// Reusable Components
const PermissionRow = ({ label, value, onToggle }:any) => (
  <View style={styles.permissionRow}>
    <Text style={styles.permissionLabel}>{label}</Text>
    <View style={styles.toggleContainer}>
      <Text style={styles.toggleOption}>{value ? '● Yes' : '○ No'}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#0E3386' }}
        thumbColor={value ? '#f5f5f5' : '#f4f3f4'}
      />
    </View>
  </View>
);

const EmailSettingRow = ({ label, value, onToggle }:any) => (
  <View style={styles.emailSettingRow}>
    <Text style={styles.emailSettingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#767577', true: '#0E3386' }}
      thumbColor={value ? '#f5f5f5' : '#f4f3f4'}
    />
  </View>
);

const PasswordField = ({ label, value, onChangeText }:any) => (
  <View style={styles.formGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry
      placeholder="Enter password"
    />
  </View>
);

const QuestionCategory = ({ title, children }:any) => (
  <View style={styles.questionCategory}>
    <Text style={styles.categoryTitle}>{title}</Text>
    <View style={styles.divider} />
    <View style={styles.bulletList}>
      {children}
    </View>
  </View>
);

const BulletPoint = ({ text }:any) => (
  <View style={styles.bulletPoint}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  header: {
    padding: 24,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#0E3386',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#0E3386',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E3386',
    marginBottom: 16,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#0E3386',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeModeButtonText: {
    color: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  permissionLabel: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  toggleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toggleOption: {
    marginRight: 10,
    fontSize: 14,
    color: '#666',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  emailSettingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  emailSettingLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  emailContentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emailContentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  questionCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  bulletList: {
    paddingLeft: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    color: '#666',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#0E3386',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;