import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import { API_ENDPOINTS } from '../api/ApiManager/endpoint';
import { AUTH_HEADERS, AUTH_MULTYPART_HEADERS, HEADERS, MULTYPART_HEADERS } from '../Axios/axiosData';
import { authorize } from 'react-native-app-auth';
import dayjs from "dayjs";
import axios from 'axios';

export const API_KEY = 'YWNjZXNzOjhlMDI4YTlhODAyMjcwYzU3ZmE0ZjRiZWM4YzRjYjFj'; //live api
export const SIGNWELL_API_URL = 'https://www.signwell.com/api/v1/documents/';

const signwellAxios = axios.create({
  baseURL: SIGNWELL_API_URL,
  headers: {
    "Authorization": `Token ${API_KEY}`,
    "Content-Type": "application/json",
  },
});
// export const API_KEY = 'YWNjZXNzOjhlMDI4YTlhODAyMjcwYzU3ZmE0ZjRiZWM4YzRjYjFj'; //test api
// export const API_KEY = 'YWNjZXNzOjZiODE2Yzc1N2E2YzllMmZjOTFiNzZkMjA3Mjc4Y2Jl'; //live api
const Services = {

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.LOGIN,
        { email, password },

        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("response121212", response);


      const userData = response?.data;
      //       console.log("login userData ", userData);
      //       if (userData?.first_name && userData?.last_name) {
      //           console.log("Storing to AsyncStorage:", userData?.first_name, userData?.last_name);
      //         await AsyncStorage.setItem('first_Name', userData?.first_name);
      //         await AsyncStorage.setItem('last_Name', userData?.last_name);
      //         await AsyncStorage.setItem('Token', response.data.key);  
      // await new Promise(resolve => setTimeout(resolve, 100)); 
      // console.log("🧠 AsyncStorage key: Token =>", await AsyncStorage.getItem('Token'));
      // console.log("🧠 AsyncStorage key: email =>", await AsyncStorage.getItem('email'));
      // console.log("🧠 AsyncStorage key: first_Name =>", await AsyncStorage.getItem('first_Name'));
      // console.log("🧠 AsyncStorage key: last_Name =>", await AsyncStorage.getItem('last_Name'));

      //       }
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
    console.log("........access_token", access_token, "user_type", user_type);

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDACCESSTOKEN,
        {
          access_token,
          user_type
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("googleSignup response", response);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log(",,,,,,,error", error);

      return {
        success: false,
        error: error?.response?.data?.non_field_errors?.[0] || 'Google signup/login failed',
        status: error?.response?.status || 500,

      };
    }
  },
  sendAccessToken: async (access_token) => {
    try {
      console.log("trying sendAccessToken");

      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDACCESSTOKEN,
        { access_token },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("response  response", response);

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
        error: error.response?.data?.non_field_errors?.[0] || 'Google authentication failed',
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
  getCountryDetailsState: async data => {

    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.COUNTRIESDETAILSSTATES + `?&country=${data?.country}`,
        headers,
      );

      return {
        success: true,
        data: response.data.data[0]?.states || [],
        status: response.status,
      };
    } catch (error) {

      console.log('error config', error.config);
      console.log('error request', error.request);
      console.log('error response', error.response);
      console.log('error message', error.message);
      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Country Details State',
        status: error.response?.status || 500,
      };
    }
  },


