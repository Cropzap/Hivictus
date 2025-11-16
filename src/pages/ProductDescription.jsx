import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader, Check, X, Star, ShoppingCart, ArrowLeft, Zap, Package, MapPin, Smile,
} from 'lucide-react';
// We are using lucide-react now. Fa-icons are replaced.

const API_URL = import.meta.env.VITE_API_URL;
// Fallback Image URL Constant
const FALLBACK_IMAGE_URL = 'https://placehold.co/450x450/E0E0E0/333333?text=Product Image';

// Data for Why Shop With Us section
const whyShopData = [
    { title: 'Farm-to-Table Freshness', description: 'Directly sourced from local farms, ensuring peak freshness.', icon: '🌱' },
    { title: 'Sustainable & Organic Choices', description: 'Commitment to eco-friendly practices and organic products.', icon: '♻️' },
    { title: 'Transparent Sourcing', description: 'Know exactly where your food comes from with detailed origin.', icon: '🔎' },
    { title: 'Prompt & Reliable Delivery', description: 'Efficient logistics to bring fresh produce right to your doorstep.', icon: '🚚' },
];

// Mock Cart Context to resolve import error
const useCart = () => ({
    fetchCartQuantity: () => console.log("MOCK: Cart quantity refreshed."),
});


// --- Shared Utility Components ---

// Star Rendering Component (Using Lucide-react)
const renderStars = (rating, size = 'w-4 h-4') => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const sizeClass = size || 'w-4 h-4';

  for (let i = 1; i <= 5; i++) {
    const isFull = rating >= i;

    if (isFull) {
        stars.push(<Star key={i} className={`text-yellow-500 fill-yellow-500 ${sizeClass}`} />);
    } else if (rating >= i - 0.5 && rating < i) {
        // We use a full star with partial opacity/color blend to simulate half
        stars.push(<Star key={i} className={`text-yellow-500 fill-yellow-300 opacity-70 ${sizeClass}`} />);
    } else {
        // Empty star
        stars.push(<Star key={i} className={`text-gray-300 fill-none ${sizeClass}`} />);
    }
  }
  return <div className="flex space-x-0.5">{stars}</div>;
};

// Component for displaying price and quantity selection
const PriceAndQuantity = ({ product, selectedQuantity, handleQuantityChange, quantityOptions }) => (
  <div className="flex flex-col items-start lg:items-end w-full">
    {/* Price Display */}
    <div className="mb-2 lg:mb-0">
      <span className="text-3xl sm:text-4xl font-extrabold text-green-700 tracking-tight">
        ₹{product.price.toFixed(2)}
      </span>
      <span className="text-base sm:text-xl font-medium text-gray-500 ml-1">
        / {product.unit}
      </span>
    </div>

    {/* Quantity Selection */}
    <div className="flex items-center gap-3 mt-1">
      <label htmlFor="quantity" className="text-sm font-medium text-gray-600">Quantity:</label>
      <select
        id="quantity"
        value={selectedQuantity}
        onChange={handleQuantityChange}
        className="p-2 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500 text-gray-800 shadow-sm text-base font-semibold"
        disabled={product.quantity === 0}
      >
        {quantityOptions.map(qty => (
          <option key={qty} value={qty}>{qty} {product.unit}</option>
        ))}
        {product.quantity === 0 && <option value={0}>Out of Stock</option>}
      </select>
    </div>
  </div>
);

// --- New Review Section Component ---

