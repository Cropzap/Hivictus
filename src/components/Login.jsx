import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Phone, Lock, LogIn, UserPlus, Eye, EyeOff, ShoppingBag } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 
const API_URL = import.meta.env.VITE_API_URL;
// --- Input Field Component (Styled to match the green theme) ---
const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, disabled = false, maxLength, inputMode, pattern, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="relative mb-5">
      {label && (
        <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
            <Icon size={20} />
          </div>
        )}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
          className={`w-full p-3 pl-12 border border-gray-200 rounded-xl text-lg
            focus:outline-none focus:ring-3 focus:ring-green-300 transition-all duration-300 text-gray-800 shadow-sm
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Animated Visual Component (Left Panel) ---
const AnimatedMarketVisual = () => (
  <div className="relative w-full h-full min-h-[250px] md:min-h-full flex flex-col items-center justify-center p-12 overflow-hidden bg-green-700">
    <motion.svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Gradient: Rich Green */}
      <defs>
        <linearGradient id="marketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#15803d" /> {/* Green-700 */}
          <stop offset="100%" stopColor="#14532d" /> {/* Green-900 */}
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#marketGradient)" />
      
      {/* Animated Abstract Market/Crop Shapes */}
      {[...Array(20)].map((_, i) => {
        const cx = 5 + (i * 5) % 90;
        const cyBase = 80 - Math.floor(i / 10) * 30;
        const delay = i * 0.1;

        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cyBase}
            r={1.5}
            fill="#dcfce7" // Light green/mint color
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1], // Pop-in effect
              opacity: [0, 0.8, 0.5],
              y: [0, -5, 0] // Gentle bob
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: delay
            }}
          />
        );
      })}
    </motion.svg>

    {/* Content overlay, updated for Hivictus */}
    <div className="relative z-10 text-white text-center">
      <h1 className="text-5xl font-extrabold tracking-wide mb-3 drop-shadow-md">
        Hivictus
      </h1>
      <p className="text-lg font-light opacity-90 drop-shadow-sm">
        Leading AgriTech e-commerce Marketplace.
      </p>
      <p className="mt-8 text-sm opacity-70">
        Buy fresh, high-quality products direct from FPOs and farmers.
      </p>
    </div>
  </div>
);

// --- Login Component (Core Logic Preserved) ---
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

  const submitLogin = async (e) => { 
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
      // Logic for backend connectivity remains unchanged
      const response = await fetch(`${API_URL}/auth/login`, {
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

      if (handleLogin) { 
        setTimeout(() => handleLogin(data.token, data.user), 1000);
      }

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        // Use max-w-6xl for a wider desktop split-screen view
        className="flex flex-col md:flex-row w-full max-w-6xl bg-white 
          rounded-3xl shadow-2xl overflow-hidden min-h-[600px] hover:shadow-3xl transition-shadow duration-300"
      >

        {/* Left Side: Animated Visual (5/12) */}
        <div className="md:w-5/12 w-full h-auto order-1 md:order-none">
          <AnimatedMarketVisual />
        </div>

        {/* Right Side: Login Form (7/12) */}
        <div className="md:w-7/12 w-full p-8 sm:p-12 flex flex-col justify-center order-2 md:order-none">
          
          <div className="text-center md:text-left mb-8">
            <ShoppingBag size={32} className="text-green-600 mb-2 mx-auto md:mx-0" />
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back to Hivictus!
            </h2>
            <p className="text-gray-500 text-md mt-1">
              Sign in to manage your high-quality fresh produce orders.
            </p>
          </div>
          
          {/* Status Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg relative mb-4 flex items-center space-x-3 text-sm overflow-hidden"
                role="alert"
              >
                <XCircle size={18} />
                <span className="block font-medium">{error}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 border border-green-300 text-green-600 px-4 py-3 rounded-lg relative mb-4 flex items-center space-x-3 text-sm overflow-hidden"
                role="alert"
              >
                <CheckCircle size={18} />
                <span className="block font-medium">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submitLogin}>
            <InputField
              label="Mobile Number"
              name="mobile"
              type="text"
              icon={Phone}
              placeholder="e.g., 12345 67890"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
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

            <Link to="/forgot-password" className="block text-right text-sm text-green-600 hover:text-green-800 transition-colors duration-200 mb-6 font-medium">
              Forgot Password?
            </Link>

            <motion.button
              type="submit"
              disabled={loading}
              // Hover effect uses a pleasant green shadow
              whileHover={{ scale: 1.01, boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)' }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-200/50 disabled:bg-gray-400"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <LogIn size={20} />
              )}
              <span>{loading ? 'Authenticating...' : 'Login to Shop'}</span>
            </motion.button>

            <p className="text-center text-gray-500 text-sm mt-8">
              New to Hivictus?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-800 font-bold transition-colors duration-200 inline-flex items-center space-x-1">
                <UserPlus size={16} />
                <span>Create a Consumer Account</span>
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
