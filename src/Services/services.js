import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import {API_ENDPOINTS} from '../api/ApiManager/endpoint';
import {
  API_URL,
  AUTH_HEADERS,
  AUTH_MULTYPART_HEADERS,
  AUTH_MULTYPART_HEADERS2,
  HEADERS,
  MULTYPART_HEADERS,
} from '../Axios/axiosData';
import {authorize} from 'react-native-app-auth';
import dayjs from 'dayjs';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export const API_KEY = 'YWNjZXNzOjhlMDI4YTlhODAyMjcwYzU3ZmE0ZjRiZWM4YzRjYjFj'; //live api
export const SIGNWELL_API_URL = 'https://www.signwell.com/api/v1/documents/';

const signwellAxios = axios.create({
  baseURL: SIGNWELL_API_URL,
  headers: {
    Authorization: `Token ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});
// export const API_KEY = 'YWNjZXNzOjhlMDI4YTlhODAyMjcwYzU3ZmE0ZjRiZWM4YzRjYjFj'; //test api
// export const API_KEY = 'YWNjZXNzOjZiODE2Yzc1N2E2YzllMmZjOTFiNzZkMjA3Mjc4Y2Jl'; //live api
const Services = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.LOGIN,
        {email, password},

        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      console.log('response121212', response);

      const userData = response?.data?.payload;
      console.log('login userData ', userData);
      if (userData?.first_name && userData?.last_name) {
        console.log(
          'Storing to AsyncStorage:',
          userData?.first_name,
          userData?.last_name,
        );
        await AsyncStorage.setItem('first_Name', userData?.first_name);
        await AsyncStorage.setItem('last_Name', userData?.last_name);
        await AsyncStorage.setItem('Token', response.data.key);
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(
          '🧠 AsyncStorage key: Token =>',
          await AsyncStorage.getItem('Token'),
        );
        console.log(
          '🧠 AsyncStorage key: email =>',
          await AsyncStorage.getItem('email'),
        );
        console.log(
          '🧠 AsyncStorage key: first_Name =>',
          await AsyncStorage.getItem('first_Name'),
        );
        console.log(
          '🧠 AsyncStorage key: last_Name =>',
          await AsyncStorage.getItem('last_Name'),
        );
      }
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error: error.response?.data || 'Failed to log in',
        status: error.response?.status || 500,
      };
    }
  },
  googleSignup: async (access_token, user_type) => {
    console.log('........access_token', access_token, 'user_type', user_type);

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDACCESSTOKEN,
        {
          access_token,
          user_type,
        },
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      console.log('googleSignup response', response);
      await AsyncStorage.setItem(
        'isActive',
        response.data?.user?.profile?.is_active?.toString() || 'false',
      );
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log(',,,,,,,error', error);

      return {
        success: false,
        error:
          error?.response?.data?.non_field_errors?.[0] ||
          'Google signup/login failed',
        status: error?.response?.status || 500,
      };
    }
  },
  sendAccessToken: async access_token => {
    try {
      console.log('trying sendAccessToken');

      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDACCESSTOKEN,
        {access_token},
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      console.log('response  response', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error:
          error.response?.data?.non_field_errors?.[0] ||
          'Google authentication failed',
        status: error.response?.status || 500,
      };
    }
  },
  getLawyerNetworkList: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.LAWYERNETWORKLIST +
          `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      return {
        success: true,
        data: response.data.results.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Lawyer Network List',
        status: error.response?.status || 500,
      };
    }
  },
  viewLawyerNetworkProfile: async id => {
    try {
      const headers = await AUTH_HEADERS();
      const url = `${API_URL}lawyer-network/lawyers/${id}/`;

      const response = await axiosInstance.get(url, headers);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Lawyer Network Profile',
        status: error.response?.status || 500,
      };
    }
  },

  getCountryList: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.COUNTRIES,
        headers,
      );
      return {
        success: true,
        data: response.data.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Countries List',
        status: error.response?.status || 500,
      };
    }
  },

  getCountryDetailsStateCreateMSA: async countryName => {
    console.log('countryName', countryName);

    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COUNTRIESDETAILSSTATES}?country=${encodeURIComponent(
          countryName?.country,
        )}`,
        headers,
      );
      console.log('response', response);

      return {
        success: true,
        data: response.data.data[0]?.states || [],
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching states:', error);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch states',
        status: error.response?.status || 500,
      };
    }
  },
  getCountryDetailsState: async countryName => {
    console.log('countryName', countryName);

    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COUNTRIESDETAILSSTATES}?country=${encodeURIComponent(
          countryName,
        )}`,
        headers,
      );
      console.log('response', response);

      return {
        success: true,
        data: response.data.data[0]?.states || [],
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching states:', error);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch states',
        status: error.response?.status || 500,
      };
    }
  },

  searchCountry: async query => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COUNTRIESSEARCH}?country=${query}&limit=10&offset=0`,
        headers,
      );
      console.log('searchCountry response', response);

      return {
        success: true,
        data: response.data.results,
        status: response.status,
      };
    } catch (error) {
      console.error('Country search error:', error);
      return {
        success: false,
        error: error.response?.data || 'Failed to search countries',
        status: error.response?.status || 500,
      };
    }
  },

  analysisContractByAi: async formData => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS2();
      const response = await axiosInstance.post(
        API_ENDPOINTS.ANALYSISCONTRACT,
        formData,
        {headers},
      );
      console.log('response12', response);

      return {
        success: true,
        data: response.data.response,
        status: response.status,
      };
    } catch (error) {
      console.log('error', error);

      return {
        success: false,
        error: error.response?.data || 'Failed to analyze contract',
        status: error.response?.status || 500,
      };
    }
  },
  getSuppliersList: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.SUPPLIERSLIST +
          `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      return {
        success: true,
        data: response.data.results,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Suppliers List',
        status: error.response?.status || 500,
      };
    }
  },
  sendConnectionSupplier: async payload => {
    console.log('payload', payload);

    try {
      const {headers} = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.CONNECTSUPPLIER,
        payload,
        {headers},
      );

      return {
        success: true,
        data: response.data.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  signUp: async payload => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.REGISTER,
        payload,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      console.log('payload22', payload);

      console.log('response 2 signup', response);
      if (response.status === 200) {
        await AsyncStorage.setItem(
          'signUp_data',
          JSON.stringify({email: payload.email}),
        );
      }
      return {
        success: true,
        data: response.data.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  sendVerificationCode: async payload => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDVERIFICATIONGAMILCODE,
        payload,
        {headers},
      );

      console.log('sendVerificationCode response', response);
      if (response.status === 200) {
        await AsyncStorage.setItem(
          'signUp_data',
          JSON.stringify({email: payload.email}),
        );
      }
      return {
        success: true,
        data: response.data.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error: error.response?.data || 'Failed to send OTP',
        status: error.response?.status || 500,
      };
    }
  },

  verifyCode: async payload => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.VERIFYCODE,
        payload,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      console.log('verifyCode response', response);

      if (response.status === 200) {
        await AsyncStorage.setItem(
          'first_Name',
          response.data.payload?.first_name || '',
        );
        await AsyncStorage.setItem(
          'last_Name',
          response.data.payload?.last_name || '',
        );
        await AsyncStorage.setItem('email', response.data.payload?.email || '');
        await AsyncStorage.setItem('Token', response.data.key || '');
      }
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: response.data.message,
        position: 'top',
      });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('verifyCode error response 👉', error.response);

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Something went wrong',
        status: error.response?.status || 500,
      };
    }
  },

  getEsignDocList: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.ESIGNDOCLIST +
          `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      console.log('getEsignDocList', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch EsignDoc List',
        status: error.response?.status || 500,
      };
    }
  },
  getUserProfileDetails: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.USERPROFILE,
        headers,
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error:
          error.response?.data || 'Failed to fetch User Profile Details List',
        status: error.response?.status || 500,
      };
    }
  },
  getIndividualUserProfile: async data => {
    console.log('daadt', data);

    try {
      const headers = await AUTH_HEADERS();
      let queryParams = `?limit=${data?.limit}&offset=${data?.offset || 0}`;
      const response = await axiosInstance.get(
        API_ENDPOINTS.INDIVIDUALUSERSLIST + queryParams,
        headers,
      );

      return {
        success: true,
        data: response.data.results,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error:
          error.response?.data || 'Failed to fetch User Profile Details List',
        status: error.response?.status || 500,
      };
    }
  },

  getIndividualUserProfileDetail: async data => {
    console.log('daadt', data);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.INDIVIDUALUSERSDETAILS}${data?.User}`,
        headers,
      );
      console.log('response2', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error:
          error.response?.data || 'Failed to fetch User Profile Details List',
        status: error.response?.status || 500,
      };
    }
  },

  updateUserProfileDetails: async payload => {
    console.log('User profile update payload', payload);

    try {
      const headers = await AUTH_MULTYPART_HEADERS2();
      const response = await axiosInstance.post(
        API_ENDPOINTS.UPDATEUSERPROFILE,
        payload,
        {headers},
      );

      if (response.status === 200) {
        console.log('User profile update ', response);

        return {
          success: true,
          data: response.data,
          status: response.status,
        };
      }
    } catch (error) {
      console.log('Full error:', error);
      console.log('Error data:', error.response?.data);
      return {
        success: false,
        error: error.response?.data || 'Failed to send update User Profile',
        status: error.response?.status || 500,
      };
    }
  },

  forgetPassword: async payload => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.FORGETEPASSWORD,
        payload,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      console.log('verifyCode response', response);
      if (response.status === 200) {
        // await AsyncStorage.setItem("first_Name", response.data.payload.first_name || "");
        // await AsyncStorage.setItem("last_Name", response.data.payload.last_name || "");
        // await AsyncStorage.setItem("email", response.data.payload.email || "");
        // await AsyncStorage.setItem("Token", response.data.key || "");
      }

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  forgetPasswordReset: async payload => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.FORGETPASSWORDRESET,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('verifyCode response', response);
      if (response.status === 200) {
        // await AsyncStorage.setItem("first_Name", response.data.payload.first_name || "");
        // await AsyncStorage.setItem("last_Name", response.data.payload.last_name || "");
        // await AsyncStorage.setItem("email", response.data.payload.email || "");
        // await AsyncStorage.setItem("Token", response.data.key || "");
      }

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);

      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },

  inviteUsers: async payload => {
    console.log('service payload', payload);

    try {
      const headers = await AUTH_HEADERS();
      console.log('service headers', headers);

      const response = await axiosInstance.post(
        API_ENDPOINTS.INVITEUSER,

        payload,
        headers,
      );

      console.log('serviceresponse22', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  getLanguagesList: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.GETLANGUAGES,
        headers,
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Languages List',
        status: error.response?.status || 500,
      };
    }
  },
  generateUrl: async payload => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS2();
      const response = await axiosInstance.post(
        API_ENDPOINTS.GENERATEURL,
        payload,
        {headers},
      );
      console.log('responseurl', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  ai_Review: async payload => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.AI_REVIEW,
        payload,
        headers,
      );
      console.log('responseurl', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  linkedinLogin: async payload => {
    console.log('111111', payload);

    try {
      const headers = MULTYPART_HEADERS;

      const response = await axiosInstance.post(
        API_ENDPOINTS.LINKEDINLOGIN,
        payload,
        headers,
      );
      console.log('linkedinLogin', response);
      console.log('headers', headers);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error11111', error);

      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  getPrivacySettings: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.GETPRIVACYSETTINGS,
        headers,
      );
      console.log('GETPRIVACYSETTINGS', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Privacy Settings',
        status: error.response?.status || 500,
      };
    }
  },
  updatePrivacySettings: async data => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS2();
      console.log('updatePrivacySettings headers', headers);

      const response = await axiosInstance.patch(
        API_ENDPOINTS.UPDATEPRIVACYSETTINGS,
        data,
        {headers},
      );
      console.log('updatePrivacySettings response23', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Update failed',
        status: error.response?.status || 500,
      };
    }
  },
  getSubscriptionPlanDetails: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.SUBSCRIPTIONPLANDETAIL,
        headers,
      );
      console.log('getSubscriptionPlanDetails', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error:
          error.response?.data ||
          'Failed to fetch Subscription Plan Details List',
        status: error.response?.status || 500,
      };
    }
  },

  initiatepaymentsub: async payload => {
    console.log('initiatepaymentsub payload', payload);

    try {
      const {headers} = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.SUBSCRIPTIONINITIATEPAYMENT,
        payload,
        {headers},
      );

      console.log('initiatepaymentsub ressss', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error11111', error);
      console.log('error response', error.response);
      return {
        success: false,
        error: error.response?.data || 'Failed to send connection',
        status: error.response?.status || 500,
      };
    }
  },
  getSubscriptionStatus: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.SUBSCRIPTIONSTATUS,
        headers,
      );

      console.log('getSubscriptionStatus', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  cancelSubscription: async () => {
    try {
      const {headers} = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.SUBSCRIPTIONCANCEL,
        {},
        {headers},
      );

      console.log('cancelSubscription response', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to cancel subscription',
        status: error.response?.status || 500,
      };
    }
  },

  getHaspremiumdetails: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.HASPREMIUMDETAILS,
        headers,
      );

      console.log('getHaspremiumdetails1', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },

  getOrderdetails: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.USERORDERDETAILS,
        headers,
      );

      console.log('getOrderdetails', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  getPaymentdetails: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.PAYMENTDETAILS,
        headers,
      );

      console.log('getPaymentdetails', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  deleteUserAccount: async deletePassword => {
    console.log('deletePassword', deletePassword);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.DELETEUSERACCOUNT,
        {password: deletePassword},
        headers,
      );

      console.log('deleteUserAccount', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to delete User Account',
        status: error.response?.status || 500,
      };
    }
  },
  Ai_Draft: async payload => {
    console.log('payload', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.AIDRAFT,
        payload,
        headers,
      );

      console.log('Ai_Draft response', response);
      return {
        success: true,
        data: response,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to Load Contract Review ',
        status: error.response?.status || 500,
      };
    }
  },

  saveDraftTemplate: async payload => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.SAVEDRAFTTEMPLATE,
        payload,
        headers,
      );

      console.log('Ai_Draft response', response);
      return {
        success: true,
        data: response,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to Load Contract Review ',
        status: error.response?.status || 500,
      };
    }
  },

  getAllTemplate: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.ALLTEMPLATES +
          `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      console.log('getAllTemplate', response);

      return response.data;
    } catch (error) {
      console.error('getTemplatePDF error', error);
      throw error;
    }
  },

  getTemplatePDF: async templateId => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `ai/draft-template/${templateId}/download_pdf/`,
        headers,
      );
      return response.data;
    } catch (error) {
      console.error('getTemplatePDF error', error);
      throw error;
    }
  },
  getTemplateDocx: async templateId => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `ai/draft-template/${templateId}/download_docx/`,
        headers,
      );
      return response.data;
    } catch (error) {
      console.error('getTemplateDOCX error', error);
      throw error;
    }
  },

  getOrganisationDashboard: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.ORGANISATIONDASHBOARD,
        headers,
      );

      console.log('getOrganisationDashboard', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  getOrganisationDashboardUser: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.ORGANIZATIONUSERMEMBERDASHBOARD,
        headers,
      );

      console.log('getOrganisationDashboardUser', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  getOrganisationDashboardMap: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.ORGANISATIONDASHBOARDMAP,
        headers,
      );

      console.log('getOrganisationDashboard Map', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error response', error.response);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch dashboard map data',
        status: error.response?.status || 500,
      };
    }
  },

  getMasterDataList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }`;

      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.MASTERDATALIST + queryParams,
        headers,
      );

      console.log('getMasterDataList response', response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching  Master Data List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Master Data List',
        status: error.response?.status || 500,
      };
    }
  },
  updateUserProfile: async payload => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.UPDATEUSERPROFILE}`,
        payload,
        {headers},
      );
      console.log('response.,.,.', response);

      return {success: true, data: response.data};
    } catch (error) {
      return {success: false, error: error.response?.data};
    }
  },

  getApproverCoustom: async data => {
    console.log('loginging', data);

    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }&approver_for=${data?.msa}`;

      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}/`;
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.APPROVERCUSTOMUSER}?limit=${data?.limit}&approver_for=${data?.msa}/`,
        headers,
      );

      console.log('getApproverCoustom response', response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching  Coustom Approver ', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Coustom Approver ',
        status: error.response?.status || 500,
      };
    }
  },
  createMSA: async payload => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.CREATEMSA}`,
        payload,
        headers,
      );
      console.log('response of createMSA', response);

      return {success: true, data: response.data};
    } catch (error) {
      return {success: false, error: error.response?.data};
    }
  },

  updateOrganizationProfile: async payload => {
    try {
      console.log('📤 Payload received:', payload);

      const headers = await AUTH_MULTYPART_HEADERS2();
      console.log('📌 Headers being sent:', headers);

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (
            key === 'logo' &&
            value &&
            typeof value === 'object' &&
            value.uri
          ) {
            console.log(`🖼 Appending file field '${key}':`, value);
            // formData.append('state', selectedStateName.trim());

            formData.append('logo', {
              uri: value.uri,
              name: value.fileName || value.name || 'logo.jpg',
              type: value.type || 'image/jpeg',
            });
          } else {
            console.log(`✏ Appending field '${key}':`, value);
            formData.append(key, value);
          }
        }
      });

      console.log('📦 FormData appended successfully — ready to send');

      const response = await axiosInstance.post(
        `${API_ENDPOINTS.ORGANISATIONPROFILE}`,
        formData,
        {headers},
      );

      console.log('✅ API Response:', response);
      await AsyncStorage.setItem(
        'company',
        response.data.profile?.company_name?.toString() || '',
      );
      await AsyncStorage.setItem('slug', response.data?.profile?.slug || '');
      return {success: true, data: response.data};
    } catch (error) {
      console.error('❌ API Error object:', error);
      console.error('📌 error.message:', error.message);
      console.error('📌 error.response?.status:', error.response?.status);
      console.error('📌 error.response?.data:', error.response?.data);
      console.error('📌 error.request:', error.request);

      return {success: false, error: error.response?.data || error.message};
    }
  },

  updateAgencyProfile: async payload => {
    try {
      console.log('📤 Payload received:', payload);

      const headers = await AUTH_MULTYPART_HEADERS2();
      console.log('📌 Headers being sent:', headers);

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (
            key === 'logo' &&
            value &&
            typeof value === 'object' &&
            value.uri
          ) {
            console.log(`🖼 Appending file field '${key}':`, value);
            // formData.append('state', selectedStateName.trim());

            formData.append('logo', {
              uri: value.uri,
              name: value.fileName || value.name || 'logo.jpg',
              type: value.type || 'image/jpeg',
            });
          } else {
            console.log(`✏ Appending field '${key}':`, value);
            formData.append(key, value);
          }
        }
      });

      console.log('📦 FormData appended successfully — ready to send');

      const response = await axiosInstance.post(
        `${API_ENDPOINTS.AGENCYPROFILE}`,
        formData,
        {headers},
      );

      console.log('✅ API Response:', response);

      return {success: true, data: response.data};
    } catch (error) {
      console.error('❌ API Error object:', error);
      console.error('📌 error.message:', error.message);
      console.error('📌 error.response?.status:', error.response?.status);
      console.error('📌 error.response?.data:', error.response?.data);
      console.error('📌 error.request:', error.request);

      return {success: false, error: error.response?.data || error.message};
    }
  },

  updateResourceProfile: async payload => {
    try {
      console.log('📤 Payload received:', payload);

      const headers = await AUTH_MULTYPART_HEADERS2();
      console.log('📌 Headers being sent:', headers);

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (
            key === 'logo' &&
            value &&
            typeof value === 'object' &&
            value.uri
          ) {
            console.log(`🖼 Appending file field '${key}':`, value);
            // formData.append('state', selectedStateName.trim());

            formData.append('logo', {
              uri: value.uri,
              name: value.fileName || value.name || 'logo.jpg',
              type: value.type || 'image/jpeg',
            });
          } else {
            console.log(`✏ Appending field '${key}':`, value);
            formData.append(key, value);
          }
        }
      });

      console.log('📦 FormData appended successfully — ready to send');

      const response = await axiosInstance.post(
        `${API_ENDPOINTS.RESOURCEPROFILE}`,
        formData,
        {headers},
      );

      console.log('✅ API Response:', response);

      return {success: true, data: response.data};
    } catch (error) {
      // console.error("❌ API Error object:", error);
      // console.error("📌 error.message:", error.message);
      // console.error("📌 error.response?.status:", error.response?.status);
      // console.error("📌 error.response?.data:", error.response?.data);
      // console.error("📌 error.request:", error.request);

      return {success: false, error: error.response?.data || error.message};
    }
  },

  updateLawyerProfile: async payload => {
    try {
      console.log('📤 Payload received:', payload);

      const headers = await AUTH_MULTYPART_HEADERS2();
      console.log('📌 Headers being sent:', headers);

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (
            key === 'logo' &&
            value &&
            typeof value === 'object' &&
            value.uri
          ) {
            console.log(`🖼 Appending file field '${key}':`, value);
            // formData.append('state', selectedStateName.trim());

            formData.append('logo', {
              uri: value.uri,
              name: value.fileName || value.name || 'logo.jpg',
              type: value.type || 'image/jpeg',
            });
          } else {
            console.log(`✏ Appending field '${key}':`, value);
            formData.append(key, value);
          }
        }
      });

      console.log('📦 FormData appended successfully — ready to send');

      const response = await axiosInstance.post(
        `${API_ENDPOINTS.LAWYERPROFILE}`,
        formData,
        {headers},
      );

      console.log('✅ API Response:', response);

      return {success: true, data: response.data};
    } catch (error) {
      console.error('❌ API Error object:', error);
      console.error('📌 error.message:', error.message);
      console.error('📌 error.response?.status:', error.response?.status);
      console.error('📌 error.response?.data:', error.response?.data);
      console.error('📌 error.request:', error.request);

      return {success: false, error: error.response?.data || error.message};
    }
  },

  //AGENCY API'S
  getAgencyDashboard: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.AGENCYDASHBOARD,
        headers,
      );

      console.log('getAgencyDashboard', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  getAgencyDashboardSecRow: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.AGENCYDASHBOARDSECROW,
        headers,
      );

      console.log('getAgencyDashboard 34', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },
  getAgencyDashboardGraphDetails: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.AGENCYDASHBOARDGRAPHDETAILS,
        headers,
      );

      console.log('getAgencyDashboardGraphDetails 342', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },

  // LAWYER API'S
  getTopResource: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.TOPRESOURCE,
        headers,
      );

      console.log('getTopResource', response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch subscription status',
        status: error.response?.status || 500,
      };
    }
  },

  getOrganistionProfileList: async data => {
    console.log('dataata ', data);

    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }&search=${data?.country || 0}`;

      // Add search parameter if provided
      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.GETORGANISATIONPROFILE + queryParams,
        headers,
      );

      console.log('getOrganistionProfileList response', response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching organisation profiles:', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error:
          error.response?.data || 'Failed to fetch Organisation Profile List',
        status: error.response?.status || 500,
      };
    }
  },
  getJobProfileList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.JOBPROFILES + queryParams,
        headers,
      );

      console.log('getJobProfileList', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching organisation profiles:', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error:
          error.response?.data || 'Failed to fetch Organisation Profile List',
        status: error.response?.status || 500,
      };
    }
  },

  getJobsList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit}&offset=${data?.offset || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.JOBSLIST + queryParams,
        headers,
      );

      console.log('getJobsList', response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching organisation profiles:', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error:
          error.response?.data || 'Failed to fetch Organisation Profile List',
        status: error.response?.status || 500,
      };
    }
  },

  getMSAContractorList: async data => {
    try {
      const config = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSACONTRACTORLIST}/?limit=${
          data?.limit || LIMIT_DATA
        }&offset=${data?.offset || 0}`,
        config,
      );

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Contractor', {
        status: error.response?.status,
        data: error.response?.data,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Contractor List',
        status: error.response?.status || 500,
      };
    }
  },

  getMSAServiceList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `/?limit=${data?.limit}&offset=${data?.offset || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.MSASERVICELIST + queryParams,
        headers,
      );

      console.log('Service', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Service', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Service List',
        status: error.response?.status || 500,
      };
    }
  },
  getMSAStatusList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }&status=${data?.status || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.MSAALLSTATUS + queryParams,
        headers,
      );

      console.log('Status', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Status', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Status List',
        status: error.response?.status || 500,
      };
    }
  },

  getMSAAllList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      if (!data) {
        throw new Error('Slug is required for fetching MSA List');
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSADETAIL}/?limit=${data?.limit}&offset=${
          data?.offset || 0
        }`,
        headers,
      );

      console.log('MSA List Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching MSA List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch MSA List',
        status: error.response?.status || 500,
      };
    }
  },
  getMSADetail: async data => {
    console.log('datadatadata', data);

    try {
      const headers = await AUTH_HEADERS();

      if (!data) {
        throw new Error('Slug is required for fetching MSA detail');
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSADETAIL}/${data}/`,
        headers,
      );

      console.log('MSA Detail Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching MSA Detail', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch MSA Detail',
        status: error.response?.status || 500,
      };
    }
  },

  getMSAApprovalList: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSADETAIL}/?status=pending_approval`,
        headers,
      );

      console.log('MSAApprovalList  Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching MSA Approval List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch MSA Approval List',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWApprovalList: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWDETAIL}?status=pending_approval`,
        headers,
      );

      console.log('SOWApprovalList  Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching SOW Approval List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch SOW Approval List',
        status: error.response?.status || 500,
      };
    }
  },

  updateMSADetail: async (slug, payload) => {
    try {
      const headers = await AUTH_HEADERS();

      if (!slug) {
        throw new Error('Slug is required for fetching MSA detail');
      }

      const formattedPayload = {
        ...payload,
        start_date: payload.start_date
          ? dayjs(payload.start_date).format('YYYY-MM-DD HH:mm:ss')
          : null,
        end_date: payload.end_date
          ? dayjs(payload.end_date).format('YYYY-MM-DD HH:mm:ss')
          : null,
      };

      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATEMSA}/${slug}/`,
        formattedPayload,
        headers,
      );

      console.log('Update MSA Detail Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error Update MSA Detail', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to Update MSA Detail',
        status: error.response?.status || 500,
      };
    }
  },

  getMSAFields: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSAFIELDSDROPDOWN}`,
        headers,
      );

      console.log('MSAFields Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching MSA Fields', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch MSA Fields ',
        status: error.response?.status || 500,
      };
    }
  },

  getCurrencyDetails: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.CURRENCYDETAILS}`,
        headers,
      );

      console.log('getCurrencyDetails', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Currency Details', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Currency Details ',
        status: error.response?.status || 500,
      };
    }
  },

  getCurrency: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GETCURRENCY}`,
        headers,
      );

      console.log('getCurrency', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Currency ', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Currency  ',
        status: error.response?.status || 500,
      };
    }
  },
  getPaymentTermsList: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.PAYMENTTERMSDROPDOWNCREATEMSA}`,
        headers,
      );

      console.log('getPaymentTermsList', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Payment Terms List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Payment Terms List ',
        status: error.response?.status || 500,
      };
    }
  },

  updateMSAStatus: async (slug, payload) => {
    try {
      const headers = await AUTH_HEADERS();

      if (!slug) {
        throw new Error('Slug is required for updating MSA status');
      }

      // slug in query parameter
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATEMSA}/${slug}/`,
        payload,
        headers,
      );

      console.log('Update MSA Status Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error updating MSA Status', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to update MSA Status',
        status: error.response?.status || 500,
      };
    }
  },

  updateSOWStatus: async (slug, payload) => {
    try {
      console.log('🔹 updateSOWStatus called with:', {slug, payload});

      const headers = await AUTH_HEADERS();
      console.log('✅ Headers generated:', headers);

      if (!slug) {
        throw new Error('❌ Slug is required for updating SOW status');
      }

      // slug in query parameter
      console.log(
        `📡 Making PATCH request to: ${API_ENDPOINTS.UPDATESOW}${slug}/`,
      );
      console.log('📦 Payload:', payload);

      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATESOW}${slug}/`,
        payload,
        headers,
      );

      console.log('✅ Update SOW Status Response:', {
        status: response.status,
        data: response.data,
      });

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('❌ Error updating SOW Status:', {
        message: error.message,
        config: error.config,
        request: error.request,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        error:
          error.response?.data ||
          error.message ||
          'Failed to update SOW Status',
        status: error.response?.status || 500,
      };
    }
  },

  getSowContractorList: async data => {
    console.log('&offset=${data?.offset || 0}', data);

    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }&date_from=${data?.date_from || 0}&date_to=${
        data?.date_to || 0
      }&sow_type=${data?.sow || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.SOWCONTRACTORLIST + queryParams,
        headers,
      );

      console.log('getSOWContractorList', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching SOW Contractor', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch SOW Contractor List',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWDetail: async data => {
    console.log('datadatadata', data);

    try {
      const headers = await AUTH_HEADERS();

      if (!data) {
        throw new Error('Slug is required for fetching SOW detail');
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWDETAIL}${data}/`,
        headers,
      );

      console.log('SOW Detail Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching SOW Detail', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch SOW Detail',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWFields: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWFIELDSDROPDOWN}`,
        headers,
      );

      console.log('SOWFields Response', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching SOW Fields', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch SOW Fields ',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWServiceList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.SOWSERVICELIST + queryParams,
        headers,
      );

      console.log('Service', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Service', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Service List',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWStatusList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${
        data?.offset || 0
      }&status=${data?.status || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.SOWALLSTATUS + queryParams,
        headers,
      );

      console.log('Status', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Status', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Status List',
        status: error.response?.status || 500,
      };
    }
  },

  updateSOWDetail: async (slug, payload) => {
    console.log('payload', payload);
    console.log('slug', slug);

    try {
      const headers = await AUTH_MULTYPART_HEADERS();

      if (!slug) {
        throw new Error('Slug is required for updating SOW');
      }

      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATESOW}${slug}/`,
        payload,
        headers,
      );

      console.log('Update SOW Detail Response', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Error Update SOW Detail', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to Update SOW Detail',
        status: error.response?.status || 500,
      };
    }
  },

  createSOW: async payload => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.CREATESOW}`,
        payload,
        headers,
      );

      console.log('response of createSOW', response);
      return {success: true, data: response.data};
    } catch (error) {
      console.error('Error creating SOW:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  createServiceSOW: async payload => {
    try {
      console.log(
        '🔹 createServiceSOW called with payload (FormData):',
        payload,
      );

      const headers = await AUTH_MULTYPART_HEADERS();
      console.log('🔹 Headers being sent:', headers);

      console.log('🔹 Endpoint:', API_ENDPOINTS.CREATESERVICESOW);

      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATESERVICESOW,
        payload,
        headers,
      );

      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', JSON.stringify(response.data, null, 2));

      return {success: true, data: response.data};
    } catch (error) {
      console.error('❌ Error creating SOW:');

      if (error.response) {
        console.error('👉 Status:', error.response.status);
        console.error('👉 Data:', JSON.stringify(error.response.data, null, 2));
        console.error('👉 Headers:', error.response.headers);
      } else if (error.request) {
        console.error(
          '👉 No response received. Request object:',
          error.request,
        );
      } else {
        console.error('👉 Request setup error:', error.message);
      }

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  updateServiceDetail: async (originalSlug, formData) => {
    try {
      console.log(
        '🔹 updateServiceDetail called with payload (FormData):',
        formData,
      );
      console.log('originalSlug', originalSlug);

      const headers = await AUTH_MULTYPART_HEADERS();
      console.log('🔹 Headers being sent:', headers);

      console.log('🔹 Endpoint:', API_ENDPOINTS.CREATESERVICESOW);

      const response = await axiosInstance.post(
        // API_ENDPOINTS.CREATESERVICESOW,
        `${API_ENDPOINTS.CREATESERVICESOW}?slug=${originalSlug}`,
        formData,
        headers,
      );

      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', JSON.stringify(response.data, null, 2));

      return {success: true, data: response.data};
    } catch (error) {
      console.error('❌ Error update Service  SOW:');

      if (error.response) {
        console.error('👉 Status:', error.response.status);
        console.error('👉 Data:', JSON.stringify(error.response.data, null, 2));
        console.error('👉 Headers:', error.response.headers);
      } else if (error.request) {
        console.error(
          '👉 No response received. Request object:',
          error.request,
        );
      } else {
        console.error('👉 Request setup error:', error.message);
      }

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  getTimeSheetList: async data => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit}&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.TIMESHEET + queryParams,
        headers,
      );

      console.log('TimeSheetList', response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Time Sheet List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Time Sheet List',
        status: error.response?.status || 500,
      };
    }
  },
  getMasterMaterialListBySerach: async data => {
    console.log('getMasterMaterialListBySerach', data);

    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit}&offset=${data?.offset || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.MASTERMATERIALLIST + queryParams,
        headers,
      );

      console.log('getMasterMaterialListBySerach', response);

      return {
        success: true,
        data: response.data.results,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data ||
          'Failed to fetch Serached Master Material List ',
        status: error.response?.status || 500,
      };
    }
  },

  getMaterialDetails: async materialUid => {
    console.log('getMaterialDetails', materialUid);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MATERIAL_DETAILS}/${materialUid}/`,
        headers,
      );

      console.log('getMaterialDetails', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data ||
          'Failed to fetch Serached Master Material List ',
        status: error.response?.status || 500,
      };
    }
  },

  createSignWellDocument: async documentData => {
    console.log('documentData', documentData);

    try {
      const response = await fetch(SIGNWELL_API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': API_KEY,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      console.log('responseresponse', response);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error: ${error.message}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was an error creating the document:', error);
      throw error;
    }
  },

  createDraftDocument: async (fileUrl, title) => {
    try {
      const payload = {
        name: title,
        draft: true,
        embedded_edit_url: true, // return embedded edit URL
        embedded_signing: false, // not signing yet, just edit/add contacts
        files: [
          {file_url: fileUrl}, // or use file_base64
        ],
      };

      const response = await signwellAxios.post('/documents', payload);
      return {success: true, data: response.data};
    } catch (error) {
      console.error(
        '❌ Error creating draft:',
        error.response?.data || error.message,
      );
      return {success: false, error: error.response?.data || error.message};
    }
  },

  checkStatusSignWellDocument: async id => {
    try {
      const response = await fetch(`${SIGNWELL_API_URL}${id}/`, {
        method: 'GET',
        headers: {
          'X-Api-Key': API_KEY || '',
          Accept: 'application/json',
        },
      });
      console.log('response checkStatusSignWellDocument', response);

      if (!response.ok) {
        const error = await response.json();
        return {status: false, message: error.message};
      }

      const data = await response.json();
      return {status: true, data};
    } catch (error) {
      console.error('❌ Error retrieving document:', error);
      return {status: false, message: error.message || 'Unknown error'};
    }
  },

  updateEsignDocStatus: async id => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS2();

      await axiosInstance.patch(`${API_URL}/esign/document/${id}/`, headers);

      return {success: true};
    } catch (error) {
      // console.error('Delete document error:', error);

      return {
        success: false,
        error: {
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            'Failed to update document',
        },
      };
    }
  },
  deleteEsignDoc: async id => {
    try {
      const headers = await AUTH_HEADERS();

      await axiosInstance.delete(`${API_URL}/esign/document/${id}/`, headers);

      return {success: true};
    } catch (error) {
      console.error('Delete document error:', error);

      return {
        success: false,
        error: {
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            'Failed to delete document',
        },
      };
    }
  },

  sendEsignDocsAction: async payload => {
    try {
      const url = API_ENDPOINTS.ESIGN; // full URL now
      const headers = {
        'Content-Type': 'application/json',
        ...AUTH_HEADERS(),
      };

      console.log('📤 Sending Esign Docs:');
      console.log('➡️ URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      console.log('📥 Raw response:', response);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Backend error:', error);
        return {status: false, message: error.message};
      }

      const data = await response.json();
      console.log('✅ Backend success:', data);
      return {status: true, data};
    } catch (error) {
      console.error('❌ Error sending esign docs:', error);
      return {status: false, message: error.message || 'Unknown error'};
    }
  },

  getCompletedSignWellDocument: async id => {
    try {
      const response = await fetch(
        `${SIGNWELL_API_URL}${id}/completed_pdf/?url_only=false&audit_page=true`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': API_KEY,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return {status: false, message: error.message};
      }

      // The response is a binary PDF file, so we should handle it as a blob
      const blob = await response.blob();

      // Convert the blob to a URL to display in an iframe
      const pdfUrl = URL.createObjectURL(blob);
      return {status: true, pdfUrl: pdfUrl, blob: blob};
    } catch (error) {
      console.error('There was an error retrieving the document:', error);
      throw error;
    }
  },

  sendeSignDocsSaga: async payload => {
    try {
      console.log('🔹 sendeSignDocsSaga called with payload :', payload);

      const headers = await AUTH_HEADERS();
      console.log('🔹 Headers being sent:', headers);

      console.log('🔹 Endpoint:', API_ENDPOINTS.ESIGNDOCLIST);

      const response = await axiosInstance.post(
        API_ENDPOINTS.ESIGNDOCLIST,
        payload,
        headers,
      );

      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', JSON.stringify(response.data, null, 2));

      return {success: true, data: response.data};
    } catch (error) {
      console.error('❌ Error sendeSignDocsSaga:');

      if (error.response) {
        console.error('👉 Status:', error.response.status);
        console.error('👉 Data:', JSON.stringify(error.response.data, null, 2));
        console.error('👉 Headers:', error.response.headers);
      } else if (error.request) {
        console.error(
          '👉 No response received. Request object:',
          error.request,
        );
      } else {
        console.error('👉 Request setup error:', error.message);
      }

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
  createMasterData: async data => {
    const headers = await AUTH_MULTYPART_HEADERS();

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.MASTERDTATA,
        data,
        headers,
      );
      return response.data;
    } catch (error) {
      console.error('Error creating master data:', error);
      throw error;
    }
  },
  getMasterData: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MASTERDTATA);
      return response.data;
    } catch (error) {
      console.error('Error creating master data:', error);
      throw error;
    }
  },
  addFavorites: async data => {
    console.log('data...', data);

    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ADDFAVORITES,
        data,
        headers,
      );
      console.log('response...', response);

      return response.data;
    } catch (error) {
      console.error('Error creating master data:', error);
      throw error;
    }
  },
  getFavorites: async data => {
    const headers = await AUTH_HEADERS();
    console.log('datatat', data);

    try {
      let queryParams = `?limit=${data?.limit}&offset=${data?.offset || 0}`;
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADDFAVORITES + queryParams,

        headers,
      );
      console.log('response.34..', response);

      return response.data;
    } catch (error) {
      console.error('Error creating master data:', error);
      throw error;
    }
  },

  getAllMSAList: async data => {
    const headers = await AUTH_HEADERS();
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.MSA_ALL_DROPDOWN_LIST_V2 +
          `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      return {
        success: true,
        data: response.data.data.results,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch All MSA List',
        status: error.response?.status || 500,
      };
    }
  },
  getAiResponseV2: async data => {
    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.NEW_AI_DRAFT_V2,
        data,
        headers,
      );
      console.log('response', response);
      console.log('response2', response.data.message);

      return {
        success: true,
        data: response,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch AiResponse',
        status: error.response?.status || 500,
      };
    }
  },

  // -------------------------
  // 1️⃣ Get All Notifications
  // -------------------------
  getAllNotification: async data => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_URL + 'common/notification/',
        headers,
      );
      console.log('dat3', data);
      console.log('dat4', response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log('getAllNotification error:', error);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch notifications',
        status: error.response?.status || 500,
      };
    }
  },

  // -------------------------
  // 2️⃣ Update Notification
  // -------------------------
  updateNotification: async data => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.patch(
        API_URL + 'common/notification/' + data?.id + '/',
        data,
        headers,
      );

      if (response?.data?.success) {
        toast.success('Request sent successfully');
        return {
          success: true,
          data: response.data.data,
          status: response.status,
        };
      } else {
        toast.error(response?.data?.message);
        return {
          success: false,
          error: response?.data?.message,
          status: response.status,
        };
      }
    } catch (error) {
      console.log('updateNotification error:', error);
      toast.error('Network Error');
      return {
        success: false,
        error: error.response?.data || 'Failed to update notification',
        status: error.response?.status || 500,
      };
    }
  },

  // ------------------------------------
  // 3️⃣ Accept / Reject Connection Request
  // ------------------------------------
  // Services.js
  acceptRejectConnectReq: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.patch(
        `${API_URL}accounts/user_connections/${data.id}/`,
        data,
        headers,
      );
      return {
        success: response.data.success,
        data: response.data.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data || 'Failed to accept/reject connection request',
        status: error.response?.status || 500,
      };
    }
  },

  // -------------------------
  // 4️⃣ Delete Notification
  // -------------------------
  deleteNotificationReq: async data => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.patch(
        API_URL + 'common/notification/' + data?.id + '/',
        data,
        headers,
      );

      if (response?.data?.success) {
        toast.success('Request sent successfully');
        return {
          success: true,
          data: response.data.data,
          status: response.status,
        };
      } else {
        toast.error(response?.data?.message);
        return {
          success: false,
          error: response?.data?.message,
          status: response.status,
        };
      }
    } catch (error) {
      console.log('deleteNotificationReq error:', error);
      toast.error('Network Error');
      return {
        success: false,
        error: error.response?.data || 'Failed to delete notification',
        status: error.response?.status || 500,
      };
    }
  },

  // Add this new method for Google Docs download
  downloadGoogleDoc: async (templateId, accessToken) => {
    try {
      const access_token = await AsyncStorage.getItem('Token');
      console.log('access_token', access_token);

      const response = await fetch(
        `${API_URL}ai/draft-template/${templateId}/save_as_google_doc/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: accessToken,
            id: templateId,
          }),
        },
      );
      console.log('ressss', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Google Docs download error:', error);
      throw error;
    }
  },

  googleSubcription: async payload => {
    console.log('payload', payload);

    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.GOOGLESUBCRIPTION}`,
        payload,
        headers,
      );

      console.log('googleSubcription', response);
      return {success: true, data: response.data};
    } catch (error) {
      console.error('Error creating SOW:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
  getFullJobPost: async id => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.FULLJOBPOST}/${id}/`,
        {
          params: {show_all: true},
          ...headers,
        },
      );

      return {success: true, data: response.data};
    } catch (error) {
      console.error('error getting job post :', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
  createJobApplication: async payload => {
    console.log('createJobApplication', payload);

    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.CREATEJOBAPPLICATION}`,
        payload,
        headers,
      );

      console.log('createJobApplication', response);
      return {success: true, data: response.data};
    } catch (error) {
      console.error('Error create Job Application:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
  getSkillDropDownList: async payload => {
    console.log('getSkillDropDownList', payload);

    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SKILLDROPDOW}`,
        headers,
      );

      console.log('getSkillDropDownList', response);
      return {success: true, data: response.data};
    } catch (error) {
      console.error('Error get Skill DropDown List:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  getResourceDashboard: async id => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.RESOURCEDASHBOARD}`,
        {
          ...headers,
        },
      );

      return {success: true, data: response.data};
    } catch (error) {
      console.error('error get Resource Dashboard  :', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  getTalentUserProfile: async slug => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GETTALENTUSERPROFILE}${slug}/`,
        headers,
      );
      console.log('getTalentUserProfile', response);

      return {success: true, data: response.data};
    } catch (error) {
      console.error('error get Talent User Profile :', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
  getAllTalentUserProfile: async params => {
    console.log('pr', params);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        API_ENDPOINTS.GETTALENTUSERPROFILE,
        {
          ...headers,
          params,
        },
      );
      console.log('response 2111', response);

      return {success: true, data: response.data};
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  updateTalentUserProfile: async formData => {
    console.log('updateTalentUserProfile', formData);

    try {
      const headers = await AUTH_MULTYPART_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.UPDATETALENTUSERPROFILE,
        formData,
        headers,
      );
      console.log('response 5', response);

      return {success: true, data: response.data};
    } catch (error) {
      console.error('error update Talent User Profile :', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  getTopOrganisationDetailsTalent: async slug => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ORGANISATIONPROFILE}${slug}/`,
        headers,
      );
      console.log('getTopOrganisationDetailsTalent', response);

      return {success: true, data: response.data};
    } catch (error) {
      console.error('error getTopOrganisationDetailsTalent :', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
  aiContractQueries: async data => {
    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AIQUERIES,
        data,
        headers,
      );
      console.log('aiContractQueries', response);
      console.log('aiContractQueries 2', response.data.message);

      return {
        success: true,
        data: response,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to Send Contract Query',
        status: error.response?.status || 500,
      };
    }
  },

  jobPost: async data => {
    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.JOBPOST,
        data,
        headers,
      );
      console.log('jobPost', response);
      console.log('jobPost', response.data.message);

      return {
        success: true,
        data: response,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to Post job',
        status: error.response?.status || 500,
      };
    }
  },

  getPostedJob: async data => {
    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.JOBPOST + `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      console.log('getjobPost', response);
      console.log('getjobPost', response.data.message);

      return {
        success: true,
        data: response.data,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to Post job',
        status: error.response?.status || 500,
      };
    }
  },
  getPostedJobD: async data => {
    const headers = await AUTH_HEADERS();
    console.log('daas', data);

    const query = new URLSearchParams({
      limit: data?.limit?.toString() || '10',
      offset: data?.offset?.toString() || '0',
      ...(data?.id && {job_id: data.id.toString()}),
    }).toString();

    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.JOBPOST}?${query}`,
        headers,
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch jobs',
        status: error.response?.status || 500,
      };
    }
  },

  updatePostedJob: async data => {
    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.JOBPOST,
        data,
        headers,
      );
      console.log('getjobPost', response);
      console.log('getjobPost', response.data.message);

      return {
        success: true,
        data: response,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to Post job',
        status: error.response?.status || 500,
      };
    }
  },
  deletePostedJob: async jobId => {
    const headers = await AUTH_HEADERS();
    console.log('delete', jobId);

    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.JOBPOST}${jobId?.id}`,
        headers,
      );

      console.log('delete job', response);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to delete job',
      };
    }
  },

  getTalentProfileResourceDetails: async slug => {
    console.log('getTalentProfileResourceDetails', slug);

    const headers = await AUTH_HEADERS();

    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TALENTRESOURCEPROFILEDETAILS}${slug}/`,
        headers,
      );
      console.log('getTalentProfileResourceDetails', response);
      console.log('getTalentProfileResourceDetails2', response.data.message);

      return {
        success: true,
        data: response,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to get Talent Profile Details',
        status: error.response?.status || 500,
      };
    }
  },

  getTaxGroups: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TAXGROUPS}`,
        headers,
      );
      console.log('tax gr', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  submitTaxGroup: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.TAXGROUPS}/${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.TAXGROUPS}`,
            payload,
            headers,
          );
      console.log('response.data', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  submitCompanyLocation: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.COMPANYLOCATION}/${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.COMPANYLOCATION}`,
            payload,
            headers,
          );
      console.log('response.data', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  getCompanyLocation: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COMPANYLOCATION}`,
        headers,
      );
      console.log('tax gr', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getGlAccounts: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GLACCOUNTS}`,
        headers,
      );
      console.log('tax gr', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  addGlAccount: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.GLACCOUNTS}/${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.GLACCOUNTS}`,
            payload,
            headers,
          );
      console.log('response.data', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getBusineUnit: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.BUSINESSUNITS}`,
        headers,
      );
      console.log('getBusineUnit', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  addBusinessUnit: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.BUSINESSUNITS}/${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.BUSINESSUNITS}`,
            payload,
            headers,
          );
      console.log('response.data', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getCostCenter: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COSTCENTER}`,
        headers,
      );
      console.log('COSTCENTER', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  addCostCenter: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.COSTCENTER}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.COSTCENTER}`,
            payload,
            headers,
          );
      console.log('response.data', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getMsaFileds: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSAFILED}`,
        headers,
      );
      console.log('getMsaFileds', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  getLawyerSpecialization: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.LAWYERSPECIALIZATION}`,
        headers,
      );
      console.log('getLawyerSpecialization', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  getMsaType: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSATYPE}`,
        headers,
      );
      console.log('getMsaType', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addMsaType: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.MSATYPE}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.MSATYPE}`,
            payload,
            headers,
          );
      console.log(' addMsaType', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  getUnpscCode: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.UNPSCCODE}`,
        headers,
      );
      console.log('UnpscCode', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addUnpscCode: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.UNPSCCODE}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.UNPSCCODE}`,
            payload,
            headers,
          );
      console.log(' UnpscCode', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  getTaxRate: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TAXRATE}`,
        headers,
      );
      console.log('.TAXRATE', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addTaxRate: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.TAXRATE}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.TAXRATE}`,
            payload,
            headers,
          );
      console.log(' .TAXRATE', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },
  getPayementTerms: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.PAYMENTTERMS}`,
        headers,
      );
      console.log('PaymentTerms', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addPaymentTerms: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.PAYMENTTERMS}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.PAYMENTTERMS}`,
            payload,
            headers,
          );
      console.log(' addPaymentTerms', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getSowType: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWTYPE}`,
        headers,
      );
      console.log('SOWTYPE', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addSowType: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.SOWTYPE}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.SOWTYPE}`,
            payload,
            headers,
          );
      console.log('SOWTYPE', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getExpensesCategory: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.EXPENSESCATEGORY}`,
        headers,
      );
      console.log('ExpensesCategory', response);

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addExpensesCategory: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.EXPENSESCATEGORY}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.EXPENSESCATEGORY}`,
            payload,
            headers,
          );
      console.log('ExpensesCategory', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getIncomeTaxSlabs: async params => {
    console.log('params ', params);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(API_ENDPOINTS.INCOMETAXSLABS, {
        ...headers,
        params,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  getMaterialMasterData: async () => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MATERIALMASTERDATA}`,
        headers,
      );

      return {
        success: true,
        data: response.data || [],
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  addMaterialMasterData: async (slug, payload) => {
    console.log('form', payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = slug
        ? await axiosInstance.patch(
            `${API_ENDPOINTS.MATERIALMASTERDATA}${slug}/`,
            payload,
            headers,
          )
        : await axiosInstance.post(
            `${API_ENDPOINTS.MATERIALMASTERDATA}`,
            payload,
            headers,
          );
      console.log('MaterialMasterData', response.data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed',
        status: error.response?.status || 500,
      };
    }
  },

  aiGeminai: async data => {
    const headers = await AUTH_MULTYPART_HEADERS();
    console.log('lof', data);

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.GEMINAI,
        data,
        headers,
      );
      console.log(' aiGeminai', response);
      console.log(' aiGeminai 2', response.data);

      return {
        success: true,
        data: response.data,
        status: response.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to Send Contract Query',
        status: error.response?.status || 500,
      };
    }
  },
};

export default Services;
