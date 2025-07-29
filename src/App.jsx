// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; // Keep useNavigate here for AppContent

import Navbar from './components/Navbar';
import Registration from './components/Registration';
import Login from './components/Login';
import FAQ from './components/FAQ';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import CartPage from './pages/ShoppingCart';
import WishlistPage from './pages/WishlistPage'; // If you have this page
import Footer from './components/Footer';
import UserProfile from './userdashboard/UserProfile';
import UserProfileDashboard from './userdashboard/UserProfiledashboard';
import OrderHistory from './userdashboard/OrderHistory';
import SupportTicket from './userdashboard/SupportTicket';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import ProductDescription from './pages/ProductDescription';

import { CartProvider } from './context/CartContext.jsx';
import './App.css'; // Keep your global CSS if any


// Create a new component to wrap your routes and use hooks
const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Now useNavigate is called within a component rendered by BrowserRouter

  // Effect to check login status on initial load and when localStorage changes
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle successful login from Login component
  const handleLogin = useCallback((token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    navigate('/'); // Redirect to home page after successful login
  }, [navigate]); // Add navigate to dependency array

  // Function to handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  }, [navigate]); // Add navigate to dependency array

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="mb-10">
        {/* This div might be for spacing, adjust as needed */}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<ProductDescription />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Pass handleLogin to the Login component */}
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<UserProfileDashboard />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/support" element={<SupportTicket />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        {/* Add more routes as needed */}
        <Route path="/wishlist" element={<WishlistPage />} /> {/* Assuming you have this page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
};


// The main App component now just renders BrowserRouter and AppContent
function App() {
  return (
    <BrowserRouter>
      <CartProvider> {/* Wrap your entire application with CartProvider */}
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;