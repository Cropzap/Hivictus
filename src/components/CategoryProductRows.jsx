import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, User, Loader } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify'; 
// NOTE: ⭐️ YOU MUST UNCOMMENT AND ADD THIS LINE IN YOUR MAIN APP FILE (e.g., App.js) FOR TOASTS TO DISPLAY CORRECTLY:
// import 'react-toastify/dist/ReactToastify.css';

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
// ---------------------

// Fallback Image URL Constant
const FALLBACK_IMAGE_URL = 'https://placehold.co/400x400/E5E7EB/9CA3AF?text=Product';


// ⭐️ New Component: Custom Toast Content
const CartSuccessToast = ({ product, quantity }) => {
  return (
    <div className="flex items-center">
      <img
        src={product.imageUrl || FALLBACK_IMAGE_URL}
        alt={product.name}
        className="w-10 h-10 object-cover rounded-md mr-3 flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }}
      />
      <div>
        <p className="font-bold text-gray-900 line-clamp-1">✅ Added to Cart</p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{product.name}</span> x {quantity}
        </p>
      </div>
    </div>
  );
};


// --- PriceUnit Component ---
const PriceUnit = ({ price, unit }) => {
  const numericPrice = typeof price === 'number' ? price : 0;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(numericPrice);

  return (
    <div className="flex items-end text-sm">
      <span className="text-xl font-extrabold text-emerald-700">
        {formattedPrice}
      </span>
      {unit && (
        <span className="text-xs text-gray-500 font-medium capitalize ml-1 whitespace-nowrap">
          / {unit}
        </span>
      )}
    </div>
  );
};


