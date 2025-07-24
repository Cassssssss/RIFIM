import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Vérification simple : token + user data
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  // Si token OU userData manquent, rediriger vers Auth
  const isAuthenticated = token && userData;
  
  if (!isAuthenticated) {
    console.log('PrivateRoute: Utilisateur non authentifié, redirection...');
    return <Navigate to="/" replace />;
  }
  
  // Vérification additionnelle : si les données sont corrompues
  try {
    if (userData) {
      JSON.parse(userData);
    }
  } catch (error) {
    console.error('PrivateRoute: Données utilisateur corrompues, nettoyage...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;