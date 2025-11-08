import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/auth.js";
import LoadingSpinner from "./LoadingSpinner.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
