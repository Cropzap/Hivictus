import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
// ---------------------

// Mock toast notification functions to replace 'react-toastify'
const toast = {
  success: (message) => console.log('TOAST SUCCESS:', message),
  error: (message) => console.error('TOAST ERROR:', message),
};

// --- Icons as SVG components ---
const SpinnerIcon = (props) => (
  <svg {...props} className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM48 304c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48zm416 0c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zM142.9 142.9c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm226.3 226.3c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm-226.3 67.9c-18.7 18.7-49.1 18.7-67.9 0s-18.7-49.1 0-67.9s49.1-18.7 67.9 0s18.7 49.1 0 67.9zm226.3-226.3c-18.7 18.7-49.1 18.7-67.9 0s-49.1-18.7 0-67.9s49.1 18.7 67.9 0s18.7 49.1 0 67.9z"/>
  </svg>
);

const StarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 35.7-18.3 54.3l105.7 103-25 145.5c-4.5 26.3 23.2 46.5 46.4 33.7L288 439.6l128.9 68.4c23.2 12.8 50.9-7.1 46.4-33.7l-25-145.5 105.7-103c18.4-18.6 7.9-50.5-18.3-54.3L382 150.2 316.7 17.8c-11.7-24.2-45.5-24.2-57.2 0z"/>
  </svg>
);

const ShoppingCartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path fill="currentColor" d="M96 0C78.4 0 64 14.4 64 32V64H24C10.7 64 0 74.7 0 88s10.7 24 24 24h32v48c0 22.1 17.9 40 40 40h48c22.1 0 40-17.9 40-40v-48h96v48c0 22.1 17.9 40 40 40h48c22.1 0 40-17.9 40-40v-48h32c13.3 0 24-10.7 24-24s-10.7-24-24-24h-32V64h-48v48c0 22.1-17.9 40-40 40h-48c-22.1 0-40-17.9-40-40v-48H96V32c0-17.6-14.4-32-32-32zM384 192v240c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V192H384zm-224 0v240c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V192H160zM320 192v240c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V192H320z"/>
  </svg>
);

const UserCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM256 128c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm96 256h-192c-52.9 0-96-43.1-96-96 0-21.5 7.2-41.4 19.3-57.5 28.5 20.3 62.8 32.5 98.7 32.5h119c35.9 0 70.2-12.2 98.7-32.5 12.1 16.1 19.3 36 19.3 57.5 0 52.9-43.1 96-96 96z"/>
  </svg>
);

// --- PriceUnit Component ---
const PriceUnit = ({ price, unit }) => (
  <p className="font-bold text-gray-900 text-lg">
    ${price?.toFixed(2) || 'N/A'}{unit && <span className="text-sm font-normal text-gray-500"> / {unit}</span>}
  </p>
);

// --- ProductCard Component ---
const ProductCard = ({ product, onAddToCart }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=Product';
  };

  const productId = product._id || product.id; 
