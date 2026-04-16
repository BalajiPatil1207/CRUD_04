import React, { createContext, useContext, useState, useEffect } from "react";
import { sessionStore, sessionRemove } from "../components/common/Api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session from sessionStorage
    const storedUser = sessionStorage.getItem("users");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token = "dummy-token") => {
    setUser(userData);
    sessionStore(token, userData);
  };

  const logout = () => {
    setUser(null);
    sessionRemove();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
