import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
