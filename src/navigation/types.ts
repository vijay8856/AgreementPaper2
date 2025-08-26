// types.ts

export type DashboardTabParamList = {
  HomeScreen: undefined;
  AIResFullReview: undefined;
  ESignature: undefined;
  LawyerNetwork: undefined;
  SupplierAgency: undefined;
  Settings: undefined;
  InviteAgency: undefined;
  InviteResource: undefined;
  AIReview: undefined,
SubscriptionPlan:undefined
  SubscriptionHistoryScreen:undefined,
    AICoreAdminScreen:undefined,

};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  VerifyEmail: undefined;
  AuthLoading: undefined;
  MyProfile:undefined;
  LinkedInLoginScreen: undefined;
  SubscriptionHistoryScreen:undefined,
  ContractPreviewScreen: { htmlContent: string };
  AICoreAdminScreen:undefined,
  ESignatureScreen:undefined,
  OrganisationDashboard: undefined;
  SupplierDashboard: undefined;
  TalentDashboard: undefined;
  LawyerDashboard: undefined;
  OrganizationProfileModal:undefined,
  MSADetailScreen: { data: any }; 
};
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
};
export type AppStackParamList = {
  Dashboard: undefined;
  MyProfile: undefined;
};

