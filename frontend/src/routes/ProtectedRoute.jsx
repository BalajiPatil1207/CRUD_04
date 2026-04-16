import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Role-based protection: Only admins can access the admin layout
  if (user.role !== 'admin') {
    // Send regular users to the friendly chat area instead of showing a hard error page
    return <Navigate to="/chat" replace />;
  }

  // If authenticated and admin, continue to the nested admin routes
  return <Outlet />;
};

export default ProtectedRoute;
