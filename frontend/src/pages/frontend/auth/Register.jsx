import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const Register = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // Simulate login
    login({ id: 1, name: 'Prashant', email: 'prashant@example.com' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h1 className="text-2xl font-bold">Login Page</h1>
      <p className="text-gray-600">This is a public route.</p>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        register
      </button>
    </div>
  );
};

export default Register;
