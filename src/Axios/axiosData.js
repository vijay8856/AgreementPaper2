// import axios from 'axios';
// export const API_URL = process.env.REACT_APP_API_URL;
// export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
// export const COPY_URL = process.env.REACT_APP_COPY_URL;

// export const HEADERS = {
//   headers: {
//     'Content-Type': 'application/json',
//   },
// };

// export const MULTYPART_HEADERS = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// };

// export const LINKEDIN_HEADERS = {
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// };

// // use AUTH_MULTYPART_HEADERS when you have passed data with image form

// export const AUTH_MULTYPART_HEADERS = () => {
//   return {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Token ${localStorage.getItem('access_token')}`,
//     },
//   };
// };

// // use AUTH_HEADERS when you have passed data with json and normal data object

// export const AUTH_HEADERS = () => {
//   return {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Token ${localStorage.getItem('access_token')}`,
//     },
//   };
// };

// export const LIMIT_DATA = 6;

// const API_KEY = '6361de5c1a99499b934065fe9b77437e';
// const resourceName = 'Agreementpaper';
// const deploymentId = 'davinci-002';
// const apiVersion = '2022-12-01';
// const endpoint = `https://${resourceName}.openai.azure.com/openai/deployments/${resourceName}/completions?api-version=${apiVersion}`;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "https://api.agreementpaper.com/";
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
export const COPY_URL = process.env.REACT_APP_COPY_URL;

export const HEADERS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const MULTYPART_HEADERS = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const LINKEDIN_HEADERS = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

// use AUTH_MULTYPART_HEADERS when you have passed data with image form
export const AUTH_MULTYPART_HEADERS = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  };
};

// use AUTH_HEADERS when you have passed data with json and normal data object
export const AUTH_HEADERS = async () => {
  const token = await AsyncStorage.getItem('Token');
  console.log("token",token);
  
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
};

export const LIMIT_DATA = 6;

const API_KEY = '6361de5c1a99499b934065fe9b77437e';
const resourceName = 'Agreementpaper';
const deploymentId = 'davinci-002';
const apiVersion = '2022-12-01';
const endpoint = `https://${resourceName}.openai.azure.com/openai/deployments/${resourceName}/completions?api-version=${apiVersion}`;
