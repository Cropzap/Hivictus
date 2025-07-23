import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaCamera, FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaBuilding, FaBriefcase, FaHome } from 'react-icons/fa'; // Added new icons

// Mock User Data - Expanded for more details
const initialUserData = {
  profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf267ddc?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Example profile pic
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  alternatePhone: '',
  dateOfBirth: '1990-01-15',
  gender: 'Male',
  occupation: 'Software Engineer',
  company: 'Tech Solutions Inc.',
  address: {
    street: '123 Main Street',
    apartment: 'Apt 4B',
    landmark: 'Near City Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India',
  },
};

const UserProfile = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [editedData, setEditedData] = useState(initialUserData); // State to hold changes before saving
  const [editMode, setEditMode] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // State for active tab

  // Function to handle input changes
  const handleChange = (e) => {
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
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // If exiting edit mode without saving, revert changes
      setEditedData(userData);
    }
    setEditMode(!editMode);
  };

  // Function to save changes
  const handleSave = () => {
    setUserData(editedData); // Update actual user data
    setEditMode(false); // Exit edit mode
    setShowSaveMessage(true); // Show success message
    setTimeout(() => setShowSaveMessage(false), 3000); // Hide message after 3 seconds
    // In a real app, you would send editedData to a backend API here
    console.log('Saving data:', editedData);
  };

  // Function to handle profile picture change (mock)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Input Field Component for consistency and styling
  const InputField = ({ label, name, value, type = 'text', readOnly = false, icon: Icon, options }) => (
    <div className="mb-2"> {/* Reduced mb-3 to mb-2 for tighter spacing */}
      <label className="block text-gray-700 text-xs font-medium mb-0.5 flex items-center"> {/* Reduced mb-1 to mb-0.5 */}
        {Icon && <Icon className="mr-1.5 text-gray-500 text-sm" />} {/* Smaller icon, less margin */}
        {label}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          disabled={readOnly}
          className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm
                      ${readOnly ? 'bg-gray-100 border-gray-200 text-gray-700 cursor-default' : 'bg-white border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900'}
                      shadow-sm focus:shadow-md appearance-none pr-8`} // Reduced p-2.5 to p-2
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
          onChange={handleChange}
          readOnly={readOnly}
          className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm
                      ${readOnly ? 'bg-gray-100 border-gray-200 text-gray-700 cursor-default' : 'bg-white border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900'}
                      shadow-sm focus:shadow-md`} // Reduced p-2.5 to p-2
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-3 sm:p-4 font-sans"> {/* Reduced overall padding */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-4xl border border-white/50"> {/* Reduced rounded to 1.5rem, padding */}

        {/* Save Message */}
        {showSaveMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-fade-in-down z-20"> {/* Reduced padding/font size */}
            Profile Saved Successfully!
          </div>
        )}

        {/* Header and Action Buttons */}
        <div className="flex justify-between items-center mt-6 mb-6"> {/* Reduced mb-8 to mb-6 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1> {/* Reduced h1 size */}
          {!editMode ? (
            <button
              onClick={toggleEditMode}
              className="flex items-center bg-emerald-600 text-white px-3 py-1.5 text-sm rounded-full shadow-md
                         transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-95" // Reduced padding/font size
            >
              <FaEdit className="mr-1.5 text-xs" /> Edit {/* Smaller icon */}
            </button>
          ) : (
            <div className="flex space-x-2"> {/* Reduced space-x */}
              <button
                onClick={handleSave}
                className="flex items-center bg-emerald-600 text-white px-3 py-1.5 text-sm rounded-full shadow-md
                           transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-95" // Reduced padding/font size
              >
                <FaSave className="mr-1.5 text-xs" /> Save {/* Smaller icon */}
              </button>
              <button
                onClick={toggleEditMode}
                className="flex items-center bg-gray-300 text-gray-800 px-3 py-1.5 text-sm rounded-full shadow-md
                           transition-all duration-200 hover:bg-gray-400 hover:shadow-lg active:scale-95" // Reduced padding/font size
              >
                <FaTimes className="mr-1.5 text-xs" /> Cancel {/* Smaller icon */}
              </button>
            </div>
          )}
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6"> {/* Reduced mb-8 to mb-6 */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-white shadow-lg bg-gray-200"> {/* Reduced border, slightly smaller on mobile */}
            <img
              src={editedData.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0E0E0/333333?text=User'; }}
            />
            {editMode && (
              <label htmlFor="profile-pic-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                <FaCamera className="text-xl sm:text-2xl" /> {/* Responsive icon size */}
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
            <label htmlFor="profile-pic-upload" className="mt-3 text-emerald-600 cursor-pointer hover:underline text-xs sm:text-sm"> {/* Reduced mt, font size */}
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
        <div className="mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-0.5 flex border border-white/70 shadow-inner"> {/* Reduced mb, padding, rounded */}
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300
                        ${activeTab === 'personal' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-white/70'}`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300
                        ${activeTab === 'address' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-white/70'}`}
          >
            Address
          </button>
        </div>

        {/* Tab Content - Personal Information */}
        {activeTab === 'personal' && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg animate-fade-in"> {/* Reduced padding, rounded */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center"> {/* Reduced h2 size, mb */}
              <FaUserCircle className="mr-2 text-emerald-600 text-xl" /> Personal Information {/* Smaller icon */}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2"> {/* Reduced gaps */}
              <InputField label="First Name" name="firstName" value={editedData.firstName} readOnly={!editMode} />
              <InputField label="Last Name" name="lastName" value={editedData.lastName} readOnly={!editMode} />
              <InputField label="Email" name="email" value={editedData.email} type="email" readOnly={true} icon={FaEnvelope} />
              <InputField label="Phone" name="phone" value={editedData.phone} type="tel" readOnly={!editMode} icon={FaPhone} />
              <InputField label="Alternate Phone" name="alternatePhone" value={editedData.alternatePhone} type="tel" readOnly={!editMode} icon={FaPhone} />
              <InputField label="Date of Birth" name="dateOfBirth" value={editedData.dateOfBirth} type="date" readOnly={!editMode} icon={FaCalendarAlt} />
              <InputField label="Gender" name="gender" value={editedData.gender} type="select" readOnly={!editMode} icon={FaVenusMars} options={['Male', 'Female', 'Other', 'Prefer not to say']} />
              <InputField label="Occupation" name="occupation" value={editedData.occupation} readOnly={!editMode} icon={FaBriefcase} />
              <InputField label="Company" name="company" value={editedData.company} readOnly={!editMode} icon={FaBuilding} />
            </div>
          </div>
        )}

        {/* Tab Content - Address Information */}
        {activeTab === 'address' && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg animate-fade-in"> {/* Reduced padding, rounded */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center"> {/* Reduced h2 size, mb */}
              <FaMapMarkerAlt className="mr-2 text-emerald-600 text-xl" /> Shipping Address {/* Smaller icon */}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2"> {/* Reduced gaps */}
              <InputField label="Street Address" name="address.street" value={editedData.address.street} readOnly={!editMode} icon={FaHome} />
              <InputField label="Apartment/Suite" name="address.apartment" value={editedData.address.apartment} readOnly={!editMode} icon={FaBuilding} />
              <InputField label="Landmark" name="address.landmark" value={editedData.address.landmark} readOnly={!editMode} />
              <InputField label="City" name="address.city" value={editedData.address.city} readOnly={!editMode} />
              <InputField label="State" name="address.state" value={editedData.address.state} readOnly={!editMode} />
              <InputField label="Zip Code" name="address.zip" value={editedData.address.zip} readOnly={!editMode} />
              <InputField label="Country" name="address.country" value={editedData.address.country} readOnly={true} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;