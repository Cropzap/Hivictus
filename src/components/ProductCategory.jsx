import React, { useState, useEffect, useCallback } from 'react';
// Note: useNavigate and Link are kept for context, but require a running router environment to function fully.
import { useNavigate, Link } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader, Package, Info, ShoppingBag } from 'lucide-react';

// --- Utility Components ---
const API_URL = import.meta.env.VITE_API_URL;
/**
 * Renders an individual subcategory item in the right panel.
 */
const SubCategoryItem = ({ subcategory, onClick, mainCategorySlug }) => {
  // Use a fallback for _id if it's missing (though a real backend should provide one)
  const key = subcategory._id || subcategory.name; 
  const subCategorySlug = subcategory.name.toLowerCase().replace(/\s/g, '-');
  // Mock link path
  const linkTo = `/products?category=${mainCategorySlug}&subcategory=${subCategorySlug}`;

  return (
    <motion.div
      key={key}
      className="flex flex-col items-center p-4 rounded-2xl cursor-pointer bg-white transition-all duration-300 border border-gray-200 transform hover:scale-[1.05] hover:shadow-xl shadow-md"
      onClick={() => onClick(subcategory)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-green-50 border-4 border-green-300/50">
        <img
          src={subcategory.image || 'https://placehold.co/80x80/E0E0E0/333333?text=Sub'}
          alt={subcategory.name}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/E0E0E0/333333?text=${encodeURIComponent(subcategory.name.charAt(0))}`; }}
        />
      </div>
      <p className="text-center text-base font-bold text-gray-800 mt-3 leading-tight truncate w-full px-1">
        {subcategory.name}
      </p>
      <Link 
        to={linkTo} 
        className="mt-2 flex items-center text-sm font-semibold text-green-600 hover:text-green-800 transition-colors"
        onClick={(e) => { e.stopPropagation(); onClick(subcategory); }}
      >
        Explore <ChevronRight size={16} className="ml-1" />
      </Link>
    </motion.div>
  );
};

// --- Main Category Card with Navigation and Animation ---
const MainCategoryCard = ({ category, categoryIndex, totalCategories, onNavigate }) => {
    
  // Framer Motion variants for the slide animation
  const categoryVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: { 
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { 
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence initial={false} custom={onNavigate.direction}>
        <motion.div
          key={category._id}
          custom={onNavigate.direction}
          variants={categoryVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          {/* Background Image */}
          <img
            src={category.mainImage || 'https://placehold.co/800x600/508D4E/FFFFFF?text=Category'}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Dark Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start justify-end h-full p-8 text-white">
            <p className="text-sm font-semibold tracking-widest uppercase text-green-300 mb-1 backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded">
                Category {categoryIndex + 1} of {totalCategories}
            </p>
            {/* Reduced heading size: text-4xl sm:text-5xl -> text-3xl sm:text-4xl */}
            <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-lg">
              {category.name}
            </h3>
            <p className="text-lg font-medium mt-2 drop-shadow-md">
              {category.subcategories ? category.subcategories.length : 0} Sub-categories ready for harvest.
            </p>
            <Link
                to={`/products?category=${category.name.toLowerCase().replace(/\s/g, '-')}`}
                className="mt-6 flex items-center px-8 py-3 bg-green-500 text-white rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:scale-[1.02]"
            >
                <ShoppingBag size={20} className="mr-2" /> View All Products
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Buttons */}
      <motion.button
        onClick={() => onNavigate(-1)}
        disabled={categoryIndex === 0}
        className="absolute left-4 top-1/2 z-20 transform -translate-y-1/2 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-xl text-green-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-green-800 active:scale-90"
        aria-label="Previous Category"
        whileHover={{ scale: 1.1 }}
      >
        <ChevronLeft size={30} />
      </motion.button>
      
      <motion.button
        onClick={() => onNavigate(1)}
        disabled={categoryIndex === totalCategories - 1}
        className="absolute right-4 top-1/2 z-20 transform -translate-y-1/2 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-xl text-green-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-green-800 active:scale-90"
        aria-label="Next Category"
        whileHover={{ scale: 1.1 }}
      >
        <ChevronRight size={30} />
      </motion.button>
    </div>
  );
};


// --- Main Category Explorer Component ---
const FullWidthCategoryExplorer = () => {
  // navigate is kept for context, replace with actual router implementation if needed
  const navigate = console.log; 
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  /**
   * Fetches category data from the backend API.
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/categories`);
      
      if (!response.ok) {
        // Log the response status and throw an error for non-2xx statuses
        throw new Error(`Failed to fetch categories. HTTP Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
        // Handle case where fetch succeeds but returns empty/invalid data
        setCategories([]);
        setError("Received empty or invalid category data from the server."); 
      }
      
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Set a user-friendly error message
      setError(`Connection Error: Could not connect to the backend (http://localhost:5000/api/categories).`);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reset index if categories change (e.g., successful fetch after an error)
  useEffect(() => {
    if (categories.length > 0 && categoryIndex >= categories.length) {
        setCategoryIndex(0);
    }
  }, [categories, categoryIndex]);


  // --- Handlers ---
  const handleCategoryNavigation = (newDirection) => {
    setDirection(newDirection);
    setCategoryIndex(prevIndex => {
      const newIndex = prevIndex + newDirection;
      if (newIndex >= 0 && newIndex < categories.length) {
        return newIndex;
      }
      return prevIndex;
    });
  };

  const handleSelectSubCategory = (subCategory) => {
    const selectedCategory = categories[categoryIndex];
    if (selectedCategory) {
      const mainCategorySlug = selectedCategory.name.toLowerCase().replace(/\s/g, '-');
      const subCategorySlug = subCategory.name.toLowerCase().replace(/\s/g, '-');
      // Replace with actual React Router navigation if available
      console.log(`Navigating to: /products?category=${mainCategorySlug}&subcategory=${subCategorySlug}`);
      // navigate(`/products?category=${mainCategorySlug}&subcategory=${subCategorySlug}`);
    }
  };

  const currentCategory = categories[categoryIndex];
  const currentSubcategories = currentCategory ? currentCategory.subcategories : [];
  const mainCategorySlug = currentCategory ? currentCategory.name.toLowerCase().replace(/\s/g, '-') : '';

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="w-full min-h-[600px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-white">
        <Loader className="animate-spin text-green-600" size={48} />
        <p className="ml-4 text-lg text-gray-700 mt-4 font-medium">Connecting to the farm...</p>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="w-full min-h-[600px] flex flex-col items-center justify-center p-8 text-red-600 bg-gradient-to-br from-red-50 to-orange-100 rounded-3xl shadow-xl max-w-[1400px] mx-auto my-16">
        <Info size={48} className="mb-4" />
        <p className="text-xl font-semibold">Data Loading Failed</p>
        <p className="text-md text-gray-700 mt-2 text-center max-w-lg">
            {error || "The server returned no categories. Please ensure your backend is running on `http://localhost:5000` and serving the `/api/categories` endpoint correctly."}
        </p>
        <button 
            onClick={fetchCategories}
            className="mt-6 px-8 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg"
        >
            Try Fetching Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-white min-h-screen py-16 font-sans">
      {/* Removed max-w-[1400px] mx-auto for full width, kept padding */}
      <div className="w-full p-4 sm:p-6 lg:p-8">
        {/* Reduced heading size: text-4xl sm:text-5xl -> text-3xl sm:text-4xl */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-green-800">
          Explore Our Organic Selections
        </h1>
        <p className="text-xl text-center text-gray-500 mb-12">
          Find exactly what you need, from farm to table.
        </p>
        
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] overflow-hidden border border-green-200/50 min-h-[600px]">
          
          {/* --- LEFT PANEL: Single Main Category Card with Carousel --- */}
<div className="w-full lg:w-1/3 bg-gray-50 relative min-h-[250px] lg:min-h-full flex justify-center items-center p-4 overflow-visible">
  <MainCategoryCard 
    category={currentCategory}
    categoryIndex={categoryIndex}
    totalCategories={categories.length}
    onNavigate={handleCategoryNavigation}
  />
</div>



          {/* --- RIGHT PANEL: Subcategory Grid --- */}
          <div className="w-full lg:w-2/3 p-6 sm:p-10 bg-white overflow-y-auto max-h-[600px] lg:max-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory._id + "content"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-green-100 pb-4 mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
                    <span className="text-green-600">Sub-categories</span> for {currentCategory.name}
                  </h2>
                  <Link 
                    to={`/products?category=${mainCategorySlug}`} 
                    className="flex items-center text-md font-semibold text-gray-500 hover:text-green-600 transition-colors"
                  >
                    All {currentCategory.name} <ChevronRight size={18} className="ml-1" />
                  </Link>
                </div>

                {currentSubcategories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {currentSubcategories.map((sub) => (
                      <SubCategoryItem 
                        key={sub._id || sub.name}
                        subcategory={sub}
                        onClick={handleSelectSubCategory}
                        mainCategorySlug={mainCategorySlug}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <Package size={56} className="text-green-300 mb-6" />
                    <p className="text-2xl text-gray-600 font-medium">No Specific Subcategories</p>
                    <p className="text-gray-500 mt-2">Check out all products in the **{currentCategory.name}** category.</p>
                    <Link 
                      to={`/products?category=${mainCategorySlug}`} 
                      className="mt-6 px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-500/50"
                    >
                      Browse {currentCategory.name} Collection
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullWidthCategoryExplorer;
