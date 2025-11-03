import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Registration from './components/Registration';
import Login from './components/Login';
import FAQ from './components/FAQ';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import CartPage from './pages/ShoppingCart';
import WishlistPage from './pages/WishlistPage';
import Footer from './components/Footer';
import UserProfile from './userdashboard/UserProfile';
import UserProfileDashboard from './userdashboard/UserProfiledashboard';
import OrderHistory from './userdashboard/OrderHistory';
import SupportTicket from './userdashboard/SupportTicket';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import ProductDescription from './pages/ProductDescription';

import { CartProvider } from './context/CartContext.jsx';
import './App.css';


// 🔹 Scroll to top when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};


const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Check login state on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // 🔹 Handle login
  const handleLogin = useCallback((token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    navigate('/');
  }, [navigate]);

  // 🔹 Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <>
      {/* 🔹 Fixed Navbar */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {/* 🔹 Main content wrapper with spacing */}
      <main className=" pb-10 min-h-screen bg-gray-50 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductDescription />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<UserProfileDashboard />} />
          <Route path="/:category/:subcategory" element={<Products />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/support" element={<SupportTicket user={user} />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<div className="text-center text-gray-600 text-lg mt-10">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {/* 🔹 Footer */}
      <Footer />
    </>
  );
};


function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
