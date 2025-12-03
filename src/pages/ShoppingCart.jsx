import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Trash2, Check, X, Loader, MapPin, Phone, User, PlusCircle, XCircle, CheckCircle, Smile, Truck, DollarSign, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Assuming this context exists

const API_BASE_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE_URL = 'https://placehold.co/100x100/E5E7EB/9CA3AF?text=Product';

// --- CONSTANTS ---
const PLATFORM_FEE = 2.00;
const SMILE_FUND_DONATION = 1.00;
const TAX_RATE = 0.00;

// ====================================================================
// --- DELIVERY & UNIT CONVERSION UTILITIES ---
// ====================================================================

/**
 * Converts a product's quantity and unit into weight in Kilograms (KG).
 * For non-weight units (piece, jar, etc.), it relies on a weightPerUnitKg field 
 * from the product details, defaulting to 0.25 kg if not found.
 */
const getUnitWeightKg = (quantity, unit, productDetails) => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return 0;
    
    const lowerUnit = unit.toLowerCase().trim();
    
    // Default fallback weight for counted items (piece, jar, etc.)
    let calculatedWeight = 0;

    // 1. Handle standard weight/volume units (KG, G, L, ML)
    switch (lowerUnit) {
        case 'kg':
        case 'kilogram':
        case 'l':
        case 'liter':
            return qty; // 1:1 conversion (1 kg, 1 liter = 1 kg)
            
        case 'g':
        case 'gram':
            return qty / 1000; // Grams to KG
            
        case 'ml':
        case 'milliliter':
            return qty / 1000; // Milliliters to KG
            
        case 'piece':
        case 'bunch':
        case 'unit':
        case 'jar':
            // 2. Handle counted units: Use weightPerUnitKg if available, otherwise default to 0.25kg
            let weightPerUnit = 0.25; 
            if (productDetails?.weightPerUnitKg) {
                weightPerUnit = parseFloat(productDetails.weightPerUnitKg);
            }
            return qty * weightPerUnit; 
            
        default:
            // 3. Attempt to parse compound units (like "500g")
            const matchMass = lowerUnit.match(/^(\d+(\.\d+)?)\s?(g|kg|l|ml)$/);
            
            if (matchMass) {
                const value = parseFloat(matchMass[1]);
                const unitType = matchMass[3];
                
                if (unitType === 'g') calculatedWeight = value / 1000;
                else if (unitType === 'kg' || unitType === 'l') calculatedWeight = value;
                else if (unitType === 'ml') calculatedWeight = value / 1000;
                
                return qty * calculatedWeight;
            }

            console.warn(`Unknown unit '${unit}'. Assuming 1 unit = 1 kg.`);
            return qty; // Default to 1 unit = 1 kg if all parsing fails
    }
};

/**
 * Calculates the final delivery charge including the 5% product value discount.
 *
 * Formula:
 * 1. Actual Delivery Cost:
 * - If totalWeightKg <= 2 KG: Rs 90
 * - Else: Rs 90 + (Rs 35 * (Ceiling(Total weight - 2 KG)))
 * 2. Delivery Discount: Product value * 5/100
 * 3. Final Delivery Charge = Actual Delivery Cost - Delivery Discount (min 0)
 *
 * @param {number} totalWeightKg - Total weight of selected items in kilograms.
 * @param {number} productSubtotal - Total value of selected items.
 * @returns {object} { actualDeliveryCost, deliveryDiscountAmount, finalDeliveryCharge }
 */
const calculateDeliveryCharge = (totalWeightKg, productSubtotal) => {
    const BASE_KG = 2;
    const BASE_COST = 90;
    const ADDITIONAL_KG_RATE = 35;
    const DISCOUNT_RATE = 0.05; // 5%

    let actualDeliveryCost;
    
    // Step 1: Calculate Actual Delivery Cost (Weight-based)
    if (totalWeightKg <= BASE_KG) {
        actualDeliveryCost = BASE_COST;
    } else {
        const additionalWeight = Math.ceil(totalWeightKg - BASE_KG); 
        actualDeliveryCost = BASE_COST + (ADDITIONAL_KG_RATE * additionalWeight);
    }
    
    // Step 2: Calculate Delivery Discount (5% of Product Value)
    const deliveryDiscountAmount = productSubtotal * DISCOUNT_RATE;
    
    // Step 3: Calculate Final Delivery Charge (Actual Cost - Discount, cannot be negative)
    let finalDeliveryCharge = actualDeliveryCost - deliveryDiscountAmount;
    finalDeliveryCharge = Math.max(0, finalDeliveryCharge);

    return {
        actualDeliveryCost: parseFloat(actualDeliveryCost.toFixed(2)),
        deliveryDiscountAmount: parseFloat(deliveryDiscountAmount.toFixed(2)),
        finalDeliveryCharge: parseFloat(finalDeliveryCharge.toFixed(2)),
    };
};

