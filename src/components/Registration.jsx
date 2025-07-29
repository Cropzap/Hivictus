import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Mail, Phone, MapPin, User, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff icons

// Input field component for consistent styling
const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, disabled = false, maxLength, inputMode, pattern, value, onChange, validationMessage }) => {
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
            ${validationMessage ? 'border-red-500' : ''}
          `}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          required={label !== 'Address Line 2' && label !== 'Landmark'} // Mark required fields
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
      {validationMessage && <p className="text-red-500 text-xs mt-1">{validationMessage}</p>}
    </div>
  );
};

// Agriculture-themed SVG Component (more dynamic)
const AnimatedSproutSVG = () => (
  <motion.svg
    className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50 z-0"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 0.3, scale: 1 }}
    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
  >
    {/* Main Stem */}
    <motion.path
      d="M100 200 C 120 180, 130 150, 100 120 C 70 90, 80 60, 100 40 C 120 20, 130 0, 100 0"
      fill="none"
      stroke="#4CAF50" // Green color for sprout
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
    />
    {/* Left Leaf */}
    <motion.path
      d="M100 120 Q 70 110, 60 140"
      fill="none"
      stroke="#8BC34A" // Lighter green for leaves
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeOut", delay: 1.0 }}
    />
    {/* Right Leaf */}
    <motion.path
      d="M100 120 Q 130 110, 140 140"
      fill="none"
      stroke="#8BC34A"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeOut", delay: 1.2 }}
    />
    {/* Top Bud */}
    <motion.circle
      cx="100"
      cy="40"
      r="8"
      fill="#FFC107" // Yellow for a bud/flower
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeOut", delay: 2.0 }}
    />
  </motion.svg>
);


const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    otp: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({}); // State for password validation messages

  // Password validation function
  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 6) {
      errors.length = 'Password must be at least 6 characters.';
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Must include a lowercase letter.';
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Must include an uppercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      errors.number = 'Must include a number.';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'mobile' || name === 'pincode' || name === 'otp') && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError('');
    setSuccessMessage('');

    // Real-time password validation feedback
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

  const handleSendOtp = async () => {
    setError('');
    setSuccessMessage('');

    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

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

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: formData.mobile, password: formData.password, confirmPassword: formData.confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      setOtpSent(true);
      setSuccessMessage(data.message || 'OTP sent to your mobile number. Please check your SMS.');
    } catch (err) {
      setError(err.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setSuccessMessage('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: formData.mobile, otp: formData.otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP.');
      }

      setOtpVerified(true);
      setSuccessMessage(data.message || 'OTP verified successfully! You can now complete your registration.');
    } catch (err) {
      setError(err.message || 'Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.pincode ||
      !formData.state
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setSuccessMessage(data.message || 'Registration successful! Welcome to our e-commerce family!');
      setFormData({
        name: '', email: '', mobile: '', password: '', confirmPassword: '', otp: '',
        addressLine1: '', addressLine2: '', landmark: '', city: '', pincode: '', state: '',
      });
      setOtpSent(false);
      setOtpVerified(false);
      setPasswordErrors({}); // Clear password errors on successful registration
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md md:max-w-3xl border border-gray-200 relative overflow-hidden z-10"
      >
        {/* Animated Agriculture SVG */}
        <AnimatedSproutSVG />

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 z-20 relative">
          Create Your Account
        </h2>

        {/* Error and Success Messages */}
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

        <form onSubmit={handleSubmit} className="relative z-20">
          {/* Stage 1: Name, Email, Mobile, Password */}
          {!otpSent && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <User size={22} />
                <span>Personal & Account Details</span>
              </h3>
              <InputField label="Full Name" name="name" icon={User} placeholder="John Doe" value={formData.name} onChange={handleChange} />
              <InputField label="Email ID" name="email" type="email" icon={Mail} placeholder="name@example.com" value={formData.email} onChange={handleChange} />
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                maxLength={20}
                validationMessage={Object.values(passwordErrors).filter(msg => msg !== 'Passwords do not match.').join(' ')} // Show all password errors except confirmation
              />
              {/* Password strength indicators */}
              {formData.password && (
                <div className="text-xs text-gray-600 mb-4 ml-10 -mt-3">
                  <p className={!passwordErrors.length ? 'text-green-600' : 'text-red-500'}>
                    <CheckCircle size={12} className="inline mr-1" /> Min 6 characters
                  </p>
                  <p className={!passwordErrors.lowercase ? 'text-green-600' : 'text-red-500'}>
                    <CheckCircle size={12} className="inline mr-1" /> Lowercase letter
                  </p>
                  <p className={!passwordErrors.uppercase ? 'text-green-600' : 'text-red-500'}>
                    <CheckCircle size={12} className="inline mr-1" /> Uppercase letter
                  </p>
                  <p className={!passwordErrors.number ? 'text-green-600' : 'text-red-500'}>
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
                maxLength={20}
                validationMessage={passwordErrors.confirm}
              />

              <motion.button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || Object.keys(passwordErrors).length > 0} // Disable if password errors exist
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Mail size={20} />
                )}
                <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
              </motion.button>
            </motion.div>
          )}

          {/* Stage 2: OTP Verification */}
          {otpSent && !otpVerified && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <KeyRound size={22} />
                <span>OTP Verification</span>
              </h3>
              <InputField
                label="OTP"
                name="otp"
                type="text"
                icon={KeyRound}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.otp}
                onChange={handleChange}
              />
              <motion.button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
                <span>{loading ? 'Verifying OTP...' : 'Verify OTP'}</span>
              </motion.button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtpVerified(false); setError(''); setSuccessMessage(''); setPasswordErrors({}); }}
                className="w-full text-blue-600 hover:text-blue-800 font-semibold py-2 mt-2 transition-colors duration-200"
              >
                Resend OTP / Edit Mobile Number
              </button>
            </motion.div>
          )}

          {/* Stage 3: Address Details & Final Registration */}
          {otpVerified && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <MapPin size={22} />
                <span>Shipping Address</span>
              </h3>
              <div className="md:grid md:grid-cols-2 md:gap-x-6">
                <InputField label="Address Line 1" name="addressLine1" icon={MapPin} placeholder="House No., Building Name" value={formData.addressLine1} onChange={handleChange} />
                <InputField label="Address Line 2" name="addressLine2" icon={MapPin} placeholder="Street, Area" value={formData.addressLine2} onChange={handleChange} />
                <InputField label="Landmark" name="landmark" icon={MapPin} placeholder="Near XYZ Park" value={formData.landmark} onChange={handleChange} />
                <InputField label="City" name="city" icon={MapPin} placeholder="New York" value={formData.city} onChange={handleChange} />
                <InputField
                  label="Pincode"
                  name="pincode"
                  icon={MapPin}
                  placeholder="123456"
                  maxLength={6}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                <InputField label="State" name="state" icon={MapPin} placeholder="California" value={formData.state} onChange={handleChange} />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg mt-6"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
                <span>{loading ? 'Registering...' : 'Register Now'}</span>
              </motion.button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Registration;