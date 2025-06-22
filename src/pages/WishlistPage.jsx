import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Check, X, RotateCw } from 'lucide-react';

const initialWishlistItems = [
  {
    id: 'prod1',
    name: 'Vintage Leather Backpack - Premium Collection',
    imageUrl: 'https://placehold.co/200x200/a7b1cb/ffffff?text=Bag',
    price: 89.99,
    discountedPrice: 75.0,
  },
  {
    id: 'prod2',
    name: 'Noise-Cancelling Headphones - Studio Quality',
    imageUrl: 'https://placehold.co/200x200/8b8c8d/ffffff?text=Headphones',
    price: 199.0,
  },
  {
    id: 'prod3',
    name: 'Smart Home LED Strip - App Controlled',
    imageUrl: 'https://placehold.co/200x200/f7e0e0/ffffff?text=LED',
    price: 29.5,
    discountedPrice: 22.99,
  },
];

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [recentlyDeletedItem, setRecentlyDeletedItem] = useState(null);
  const [lastDeletedIndex, setLastDeletedIndex] = useState(null);

  const buttonPress = {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  };

  const toastVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 40, transition: { duration: 0.3 } },
  };

  const handleAddToCart = (item) => {
    setToastMessage(`Added "${item.name.split(' - ')[0]}" to cart!`);
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteItem = (idToDelete) => {
    const itemIndex = wishlistItems.findIndex(item => item.id === idToDelete);
    if (itemIndex > -1) {
      const deletedItem = wishlistItems[itemIndex];
      setRecentlyDeletedItem(deletedItem);
      setLastDeletedIndex(itemIndex);
      setWishlistItems(prev => prev.filter(item => item.id !== idToDelete));
      setToastMessage(`"${deletedItem.name.split(' - ')[0]}" removed`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        if (showToast && recentlyDeletedItem === deletedItem) setShowToast(false);
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (recentlyDeletedItem) {
      setWishlistItems(prev => {
        const items = [...prev];
        if (lastDeletedIndex !== null && lastDeletedIndex <= items.length) {
          items.splice(lastDeletedIndex, 0, recentlyDeletedItem);
        } else {
          items.push(recentlyDeletedItem);
        }
        return items;
      });
      setToastMessage(`"${recentlyDeletedItem.name.split(' - ')[0]}" restored!`);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setRecentlyDeletedItem(null);
      setLastDeletedIndex(null);
    }
  };

  const WishlistItemCard = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm sm:shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center relative"
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 mb-2 sm:mb-4 overflow-hidden rounded-xl">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 px-1 line-clamp-2 leading-tight">{item.name}</h3>
      {item.discountedPrice ? (
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm sm:text-base font-bold text-red-500">${item.discountedPrice.toFixed(2)}</span>
          <span className="text-xs sm:text-sm text-gray-400 line-through">${item.price.toFixed(2)}</span>
        </div>
      ) : (
        <p className="text-sm sm:text-base font-bold text-gray-700 mb-2">${item.price.toFixed(2)}</p>
      )}
      <div className="w-full flex justify-between items-center mt-1">
        <motion.button
          onClick={() => handleAddToCart(item)}
          className="flex-1 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow hover:shadow-md transition-all"
          whileTap={buttonPress}
        >
          <div className="flex items-center justify-center gap-1">
            <ShoppingCart size={16} />
            <span>Add</span>
          </div>
        </motion.button>
        <motion.button
          onClick={() => handleDeleteItem(item.id)}
          className="ml-3 p-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
          whileTap={buttonPress}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-5 sm:mb-8 text-center sm:text-left text-gray-800">
        Wishlist <span className="text-blue-500">({wishlistItems.length})</span>
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 sm:p-10 text-center text-gray-600">
          <Heart size={50} className="mx-auto mb-4 text-gray-300" />
          <p className="text-base sm:text-lg font-semibold">Your wishlist is empty</p>
          <p className="text-sm mt-1 mb-4">Add some products to see them here!</p>
          <button className="px-6 py-2 text-sm rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-all">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {wishlistItems.map(item => (
              <WishlistItemCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showToast && (
          <motion.div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm shadow-lg z-50 flex items-center space-x-2 ${
              toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {toastType === 'success' ? <Check size={16} /> : <X size={16} />}
            <span>{toastMessage}</span>
            {recentlyDeletedItem && toastType === 'error' && (
              <button
                onClick={handleUndoDelete}
                className="ml-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs hover:bg-opacity-30"
              >
                <div className="flex items-center space-x-1">
                  <RotateCw size={14} />
                  <span>Undo</span>
                </div>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistPage;
