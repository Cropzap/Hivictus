import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback for handleChange
import { FaEdit, FaSave, FaTimes, FaCamera, FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaBuilding, FaBriefcase, FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react'; // Corrected: Added Loader import
  const API_BASE_URL = import.meta.env.VITE_API_URL;
// --- START: Move InputField OUTSIDE UserProfile component ---
const InputField = ({ label, name, value, type = 'text', readOnly = false, icon: Icon, options, onChange }) => (
  <div className="mb-2">
    <label className="block text-gray-700 text-xs font-medium mb-0.5 flex items-center">
      {Icon && <Icon className="mr-1.5 text-gray-500 text-sm" />}
      {label}
    </label>
    {type === 'select' ? (
      <select
        name={name}
        value={value}
        onChange={onChange} // Use the passed onChange prop
        disabled={readOnly}
        className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm
                    ${readOnly ? 'bg-gray-100 border-gray-200 text-gray-700 cursor-default' : 'bg-white border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900'}
                    shadow-sm focus:shadow-md appearance-none pr-8`}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange} // Use the passed onChange prop
        readOnly={readOnly}
        className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm
                    ${readOnly ? 'bg-gray-100 border-gray-200 text-gray-700 cursor-default' : 'bg-white border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900'}
                    shadow-sm focus:shadow-md`}
      />
    )}
  </div>
);
// --- END: Move InputField OUTSIDE UserProfile component ---


