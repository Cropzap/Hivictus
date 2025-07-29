import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  Home,
  Tag,
  Info,
  Phone,
  Package,
  ListOrdered,
  LifeBuoy,
  HelpCircle,
  Shield,
  FileText,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import Logo from "../assets/cropzap.png";
import { useCart } from '../context/CartContext'; // Import useCart hook

// Mobile Navigation Item Component
const MobileNavItem = ({ to, onClick, icon, label, badgeCount = 0 }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const itemClass = `flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
    ${isActive ? "bg-emerald-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`;

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

  return (
    <motion.div whileTap={{ scale: 0.95 }} className="relative flex flex-col items-center text-sm">
      <Link
        to={to}
        className={`flex flex-col items-center justify-center text-sm
          ${isActive ? "text-emerald-300" : "text-green-100"}
          transition-all duration-200`}
      >
        <div className="relative">
          {icon}
          {badgeCount > 0 && (
            <span className="absolute -top-2 -right-2 text-[10px] min-w-[16px] h-[16px] bg-red-500 text-white rounded-full flex items-center justify-center px-1">
              {badgeCount}
            </span>
          )}
        </div>
        <span className="mt-1">{label}</span>
      </Link>
    </motion.div>
  );
};


const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [isClient, setIsClient] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Consume cart context
  const { cartItemCount, fetchCartQuantity } = useCart(); // Get cartItemCount and fetchCartQuantity from context

  const accountDropdownRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Trigger cart quantity fetch when login status changes
  useEffect(() => {
    fetchCartQuantity();
  }, [isLoggedIn, fetchCartQuantity]); // Dependency on isLoggedIn and fetchCartQuantity

  // Close dropdowns/menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll detection for the bottom mobile nav bar (hide on scroll down, show on scroll up)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsMobileNavVisible(false);
      } else {
        setIsMobileNavVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Idle timer for the bottom mobile nav bar (hide after inactivity)
  useEffect(() => {
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsMobileNavVisible(false);
      }, 3000);
    };

    resetIdleTimer();

    const handleUserActivity = () => {
      setIsMobileNavVisible(true);
      resetIdleTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, []);


  if (!isClient) return null;

  const navLinkClass = (path) =>
    `relative flex items-center py-2 px-4 transition-all duration-300 ease-in-out text-sm
    ${
      location.pathname === path
        ? "text-emerald-300 font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-emerald-300 after:rounded-full"
        : "text-green-100 hover:text-emerald-200"
    }`;

  return (
    <div className="w-full">
      {/* 🔹 Desktop Navbar */}
      <div className="hidden md:flex fixed top-0 left-0 w-full h-20 items-center justify-between px-6 z-50
                      bg-green-800/90 backdrop-blur-md shadow-lg border-b border-green-700">
        {/* Logo on the left */}
        <Link to="/" className="flex items-center justify-start h-full">
          <img
            src={Logo}
            alt="Company Logo"
            className="object-contain h-16 w-auto"
          />
        </Link>

        {/* Centered Nav */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-green-700/80 backdrop-blur-lg shadow-xl rounded-full px-8 py-3 flex items-center justify-center space-x-8 border border-green-600"
        >
          <nav className="flex space-x-6 text-black">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>

            <Link to="/products" className={navLinkClass("/products")}>
              Products
            </Link>

            <Link to="/about" className={navLinkClass("/about")}>
              About Us
            </Link>

            {/* Account Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`flex items-center space-x-1 py-2 px-4 transition-all duration-300 ease-in-out text-sm
                  ${
                    isLoggedIn || location.pathname === "/login" || location.pathname === "/register"
                      ? "text-emerald-300 font-semibold"
                      : "text-green-100 hover:text-emerald-200"
                  }`}
              >
                <span>My Account</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isAccountDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isAccountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl rounded-lg py-2 border border-gray-100 z-50"
                  >
                    {!isLoggedIn ? (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <LogIn size={16} /> <span>Login</span>
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <UserPlus size={16} /> <span>Register</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <User size={16} /> <span>My Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <ListOrdered size={16} /> <span>My Orders</span>
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setIsAccountDropdownOpen(false); }}
                          className="flex items-center space-x-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut size={16} /> <span>Logout</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </motion.header>

        {/* Action Buttons on the right (Cart, Wishlist, Profile/Login/Logout) */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative text-green-100 hover:text-emerald-300 transition-colors duration-200">
            <ShoppingCart size={24} />
            {/* Display cart item count */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-green-100 hover:text-emerald-300 transition-colors duration-200">
                <User size={24} />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* 🔹 Mobile Navbar - Top Bar (Logo + Menu Toggle) */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:hidden fixed top-0 left-0 w-full bg-green-800/90 backdrop-blur-md shadow-sm p-1 flex justify-between items-center z-50"
      >
        <Link to="/" className="flex flex-row items-center">
          <img
            src={Logo}
            alt="Company Logo"
            className="object-contain h-10 w-auto"
          />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          ref={mobileMenuButtonRef}
          className="text-green-100 hover:text-emerald-300 transition-colors duration-200"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
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
            <div className="flex flex-col items-start space-y-4 pb-10 pt-20">
              <MobileNavItem to="/" onClick={() => setIsMobileMenuOpen(false)} icon={<Home size={20} />} label="Home" />
              <MobileNavItem to="/products" onClick={() => setIsMobileMenuOpen(false)} icon={<Package size={20} />} label="Products" />
              <MobileNavItem to="/about" onClick={() => setIsMobileMenuOpen(false)} icon={<Info size={20} />} label="About Us" />
              <MobileNavItem to="/cart" onClick={() => setIsMobileMenuOpen(false)} icon={<ShoppingCart size={20} />} label="Cart" badgeCount={cartItemCount} />

              <div className="w-full h-px bg-gray-200 my-4" />

              {isLoggedIn ? (
                <>
                  <MobileNavItem to="/profile" onClick={() => setIsMobileMenuOpen(false)} icon={<User size={20} />} label="My Profile" />
                  <MobileNavItem to="/orders" onClick={() => setIsMobileMenuOpen(false)} icon={<ListOrdered size={20} />} label="My Orders" />
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center space-x-2 mt-4"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <MobileNavItem to="/login" onClick={() => setIsMobileMenuOpen(false)} icon={<LogIn size={20} />} label="Login" />
                  <MobileNavItem to="/register" onClick={() => setIsMobileMenuOpen(false)} icon={<UserPlus size={20} />} label="Register" />
                </>
              )}

              <div className="w-full h-px bg-gray-200 my-4" />

              <MobileNavItem to="/support" onClick={() => setIsMobileMenuOpen(false)} icon={<LifeBuoy size={20} />} label="Customer Support" />
              <MobileNavItem to="/faq" onClick={() => setIsMobileMenuOpen(false)} icon={<HelpCircle size={20} />} label="FAQ" />
              <MobileNavItem to="/privacy-policy" onClick={() => setIsMobileMenuOpen(false)} icon={<Shield size={20} />} label="Privacy Policy" />
              <MobileNavItem to="/terms-and-conditions" onClick={() => setIsMobileMenuOpen(false)} icon={<FileText size={20} />} label="Terms & Conditions" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Enhanced Mobile Floating Navigation (Bottom Bar) */}
      <AnimatePresence>
        {isMobileNavVisible && (
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="md:hidden fixed bottom-0 left-0 w-full bg-green-800 transform transition-all duration-500 ease-out
                       border-t border-green-700 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] px-4 py-2 flex justify-around items-center z-50"
          >
            <MobileFloatingNavItem to="/" icon={<Home size={22} />} label="Home" />
            <MobileFloatingNavItem to="/products" icon={<Package size={22} />} label="Shop" />
            <MobileFloatingNavItem to="/cart" icon={<ShoppingCart size={22} />} label="Cart" badgeCount={cartItemCount} />
            {isLoggedIn ? (
              <MobileFloatingNavItem to="/profile" icon={<User size={22} />} label="Profile" />
            ) : (
              <MobileFloatingNavItem to="/login" icon={<LogIn size={22} />} label="Login" />
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;