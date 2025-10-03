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
   SignWellEmbed: {
    embeddedSigningUrl: string | null;
    documentId?: string;
    requestingRedirectUrl: string | null;
    handleClear: () => void;
  };
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

// types.ts
export interface SignWellDocument {
  id?: string;
  name: string;
  custom_requester_name: string;
  embedded_edit_url: string;
  recipients: Array<{
    email: string;
    embedded_signing_url: string;
    id: string;
    name: string;
    passcode: string;
    status: string;
  }>;
  requester_email_address: string;
  status: string;
  subject: string;
}

export interface UserData {
  id: string;
  // Add other user properties as needed
}

export interface DocumentResponse {
  // Define the structure based on your API response
  id: string;
  name: string;
  // Add other properties
}

export interface CreateDocumentProps {
  signwellRes: boolean | SignWellDocument;
  setSignwellRes: (res: boolean | SignWellDocument) => void;
  setUrl: (url: string | null) => void;
  setRequestingRedirectUrl: (url: string | null) => void;
  fileName: string;
  recipientName: string;
  recipientEmail: string;
  passcode: string;
  setFileName: (name: string) => void;
  setRecipientName: (name: string) => void;
  setRecipientEmail: (email: string) => void;
  setPasscode: (passcode: string) => void;
  isDocumentOpen: boolean;
  setIsDocumentOpen: (open: boolean) => void;
  handleClear: () => void;
  documentResponse: DocumentResponse | null;
  setDocumentResponse: (response: DocumentResponse | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  id: string | undefined;
  error: string | null;
  setError: (error: string | null) => void;
}

export interface SignWellEmbedProps {
  embeddedSigningUrl: string | null;
  id: string;
  requestingRedirectUrl: string | null;
  handleClear: () => void;
}

// types/index.ts
export interface ContractStatus {
  approved: number;
  pending_approval: number;
  completed: number;
}

export interface SpendDataItem {
  contract_status: ContractStatus;
}

export interface CountryPercent {
  country: string;
  percentage: number;
}

export interface OrganisationUser {
  user_detail: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface MapListItem {
  // Define your map item properties here
}

export interface GifGalleryItem {
  src: any;
  value: string;
}