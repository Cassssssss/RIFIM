import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  
  console.log('PrivateRoute check:', { 
    hasToken: !!token, 
    hasUsername: !!username,
    token: token ? `${token.substring(0, 20)}...` : null,
    username 
  });
  
  // Vérifier que BOTH token ET username existent
  const isAuthenticated = token && username;
  
  if (!isAuthenticated) {
    console.log('PrivateRoute: Redirection vers Auth (pas de token ou username)');
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;