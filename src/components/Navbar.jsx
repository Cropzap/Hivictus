import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react"; // Updated Lucide-React imports
import Logo from "../assets/cropzap.png"; // Assuming this is your main logo

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [isClient, setIsClient] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); // Renamed for clarity
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const location = useLocation();

  const accountDropdownRef = useRef(null); // Renamed ref
  const mobileNavRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

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

  if (!isClient) return null;

  const navLinkClass = (path) =>
    `relative flex flex-col items-center py-2 px-4 transition-all duration-300 ease-in-out text-sm
    ${
      location.pathname === path
        ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-blue-600 after:rounded-full"
        : "text-gray-700 hover:text-blue-500"
    }`;

  const mobileNavLinkClass = (path) =>
    `flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-300
    ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const MobileNavItem = ({ to, onClick, icon, label }) => {
    return (
      <motion.div whileTap={{ scale: 0.98 }} className="w-full">
        {to ? (
          <Link to={to} onClick={() => { setActiveTab(to); setIsMobileMenuOpen(false); }} className={mobileNavLinkClass(to)}>
            {icon}
            <span className="text-base font-medium">{label}</span>
          </Link>
        ) : (
          <button onClick={onClick} className={mobileNavLinkClass()}>
            {icon}
            <span className="text-base font-medium">{label}</span>
          </button>
        )}
      </motion.div>
    );
  };

  const MobileNav = ({ to, icon, label, badgeCount = 0 }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <motion.div whileTap={{ scale: 0.95 }} className="relative flex flex-col items-center text-xs">
      <Link
        to={to}
        className={`flex flex-col items-center justify-center text-sm ${
          isActive ? "text-blue-600" : "text-gray-500"
        } transition-all duration-200`}
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

  return (
    <div className="w-full container mx-auto">
      {/* 🔹 Desktop Navbar */}
      <div className="hidden md:flex fixed top-0 left-0 w-full h-20 items-center justify-between px-6 z-30 bg-white/80 backdrop-blur-md shadow-sm">
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
          className="bg-white/95 backdrop-blur-lg shadow-lg rounded-full px-8 py-3 flex items-center justify-center space-x-8 border border-gray-100"
        >
          <nav className="flex space-x-6 text-black">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>

            <Link to="/products" className={navLinkClass("/products")}>
              Products
            </Link>

            <Link to="/categories" className={navLinkClass("/categories")}>
              Categories
            </Link>

            <Link to="/about" className={navLinkClass("/about")}>
              About Us
            </Link>

            <Link to="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>

            {/* Account Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`flex items-center space-x-1 py-2 px-4 transition-all duration-300 ease-in-out text-sm
                  ${
                    location.pathname === "/login" ||
                    location.pathname === "/register" ||
                    location.pathname === "/orders" ||
                    location.pathname === "/account"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-500"
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
                    {!isLoggedIn && (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                    {isLoggedIn && (
                      <>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </motion.header>

        {/* Action Buttons on the right (Cart, Wishlist, Login/Logout) */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200">
            <ShoppingCart size={24} />
            {/* You can add a cart item count here */}
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span> */}
          </Link>
          <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
            <Heart size={24} />
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
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
        className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm p-4 flex justify-between items-center z-50"
      >
        <Link to="/" className="flex flex-row items-center">
          <img
            src={Logo}
            alt="Company Logo"
            className="object-contain h-12 w-auto"
          />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          ref={mobileMenuButtonRef}
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
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
            <div className="flex flex-col items-start space-y-4 pt-20"> {/* Adjusted padding for fixed header */}
              <MobileNavItem to="/" icon={<Home size={20} />} label="Home" />
              <MobileNavItem to="/products" icon={<Package size={20} />} label="Products" />
              <MobileNavItem to="/categories" icon={<Tag size={20} />} label="Categories" />
              <MobileNavItem to="/about" icon={<Info size={20} />} label="About Us" />
              <MobileNavItem to="/contact" icon={<Phone size={20} />} label="Contact" />
              <MobileNavItem to="/cart" icon={<ShoppingCart size={20} />} label="Cart" />
              <MobileNavItem to="/wishlist" icon={<Heart size={20} />} label="Wishlist" />
              <MobileNavItem to="/checkout" icon={<ListOrdered size={20} />} label="Checkout" />

              <div className="w-full h-px bg-gray-200 my-4" /> {/* Divider */}

              {!isLoggedIn && (
                <>
                  <MobileNavItem to="/login" icon={<LogIn size={20} />} label="Login" />
                  <MobileNavItem to="/register" icon={<UserPlus size={20} />} label="Register" />
                </>
              )}
              {isLoggedIn && (
                <>
                  <MobileNavItem to="/orders" icon={<ListOrdered size={20} />} label="My Orders" />
                  <MobileNavItem to="/account" icon={<User size={20} />} label="My Account" />
                </>
              )}

              <div className="w-full h-px bg-gray-200 my-4" /> {/* Divider */}

              <MobileNavItem to="/support" icon={<LifeBuoy size={20} />} label="Customer Support" />
              <MobileNavItem to="/faq" icon={<HelpCircle size={20} />} label="FAQ" />
              <MobileNavItem to="/privacy-policy" icon={<Shield size={20} />} label="Privacy Policy" />
              <MobileNavItem to="/terms-and-conditions" icon={<FileText size={20} />} label="Terms & Conditions" />

              {isLoggedIn && (
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center space-x-2 mt-4"
                >
                  <LogIn size={20} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Enhanced Mobile Floating Navigation (Bottom Bar) */}
<motion.nav
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 120, damping: 15 }}
  className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 py-2 flex justify-between items-center z-50"
>
  <MobileNav to="/" icon={<Home size={24} />} label="Home" />
  <MobileNav to="/products" icon={<ShoppingCart size={24} />} label="Shop" />
  <MobileNav to="/cart" icon={<ShoppingCart size={24} />} label="Cart" badgeCount={2} />
  <MobileNav to="/wishlist" icon={<Heart size={24} />} label="Wishlist" badgeCount={4} />
</motion.nav>

    </div>
  );
};

export default Navbar;