const UserProfile = () => {
  const [userData, setUserData] = useState({
    profilePicture: 'https://placehold.co/150x150/E0E0E0/333333?text=User',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    company: '',
    address: {
      street: '',
      apartment: '',
      landmark: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
    },
  });

  const [editedData, setEditedData] = useState({ ...userData });
  const [editMode, setEditMode] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Wrap handleChange in useCallback to prevent it from changing on every render,
  // which ensures InputField doesn't get a new prop causing re-render issues.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setEditedData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []); // Empty dependency array means this function is created once

  const handleProfilePicChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({
          ...prev,
          profilePicture: reader.result, // Store Base64 string
        }));
        setError(''); // Clear any previous errors related to file upload
      };
      reader.onerror = (error) => {
        setError('Failed to read file: ' + error.target.error);
        console.error("File reading error:", error);
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  }, []);


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('You are not logged in. Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': authToken,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data.');
        }

        const fetchedData = {
          profilePicture: data.profilePicture || 'https://placehold.co/150x150/E0E0E0/333333?text=User',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          mobile: data.mobile || '',
          alternatePhone: data.alternatePhone || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          gender: data.gender || '',
          occupation: data.occupation || '',
          company: data.company || '',
          address: {
            street: data.address?.street || '',
            apartment: data.address?.apartment || '',
            landmark: data.address?.landmark || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zip: data.address?.zip || '',
            country: data.address?.country || 'India',
          },
        };
        setUserData(fetchedData);
        setEditedData(fetchedData);
      } catch (err) {
        setError(err.message || 'Error fetching profile. Please try again.');
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleEditMode = () => {
    if (editMode) {
      setEditedData(userData);
      setError('');
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken,
        },
        body: JSON.stringify(editedData), // Send all edited data including Base64 image
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update profile.');
        }

        setUserData(editedData); // Update userData with the new saved data
        setEditMode(false);
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 3000);
        console.log('Profile saved:', data);
      } else {
        const text = await response.text();
        console.error("Server responded with non-JSON:", text);
        throw new Error(`Server error: ${response.status} ${response.statusText}. Response was not JSON.`);
      }
    } catch (err) {
      setError(err.message || 'Error saving profile. Please try again.');
      console.error("Save profile error:", err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-3 sm:p-4 font-sans">
        <div className="flex flex-col items-center text-emerald-700">
          <Loader size={48} className="animate-spin mb-4" />
          <p className="text-lg">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-4xl border border-white/50">

        {/* Success/Error Messages */}
        <AnimatePresence>
          {showSaveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-fade-in-down z-20"
            >
              Profile Saved Successfully!
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-fade-in-down z-20"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>


        {/* Header and Action Buttons */}
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          {!editMode ? (
            <motion.button
              onClick={toggleEditMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-emerald-600 text-white px-3 py-1.5 text-sm rounded-full shadow-md
                         transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
            >
              <FaEdit className="mr-1.5 text-xs" /> Edit
            </motion.button>
          ) : (
            <div className="flex space-x-2">
              <motion.button
                onClick={handleSave}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-emerald-600 text-white px-3 py-1.5 text-sm rounded-full shadow-md
                           transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
              >
                {loading ? <Loader size={12} className="animate-spin mr-1.5" /> : <FaSave className="mr-1.5 text-xs" />} Save
              </motion.button>
              <motion.button
                onClick={toggleEditMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-gray-300 text-gray-800 px-3 py-1.5 text-sm rounded-full shadow-md
                           transition-all duration-200 hover:bg-gray-400 hover:shadow-lg active:scale-95"
              >
                <FaTimes className="mr-1.5 text-xs" /> Cancel
              </motion.button>
            </div>
          )}
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-white shadow-lg bg-gray-200">
            <img
              src={editedData.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0E0E0/333333?text=User'; }}
            />
            {editMode && (
              <label htmlFor="profile-pic-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                <FaCamera className="text-xl sm:text-2xl" />
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            )}
          </div>
          {editMode && (
            <label htmlFor="profile-pic-upload" className="mt-3 text-emerald-600 cursor-pointer hover:underline text-xs sm:text-sm">
              Change Profile Picture
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
        </div>

        {/* Animated Tabs for Sections */}
        <div className="mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-0.5 flex border border-white/70 shadow-inner">
          <motion.button
            onClick={() => setActiveTab('personal')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300
                        ${activeTab === 'personal' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-white/70'}`}
          >
            Personal Details
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('address')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300
                        ${activeTab === 'address' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-white/70'}`}
          >
            Address
          </motion.button>
        </div>

        {/* Tab Content - Personal Information */}
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div
              key="personal-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUserCircle className="mr-2 text-emerald-600 text-xl" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
                <InputField label="First Name" name="firstName" value={editedData.firstName} onChange={handleChange} readOnly={!editMode} />
                <InputField label="Last Name" name="lastName" value={editedData.lastName} onChange={handleChange} readOnly={!editMode} />
                <InputField label="Email" name="email" value={editedData.email} type="email" readOnly={true} icon={FaEnvelope} />
                <InputField label="Phone" name="mobile" value={editedData.mobile} type="tel" readOnly={true} icon={FaPhone} />
                <InputField label="Alternate Phone" name="alternatePhone" value={editedData.alternatePhone} onChange={handleChange} type="tel" readOnly={!editMode} icon={FaPhone} />
                <InputField label="Date of Birth" name="dateOfBirth" value={editedData.dateOfBirth} onChange={handleChange} type="date" readOnly={!editMode} icon={FaCalendarAlt} />
                <InputField label="Gender" name="gender" value={editedData.gender} onChange={handleChange} type="select" readOnly={!editMode} icon={FaVenusMars} options={['', 'Male', 'Female', 'Other', 'Prefer not to say']} />
                <InputField label="Occupation" name="occupation" value={editedData.occupation} onChange={handleChange} readOnly={!editMode} icon={FaBriefcase} />
                <InputField label="Company" name="company" value={editedData.company} onChange={handleChange} readOnly={!editMode} icon={FaBuilding} />
              </div>
            </motion.div>
          )}

          {/* Tab Content - Address Information */}
          {activeTab === 'address' && (
            <motion.div
              key="address-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-emerald-600 text-xl" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
                <InputField label="Street Address" name="address.street" value={editedData.address.street} onChange={handleChange} readOnly={!editMode} icon={FaHome} />
                <InputField label="Apartment/Suite" name="address.apartment" value={editedData.address.apartment} onChange={handleChange} readOnly={!editMode} icon={FaBuilding} />
                <InputField label="Landmark" name="address.landmark" value={editedData.address.landmark} onChange={handleChange} readOnly={!editMode} />
                <InputField label="City" name="address.city" value={editedData.address.city} onChange={handleChange} readOnly={!editMode} />
                <InputField label="State" name="address.state" value={editedData.address.state} onChange={handleChange} readOnly={!editMode} />
                <InputField label="Zip Code" name="address.zip" value={editedData.address.zip} onChange={handleChange} readOnly={!editMode} />
                <InputField label="Country" name="address.country" value={editedData.address.country} onChange={handleChange} readOnly={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UserProfile;