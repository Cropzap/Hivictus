import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Mail, Phone, MapPin, User, KeyRound, Lock, Eye, EyeOff, LogIn } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 

const API_URL = import.meta.env.VITE_API_URL;
// --- Input Field Component (Styled to match the Hivictus green theme) ---
const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, disabled = false, maxLength, inputMode, pattern, value, onChange, validationMessage, required = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="relative mb-5">
      {label && (
        <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
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
            ${validationMessage ? 'border-red-500 ring-1 ring-red-300' : ''}
          `}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          required={required}
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
      {validationMessage && <p className="text-red-500 text-xs mt-1 font-medium">{validationMessage}</p>}
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
      
      {/* Animated Abstract Crop/Data Shapes */}
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

    {/* Content overlay, updated for Hivictus Registration */}
    <div className="relative z-10 text-white text-center">
      <h1 className="text-5xl font-extrabold tracking-wide mb-3 drop-shadow-md">
        Hivictus
      </h1>
      <p className="text-xl font-light opacity-90 drop-shadow-sm">
        Join the AgriTech e-commerce Network.
      </p>
      <p className="mt-8 text-sm opacity-70">
        Register today to gain direct access to sustainable, high-quality produce.
      </p>
    </div>
  </div>
);


// --- Registration Component ---
const Registration = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: '', otp: '',
    addressLine1: '', addressLine2: '', landmark: '', city: '', pincode: '', state: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});

  // Utility function for email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 6) { errors.length = 'Min 6 characters.'; }
    if (!/[a-z]/.test(password)) { errors.lowercase = 'Must include a lowercase letter.'; }
    if (!/[A-Z]/.test(password)) { errors.uppercase = 'Must include an uppercase letter.'; }
    if (!/[0-9]/.test(password)) { errors.number = 'Must include a number.'; }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for mobile, pincode, and otp
    if ((name === 'mobile' || name === 'pincode' || name === 'otp') && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value, }));
    setError('');
    setSuccessMessage('');

    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    } else if (name === 'confirmPassword') {
      if (formData.password !== value) {
        setPasswordErrors(prev => ({ ...prev, confirm: 'Passwords do not match.' }));
      } else {
        setPasswordErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.confirm;
          return newErrors;
        });
      }
    }
  };

  // --- API Stub for Sending Email OTP ---
  const handleSendOtp = async () => {
    setError('');

    if (!formData.name) { setError('Full Name is required.'); return; }
    if (!formData.email || !isValidEmail(formData.email)) { setError('Please enter a valid email address.'); return; }
    
    // Validate Password
    const pErrors = validatePassword(formData.password);
    if (Object.keys(pErrors).length > 0) { 
      setPasswordErrors(pErrors);
      setError('Please meet all password requirements.'); 
      return; 
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordErrors(prev => ({ ...prev, confirm: 'Passwords do not match.' }));
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setSuccessMessage(''); // Clear previous success messages

    try {
      // FIX: Include password and confirmPassword in the request body
      const response = await fetch(`${API_URL}/auth/send-email-otp`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password,       // <-- ADDED THIS
          confirmPassword: formData.confirmPassword // <-- ADDED THIS
        }) 
      });
      
      const data = await response.json();
      
      if (!response.ok) { throw new Error(data.message || 'Failed to send OTP.'); }
      
      setOtpSent(true);
      setSuccessMessage(`OTP sent successfully to ${formData.email}. Please check your inbox (and spam folder)!`);
    } catch (err) {
      setError(err.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- API Stub for Verifying Email OTP ---
  const handleVerifyOtp = async () => {
    setError('');
    if (!formData.otp || formData.otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
    
    setLoading(true);
    setSuccessMessage('');

    try {
      // NOTE: Replace this with your actual backend endpoint
      const response = await fetch(`${API_URL}/auth/verify-email-otp`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: formData.email, otp: formData.otp }) 
      });
      
      const data = await response.json();
      
      if (!response.ok) { throw new Error(data.message || 'Invalid or expired OTP.'); }
      
      setOtpVerified(true);
      setSuccessMessage('Email verified successfully! You can now enter your address details.');
    } catch (err) {
      setError(err.message || 'Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- API Stub for Final Registration ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic final required field check (Address)
    if (!formData.addressLine1 || !formData.city || !formData.pincode || !formData.state) {
      setError('Please fill in all required address fields.');
      return;
    }
    
    setLoading(true);
    setSuccessMessage('');

    try {
      // NOTE: Replace this with your actual backend registration endpoint
      const response = await fetch(`${API_URL}/auth/register`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
      
      const data = await response.json();
      
      if (!response.ok) { throw new Error(data.message || 'Registration failed.'); }
      
      setSuccessMessage(data.message || 'Registration successful! Welcome to Hivictus!');
      // Reset form state on success
      setFormData({ name: '', email: '', mobile: '', password: '', confirmPassword: '', otp: '', addressLine1: '', addressLine2: '', landmark: '', city: '', pincode: '', state: '', });
      setOtpSent(false); setOtpVerified(false); setPasswordErrors({});
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine if Stage 1 inputs are ready for OTP generation
  const isStage1Ready = formData.name && isValidEmail(formData.email) && !Object.keys(passwordErrors).length && formData.password === formData.confirmPassword && formData.password.length >= 6;


  return (
    // Full width and height container using a subtle green background for an earthy feel
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

        {/* Right Side: Registration Form (7/12) */}
        <div className="md:w-7/12 w-full p-8 sm:p-12 flex flex-col justify-center order-2 md:order-none">
          
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Create Your Hivictus Account
            </h2>
            <p className="text-gray-500 text-md mt-1">
              Secure your spot in the future of AgriTech e-commerce.
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
          
          <form onSubmit={handleSubmit} className="relative overflow-hidden">
            {/* Conditional Stages Wrapper for Animation */}
            <motion.div
              key={otpVerified ? 'stage3' : otpSent ? 'stage2' : 'stage1'}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full top-0 left-0" // Overlay all stages, use absolute positioning to animate out
              style={{ position: 'relative' }} // Override to ensure content is inside flow
            >
              
              {/* Stage 1: Personal & Account Details (Initial View) */}
              {!otpSent && (
                <>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <User size={20} className="text-green-600"/>
                    <span>Personal & Security Setup</span>
                  </h3>
                  
                  <InputField label="Full Name" name="name" icon={User} placeholder="Your name" value={formData.name} onChange={handleChange} />
                  <InputField label="Email ID" name="email" type="email" icon={Mail} placeholder="name@example.com" value={formData.email} onChange={handleChange} />
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
                    required={false}
                  />
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    validationMessage={Object.values(passwordErrors).filter(msg => msg !== 'Passwords do not match.').join(' ')} 
                  />
                  
                  {/* Password strength indicators */}
                  {formData.password && (
                    <div className="text-xs text-gray-600 mb-4 ml-12 -mt-2 grid grid-cols-2 gap-y-1">
                      <p className={`flex items-center ${!passwordErrors.length ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle size={12} className="inline mr-1" /> Min 6 characters
                      </p>
                      <p className={`flex items-center ${!passwordErrors.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle size={12} className="inline mr-1" /> Lowercase
                      </p>
                      <p className={`flex items-center ${!passwordErrors.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle size={12} className="inline mr-1" /> Uppercase
                      </p>
                      <p className={`flex items-center ${!passwordErrors.number ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle size={12} className="inline mr-1" /> Number
                      </p>
                    </div>
                  )}
                  
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    validationMessage={passwordErrors.confirm}
                  />

                  <motion.button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || !isStage1Ready}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 15px rgba(22, 163, 74, 0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-200/50 disabled:bg-gray-400"
                  >
                    {loading ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      <Mail size={20} />
                    )}
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP to Email'}</span>
                  </motion.button>
                </>
              )}

              {/* Stage 2: OTP Verification (Conditionally shown) */}
              {otpSent && !otpVerified && (
                <>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <KeyRound size={20} className="text-green-600"/>
                    <span>Email OTP Verification</span>
                  </h3>
                  <p className="text-gray-500 mb-4 text-sm">A 6-digit OTP has been sent to **{formData.email}**.</p>
                  
                  <InputField
                    label="Email OTP"
                    name="otp"
                    type="text"
                    icon={KeyRound}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                  <motion.button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || formData.otp.length !== 6}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 15px rgba(52, 211, 153, 0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-200/50 disabled:bg-gray-400"
                  >
                    {loading ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpVerified(false); setError(''); setSuccessMessage(''); setFormData(prev => ({ ...prev, otp: '' })); }}
                    className="w-full text-green-600 hover:text-green-800 font-semibold py-2 mt-4 transition-colors duration-200"
                  >
                    Edit Email / Resend OTP
                  </button>
                </>
              )}

              {/* Stage 3: Address Details & Final Registration (Conditionally shown) */}
              {otpVerified && (
                <>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <MapPin size={20} className="text-green-600"/>
                    <span>Shipping Address (Final Step)</span>
                  </h3>
                  <div className="md:grid md:grid-cols-2 md:gap-x-6">
                    <InputField label="Address Line 1" name="addressLine1" icon={MapPin} placeholder="House No., Building Name" value={formData.addressLine1} onChange={handleChange} />
                    <InputField label="Address Line 2" name="addressLine2" icon={MapPin} placeholder="Street, Area" value={formData.addressLine2} onChange={handleChange} required={false} />
                    <InputField label="Landmark" name="landmark" icon={MapPin} placeholder="Near XYZ Park" value={formData.landmark} onChange={handleChange} required={false} />
                    <InputField label="City" name="city" icon={MapPin} placeholder="Tamil Nadu" value={formData.city} onChange={handleChange} />
                    <InputField
                      label="Pincode"
                      name="pincode"
                      icon={MapPin}
                      placeholder="6XXXXX"
                      maxLength={6}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                    <InputField label="State" name="state" icon={MapPin} placeholder="Delhi" value={formData.state} onChange={handleChange} />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 15px rgba(21, 128, 61, 0.4)' }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-300/50 disabled:bg-gray-400 mt-6"
                  >
                    {loading ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      <LogIn size={20} />
                    )}
                    <span>{loading ? 'Finalizing Registration...' : 'Complete Registration'}</span>
                  </motion.button>
                </>
              )}
            </motion.div>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-800 font-bold transition-colors duration-200 inline-flex items-center space-x-1">
              <span>Go to Login</span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