// ====================================================================
// --- PROFILE ADDRESS MODEL MAPPING (Unchanged) ---
// ====================================================================

const mapProfileToShipping = (profile, profileAddress) => ({
    name: profile?.name || '',
    address1: profileAddress?.street || '', 
    address2: profileAddress?.apartment ? `${profileAddress.apartment}, ${profileAddress.landmark || ''}`.trim() : profileAddress?.landmark || '',
    city: profileAddress?.city || '',
    postalCode: profileAddress?.zip || '', 
    country: profileAddress?.country || 'India',
    phone: profile?.mobile || '',
});

// ====================================================================
// --- Order Success Screen Component (Unchanged) ---
// ====================================================================

const OrderSuccessScreen = ({ totalAmount, orderDetails }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000); 

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    // Filter out internal summary details (Actual Cost and 5% Discount for clean UI)
    const filteredOrderDetails = Object.entries(orderDetails)
        .filter(([key]) => key !== 'Actual Delivery Cost' && key !== 'Product Value Discount (5%)' && !key.toLowerCase().includes('tax'));
    
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
// --- New Address Modal Component (Hiding internal details) ---
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
    
    // Filter out internal summary details that we don't need in the final modal (Actual Cost and 5% Discount)
    const filteredOrderSummary = Object.entries(orderSummary)
        .filter(([key]) => key !== 'Actual Delivery Cost' && key !== 'Product Value Discount (5%)');

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
                                                <span className={`font-medium ${key.includes('Discount') ? 'text-red-600' : 'text-gray-800'}`}>{key.includes('Discount') ? `- ` : ``}₹{value.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col pt-4 border-t mt-3">
                                        <div className="flex justify-between font-bold text-2xl text-green-700">
                                            <span>Total to Pay:</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
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
    
    // STATES FOR PROMO CODE 
    const [promoCode, setPromoCode] = useState(null);
    const [promoDiscount, setPromoDiscount] = useState(0); 
    
    // Other States
    const [profileData, setProfileData] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('profile'); 
    const [shippingDetails, setShippingDetails] = useState({
        name: '', address1: '', address2: '', city: '', postalCode: '', country: 'India', phone: ''
    });

    const { fetchCartQuantity } = useCart();

    // --- Auth & Initial Fetch (Unchanged) ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
        } else {
            setLoading(false);
            setError("Please log in to view your cart.");
        }
    }, []);

    // --- Toast Functions (Unchanged) ---
    const showToastMessage = useCallback((message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, []);

    // --- Profile Fetch for Pre-fill & Address (Unchanged) ---
    const fetchUserProfile = useCallback(async () => {
        if (!authToken) return;
        try {
            const res = await fetch(`${API_BASE_URL}/profile`, { headers: { 'x-auth-token': authToken }});
            if (res.ok) {
                const profileData = await res.json();
                setProfileData(profileData);
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


    // --- Cart Fetching (Minimal change in mapping) ---
    const fetchCart = useCallback(async () => {
        if (!authToken) { setLoading(false); return; }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, { headers: { 'x-auth-token': authToken }});
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const data = await response.json();
            
            const processedCartItems = data.items
                .filter(item => {
                    if (!item.productId) {
                        console.error("Cart item skipped: productId is null or undefined.");
                        return false;
                    }
                    return true;
                })
                .map(item => {
                    const product = item.productId; 
                    
                    // Check if 'unit' is available; fall back gracefully
                    const itemUnit = product.unit || 'piece';
                    
                    return {
                        productId: product._id, 
                        name: product.name, 
                        price: product.price, 
                        unit: itemUnit, // Use the unit from product schema
                        
                        // Pass full product details for weight calculation
                        productDetails: product, 
                        
                        imageUrl: product.imageUrls?.[0] || product.imageUrl, 
                        quantity: item.quantity, 
                        isSelected: item.isSelected !== undefined ? item.isSelected : true
                    };
                });
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
    
    // --- Cart Backend Update Utility (Unchanged) ---
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
    
    // --- PROMO CODE HANDLERS (Unchanged) ---
    const handleDiscountApplied = useCallback((discountAmount, code) => {
        setPromoDiscount(discountAmount);
        setPromoCode(code);
        showToastMessage(`Code ${code} applied! Saved ₹${discountAmount.toFixed(2)}.`, 'success');
    }, [showToastMessage]);
    
    const handleDiscountRemoved = useCallback(() => {
        setPromoDiscount(0);
        setPromoCode(null);
        showToastMessage('Promo code removed.', 'success');
    }, [showToastMessage]);


    // --- UPDATED CALCULATIONS: New Weight/Delivery Logic with 5% Product Discount ---
    const { 
        originalSubtotal,
        totalWeightKg,
        deliveryDetails,
        promoDiscountAmount,
        totalAmount, 
        calculatedSummary, 
        selectedItemCount, 
        allSelected 
    } = useMemo(() => {
        const selectedItems = cartItems.filter(item => item.isSelected);

        // 1. Calculate Base Subtotal
        const baseSubtotal = selectedItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        const roundedBaseSubtotal = parseFloat(baseSubtotal.toFixed(2));
        
        // 2. Calculate Total Weight using unit conversion
        const calculatedTotalWeight = selectedItems.reduce((total, item) => {
            return total + getUnitWeightKg(item.quantity, item.unit, item.productDetails);
        }, 0);
        
        // 3. Calculate Delivery Charges (Actual Cost - 5% Product Value Discount)
        const deliveryCalculation = calculateDeliveryCharge(calculatedTotalWeight, roundedBaseSubtotal); 
        
        // 4. Apply Promo Code Discount
        // The subtotal for promo check includes the calculated delivery charge.
        const subtotalBeforePromo = roundedBaseSubtotal + deliveryCalculation.finalDeliveryCharge;
        const calculatedPromoDiscount = Math.min(promoDiscount, subtotalBeforePromo);
        const roundedPromoDiscount = parseFloat(calculatedPromoDiscount.toFixed(2));
        
        // 5. Fixed Fees/Donations
        const platformFee = PLATFORM_FEE;
        const smileFundDonation = SMILE_FUND_DONATION;

        // 6. Calculate Final Total
        // Start with Base Subtotal
        // + Add Final Delivery Charge (Actual Cost - 5% Product Discount)
        // - Subtract Promo Discount
        // + Add Fixed Fees
        const finalTotal = roundedBaseSubtotal 
                            + deliveryCalculation.finalDeliveryCharge
                            - roundedPromoDiscount
                            + platformFee 
                            + smileFundDonation;
                            
        const roundedTotalAmount = parseFloat(finalTotal.toFixed(2));

        // 7. Create Summary Object (All values needed for DB storage)
        const calculatedSummary = {
            'Subtotal (Product Value)': roundedBaseSubtotal,
            'Actual Delivery Cost': deliveryCalculation.actualDeliveryCost,
            'Product Value Discount (5%)': deliveryCalculation.deliveryDiscountAmount, 
            'Net Delivery Charge': deliveryCalculation.finalDeliveryCharge,
            'Promo Code Discount': roundedPromoDiscount, 
            'Platform Fee': platformFee,
            'Smile Fund Donation': smileFundDonation
        };

        return { 
            originalSubtotal: roundedBaseSubtotal, 
            totalWeightKg: calculatedTotalWeight,
            deliveryDetails: deliveryCalculation,
            promoDiscountAmount: roundedPromoDiscount, 
            totalAmount: roundedTotalAmount, 
            calculatedSummary, 
            selectedItemCount: selectedItems.length, 
            allSelected: cartItems.length > 0 && selectedItems.length === cartItems.length
        };
    }, [cartItems, promoDiscount]); 


    // --- Handlers (mostly unchanged) ---
    const handleQuantityChange = async (productId, newQuantity) => { 
        if (newQuantity >= 1) { 
            await updateCartBackend(`update-quantity`, 'PUT', { productId, quantity: newQuantity }); 
            if (promoDiscount > 0) handleDiscountRemoved(); // Reset discount to force re-validation
        } 
    };
    const handleDeleteItem = async (productId) => { 
        if (await updateCartBackend(`remove/${productId}`, 'DELETE')) { 
            if (promoDiscount > 0) handleDiscountRemoved(); 
            showToastMessage('Item removed from cart.', 'error'); 
        } 
    };
    const handleToggleSelect = async (productId) => { 
        const item = cartItems.find(i => i.productId === productId); 
        if (item) { 
            await updateCartBackend('toggle-select', 'PUT', { productId, isSelected: !item.isSelected }); 
            if (promoDiscount > 0) handleDiscountRemoved();
        } 
    };
    const handleSelectAll = async () => { await updateCartBackend('toggle-select-all', 'PUT', { selectAll: !allSelected }); };

    // ADDRESS, CHECKOUT, AND ORDER PLACEMENT LOGIC (Unchanged flow, uses new calculatedSummary)
    const handleSelectAddress = (addressType) => {
        setSelectedAddress(addressType);
        if (addressType === 'profile' && profileData) {
            const mappedDetails = mapProfileToShipping(profileData, profileData.address);
            setShippingDetails(mappedDetails);
        } else if (addressType === 'new') {
            setShippingDetails(prev => ({
                ...prev,
                address1: '', address2: '', city: '', postalCode: '', country: 'India'
            }));
            setIsNewAddressModalOpen(true);
        }
    };

    const handleAddNewAddress = () => { handleSelectAddress('new'); };
    const handleProceedToCheckout = () => { 
        if (selectedItemCount === 0) { showToastMessage('Please select items to proceed.', 'error'); return; }
        if (!profileData || !profileData.address || !profileData.address.street) { handleAddNewAddress(); return; }
        if (selectedAddress === 'profile' && profileData.address.street || selectedAddress === 'new') { setIsNewAddressModalOpen(true); } 
        else { showToastMessage('Please select or add a shipping address.', 'error'); }
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

            // ORDER PAYLOAD: INCLUDES PROMO CODE DATA 
            const orderPayload = {
                 shippingAddress: shippingDetails,
                 finalAmount: totalAmount, 
                 summary: calculatedSummary, 
                 originalSubtotal: originalSubtotal, 
                 promoCode: promoCode, 
                 discountAmount: promoDiscountAmount, 
            };

            const response = await fetch(`${API_BASE_URL}/orders/place`, { 
                method: 'POST', 
                headers: { 'x-auth-token': authToken, 'Content-Type': 'application/json' }, 
                body: JSON.stringify(orderPayload),
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.msg || (data.errors && data.errors[0].msg) || 'Failed to place order.'); }
            
            // 1. Show Success Message - Set the final summary
            setFinalOrderSummary(calculatedSummary);
            setShowOrderSuccess(true); 
            setIsNewAddressModalOpen(false);
            
            // 2. Clear state and cart
            setCartItems([]); 
            setPromoCode(null);
            setPromoDiscount(0);
            
            await updateCartBackend('clear-all', 'DELETE'); // Clear cart on backend
            await fetchCartQuantity(); // Update cart icon count
            
        } catch (err) {
            showToastMessage(err.message, 'error');
            console.error("Error placing order:", err);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // --- UI Constants (Unchanged) ---
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

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-32 lg:pb-10">
            
            <AnimatePresence>
                {/* Full Screen Order Success Message */}
                {showOrderSuccess && <OrderSuccessScreen totalAmount={totalAmount} orderDetails={calculatedSummary} />}
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

                        {/* Right Column: Address Selector, Promo Code, & Order Summary (4/12 on Desktop) */}
                        <div className="w-full lg:w-4/12 mt-6 lg:mt-0 lg:sticky lg:top-8 self-start">
                            
                            {/* Shipping Address Selector */}
                            <ShippingAddressSelector
                                profile={profileData}
                                profileAddress={profileData?.address}
                                selectedAddress={selectedAddress}
                                onSelectAddress={handleSelectAddress}
                                onAddNewAddress={handleAddNewAddress}
                                selectedItemCount={selectedItemCount}
                                handleProceedToCheckout={handleProceedToCheckout}
                            />
                            
                            {/* ⭐️ PROMO CODE INPUT ⭐️ */}
                            <PromoCodeInput 
                                subtotal={originalSubtotal} // Pass the base subtotal for validation calculation
                                authToken={authToken}
                                onDiscountApplied={handleDiscountApplied}
                                onDiscountRemoved={handleDiscountRemoved}
                            />

                            {/* UPDATED Order Summary */}
                            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 mt-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center"><DollarSign size={20} className="mr-2 text-green-600" /> Payment Summary</h2>
                                
                                {/* <p className="text-sm font-semibold text-gray-600 mb-3">
                                    Total Weight: {totalWeightKg.toFixed(2)} KG (Estimated)
                                </p> */}

                                <div className="space-y-3 text-sm text-gray-600">
                                    
                                    {/* Calculated Summary Details */}
                                    <div className="flex justify-between">
                                        <span>Subtotal (Product Value)</span>
                                        <span className="font-medium text-gray-800">₹{originalSubtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Actual Delivery Cost and Product Value Discount are now hidden but stored in DB */}
                                    
                                    <div className="flex justify-between font-bold border-b border-dashed pb-2">
                                        <span>Delivery Charge</span>
                                        <span className="text-gray-800">₹{deliveryDetails.finalDeliveryCharge.toFixed(2)}</span>
                                    </div>
                                    
                                    {/* Display Promo Discount if applied */}
                                    {promoDiscountAmount > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }} 
                                            animate={{ opacity: 1, x: 0 }} 
                                            className="flex justify-between text-red-600 font-semibold"
                                        >
                                            <span>Promo Discount {promoCode ? `(${promoCode})` : ''}</span>
                                            <span>- ₹{promoDiscountAmount.toFixed(2)}</span>
                                        </motion.div>
                                    )}

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
                                {/* Full disclaimer removed */}
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
                orderSummary={calculatedSummary}
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

// ====================================================================
// --- PROMO CODE INPUT COMPONENT (Unchanged) ---
// ====================================================================

const PromoCodeInput = ({ subtotal, authToken, onDiscountApplied, onDiscountRemoved }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) {
            setMessage('Please enter a promo code.');
            setStatus('error');
            return;
        }
        if (!authToken) {
            setMessage('You must be logged in to apply a code.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setMessage('Checking code...');

        try {
            const response = await fetch(`${API_BASE_URL}/orders/validate-promo`, {
                method: 'POST',
                headers: { 'x-auth-token': authToken, 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, currentSubtotal: subtotal }),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setMessage(data.msg || 'Invalid promo code.');
                onDiscountRemoved();
                setAppliedDiscount(0);
                return;
            }

            setStatus('success');
            setMessage(data.msg || 'Promo code applied!');
            setAppliedDiscount(data.discount);
            onDiscountApplied(data.discount, data.code);
            
        } catch (err) {
            console.error('Promo code validation error:', err);
            setStatus('error');
            setMessage('Server error during validation.');
            onDiscountRemoved();
            setAppliedDiscount(0);
        }
    };
    
    const handleRemoveCode = () => {
        setCode('');
        setStatus('idle');
        setMessage('');
        setAppliedDiscount(0);
        onDiscountRemoved();
    };

    const statusIconVariants = {
        hidden: { scale: 0, opacity: 0, rotate: -180 },
        visible: { scale: 1, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    };

    const isApplied = status === 'success';

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <Tag size={20} className="mr-2 text-green-600" /> Promo Code
            </h2>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isApplied || status === 'loading'}
                    className={`flex-grow p-3 border rounded-lg text-sm transition-all ${isApplied ? 'bg-green-50 border-green-500' : status === 'error' ? 'border-red-500' : 'border-gray-300 focus:border-green-500'}`}
                />
                
                {isApplied ? (
                    <motion.button
                        type="button"
                        onClick={handleRemoveCode}
                        className="bg-red-500 text-white p-3 rounded-lg font-semibold flex items-center justify-center hover:bg-red-600 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        Remove
                    </motion.button>
                ) : (
                    <motion.button
                        type="submit"
                        className={`p-3 rounded-lg text-white font-semibold flex items-center justify-center transition-colors disabled:bg-gray-400 ${status === 'loading' ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
                        disabled={status === 'loading'}
                        whileTap={{ scale: 0.95 }}
                    >
                        {status === 'loading' ? <Loader size={20} className="animate-spin" /> : 'Apply'}
                    </motion.button>
                )}
            </form>

            <AnimatePresence mode="wait">
                {status !== 'idle' && (
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-3 p-3 rounded-lg flex items-center transition-colors ${
                            status === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
                            status === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
                            'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <motion.div variants={statusIconVariants} initial="hidden" animate="visible" className="mr-2">
                            {status === 'success' && <CheckCircle size={20} />}
                            {status === 'error' && <XCircle size={20} />}
                            {status === 'loading' && <Loader size={20} className="animate-spin" />}
                        </motion.div>
                        <span className="text-sm font-medium">{message}</span>
                    </motion.div>
                )}
                {isApplied && appliedDiscount > 0 && (
                    <motion.div
                        key="discount-info"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 p-2 text-sm font-bold text-green-700 bg-green-50 border-t border-green-300 rounded-b-lg"
                    >
                        Discount Applied: - ₹{appliedDiscount.toFixed(2)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};