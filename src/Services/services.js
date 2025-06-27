import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import { API_ENDPOINTS } from '../api/ApiManager/endpoint';
import { AUTH_HEADERS, AUTH_MULTYPART_HEADERS, HEADERS } from '../Axios/axiosData';
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
// googleSignup: async (access_token) => {
//   console.log("access_token",access_token);
  
//   try {
//     console.log("intry");
//     const response = await axios.post(

//       API_ENDPOINTS.GOOGLESIGNUP,
//       { access_token }, 
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   console.log("responseresponse",response);

//     return { success: true, data: response.data };
//   } catch (error) {
//       console.log('❌ Google Signup Full Error:', error.response?.data);

//     return {
//       success: false,

//       error: error.response?.data || { message: 'Signup failed' },
//     };
//   }
// },
// googleSignup: async (access_token) => {
//   console.log("googleSignup 22",access_token);
//   try {
//     const response = await axiosInstance.post(
//       API_ENDPOINTS.SENDACCESSTOKEN,
//         {
//         access_token,
//         user_type: 'INDIVIDUAL_USER',
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );

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
//       error: error.response?.data?.non_field_errors?.[0] || 'Google signup failed',
//       status: error.response?.status || 500,
//     };
//   }
// },


googleSignup: async (access_token) => {
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
console.log("googleSignup response",response);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.non_field_errors?.[0] || 'Google signup/login failed',
      status: error?.response?.status || 500,
    };
  }
},





  // sendAccessToken: async (access_token) => {
  //   try {
  //     const response = await axiosInstance.post(
  //       API_ENDPOINTS.SENDACCESSTOKEN,
  //       { access_token },
  //       console.log("access_token", access_token),

  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //       }
  //     );


  //     const userData = response?.data?.data;
  //     console.log("sendAccessToken userData ", userData);


  //     if (userData?.first_name && userData?.last_name) {
  //       await AsyncStorage.setItem('first_Name', userData?.first_name);
  //       await AsyncStorage.setItem('last_Name', userData?.last_name);
  //       await AsyncStorage.setItem('Token', response.data.key);

  //     }
  //       console.log("response 23",response);

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
  //       error: error.response?.data || 'Failed to log in',
  //       status: error.response?.status || 500,
  //     };
  //   }
  // },
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
console.log("response  response",response);

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
        {
          ...headers,
          headers: {
            ...headers.headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
console.log("response12",response);

      return {
        success: true,
        data: response.data.response,
        status: response.status,
      };
    } catch (error) {
      console.log("error",error);
      
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
        API_ENDPOINTS.ESIGNDOCLIST+ `?&limit=${data?.limit}&offset=${data?.offset}`,
        headers,
      );
      console.log("getEsignDocList",response);

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




};
export default Services;
