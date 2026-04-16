import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Index from "./pages/frontend/index";
import Login from "./pages/frontend/auth/Login";
import Register from "./pages/frontend/auth/Register";
import Settings from "./pages/frontend/Settings";
import Dashboard from "./pages/backend/Dashboard";
import ChatDashboard from "./pages/backend/chat/ChatDashboard";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen bg-gray-50">
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<Index />} />

            {/* Guest Only Routes (Login/Register) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Authenticated User Chat */}
            <Route element={<AuthenticatedRoute />}>
              <Route path="/chat" element={<ChatDashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="chat" element={<ChatDashboard />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={<div className="p-8 text-center">404 - Not Found</div>}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
