import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaShoppingCart, FaHeart, FaFilter, FaRedo, FaSearch, FaTimes // Added FaTimes for close button
} from 'react-icons/fa';

// --- NEW DUMMY AGRICULTURE PRODUCT DATA ---
const agricultureProductsData = [
  {
    id: 'ag1',
    name: 'Fresh Organic Tomatoes',
    category: 'Vegetables',
    type: 'Organic',
    price: 3.49, // per kg
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1549060273-ed83e155e81d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Vine-ripened organic tomatoes, perfect for salads, sauces, and sandwiches.',
    unit: 'kg'
  },
  {
    id: 'ag2',
    name: 'Crisp Green Apples',
    category: 'Fruits',
    type: 'Conventional',
    price: 2.99, // per kg
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1579613832111-c91712a1df67?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sweet and tart green apples, excellent for snacking or baking.',
    unit: 'kg'
  },
  {
    id: 'ag3',
    name: 'Farm Fresh Potatoes',
    category: 'Vegetables',
    type: 'Conventional',
    price: 1.89, // per kg
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1590117469796-cf9dd099687e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Versatile potatoes, ideal for mashing, roasting, or frying.',
    unit: 'kg'
  },
  {
    id: 'ag4',
    name: 'Sweet Oranges',
    category: 'Fruits',
    type: 'Organic',
    price: 3.29, // per kg
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1596773273185-c576571587ba?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Juicy and sweet oranges, packed with Vitamin C.',
    unit: 'kg'
  },
  {
    id: 'ag5',
    name: 'Leafy Green Spinach',
    category: 'Vegetables',
    type: 'Organic',
    price: 2.19, // per bunch
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1628172905391-4e41e57c6b45?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fresh spinach, great for healthy smoothies, salads, or cooking.',
    unit: 'bunch'
  },
  {
    id: 'ag6',
    name: 'Red Grapes',
    category: 'Fruits',
    type: 'Conventional',
    price: 4.79, // per kg
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1560064239-652f1b80c5fe?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sweet and succulent red grapes, perfect for snacking or desserts.',
    unit: 'kg'
  },
  {
    id: 'ag7',
    name: 'Fresh Carrots',
    category: 'Vegetables',
    type: 'Conventional',
    price: 1.59, // per kg
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1590176843477-d67b2d2f7035?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Crunchy carrots, excellent for juicing, salads, or cooking.',
    unit: 'kg'
  },
  {
    id: 'ag8',
    name: 'Ripe Bananas',
    category: 'Fruits',
    type: 'Organic',
    price: 1.29, // per kg
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1574226500587-2ee54f38e658?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Naturally sweet and energy-rich bananas, great for any time of day.',
    unit: 'kg'
  },
  {
    id: 'ag9',
    name: 'Sweet Corn',
    category: 'Vegetables',
    type: 'Conventional',
    price: 0.89, // per piece
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1621576402095-236b28011c77?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fresh sweet corn on the cob, delicious grilled or boiled.',
    unit: 'piece'
  },
  {
    id: 'ag10',
    name: 'Avocados',
    category: 'Fruits',
    type: 'Organic',
    price: 5.99, // per piece
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1558231920-8041c2c3666d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Creamy and nutritious avocados, perfect for guacamole or toast.',
    unit: 'piece'
  },
];

// Star Rendering (No change)
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300" />);
  }
  return <div className="flex text-sm">{stars}</div>;
};

