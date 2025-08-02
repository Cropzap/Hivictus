// src/contexts/ToastContext.js (or wherever you manage contexts)
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa'; // For different toast types

const ToastContext = createContext(null);

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // { message: '...', type: 'success' | 'error' | 'info' | 'warning' }

  const showToastMessage = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const toastTimeoutRef = React.useRef(null);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'error': return <FaTimesCircle className="text-red-500 mr-2" />;
      case 'info': return <FaInfoCircle className="text-blue-500 mr-2" />;
      case 'warning': return <FaExclamationCircle className="text-yellow-500 mr-2" />;
      default: return null;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <ToastContext.Provider value={{ showToastMessage }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center min-w-[250px] max-w-sm
                        ${getBackgroundColor(toast.type)} border`}
            role="alert"
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium text-gray-800 flex-grow">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close toast"
            >
              <FaTimesCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};