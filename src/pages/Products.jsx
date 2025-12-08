import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Filter,
  RefreshCcw,
  Search,
  X,
  User,
  Loader,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
// NOTE: Corrected import path capitalization for Vite
import 'react-toastify/dist/ReactToastify.css'; 

// API Base URL (Configure this based on your backend environment)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Fallback Image URL Constant
const FALLBACK_IMAGE_URL = 'https://placehold.co/400x400/E5E7EB/9CA3AF?text=Product';

// ====================================================================
// --- Utility Functions for URL Slugs (Unchanged) ---
// ====================================================================

/**
 * Converts a clean string (e.g., "Fresh Vegetables") into a URL slug (e.g., "fresh-vegetables").
 */
const createSlug = (name) => {
  if (!name || name === 'All') return null;
  return name.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
};

/**
 * Converts a URL slug (e.g., "fresh-vegetables") back into a clean name (e.g., "Fresh Vegetables").
 */
const cleanName = (slug) => {
  if (!slug) return 'All';
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Normalizes a category or subcategory name.
 */
const normalizeFilterName = (name) => {
  if (!name || name === 'All') return 'All';
  return name.replace(/-/g, ' ').trim();
};

// ====================================================================
// --- Utility Components (ProductCard, PriceUnit, etc.) ---
// ====================================================================

// Star Rendering Component (Unchanged)
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  // Only display partial star if the decimal part is significant
  const partialStar = rating % 1; 

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} size={10} fill="#FACC15" color="#FACC15" />);
  }
  
  if (partialStar >= 0.25 && partialStar < 0.75) {
      // NOTE: Lucide doesn't have a half-star component, so we use a full star with opacity/fallback logic
      stars.push(<Star key="half" size={10} fill="#FACC15" color="#FACC15" opacity={0.5} />);
  } else if (partialStar >= 0.75) {
      // If close to a full star, render it as full (can be adjusted based on desired strictness)
      stars.push(<Star key="near-full" size={10} fill="#FACC15" color="#FACC15" />);
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} size={10} color="#D1D5DB" />);
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

