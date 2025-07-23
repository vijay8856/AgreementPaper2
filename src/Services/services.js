import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import { API_ENDPOINTS } from '../api/ApiManager/endpoint';
import { AUTH_HEADERS, AUTH_MULTYPART_HEADERS, HEADERS, MULTYPART_HEADERS } from '../Axios/axiosData';
import { authorize } from 'react-native-app-auth';

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
      console.log("response", response);


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
  googleSignup: async (access_token) => {
    console.log("........access_token", access_token);

    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SENDACCESSTOKEN,
        {
          access_token,
          user_type: 'INDIVIDUAL_USER',
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
        error: error.response?.data || 'Failed to fetch All MSA List',
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
        error: error.response?.data || 'Failed to fetch Countries List',
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
      const { headers } = await AUTH_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.REGISTER,
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
        error: error.response?.data || 'Failed to fetch Countries List',
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
      console.log("List", response);

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
        error: error.response?.data || 'Failed to fetch Countries List',
        status: error.response?.status || 500,
      };
    }
  },
  updateUserProfileDetails: async (payload) => {
    try {
      const headers = await AUTH_MULTYPART_HEADERS();
      const response = await axiosInstance.post(
        API_ENDPOINTS.UPDATEUSERPROFILE,
        payload,
        headers,
      );
      console.log('updateUserProfileDetails', response);
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
        error: error.response?.data || 'Failed to fetch Countries List',
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
        error: error.response?.data || 'Failed to fetch Countries List',
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
        API_ENDPOINTS.SUBSCRIPTIONPLANDETAIL ,
        headers,
      );
      console.log("getSubscriptionPlanDetails",response);
      
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
        error: error.response?.data || 'Failed to fetch Countries List',
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
};
export default Services;
