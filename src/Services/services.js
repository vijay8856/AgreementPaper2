import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import { API_ENDPOINTS } from '../api/ApiManager/endpoint';
import { AUTH_HEADERS, AUTH_MULTYPART_HEADERS, HEADERS, MULTYPART_HEADERS } from '../Axios/axiosData';
import { authorize } from 'react-native-app-auth';
import dayjs from "dayjs";
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
      console.log("response of createMSA",response);
      
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
    try {
      const headers = await AUTH_HEADERS();

      // Build query parameters
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}`;

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
      let queryParams = `?limit=${data?.limit || LIMIT_DATA}&offset=${data?.offset || 0}`;

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

      // ✅ Ensure dates are in the correct format
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
};
export default Services;
