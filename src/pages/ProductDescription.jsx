import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaShoppingCart, FaTimes, FaArrowLeft
} from 'react-icons/fa';
import { Loader, Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Import useCart hook

// Star Rendering Component
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300" />);
  }
  return <div className="flex text-sm">{stars}</div>;
};

const ProductDescription = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [authToken, setAuthToken] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Consume cart context
  const { fetchCartQuantity } = useCart(); // Get fetchCartQuantity from context

  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const whyShopData = [
    { title: 'Farm-to-Table Freshness', description: 'Directly sourced from local farms, ensuring peak freshness and quality.', icon: '🌱' },
    { title: 'Sustainable & Organic Choices', description: 'Commitment to eco-friendly practices and a wide range of organic products.', icon: '♻️' },
    { title: 'Transparent Sourcing', description: 'Know exactly where your food comes from with detailed origin information.', icon: '🔎' },
    { title: 'Prompt & Reliable Delivery', description: 'Efficient logistics to bring fresh produce right to your doorstep, on time.', icon: '🚚' },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!authToken) {
      showToastMessage('Please log in to add items to cart.', 'error');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'x-auth-token': authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id, quantity: selectedQuantity }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          showToastMessage('Session expired. Please log in again.', 'error');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      }

      showToastMessage(`${selectedQuantity} ${product.unit} of ${product.name} added to cart!`);
      fetchCartQuantity(); // CRITICAL: Update Navbar cart count
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToastMessage(`Failed to add to cart: ${err.message}`, 'error');
    }
  };

  const handleQuantityChange = (e) => {
    setSelectedQuantity(parseInt(e.target.value));
  };

  const toastVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-lime-100">
        <Loader className="animate-spin text-green-600" size={48} />
        <p className="ml-4 text-lg text-gray-700">Harvesting product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-red-600 bg-gradient-to-br from-red-50 to-orange-100">
        <FaTimes size={48} className="mb-4" />
        <p className="text-lg font-semibold">Failed to load product: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Please ensure the product ID is valid and backend is accessible.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <p className="text-lg text-gray-700">Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  const quantityOptions = [];
  const maxSelectableQuantity = Math.min(product.quantity, 10);
  for (let i = 1; i <= maxSelectableQuantity; i++) {
    quantityOptions.push(i);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gradient-to-br from-green-50 to-lime-100 font-sans text-gray-800 pb-20"
    >
      {/* Top Navigation Bar (iOS-like) */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm p-4 flex items-center justify-between border-b border-gray-200 lg:hidden">
        <button onClick={() => navigate(-1)} className="text-green-700 text-xl p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 truncate px-4">Product Details</h1>
        <div className="w-10"></div>
      </div>

      {/* Desktop Breadcrumbs and Back Button */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-8 pt-8 items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-green-700 text-2xl p-2 rounded-full hover:bg-green-100 transition-colors duration-200">
          <FaArrowLeft />
        </button>
        <p className="text-base text-gray-600">
          <Link to="/" className="text-green-700 hover:underline">Home</Link> /
          <Link to="/products" className="text-green-700 hover:underline"> Products</Link> /
          <Link to={`/products?category=${product.category?.name}`} className="text-green-700 hover:underline"> {product.category?.name}</Link> /
          <span className="text-gray-800 font-medium"> {product.name}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden lg:flex lg:mt-8 p-4 lg:p-8 border border-green-100">
        {/* Product Image Section */}
        <div className="lg:w-1/2 p-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-h-[450px] object-contain rounded-lg transform transition-transform duration-500 ease-in-out hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/450x450/E0E0E0/333333?text=Product Image'; }}
          />
          {/* Thumbnail Carousel - More professional look */}
          <div className="flex justify-center gap-3 mt-6 overflow-x-auto py-2 px-4 scrollbar-hide">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 flex-shrink-0 border-2 border-gray-200 rounded-md overflow-hidden cursor-pointer hover:border-green-600 transition-colors shadow-sm"
              >
                <img
                  src={product.imageUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/E0E0E0/333333?text=Thumb'; }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Breadcrumbs (mobile only, desktop handled above) */}
            <p className="text-sm text-gray-500 mb-2 lg:hidden">
              <Link to="/" className="text-green-600 hover:underline">Home</Link> /
              <Link to="/products" className="text-green-600 hover:underline"> Products</Link> /
              <Link to={`/products?category=${product.category?.name}`} className="text-green-600 hover:underline"> {product.category?.name}</Link> /
              <span className="text-gray-700"> {product.subCategory}</span>
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
              {product.name}
            </h2>
            <p className="text-base text-gray-600 mb-4">
              <span className="font-semibold">Sold by:</span> <span className="font-bold text-green-700">{product.sellerName}</span>
            </p>

            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
              <span className="ml-2 text-sm text-gray-600">({product.rating} / 5)</span>
            </div>

            <p className="text-gray-700 text-base mb-6 leading-relaxed border-b border-gray-200 pb-6">
              {product.description}
            </p>

            {/* Price and Quantity - Simplified */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-green-800">
                  ₹{product.price.toFixed(2)} / {product.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="sr-only">Select Quantity</label>
                <select
                  id="quantity"
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                  className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-800 shadow-sm"
                  disabled={product.quantity === 0}
                >
                  {quantityOptions.map(qty => (
                    <option key={qty} value={qty}>{qty} {product.unit}</option>
                  ))}
                  {product.quantity === 0 && <option value={0}>Out of Stock</option>}
                </select>
              </div>
            </div>

            {/* Why shop from us? section - Enhanced */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Why Shop With Us?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyShopData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className="flex items-start p-4 bg-green-50 rounded-lg shadow-md border border-green-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <span className="text-3xl mr-3 flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Add to Cart Bar (iOS-like) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg p-4 sm:p-6 flex items-center justify-between border-t border-gray-200 z-20"
      >
        <div className="flex flex-col">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            ₹{(product.price * selectedQuantity).toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`
            flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold text-lg shadow-lg
            transition-all duration-300 ease-in-out transform
            ${product.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}
          `}
          disabled={product.quantity === 0}
        >
          <FaShoppingCart className="mr-3 text-xl" />
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </motion.div>

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
    </motion.div>
  );
};

export default ProductDescription;