// Price & Unit Component (Unchanged)
const PriceUnit = ({ price, unit }) => {
  const numericPrice = typeof price === 'number' ? price : 0;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(numericPrice);

  return (
    <div className="flex items-end text-sm">
      <span className="text-xl font-extrabold text-green-700">
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

// ⭐️ NEW/UPDATED: Image display logic for the card view ⭐️
const getCardDisplayImage = (product) => {
    // Since the backend uses select('-imageUrls'), product.imageUrls is MISSING.
    // We rely on the backend possibly providing the main image URL in another field,
    // or falling back entirely.
    let url = product.imageUrl || product.imageUrls?.[0]; 

    if (url) {
        // Heuristic check: If the string is long and not a web URL, assume Base64 without prefix
        const isRawBase64 = url.length > 100 && !url.startsWith("http") && !url.startsWith("data:");
        if (isRawBase64) {
            return `data:image/jpeg;base64,${url}`; // Apply prefix
        }
        return url; 
    }
    return FALLBACK_IMAGE_URL;
};


// --- Product Card UI Component ---
const ProductCard = ({ product }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const displayImageUrl = getCardDisplayImage(product); // Use the new helper function

const handleAddToCart = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!authToken) {
    toast.error("Please log in to add items to cart.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken,
      },
      body: JSON.stringify({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: displayImageUrl, // Use the resolved image URL here
        quantity: 1,
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

    toast.success(`${product.name} added to cart!`);

  } catch (err) {
    console.error("Error adding to cart from ProductCard:", err);
    toast.error(err.message || "Failed to add to cart");
  }
};


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    hover: { scale: 1.03, y: -3, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
    tap: { scale: 0.99 },
  };

  const isOutOfStock = product.quantity === 0;

  // Truncate description to 30 characters
  const shortDescription = product.description
    ? (product.description.length > 30
      ? product.description.substring(0, 30) + '...'
      : product.description)
    : 'Fresh and organic produce';

  // --- RATING DATA ---
  const displayRating = product.averageRating !== undefined ? parseFloat(product.averageRating) : 0;
  const reviewCount = product.totalRatings !== undefined ? parseInt(product.totalRatings, 10) : 0;
  // --- END RATING DATA ---
  
  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg transition-all duration-300 flex flex-col group border border-gray-100 hover:border-green-400 h-[440px]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-xl">
          <img
            src={displayImageUrl} // 🔑 USE RESOLVED URL HERE
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE_URL; // Fallback on error
            }}
          />
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md z-10">
              OOS
            </div>
          )}
        </div>

        {/* Product Details (Now includes the button) */}
        <div className="p-4 flex flex-col flex-grow text-sm">
          {/* Name - text-lg for prominence */}
          <h3 className="font-extrabold text-gray-800 line-clamp-2 mb-2 text-lg leading-snug">
            {product.name}
          </h3>

          {/* Price & Unit (One Line) - Prominent placement */}
          <div className="flex items-center justify-between mb-2">
            <PriceUnit price={product.price} unit={product.unit} />
          </div>
          
          {/* Rating Display */}
          <div className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap mb-3">
              {renderStars(displayRating)}
              <span className="text-gray-700 font-extrabold">{displayRating > 0 ? displayRating.toFixed(1) : 'N/A'}</span>
          </div>

          {/* Short Description */}
          <p className="text-gray-500 line-clamp-2 text-xs mb-3 flex-grow" title={product.description}>{shortDescription}</p>

          {/* ⭐️ ADD TO CART BUTTON MOVED HERE (Inside the content area) */}
          <motion.button
            className={`w-full py-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md mb-3
              ${isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: 1.02 }} // Use full scale for hover/tap on this card type
            onClick={handleAddToCart}
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
              <User className="mr-1 text-green-400 flex-shrink-0" size={12} />
              {/* ⭐️ Line-clamp-1 ensures the text truncates if it's too long, keeping reviews on the same line */}
              <span className="font-medium text-gray-700 line-clamp-1 overflow-hidden text-ellipsis">
                {product.sellerName || 'Local Farm'}
              </span>
            </div>
            {/* whitespace-nowrap ensures review count stays together */}
            <span className="text-gray-500 font-semibold whitespace-nowrap ml-2 text-right">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Common Filter UI Component (Refined - Unchanged) ---
const FilterContent = ({
  handleFilterChange,
  handlePriceRangeChange,
  resetFilters,
  filters,
  allCategories,
  allTypes,
  getSubcategoriesForSelectedCategory,
  closeFilterPanel, // New prop for mobile
}) => {

    const maxPrice = filters.priceRange[1] > filters.priceRange[0] ? filters.priceRange[1] : filters.priceRange[0];
    const minPrice = filters.priceRange[0];

    return (
    <>
      <div className="mb-4 p-3 bg-white rounded-lg shadow-inner border border-gray-200">
        <label htmlFor="searchQuery" className="block text-gray-700 text-xs font-semibold mb-1">
          Quick Search
        </label>
        <div className="relative">
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleFilterChange}
            placeholder="e.g., tomato, organic"
            className="w-full p-2 pr-8 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 transition-all text-sm"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 text-xs font-semibold mb-1">
          Category
        </label>
        {/* Note: The value passed here is the CLEAN NAME, not the slug */}
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-200 rounded-lg bg-white focus:border-green-400 transition-all text-sm appearance-none shadow-sm"
        >
          {['All', ...allCategories.map(c => c.name)].map((cat) => (
            <option key={cat} value={cat} className="text-sm">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filters.category !== 'All' && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block text-gray-700 text-xs font-semibold mb-1">
            Subcategory
          </label>
            {/* Note: The value passed here is the CLEAN NAME, not the slug */}
          <select
            id="subCategory"
            name="subCategory"
            value={filters.subCategory}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-200 rounded-lg bg-white focus:border-green-400 transition-all text-sm appearance-none shadow-sm"
          >
            {getSubcategoriesForSelectedCategory().map((subCat) => (
              <option key={subCat} value={subCat} className="text-sm">
                {subCat}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 text-xs font-semibold mb-1">
          Produce Type
        </label>
        <select
          id="type"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-200 rounded-lg bg-white focus:border-green-400 transition-all text-sm appearance-none shadow-sm"
        >
          {allTypes.map((type) => (
            <option key={type} value={type} className="text-sm">
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-gray-700 text-xs font-semibold mb-1">
          Price Range (INR)
        </label>
        <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              value={minPrice}
              onChange={handlePriceRangeChange}
              placeholder="Min"
              step="10"
              min="0"
              className="w-1/2 p-2 border border-gray-300 rounded-lg focus:border-green-400 transition-all text-sm shadow-inner"
            />
            <span className="text-gray-500 font-bold text-sm">-</span>
            <input
              type="number"
              name="maxPrice"
              value={maxPrice}
              onChange={handlePriceRangeChange}
              placeholder="Max"
              step="10"
              min="0"
              className="w-1/2 p-2 border border-gray-300 rounded-lg focus:border-green-400 transition-all text-sm shadow-inner"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 font-bold">Current Range: ₹{minPrice} - ₹{maxPrice}</p>
      </div>
      
      {/* ⭐️ Min Rating Filter (New Block) */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-gray-700 text-xs font-semibold mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => handleFilterChange({ target: { name: 'minRating', value: value } })}
                    className={`p-1 rounded-full border transition-all duration-200 
                        ${filters.minRating >= value 
                            ? 'bg-yellow-400 border-yellow-500 text-white shadow-md' 
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    <Star size={16} fill={filters.minRating >= value ? 'currentColor' : 'none'} color="currentColor" />
                </button>
            ))}
            {filters.minRating > 0 && (
                <button
                    onClick={() => handleFilterChange({ target: { name: 'minRating', value: 0 } })}
                    className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
                >
                    Clear ({filters.minRating}+)
                </button>
            )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="sortBy" className="block text-gray-700 text-xs font-semibold mb-1">
          Sort By
        </label>
        <select
          id="sortBy"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-200 rounded-lg bg-white focus:border-green-400 transition-all text-sm appearance-none shadow-sm"
        >
          <option value="default">Best Match</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
      </div>
      
      {/* Universal Reset button */}
      <button
        onClick={resetFilters}
        className="w-full bg-red-500 text-white px-3 py-2 rounded-lg flex items-center justify-center font-bold text-sm shadow-md hover:bg-red-600 transition-colors mt-6"
      >
        <RefreshCcw className="mr-2" size={14} /> Reset Filters
      </button>

      {/* Mobile-specific button to close and apply filters */}
      <button
        onClick={closeFilterPanel}
        className="lg:hidden w-full bg-green-600 text-white px-3 py-3 rounded-lg flex items-center justify-center font-bold text-base shadow-xl hover:bg-green-700 transition-colors mt-3"
      >
        Apply & View Results
      </button>
    </>
  )
};

