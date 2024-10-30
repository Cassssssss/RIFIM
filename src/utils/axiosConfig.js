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
      // Si on reçoit une erreur 401 (non autorisé)
      if (error.response.status === 401) {
        // Supprimer le token et le nom d'utilisateur du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        // Rediriger vers la page de connexion
        window.location.href = '/login';
      }
      // Pour les erreurs 404, on retourne un tableau vide comme avant
      else if (error.response.status === 404) {
        console.log('Resource not found:', error.config.url);
        return { data: { links: [] } };
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;