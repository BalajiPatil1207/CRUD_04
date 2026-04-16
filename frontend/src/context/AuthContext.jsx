import React, { createContext, useContext, useState, useEffect } from "react";
import { Api, sessionStore, sessionRemove } from "../components/common/Api/api";
import { useToast } from "../components/common/Toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check for existing user session from sessionStorage
    const storedUser = sessionStorage.getItem("users");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await Api.post("/auth/login", { identifier, password });
      const { token, user: userData } = response.data.data;
      
      setUser(userData);
      sessionStore(token, userData);
      addToast("Login successful!", "success");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.errors?.auth || error.response?.data?.message || "Login failed";
      addToast(message, "danger");
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      await Api.post("/auth/register", { username, email, password });
      addToast("Account created successfully! Please login.", "success");
      return { success: true };
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors ? Object.values(errors)[0] : "Registration failed";
      addToast(message, "danger");
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionRemove();
    addToast("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
