import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Card from "../../../components/common/Card";
import ThemeToggle from "../../../components/common/ThemeToggle";
import { User, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";
import { useToast } from "../../../components/common/Toast";

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Front-end validation
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    const result = await register(formData.username, formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate("/login");
    } else {
      setErrors(result.errors || {});
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="glass shadow-premium border-none relative overflow-hidden">
          {/* Subtle Accent Background */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-600 to-brand-400" />
          
          <div className="text-center mb-10 pt-4">
            <h2 className="text-3xl font-extrabold text-gradient tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Join us and start your journey today
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="johndoe"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                loading={loading}
                icon={UserPlus}
                iconPosition="right"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-brand-600 hover:text-brand-500 inline-flex items-center gap-1 group transition-all"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