searchCountry: async (query) => {
  try {
    const headers = await AUTH_HEADERS();
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.COUNTRIESSEARCH}?country=${query}&limit=10&offset=0`,
      headers
    );
    console.log("searchCountry response",response);
    
    return {
      success: true,
      data: response.data.results,
      status: response.status,
    };
  } catch (error) {
    console.error("Country search error:", error);
    return {
      success: false,
      error: error.response?.data || "Failed to search countries",
      status: error.response?.status || 500,
    };
  }
},


  analysisContractByAi: async (formData) => {
    try {

      const headers = await AUTH_MULTYPART_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.ANALYSISCONTRACT,
        formData,
        { headers }
      );
      console.log("response12", response);

      return {
        success: true,
        data: response.data.response,
        status: response.status,
      };
    } catch (error) {
      console.log("error", error);

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
        API_ENDPOINTS.SUPPLIERSLIST + `?&limit=${data?.limit}&offset=${data?.offset}`,
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
  sendConnectionSupplier: async (payload) => {
    try {
      const { headers } = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.CONNECTSUPPLIER,
        payload,
        { headers }
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
  signUp: async (payload) => {
    try {

      const response = await axiosInstance.post(
        API_ENDPOINTS.REGISTER,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("payload22", payload);

      console.log("response 2 signup", response);
      if (response.status === 200) {
        await AsyncStorage.setItem(
          "signUp_data",
          JSON.stringify({ email: payload.email })
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
  sendVerificationCode: async (payload) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDVERIFICATIONGAMILCODE,
        payload,
        { headers }
      );

      console.log('sendVerificationCode response', response);
      if (response.status === 200) {
        await AsyncStorage.setItem(
          "signUp_data",
          JSON.stringify({ email: payload.email })
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
  verifyCode: async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.VERIFYCODE,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('verifyCode response', response);
      if (response.status === 200) {
        await AsyncStorage.setItem("first_Name", response.data.payload.first_name || "");
        await AsyncStorage.setItem("last_Name", response.data.payload.last_name || "");
        await AsyncStorage.setItem("email", response.data.payload.email || "");
        await AsyncStorage.setItem("Token", response.data.key || "");

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
  getEsignDocList: async data => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.ESIGNDOCLIST + `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      console.log("getEsignDocList", response);

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
        error: error.response?.data || 'Failed to fetch User Profile Details List',
        status: error.response?.status || 500,
      };
    }
  },
  // updateUserProfileDetails: async (payload) => {
  //   try {
  //     const headers = await AUTH_MULTYPART_HEADERS();
  //     const response = await axiosInstance.post(
  //       API_ENDPOINTS.UPDATEUSERPROFILE,
  //       payload,
  //       headers,
  //     );
  //     console.log('updateUserProfileDetails', response);
  //     if (response.status === 200) {
  //       // await AsyncStorage.setItem("first_Name", response.data.payload.first_name || "");
  //       // await AsyncStorage.setItem("last_Name", response.data.payload.last_name || "");
  //       // await AsyncStorage.setItem("email", response.data.payload.email || "");
  //       // await AsyncStorage.setItem("Token", response.data.key || "");

  //     }

  //     return {
  //       success: true,
  //       data: response.data,
  //       status: response.status,
  //     };
  //   } catch (error) {
  //     console.log('error config', error.config);
  //     console.log('error request', error.request);
  //     console.log('error response', error.response);
  //     console.log('error message', error.message);

  //     return {
  //       success: false,
  //       error: error.response?.data || 'Failed to send update User Profile',
  //       status: error.response?.status || 500,
  //     };
  //   }
  // },

  updateUserProfileDetails: async (payload) => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.UPDATEUSERPROFILE,
        payload,
        { headers } // Fixed: headers wrapped in config object
      );

      if (response.status === 200) {
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


  forgetPassword: async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.FORGETEPASSWORD,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
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
  forgetPasswordReset: async (payload) => {

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.FORGETPASSWORDRESET,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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

  inviteUsers: async (payload) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(API_ENDPOINTS.INVITEUSER, payload, headers);
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
      // console.log('getLanguagesList response', response);

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
  generateUrl: async (payload) => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS();
      const response = await axiosInstance.post(API_ENDPOINTS.GENERATEURL, payload, { headers });
      console.log("responseurl", response);

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
  ai_Review: async (payload) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(API_ENDPOINTS.AI_REVIEW, payload, headers);
      console.log("responseurl", response);

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
  linkedinLogin: async (payload) => {
    console.log("111111", payload);

    try {
      const headers = MULTYPART_HEADERS;

      const response = await axiosInstance.post(API_ENDPOINTS.LINKEDINLOGIN, payload, headers);
      console.log("linkedinLogin", response);
      console.log("headers", headers);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log("error11111", error);

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
  updatePrivacySettings: async (data) => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS();
      console.log("updatePrivacySettings headers", headers);

      // Corrected API call with proper parameters
      const response = await axiosInstance.patch(
        API_ENDPOINTS.UPDATEPRIVACYSETTINGS,
        data,
        { headers }
      );
      console.log("updatePrivacySettings response23", response);

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
      console.log("getSubscriptionPlanDetails", response);

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
        error: error.response?.data || 'Failed to fetch Subscription Plan Details List',
        status: error.response?.status || 500,
      };
    }
  },

  initiatepaymentsub: async (payload) => {
    console.log("initiatepaymentsub payload", payload);

    try {
      const { headers } = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.SUBSCRIPTIONINITIATEPAYMENT,
        payload,
        { headers } // ✅ Correct format
      );

      console.log("initiatepaymentsub ressss", response);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.log("error11111", error);
      console.log("error response", error.response);
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
      const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONSTATUS, headers);

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
      const { headers } = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.SUBSCRIPTIONCANCEL,
        {},
        { headers }
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
      const response = await axiosInstance.get(API_ENDPOINTS.HASPREMIUMDETAILS, headers);

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

      const response = await axiosInstance.get(API_ENDPOINTS.USERORDERDETAILS, headers);

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

      const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTDETAILS, headers);

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
  deleteUserAccount: async (deletePassword) => {
    console.log("deletePassword", deletePassword);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.DELETEUSERACCOUNT,
        { password: deletePassword },
        headers
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
  Ai_Draft: async (payload) => {
    console.log("payload", payload);

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.AIDRAFT,
        payload,
        headers
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


  saveDraftTemplate: async (payload) => {

    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.post(
        API_ENDPOINTS.SAVEDRAFTTEMPLATE,
        payload,
        headers
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

  getAllTemplate: async (data) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        API_ENDPOINTS.ALLTEMPLATES + `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers
      );
      console.log("getAllTemplate", response);

      return response.data;
    } catch (error) {
      console.error('getTemplatePDF error', error);
      throw error;
    }
  },


  getTemplatePDF: async (templateId) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `ai/draft-template/${templateId}/download_pdf/`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error('getTemplatePDF error', error);
      throw error;
    }
  },
  getTemplateDocx: async (templateId) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.get(
        `ai/draft-template/${templateId}/download_docx/`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error('getTemplateDOCX error', error);
      throw error;
    }
  },

  //Organisation Api's

  getOrganisationDashboard: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(API_ENDPOINTS.ORGANISATIONDASHBOARD, headers);

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
  getMasterDataList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.MASTERDATALIST + queryParams,
        headers
      );

      console.log("getMasterDataList response", response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count, // Make sure your API returns total count
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching  Master Data List', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Master Data List',
        status: error.response?.status || 500,
      };
    }
  },
  updateUserProfile: async (payload) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.UPDATEUSERPROFILE}`,
        payload,
        { headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  getApproverCoustom: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}&approver_for=${data?.msa}`;

      // Add search parameter if provided
      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.APPROVERCUSTOMUSER + queryParams,
        headers
      );

      console.log("getApproverCoustom response", response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count, // Make sure your API returns total count
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching  Coustom Approver ', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Coustom Approver ',
        status: error.response?.status || 500,
      };
    }
  },
  createMSA: async (payload) => {
    try {
      const headers = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.CREATEMSA}`,
        payload,
        headers
      );
      console.log("response of createMSA", response);

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },
  // Agency Api's

  updateOrganizationProfile: async (payload) => {
    try {
      console.log("📤 Payload received:", payload);

      const headers = await AUTH_MULTYPART_HEADERS();
      console.log("📌 Headers being sent:", headers);

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'logo' && value && typeof value === 'object' && value.uri) {
            console.log(`🖼 Appending file field '${key}':`, value);
            formData.append('state', selectedStateName.trim());

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

      console.log("📦 FormData appended successfully — ready to send");

      const response = await axiosInstance.post(
        `${API_ENDPOINTS.ORGANISATIONPROFILE}`,
        formData,
        { headers }
      );

      console.log("✅ API Response:", response);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ API Error object:", error);
      console.error("📌 error.message:", error.message);
      console.error("📌 error.response?.status:", error.response?.status);
      console.error("📌 error.response?.data:", error.response?.data);
      console.error("📌 error.request:", error.request);

      return { success: false, error: error.response?.data || error.message };
    }
  },



  //AGENCY API'S
  getAgencyDashboard: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(API_ENDPOINTS.AGENCYDASHBOARD, headers);

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


  // LAWYER API'S
  getTopResource: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(API_ENDPOINTS.TOPRESOURCE, headers);

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

  //   getOrganistionProfileList: async data => {
  //   try {
  //     const headers = await AUTH_HEADERS();
  //     const response = await axiosInstance.get(
  //       API_ENDPOINTS.GETORGANISATIONPROFILE +
  //       `?&limit=${data?.limit}&offset=${data?.offset}`,
  //       headers,
  //     );
  //     console.log("getOrganistionProfileList",response);

  //     return {
  //       success: true,
  //       data: response.data.results,
  //       status: response.status,
  //     };
  //   } catch (error) {

  //     console.log('error config', error.config);
  //     console.log('error request', error.request);
  //     console.log('error response', error.response);
  //     console.log('error message', error.message);
  //     return {
  //       success: false,
  //       error: error.response?.data || 'Failed to fetch Lawyer Network List',
  //       status: error.response?.status || 500,
  //     };
  //   }
  // },
  getOrganistionProfileList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.GETORGANISATIONPROFILE + queryParams,
        headers
      );

      console.log("getOrganistionProfileList response", response);

      return {
        success: true,
        data: response.data.results,
        count: response.data.count, // Make sure your API returns total count
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching organisation profiles:', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Organisation Profile List',
        status: error.response?.status || 500,
      };
    }
  },
  getJobProfileList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      // if (data?.search) {
      //   queryParams += `&search=${encodeURIComponent(data.search)}`;
      // }

      const response = await axiosInstance.get(
        API_ENDPOINTS.JOBPROFILES + queryParams,
        headers
      );

      console.log("getJobProfileList", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Organisation Profile List',
        status: error.response?.status || 500,
      };
    }
  },



  getMSAContractorList: async (data) => {
    console.log("&offset=${data?.offset || 0}", data);

    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}&date_from=${data?.date_from || 0}&date_to=${data?.date_to || 0} `;

      // Add search parameter if provided
      // if (data?.search) {
      //   queryParams += `&search=${encodeURIComponent(data.search)}`;
      // }

      const response = await axiosInstance.get(
        API_ENDPOINTS.MSACONTRACTORLIST + queryParams,
        headers
      );

      console.log("getMSAContractorList", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error('Error fetching Contractor', {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Contractor List',
        status: error.response?.status || 500,
      };
    }
  },

  getMSAServiceList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit }&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      // if (data?.search) {
      //   queryParams += `&search=${encodeURIComponent(data.search)}`;
      // }

      const response = await axiosInstance.get(
        API_ENDPOINTS.MSASERVICELIST + queryParams,
        headers
      );

      console.log("Service", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Service List',
        status: error.response?.status || 500,
      };
    }
  },
  getMSAStatusList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}&status=${data?.status || 0}`;


      const response = await axiosInstance.get(
        API_ENDPOINTS.MSAALLSTATUS + queryParams,
        headers
      );

      console.log("Status", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Status List',
        status: error.response?.status || 500,
      };
    }
  },

   getMSAAllList: async (data) => {

    try {
      const headers = await AUTH_HEADERS();



      // Ensure slug is provided
      if (!data) {
        throw new Error("Slug is required for fetching MSA List");
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSADETAIL}/?limit=${data?.limit }&offset=${data?.offset || 0}`,
        headers
      );

      console.log("MSA List Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching MSA List", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch MSA List",
        status: error.response?.status || 500,
      };
    }
  },
  getMSADetail: async (data) => {
    console.log("datadatadata", data);

    try {
      const headers = await AUTH_HEADERS();



      // Ensure slug is provided
      if (!data) {
        throw new Error("Slug is required for fetching MSA detail");
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSADETAIL}/${data}`,
        headers
      );

      console.log("MSA Detail Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching MSA Detail", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch MSA Detail",
        status: error.response?.status || 500,
      };
    }
  },


  getMSAApprovalList: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSADETAIL}/?status=pending_approval`,
        headers
      );

      console.log("MSAApprovalList  Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching MSA Approval List", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch MSA Approval List",
        status: error.response?.status || 500,
      };
    }
  },
  getSOWApprovalList: async () => {
    try {
      const headers = await AUTH_HEADERS();

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWDETAIL}?status=pending_approval`,
        headers
      );

      console.log("SOWApprovalList  Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching SOW Approval List", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch SOW Approval List",
        status: error.response?.status || 500,
      };
    }
  },

  // updateMSADetail: async (slug, payload) => {
  //   try {
  //     const headers = await AUTH_HEADERS();

  //     if (!slug) {
  //       throw new Error("Slug is required for fetching MSA detail");
  //     }

  //     const response = await axiosInstance.patch(
  //       `${API_ENDPOINTS.UPDATEMSA}/${slug}/`,
  //       payload, // <-- payload is the data body
  //        headers  // <-- headers go here
  //     );

  //     console.log("Update MSA Detail Response", response);

  //     return {
  //       success: true,
  //       data: response.data,
  //       count: response.data.count,
  //       status: response.status,
  //     };
  //   } catch (error) {
  //     console.error("Error Update MSA Detail", {
  //       config: error.config,
  //       request: error.request,
  //       response: error.response,
  //       message: error.message,
  //     });

  //     return {
  //       success: false,
  //       error: error.response?.data || "Failed to Update MSA Detail",
  //       status: error.response?.status || 500,
  //     };
  //   }
  // },



  updateMSADetail: async (slug, payload) => {
    try {
      const headers = await AUTH_HEADERS();

      if (!slug) {
        throw new Error("Slug is required for fetching MSA detail");
      }

      const formattedPayload = {
        ...payload,
        start_date: payload.start_date
          ? dayjs(payload.start_date).format("YYYY-MM-DD HH:mm:ss")
          : null,
        end_date: payload.end_date
          ? dayjs(payload.end_date).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATEMSA}/${slug}/`,
        formattedPayload,
        headers
      );

      console.log("Update MSA Detail Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error Update MSA Detail", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to Update MSA Detail",
        status: error.response?.status || 500,
      };
    }
  },


  getMSAFields: async () => {
    try {
      const headers = await AUTH_HEADERS();


      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MSAFIELDSDROPDOWN}`,
        headers
      );

      console.log("MSAFields Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching MSA Fields", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch MSA Fields ",
        status: error.response?.status || 500,
      };
    }
  },


  getCurrencyDetails: async () => {
    try {
      const headers = await AUTH_HEADERS();


      const response = await axiosInstance.get(
        `${API_ENDPOINTS.CURRENCYDETAILS}`,
        headers
      );

      console.log("getCurrencyDetails", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching Currency Details", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch Currency Details ",
        status: error.response?.status || 500,
      };
    }
  },
  getPaymentTermsList: async () => {
    try {
      const headers = await AUTH_HEADERS();


      const response = await axiosInstance.get(
        `${API_ENDPOINTS.PAYMENTTERMSDROPDOWNCREATEMSA}`,
        headers
      );

      console.log("getPaymentTermsList", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching Payment Terms List", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch Payment Terms List ",
        status: error.response?.status || 500,
      };
    }
  },


  updateMSAStatus: async (slug, payload) => {
    try {
      const headers = await AUTH_HEADERS();

      if (!slug) {
        throw new Error("Slug is required for updating MSA status");
      }

      // slug in query parameter
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATEMSA}?slug=${slug}`,
        payload,
        headers
      );

      console.log("Update MSA Status Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error updating MSA Status", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to update MSA Status",
        status: error.response?.status || 500,
      };
    }
  },

updateSOWStatus: async (slug, payload) => {
  try {
    console.log("🔹 updateSOWStatus called with:", { slug, payload });

    const headers = await AUTH_HEADERS();
    console.log("✅ Headers generated:", headers);

    if (!slug) {
      throw new Error("❌ Slug is required for updating SOW status");
    }

    // slug in query parameter
    console.log(`📡 Making PATCH request to: ${API_ENDPOINTS.UPDATESOW}${slug}/`);
    console.log("📦 Payload:", payload);

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.UPDATESOW}${slug}/`,
      payload,
      headers 
    );

    console.log("✅ Update SOW Status Response:", {
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
    console.error("❌ Error updating SOW Status:", {
      message: error.message,
      config: error.config,
      request: error.request,
      response: error.response?.data,
      status: error.response?.status,
    });

    return {
      success: false,
      error: error.response?.data || error.message || "Failed to update SOW Status",
      status: error.response?.status || 500,
    };
  }
},

  getSowContractorList: async (data) => {
    console.log("&offset=${data?.offset || 0}", data);

    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}&date_from=${data?.date_from || 0}&date_to=${data?.date_to || 0}&sow_type=${data?.sow || 0}`;

      const response = await axiosInstance.get(
        API_ENDPOINTS.SOWCONTRACTORLIST + queryParams,
        headers
      );

      console.log("getSOWContractorList", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch SOW Contractor List',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWDetail: async (data) => {
    console.log("datadatadata", data);

    try {
      const headers = await AUTH_HEADERS();

      if (!data) {
        throw new Error("Slug is required for fetching SOW detail");
      }

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWDETAIL}${data}`,
        headers
      );

      console.log("SOW Detail Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching SOW Detail", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch SOW Detail",
        status: error.response?.status || 500,
      };
    }
  },
  getSOWFields: async () => {
    try {
      const headers = await AUTH_HEADERS();


      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SOWFIELDSDROPDOWN}`,
        headers
      );

      console.log("SOWFields Response", response);

      return {
        success: true,
        data: response.data,
        count: response.data.count,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching SOW Fields", {
        config: error.config,
        request: error.request,
        response: error.response,
        message: error.message,
      });

      return {
        success: false,
        error: error.response?.data || "Failed to fetch SOW Fields ",
        status: error.response?.status || 500,
      };
    }
  },
  getSOWServiceList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      // if (data?.search) {
      //   queryParams += `&search=${encodeURIComponent(data.search)}`;
      // }

      const response = await axiosInstance.get(
        API_ENDPOINTS.SOWSERVICELIST + queryParams,
        headers
      );

      console.log("Service", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Service List',
        status: error.response?.status || 500,
      };
    }
  },
  getSOWStatusList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}&status=${data?.status || 0}`;


      const response = await axiosInstance.get(
        API_ENDPOINTS.SOWALLSTATUS + queryParams,
        headers
      );

      console.log("Status", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Status List',
        status: error.response?.status || 500,
      };
    }
  },

