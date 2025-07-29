import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Trash2, Check, X, Loader } from 'lucide-react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // Import useCart hook

// Star Rendering Component (reused from Products.jsx)
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300" />);
  }
  return <div className="flex text-sm">{stars}</div>;
};


const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Consume cart context
  const { fetchCartQuantity } = useCart(); // Get fetchCartQuantity from context

  // Effect to get auth token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    } else {
      setLoading(false);
      setError("Please log in to view your cart.");
    }
  }, []);

  // Memoized function to show toast messages
  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // Fetch cart data from backend
  const fetchCart = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'x-auth-token': authToken,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please log in again.");
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      const data = await response.json();
      setCartItems(data.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        unit: item.productId.unit,
        imageUrl: item.productId.imageUrl,
        quantity: item.quantity,
        isSelected: item.isSelected !== undefined ? item.isSelected : true
      })));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cart:", err);
      showToastMessage('Failed to load cart. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authToken, navigate, showToastMessage]);

  // Effect to fetch cart when authToken is available
  useEffect(() => {
    if (authToken) {
      fetchCart();
    }
  }, [authToken, fetchCart]);

  // Generic function to send cart updates to backend
  const updateCartBackend = useCallback(async (endpoint, method, body = {}) => {
    if (!authToken) {
      showToastMessage('Authentication required to update cart.', 'error');
      return false;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${endpoint}`, {
        method: method,
        headers: {
          'x-auth-token': authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      await fetchCart(); // Re-fetch to get the latest state from backend
      fetchCartQuantity(); // CRITICAL: Update Navbar cart count
      return true;
    } catch (err) {
      console.error(`Error ${method}ing cart item to ${endpoint}:`, err.message);
      showToastMessage(`Failed to update cart: ${err.message}`, 'error');
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [authToken, fetchCart, fetchCartQuantity, navigate, showToastMessage]);


  // Calculate totals for selected items
  const subtotal = cartItems.reduce((sum, item) =>
    item.isSelected ? sum + item.price * item.quantity : sum, 0
  );
  const shipping = subtotal > 0 ? 5.00 : 0;
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const allSelected = cartItems.length > 0 && cartItems.every(item => item.isSelected);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartBackend('update-quantity', 'PUT', { productId: productId, quantity: newQuantity });
  };

  const handleDeleteItem = async (productId) => {
    const success = await updateCartBackend(`remove/${productId}`, 'DELETE');
    if (success) {
      showToastMessage('Item removed from cart.', 'error');
    }
  };

  const handleToggleSelect = async (productId) => {
    const itemToToggle = cartItems.find(item => item.productId === productId);
    if (itemToToggle) {
      await updateCartBackend('toggle-select', 'PUT', { productId: productId, isSelected: !itemToToggle.isSelected });
    }
  };

  const handleSelectAll = async () => {
    const areAllSelected = cartItems.every(item => item.isSelected);
    await updateCartBackend('toggle-select-all', 'PUT', { selectAll: !areAllSelected });
  };

  const handleProceedToCheckout = () => {
    const selectedItems = cartItems.filter(item => item.isSelected);
    if (selectedItems.length === 0) {
      showToastMessage('Please select at least one item to proceed.', 'error');
      return;
    }
    console.log('Proceeding to checkout with:', selectedItems);
    showToastMessage('Proceeding to checkout! (Simulated)', 'success');
  };

  const toastVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const buttonPress = {
    scale: 0.95,
    transition: { type: "spring", stiffness: 500, damping: 20 }
  };

  const checkmarkVariants = {
    checked: { pathLength: 1, opacity: 1 },
    unchecked: { pathLength: 0, opacity: 0 },
  };

  // Cart Item Component for individual items
  const CartItem = ({ item, onQuantityChange, onDelete, onToggleSelect }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="bg-white rounded-2xl shadow-lg p-3 sm:p-5 flex items-center mb-4 border border-gray-100 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* Selection Checkbox */}
      <motion.button
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mr-3 sm:mr-4
          ${item.isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
        onClick={() => onToggleSelect(item.productId)}
        whileTap={buttonPress}
        aria-label={item.isSelected ? 'Deselect item' : 'Select item'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M5 12L10 17L19 8"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkmarkVariants}
            initial="unchecked"
            animate={item.isSelected ? "checked" : "unchecked"}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </svg>
      </motion.button>

      {/* Product Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 mr-3 sm:mr-4 shadow-md border border-gray-100">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Product Details and Controls */}
      <div className="flex-grow flex flex-col justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
        <p className="text-sm sm:text-base font-medium text-gray-500 mb-1 sm:mb-2">₹{(item.price).toFixed(2)} / {item.unit}</p>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
          <motion.button
            onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
            className="p-1 rounded-full text-gray-600 hover:text-green-600 transition-colors"
            whileTap={buttonPress}
            aria-label="Decrease quantity"
          >
            <Minus size={18} />
          </motion.button>
          <span className="text-base font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
          <motion.button
            onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
            className="p-1 rounded-full text-gray-600 hover:text-green-600 transition-colors"
            whileTap={buttonPress}
            aria-label="Increase quantity"
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </div>

      {/* Item Total and Delete Button */}
      <div className="flex flex-col items-end justify-between ml-3 sm:ml-4 flex-shrink-0">
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
        <motion.button
          onClick={() => onDelete(item.productId)}
          className="p-1 sm:p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
          whileTap={buttonPress}
          aria-label="Delete item"
        >
          <Trash2 size={18} className="text-red-500" />
        </motion.button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
        <Loader className="animate-spin text-green-600" size={48} />
        <p className="ml-4 text-lg text-gray-700 mt-4">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-red-50 text-red-700">
        <X size={48} className="mb-4" />
        <p className="text-lg font-semibold">Error: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Please ensure you are logged in and the backend is running.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-32">
      {/* Top Bar (Header) */}
      <motion.div
        className="fixed top-0 left-0 w-full bg-white z-40 shadow-md py-3 px-4 sm:py-4 flex items-center justify-between border-b border-gray-200"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          whileTap={buttonPress}
          aria-label="Go back"
        >
          <ChevronLeft size={22} className="text-gray-600" />
        </motion.button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">My Cart ({cartItems.length})</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Main Content Area */}
      <div className="pt-20 sm:pt-28 p-4 max-w-xl mx-auto">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)] text-gray-500 px-4 text-center"
          >
            <ShoppingCart size={60} className="mb-4 sm:mb-6 text-gray-400" />
            <p className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">Your cart is empty!</p>
            <p className="text-sm sm:text-base text-gray-600">Add some fresh produce to get started.</p>
            <motion.button
              onClick={() => navigate('/products')}
              className="mt-6 sm:mt-8 bg-green-500 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors text-base sm:text-lg font-semibold"
              whileTap={buttonPress}
            >
              Shop Now
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Select All Checkbox Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex items-center mb-4 border border-gray-200">
              <motion.button
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mr-3 sm:mr-4
                  ${allSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
                onClick={handleSelectAll}
                whileTap={buttonPress}
                aria-label={allSelected ? 'Deselect all items' : 'Select all items'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M5 12L10 17L19 8"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={checkmarkVariants}
                    initial="unchecked"
                    animate={allSelected ? "checked" : "unchecked"}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </svg>
              </motion.button>
              <span className="text-base sm:text-lg font-semibold text-gray-800">Select All Items</span>
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
                />
              ))}
            </AnimatePresence>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mt-6 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.filter(item => item.isSelected).length} items)</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 sm:pt-4 border-t-2 border-gray-200 text-lg sm:text-xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Bar for Checkout */}
      {cartItems.length > 0 && (
        <motion.div
          className="fixed bottom-0 left-0 w-full bg-white z-40 shadow-xl py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 border-t border-gray-100"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">Total:</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-green-700">₹{total.toFixed(2)}</span>
          </div>
          <motion.button
            onClick={handleProceedToCheckout}
            className={`flex-1 ${cartItems.some(item => item.isSelected) ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 px-4 sm:py-4 sm:px-8 rounded-full text-base sm:text-xl font-semibold shadow-lg transition-all duration-300 transform`}
            whileTap={buttonPress}
            disabled={!cartItems.some(item => item.isSelected)}
          >
            Proceed to Checkout
          </motion.button>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className={`fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg text-sm sm:text-base z-50 flex items-center space-x-2`}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {toastType === 'success' ? <Check size={18} /> : <X size={18} />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;