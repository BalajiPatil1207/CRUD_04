import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/common/Toast";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/frontend/auth/Login";
import Dashboard from "./pages/backend/Dashboard";
import Index from "./pages/frontend";
import Register from "./pages/frontend/auth/Register";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="relative min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/admin/" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
              </Route>

              {/* Fallback */}
              <Route
                path="*"
                element={<div className="p-8 text-center">404 - Not Found</div>}
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
