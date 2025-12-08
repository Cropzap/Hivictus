import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingCart, User, Star } from 'lucide-react'; // Import Lucide icons for the new UI

const API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE_URL = 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=Product';

// --- SVG Icons (Simplified for brevity, assuming you have them defined elsewhere or use Lucide) ---
const SpinnerIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5-48-48zm0 416c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM48 304c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48zm416 0c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zM142.9 142.9c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm226.3 226.3c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm-226.3 67.9c-18.7 18.7-49.1 18.7-67.9 0s-18.7-49.1 0-67.9s49.1-18.7 67.9 0s18.7 49.1 0 67.9zm226.3-226.3c-18.7 18.7-49.1 18.7-67.9 0s-18.7-49.1 0-67.9s49.1-18.7 67.9 0s18.7 49.1 0 67.9z"/>
  </svg>
);
// --- End Icons ---

// --- Helper Components ---
const PriceUnit = ({ price, unit }) => (
  <p className="font-extrabold text-gray-900 text-xl">
    ₹{price?.toFixed(2) || 'N/A'}{unit && <span className="text-sm font-normal text-gray-500">/{unit}</span>}
  </p>
);

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const starSize = 14;

    return (
        <div className="flex items-center text-emerald-500">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={starSize} fill="currentColor" className="text-emerald-500" />
            ))}
            {hasHalfStar && <Star size={starSize} fill="url(#halfGradient)" className="text-emerald-500" />}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={starSize} className="text-gray-300" />
            ))}
            {/* SVG Gradient definition for half star */}
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="halfGradient">
                        <stop offset="50%" stopColor="#10b981" /> {/* Emerald-500 */}
                        <stop offset="50%" stopColor="#d1d5db" /> {/* Gray-300 */}
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

// --- ProductCard Component (NEW UI) ---
const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE_URL;
  };

  // ⭐️ FIX 1: Refined Image Retrieval to correctly handle the Base64 single image field ⭐️
  const getDisplayImage = () => {
    // Rely on the backend having mapped the first image to `product.imageUrl` 
    // when using .select('imageUrls.0') and the post-processing map.
    const url = product.imageUrl || product.imageUrls?.[0]; 

    if (url) {
        // Heuristic check: If the string is long and not a web URL, assume Base64 without prefix
        const isRawBase64 = url.length > 100 && !url.startsWith("http") && !url.startsWith("data:");
        if (isRawBase64) {
            return `data:image/jpeg;base64,${url}`;
        }
        return url;
    }
    return FALLBACK_IMAGE_URL;
  };

  const productId = product._id;
  const displayRating = product.averageRating || 0;
  
  // ⭐️ REMOVED OOS CHECK: Assume product is always available ⭐️
  const isOutOfStock = false; 
  
  const shortDescription = product.description ? product.description.substring(0, 50) + '...' : 'Fresh produce.';
  const reviewCount = product.totalRatings || 0;
  const displayImageUrl = getDisplayImage();

  const handleCardAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(productId); // Use the handler provided by the parent
  };


  return (
    <motion.div
      // ⭐️ CARD UI STYLES
      className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 flex flex-col group border border-gray-100 hover:border-emerald-400 h-[440px] w-full flex-shrink-0 cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -3, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.99 }}
    >
      <Link to={`/product/${productId}`} className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-xl">
          <img
            src={displayImageUrl}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
            onError={handleImageError}
          />
          {/* Out of Stock Badge (Removed display condition) */}
          {/* {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md z-10">
              OOS
            </div>
          )} */}
        </div>

        {/* Product Details (Now includes the button inside the flow) */}
        <div className="p-4 flex flex-col flex-grow text-sm">
          {/* Name - text-lg for prominence */}
          <h3 className="font-extrabold text-gray-800 line-clamp-2 mb-1 text-lg leading-snug">
            {product.name}
          </h3>
          
          {/* Price & Unit (One Line) */}
          <div className="flex items-center justify-between mb-2">
            <PriceUnit price={product.price} unit={product.unit} />
          </div>

          {/* Short Description */}
          <div className="flex justify-between items-center text-gray-600 mb-3">
             <p className="text-gray-500 line-clamp-1 text-xs" title={product.description}>{shortDescription}</p>
          </div>
          
          {/* Rating Display */}
          <div className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap mb-3">
             {renderStars(displayRating)}
             <span className="text-gray-700 font-extrabold">{displayRating > 0 ? displayRating.toFixed(1) : 'N/A'}</span>
          </div>
          
          {/* ⭐️ ADD TO CART BUTTON MOVED HERE (Inside the content area) ⭐️ */}
          {/* Note: The button is always enabled now */}
          <motion.button
            className={`w-full py-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md mb-3
              bg-emerald-600 text-white hover:bg-emerald-700
              }`}
            title={'Add to Basket'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardAddToCart} 
          >
            <ShoppingCart size={16} className="mr-2" /> Add to Basket
          </motion.button>

          {/* ⭐️ Seller Info and Review Count (One Line, using grid for truncation) */}
          <div className="grid grid-cols-[1fr_auto] items-center text-gray-600 border-t pt-2 border-gray-100 mt-auto text-xs">
            <div className="flex items-center min-w-0">
              <User className="mr-1 text-emerald-400 flex-shrink-0" size={12} />
              {/* line-clamp-1 ensures the text truncates if it's too long, keeping reviews on the same line */}
              <span className="font-medium text-gray-700 line-clamp-1 overflow-hidden text-ellipsis">
                {product.sellerName || 'Local Farm'}
              </span>
            </div>
            {/* whitespace-nowrap ensures review count stays together */}
            <span className="text-gray-500 font-semibold whitespace-nowrap ml-2 text-right text-[10px]">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Main Component ---
const BestSellingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem('authToken'); 

  // Fetch product data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Assuming the backend endpoint is correctly updated to filter by rating > 3
        const response = await fetch(`${API_URL}/products/best-selling`); 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // **Client-side Filter (as a safety measure, though backend should do this)**
        const filteredProducts = data.filter(product => {
            // Safely check averageRating, ensuring it's treated as a number
            const rating = parseFloat(product.averageRating) || 0;
            return rating > 3;
        });

        setProducts(filteredProducts);
        toast.success('Top rated products loaded successfully!');
      } catch (err) {
        console.error('Error fetching best-selling products:', err);
        setError('Failed to load top rated products. Please try again later.');
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handler for adding a product to the cart (Unchanged)
  const handleAddToCart = async (productId) => {
    if (!authToken) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      // NOTE: We rely on the backend to retrieve the full imageUrls when adding to cart
      // We only pass the minimal ID and quantity here.
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`HTTP error! Status: ${response.status}. Expected JSON, but received a different format.`);
        }
        
        if (response.status === 401) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            navigate('/login');
        } else {
            throw new Error(errorData.message || `Failed to add product to cart. Status: ${response.status}`);
        }
      }

      toast.success('Product added to cart successfully!');
      console.log(`Product ID ${productId} added to cart.`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(`Failed to add to cart: ${err.message}`);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSeeAllClick = () => {
    navigate('/products'); // Navigate to a page with all products
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 py-10">
        <SpinnerIcon className="animate-spin text-emerald-600 w-10 h-10 mr-3" />
        <p className="text-gray-700 text-lg">Loading top rated products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 py-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 py-10">
        <p className="text-gray-600 text-lg">No products with a rating above 3 found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative z-0 bg-white py-10 sm:py-12 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Top Rated Products</h2>
          <button
            onClick={handleSeeAllClick}
            className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full px-4 py-2"
          >
            See All
          </button>
        </div>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mobile-scroll-container"
            layout
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BestSellingProducts;