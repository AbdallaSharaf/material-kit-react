import axios from 'axios';

// import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Set your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = Cookies.get('token'); // Get token from cookies
    const token = localStorage.getItem('token'); // ⬅️ Use localStorage instead of Cookies    if (token) {

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data.error|| error) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error(error.response);
      // Cookies.remove('token');
      // Cookies.remove('userData');
      // localStorage.removeItem('token'); // ⬅️ Remove from localStorage
      // localStorage.removeItem('userData'); // ⬅️ Remove from localStorage

    //   window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