updateSOWDetail: async (slug, payload) => {
  console.log("payload", payload);
  console.log("slug", slug);

  try {
    // For FormData, we need to use multipart headers
    const headers = await AUTH_MULTYPART_HEADERS();

    if (!slug) {
      throw new Error("Slug is required for updating SOW");
    }


    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.UPDATESOW}${slug}/`, // Make sure this endpoint accepts PATCH
      payload, // Send FormData directly
       headers 
    );

    console.log("Update SOW Detail Response", response);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error Update SOW Detail", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return {
      success: false,
      error: error.response?.data || "Failed to Update SOW Detail",
      status: error.response?.status || 500,
    };
  }
},



createSOW: async (payload) => {
  try {
    const headers = await AUTH_MULTYPART_HEADERS();
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.CREATESOW}`,
      payload,
     headers
    );
    
    console.log("response of createSOW", response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating SOW:", error);
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
},


// createServiceSOW: async (payload) => {
//   try {
//     const headers = await AUTH_MULTYPART_HEADERS();
//     const response = await axiosInstance.post(
//       `${API_ENDPOINTS.CREATESERVICESOW}`,
//       payload,
//      headers
//     );
    
//     console.log("response of createSOW", response);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error creating SOW:", error);
//     return { 
//       success: false, 
//       error: error.response?.data || error.message 
//     };
//   }
// },

