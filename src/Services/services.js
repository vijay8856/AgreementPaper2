import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/ApiManager/axiosInstance';
import {API_ENDPOINTS} from '../api/ApiManager/endpoint';
import {AUTH_HEADERS, AUTH_MULTYPART_HEADERS} from '../Axios/axiosData';

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
    const headers = await AUTH_HEADERS(); // ✅ wait for token
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
};
export default Services;
