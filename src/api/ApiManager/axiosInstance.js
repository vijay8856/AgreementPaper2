import axios from 'axios';
import {API_URL, HEADERS} from '../../Axios/axiosData';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: HEADERS.headers,
});
console.log('BASE URL ===>', API_URL);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const {status, data} = error.response;
      const errorMessage = data?.responseMessage || 'An error occurred';

      switch (status) {
        // case 401:
        //   localStorage.clear();
        //   window.location.href = "/login";
        //   break;
        case 403:
          console.error('Forbidden:', errorMessage);
          break;
        case 404:
          console.error('Not Found:', errorMessage);
          break;
        case 500:
          console.error('Server Error:', errorMessage);
          break;
        default:
          console.error('Error:', errorMessage);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