// --- Categories Bar Component (Scrollable and Animated - Unchanged) ---
const CategoriesBar = ({ categories, onSelect, selectedCategory }) => {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allCategory = { name: 'All', mainImage: 'https://placehold.co/100x100/F0FDF4/15803D?text=All' };
  // The 'categories' prop is expected to be an array of category objects from the backend.
  const allCategoriesList = [allCategory, ...categories];

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Scroll by 200px horizontally with smooth animation
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-2 group">

        {/* Scroll Left Button */}
        <motion.button
            onClick={() => scroll('left')}
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-green-100 hidden md:block"
            whileHover={{ scale: 1.1 }}
            title="Scroll Left"
        >
            <ChevronLeft size={16} className="text-green-600" />
        </motion.button>

        {/* Categories Scroller */}
        <div
            ref={scrollRef}
            className="overflow-x-auto whitespace-nowrap scrollbar-hide py-1 px-1"
            style={{ scrollBehavior: 'smooth' }}
        >
            <div className="inline-flex gap-4">
                {allCategoriesList.map((category, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: isMobile ? 0 : index * 0.05 }}
                        className={`flex flex-col items-center cursor-pointer p-1 rounded-xl transition-all duration-300 hover:bg-green-50/50 hover:shadow-sm min-w-[70px]
                          ${selectedCategory === category.name
                            ? 'bg-green-100 border-2 border-green-600 text-green-700 font-extrabold shadow-inner'
                            : 'text-gray-700 border-2 border-transparent'}`
                        }
                        onClick={() => onSelect(category.name)}
                    >
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                            <img
                                src={category.mainImage || 'https://placehold.co/100x100/E5E7EB/6B7280?text=Cat'}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                // Add onError for category images as well
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E5E7EB/6B7280?text=Cat'; }}
                            />
                        </div>
                        <span className="mt-1 text-xs font-semibold capitalize whitespace-nowrap">
                            {category.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Scroll Right Button */}
        <motion.button
            onClick={() => scroll('right')}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-green-100 hidden md:block"
            whileHover={{ scale: 1.1 }}
            title="Scroll Right"
        >
            <ChevronRight size={16} className="text-green-600" />
        </motion.button>

    </div>
  );
};


