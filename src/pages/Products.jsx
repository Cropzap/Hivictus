import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaShoppingCart, FaFilter, FaRedo, FaSearch, FaTimes
} from 'react-icons/fa';
import { Loader } from 'lucide-react'; // For loading indicator

// Star Rendering Component - Improved for professional look
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />); // Brighter yellow
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    else stars.push(<FaRegStar key={i} className="text-gray-400" />); // Slightly darker gray for contrast
  }
  return <div className="flex text-xs sm:text-sm gap-0.5">{stars}</div>; // Added gap for spacing
};

// Product Card UI Component - Significantly improved UI and spacing
const ProductCard = ({ product, showToastMessage }) => { // Accept showToastMessage prop
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);

  // Fetch auth token from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

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
    tap: { scale: 0.98 },
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product details page
    e.stopPropagation(); // Stop event propagation to the Link

    if (!authToken) {
      showToastMessage('Please log in to add items to cart.', 'error');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'x-auth-token': authToken, // Send the auth token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }), // Add 1 quantity by default
      });

      if (!response.ok) {
        if (response.status === 401) {
          showToastMessage('Session expired. Please log in again.', 'error');
          localStorage.removeItem('authToken'); // Clear invalid token
          localStorage.removeItem('userData');
          navigate('/login'); // Redirect to login
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      }

      showToastMessage(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart from ProductCard:", err);
      showToastMessage(`Failed to add to cart: ${err.message}`, 'error');
    }
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col border border-gray-100 group" // Added group for outer card hover effects
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        <div className="relative w-full h-40 sm:h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl || 'https://placehold.co/400x400/E0E0E0/333333?text=Product'} // Fallback for image
            alt={product.name}
            className="object-cover h-full w-full transition-transform duration-300 ease-out group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/E0E0E0/333333?text=Product'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-grow"> {/* Increased padding slightly */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2 mb-1.5"> {/* Adjusted mb */}
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2.5"> {/* Adjusted mb */}
            {product.category?.name} &bull; {product.subCategory} &bull; {product.type}
          </p>
          {/* <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p> */}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <span className="text-lg sm:text-xl text-green-700 font-bold">₹{product.price.toFixed(2)} / {product.unit}</span>
            {/* Rating Display - New Curvy Design */}
            <div className="flex items-center bg-lime-100 text-lime-800 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
              <span className="mr-1">{product.rating.toFixed(1)}</span>
              {renderStars(product.rating)}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2"> {/* Maintained mt */}
            {product.quantity > 0 ? (
              <p className="text-sm text-gray-500 font-medium">In Stock: <span className="text-green-600">{product.quantity}</span></p>
            ) : (
              <p className="text-sm text-red-500 font-semibold">Out of Stock</p>
            )}
            <p className="text-xs text-gray-700 font-bold">Sold by: {product.sellerName}</p>
          </div>
        </div>
      </Link>
      {/* Cart Button */}
      <div className="absolute top-3 right-3">
        <motion.button
          className={`bg-white p-2.5 rounded-full shadow-lg transition-colors duration-200
                      ${product.quantity === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-green-100 text-green-600 hover:text-green-700'}`}
          title={product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          <FaShoppingCart className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Common Filter UI Component (reused for both desktop and mobile)
const FilterContent = ({ handleFilterChange, handlePriceRangeChange, resetFilters, filters, allCategories, allTypes, allRatings, getSubcategoriesForSelectedCategory }) => (
  <>
    {/* Search Input */}
    <div className="mb-6 border-b border-gray-200 pb-6">
      <label htmlFor="searchQuery" className="block text-gray-700 text-sm font-semibold mb-2">Search Products</label>
      <div className="relative">
        <input
          type="text"
          id="searchQuery"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          placeholder="e.g., tomato, organic, apple"
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    {/* Category Filter */}
    <div className="mb-6 border-b border-gray-200 pb-6">
      <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
      <select
        id="category"
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
      >
        {allCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    {/* SubCategory Filter (Conditional based on selected Category) */}
    {filters.category !== 'All' && (
      <div className="mb-6 border-b border-gray-200 pb-6">
        <label htmlFor="subCategory" className="block text-gray-700 text-sm font-semibold mb-2">Subcategory</label>
        <select
          id="subCategory"
          name="subCategory"
          value={filters.subCategory}
          onChange={handleFilterChange}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
        >
          {getSubcategoriesForSelectedCategory().map(subCat => (
            <option key={subCat} value={subCat}>{subCat}</option>
          ))}
        </select>
      </div>
    )}

    {/* Type Filter (Organic/Conventional) */}
    <div className="mb-6 border-b border-gray-200 pb-6">
      <label htmlFor="type" className="block text-gray-700 text-sm font-semibold mb-2">Produce Type</label>
      <select
        id="type"
        name="type"
        value={filters.type}
        onChange={handleFilterChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
      >
        {allTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Price Range Filter */}
    <div className="mb-6 border-b border-gray-200 pb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">Price Range (per unit)</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="minPrice"
          value={filters.priceRange[0]}
          onChange={handlePriceRangeChange}
          placeholder="Min"
          step="0.01"
          min="0"
          max="100"
          className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          name="maxPrice"
          value={filters.priceRange[1]}
          onChange={handlePriceRangeChange}
          placeholder="Max"
          step="0.01"
          min="0"
          max="100"
          className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
        />
      </div>
      <span className="text-xs text-gray-500 mt-2 block">
        ₹{filters.priceRange[0].toFixed(2)} - ₹{filters.priceRange[1].toFixed(2)}
      </span>
    </div>

    {/* Rating Filter */}
    <div className="mb-6 border-b border-gray-200 pb-6">
      <label htmlFor="minRating" className="block text-gray-700 text-sm font-semibold mb-2">Minimum Rating</label>
      <select
        id="minRating"
        name="minRating"
        value={filters.minRating}
        onChange={handleFilterChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
      >
        <option value={0}>Any Rating</option>
        {allRatings.map(rating => (
          <option key={rating} value={rating}>{rating} Stars & Up</option>
        ))}
      </select>
    </div>

    {/* Sort By */}
    <div className="mb-8">
      <label htmlFor="sortBy" className="block text-gray-700 text-sm font-semibold mb-2">Sort By</label>
      <select
        id="sortBy"
        name="sortBy"
        value={filters.sortBy}
        onChange={handleFilterChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-800"
      >
        <option value="default">Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Rating: High to Low</option>
      </select>
    </div>

    {/* Reset Filters Button */}
    <button
      onClick={resetFilters}
      className="w-full bg-lime-100 text-lime-700 px-4 py-3 rounded-lg flex items-center justify-center
                 shadow-sm hover:bg-lime-200 transition-colors duration-300 font-semibold border border-lime-300"
    >
      <FaRedo className="mr-2" /> Reset Filters
    </button>
  </>
);

// Main Products Component
const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allCategories, setAllCategories] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const allRatings = [5, 4, 3];

  const [filters, setFilters] = useState({
    category: 'All',
    subCategory: 'All',
    type: 'All',
    priceRange: [0, 100],
    minRating: 0,
    searchQuery: '',
    sortBy: 'default',
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);


  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Add dummy sellerName and rating for UI purposes if not present
        const productsWithDummyData = data.map(p => ({
          ...p,
          sellerName: p.sellerId?.companyName || p.sellerId?.contactPerson || 'Unknown Seller',
          rating: p.rating !== undefined ? p.rating : parseFloat((Math.random() * 5).toFixed(1)), // Add dummy rating if missing
        }));

        setAllProducts(productsWithDummyData);
        setFilteredProducts(productsWithDummyData);

        const uniqueCategories = ['All', ...new Set(productsWithDummyData.map(p => p.category?.name).filter(Boolean))];
        const uniqueTypes = ['All', ...new Set(productsWithDummyData.map(p => p.type).filter(Boolean))];
        setAllCategories(uniqueCategories);
        setAllTypes(uniqueTypes);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const applyFilters = useCallback(() => {
    let temp = [...allProducts];

    if (filters.category !== 'All') {
      temp = temp.filter(p => p.category?.name === filters.category);
    }

    if (filters.subCategory !== 'All') {
      temp = temp.filter(p => p.subCategory === filters.subCategory);
    }

    if (filters.type !== 'All') {
      temp = temp.filter(p => p.type === filters.type);
    }

    temp = temp.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      temp = temp.filter(p => p.rating >= filters.minRating);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q)
      );
    }

    switch (filters.sortBy) {
      case 'price-asc': temp.sort((a, b) => a.price - b.price); break;
      case 'price-desc': temp.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': temp.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    setFilteredProducts(temp);
  }, [allProducts, filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, applyFilters]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: (name === 'minRating' || name === 'minPrice' || name === 'maxPrice') ? parseFloat(value) : value,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newPriceRange = [...prev.priceRange];
      if (name === 'minPrice') {
        newPriceRange[0] = parseFloat(value);
      } else {
        newPriceRange[1] = parseFloat(value);
      }
      if (newPriceRange[0] > newPriceRange[1]) {
        if (name === 'minPrice') newPriceRange[1] = newPriceRange[0];
        else newPriceRange[0] = newPriceRange[1];
      }
      return { ...prev, priceRange: newPriceRange };
    });
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      subCategory: 'All',
      type: 'All',
      priceRange: [0, 100],
      minRating: 0,
      searchQuery: '',
      sortBy: 'default',
    });
  };

  const getSubcategoriesForSelectedCategory = () => {
    if (filters.category === 'All') return ['All'];
    const productsInSelectedCat = allProducts.filter(p => p.category?.name === filters.category);
    const uniqueSubcategories = [...new Set(productsInSelectedCat.map(p => p.subCategory).filter(Boolean))];
    return ['All', ...uniqueSubcategories];
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
        <p className="ml-4 text-lg text-gray-700">Harvesting fresh products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-red-600 bg-gradient-to-br from-red-50 to-orange-100">
        <FaTimes size={48} className="mb-4" />
        <p className="text-lg font-semibold">Error loading products: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Please ensure your backend is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen
                  bg-green-50 shadow-inner
                  bg-[url('data:image/svg+xml,%3Csvg width=\'18\' height=\'18\' viewBox=\'0 0 18 18\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d9f99d\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h9v3H0V0zm0 6h9v3H0V6zm0 12h9v3H0V12zM9 0h9v3H9V0zm0 6h9v3H9V6zm0 12h9v3H9V12z\'/%3E%3C/g%3E%3C/svg%3E')]
                  bg-repeat bg-center relative">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair-display text-gray-900
                 relative inline-block px-4 py-2 leading-tight
                 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2/3 after:h-1.5 after:bg-lime-500 after:rounded-full after:transition-all after:duration-300
                 hover:after:w-full hover:after:bg-lime-600">
            Fresh From The Farm
          </h1>
        </div>

        {/* Filter Button for Mobile (hidden on lg and larger) */}
        <div className="flex justify-end mb-4 lg:hidden">
          <button
            onClick={() => setIsFilterPanelOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors duration-300"
          >
            <FaFilter className="mr-2" /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Mobile Filter Sidebar with Overlay */}
          <AnimatePresence>
            {isFilterPanelOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => setIsFilterPanelOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="fixed top-0 left-0 w-72 h-full bg-white/90 backdrop-blur-md shadow-xl p-6 z-50 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Shop Filters</h2>
                    <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-600 text-3xl hover:text-gray-900">
                      <FaTimes />
                    </button>
                  </div>
                  <FilterContent
                    handleFilterChange={handleFilterChange}
                    handlePriceRangeChange={handlePriceRangeChange}
                    resetFilters={resetFilters}
                    filters={filters}
                    allCategories={allCategories}
                    allTypes={allTypes}
                    allRatings={allRatings}
                    getSubcategoriesForSelectedCategory={getSubcategoriesForSelectedCategory}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Filter Section (Always visible on lg and up) */}
          <div className="hidden lg:block lg:w-1/4 lg:min-w-[280px] lg:max-w-[300px] lg:flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop Filters</h2>
              <FilterContent
                handleFilterChange={handleFilterChange}
                handlePriceRangeChange={handlePriceRangeChange}
                resetFilters={resetFilters}
                filters={filters}
                allCategories={allCategories}
                allTypes={allTypes}
                allRatings={allRatings}
                getSubcategoriesForSelectedCategory={getSubcategoriesForSelectedCategory}
              />
            </div>
          </div>

          {/* Product Grid */}
          <section className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-600 text-lg mt-10"
              >
                No fresh produce found matching your criteria. Try adjusting your filters.
              </motion.p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} showToastMessage={showToastMessage} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg text-sm sm:text-base z-50 flex items-center space-x-2`}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
              exit: { opacity: 0, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {toastType === 'success' ? <CheckCircle size={18} /> : <FaTimes size={18} />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;