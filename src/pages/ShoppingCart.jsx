import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Trash2, Check, X, Loader, MapPin, Phone, User, PlusCircle, Smile, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Assuming this context exists

const API_BASE_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE_URL = 'https://placehold.co/100x100/E5E7EB/9CA3AF?text=Product';

// --- CONSTANTS ---
const PLATFORM_FEE = 2.00;
const SMILE_FUND_DONATION = 1.00;
const DELIVERY_DISCOUNT_RATE = 0.35;
// TAX IS REMOVED as per request.
const TAX_RATE = 0.00; 

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
// --- UPDATED: Order Success Screen Component ---
// ====================================================================

const OrderSuccessScreen = ({ totalAmount, orderDetails }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000); // Show for 5 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    // Filter out tax entries for display
    const filteredOrderDetails = Object.entries(orderDetails)
        .filter(([key]) => !key.toLowerCase().includes('tax'));
    
    return (
        <motion.div
            className="fixed inset-0 bg-green-700 bg-opacity-95 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md text-center"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                <Check size={80} className="text-green-600 mx-auto mb-6 p-2 bg-green-100 rounded-full" />
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h2>
                
                {/* 🔑 New Content Insertion 🔑 */}
                <p className="text-gray-700 mb-4 font-semibold">
                    Thank you so much for your order with Hivictus.
                </p>
                <p className="text-sm text-gray-600 mb-6 border-b pb-4">
                    We really appreciate your support in making a positive impact to the farmers and small businesses by placing order. 
                    <br />
                    It is a pre-paid order and you will receive the **payment link** from Hivictus team shortly.
                </p>

                <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-green-700 mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        {filteredOrderDetails.map(([key, value]) => (
                            <div key={key} className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                                <span>{key}</span>
                                <span className="font-semibold">{key.includes('Amount') || key.includes('Total') || key.includes('Cost') || key.includes('Fee') || key.includes('Donation') ? `₹${value.toFixed(2)}` : value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <motion.button
                    onClick={() => navigate('/orders')}
                    className="w-full bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
                    whileTap={{ scale: 0.95 }}
                >
                    View Order Details
                </motion.button>
            </motion.div>
        </motion.div>
    );
};


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

const AddNewAddressModal = ({ isOpen, onClose, onPlaceOrder, shippingDetails, onShippingChange, total, orderSummary, isPlacingOrder }) => {
    
    const filteredOrderSummary = Object.entries(orderSummary)
        .filter(([key]) => !key.toLowerCase().includes('tax'));

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
                                <h2 className="text-2xl font-bold text-gray-800">Confirm Order Details</h2>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </div>
                            <form onSubmit={onPlaceOrder}>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-4 flex items-center"><MapPin size={20} className="mr-2 text-green-600" /> Shipping Address</h3>
                                    <InputField label="Full Name" name="name" value={shippingDetails.name} onChange={onShippingChange} required />
                                    <InputField label="Phone Number" name="phone" type="tel" value={shippingDetails.phone} onChange={onShippingChange} required />
                                    <InputField label="Address Line 1 (Street)" name="address1" value={shippingDetails.address1} onChange={onShippingChange} required />
                                    <InputField label="Address Line 2 (Apartment/Landmark)" name="address2" value={shippingDetails.address2} onChange={onShippingChange} />
                                    <InputField label="City" name="city" value={shippingDetails.city} onChange={onShippingChange} required />
                                    <InputField label="Postal Code (ZIP)" name="postalCode" value={shippingDetails.postalCode} onChange={onShippingChange} required />
                                    <InputField label="Country" name="country" value={shippingDetails.country} onChange={onShippingChange} required />
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center"><Truck size={20} className="mr-2 text-green-600" /> Final Charges</h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {/* Use the filtered summary for the modal */}
                                        {filteredOrderSummary.map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span>{key}</span>
                                                <span className="font-medium text-gray-800">₹{value.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between font-bold text-2xl text-green-700 pt-4 border-t mt-3">
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
                                    ) : 'Confirm & Pay'}
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
// --- Shipping Address Selector Component (Unchanged) ---
// ====================================================================

const ShippingAddressSelector = ({ profile, profileAddress, selectedAddress, onSelectAddress, onAddNewAddress, selectedItemCount, handleProceedToCheckout }) => {
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
    const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false); 
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    
    // State for Order Success and Summary
    const [showOrderSuccess, setShowOrderSuccess] = useState(false); 
    const [finalOrderSummary, setFinalOrderSummary] = useState({});
    
    // NEW STATES
    const [profileData, setProfileData] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('profile'); 
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

    // --- UPDATED Calculations: TAX REMOVED ---
    const { 
        subtotal, shipping, deliveryDiscount, deliveryCost, 
        totalAmount, calculatedSummary, selectedItemCount, allSelected 
    } = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => item.isSelected ? sum + item.price * item.quantity : sum, 0);
        const selectedItemCount = cartItems.filter(i => i.isSelected).length;
        const allSelected = cartItems.length > 0 && selectedItemCount === cartItems.length;
        
        // Base Charges
        const baseShipping = selectedItemCount > 0 ? 50.00 : 0; // Price of delivery
        const tax = subtotal * TAX_RATE; // TAX IS NOW 0.00
        
        // New Cost Calculation Logic
        // Assume Platform Margin = 10% of Subtotal for calculation purposes
        const platformMargin = subtotal * 0.10; 

        // Delivery Discount = Total of Platform Margin * 0.35
        const deliveryDiscount = platformMargin * DELIVERY_DISCOUNT_RATE;

        // Delivery cost = Price of delivery - Delivery Discount
        const deliveryCost = Math.max(0, baseShipping - deliveryDiscount);

        const platformFee = PLATFORM_FEE;
        const smileFundDonation = SMILE_FUND_DONATION;

        // Total Amount = Subtotal + Delivery Cost + Platform Fee + Smile Fund Donation (Tax excluded)
        const totalAmount = subtotal + deliveryCost + platformFee + smileFundDonation;

        // The summary object for display
        const calculatedSummary = {
            'Subtotal': subtotal,
            'Shipping (Base)': baseShipping,
            'Platform Margin (10% of Subtotal)': platformMargin,
            'Delivery Discount (35% of Margin)': deliveryDiscount,
            'Delivery Cost (Final)': deliveryCost,
            'Platform Fee': platformFee,
            'Smile Fund Donation': smileFundDonation,
            // 'Tax (0%)': tax, // Exclude Tax
        };

        return { 
            subtotal, 
            shipping: baseShipping, 
            deliveryDiscount, 
            deliveryCost, 
            totalAmount, 
            calculatedSummary, 
            selectedItemCount, 
            allSelected 
        };
    }, [cartItems]);
    
    // --- Handlers (mostly remain the same) ---
    const handleQuantityChange = async (productId, newQuantity) => { if (newQuantity >= 1) { await updateCartBackend(`update-quantity`, 'PUT', { productId, quantity: newQuantity }); } };
    const handleDeleteItem = async (productId) => { if (await updateCartBackend(`remove/${productId}`, 'DELETE')) { showToastMessage('Item removed from cart.', 'error'); } };
    const handleToggleSelect = async (productId) => { const item = cartItems.find(i => i.productId === productId); if (item) { await updateCartBackend('toggle-select', 'PUT', { productId, isSelected: !item.isSelected }); } };
    const handleSelectAll = async () => { await updateCartBackend('toggle-select-all', 'PUT', { selectAll: !allSelected }); };

    // NEW ADDRESS SELECTION HANDLERS (Unchanged)
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
        handleSelectAddress('new');
    };
    
    // Adjusted Checkout Logic (Unchanged flow, opens the modal)
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
        
        // If an address is selected (profile or new), open modal for final review/submission
        if (selectedAddress === 'profile' && profileData.address.street || selectedAddress === 'new') {
            setIsNewAddressModalOpen(true); 
        } else {
            showToastMessage('Please select or add a shipping address.', 'error'); 
        }
    };
    
    const handleShippingChange = (e) => { setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value }); };

    // --- UPDATED handlePlaceOrder ---
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsPlacingOrder(true);
        try {
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
            
            // 1. Show Success Message - Set the final summary
            setFinalOrderSummary({
                'Subtotal Amount': subtotal,
                'Discount Amount': deliveryDiscount,
                'Delivery Cost': deliveryCost,
                'Platform Fee': PLATFORM_FEE,
                'Smile Fund Donation': SMILE_FUND_DONATION,
                'Final Total Amount': totalAmount
            });
            setShowOrderSuccess(true); 
            setIsNewAddressModalOpen(false);

            // 2. Clear the cart on success 
            setCartItems([]); 
            await updateCartBackend('clear-all', 'DELETE'); // Clear cart on backend
            await fetchCartQuantity(); // Update cart icon count
            
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

    // --- Loading & Error States (Unchanged) ---
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

    // Filter out tax for the main summary display
    const visibleCalculatedSummary = Object.entries(calculatedSummary)
        .filter(([key]) => !key.toLowerCase().includes('tax'));

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-32 lg:pb-10">
            
            <AnimatePresence>
                {/* Full Screen Order Success Message */}
                {showOrderSuccess && <OrderSuccessScreen totalAmount={totalAmount} orderDetails={finalOrderSummary} />}
            </AnimatePresence>

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
                {/* Empty Cart Message After Order */}
                {cartItems.length === 0 ? (
                    <motion.div 
                        key="empty-cart"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center py-20 bg-white rounded-xl shadow-lg mt-10"
                    >
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
                            
                            {/* Shipping Address Selector (Unchanged) */}
                            <ShippingAddressSelector
                                profile={profileData}
                                profileAddress={profileData?.address}
                                selectedAddress={selectedAddress}
                                onSelectAddress={handleSelectAddress}
                                onAddNewAddress={handleAddNewAddress}
                                selectedItemCount={selectedItemCount}
                                handleProceedToCheckout={handleProceedToCheckout}
                            />
                            
                            {/* UPDATED Order Summary (Excludes Tax) */}
                            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 mt-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
                                <div className="space-y-3 text-sm text-gray-600">
                                    {/* Calculated Summary Details */}
                                    <div className="flex justify-between">
                                        <span>Subtotal ({selectedItemCount} items)</span>
                                        <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Base Shipping</span>
                                        <span>₹{shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Delivery Discount (35% of Margin)</span>
                                        <span>- ₹{deliveryDiscount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-800 border-t pt-2 mt-2">
                                        <span>Delivery Cost (Final)</span>
                                        <span>₹{deliveryCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Platform Fee</span>
                                        <span className="font-medium text-gray-800">₹{PLATFORM_FEE.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Smile Fund Donation</span>
                                        <span className="font-medium text-gray-800">₹{SMILE_FUND_DONATION.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between pt-4 border-t-2 mt-2 text-xl font-extrabold text-green-700">
                                        <span>Final Total</span>
                                        <span>₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Footer (Fixed) */}
            {cartItems.length > 0 && (
                <motion.div 
                    initial={{ y: 100 }} 
                    animate={{ y: 0 }} 
                    className="fixed bottom-0 left-0 w-full bg-white z-40 shadow-xl p-4 flex items-center justify-between gap-4 lg:hidden"
                >
                    <div>
                        <span className="text-sm text-gray-500">Final Total:</span>
                        <span className="text-3xl font-extrabold text-green-700 block">₹{totalAmount.toFixed(2)}</span>
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

            {/* Checkout Modal */}
            <AddNewAddressModal
                isOpen={isNewAddressModalOpen}
                onClose={() => setIsNewAddressModalOpen(false)}
                onPlaceOrder={handlePlaceOrder}
                shippingDetails={shippingDetails}
                onShippingChange={handleShippingChange}
                total={totalAmount}
                orderSummary={calculatedSummary} // Pass the correct calculated summary
                isPlacingOrder={isPlacingOrder}
            />
            
            {/* Toast Notification (Unchanged) */}
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

// --- CartItem Component (Unchanged) ---

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