// ====================================================================
// --- Main Products Component ---
// ====================================================================

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Check against lg breakpoint

  // Get initial values from URL on load
  const initialCategory = cleanName(searchParams.get('category'));
  const initialSubCategory = cleanName(searchParams.get('subcategory'));

  const [localFilters, setLocalFilters] = useState({
    type: 'All',
    // priceRange initialized with a safe default, max will be set after fetch
    priceRange: [0, 100],
    minRating: 0, 
    searchQuery: '',
    sortBy: 'default',
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Update isMobile state on resize
  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Combine local state filters with URL-derived filters
  const currentFilters = useMemo(() => ({
    ...localFilters,
    category: initialCategory, // Always read from URL
    subCategory: initialSubCategory, // Always read from URL
  }), [localFilters, initialCategory, initialSubCategory]);
  // ------------------------------------

  // Helper to get subcategories for the currently selected main category
  const getSubcategoriesForSelectedCategory = useCallback(() => {
    const selectedCat = categories.find(c => c.name === currentFilters.category);
    if (selectedCat && selectedCat.subcategories) {
      return ['All', ...selectedCat.subcategories.map(sc => sc.name)];
    }
    return ['All'];
  }, [categories, currentFilters.category]);


  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          // If 500 error is returned, throw error for display
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const rawData = await response.json();

        const productsWithParsedData = rawData.map((p) => ({
          ...p,
          // Safely access seller name
          sellerName: p.sellerId?.sellerName || p.sellerId?.companyName || 'Local Farm',
          // ⭐️ UPDATED: Use backend's computed average and total ratings
          averageRating: p.averageRating !== undefined ? parseFloat(p.averageRating) : 0,
          totalRatings: p.totalRatings !== undefined ? parseInt(p.totalRatings, 10) : 0,
          category: p.category && typeof p.category === 'object' ? p.category : { name: 'Unknown' },
        }));

        setAllProducts(productsWithParsedData);

        // Determine the maximum price for the initial price range
        const maxPrice = productsWithParsedData.reduce((max, p) => Math.max(max, p.price || 0), 0);

        setLocalFilters((prev) => {
            const currentMax = prev.priceRange[1];
            // Only update max price range if the new max is greater or if it's the initial default (100)
            if (maxPrice > currentMax || currentMax === 100) {
              return { ...prev, priceRange: [0, Math.ceil(maxPrice / 10) * 10 || 100]} // Round up to nearest 10 for max
            }
            return prev;
        });

        // Determine unique product types
        const uniqueTypes = ['All', ...new Set(productsWithParsedData.map((p) => p.type).filter(Boolean))];
        setAllTypes(uniqueTypes);

      } catch (err) {
        // Log the error message directly to state
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Filter Application Logic (Uses clean names from currentFilters) ---
  const applyFilters = useCallback(() => {
    let temp = [...allProducts];

    // Get the normalized filter values (converts hyphenated slugs from URL into clean names with spaces)
    const normalizedCategoryFilter = normalizeFilterName(currentFilters.category);
    const normalizedSubCategoryFilter = normalizeFilterName(currentFilters.subCategory);

    // 1. Category Filter
    if (normalizedCategoryFilter !== 'All') {
      temp = temp.filter((p) => {
          // Normalize the product data's category name too for a safe, case-insensitive match
          const productCategoryName = normalizeFilterName(p.category?.name);
          return productCategoryName.toLowerCase() === normalizedCategoryFilter.toLowerCase();
      });
    }

    // 2. Subcategory Filter
    if (normalizedSubCategoryFilter !== 'All') {
      temp = temp.filter((p) => {
          // Normalize the product data's subCategory name
          const productSubCategoryName = normalizeFilterName(p.subCategory);
          return productSubCategoryName.toLowerCase() === normalizedSubCategoryFilter.toLowerCase();
      });
    }

    // 3. Type Filter
    if (currentFilters.type !== 'All') {
      temp = temp.filter((p) => p.type === currentFilters.type);
    }

    // 4. Price Range Filter
    temp = temp.filter((p) =>
        (p.price || 0) >= currentFilters.priceRange[0] &&
        (p.price || 0) <= currentFilters.priceRange[1]
    );

    // 5. Min Rating Filter
    if (currentFilters.minRating > 0) {
      // ⭐️ Filter using the new averageRating field
      temp = temp.filter((p) => p.averageRating >= currentFilters.minRating);
    }

    // 6. Search Query Filter
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery.toLowerCase();
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        normalizeFilterName(p.category?.name)?.toLowerCase().includes(q) ||
        normalizeFilterName(p.subCategory)?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.sellerName?.toLowerCase().includes(q)
      );
    }

    // 7. Sort
    switch (currentFilters.sortBy) {
      case 'price-asc':
        temp.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        temp.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating-desc':
        // ⭐️ Sort using the new averageRating field
        temp.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        // No sort or default is 'best match' (which is the order from the API)
        break;
    }

    setFilteredProducts(temp);
  }, [allProducts, currentFilters]);

  // Effect to trigger filtering whenever filters or products change (with debounce)
  useEffect(() => {
    if (allProducts.length > 0 || !loading) {
      const handler = setTimeout(() => {
        applyFilters();
      }, 300); // Debounce to prevent rapid filtering on quick changes
      return () => clearTimeout(handler);
    }
  }, [currentFilters, applyFilters, allProducts.length, loading]);

  // --- Filter Handlers ---

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Logic for Category and Subcategory (updates URL with slug)
    if (name === 'category' || name === 'subCategory') {
        // Convert the clean name (value) to a slug for the URL
        const slug = createSlug(value);
        const current = Object.fromEntries(searchParams.entries());

        const newParams = { ...current };

        if (slug === null) { // If value is 'All'
          delete newParams[name]; // name is 'category' or 'subcategory'
        } else {
          newParams[name] = slug;
        }

        if (name === 'category') {
             // Reset subcategory if the main category changes
             delete newParams.subcategory;
             // If category is set to 'All', ensure subCategory state is 'All' immediately
             if (value === 'All') {
                 setLocalFilters(prev => ({ ...prev, subCategory: 'All' }));
             }
        }

        setSearchParams(newParams);
        return;
    }

    // Logic for other local filters (type, sortBy, searchQuery, minRating)
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    setLocalFilters((prev) => {
      let [min, max] = prev.priceRange;

      if (name === 'minPrice') {
        min = Math.min(numericValue, max); // Ensure min doesn't exceed max
      } else if (name === 'maxPrice') {
        max = Math.max(numericValue, min); // Ensure max doesn't drop below min
      }

      return { ...prev, priceRange: [min, max] };
    });
  };

  const handleCategoryBarSelect = (categoryName) => {
    // Manually construct the event object to reuse handleFilterChange logic
    const mockEvent = {
        target: {
            name: 'category',
            value: categoryName,
        }
    };
    handleFilterChange(mockEvent);
    // Close the filter panel on mobile when selecting from the bar
    if (isFilterPanelOpen) setIsFilterPanelOpen(false);
  };

  const resetFilters = () => {
    // Reset local filters to their initial state
    setLocalFilters((prev) => ({
        type: 'All',
        priceRange: [0, prev.priceRange[1]], // Keep max price from fetch, but min is 0
        minRating: 0,
        searchQuery: '',
        sortBy: 'default',
    }));
    // Clear URL search parameters
    setSearchParams({});
    setIsFilterPanelOpen(false); // Close the filter panel on reset
  };
  
  const closeFilterPanel = () => {
    setIsFilterPanelOpen(false);
  };

  // --- UI Rendering ---

  // Display a clear error message
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center mt-10">
        <p className="text-red-500 font-bold text-xl mb-4">
          Error loading products: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCcw size={16} className="inline mr-2" /> Try Again
        </button>
      </div>
    );
  }
  
  // Display loading state
  if (loading && allProducts.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center mt-20">
        <Loader size={36} className="animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-lg text-gray-700">Loading fresh products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Inline style hack for ToastContainer, replacing the failed CSS import */}
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
        style={{ zIndex: 9999, top: '10px', right: '10px', width: '320px' }} // Basic positioning and width
        toastClassName={() => "bg-white text-gray-900 shadow-lg rounded-lg border border-gray-200 p-3 flex items-center"} // Custom class for toasts
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Fresh Produce & Groceries
        </h1>

        {/* Categories Bar */}
        <div className="mb-8 bg-white p-2 rounded-xl shadow-lg border border-green-100">
          <CategoriesBar
            categories={categories}
            onSelect={handleCategoryBarSelect}
            selectedCategory={currentFilters.category}
          />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filter Panel (Sidebar for large screens, Slide-over for small) */}
          <aside className="lg:w-1/4">
            {/* Toggle button for small screens */}
            <motion.button
              onClick={() => setIsFilterPanelOpen(true)}
              className="lg:hidden w-full bg-green-500 text-white p-3 rounded-lg font-bold flex items-center justify-center mb-6 shadow-lg hover:bg-green-600 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <Filter size={18} className="mr-2" /> Show Filters
            </motion.button>

            {/* Desktop Filter Panel */}
            <div className="hidden lg:block bg-white p-6 rounded-xl shadow-xl border border-gray-100 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                <Filter size={20} className="inline mr-2 text-green-500" /> Filter Products
              </h2>
              <FilterContent
                handleFilterChange={handleFilterChange}
                handlePriceRangeChange={handlePriceRangeChange}
                resetFilters={resetFilters}
                filters={currentFilters}
                allCategories={categories}
                allTypes={allTypes}
                getSubcategoriesForSelectedCategory={getSubcategoriesForSelectedCategory}
                closeFilterPanel={closeFilterPanel} // Pass the closer for mobile but ignore on desktop
              />
            </div>

            {/* Mobile Slide-over Filter Panel */}
            <AnimatePresence>
              {isFilterPanelOpen && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto p-4"
                >
                    <div className="flex justify-between items-center border-b pb-3 mb-4 sticky top-0 bg-white z-10">
                        <h2 className="text-2xl font-bold text-gray-800">
                            <Filter size={24} className="inline mr-2 text-green-500" /> Filters
                        </h2>
                        <button onClick={() => setIsFilterPanelOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="pb-20"> {/* Padding for fixed 'Apply Filters' button */}
                        <FilterContent
                            handleFilterChange={handleFilterChange}
                            handlePriceRangeChange={handlePriceRangeChange}
                            resetFilters={resetFilters}
                            filters={currentFilters}
                            allCategories={categories}
                            allTypes={allTypes}
                            getSubcategoriesForSelectedCategory={getSubcategoriesForSelectedCategory}
                            closeFilterPanel={closeFilterPanel} // Use this to close the panel after applying
                        />
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* Product Grid */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {filteredProducts.length} Results
                {currentFilters.category !== 'All' && ` for "${currentFilters.category}"`}
              </h2>
              {/* Desktop Sort Selector (Hidden on Mobile, already in filter panel) */}
              <div className="hidden lg:flex items-center space-x-2">
                <label htmlFor="sortByDesktop" className="text-sm font-medium text-gray-600">Sort By:</label>
                <select
                  id="sortByDesktop"
                  name="sortBy"
                  value={currentFilters.sortBy}
                  onChange={handleFilterChange}
                  className="p-2 border border-gray-300 rounded-lg bg-white text-sm shadow-sm"
                >
                  <option value="default">Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
                <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10">
                    <Search size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600">No products found matching your filters.</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your price range, category, or search query.</p>
                    <button
                        onClick={resetFilters}
                        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-md"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;