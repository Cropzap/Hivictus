import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Mail, Phone, MapPin, User, KeyRound } from 'lucide-react'; // Using Lucide-React for icons

// Input field component for consistent styling - MOVED OUTSIDE Registration component
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
        value={value} // Now directly using the value prop
        onChange={onChange} // Now directly using the onChange prop
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={`w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-800
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode} // Suggest numeric keyboard for mobile
        pattern={pattern}     // Allow only digits for validation
        required={label !== 'Address Line 2' && label !== 'Landmark'} // Mark required fields
      />
    </div>
  </div>
);


const Registration = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    otp: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
  });

  // State to manage form stages (OTP flow)
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  // State for loading indicators during API calls
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');
  // State for success messages
  const [successMessage, setSuccessMessage] = useState('');

  // Generic handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For numeric inputs, ensure only digits are entered
    if ((name === 'mobile' || name === 'pincode' || name === 'otp') && !/^\d*$/.test(value)) {
      // If non-numeric input, just return without updating state
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // IMPORTANT: error/success messages are cleared on action, not on every keystroke.
  };

  // Handler for sending OTP
  const handleSendOtp = async () => {
    // Clear previous messages before new action
    setError('');
    setSuccessMessage('');

    // Basic validation for mobile number
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    // Simulate API call to send OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      // In a real application, you would make a fetch/axios call here
      // const response = await fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ mobile: formData.mobile }) });
      // if (!response.ok) throw new Error('Failed to send OTP');

      setOtpSent(true);
      setSuccessMessage('OTP sent to your mobile number. Please check your SMS.');
    } catch (err) {
      setError(err.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for verifying OTP
  const handleVerifyOtp = async () => {
    // Clear previous messages before new action
    setError('');
    setSuccessMessage('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);

    // Simulate API call to verify OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      // In a real application, you would make a fetch/axios call here
      // const response = await fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ mobile: formData.mobile, otp: formData.otp }) });
      // if (!response.ok) throw new Error('Invalid OTP');

      // Simulate correct OTP
      if (formData.otp === '123456') { // Replace with actual OTP verification logic
        setOtpVerified(true);
        setSuccessMessage('OTP verified successfully! You can now complete your registration.');
      } else {
        throw new Error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for final registration submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clear previous messages before new action
    setError('');
    setSuccessMessage('');

    // Basic validation for address fields
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

    // Simulate final registration API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
      // In a real application, you would make a fetch/axios call here
      // const response = await fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) });
      // if (!response.ok) throw new Error('Registration failed');

      console.log('Registration Data:', formData); // Log data for demonstration
      setSuccessMessage('Registration successful! Welcome to our e-commerce family!');
      // Optionally reset form or redirect user
      setFormData({
        name: '', email: '', mobile: '', otp: '',
        addressLine1: '', addressLine2: '', landmark: '', city: '', pincode: '', state: '',
      });
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md md:max-w-3xl border border-gray-200 relative overflow-hidden
          before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] before:[background-size:16px_16px] before:opacity-20
        "
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Your Account
        </h2>

        {/* Error and Success Messages */}
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

        <form onSubmit={handleSubmit}>
          {/* Stage 1: Name, Email, Mobile */}
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
                <span>Personal Details</span>
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

              <motion.button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
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
                onClick={() => { setOtpSent(false); setOtpVerified(false); setError(''); setSuccessMessage(''); }}
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
