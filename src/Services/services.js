import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import {API_ENDPOINTS} from '../api/ApiManager/endpoint';
import {AUTH_HEADERS, AUTH_MULTYPART_HEADERS, HEADERS} from '../Axios/axiosData';
import { authorize } from 'react-native-app-auth';
const Services = {

 login: async (email, password) => {
  console.log('login services',email, password );
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.LOGIN,
      { email, password },
      
 {
        headers: { 'Content-Type': 'application/json' },
      }
    );


    console.log('response services', response);
    const userData = response?.data?.data;
console.log("user",userData);
console.log("userData.key",userData.key);

    if (userData?.first_name && userData?.last_name) {
      await AsyncStorage.setItem('first_name', userData.first_name);
      await AsyncStorage.setItem('last_name', userData.last_name);
   await AsyncStorage.setItem('Token', response.data.key); 

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

  getLawyerNetworkList: async data => {
    try {
    const headers = await AUTH_HEADERS(); 
const response = await axiosInstance.get(
  API_ENDPOINTS.LAWYERNETWORKLIST +
    `?&limit=${data?.limit}&offset=${data?.offset}`,
  headers,
);
          console.log('getLawyerNetworkList', response);
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
  API_ENDPOINTS.COUNTRIES ,
  headers,
);
          console.log('COUNTRIES', response);
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
    console.log("formData SSSS",formData);
    
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
    console.log("response SSSS",response);

    return {
      success: true,
      data: response.data.response,
      status: response.status,
    };
  } catch (error) {
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
          console.log('SUPPLIERSLIST', response);
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
// Add Google login method
 googleLogin: async () => {
  try {
    console.log('Starting Google OAuth login...');
    const authState = await authorize(Services.config);

    const accessToken = authState.accessToken;

    console.log('Google access token:', accessToken);

    // Call backend to exchange Google token
    const backendResponse = await axios.post(
      `${API_URL}accounts/dj-rest-auth/google/`,
      { access_token: accessToken },
      HEADERS
    );

    const userData = backendResponse?.data?.data;
    const token = backendResponse?.data?.key;

    if (userData?.first_name && userData?.last_name) {
      await AsyncStorage.setItem('first_name', userData.first_name);
      await AsyncStorage.setItem('last_name', userData.last_name);
    }

    await AsyncStorage.setItem('Token', token);

    return {
      success: true,
      data: backendResponse.data,
      status: backendResponse.status,
    };
  } catch (error) {
    console.log('Google login error:', error);

    return {
      success: false,
      error: error?.response?.data || 'Google login failed',
      status: error?.response?.status || 500,
    };
  }
},

// Add method to exchange Google token for your backend auth
 exchangeGoogleToken: async (accessToken) => {

  try {
    const response = await axios.post(
      API_ENDPOINTS.GOOGLELOGIN,
       accessToken,
    HEADERS
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
};
export default Services;
