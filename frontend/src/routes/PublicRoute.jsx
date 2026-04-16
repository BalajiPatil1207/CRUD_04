import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (user) {
    // Route authenticated users away from auth pages without bouncing them
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }

  // If not authenticated, render the child routes (like Login)
  return <Outlet />;
};

export default PublicRoute;
