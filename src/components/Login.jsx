// src/components/Login.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Phone, Lock, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'; // Using Lucide-React for icons
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

// Input field component for consistent styling
const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, disabled = false, maxLength, inputMode, pattern, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
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
          type={inputType}
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
          inputMode={inputMode}
          pattern={pattern}
          required
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// Agriculture-themed Animated Wheat SVG Component
const AnimatedWheatSVG = () => (
  <motion.svg
    className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none opacity-40 z-0"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMax slice" // Ensures it covers the bottom area
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background field color */}
    <rect x="0" y="0" width="100" height="100" fill="url(#wheatGradient)" />

    <defs>
      <linearGradient id="wheatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dcedc8" /> {/* Light green */}
        <stop offset="100%" stopColor="#aed581" /> {/* Medium green */}
      </linearGradient>
    </defs>

    {/* Individual wheat stalks */}
    {[...Array(15)].map((_, i) => (
      <motion.path
        key={i}
        d={`M${5 + i * 6} 100 V${40 - (i % 5) * 5} C${5 + i * 6 + 5} ${35 - (i % 5) * 5}, ${5 + i * 6 + 10} ${30 - (i % 5) * 5}, ${5 + i * 6 + 5} ${25 - (i % 5) * 5}`}
        fill="none"
        stroke="#8BC34A" // Green for stalks
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: i * 0.2 // Staggered animation
        }}
      />
    ))}

    {/* Gentle swaying animation for the whole group */}
    <motion.g
      animate={{
        rotate: [0, 2, -2, 0], // Sway left, right, back
        y: [0, -2, 0] // Slight vertical movement
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* More wheat details (simplified for SVG size) */}
      {[...Array(10)].map((_, i) => (
        <motion.circle
          key={`leaf-${i}`}
          cx={10 + i * 9}
          cy={60 + (i % 2) * 5}
          r={2}
          fill="#689F38" // Darker green for leaves
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut",
            delay: i * 0.3 + 0.5 // Staggered and delayed
          }}
        />
      ))}
    </motion.g>
  </motion.svg>
);


// Renamed onLoginSuccess to handleLogin to match App.jsx prop
const Login = ({ handleLogin }) => {
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
    // Clear messages on input change
    setError('');
    setSuccessMessage('');
  };

  const submitLogin = async (e) => { // Renamed to avoid conflict with prop name
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setSuccessMessage(data.message || 'Login successful! Redirecting...');
      console.log('Login successful:', data);

      if (handleLogin) { // Use the corrected prop name
        // Pass token first, then user data, as expected by App.jsx's handleLogin
        setTimeout(() => handleLogin(data.token, data.user), 1000);
      }

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-green-50 to-emerald-100
      bg-[url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d9f99d\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h3v1H0V0zm0 2h3v1H0V2zm0 4h3v1H0V6zM3 0h3v1H3V0zm0 2h3v1H3V2zm0 4h3v1H3V6z\'/%3E%3C/g%3E%3C/svg%3E')]
      bg-repeat bg-center
    ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200 relative overflow-hidden z-10"
      >
        {/* Agriculture-themed Animated Wheat SVG */}
        <AnimatedWheatSVG />

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 relative z-20">
          Welcome Back!
        </h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 flex items-center space-x-2 z-20"
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
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4 flex items-center space-x-2 z-20"
              role="alert"
            >
              <CheckCircle size={20} />
              <span className="block sm:inline">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={submitLogin} className="relative z-20"> {/* Ensure form is above SVG */}
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