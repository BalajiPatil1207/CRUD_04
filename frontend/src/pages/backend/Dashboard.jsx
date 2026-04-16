import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h1 className="text-2xl font-bold">Dashboard (Protected)</h1>
      <Link to="/admin/teacher" className="text-blue-600 hover:underline">Teacher List</Link>
      <Link to="/admin/product" className="text-blue-600 hover:underline">Product List</Link>
      <p className="text-gray-600">Welcome, {user?.name}!</p>
      <button
        onClick={logout}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
