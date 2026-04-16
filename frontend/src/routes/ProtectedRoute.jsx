import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // If not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the admin layout which contains the sidebar and child routes
  return <AdminLayout />;
};

export default ProtectedRoute;
