import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import Slider from 'react-slick';
import { FaSpinner, FaStar, FaShoppingCart, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// --- Auth Token Helper ---
// This function retrieves the authentication token from localStorage.
// In a real application, you might get this from a more robust authentication context.
const getAuthToken = () => localStorage.getItem('authToken');

// --- Toast Context and Provider ---
// This context and provider are self-contained within this file.
// It allows any child component to show toast notifications.
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // State to hold toast message and type
  const toastTimeoutRef = useRef(null); // Ref to manage the toast auto-hide timeout

  // Callback function to display a toast message
  const showToastMessage = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });

    // Clear any existing timeout to prevent toasts from disappearing too quickly
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    // Set a new timeout to hide the toast after the specified duration
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []); // useCallback ensures this function is stable across renders

  // Helper to get the appropriate icon based on toast type
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'error': return <FaTimesCircle className="text-red-500 mr-2" />;
      case 'info': return <FaExclamationCircle className="text-blue-500 mr-2" />; // Using exclamation for info
      case 'warning': return <FaExclamationCircle className="text-yellow-500 mr-2" />;
      default: return null;
    }
  };

  // Helper to get the appropriate background color based on toast type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <ToastContext.Provider value={{ showToastMessage }}>
      {children}
      {/* AnimatePresence for smooth entry/exit animations of the toast */}
      <AnimatePresence>
        {toast && ( // Render toast only if 'toast' state is not null
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} // Initial animation state
            animate={{ opacity: 1, y: 0, scale: 1 }} // Animation when toast appears
            exit={{ opacity: 0, y: 20, scale: 0.9 }} // Animation when toast disappears
            transition={{ duration: 0.3 }} // Transition duration
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center min-w-[250px] max-w-sm
                        ${getBackgroundColor(toast.type)} border`} // Dynamic styling
            role="alert" // ARIA role for accessibility
          >
            {getIcon(toast.type)} {/* Display icon based on toast type */}
            <span className="text-sm font-medium text-gray-800 flex-grow">{toast.message}</span>
            <button
              onClick={() => setToast(null)} // Close button for the toast
              className="ml-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close toast"
            >
              <FaTimesCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

// Custom hook to consume the ToastContext.
// Throws an error if used outside of a ToastProvider, ensuring correct usage.
const useToast = () => {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// --- Helper function to render stars based on rating ---
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-lime-800" />
      ))}
      {halfStar && <FaStar key="half" className="text-lime-800 opacity-50" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="text-lime-800 opacity-20" />
      ))}
    </>
  );
};

// --- ProductCard Component ---
// Displays individual product details and handles add-to-cart action.
const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // framer-motion variants for card animations (hover, tap effects)
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    hover: {
      scale: 1.03,
      y: -4, // Slight lift effect on hover
      boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.15), 0 6px 10px -3px rgba(0, 0, 0, 0.08)", // More pronounced shadow
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 }, // Shrink slightly on tap/click
  };

  // Fallback image handler for broken image URLs
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop on error
    e.target.src = 'https://placehold.co/400x400/E0E0E0/333333?text=Product'; // Generic placeholder
  };

  return (
    <motion.div
      // Fixed height for consistency across all product cards
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col border border-gray-100 group h-[420px] sm:h-[450px]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Link wraps most of the card to navigate to product details on click */}
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        <div className="relative w-full h-40 sm:h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl || 'https://placehold.co/400x400/E0E0E0/333333?text=Product'}
            alt={product.name}
            className="object-cover h-full w-full transition-transform duration-300 ease-out group-hover:scale-110" // Increased scale on hover
            onError={handleImageError}
          />
          {/* Subtle overlay effect on image hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2 mb-1.5">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2.5">
            {product.category?.name} &bull; {product.subCategory} &bull; {product.type}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <span className="text-lg sm:text-xl text-green-700 font-bold">₹{product.price.toFixed(2)} / {product.unit}</span>
            {/* Rating Display with stars */}
            <div className="flex items-center bg-lime-100 text-lime-800 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
              <span className="mr-1">{product.rating.toFixed(1)}</span>
              {renderStars(product.rating)}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            {product.quantity > 0 ? (
              <p className="text-sm text-gray-500 font-medium">In Stock: <span className="text-green-600">{product.quantity}</span></p>
            ) : (
              <p className="text-sm text-red-500 font-semibold">Out of Stock</p>
            )}
            <p className="text-xs text-gray-700 font-bold">Sold by: {product.sellerName}</p>
          </div>
        </div>
      </Link>
      {/* Cart Button - Positioned absolutely to be clickable independently of the Link */}
      <div className="absolute top-3 right-3">
        <motion.button
          className={`bg-white p-2.5 rounded-full shadow-lg transition-colors duration-200
                      ${product.quantity === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-green-100 text-green-600 hover:text-green-700'}`}
          title={product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            // Prevent event propagation to the parent Link and default browser behavior
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product._id); // Call the onAddToCart prop from the parent component
          }}
          disabled={product.quantity === 0} // Disable button if product is out of stock
        >
          <FaShoppingCart className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};