// Product Card UI (Minor adjustments for agricultural products)
const ProductCard = ({ product }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    hover: {
      scale: 1.03, // Slightly less scale for more subtle effect
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-1">{product.category} &bull; {product.type}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-green-700 font-bold text-lg">${product.price.toFixed(2)} / {product.unit}</span>
            {renderStars(product.rating)}
          </div>
        </div>
      </Link>
      {/* Cart and Wishlist Buttons */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-green-100 text-green-600 transition-colors duration-200" title="Add to Cart">
          <FaShoppingCart className="w-4 h-4" />
        </button>
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-100 text-red-500 transition-colors duration-200" title="Add to Wishlist">
          <FaHeart className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Main Products Component
const Products = () => {
  const allCategories = ['All', ...new Set(agricultureProductsData.map(p => p.category))];
  const allTypes = ['All', ...new Set(agricultureProductsData.map(p => p.type))]; // New filter option
  const allRatings = [5, 4, 3]; // For '4 Stars & Up', '3 Stars & Up'

  const [filters, setFilters] = useState({
    category: 'All',
    type: 'All', // New filter state
    priceRange: [0, 10], // Adjusted max price for agriculture products
    minRating: 0,
    searchQuery: '',
    sortBy: 'default',
  });

  const [filteredProducts, setFilteredProducts] = useState(agricultureProductsData);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // State for mobile filter panel

  // Debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters();
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [filters.searchQuery]);


  // Apply filters whenever filter state changes (except search query)
  useEffect(() => {
    if (filters.searchQuery) return; // Let debounce handle search
    applyFilters();
  }, [filters.category, filters.type, filters.priceRange, filters.minRating, filters.sortBy]);


  const applyFilters = () => {
    let temp = [...agricultureProductsData];

    // Category Filter
    if (filters.category !== 'All') {
      temp = temp.filter(p => p.category === filters.category);
    }

    // Type Filter (Organic/Conventional)
    if (filters.type !== 'All') {
      temp = temp.filter(p => p.type === filters.type);
    }

    // Price Range Filter
    temp = temp.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Minimum Rating Filter
    if (filters.minRating > 0) {
      temp = temp.filter(p => p.rating >= filters.minRating);
    }

    // Search Query Filter
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) // Search by type as well
      );
    }

    // Sort By
    switch (filters.sortBy) {
      case 'price-asc': temp.sort((a, b) => a.price - b.price); break;
      case 'price-desc': temp.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': temp.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    setFilteredProducts(temp);
  };

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
      } else { // name === 'maxPrice'
        newPriceRange[1] = parseFloat(value);
      }
      // Ensure min is not greater than max, and vice-versa
      if (newPriceRange[0] > newPriceRange[1]) {
        // Swap if min exceeds max, or set max to min if max is updated to be less than min
        if (name === 'minPrice') newPriceRange[1] = newPriceRange[0];
        else newPriceRange[0] = newPriceRange[1];
      }
      return { ...prev, priceRange: newPriceRange };
    });
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      type: 'All',
      priceRange: [0, 10], // Reset to agriculture specific max price
      minRating: 0,
      searchQuery: '',
      sortBy: 'default',
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-16 bg-gray-50 min-h-screen">
<div className="text-center mb-8"> {/* This div now centers the inline-block h1 */}
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair-display text-gray-900
               relative inline-block px-4 py-2 leading-tight
               after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2/3 after:h-1.5 after:bg-green-500 after:rounded-full after:transition-all after:duration-300
               hover:after:w-full hover:after:bg-green-600">
    Fresh From The Farm
  </h1>
</div>

      {/* Filter Button for Mobile (hidden on lg and larger) */}
      <div className=" flex justify-end mb-4">
        <button
          onClick={() => setIsFilterPanelOpen(true)} // Open on click
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors duration-300"
        >
          <FaFilter className="mr-2" /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Section - Responsive & Attractive */}
        <motion.div
          initial={false}
          animate={isFilterPanelOpen ? "open" : "closed"}
          variants={{
            open: { x: 0, opacity: 1, display: 'block' },
            closed: { x: '-100%', opacity: 0, transitionEnd: { display: 'none' } },
          }}
          transition={{ duration: 0.3 }}
          className={`
            ${isFilterPanelOpen ? 'block' : 'hidden'}
            fixed top-0 left-0 w-72 h-full bg-white shadow-xl p-6 z-50 overflow-y-auto
            lg:block lg:relative lg:w-1/4 lg:min-w-[280px] lg:h-auto lg:shadow-none lg:p-0
            lg:bg-transparent
          `}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg"> {/* Inner container for desktop styling */}
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Shop Filters</h2>
              <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-600 text-3xl lg:hidden hover:text-gray-900">
                <FaTimes />
              </button>
            </div>

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
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
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
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
              >
                <option value="All">All Categories</option>
                {allCategories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Type Filter (Organic/Conventional) */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <label htmlFor="type" className="block text-gray-700 text-sm font-semibold mb-2">Produce Type</label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
              >
                <option value="All">All Types</option>
                {allTypes.slice(1).map(type => (
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
                  max="100" // Set a reasonable max for agriculture prices
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
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
                  max="100" // Set a reasonable max for agriculture prices
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
                />
              </div>
              <span className="text-xs text-gray-500 mt-2 block">
                ${filters.priceRange[0].toFixed(2)} - ${filters.priceRange[1].toFixed(2)}
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
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
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
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800"
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
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-center
                         shadow-sm hover:bg-gray-200 transition-colors duration-300 font-semibold border border-gray-300"
            >
              <FaRedo className="mr-2" /> Reset Filters
            </button>
          </div>
        </motion.div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;