createServiceSOW: async (payload) => {
  try {
    console.log("🔹 createServiceSOW called with payload (FormData):", payload);

    const headers = await AUTH_MULTYPART_HEADERS();
    console.log("🔹 Headers being sent:", headers);

    console.log("🔹 Endpoint:", API_ENDPOINTS.CREATESERVICESOW);

    const response = await axiosInstance.post(
      API_ENDPOINTS.CREATESERVICESOW,
      payload,
     headers
    );

    console.log("✅ Response status:", response.status);
    console.log("✅ Response data:", JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error creating SOW:");

    if (error.response) {
      console.error("👉 Status:", error.response.status);
      console.error("👉 Data:", JSON.stringify(error.response.data, null, 2));
      console.error("👉 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("👉 No response received. Request object:", error.request);
    } else {
      console.error("👉 Request setup error:", error.message);
    }

    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
},

updateServiceDetail: async (originalSlug,formData) => {
  try {
    console.log("🔹 updateServiceDetail called with payload (FormData):", formData);
console.log("originalSlug",originalSlug);

    const headers = await AUTH_MULTYPART_HEADERS();
    console.log("🔹 Headers being sent:", headers);

    console.log("🔹 Endpoint:", API_ENDPOINTS.CREATESERVICESOW);

    const response = await axiosInstance.post(
      // API_ENDPOINTS.CREATESERVICESOW,
      `${API_ENDPOINTS.CREATESERVICESOW}?slug=${originalSlug}`,
      formData,
     headers
    );

    console.log("✅ Response status:", response.status);
    console.log("✅ Response data:", JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error update Service  SOW:");

    if (error.response) {
      console.error("👉 Status:", error.response.status);
      console.error("👉 Data:", JSON.stringify(error.response.data, null, 2));
      console.error("👉 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("👉 No response received. Request object:", error.request);
    } else {
      console.error("👉 Request setup error:", error.message);
    }

    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
},

  getTimeSheetList: async (data) => {
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit }&offset=${data?.offset || 0}`;

      // Add search parameter if provided
      if (data?.search) {
        queryParams += `&search=${encodeURIComponent(data.search)}`;
      }

      const response = await axiosInstance.get(
        API_ENDPOINTS.TIMESHEET + queryParams,
        headers
      );

      console.log("TimeSheetList", response);

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
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data || 'Failed to fetch Time Sheet List',
        status: error.response?.status || 500,
      };
    }
  },
  getMasterMaterialListBySerach: async (data) => {
console.log("getMasterMaterialListBySerach",data);

    try {
  const headers = await AUTH_HEADERS();

      let queryParams = `?limit=${data?.limit }&offset=${data?.offset || 0}`;


      const response = await axiosInstance.get(
        API_ENDPOINTS.MASTERMATERIALLIST + queryParams,
        headers
      );

console.log("getMasterMaterialListBySerach",response);

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
          "Failed to fetch Serached Master Material List ",
        status: error.response?.status || 500,
      };
    }
  },

 getMaterialDetails: async (materialUid) => {
console.log("getMaterialDetails",materialUid);

    try {
  const headers = await AUTH_HEADERS();

      // let queryParams = `?limit=${data?.limit }&offset=${data?.offset || 0}`;

  const response = await axiosInstance.get(
      `${API_ENDPOINTS.MATERIAL_DETAILS}/${materialUid}/`,
      headers
    );
   

console.log("getMaterialDetails",response);

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
          "Failed to fetch Serached Master Material List ",
        status: error.response?.status || 500,
      };
    }
  },
// createSignWellDocument: async (documentData) => {
//   try {
//     const response = await fetch(SIGNWELL_API_URL, {
//       method: "POST",
//       headers: {
//         'X-Api-Key': API_KEY,
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(documentData),
//     });

//     const data = await response.json();
//     console.log("📥 SignWell API Response:", data);

//     if (data.error_message) {
//       return { success: false, error: data.error_message };
//     }

//     return { success: true, data };
//   } catch (error) {
//     console.error("❌ Error in createSignWellDocument:", error);
//     return { success: false, error: error.message };
//   }
// },

createSignWellDocument:async (documentData) =>{
    try {
        const response = await fetch(SIGNWELL_API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(documentData),
        });

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
        draft: true,                   // keep in draft mode
        embedded_edit_url: true,       // return embedded edit URL
        embedded_signing: false,       // not signing yet, just edit/add contacts
        files: [
          { file_url: fileUrl }        // or use file_base64
        ],
      };

      const response = await signwellAxios.post("/documents", payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error creating draft:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  },






// createSignWellDocument: async (documentData, allowManualContacts = false) => {
//   try {
//     const payload  = { ...documentData };

//     if (allowManualContacts) {
//       // Force draft + remove recipients
//       payload.draft = true;
//       delete payload.recipients;
//     }

//     const response = await fetch(SIGNWELL_API_URL, {
//       method: "POST",
//       headers: {
//         "X-Api-Key": API_KEY,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();
//     console.log("📥 SignWell API Response:", data);

//     if (data.error_message || data.errors) {
//       throw new Error(data.error_message || JSON.stringify(data.errors));
//     }

//     return data;
//   } catch (error) {
//     console.error("❌ Error in createSignWellDocument:", error);
//     throw error;
//   }
// },



// createSignWellDocument: async (documentData) => {
//   try {
//     const response = await fetch(SIGNWELL_API_URL, {
      
//       method: 'POST',
//       headers: {
//         'X-Api-Key': API_KEY,
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(documentData),
//     });

//     // Try to parse the body (even for errors)
//     let responseBody;
//     try {
//       responseBody = await response.json();
//     } catch {
//       responseBody = await response.text(); // fallback if not JSON
//     }

//     if (!response.ok) {
//       const errorMsg =
//         responseBody?.message ||
//         responseBody?.error ||
//         JSON.stringify(responseBody) ||
//         `HTTP ${response.status}`;
//       throw new Error(errorMsg);
//     }

//     return responseBody;
//   } catch (error) {
//     console.error('There was an error creating the document:', error);
//     throw error;
//   }
// },

//   createSignWellDocument: async (documentData) =>{
//     try {
//         const response = await fetch(SIGNWELL_API_URL, {
//             method: 'POST',
//             headers: {
//                 'X-Api-Key': API_KEY,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(documentData),
//         });

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(`Error: ${error.message}`);
//         }

//         const data = await response.json();
//         return data;

//     } catch (error) {
//         console.error('There was an error creating the document:', error);
//         throw error;
//     }
// },





   checkStatusSignWellDocument:async (id)  =>{
    try {
        const response = await fetch(`${SIGNWELL_API_URL}${id}/`, {
            method: 'GET',
            headers: {
                'X-Api-Key': API_KEY,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return {status:false,message:error.message};
        }
        const data = await response.json();

        return {status:true,data:data}

    } catch (error) {
        console.error('There was an error retrieving the document:', error);
        throw error;
    }
},
getCompletedSignWellDocument:async(id)=> {
    try {
        const response = await fetch(`${SIGNWELL_API_URL}${id}/completed_pdf/?url_only=false&audit_page=true`, {
            method: 'GET',
            headers: {
                'X-Api-Key': API_KEY,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return  {status:false,message:error.message}
        }

        // The response is a binary PDF file, so we should handle it as a blob
        const blob = await response.blob();

        // Convert the blob to a URL to display in an iframe
        const pdfUrl = URL.createObjectURL(blob);
        return  {status:true,pdfUrl:pdfUrl,blob:blob}

    } catch (error) {
        console.error('There was an error retrieving the document:', error);
        throw error;
    }
},

sendeSignDocsSaga: async (payload) => {
  try {
    console.log("🔹 sendeSignDocsSaga called with payload :", payload);

    const headers = await AUTH_HEADERS();
    console.log("🔹 Headers being sent:", headers);

    console.log("🔹 Endpoint:", API_ENDPOINTS.ESIGNDOCLIST);

    const response = await axiosInstance.post(
      API_ENDPOINTS.ESIGNDOCLIST,
      payload,
     headers
    );

    console.log("✅ Response status:", response.status);
    console.log("✅ Response data:", JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error sendeSignDocsSaga:");

    if (error.response) {
      console.error("👉 Status:", error.response.status);
      console.error("👉 Data:", JSON.stringify(error.response.data, null, 2));
      console.error("👉 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("👉 No response received. Request object:", error.request);
    } else {
      console.error("👉 Request setup error:", error.message);
    }

    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
},
createMasterData : async (data) => {
    const headers = await AUTH_MULTYPART_HEADERS();

  try {
      const response = await axiosInstance.post(
      API_ENDPOINTS.MASTERDTATA,
      data,
     headers
    );
    return response.data;
  } catch (error) {
    console.error('Error creating master data:', error);
    throw error;
  }
},
getMasterData : async () => {

  try {
      const response = await axiosInstance.get(
      API_ENDPOINTS.MASTERDTATA,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating master data:', error);
    throw error;
  }
},
};
export default Services;
