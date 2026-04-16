import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    // If authenticated, redirect to dashboard (or wherever)
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If not authenticated, render the child routes (like Login)
  return <Outlet />;
};

export default PublicRoute;
