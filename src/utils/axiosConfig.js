import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://seal-app-2-piuqm.ondigitalocean.app/api'
    : 'http://localhost:5002/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      console.log('Resource not found:', error.config.url);
      return { data: { links: [] } }; // Retourner un tableau vide en cas de 404
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;