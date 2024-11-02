import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://seal-app-2-piuqm.ondigitalocean.app/api'
    : 'http://localhost:5002/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Log plus détaillé de la requête
    console.log('=== Détails de la requête ===');
    console.log('Méthode:', config.method);
    console.log('URL:', config.url);
    console.log('Données envoyées:', config.data);
    console.log('Headers:', config.headers);
    
    const token = localStorage.getItem('token');
    console.log('Token présent:', !!token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('=== Détails de l\'erreur ===');
      console.log('Status:', error.response.status);
      console.log('Données de réponse:', error.response.data);
      console.log('Headers de réponse:', error.response.headers);

      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
      } else if (error.response.status === 404) {
        console.log('Resource not found:', error.config.url);
        return { data: { links: [] } };
      } else if (error.response.status === 500) {
        console.error('Erreur serveur détaillée:', {
          message: error.response.data,
          config: {
            url: error.config.url,
            method: error.config.method,
            data: JSON.parse(error.config.data || '{}')
          }
        });
        
        // Message utilisateur plus convivial
        alert('Une erreur est survenue lors de la sauvegarde. L\'erreur a été enregistrée pour analyse. Veuillez réessayer ou contacter le support si le problème persiste.');
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      console.error('Pas de réponse reçue:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;