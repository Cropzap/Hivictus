import React, { useState, useEffect, useRef, useCallback, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  User,
  MapPin, 
  Search, 
  Tag,
  Info,
  Package,
  ListOrdered,
  LogIn,
  UserPlus,
  LogOut,
  Home,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useCart } from '../context/CartContext';

// --- Mock Cart Context to resolve dependency error ---
// NOTE: In a real application, you would import this from a separate file.
const CartContext = createContext();


// --- End Mock Context ---


// Utility function to convert names to URL-safe slugs
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');


// --- Utility Components (Mobile Nav Items) ---

// Mobile Navigation Item Component (for Menu Drawer)
const MobileNavItem = ({ to, onClick, icon, label, badgeCount = 0, subcategories = [] }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  // Check if the current path (excluding query params) matches the link's path
  const isActive = to && location.pathname === to.split('?')[0]; 

  const itemClass = `flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
    ${isActive ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`;

  if (subcategories.length > 0) {
    // When subcategories exist, the main link (to) is the category link
    const categorySlug = slugify(label); 

    return (
      <div className="w-full">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100"
        >
          <div className="flex items-center space-x-3">
            {icon}
            <span className="text-base font-medium">{label}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`} />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-6 pt-1 pb-2 space-y-1"
            >
              {subcategories.map((sub, index) => (
                <Link
                  key={index}
                  // 🚀 Mobile Subcategory Link: Uses slugify for both category and subcategory
                  to={`/products?category=${categorySlug}&subcategory=${slugify(sub.name)}`}
                  onClick={onClick} // This prop should close the main menu
                  className="flex items-center w-full p-2 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <span className="mr-3">·</span> {sub.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.98 }} className="w-full">
      {to ? (
        <Link to={to} onClick={onClick} className={itemClass}>
          <div className="relative">
            {icon}
            {badgeCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] min-w-[16px] h-[16px] bg-red-500 text-white rounded-full flex items-center justify-center px-1">
                {badgeCount}
              </span>
            )}
          </div>
          <span className="text-base font-medium">{label}</span>
        </Link>
      ) : (
        <button onClick={onClick} className={itemClass}>
          {icon}
          <span className="text-base font-medium">{label}</span>
        </button>
      )}
    </motion.div>
  );
};

// Mobile Floating Bottom Navigation Item Component
const MobileFloatingNavItem = ({ to, icon, label, badgeCount = 0 }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // Use the new primary color for active state: a friendly, earthy green
  const activeColor = "text-green-700"; 
  const inactiveColor = "text-gray-500 hover:text-green-700";

  return (
    <motion.div whileTap={{ scale: 0.95 }} className="relative flex flex-col items-center text-sm">
      <Link
        to={to}
        className={`flex flex-col items-center justify-center text-xs md:text-sm
          ${isActive ? activeColor : inactiveColor}
          transition-all duration-200`}
      >
        <div className="relative p-1">
          {icon}
          {badgeCount > 0 && (
            <span className="absolute -top-1 -right-0 text-[10px] min-w-[16px] h-[16px] bg-red-500 text-white rounded-full flex items-center justify-center px-1">
                {badgeCount}
            </span>
          )}
        </div>
        <span className="mt-0.5">{label}</span>
      </Link>
    </motion.div>
  );
};


// --- Main Navbar Component ---
const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [isClient, setIsClient] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null); 
  const [categories, setCategories] = useState([]); // State for categories
  const location = useLocation();
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- Search State ---
  const [searchInput, setSearchInput] = useState("");
  // Tracks selected category in the dropdown (only used for desktop search)
  const [searchCategory, setSearchCategory] = useState("all"); 
  const [searchResults, setSearchResults] = useState([]);
  const searchDropdownRef = useRef(null); // Ref for the search area (used for both desktop and mobile to close suggestions)
  // --- End Search State ---


  // Consume cart context (using the mock above)
  // cartItemCount is now a dynamic state value from the useCart mock
  
  const { cartItemCount, fetchCartQuantity } = useCart();

  const accountDropdownRef = useRef(null); // Kept for consistency if future logic is added
  const shopDropdownRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  // Define the primary green color from the image (used for buttons, active states)
  const myHarvestGreen = "bg-green-700 hover:bg-green-800";
  const myHarvestTextColor = "text-green-700 hover:text-green-800";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Fetch Categories Effect ---
  const fetchCategories = useCallback(async () => {
    try {
      // Use the provided API endpoint
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback data if API fails. Added imageUrl property for search suggestions.
      setCategories([
        { _id: 'v1', name: "Vegetables", subcategories: [{ name: "Leafy Greens", imageUrl: '150x150/dcfce7/065f46?text=LG' }, { name: "Root Vegetables", imageUrl: '150x150/fecaca/991b1b?text=RV' }] },
        { _id: 'f1', name: "Fruits", subcategories: [{ name: "Seasonal Fruits", imageUrl: '150x150/ffe4e6/881337?text=SF' }, { name: "Exotic Fruits", imageUrl: '150x150/fae8ff/581c87?text=EF' }, { name: "Citrus Fruits", imageUrl: '150x150/fff7e6/b45309?text=CF' }] }, // Updated one subcat to have a space
        { _id: 'd1', name: "Dairy", subcategories: [{ name: "Milk & Eggs", imageUrl: '150x150/e0f2fe/075985?text=ME' }, { name: "Cheese & Butter", imageUrl: '150x150/fefce8/713f12?text=CB' }] },
        { _id: 'g1', name: "Grains", subcategories: [] } 
      ]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    // 🚀 IMPORTANT: Call the mock fetchCartQuantity here to simulate initial load.
    fetchCartQuantity(); 
  }, [fetchCategories, fetchCartQuantity, isLoggedIn]); 
  
  // --- Search Logic: Filter Subcategories ---
  const filterSubcategories = useCallback((term, categorySlug) => {
    // Only show suggestions if the term is at least 2 characters long
    if (term.length < 2) return [];

    let filteredCategories = categories;

    if (categorySlug !== 'all') {
        filteredCategories = categories.filter(cat => slugify(cat.name) === categorySlug);
    }
    
    const results = [];
    
    filteredCategories.forEach(cat => {
        cat.subcategories.forEach(sub => {
            if (sub.name.toLowerCase().includes(term.toLowerCase())) {
                results.push({
                    categoryName: cat.name,
                    subcategoryName: sub.name,
                    imageUrl: sub.imageUrl,
                });
            }
        });
    });
    
    return results.slice(0, 5); // Limit to top 5 results
  }, [categories]);

  // Effect to update search results when input or category changes
  useEffect(() => {
      // If we are on mobile, use 'all' category by default for search suggestions
      const currentCategory = window.innerWidth < 768 ? 'all' : searchCategory;
      setSearchResults(filterSubcategories(searchInput, currentCategory));
  }, [searchInput, searchCategory, filterSubcategories]);
  
  // Handlers for search components
  const handleInputChange = (e) => {
      setSearchInput(e.target.value);
  };
  
  const handleCategorySelect = (e) => {
      setSearchCategory(e.target.value);
  };

  // Close dropdowns/menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        // Keeping this logic for potential future use of the account dropdown
        // setIsAccountDropdownOpen(false); 
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setIsShopDropdownOpen(false);
        setHoveredCategory(null); // Also clear the hovered category state
      }
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      
      // Close search results if clicking outside the search area AND the input/button itself
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
          setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll detection for the bottom mobile nav bar
  useEffect(() => {
    const handleScroll = () => {
      // Only run scroll logic on mobile view
      if (window.innerWidth < 768) {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down, hide the bottom nav
          setIsMobileNavVisible(false);
        } else {
          // Scrolling up or near the top, show the bottom nav
          setIsMobileNavVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    // Delay scroll check slightly to prevent jitter
    let timeout;
    const debouncedHandleScroll = () => {
        clearTimeout(timeout);
        timeout = setTimeout(handleScroll, 50);
    };

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [lastScrollY]);

  if (!isClient) return null;

  // Class for standard navigation links on desktop (Row 2)
  const navLinkClass = (path) =>
    `relative py-2 px-3 transition-colors duration-300 ease-in-out text-sm font-medium whitespace-nowrap
    ${
      location.pathname === path
        ? `${myHarvestTextColor} border-b-2 border-green-700`
        : "text-gray-700 hover:text-green-700"
    }`;

  // Custom Logo component for visual parity with the image
const MyHarvestLogo = () => (
  
  <div className="flex items-center justify-center">
    <Link to="/">
    <img
      src="/logo.png" // 🔹 Replace this path with your actual image path (e.g., /assets/logo.png)
      alt="Hivictus"
      className="h-10 md:h-10 sm:h-10 w-auto lg:h-20 object-contain"
    />
      </Link>
  </div>

);


  return (
    <div className="w-full">
      {/* 🔹 Desktop Navbar (Fixed White Background) */}
      <div className="hidden md:block fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- Row 1: Logo, Search, User/Cart Actions --- */}
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center h-full">
              <MyHarvestLogo />
            </Link>

            {/* Centered Search Bar with Suggestions (Desktop) */}
            <div className="flex-1 max-w-2xl mx-10 relative" ref={searchDropdownRef}>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden h-10 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-shadow">
                {/* Category Select Dropdown */}
                <div className="relative bg-gray-100 border-r border-gray-300">
                  <select
                    className="h-full px-4 text-sm bg-transparent appearance-none cursor-pointer focus:outline-none"
                    aria-label="Select Category"
                    value={searchCategory}
                    onChange={handleCategorySelect}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={slugify(cat.name)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search products or subcategories..."
                  className="flex-1 h-full px-4 text-sm focus:outline-none"
                  value={searchInput}
                  onChange={handleInputChange}
                  // When focusing, manually trigger suggestions if minimum length is met
                  onFocus={() => { if(searchInput.length >= 2) setSearchResults(filterSubcategories(searchInput, searchCategory)); }}
                />

                {/* Search Button (navigates to products with search query) */}
                <Link 
                    // Search Link uses general search query parameter 'q' and selected category
                    to={`/products?q=${searchInput}&category=${searchCategory}`}
                    onClick={() => {
                        setSearchInput("");
                        setSearchResults([]);
                    }}
                    className={`p-2 bg-green-700 hover:bg-green-800 text-white transition-colors flex items-center justify-center`}
                >
                    <Search size={20} />
                </Link>
              </div>

              {/* Search Suggestions Dropdown (Desktop) */}
              <AnimatePresence>
                {searchInput.length >= 2 && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                  >
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        // 🚀 Suggestion Link passes both category and subcategory (using slugify)
                        to={`/products?category=${slugify(result.categoryName)}&subcategory=${slugify(result.subcategoryName)}`}
                        onClick={() => {
                            setSearchInput("");
                            setSearchResults([]);
                            setSearchCategory("all");
                        }}
                        className="flex items-center p-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {/* Mock Image for Subcategory */}
                        <img 
                            src={`https://placehold.co/${result.imageUrl}`} // 🚀 CORRECTED: Added proper base URL for placeholder
                            alt={result.subcategoryName}
                            className="w-8 h-8 rounded-md object-cover mr-3 flex-shrink-0"
                            // Fallback if placeholder fails
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.paddingLeft = '3.5rem';}}
                        />
                        <div className="flex flex-col text-sm">
                            <span className="font-medium text-gray-800">{result.subcategoryName}</span>
                            <span className="text-xs text-gray-500">in {result.categoryName}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Action Icons (Sign In/Register, Location, Cart) */}
            <div className="flex items-center space-x-6 text-gray-700">
              {/* Sign In / Register */}
              <Link to={isLoggedIn ? "/profile" : "/login"} className="flex items-center space-x-1 hover:text-green-700 transition-colors">
                <User size={20} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {isLoggedIn ? "My Profile" : "Sign in / Register"}
                </span>
              </Link>

              {/* Location/Address */}
              <button className="hover:text-green-700 transition-colors">
                <MapPin size={20} />
              </button>

              {/* Cart Icon */}
              <Link to="/cart" className="relative hover:text-green-700 transition-colors">
                <ShoppingCart size={24} />
                {/* Display cart item count */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* --- Row 2: Main Navigation Links --- */}
        <div className="border-t border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center space-x-8">
            {/* Shop By Categories Button/Dropdown (Populated by API) */}
            <div className="relative group" ref={shopDropdownRef}>
              <button
                // Toggle state on click, but keep it open on hover if a category flyout is active
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => {
                    // Slight delay to allow movement to the flyout
                    setTimeout(() => {
                        if (hoveredCategory === null) {
                            setIsShopDropdownOpen(false);
                        }
                    }, 100);
                }}
                className={`flex items-center space-x-2 h-10 px-6 font-semibold text-white rounded-md transition-all duration-300 shadow-md ${myHarvestGreen}`}
              >
                <span>Shop By Categories</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isShopDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isShopDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 w-64 bg-white shadow-2xl rounded-lg py-2 border border-gray-100 z-50 overflow-visible" 
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => {
                        setIsShopDropdownOpen(false);
                        setHoveredCategory(null);
                    }}
                  >
                    {categories.map((cat) => (
                      <div 
                        key={cat._id} 
                        className="relative group/category" 
                        onMouseEnter={() => setHoveredCategory(cat._id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <Link
                          // 🚀 Desktop Main Category Link: Uses slugify for the category
                          to={`/products?category=${slugify(cat.name)}`}
                          className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                          onClick={() => setIsShopDropdownOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            {/* Use category icon or a placeholder */}
                            <Package size={16} /> <span>{cat.name}</span>
                          </div>
                          {/* Chevron for flyout menu, only if subcategories exist */}
                          {cat.subcategories && cat.subcategories.length > 0 && <ChevronDown size={14} className="rotate-[-90deg]" />}
                        </Link>

                        {/* Subcategories Dropdown (Flyout Menu) */}
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <motion.div
                            // Only show if this category is hovered
                            animate={{ opacity: hoveredCategory === cat._id ? 1 : 0, visibility: hoveredCategory === cat._id ? "visible" : "hidden" }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0 left-full ml-1 w-64 bg-white shadow-2xl rounded-lg py-2 border border-gray-100 z-50"
                          >
                            <div className="px-4 py-2 font-bold text-green-700 border-b border-gray-100 text-sm">{cat.name} Subcategories</div>
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                // 🚀 Desktop Subcategory Link: Uses slugify for both category and subcategory
                                to={`/products?category=${slugify(cat.name)}&subcategory=${slugify(sub.name)}`}
                                className="block space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                                onClick={() => setIsShopDropdownOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secondary Nav Links (Updated) */}
            <nav className="flex space-x-8">
              {/* NEW PRODUCTS LINK */}
              <Link to="/products" className={navLinkClass("/products")}>
                Products
              </Link>
              <Link to="https://www.hivictus.com/our-story" className={navLinkClass("/about")}>
                About Us
              </Link>
            </nav>
          </div>
        </div>
      </div>


      {/* 🔹 Mobile Navbar - Top Bar (Logo + Menu Toggle) */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md p-3 flex justify-between items-center z-50"
      >
        <Link to="/" className="flex flex-row items-center">
          <MyHarvestLogo />
        </Link>

        <div className="flex items-center space-x-3">
          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-700 hover:text-green-700 transition-colors duration-200">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            ref={mobileMenuButtonRef}
            className="text-gray-700 hover:text-green-700 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.div>

      {/* 🔹 Mobile Search Bar (Functional) */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="md:hidden fixed top-16 left-0 w-full bg-white shadow-sm p-3 z-40"
        ref={searchDropdownRef}
      >
        <div className="flex border border-gray-300 rounded-lg overflow-hidden h-10 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-shadow">
          <input
            type="text"
            placeholder="Search products or subcategories..."
            className="flex-1 h-full px-4 text-sm focus:outline-none"
            value={searchInput}
            onChange={handleInputChange}
            // Mobile search defaults to checking all categories for suggestions
            onFocus={() => { if(searchInput.length >= 2) setSearchResults(filterSubcategories(searchInput, 'all')); }} 
          />
          <Link 
              // Mobile Search Link uses general search query parameter 'q'
              to={`/products?q=${searchInput}`}
              onClick={() => {
                  setSearchInput("");
                  setSearchResults([]);
                  setSearchCategory("all"); // Reset category state
              }}
              className={`p-2 ${myHarvestGreen} text-white transition-colors flex items-center justify-center`}
          >
            <Search size={20} />
          </Link>
        </div>

        {/* Search Suggestions Dropdown (Mobile) */}
        <AnimatePresence>
            {searchInput.length >= 2 && searchResults.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    // Positioned absolutely below the input bar within this container
                    className="absolute w-[calc(100%-1.5rem)] mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                >
                    {searchResults.map((result, index) => (
                        <Link
                            key={index}
                            // 🚀 Suggestion Link passes both category and subcategory (using slugify)
                            to={`/products?category=${slugify(result.categoryName)}&subcategory=${slugify(result.subcategoryName)}`}
                            onClick={() => {
                                setSearchInput("");
                                setSearchResults([]);
                            }}
                            className="flex items-center p-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            {/* Mock Image for Subcategory */}
                            <img 
                                // 🚀 CORRECTED: Added proper base URL for placeholder
                                src={`https://placehold.co/${result.imageUrl}`} 
                                alt={result.subcategoryName}
                                className="w-8 h-8 rounded-md object-cover mr-3 flex-shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.paddingLeft = '3.5rem';}}
                            />
                            <div className="flex flex-col text-sm">
                                <span className="font-medium text-gray-800">{result.subcategoryName}</span>
                                <span className="text-xs text-gray-500">in {result.categoryName}</span>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>

      {/* 🔹 Mobile Full-Screen Menu (when toggled) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="md:hidden fixed top-0 right-0 h-full w-full bg-white z-40 p-6 overflow-y-auto shadow-lg"
            ref={mobileNavRef}
          >
            <div className="flex flex-col items-start space-y-4 pb-10 pt-40">
              <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
              {/* Populate Mobile Menu with Categories and Subcategories */}
              {categories.map((cat) => (
                <MobileNavItem
                  key={cat._id}
                  icon={<Package size={20} />}
                  label={cat.name}
                  subcategories={cat.subcategories}
                  // 🚀 Mobile Main Category Link: Uses slugify for the category
                  to={`/products?category=${slugify(cat.name)}`} 
                  onClick={() => setIsMobileMenuOpen(false)} // Pass close function to nested links
                />
              ))}

              <div className="w-full h-px bg-gray-200 my-4" />

              <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
              {/* PRODUCTS LINK */}
              <MobileNavItem to="/products" onClick={() => setIsMobileMenuOpen(false)} icon={<Tag size={20} />} label="Products" />
              <MobileNavItem to="/about" onClick={() => setIsMobileMenuOpen(false)} icon={<Info size={20} />} label="About Us" />

              <div className="w-full h-px bg-gray-200 my-4" />

              <h3 className="text-lg font-semibold text-gray-800">Account</h3>
              <MobileNavItem to="/" onClick={() => setIsMobileMenuOpen(false)} icon={<Home size={20} />} label="Home" />
              <MobileNavItem to="/orders" onClick={() => setIsMobileMenuOpen(false)} icon={<ListOrdered size={20} />} label="My Orders" />
              {isLoggedIn ? (
                <>
                  <MobileNavItem to="/profile" onClick={() => setIsMobileMenuOpen(false)} icon={<User size={20} />} label="My Profile" />
                  <MobileNavItem onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} icon={<LogOut size={20} />} label="Sign Out" />
                </>
              ) : (
                <>
                  <MobileNavItem to="/login" onClick={() => setIsMobileMenuOpen(false)} icon={<LogIn size={20} />} label="Sign In" />
                  <MobileNavItem to="/register" onClick={() => setIsMobileMenuOpen(false)} icon={<UserPlus size={20} />} label="Register" />
                </>
              )}
              
              <div className="w-full h-px bg-gray-200 my-4" />

              <h3 className="text-lg font-semibold text-gray-800">Support</h3>
              <MobileNavItem to="/faq" onClick={() => setIsMobileMenuOpen(false)} icon={<HelpCircle size={20} />} label="FAQ" />
              <MobileNavItem to="/terms" onClick={() => setIsMobileMenuOpen(false)} icon={<FileText size={20} />} label="Terms & Conditions" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Mobile Floating Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: isMobileNavVisible ? 0 : 100 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t border-gray-200 p-2 z-50 flex justify-around"
      >
        <MobileFloatingNavItem to="/" icon={<Home size={24} />} label="Home" />
        <MobileFloatingNavItem to="/products" icon={<Tag size={24} />} label="Shop" />
        <MobileFloatingNavItem to="/cart" icon={<ShoppingCart size={24} />} label="Cart" badgeCount={cartItemCount} />
        <MobileFloatingNavItem to="/profile" icon={<User size={24} />} label="Account" />
      </motion.div>
      
      {/* Spacer for content underneath the fixed navbar */}
      <div className="block md:hidden h-[9.5rem]" /> {/* Spacer for top bar (h-16) and search bar (h-10 + padding) */}
      <div className="hidden md:block h-36" /> {/* Spacer for two desktop rows */}
    </div>
  );
};

export default Navbar;