import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Trash2, Check, X, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Helper component for form inputs inside the modal
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
        />
    </div>
);

// Checkout Modal Component
const CheckoutModal = ({ isOpen, onClose, onPlaceOrder, shippingDetails, onShippingChange, total, isPlacingOrder }) => {
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
                                <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </div>
                            <form onSubmit={onPlaceOrder}>
                                <div className="space-y-4">
                                    <InputField label="Full Name" name="name" value={shippingDetails.name} onChange={onShippingChange} required />
                                    <InputField label="Phone Number" name="phone" type="tel" value={shippingDetails.phone} onChange={onShippingChange} required />
                                    <InputField label="Address Line 1" name="address1" value={shippingDetails.address1} onChange={onShippingChange} required />
                                    <InputField label="Address Line 2 (Optional)" name="address2" value={shippingDetails.address2} onChange={onShippingChange} />
                                    <InputField label="City" name="city" value={shippingDetails.city} onChange={onShippingChange} required />
                                    <InputField label="Postal Code" name="postalCode" value={shippingDetails.postalCode} onChange={onShippingChange} required />
                                    <InputField label="Country" name="country" value={shippingDetails.country} onChange={onShippingChange} required />
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h3>
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

// Main Cart Page Component
const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: '', address1: '', address2: '', city: '', postalCode: '', country: 'India', phone: ''
  });

  const { fetchCartQuantity } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    } else {
      setLoading(false);
      setError("Please log in to view your cart.");
    }
  }, []);

  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

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
          productId: item.productId._id, name: item.productId.name, price: item.productId.price, unit: item.productId.unit,
          imageUrl: item.productId.imageUrl, quantity: item.quantity, isSelected: item.isSelected !== undefined ? item.isSelected : true
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
  
  useEffect(() => {
      const fetchUserProfile = async () => {
        if (!authToken) return;
        try {
          const res = await fetch(`${API_BASE_URL}/profile`, { headers: { 'x-auth-token': authToken }});
          if (res.ok) {
            const profileData = await res.json();
            setShippingDetails(prev => ({
              ...prev,
              name: profileData?.user?.name || profileData?.name || '',
              phone: profileData?.phone || '',
            }));
          }
        } catch (error) {
          console.error("Could not fetch user profile to pre-fill form", error);
        }
      };
      if (isCheckoutModalOpen) { fetchUserProfile(); }
  }, [isCheckoutModalOpen, authToken]);

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

  const subtotal = cartItems.reduce((sum, item) => item.isSelected ? sum + item.price * item.quantity : sum, 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.isSelected);

  const handleQuantityChange = async (productId, newQuantity) => { if (newQuantity >= 1) { await updateCartBackend(`update-quantity`, 'PUT', { productId, quantity: newQuantity }); } };
  const handleDeleteItem = async (productId) => { if (await updateCartBackend(`remove/${productId}`, 'DELETE')) { showToastMessage('Item removed from cart.', 'error'); } };
  const handleToggleSelect = async (productId) => { const item = cartItems.find(i => i.productId === productId); if (item) { await updateCartBackend('toggle-select', 'PUT', { productId, isSelected: !item.isSelected }); } };
  const handleSelectAll = async () => { await updateCartBackend('toggle-select-all', 'PUT', { selectAll: !allSelected }); };
  const handleProceedToCheckout = () => { if (!cartItems.some(i => i.isSelected)) { showToastMessage('Please select items to proceed.', 'error'); return; } setIsCheckoutModalOpen(true); };
  const handleShippingChange = (e) => { setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value }); };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    try {
        const response = await fetch(`${API_BASE_URL}/orders/place`, { // This correctly calls the order backend
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken }, body: JSON.stringify({ shippingAddress: shippingDetails }),
        });
        const data = await response.json();
        if (!response.ok) { throw new Error(data.msg || (data.errors && data.errors[0].msg) || 'Failed to place order.'); }
        showToastMessage('Order placed successfully!', 'success');
        setIsCheckoutModalOpen(false);
        await fetchCart();
        await fetchCartQuantity();
    } catch (err) {
        showToastMessage(err.message, 'error');
        console.error("Error placing order:", err);
    } finally {
        setIsPlacingOrder(false);
    }
  };

  const toastVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 } };
  const buttonPress = { scale: 0.95 };
  const checkmarkVariants = { checked: { pathLength: 1 }, unchecked: { pathLength: 0 } };

  const CartItem = ({ item, onQuantityChange, onDelete, onToggleSelect }) => (
    <motion.div layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white rounded-2xl shadow-lg p-3 sm:p-5 flex items-center mb-4 border border-gray-100">
      <motion.button className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 ${item.isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} onClick={() => onToggleSelect(item.productId)} whileTap={buttonPress}>
        <svg width="16" height="16" viewBox="0 0 24 24"><motion.path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" variants={checkmarkVariants} initial="unchecked" animate={item.isSelected ? "checked" : "unchecked"} /></svg>
      </motion.button>
      <img src={item.imageUrl || 'https://placehold.co/100x100'} alt={item.name} className="w-24 h-24 rounded-xl object-cover shrink-0 mr-4" />
      <div className="flex-grow flex flex-col justify-between"><h3 className="text-lg font-semibold text-gray-800">{item.name}</h3><p className="text-base text-gray-500 mb-2">₹{item.price.toFixed(2)} / {item.unit}</p>
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full w-fit"><motion.button onClick={() => onQuantityChange(item.productId, item.quantity - 1)} className="p-2" whileTap={buttonPress}><Minus size={18} /></motion.button><span className="font-bold w-6 text-center">{item.quantity}</span><motion.button onClick={() => onQuantityChange(item.productId, item.quantity + 1)} className="p-2" whileTap={buttonPress}><Plus size={18} /></motion.button></div>
      </div>
      <div className="flex flex-col items-end justify-between ml-4 shrink-0"><p className="text-xl font-bold text-gray-900 mb-2">₹{(item.price * item.quantity).toFixed(2)}</p><motion.button onClick={() => onDelete(item.productId)} className="p-2 bg-red-50 rounded-full" whileTap={buttonPress}><Trash2 size={18} className="text-red-500" /></motion.button></div>
    </motion.div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-green-600" size={48} /></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center text-red-700"><X size={48} /><p className="font-semibold">{error}</p><button onClick={() => navigate('/login')}>Go to Login</button></div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-32">
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 w-full bg-white z-40 shadow-md py-4 flex items-center justify-between px-4">
        <motion.button onClick={() => navigate(-1)} whileTap={buttonPress}><ChevronLeft size={22} /></motion.button><h1 className="text-2xl font-semibold">My Cart ({cartItems.length})</h1><div className="w-10"></div>
      </motion.div>
      <div className="pt-28 p-4 max-w-xl mx-auto">
        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20"><ShoppingCart size={60} className="mx-auto text-gray-400 mb-4" /><p className="text-xl font-medium">Your cart is empty!</p><motion.button onClick={() => navigate('/products')} className="mt-6 bg-green-500 text-white py-3 px-8 rounded-full" whileTap={buttonPress}>Shop Now</motion.button></motion.div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center mb-4"><motion.button className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 ${allSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} onClick={handleSelectAll} whileTap={buttonPress}>
              <svg width="16" height="16" viewBox="0 0 24 24"><motion.path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" variants={checkmarkVariants} initial="unchecked" animate={allSelected ? "checked" : "unchecked"} /></svg></motion.button><span className="text-lg font-semibold">Select All Items</span>
            </div>
            <AnimatePresence>
              {cartItems.map(item => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDeleteItem}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </AnimatePresence>
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6"><h2 className="text-xl font-bold mb-4">Order Summary</h2><div className="space-y-3"><div className="flex justify-between"><span>Subtotal ({cartItems.filter(i => i.isSelected).length} items)</span><span>₹{subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></div><div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div><div className="flex justify-between pt-4 border-t-2 mt-2 text-xl font-extrabold"><span>Total</span><span>₹{total.toFixed(2)}</span></div></div></div>
          </>
        )}
      </div>
      {cartItems.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 w-full bg-white z-40 shadow-xl p-4 flex items-center justify-between gap-4">
          <div><span className="text-sm text-gray-500">Total:</span><span className="text-3xl font-extrabold text-green-700 block">₹{total.toFixed(2)}</span></div>
          <motion.button onClick={handleProceedToCheckout} className={`flex-1 ${!cartItems.some(i => i.isSelected) && 'bg-gray-400 cursor-not-allowed'} bg-green-600 text-white py-4 rounded-full text-xl font-semibold`} whileTap={buttonPress} disabled={!cartItems.some(i => i.isSelected)}>Proceed to Checkout</motion.button>
        </motion.div>
      )}
      <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          onPlaceOrder={handlePlaceOrder}
          shippingDetails={shippingDetails}
          onShippingChange={handleShippingChange}
          total={total}
          isPlacingOrder={isPlacingOrder}
        />
      <AnimatePresence>{showToast && (
          <motion.div variants={toastVariants} initial="hidden" animate="visible" exit="exit" className={`fixed bottom-28 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-full shadow-lg z-50`}>{toastMessage}</motion.div>
      )}</AnimatePresence>
    </div>
  );
};

export default CartPage;