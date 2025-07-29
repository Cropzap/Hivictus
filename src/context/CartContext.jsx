// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate(); // Get navigate here for redirects within the context

  // Function to fetch cart quantity (unique items)
  const fetchCartQuantity = useCallback(async () => {
    const currentToken = localStorage.getItem('authToken'); // Always get the latest token
    if (!currentToken) {
      setCartItemCount(0); // Clear cart count if not logged in
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'x-auth-token': currentToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed for cart fetch. Logging out.");
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login'); // Redirect to login
        }
        setCartItemCount(0);
        console.error(`Error fetching cart quantity: ${response.status}`);
        return;
      }

      const data = await response.json();
      // FIX: Calculate total UNIQUE items (length of the items array)
      const totalUniqueItems = data.items.length;
      setCartItemCount(totalUniqueItems);
    } catch (err) {
      console.error("Error fetching cart quantity:", err);
      setCartItemCount(0); // Set to 0 on network/other errors
    }
  }, [navigate]); // navigate is a dependency

  // Initial fetch when the provider mounts or authToken changes
  useEffect(() => {
    // We get the token directly from localStorage here, as this is the source of truth
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCartQuantity();
    } else {
      setCartItemCount(0);
    }
  }, [fetchCartQuantity]); // Dependency on fetchCartQuantity

  // Provide the state and function to children
  return (
    <CartContext.Provider value={{ cartItemCount, fetchCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy consumption
export const useCart = () => {
  return useContext(CartContext);
};