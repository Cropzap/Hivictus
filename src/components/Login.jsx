import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Phone, Lock, LogIn, UserPlus } from 'lucide-react'; // Using Lucide-React for icons
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

// Input field component for consistent styling - Defined outside for performance
const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, disabled = false, maxLength, inputMode, pattern, value, onChange }) => (
  <div className="relative mb-4">
    {label && (
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={`w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-800
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode} // Suggest numeric keyboard for mobile for phone number
        pattern={pattern}     // Allow only digits for validation for phone number
        required
      />
    </div>
  </div>
);

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobile' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (formData.mobile === '1234567890' && formData.password === 'password123') {
        setSuccessMessage('Login successful! Redirecting...');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        throw new Error('Invalid mobile number or password.');
      }

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200 relative overflow-hidden
          before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] before:[background-size:16px_16px] before:opacity-20 before:pointer-events-none // <-- ADDED THIS CLASS
        "
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 flex items-center space-x-2"
              role="alert"
            >
              <XCircle size={20} />
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4 flex items-center space-x-2"
              role="alert"
            >
              <CheckCircle size={20} />
              <span className="block sm:inline">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin}>
          <InputField
            label="Mobile Number"
            name="mobile"
            type="text"
            icon={Phone}
            placeholder="e.g., 9876543210"
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.mobile}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <Link to="/forgot-password" className="block text-right text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6">
            Forgot Password?
          </Link>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <LogIn size={20} />
            )}
            <span>{loading ? 'Logging In...' : 'Login'}</span>
          </motion.button>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 flex items-center justify-center space-x-1 mt-2">
              <UserPlus size={16} />
              <span>Sign Up</span>
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;