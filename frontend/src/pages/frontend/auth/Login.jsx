import React from "react";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button";

const Login = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // Simulate login
    login(
      { id: 1, name: "Prashant", email: "prashant@example.com" },
      "lskdfjlskdjflsdkjksd",
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h1 className="text-2xl font-bold">Login Page</h1>
      <p className="text-gray-600">This is a public route.</p>
      <Button variant="primary" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default Login;
