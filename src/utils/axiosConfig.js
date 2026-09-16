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
    if (error.response) {
      const isAuthRequest = /\/auth\/(login|register)(?:\?|$)/.test(error.config?.url || '');
      if (error.response.status === 401 && !isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
      } else if (error.response.status === 404) {
        console.log('Resource not found:', error.config.url);
        return { data: { links: [] } };
      } else if (error.response.status === 500) {
        // Message utilisateur plus convivial
        if (!isAuthRequest) {
          alert('Le serveur a rencontré une erreur. Veuillez réessayer.');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