// --- ProductCard Component (Enhanced UI) ---
const ProductCard = ({ product, onAddToCart }) => {
  
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE_URL;
  };

  const productId = product._id || product.id; 

  const displayCategory = typeof product.category === 'object' && product.category !== null 
    ? product.category.name || 'Unknown Category' 
    : product.category;

  // Use the image URL logic from the original Products component
  const displayImageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : product.imageUrl || FALLBACK_IMAGE_URL;

  const isOutOfStock = product.quantity === 0;

  // --- RATING DATA ---
  const displayRating = product.averageRating !== undefined ? parseFloat(product.averageRating) : (product.rating || 0);
  const reviewCount = product.totalRatings !== undefined ? parseInt(product.totalRatings, 10) : 0;
  // --- END RATING DATA ---
  
  // Truncate description to 30 characters
  const shortDescription = product.description
    ? (product.description.length > 30
      ? product.description.substring(0, 30) + '...'
      : product.description)
    : 'Fresh and high-quality produce';

  // Star Rendering Component (Using Lucide)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} size={10} fill="#FACC15" color="#FACC15" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} size={10} color="#D1D5DB" />);
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <motion.div
      // ⭐️ INCREASED HEIGHT to h-[440px] and wider w-[220px] for better look in a horizontal scroll
      className="relative bg-white rounded-xl shadow-lg transition-all duration-300 flex flex-col group border border-gray-100 hover:border-emerald-400 h-[440px] w-[220px] sm:w-[250px] flex-shrink-0"
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
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md z-10">
              OOS
            </div>
          )}
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

          {/* Short Description & Rating (One Line) */}
          <div className="flex justify-between items-center text-gray-600 mb-3">
             <p className="text-gray-500 line-clamp-1 text-xs" title={product.description}>{shortDescription}</p>
          </div>
          
          {/* Rating Display */}
          <div className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap mb-3">
              {renderStars(displayRating)}
              <span className="text-gray-700 font-extrabold">{displayRating > 0 ? displayRating.toFixed(1) : 'N/A'}</span>
          </div>
          
          {/* ⭐️ ADD TO CART BUTTON MOVED HERE (Inside the content area) */}
          <motion.button
            className={`w-full py-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md mb-3
              ${isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Pass the product ID to the handler provided by the parent
              onAddToCart(productId);
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={16} className="mr-2" /> Add to Basket
              </>
            )}
          </motion.button>

          {/* ⭐️ Seller Info and Review Count (One Line, using grid for truncation) */}
          <div className="grid grid-cols-[1fr_auto] items-center text-gray-600 border-t pt-2 border-gray-100 mt-auto text-xs">
            <div className="flex items-center min-w-0">
              <User className="mr-1 text-emerald-400 flex-shrink-0" size={12} />
              {/* ⭐️ line-clamp-1 ensures the text truncates if it's too long, keeping reviews on the same line */}
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


// --- Main Component: CategoryProductRows ---
const CategoryProductRows = () => {
  const [categoryData, setCategoryData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder for actual auth token (e.g., from context or state)
  const authToken = localStorage.getItem('authToken');

  /**
   * Fetches categories and then products, grouping products by the fetched categories.
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. FETCH CATEGORIES DYNAMICALLY
      const categoryResponse = await fetch(`${API_BASE_URL}/categories`);
      if (!categoryResponse.ok) {
        throw new Error(`Failed to fetch categories: ${categoryResponse.status} ${categoryResponse.statusText}`);
      }
      
      const categories = await categoryResponse.json(); 
      
      // 2. FETCH ALL PRODUCTS
      const productResponse = await fetch(`${API_BASE_URL}/products`);

      if (!productResponse.ok) {
        throw new Error(`Failed to fetch products: ${productResponse.status} ${productResponse.statusText}`);
      }
      const allProducts = await productResponse.json();

      // --- Normalize category names for reliable matching (Categories from /categories endpoint) ---
      const categoryMap = new Map();
      const successfullyMappedCategoryKeys = []; 
      
      categories.forEach(cat => {
        const originalCategoryName = typeof cat === 'string' ? cat : cat?.name;
        
        if (originalCategoryName != null) {
            const categoryString = String(originalCategoryName); 
            const normalizedKey = categoryString.trim().toLowerCase();
            
            if (normalizedKey) {
                categoryMap.set(normalizedKey, { 
                    categoryName: categoryString,
                    products: [] 
                });
                successfullyMappedCategoryKeys.push(normalizedKey);
            }
        }
      });

      // Distribute products into their respective category groups
      const unmatchedCategories = new Set(); 

      allProducts.forEach(product => {
        let rawCategoryName = product.category;
        
        // --- LOGIC TO HANDLE OBJECTS IN product.category ---
        if (typeof rawCategoryName === 'object' && rawCategoryName !== null) {
            if (rawCategoryName.name) {
                rawCategoryName = rawCategoryName.name;
            } else if (rawCategoryName.categoryName) {
                rawCategoryName = rawCategoryName.categoryName;
            } else {
                rawCategoryName = '[object object] (unextractable)';
            }
        }
        // --- END OBJECT HANDLING LOGIC ---
        
        if (rawCategoryName != null && rawCategoryName !== '[object object] (unextractable)') { 
            const categoryString = String(rawCategoryName);
            const normalizedProductCategory = categoryString.trim().toLowerCase();
            
            if (normalizedProductCategory) {
                const group = categoryMap.get(normalizedProductCategory);
                
                if (group) {
                  group.products.push(product);
                } else {
                  unmatchedCategories.add(normalizedProductCategory);
                }
            }
        } else if (rawCategoryName === '[object object] (unextractable)') {
             unmatchedCategories.add(rawCategoryName);
        }
      });
      
      const finalGroupedData = Array.from(categoryMap.values()).filter(g => g.products.length > 0);
      
      setCategoryData(finalGroupedData);
      
      if (finalGroupedData.length === 0) {
         // Error toast
         toast.error('No products matched the categories fetched from the backend.', { autoClose: 5000 });
      } else {
         console.log('Categories and products loaded successfully!');
      }

    } catch (err) {
      console.error('Error during data fetching:', err);
      setError(`Data Loading Error: ${err.message}. Please verify both /categories and /products endpoints are working on ${API_BASE_URL}.`);
      console.error('Failed to load data. Check backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Handler for adding a product to the cart.
   * @param {string} productId - The ID of the product to add.
   */
  const handleAddToCart = useCallback(async (productId) => {
    if (!authToken) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    // 1. Find the full product object using the productId
    let product = null;

    // Search through the categoryData to find the product
    for (const group of categoryData) {
        const foundProduct = group.products.find(p => (p._id || p.id) === productId);
        if (foundProduct) {
            product = foundProduct;
            break;
        }
    }
    
    if (!product) {
        toast.error('Error: Could not find product details to add to cart.');
        return;
    }

    // Prepare product data for API and Toast
    const productName = product.name;
    const productPrice = product.price;
    const productImageUrl = (product.imageUrls && product.imageUrls.length > 0)
        ? product.imageUrls[0]
        : product.imageUrl || FALLBACK_IMAGE_URL;
    const quantity = 1;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken, 
        },
        body: JSON.stringify({
          productId: productId,
          name: productName,
          price: productPrice,
          imageUrl: productImageUrl,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.msg || "Unknown server error";
        } else {
          const errorText = await response.text(); 
          errorMessage = errorText || `Server error - ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      // ⭐️ SUCCESS TOAST WITH CUSTOM COMPONENT AND CORRECT DURATION (3 seconds)
      toast.success(
        <CartSuccessToast product={{ name: productName, imageUrl: productImageUrl }} quantity={quantity} />,
        {
          position: "top-right", 
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );

    } catch (err) {
      console.error("Error adding to cart from CategoryProductRows:", err);
      // Error toast with 5 seconds duration
      toast.error(err.message || "Failed to add to cart", { autoClose: 5000 });
    }
  }, [authToken, categoryData]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 py-20 bg-gray-50">
        <Loader className="animate-spin text-emerald-600 w-10 h-10 mr-3" />
        <p className="text-gray-700 text-lg">Fetching categories and products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 py-20 bg-red-50 border border-red-300 rounded-lg mx-auto max-w-xl shadow-md p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
        <p className="text-sm text-red-500 mt-2">Check the browser console for details and ensure your backend is accessible at {API_BASE_URL}.</p>
      </div>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 py-20 bg-gray-50">
        <p className="text-gray-600 text-lg">No product categories with items were found.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative z-0 bg-gray-50 py-10 sm:py-12 px-0 font-sans min-h-screen">
      
      {/* ⭐️ NEW METHOD: Include the CSS link directly for guaranteed style loading (If global import fails) */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-toastify/9.1.3/ReactToastify.css" integrity="sha512-QjE58A4i02X6+5X4wM/kQJ2M/9g5D/WzJz8nJ6c/x0kQ9n7t+Pj1XQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
     
      {/* ⭐️ TOAST CONTAINER SETUP */}
      <ToastContainer
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
        style={{ zIndex: 9999 }} // Ensures it is on top
      />
      {/* --------------------- */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center border-b-4 border-emerald-300 pb-2">
          Shop By Category
        </h2>
      </div>

      {categoryData.map((categoryGroup, index) => (
        <motion.div
          key={categoryGroup.categoryName}
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">
              {categoryGroup.categoryName}
            </h3>
            <Link
              to={`/category/${categoryGroup.categoryName.replace(/\s/g, '-')}`}
              className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors text-sm sm:text-base focus:outline-none cursor-pointer"
            >
              See All &rarr;
            </Link>
          </div>

          {/* ⭐️ Mobile-App Like Horizontal Scrolling Product Row */}
          <div
            className="flex space-x-6 overflow-x-auto py-4 px-4 sm:px-6 md:px-8 scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {/* Custom CSS for scrollbar hiding */}
            <style jsx="true">{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <AnimatePresence>
              {categoryGroup.products.slice(0, 10).map((product) => (
                <Link 
                  key={product._id || product.id}
                  to={`/product/${product._id || product.id}`}
                  className=" cursor-pointer"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </Link>
              ))}
          </AnimatePresence>
          <div className="w-4 flex-shrink-0"></div> 
        </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryProductRows;