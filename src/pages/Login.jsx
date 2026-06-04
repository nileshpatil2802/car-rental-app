import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiFacebook, FiTwitter } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { login as loginApi } from '../services/carService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Submit clicked");
  //   console.log("Form Data:", formData);
  //   const newErrors = validateForm();
  //    console.log("Validation Errors:", newErrors);

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }
  //    try {
  //           setLoading(true);
  //           console.log("Calling loginApi...");
      
  //           const userData = await loginApi(
  //           formData.email,
  //           formData.password
  //           );  
  //           console.log("API Response:", userData);
  //           login(userData);
  //           setToast({message: 'Login successful!',type: 'success',});
  //         navigate('/');
  //     } catch (error) {
  //           setToast({message: error.response?.data?.message || 'Invalid email or password',type: 'error', });
  //     } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    setLoading(true);

    const userData = await loginApi(
      formData.email,
      formData.password
    );

    console.log("API Response:", userData);

    login(userData);

    setToast({
      message: "Login successful!",
      type: "success",
    });

    if (userData.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    setToast({
      message:
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};
  //   setLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     const userData = {
  //       id: Date.now(),
  //       firstName: formData.email.split('@')[0],
  //       lastName: 'User',
  //       email: formData.email,
  //       phone: '',
  //       avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
  //     };

  //     login(userData);
  //     setToast({
  //       message: 'Login successful!',
  //       type: 'success',
  //     });

  //     setTimeout(() => {
  //       navigate('/');
  //     }, 1500);
  //     setLoading(false);
  //   }, 1000);
  // };

  // const handleDemoLogin = () => {
  //   const demoUser = {
  //     id: 1,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john@example.com',
  //     phone: '9876543210',
  //     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  //   };
  //   login(demoUser);
  //   navigate('/');
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-200">Sign in to your SelfDrive Junction account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-primary">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-primary">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-secondary hover:text-red-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo Login */}
            {/* <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mt-3 btn-outline py-3 font-semibold"
            >
              Demo Login
            </button> */}
          </form>

          {/* Divider */}
          <div className="px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 text-sm">Or continue with</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          </div>

          {/* Social Login */}
          <div className="px-8 pb-8 flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiFacebook className="text-blue-600" />
              <span className="text-sm font-semibold">Facebook</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiTwitter className="text-blue-400" />
              <span className="text-sm font-semibold">Twitter</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="bg-light px-8 py-6 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary font-semibold hover:text-red-700 transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white text-sm mt-6">
          By signing in, you agree to our{' '}
          <Link to="#" className="underline hover:text-gray-200">
            Terms of Service
          </Link>
        </p>
      </motion.div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