// --- BestSellingProductsCore Component ---
// This component contains the main logic for fetching and displaying products.
// It is wrapped by ToastProvider in the default export.
const BestSellingProductsCore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { showToastMessage } = useToast(); // Consume the toast hook

  // useEffect to fetch best-selling products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/best-selling'); // API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching best-selling products:', err);
        setError('Failed to load best-selling products. Please try again later.');
        showToastMessage('Failed to load products.', 'error'); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToastMessage]); // Dependency array ensures effect runs when showToastMessage changes (stable due to useCallback)

  // Handler for adding a product to the cart
  const handleAddToCart = async (productId) => {
    const token = getAuthToken(); // Get the authentication token
    if (!token) {
      showToastMessage('Please log in to add items to your cart.', 'error');
      navigate('/login'); // Redirect to login page if not authenticated
      return;
    }

    try {
      // Changed to /api/cart based on common practice for POST for adding items to cart
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the authentication token
        },
        body: JSON.stringify({ productId, quantity: 1 }), // Default quantity to 1
      });

      if (!response.ok) {
        if (response.status === 401) {
            showToastMessage('Session expired. Please log in again.', 'error');
            localStorage.removeItem('authToken'); // Clear invalid token
            localStorage.removeItem('userData'); // Assuming user data is also stored here
            navigate('/login'); // Redirect to login
        } else {
            const errorData = await response.json();
            throw new Error(errorData.msg || `Failed to add product to cart. Status: ${response.status}`);
        }
      }

      showToastMessage('Product added to cart successfully!'); // Success toast
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToastMessage(`Failed to add to cart: ${err.message}`, 'error');
    }
  };

  // React-slick settings for the carousel
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Adjusted for narrower cards on larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 6 } }, // 2xl
      { breakpoint: 1280, settings: { slidesToShow: 5 } }, // xl
      { breakpoint: 1024, settings: { slidesToShow: 4 } }, // lg
      { breakpoint: 768, settings: { slidesToShow: 3, centerMode: false, arrows: true } }, // md - removed centerMode for more standard grid
      { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1, centerMode: false, arrows: false } }, // sm
      { breakpoint: 480, settings: { slidesToShow: 1.5, slidesToScroll: 1, centerMode: true, centerPadding: '15px', arrows: false } }, // xs
      { breakpoint: 320, settings: { slidesToShow: 1.2, slidesToScroll: 1, centerMode: true, centerPadding: '10px', arrows: false } }, // very small mobile
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white py-10">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl mr-3" />
        <p className="text-gray-700 text-lg">Loading best-selling products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white py-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white py-10">
        <p className="text-gray-600 text-lg">No best-selling products found at the moment.</p>
      </div>
    );
  }

  return (
    // Set z-index to a low value (e.g., z-0) to ensure other popups/modals (with higher z-index) appear on top.
    // Make sure your popups/modals have z-index values like z-10, z-20, z-50, or z-max.
    <div className="relative z-0 bg-white py-10 sm:py-12 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Selling Agriculture Products</h2>
          <Link to="/products?rating=4plus" className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors">See All</Link>
        </div>

        <div className="carousel-container">
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <div key={product._id} className="p-2">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

// --- Default Export (Wrapper Component) ---
// This component wraps BestSellingProductsCore with ToastProvider
// to ensure that useToast is always called within its context.
const BestSellingProducts = () => {
  return (
    <ToastProvider>
      <BestSellingProductsCore />
    </ToastProvider>
  );
};

export default BestSellingProducts;
