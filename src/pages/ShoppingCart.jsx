import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Trash2, Check, X, Loader, MapPin, Phone, User, PlusCircle } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Assuming this context exists

const API_BASE_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE_URL = 'https://placehold.co/100x100/E5E7EB/9CA3AF?text=Product';

// --- PROFILE ADDRESS MODEL MAPPING ---
/*
  Profile Model: { address: { street, apartment, landmark, city, state, zip, country }, name, mobile }
  Shipping Details Model: { name, address1, address2, city, postalCode, country, phone }
*/
const mapProfileToShipping = (profile, profileAddress) => ({
    name: profile?.name || '',
    // Apply profile model fields to address lines 1 and 2
    address1: profileAddress?.street || '', // street goes to Address Line 1
    address2: profileAddress?.apartment ? `${profileAddress.apartment}, ${profileAddress.landmark || ''}`.trim() : profileAddress?.landmark || '', // apartment/landmark goes to Address Line 2
    city: profileAddress?.city || '',
    postalCode: profileAddress?.zip || '', // zip goes to Postal Code
    country: profileAddress?.country || 'India',
    phone: profile?.mobile || '',
});

// ====================================================================
// --- New Address Modal Component (Replaces old CheckoutModal) ---
// ====================================================================

const InputField = ({ label, name, type = 'text', value, onChange, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 text-sm"
        />
    </div>
);

const AddNewAddressModal = ({ isOpen, onClose, onPlaceOrder, shippingDetails, onShippingChange, total, isPlacingOrder }) => {
    // Note: The form handles submission via onPlaceOrder, which expects the full details.

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                        exit={{ scale: 0.9, y: 50, opacity: 0, transition: { duration: 0.2 } }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Enter New Shipping Address</h2>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </div>
                            <form onSubmit={onPlaceOrder}>
                                <div className="space-y-4">
                                    <InputField label="Full Name" name="name" value={shippingDetails.name} onChange={onShippingChange} required />
                                    <InputField label="Phone Number" name="phone" type="tel" value={shippingDetails.phone} onChange={onShippingChange} required />
                                    {/* Address lines mapped from profile model: street (1) and apartment/landmark (2) */}
                                    <InputField label="Address Line 1 (Street)" name="address1" value={shippingDetails.address1} onChange={onShippingChange} required />
                                    <InputField label="Address Line 2 (Apartment/Landmark)" name="address2" value={shippingDetails.address2} onChange={onShippingChange} />
                                    <InputField label="City" name="city" value={shippingDetails.city} onChange={onShippingChange} required />
                                    <InputField label="Postal Code (ZIP)" name="postalCode" value={shippingDetails.postalCode} onChange={onShippingChange} required />
                                    <InputField label="Country" name="country" value={shippingDetails.country} onChange={onShippingChange} required />
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-between font-bold text-xl text-green-700">
                                        <span>Total to Pay:</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <motion.button
                                    type="submit"
                                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform flex items-center justify-center disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed"
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isPlacingOrder}
                                >
                                    {isPlacingOrder ? (
                                        <><Loader className="animate-spin mr-2" size={20} />Placing Order...</>
                                    ) : 'Confirm & Place Order'}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ====================================================================
// --- NEW: Shipping Address Selector Component ---
// ====================================================================

const ShippingAddressSelector = ({ profile, profileAddress, selectedAddress, onSelectAddress, onAddNewAddress, total, selectedItemCount, handleProceedToCheckout }) => {
    
    // Check if a full address exists in the profile
    const hasFullProfileAddress = profileAddress && profileAddress.street && profileAddress.city && profileAddress.zip;
    const isProfileAddressSelected = selectedAddress === 'profile' && hasFullProfileAddress;

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                <MapPin size={24} className="mr-2 text-green-600" /> Shipping Address
            </h2>
            
            {hasFullProfileAddress ? (
                <>
                    {/* Display Existing Address Card */}
                    <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isProfileAddressSelected ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => onSelectAddress('profile')}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-gray-900 flex items-center">
                                {isProfileAddressSelected && <Check size={18} className="text-green-600 mr-2" />}
                                {profile.name}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {/* Address Line 1: Street */}
                            **{profileAddress.street}**
                            
                            {/* Address Line 2: Apartment, Landmark */}
                            {profileAddress.apartment || profileAddress.landmark ? `, ${profileAddress.apartment || ''} ${profileAddress.landmark || ''}` : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                            {profileAddress.city}, {profileAddress.state} - **{profileAddress.zip}**
                        </p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Phone size={14} className="mr-1" /> {profile.mobile}
                        </p>
                        
                    </div>

                    {/* Add New Address Button */}
                    <motion.button
                        onClick={onAddNewAddress}
                        className="w-full mt-4 flex items-center justify-center text-green-600 font-semibold py-2 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                        whileTap={{ scale: 0.98 }}
                    >
                        <PlusCircle size={20} className="mr-2" /> Add New Address
                    </motion.button>
                </>
            ) : (
                // No profile address found, force user to add one
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-3">No saved address found. Please add a new shipping address.</p>
                    <motion.button
                        onClick={onAddNewAddress}
                        className="w-full max-w-xs mx-auto flex items-center justify-center bg-green-600 text-white font-semibold py-3 rounded-full hover:bg-green-700 transition-colors shadow-md"
                        whileTap={{ scale: 0.98 }}
                    >
                        <PlusCircle size={20} className="mr-2" /> Add Address
                    </motion.button>
                </div>
            )}
            
            {/* Proceed to Checkout Button (Integrated Here for flow control) */}
            <motion.button 
                onClick={handleProceedToCheckout} 
                className={`w-full mt-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md flex items-center justify-center 
                    ${selectedItemCount === 0 || (!isProfileAddressSelected && !selectedAddress) 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'}`
                }
                whileTap={{ scale: 0.98 }}
                disabled={selectedItemCount === 0 || (!isProfileAddressSelected && !selectedAddress)}
            >
                <Check size={20} className="mr-2" /> Proceed to Payment
            </motion.button>
        </div>
    );
};


// ====================================================================
// --- Main Cart Page Component ---
// ====================================================================

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false); // Renamed state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // NEW STATES
  const [profileData, setProfileData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('profile'); // 'profile' or 'new'
  const [shippingDetails, setShippingDetails] = useState({
    name: '', address1: '', address2: '', city: '', postalCode: '', country: 'India', phone: ''
  });

  const { fetchCartQuantity } = useCart();

  // --- Auth & Initial Fetch ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    } else {
      setLoading(false);
      setError("Please log in to view your cart.");
    }
  }, []);

  // --- Toast Functions ---
  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // --- Profile Fetch for Pre-fill & Address ---
  const fetchUserProfile = useCallback(async () => {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, { headers: { 'x-auth-token': authToken }});
      if (res.ok) {
        const profileData = await res.json();
        setProfileData(profileData);
        
        // Initial setup of shipping details using profile data
        const mappedDetails = mapProfileToShipping(profileData, profileData.address);
        setShippingDetails(mappedDetails);
        
      } else {
         console.warn("Could not fetch user profile or no profile data returned.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [authToken]);
  
  useEffect(() => {
    if (authToken) { fetchUserProfile(); }
  }, [authToken, fetchUserProfile]);


  // --- Cart Fetching ---
  const fetchCart = useCallback(async () => {
    if (!authToken) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, { headers: { 'x-auth-token': authToken }});
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const data = await response.json();
      
      const processedCartItems = data.items
        .filter(item => item.productId)
        .map(item => ({
          productId: item.productId._id, 
          name: item.productId.name, 
          price: item.productId.price, 
          unit: item.productId.unit,
          productDetails: item.productId, 
          imageUrl: item.productId.imageUrl, 
          quantity: item.quantity, 
          isSelected: item.isSelected !== undefined ? item.isSelected : true
        }));
      setCartItems(processedCartItems);
    } catch (err) {
      setError(err.message);
      showToastMessage('Failed to load cart. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authToken, showToastMessage]);

  useEffect(() => {
    if (authToken) { fetchCart(); }
  }, [authToken, fetchCart]);
  
  // --- Cart Backend Update Utility (remains the same) ---
  const updateCartBackend = useCallback(async (endpoint, method, body = {}) => {
    if (!authToken) { showToastMessage('Authentication required.', 'error'); return false; }
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${endpoint}`, {
        method: method, headers: { 'x-auth-token': authToken, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Update failed'); }
      await fetchCart();
      fetchCartQuantity();
      return true;
    } catch (err) {
      showToastMessage(`Failed to update cart: ${err.message}`, 'error');
      return false;
    }
  }, [authToken, fetchCart, fetchCartQuantity, showToastMessage]);

  // --- Calculations (remain the same) ---
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => item.isSelected ? sum + item.price * item.quantity : sum, 0), [cartItems]);
  const shipping = subtotal > 0 ? 50.00 : 0; 
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;
  const selectedItemCount = cartItems.filter(i => i.isSelected).length;
  const allSelected = cartItems.length > 0 && selectedItemCount === cartItems.length;

  // --- Handlers ---
  const handleQuantityChange = async (productId, newQuantity) => { if (newQuantity >= 1) { await updateCartBackend(`update-quantity`, 'PUT', { productId, quantity: newQuantity }); } };
  const handleDeleteItem = async (productId) => { if (await updateCartBackend(`remove/${productId}`, 'DELETE')) { showToastMessage('Item removed from cart.', 'error'); } };
  const handleToggleSelect = async (productId) => { const item = cartItems.find(i => i.productId === productId); if (item) { await updateCartBackend('toggle-select', 'PUT', { productId, isSelected: !item.isSelected }); } };
  const handleSelectAll = async () => { await updateCartBackend('toggle-select-all', 'PUT', { selectAll: !allSelected }); };

  // NEW ADDRESS SELECTION HANDLERS
  const handleSelectAddress = (addressType) => {
    setSelectedAddress(addressType);
    if (addressType === 'profile' && profileData) {
        // Use the saved profile address
        const mappedDetails = mapProfileToShipping(profileData, profileData.address);
        setShippingDetails(mappedDetails);
    } else if (addressType === 'new') {
        // Clear address fields but keep name/phone for quick entry
        setShippingDetails(prev => ({
            ...prev,
            address1: '', address2: '', city: '', postalCode: '', country: 'India'
        }));
        setIsNewAddressModalOpen(true);
    }
  };

  const handleAddNewAddress = () => {
    // Select 'new' and open the modal
    handleSelectAddress('new');
  };
  
  // Adjusted Checkout Logic
  const handleProceedToCheckout = () => { 
      if (selectedItemCount === 0) {
          showToastMessage('Please select items to proceed.', 'error'); 
          return; 
      }
      
      if (!profileData || !profileData.address || !profileData.address.street) {
          // If no saved address, open the new address modal immediately
          handleAddNewAddress();
          return;
      }
      
      // If a profile address exists and it is selected, or if 'new' is selected (which opens the modal), proceed.
      // If profile address exists, the user will proceed to payment confirmation, or open the modal if they click 'Add New'.
      // For the desktop button, we now rely on the ShippingAddressSelector to control the flow.
      // The mobile button will trigger the flow defined in ShippingAddressSelector by calling handleAddNewAddress if needed.
      
      // If an address is selected (profile or new, where 'new' is handled by the modal),
      // we can proceed to the final step (which is placing the order in the modal/form).
      if (selectedAddress === 'profile' && profileData.address.street) {
          // Address is selected, the desktop button or mobile flow can now trigger the place order function directly
          // We will rely on the modal to handle the final submission via the form structure.
          setIsNewAddressModalOpen(true); // Open modal for final review/submission
      } else if (selectedAddress === 'new') {
           // Modal is already open or will be opened by handleSelectAddress('new')
           setIsNewAddressModalOpen(true);
      } else {
          showToastMessage('Please select or add a shipping address.', 'error'); 
      }
  };
  
  const handleShippingChange = (e) => { setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value }); };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    try {
        // Validate required fields based on the model
        if (!shippingDetails.name || !shippingDetails.address1 || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.phone) {
             throw new Error('Please fill in all required address fields.');
        }

        const response = await fetch(`${API_BASE_URL}/orders/place`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken }, 
            body: JSON.stringify({ shippingAddress: shippingDetails }),
        });
        const data = await response.json();
        if (!response.ok) { throw new Error(data.msg || (data.errors && data.errors[0].msg) || 'Failed to place order.'); }
        
        showToastMessage('Order placed successfully!', 'success');
        setIsNewAddressModalOpen(false);
        // Clear the cart on success
        await fetchCart();
        await fetchCartQuantity();
    } catch (err) {
        showToastMessage(err.message, 'error');
        console.error("Error placing order:", err);
    } finally {
        setIsPlacingOrder(false);
    }
  };

  // --- UI Constants ---
  const toastVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 } };
  const buttonPress = { scale: 0.95 };
  const checkmarkVariants = { checked: { pathLength: 1 }, unchecked: { pathLength: 0 } };

  // --- Loading & Error States ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader className="animate-spin text-green-600" size={48} /></div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-700 bg-gray-50 p-6">
      <X size={48} className="mb-4" />
      <p className="font-semibold text-xl mb-4">Error: {error}</p>
      <motion.button onClick={() => navigate(authToken ? '/products' : '/login')} className="bg-green-600 text-white py-2 px-6 rounded-full font-bold hover:bg-green-700" whileTap={buttonPress}>
        {authToken ? 'Continue Shopping' : 'Go to Login'}
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-32 lg:pb-10">
      
      {/* Mobile Header (Fixed) */}
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 w-full bg-white z-40 shadow-md py-4 flex items-center justify-between px-4 lg:hidden">
        <motion.button onClick={() => navigate(-1)} whileTap={buttonPress}><ChevronLeft size={22} /></motion.button>
        <h1 className="text-2xl font-semibold">My Cart ({cartItems.length})</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Desktop Header */}
      <div className="hidden lg:block container mx-auto pt-10 pb-6 px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <ShoppingCart size={32} className="inline mr-3 text-green-600" />
            Your Shopping Cart ({cartItems.length} items)
        </h1>
        <p className="text-gray-600">Review your selected fresh produce and proceed to checkout.</p>
      </div>

      {/* Main Content: Mobile (Single Column) & Desktop (Two Columns) */}
      <div className="pt-20 p-4 lg:pt-0 lg:p-10 container mx-auto">
        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-xl shadow-lg mt-10">
            <ShoppingCart size={60} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium">Your cart is empty!</p>
            <motion.button onClick={() => navigate('/products')} className="mt-6 bg-green-600 text-white py-3 px-8 rounded-full font-bold hover:bg-green-700" whileTap={buttonPress}>Shop Now</motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-8">

            {/* Left Column: Cart Items (8/12 on Desktop, Full-width on Mobile) */}
            <div className="w-full lg:w-8/12"> 
              <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden lg:block">Items in Cart</h2>
              
              {/* Select All */}
              <div className="bg-white rounded-xl shadow-md p-4 flex items-center mb-4 border border-gray-200">
                <motion.button
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 transition-colors ${allSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
                  onClick={handleSelectAll}
                  whileTap={buttonPress}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <motion.path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" variants={checkmarkVariants} initial="unchecked" animate={allSelected ? "checked" : "unchecked"} />
                  </svg>
                </motion.button>
                <span className="text-lg font-semibold">Select All Items ({selectedItemCount} of {cartItems.length} selected)</span>
              </div>

              {/* Cart Items List */}
              <AnimatePresence>
                {cartItems.map(item => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onDelete={handleDeleteItem}
                    onToggleSelect={handleToggleSelect}
                    checkmarkVariants={checkmarkVariants}
                    buttonPress={buttonPress}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Right Column: Address Selector & Order Summary (4/12 on Desktop, Full-width on Mobile) */}
            <div className="w-full lg:w-4/12 mt-6 lg:mt-0 lg:sticky lg:top-8 self-start">
                
                {/* 🔑 NEW: Shipping Address Selector 🔑 */}
                <ShippingAddressSelector
                    profile={profileData}
                    profileAddress={profileData?.address}
                    selectedAddress={selectedAddress}
                    onSelectAddress={handleSelectAddress}
                    onAddNewAddress={handleAddNewAddress}
                    total={total}
                    selectedItemCount={selectedItemCount}
                    handleProceedToCheckout={handleProceedToCheckout} // Use the modified checkout handler
                />
                
                {/* Order Summary (Now visible on ALL platforms here) */}
                <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal ({selectedItemCount} items)</span>
                            <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-gray-800">₹{shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax ({taxRate * 100}%)</span>
                            <span className="font-medium text-gray-800">₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t-2 mt-2 text-xl font-extrabold text-green-700">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer (Fixed) - Removed Checkout button as it's now in the ShippingAddressSelector on desktop */}
      {cartItems.length > 0 && (
        <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            className="fixed bottom-0 left-0 w-full bg-white z-40 shadow-xl p-4 flex items-center justify-between gap-4 lg:hidden"
        >
          <div>
              <span className="text-sm text-gray-500">Total:</span>
              <span className="text-3xl font-extrabold text-green-700 block">₹{total.toFixed(2)}</span>
          </div>
          <motion.button 
              onClick={handleProceedToCheckout} 
              className={`flex-1 ${selectedItemCount === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-4 rounded-full text-xl font-semibold`} 
              whileTap={buttonPress} 
              disabled={selectedItemCount === 0}
          >
              Proceed to Payment
          </motion.button>
        </motion.div>
      )}

      {/* Checkout Modal (Now dedicated for adding/editing address before final submit) */}
      <AddNewAddressModal
          isOpen={isNewAddressModalOpen}
          onClose={() => setIsNewAddressModalOpen(false)}
          onPlaceOrder={handlePlaceOrder}
          shippingDetails={shippingDetails}
          onShippingChange={handleShippingChange}
          total={total}
          isPlacingOrder={isPlacingOrder}
        />
        
      {/* Toast Notification */}
      <AnimatePresence>
          {showToast && (
              <motion.div 
                  variants={toastVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-full shadow-lg z-50 font-medium`}
              >
                  {toastMessage}
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;

// --- CartItem Component (Unchanged, included for completeness) ---

const CartItem = ({ item, onQuantityChange, onDelete, onToggleSelect, checkmarkVariants, buttonPress }) => {
    
    const getImageUrl = (item) => {
        let url = (item.productDetails?.imageUrls && item.productDetails.imageUrls.length > 0)
            ? item.productDetails.imageUrls[0]
            : item.imageUrl;

        if (url) {
            const isBase64 = url.length > 100 && !url.startsWith('http') && !url.startsWith('data:');
            if (isBase64) {
                return `data:image/jpeg;base64,${url}`;
            }
        }
        return url || FALLBACK_IMAGE_URL;
    };

    const displayImageUrl = getImageUrl(item);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-xl shadow-md p-3 sm:p-5 flex items-center mb-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
            {/* Checkbox */}
            <motion.button
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 transition-colors ${item.isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
                onClick={() => onToggleSelect(item.productId)}
                whileTap={buttonPress}
            >
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <motion.path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" variants={checkmarkVariants} initial="unchecked" animate={item.isSelected ? "checked" : "unchecked"} />
                </svg>
            </motion.button>

            {/* Image */}
            <img
                src={displayImageUrl}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0 mr-4 border border-gray-100"
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
            />

            {/* Details */}
            <div className="flex-grow flex flex-col justify-center min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">₹{item.price.toFixed(2)} / {item.unit}</p>
                <p className="text-sm font-bold text-gray-700 block lg:hidden">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full w-fit shrink-0 ml-4 lg:ml-0 lg:w-24 lg:justify-center">
                <motion.button onClick={() => onQuantityChange(item.productId, item.quantity - 1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full" whileTap={buttonPress} disabled={item.quantity <= 1}>
                    <Minus size={16} />
                </motion.button>
                <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                <motion.button onClick={() => onQuantityChange(item.productId, item.quantity + 1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full" whileTap={buttonPress}>
                    <Plus size={16} />
                </motion.button>
            </div>

            {/* Total Price (Desktop Only) */}
            <p className="text-xl font-bold text-gray-900 ml-4 hidden lg:block w-20 text-right shrink-0">
                ₹{(item.price * item.quantity).toFixed(2)}
            </p>

            {/* Delete Button */}
            <motion.button
                onClick={() => onDelete(item.productId)}
                className="p-2 bg-red-50 rounded-full ml-4 hover:bg-red-100 transition-colors shrink-0"
                whileTap={buttonPress}
            >
                <Trash2 size={20} className="text-red-500" />
            </motion.button>
        </motion.div>
    );
};