const FALLBACK_IMAGE_URL = 'https://placehold.co/400x400/E5E7EB/9CA3AF?text=Product';
  const displayCategory = typeof product.category === 'object' && product.category !== null 
    ? product.category.name || 'Unknown Category' 
    : product.category;

  // **UPDATE 1: Logic to get the first base64 image**
  const firstBase64Image = useMemo(() => {
    // Check if `product.images` exists, is an array, and has at least one element
    if (Array.isArray(product.images) && product.images.length > 0) {
      const base64Data = product.images[0];
      // Check if the data is a string and prepend the data URI header if it's missing
      // Assuming images are commonly JPEG or PNG. You may need to adjust the mime type.
      if (typeof base64Data === 'string' && base64Data.length > 0) {
        // If the string doesn't start with 'data:image', assume it's raw base64 and prepend.
        // It's common for base64 strings from a backend to be just the raw data.
        if (!base64Data.startsWith('data:image')) {
            // Default to 'image/jpeg' or 'image/png'. You may need to check your backend format.
            return `data:image/jpeg;base64,${base64Data}`; 
        }
        return base64Data; // Already correctly formatted data URI
      }
    }
    // Fallback to the product.imageUrl or a placeholder if no valid base64 image is found
    return product.imageUrl || 'https://placehold.co/400x400/50C878/FFFFFF?text=Product';
  }, [product.images, product.imageUrls]);

  const displayImageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : product.imageUrl || FALLBACK_IMAGE_URL;

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col group border border-gray-200 hover:shadow-2xl hover:border-emerald-300 w-52 sm:w-64 flex-shrink-0 h-[380px]"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          {/* **UPDATE 1: Use the calculated base64/URL image source** */}
          <img
            src={displayImageUrl}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 ease-out group-hover:scale-110"
            onError={handleImageError}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow text-xs sm:text-sm">
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1 h-10">
            {product.name}
          </h3>
          <p className="text-gray-500 line-clamp-1 text-xs">
            {displayCategory}
          </p>
          <div className="flex items-end justify-between mt-auto pt-2">
            <PriceUnit price={product.price} unit={product.unit} />
            <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              <span className="mr-1">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
              <StarIcon className="w-3 h-3 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center text-gray-600 mt-1 text-[10px]">
            <UserCircleIcon className="w-3 h-3 mr-1 text-gray-400" />
            <span className="font-medium line-clamp-1">
              Sold by: {product.sellerName || 'Local Vendor'}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <button
          className={`bg-white p-2 rounded-full shadow-md transition-colors duration-200 transform-gpu
            ${product.quantity === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-emerald-600 hover:text-emerald-700 hover:scale-115 active:scale-90'
            }`}
          title={product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          onClick={(e) => {
            // Prevent navigation or other click effects on the card
            e.stopPropagation(); 
            // Call the parent's handler
            onAddToCart(productId);
          }}
          disabled={product.quantity === 0}
        >
          <ShoppingCartIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Main Component: CategoryProductRows ---
const CategoryProductRows = () => {
  const [categoryData, setCategoryData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder for actual auth token (e.g., from context or state)
  const authToken = 'MOCK_AUTH_TOKEN_123'; 

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

      console.log('DEBUG INFO: Successfully Mapped Category Keys (Normalized from /categories):', successfullyMappedCategoryKeys);

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

      if (unmatchedCategories.size > 0) {
          console.warn(
              'DEBUG WARNING: The following product categories (normalized) exist in your products but DID NOT MATCH any category (normalized) fetched from /categories (Check spelling/casing/matching logic or if product.category is an object without a "name" property):', 
              Array.from(unmatchedCategories)
          );
      }
      
      const finalGroupedData = Array.from(categoryMap.values()).filter(g => g.products.length > 0);
      
      setCategoryData(finalGroupedData);
      
      if (finalGroupedData.length === 0) {
         toast.error('No products matched the categories fetched from the backend. Check console for unmatched category names.');
      } else {
         toast.success('Categories and products loaded successfully!');
      }

    } catch (err) {
      console.error('Error during data fetching:', err);
      setError(`Data Loading Error: ${err.message}. Please verify both /categories and /products endpoints are working on ${API_BASE_URL}.`);
      toast.error('Failed to load data. Check backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // **UPDATE 2: Cart Logic Implementation (already mostly correct, but confirming)**
  /**
   * Handler for adding a product to the cart.
   * @param {string} productId - The ID of the product to add.
   */
  const handleAddToCart = async (productId) => {
    // **This is the core Cart Logic:**
    if (!authToken) {
      toast.error('Please log in to add items to your cart.');
      // In a real app, you would navigate the user to the login page here.
      return;
    }
    
    let productName = 'Product';
    for (const group of categoryData) {
        const product = group.products.find(p => (p._id || p.id) === productId);
        if (product) {
            productName = product.name;
            break;
        }
    }

    try {
      // **API Call to add the product to the cart**
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming an Authorization header with a Bearer token is needed
          'Authorization': `Bearer ${authToken}`, 
        },
        body: JSON.stringify({ productId, quantity: 1 }), // Adds one unit of the product
      });

      if (!response.ok) {
        let errorData = { message: `Failed to add ${productName} to cart. Status: ${response.status}` };
        try {
          errorData = await response.json();
        } catch (e) {
          // Response was not JSON, use the default error message
        }
        
        if (response.status === 401) {
            toast.error('Session expired. Please log in again.');
        } else {
            // Throw a general error to be caught below
            throw new Error(errorData.message || 'Unknown server error.');
        }
      }

      // Success notification
      toast.success(`${productName} added to cart successfully!`);
      console.log(`Product ID ${productId} added to cart.`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(`Failed to add to cart: ${err.message}`);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 py-20 bg-gray-50">
        <SpinnerIcon className="animate-spin text-emerald-600 w-10 h-10 mr-3" />
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
        <p className="text-gray-600 text-lg">No product categories with items were found after matching. **Check your browser console** for a `DEBUG WARNING` which lists categories that did not match.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative z-0 bg-gray-50 py-10 sm:py-12 px-0 font-sans min-h-screen">
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

          {/* Horizontal Scrolling Product Row */}
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
            <div className="w-4 flex-shrink-0"></div> 
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryProductRows;