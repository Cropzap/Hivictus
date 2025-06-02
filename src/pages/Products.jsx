import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaShoppingCart, FaHeart, FaFilter, FaRedo, FaSearch
} from 'react-icons/fa'; // Added FaFilter, FaRedo, FaSearch

// Dummy Product Data
const productsData = [
  {
    id: 'p1',
    name: 'Elegant Smartwatch X1',
    category: 'Electronics',
    price: 249.99,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A stylish smartwatch with advanced health tracking and smart notifications.',
  },
  {
    id: 'p2',
    name: 'Wireless Bluetooth Headphone',
    category: 'Electronics',
    price: 99.99,
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06fce5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Immersive sound experience with comfortable earcups and long battery life.',
  },
  {
    id: 'p3',
    name: 'Premium Leather Wallet',
    category: 'Accessories',
    price: 59.99,
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1620625515037-de2a66b6c2d1?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Crafted from genuine leather, offering durability and a classic look.',
  },
  {
    id: 'p4',
    name: 'Organic Cotton T-Shirt',
    category: 'Apparel',
    price: 29.99,
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1576566529712-4f36a57c5a08?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Soft, breathable, and sustainably sourced for everyday comfort.',
  },
  {
    id: 'p5',
    name: 'Modern Ergonomic Chair',
    category: 'Home & Office',
    price: 399.99,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1594027419139-2d2c206f654b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Designed for ultimate comfort and support during long working hours.',
  },
    {
    id: 'p6',
    name: 'Digital Camera Pro',
    category: 'Electronics',
    price: 799.99,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1510125424754-0b704c35b84c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Capture stunning photos and videos with professional-grade features.',
  },
  {
    id: 'p7',
    name: 'Classic Denim Jeans',
    category: 'Apparel',
    price: 69.99,
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1602293589930-45734e534063?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D',
    description: 'Timeless style and comfortable fit for any casual occasion.',
  },
  {
    id: 'p8',
    name: 'Portable Espresso Maker',
    category: 'Kitchen',
    price: 129.99,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1621376914561-11e2f750b3f5?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Enjoy rich, delicious espresso on the go with this compact device.',
  },
  {
    id: 'p9',
    name: 'Fitness Tracker Band',
    category: 'Electronics',
    price: 79.99,
    rating: 3.9,
    imageUrl: 'https://images.unsplash.com/photo-1579586326799-a1d2e153094c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Monitor your steps, heart rate, and sleep for a healthier lifestyle.',
  },
  {
    id: 'p10',
    name: 'Gourmet Chocolate Box',
    category: 'Food & Groceries',
    price: 34.99,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1627889396116-24f4e7c7a536?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A delightful assortment of artisanal chocolates, perfect for gifting.',
  },
  {
    id: 'p11',
    name: 'Silk Scarf',
    category: 'Accessories',
    price: 45.00,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1590623351336-b67f6b92f72e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Luxurious silk scarf, soft to the touch and adds a touch of elegance.',
  },
  {
    id: 'p12',
    name: 'Gaming Mouse',
    category: 'Electronics',
    price: 55.00,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1616400030256-5509a25031b2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Precision gaming mouse with customizable RGB lighting and ergonomic design.',
  },
];

// Star Rendering
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300" />);
  }
  return <div className="flex text-sm">{stars}</div>;
};

// Product Card UI
const ProductCard = ({ product }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
          <img src={product.imageUrl} alt={product.name} className="object-contain h-full w-full" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.description}</p>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-orange-600 font-bold text-lg">${product.price.toFixed(2)}</span>
            {renderStars(product.rating)}
          </div>
        </div>
      </Link>
      {/* Cart and Wishlist Buttons */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaShoppingCart className="text-gray-700" />
        </button>
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaHeart className="text-red-500" />
        </button>
      </div>
    </motion.div>
  );
};

// Main Products Component
const Products = () => {
  const allCategories = ['All', ...new Set(productsData.map(p => p.category))];
  const allRatings = [5, 4, 3]; // For '4 Stars & Up', '3 Stars & Up'

  const [filters, setFilters] = useState({
    category: 'All',
    priceRange: [0, 1000], // Example max price
    minRating: 0,
    searchQuery: '',
    sortBy: 'default', // 'price-asc', 'price-desc', 'rating-desc'
  });

  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // State for mobile filter panel

  useEffect(() => {
    let temp = [...productsData];

    // Category Filter
    if (filters.category !== 'All') {
      temp = temp.filter(p => p.category === filters.category);
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
        p.category.toLowerCase().includes(q)
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
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minRating' ? parseFloat(value) : value,
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
      return { ...prev, priceRange: newPriceRange };
    });
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      priceRange: [0, 1000],
      minRating: 0,
      searchQuery: '',
      sortBy: 'default',
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Products</h1>

      {/* Filter Button for Mobile (hidden on md and larger) */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-orange-600 transition-colors duration-300"
        >
          <FaFilter className="mr-2" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Section - Responsive */}
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
            fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto
            md:block md:relative md:w-1/4 md:min-w-[250px] md:h-auto md:shadow-none md:p-0
          `}
        >
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
            <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-600 text-3xl">
              &times;
            </button>
          </div>
          {/* Content of the filter panel */}
          <div className="md:block">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">Filters</h2>

            {/* Search Input */}
            <div className="mb-6">
              <label htmlFor="searchQuery" className="block text-gray-700 text-sm font-semibold mb-2">Search Products</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchQuery"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search by name, category..."
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="All">All Categories</option>
                {allCategories.slice(1).map(cat => ( // slice(1) to avoid duplicate 'All' if it's already in the data
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.priceRange[0]}
                  onChange={handlePriceRangeChange}
                  placeholder="Min"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.priceRange[1]}
                  onChange={handlePriceRangeChange}
                  placeholder="Max"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 block">Current range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label htmlFor="minRating" className="block text-gray-700 text-sm font-semibold mb-2">Minimum Rating</label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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
              className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-center
                         shadow-sm hover:bg-gray-300 transition-colors duration-300 font-semibold"
            >
              <FaRedo className="mr-2" /> Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <section className="flex-1"> {/* Changed from div to section for semantic HTML */}
          {filteredProducts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-600 text-lg mt-10"
            >
              No products found matching your criteria. Try adjusting your filters.
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