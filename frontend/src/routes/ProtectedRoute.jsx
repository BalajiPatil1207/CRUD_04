import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Role-based protection: Only admins can access the admin layout
  if (user.role !== 'admin') {
    // If authenticated but not an admin, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render the admin layout
  return <AdminLayout />;
};

export default ProtectedRoute;
