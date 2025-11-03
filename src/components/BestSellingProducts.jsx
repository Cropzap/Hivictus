import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify'; // Using a real toast library for better UX
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_API_URL;

// --- Icons as SVG components ---
const SpinnerIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM48 304c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48zm416 0c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zM142.9 142.9c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm226.3 226.3c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm-226.3 67.9c-18.7 18.7-49.1 18.7-67.9 0s-18.7-49.1 0-67.9s49.1-18.7 67.9 0s18.7 49.1 0 67.9zm226.3-226.3c-18.7 18.7-49.1 18.7-67.9 0s-18.7-49.1 0-67.9s49.1-18.7 67.9 0s18.7 49.1 0 67.9z"/>
  </svg>
);

const StarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 35.7-18.3 54.3l105.7 103-25 145.5c-4.5 26.3 23.2 46.5 46.4 33.7L288 439.6l128.9 68.4c23.2 12.8 50.9-7.1 46.4-33.7l-25-145.5 105.7-103c18.4-18.6 7.9-50.5-18.3-54.3L382 150.2 316.7 17.8c-11.7-24.2-45.5-24.2-57.2 0z"/>
  </svg>
);

const ShoppingCartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path fill="currentColor" d="M96 0C78.4 0 64 14.4 64 32V64H24C10.7 64 0 74.7 0 88s10.7 24 24 24h32v48c0 22.1 17.9 40 40 40h48c22.1 0 40-17.9 40-40v-48h96v48c0 22.1 17.9 40 40 40h48c22.1 0 40-17.9 40-40v-48h32c13.3 0 24-10.7 24-24s-10.7-24-24-24h-32V64h-48v48c0 22.1-17.9 40-40 40h-48c-22.1 0-40-17.9-40-40v-48H96V32c0-17.6-14.4-32-32-32zM384 192v240c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V192H384zm-224 0v240c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V192H160zM320 192v240c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V192H320z"/>
  </svg>
);

const UserCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM256 128c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm96 256h-192c-52.9 0-96-43.1-96-96 0-21.5 7.2-41.4 19.3-57.5 28.5 20.3 62.8 32.5 98.7 32.5h119c35.9 0 70.2-12.2 98.7-32.5 12.1 16.1 19.3 36 19.3 57.5 0 52.9-43.1 96-96 96z"/>
  </svg>
);

// --- PriceUnit Component ---
const PriceUnit = ({ price, unit }) => (
  <p className="font-bold text-gray-900 text-lg">
    ${price?.toFixed(2) || 'N/A'}{unit && <span className="text-sm font-normal text-gray-500"> / {unit}</span>}
  </p>
);

// --- ProductCard Component ---
const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=Product';
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col group border border-gray-200 hover:shadow-2xl hover:border-green-300 h-96 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
      onClick={() => onProductClick(product._id)}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl || 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=Product'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 ease-out group-hover:scale-110"
            onError={handleImageError}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow text-xs sm:text-xs md:text-sm">
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-gray-500 line-clamp-1 text-xs">
            {product.category?.name || 'Category'} &bull; {product.subCategory || 'Subcategory'}
          </p>
          <div className="flex items-end justify-between mt-auto">
            <PriceUnit price={product.price} unit={product.unit} />
            <div className="flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              <span className="mr-1">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
              <StarIcon className="w-3 h-3 text-green-500" />
            </div>
          </div>
          <div className="flex items-center text-gray-600 mt-1 text-[10px]">
            <UserCircleIcon className="w-3 h-3 mr-1 text-gray-400" />
            <span className="font-medium line-clamp-1">
              Sold by: {product.sellerName}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <button
          className={`bg-white p-2 rounded-full shadow-md transition-colors duration-200 transform-gpu
            ${product.quantity === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-green-600 hover:text-green-700 hover:scale-115 active:scale-90'
            }`}
          title={product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product._id);
          }}
          disabled={product.quantity === 0}
        >
          <ShoppingCartIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
const BestSellingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem('authToken'); // Get the real token

  // Fetch product data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/best-selling`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        toast.success('Products loaded successfully!');
      } catch (err) {
        console.error('Error fetching best-selling products:', err);
        setError('Failed to load best-selling products. Please try again later.');
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handler for adding a product to the cart
  const handleAddToCart = async (productId) => {
    if (!authToken) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        // Attempt to parse JSON, but handle cases where it's not JSON (like a 404 HTML page)
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // If the response isn't JSON, fall back to a generic error message
          throw new Error(`HTTP error! Status: ${response.status}. Expected JSON, but received a different format.`);
        }
        
        if (response.status === 401) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            navigate('/login');
        } else {
            throw new Error(errorData.message || `Failed to add product to cart. Status: ${response.status}`);
        }
      }

      toast.success('Product added to cart successfully!');
      console.log(`Product ID ${productId} added to cart.`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(`Failed to add to cart: ${err.message}`);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSeeAllClick = () => {
    navigate('/products'); // Navigate to a page with all products
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 py-10">
        <SpinnerIcon className="animate-spin text-emerald-600 w-10 h-10 mr-3" />
        <p className="text-gray-700 text-lg">Loading best-selling products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 py-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 py-10">
        <p className="text-gray-600 text-lg">No best-selling products found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative z-0 bg-white py-10 sm:py-12 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Best Selling Agriculture Products</h2>
          <button
            onClick={handleSeeAllClick}
            className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full px-4 py-2"
          >
            See All
          </button>
        </div>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mobile-scroll-container"
            layout
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BestSellingProducts;