const ReviewsSection = ({ ratings, reviewerMap }) => {
    if (!ratings || ratings.length === 0) {
        return (
            <div className="text-center p-6 bg-white rounded-xl shadow-inner border border-gray-200">
                <Smile className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-gray-700">No Reviews Yet</p>
                <p className="text-sm text-gray-500 mt-1">Be the first to share your experience!</p>
            </div>
        );
    }
    
    const sortedRatings = [...ratings].reverse();

    return (
        <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Customer Reviews ({ratings.length})</h3>
            <div className="space-y-6">
                {sortedRatings.map((review, index) => {
                    const reviewer = reviewerMap[review.userId] || { firstName: 'Loading', lastName: '', profilePicture: 'https://placehold.co/40x40/6B7280/FFFFFF?text=A' };
                    const reviewerName = `${reviewer.firstName} ${reviewer.lastName}`;
                    const reviewerInitials = (reviewer.firstName?.[0] || '') + (reviewer.lastName?.[0] || '');

                    return (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="p-5 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-green-200 transition-colors duration-200"
                        >
                            <div className="flex items-start justify-between mb-3 border-b border-gray-100 pb-3">
                                <div className='flex items-center'>
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-green-100 flex items-center justify-center text-green-800 font-bold text-md border-2 border-green-300 shadow-inner">
                                        {reviewer.profilePicture ? (
                                            <img 
                                              src={reviewer.profilePicture} 
                                              alt={reviewerName} 
                                              className="w-full h-full object-cover" 
                                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/6B7280/FFFFFF?text=A'; }}
                                            />
                                        ) : reviewerInitials}
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-gray-900 text-lg">{reviewerName}</p>
                                        <p className="text-xs text-gray-500 font-medium">Reviewed on: {new Date(review.createdAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    {renderStars(review.rating, 'w-4 h-4')}
                                    <span className="mt-1 text-base text-gray-800 font-extrabold">
                                        {review.rating.toFixed(1)} / 5
                                    </span>
                                </div>
                            </div>

                            
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Component ---

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
  const [selectedImage, setSelectedImage] = useState(FALLBACK_IMAGE_URL); 
  const [reviewerMap, setReviewerMap] = useState({}); // Map for {userId: {firstName, lastName}}

  const { fetchCartQuantity } = useCart(); // Use the mocked hook

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

  // Function to fetch reviewer details concurrently
  const fetchReviewerDetails = useCallback(async (ratings) => {
    if (!ratings || ratings.length === 0) return {};
    
    // Get unique reviewer IDs
    const uniqueUserIds = [...new Set(ratings.map(r => r.userId))];
    
    const fetchPromises = uniqueUserIds.map(userId => 
      fetch(`${API_URL}/profile/public/${userId}`)
        .then(res => res.ok ? res.json() : ({ firstName: 'Unknown', lastName: 'User', profilePicture: null }))
        .then(data => [userId, data])
        .catch(() => [userId, { firstName: 'Error', lastName: 'Loading', profilePicture: null }])
    );

    const results = await Promise.all(fetchPromises);
    return Object.fromEntries(results);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // --- 🔑 IMAGE FIX: Use 'imageUrls' from your data format 🔑 ---
        const images = data.imageUrls && Array.isArray(data.imageUrls) && data.imageUrls.length > 0
          ? data.imageUrls
          : [data.imageUrl || FALLBACK_IMAGE_URL]; 
        
        data.images = images; 
        setSelectedImage(images[0] || FALLBACK_IMAGE_URL); 
        setProduct(data);

        // Fetch reviewer names after product data is loaded
        if (data.ratings && data.ratings.length > 0) {
            const map = await fetchReviewerDetails(data.ratings);
            setReviewerMap(map);
        }

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
  }, [productId, fetchReviewerDetails]);

  const handleAddToCart = async () => {
    if (!authToken) {
      showToastMessage('Please log in to add items to cart.', 'error');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
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
          // Robust error parsing for the backend's JSON error response
          const errorData = await response.json();
          const errorMessage = errorData.detail || errorData.message || `Server Error (Status: ${response.status})`;
          
          throw new Error(errorMessage); 
        }
      }

      showToastMessage(`${selectedQuantity} ${product.unit} of ${product.name} added to cart!`);
      fetchCartQuantity();
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

  const bottomBarVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };


  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-lime-100">
        <Loader className="animate-spin text-green-600" size={48} />
        <p className="ml-4 text-lg text-gray-700">Harvesting product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 text-red-600 bg-gradient-to-br from-red-50 to-orange-100">
        <X size={48} className="mb-4" />
        <p className="text-lg font-semibold">Failed to load product: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Please ensure the product ID is valid and backend is accessible.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-700 transition-colors duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <p className="text-lg text-gray-700">Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300"
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

  const priceAndQuantityProps = { product, selectedQuantity, handleQuantityChange, quantityOptions };
  
  // Use product.averageRating and product.totalRatings for display
  const averageRating = product.averageRating || 0;
  const totalRatings = product.totalRatings || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-white lg:bg-gray-50 font-sans text-gray-800 pb-20 lg:pb-12"
    >
      
      {/* 🍏 Mobile Application Top Bar (lg:hidden) 📱 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md shadow-lg p-4 flex items-center justify-between border-b border-gray-100 lg:hidden">
        <button onClick={() => navigate(-1)} className="text-green-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 active:bg-gray-200">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate px-4">Product Details</h1>
        <Link to="/cart" className="text-green-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 active:bg-gray-200">
            <ShoppingCart size={24} />
        </Link>
      </div>

      {/* 🖥️ Desktop Breadcrumbs and Back Button (hidden on mobile) */}
      <div className="hidden lg:flex max-w-full mx-auto px-8 pt-6 items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-green-700 text-2xl p-2 rounded-full hover:bg-green-100 transition-colors duration-200">
          <ArrowLeft size={24} />
        </button>
        <p className="text-sm text-gray-600">
          <Link to="/" className="text-green-700 hover:underline font-medium">Home</Link> /
          <Link to="/products" className="text-green-700 hover:underline font-medium"> Products</Link> /
          <span className="text-gray-800 font-bold ml-1"> {product.name}</span>
        </p>
      </div>

      {/* Main Content Container (Full Width on Desktop) */}
      <div className="max-w-full mx-auto bg-white shadow-2xl rounded-xl overflow-hidden lg:flex lg:mt-6 p-0 border border-green-100">
        
        {/* Product Image Section (Left 50%) */}
        <div className="lg:w-1/2 p-6 flex flex-col items-center justify-center bg-gray-50 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none relative overflow-hidden">
          
          {/* Main Image with Transition */}
          <motion.img
            key={selectedImage} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={selectedImage}
            alt={product.name}
            className="w-full max-h-[550px] object-contain rounded-xl shadow-xl border border-gray-200"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
          />
          
          {/* Thumbnail Carousel - Using product.images array (Base64 URLs) */}
          <div className="flex justify-center gap-3 mt-6 overflow-x-auto py-2 px-4 scrollbar-hide">
            {product.images && product.images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(image)}
                className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden cursor-pointer shadow-sm transition-colors duration-200 ${
                  selectedImage === image ? 'border-green-600 ring-4 ring-green-100' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <img
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/E0E0E0/333333?text=Thumb'; }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Details Section (Right 50%) */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-start">
          <div>

            {/* Product Name and Price/Qty (Desktop) */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight lg:max-w-[60%]">
                {product.name}
              </h2>
              {/* Price and Quantity on the right of the product name (Desktop/Tablet) */}
              <div className="hidden lg:block">
                <PriceAndQuantity {...priceAndQuantityProps} />
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-600 mb-4 font-medium">
              <span className="font-semibold">Sold by:</span> <span className="font-extrabold text-green-700">{product.sellerName}</span>
            </p>

            {/* Rating and Stock Status */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 border-b border-gray-100 pb-4">
              
              {/* Average Rating */}
              <div className="flex items-center">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-xl text-gray-800 font-extrabold">{averageRating.toFixed(1)}</span>
                  <span className="ml-1 text-sm text-gray-600 font-medium">/ 5</span>
              </div>
              
              {/* Review Count */}
              <div className="text-sm text-gray-600 font-medium">
                  ({totalRatings} Customer Reviews)
              </div>
              
              {/* Stock Status */}
              <div className={`flex items-center text-sm font-bold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
              </div>
            </div>
            
            {/* Price and Quantity (Mobile/Tablet) */}
            <div className="lg:hidden mb-6 pt-2 border-t border-gray-100">
                <PriceAndQuantity {...priceAndQuantityProps} />
            </div>

            {/* **DESKTOP ADD TO CART SECTION (hidden on mobile)** */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="hidden lg:flex items-center gap-4 border-b pb-6 border-gray-100 mb-8"
            >
                <div className="flex flex-col flex-grow">
                  <span className="text-sm text-gray-500 font-medium">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{(product.price * selectedQuantity).toFixed(2)}
                  </span>
                </div>
                <motion.button
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center justify-center w-full sm:max-w-[300px] px-6 py-3 rounded-xl text-white font-semibold text-lg shadow-xl
                      transition-all duration-300 ease-in-out transform
                      ${product.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                    `}
                    disabled={product.quantity === 0}
                >
                    <ShoppingCart className="mr-3 text-xl" />
                    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">About This Product</h3>
            <p className="text-base text-gray-700 mb-8 leading-relaxed border-b border-gray-100 pb-6">
              {product.description}
            </p>

            {/* Why shop from us? section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Zap className='w-5 h-5 mr-2 text-green-500' /> Service Guarantees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyShopData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className="flex items-start p-3 bg-green-50 rounded-xl shadow-md border border-green-100 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="text-2xl sm:text-3xl mr-3 flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ⭐️ Reviews Section ⭐️ */}
            <ReviewsSection ratings={product.ratings} reviewerMap={reviewerMap} />
            
          </div>
        </div>
      </div>

      {/* 📱 Mobile Application Bottom Fixed Bar (lg:hidden) 📱 */}
      <AnimatePresence>
        <motion.div
            initial="hidden"
            animate="visible"
            variants={bottomBarVariants}
            className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-2xl z-40 lg:hidden"
        >
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Total Price:</span>
                    <span className="text-xl font-bold text-gray-900">
                        ₹{(product.price * selectedQuantity).toFixed(2)}
                    </span>
                </div>
                <motion.button
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.95 }} 
                    className={`
                      flex items-center justify-center flex-1 px-4 py-3 rounded-xl text-white font-semibold text-base shadow-lg
                      transition-all duration-300 ease-in-out transform
                      ${product.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                    `}
                    disabled={product.quantity === 0}
                >
                    <ShoppingCart className="mr-3 text-lg" />
                    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
            </div>
        </motion.div>
      </AnimatePresence>


      {/* Toast Notification */}
      <AnimatePresence>
        {/* Adjusted bottom position to clear the mobile bottom bar */}
        {showToast && (
          <motion.div
            className={`fixed bottom-28 sm:bottom-12 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-xl text-sm sm:text-base z-50 flex items-center space-x-2`}
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