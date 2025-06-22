import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, Trash2, Check, X } from 'lucide-react'; // Using Check and X for cleaner icons

// Dummy Data for Cart Items
const initialCartItems = [
  {
    id: 'ag1',
    name: 'Fresh Organic Tomatoes',
    price: 3.49,
    unit: 'kg',
    imageUrl: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    quantity: 2,
    isSelected: true,
  },
  {
    id: 'ag2',
    name: 'Crisp Green Apples',
    price: 2.99,
    unit: 'kg',
    imageUrl: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    quantity: 1,
    isSelected: true,
  },
  {
    id: 'ag5',
    name: 'Leafy Green Spinach',
    price: 2.19,
    unit: 'bunch',
    imageUrl: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    quantity: 3,
    isSelected: false,
  },
  {
    id: 'ag10',
    name: 'Avocados',
    price: 5.99,
    unit: 'piece',
    imageUrl: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    quantity: 1,
    isSelected: true,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  const navigate = useNavigate();

  // Calculate totals for selected items
  const subtotal = cartItems.reduce((sum, item) =>
    item.isSelected ? sum + item.price * item.quantity : sum, 0
  );
  const shipping = subtotal > 0 ? 5.00 : 0;
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const allSelected = cartItems.length > 0 && cartItems.every(item => item.isSelected);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    setToastMessage('Item removed from cart.');
    setToastType('error');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggleSelect = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const areAllSelected = cartItems.every(item => item.isSelected);
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, isSelected: !areAllSelected }))
    );
  };

  const handleProceedToCheckout = () => {
    const selectedItems = cartItems.filter(item => item.isSelected);
    if (selectedItems.length === 0) {
      setToastMessage('Please select at least one item to proceed.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    console.log('Proceeding to checkout with:', selectedItems);
    // In a real app, you would navigate to checkout, passing selectedItems
    // navigate('/checkout', { state: { selectedItems, total } });
    setToastMessage('Proceeding to checkout! (Simulated)');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
      // Responsive padding: p-3 on mobile, p-5 on larger screens
      className="bg-white rounded-2xl shadow-lg p-3 sm:p-5 flex items-center mb-4 border border-gray-100 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* Selection Checkbox */}
      <motion.button
        // Smaller checkbox on mobile
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mr-3 sm:mr-4
          ${item.isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
        onClick={() => onToggleSelect(item.id)}
        whileTap={buttonPress}
        aria-label={item.isSelected ? 'Deselect item' : 'Select item'}
      >
        <svg
          width="16" // Smaller icon on mobile
          height="16" // Smaller icon on mobile
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
      {/* Smaller image on mobile */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 mr-3 sm:mr-4 shadow-md border border-gray-100">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Product Details and Controls */}
      <div className="flex-grow flex flex-col justify-between">
        {/* Smaller text on mobile */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
        <p className="text-sm sm:text-base font-medium text-gray-500 mb-1 sm:mb-2">₹{(item.price).toFixed(2)} / {item.unit}</p>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
          <motion.button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="p-1 rounded-full text-gray-600 hover:text-green-600 transition-colors"
            whileTap={buttonPress}
            aria-label="Decrease quantity"
          >
            <Minus size={18} /> {/* Smaller icon on mobile */}
          </motion.button>
          <span className="text-base font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
          <motion.button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="p-1 rounded-full text-gray-600 hover:text-green-600 transition-colors"
            whileTap={buttonPress}
            aria-label="Increase quantity"
          >
            <Plus size={18} /> {/* Smaller icon on mobile */}
          </motion.button>
        </div>
      </div>

      {/* Item Total and Delete Button */}
      <div className="flex flex-col items-end justify-between ml-3 sm:ml-4 flex-shrink-0">
        {/* Smaller text on mobile */}
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
        <motion.button
          onClick={() => onDelete(item.id)}
          className="p-1 sm:p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
          whileTap={buttonPress}
          aria-label="Delete item"
        >
          <Trash2 size={18} className="text-red-500" /> {/* Smaller icon on mobile */}
        </motion.button>
      </div>
    </motion.div>
  );

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
          <ChevronLeft size={22} className="text-gray-600" /> {/* Smaller icon on mobile */}
        </motion.button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">My Cart ({cartItems.length})</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Main Content Area */}
      {/* Adjusted padding top for fixed header on mobile */}
      <div className="pt-20 sm:pt-28 p-4 max-w-xl mx-auto">

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)] text-gray-500 px-4 text-center"
          >
            <ShoppingCart size={60} sm:size={80} className="mb-4 sm:mb-6 text-gray-400" />
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
            {/* Responsive padding and text size */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex items-center mb-4 border border-gray-200">
              <motion.button
                // Smaller checkbox on mobile
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mr-3 sm:mr-4
                  ${allSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
                onClick={handleSelectAll}
                whileTap={buttonPress}
                aria-label={allSelected ? 'Deselect all items' : 'Select all items'}
              >
                <svg
                  width="16" // Smaller icon on mobile
                  height="16" // Smaller icon on mobile
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
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDeleteItem}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </AnimatePresence>

            {/* Order Summary Card */}
            {/* Responsive padding and text size */}
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
            // Adjusted bottom position for mobile to not clash with bottom nav bar
            className={`fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg text-sm sm:text-base z-50 flex items-center space-x-2`}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {toastType === 'success' ? <Check size={18} /> : <X size={18} />} {/* Smaller icon on mobile */}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;