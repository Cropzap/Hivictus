import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, MinusCircle, PlusCircle, ChevronLeft, Share2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const product = {
  id: 'prod_001',
  name: 'Organic Fresh Tomatoes',
  images: [
    'https://images.unsplash.com/photo-1591656093156-f033dfc29f27?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1563842106093-f8a48b9487c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1582283084360-6466f203856b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  price: 120.00,
  unit: 'per kg',
  description: 'Our organic fresh tomatoes are grown with care, ensuring the best taste and nutritional value. Perfect for salads, sauces, or just snacking. Sourced directly from local sustainable farms, free from pesticides and harmful chemicals.',
  details: [
    'Locally sourced and freshly picked',
    '100% Organic certified',
    'Rich in Vitamins C and K',
    'Ideal for cooking and raw consumption',
    'Sustainable farming practices',
  ],
  reviews: [
    { rating: 5, comment: 'Absolutely fresh and delicious!', user: 'Priya S.' },
    { rating: 4, comment: 'Good quality, a bit pricey but worth it for organic.', user: 'Amit K.' },
    { rating: 5, comment: 'Consistently excellent produce from Cropzap.', user: 'Neha R.' },
  ],
  rating: 4.8,
  numReviews: 154,
  availability: 'In Stock',
  seller: {
    name: 'Green Harvest Farm',
    location: 'Coimbatore, Tamil Nadu',
    rating: 4.9,
  },
};

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    setToastMessage(`${quantity} ${product.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // In a real app, you'd dispatch an action to add to a global cart state
  };

  const handleAddToWishlist = () => {
    console.log(`Added ${product.name} to wishlist.`);
    setToastMessage(`${product.name} added to wishlist!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // In a real app, you'd dispatch an action to add to a global wishlist state
  };

  const handleBuyNow = () => {
    console.log(`Buying ${quantity} of ${product.name} now.`);
    navigate('/checkout', { state: { product, quantity } });
    // In a real app, you'd navigate to checkout with product details
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const toastVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const buttonPress = {
    scale: 0.95,
    transition: { type: "spring", stiffness: 500, damping: 20 }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-24"> {/* Added pb for sticky bar */}
      {/* Top Bar - iOS like */}
      <motion.div
        className="fixed top-0 left-0 w-full bg-white z-40 shadow-sm py-4 px-4 flex items-center justify-between"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => navigate(-1)} // Go back
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          whileTap={buttonPress}
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-800">Product Details</h1>
        <motion.button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          whileTap={buttonPress}
          aria-label="Share product"
        >
          <Share2 size={20} className="text-gray-600" />
        </motion.button>
      </motion.div>

      {/* Main Content Area */}
      <div className="pt-20 pb-16"> {/* Adjust padding to accommodate sticky top/bottom bars */}
        {/* Image Gallery */}
        <div className="relative w-full overflow-hidden bg-white">
          <motion.div
            className="flex"
            animate={{ x: `-${activeImageIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {product.images.map((img, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={img}
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            ))}
          </motion.div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {product.images.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${activeImageIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: activeImageIndex === index ? 1.2 : 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="bg-white p-6 mt-4 rounded-xl shadow-sm mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <div className="flex items-center mb-3">
            <span className="text-3xl font-bold text-green-700 mr-2">₹{product.price.toFixed(2)}</span>
            <span className="text-gray-500 text-lg">{product.unit}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="ml-2 font-medium">{product.rating}</span>
            <span className="mx-1">•</span>
            <span>{product.numReviews} Reviews</span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-4">{product.description}</p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Details:</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm mb-4 space-y-1">
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-800 font-semibold">Availability:</span>
            <span className={`font-medium ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
              {product.availability}
            </span>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between text-sm shadow-inner">
            <div>
              <span className="text-gray-800 font-semibold">Sold by:</span>
              <p className="text-green-700 font-medium">{product.seller.name}</p>
              <p className="text-gray-500">{product.seller.location}</p>
            </div>
            <div className="flex items-center text-gray-600">
              <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
              <span>{product.seller.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="bg-white p-6 mt-4 rounded-xl shadow-sm mx-4 flex items-center justify-between">
          <span className="text-gray-800 font-semibold text-lg">Quantity:</span>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={decrementQuantity}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileTap={buttonPress}
              aria-label="Decrease quantity"
            >
              <MinusCircle size={24} className="text-gray-600" />
            </motion.button>
            <span className="text-xl font-bold text-gray-800 w-8 text-center">{quantity}</span>
            <motion.button
              onClick={incrementQuantity}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileTap={buttonPress}
              aria-label="Increase quantity"
            >
              <PlusCircle size={24} className="text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white p-6 mt-4 rounded-xl shadow-sm mx-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Reviews ({product.numReviews})</h3>
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-inner"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-800">{review.user}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No reviews yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar for Actions */}
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-white z-40 shadow-lg py-3 px-4 flex items-center justify-between gap-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={handleAddToWishlist}
          className="p-3 rounded-full bg-gray-100 hover:bg-pink-100 transition-colors"
          whileTap={buttonPress}
          aria-label="Add to Wishlist"
        >
          <Heart size={28} className="text-gray-600 hover:text-pink-500 transition-colors" />
        </motion.button>

        <motion.button
          onClick={handleAddToCart}
          className="flex-1 bg-green-500 text-white py-3 rounded-full flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg
                     hover:bg-green-600 transition-colors"
          whileTap={buttonPress}
        >
          <ShoppingCart size={24} />
          <span>Add to Cart</span>
        </motion.button>

        <motion.button
          onClick={handleBuyNow}
          className="flex-1 bg-blue-500 text-white py-3 rounded-full text-lg font-semibold shadow-lg
                     hover:bg-blue-600 transition-colors"
          whileTap={buttonPress}
        >
          Buy Now
        </motion.button>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg text-sm z-50"
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;