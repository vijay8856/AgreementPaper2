import axios from 'axios';
import {API_URL, HEADERS} from '../../Axios/axiosData';

const axiosInstance = axios.create({
  baseURL: API_URL,
  // timeout: 100000,
  headers: HEADERS.headers,
    withCredentials: false,
});

// Response interceptor
// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response) {
//       const {status, data} = error.response;
//       const errorMessage = data?.responseMessage || 'An error occurred';

//       switch (status) {
//         case 401:
//           localStorage.clear();
//           window.location.href = "/login";
//           break;
//         case 403:
//           console.error('Forbidden:', errorMessage);
//           break;
//         case 404:
//           console.error('Not Found:', errorMessage);
//           break;
//         case 500:
//           console.error('Server Error:', errorMessage);
//           break;
//         default:
//           console.error('Error:', errorMessage);
//       }
//     }
//     return Promise.reject(error);
//   },
// );
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // console.error("🔴 API Request Error:", error); // Full raw error object

    if (error.response) {
      const { status, data } = error.response;

      // console.error("📌 Status Code:", status);
      // console.error("📌 Response Data:", data);

      const errorMessage =
        data?.responseMessage ||
        data?.message ||
        JSON.stringify(data) ||
        'An error occurred';

      switch (status) {
        case 401:
          console.warn('⚠ Unauthorized - clearing session');
          // localStorage.clear();
          // window.location.href = "/login";
          break;
        case 403:
          // console.warn('🚫 Forbidden:', errorMessage);
          break;
        case 404:
          console.warn('❓ Not Found:', errorMessage);
          break;
        case 500:
          console.warn('💥 Server Error:', errorMessage);
          break;
        default:
          console.warn('❗ Error:', errorMessage);
      }
    } else if (error.request) {
      // No response from server
      console.error('📡 No response received from API:', error.request);
    } else {
      // Something else triggered the error
      console.error('⚙ Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
