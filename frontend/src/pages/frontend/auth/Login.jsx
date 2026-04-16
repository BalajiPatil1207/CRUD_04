import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Card from "../../../components/common/Card";
import ThemeToggle from "../../../components/common/ThemeToggle";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Clear field error when user starts typing or clicking
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Front-end validation
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = "Username/Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.rememberMe) newErrors.rememberMe = "You must check this to login";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    const result = await login(formData.identifier, formData.password);
    setLoading(false);
    
    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
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
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-brand-400 to-indigo-600" />
          
          <div className="text-center mb-10 pt-4">
            <h2 className="text-3xl font-extrabold text-gradient tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Please enter your details to sign in
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Username or Email"
              name="identifier"
              type="text"
              placeholder="Enter your email or username"
              icon={Mail}
              value={formData.identifier}
              onChange={handleChange}
              error={errors.identifier}
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className={`h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer transition-all duration-200 ${
                      errors.rememberMe ? "border-red-500 ring-2 ring-red-500/20" : ""
                    }`}
                  />
                  <label
                    htmlFor="remember-me"
                    className={`ml-2 block text-sm cursor-pointer font-medium transition-colors duration-200 ${
                      errors.rememberMe
                        ? "text-red-500"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-brand-600 hover:text-brand-500 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              {errors.rememberMe && (
                <span className="text-[11px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-300 block">
                  {errors.rememberMe}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={loading}
              icon={LogIn}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-brand-600 hover:text-brand-500 inline-flex items-center gap-1 group transition-all"
              >
                Sign up for free
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
