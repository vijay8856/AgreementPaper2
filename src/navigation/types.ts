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


};

export type RootStackParamList = {
 Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  VerifyEmail: undefined;
  AuthLoading: undefined;
  MyProfile:undefined;
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