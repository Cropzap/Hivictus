import React, { useState, useRef, useEffect } from 'react';

const collections = [
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683', // Replace with your actual image paths
    alt: 'Various accessories including an eyelash curler and small scissors',
  },
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683', // Replace with your actual image paths
    alt: 'Pink tube labeled CHADO',
  },
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683', // Replace with your actual image paths
    alt: 'Person holding an eyelash curler',
  },
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683', // Replace with your actual image paths
    alt: 'Pink bottle with a dropper',
  },
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683', // Replace with your actual image paths
    alt: 'Assortment of beauty products and glasses',
  },
  // Add more collection items as needed to test scrolling
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    alt: 'Makeup brushes',
  },
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    alt: 'Skincare products',
  },
  {
    name: 'Coconut',
    image: 'https://exoticfruits.co.uk/cdn/shop/products/coconut-exoticfruitscouk-565414.jpg?v=1645488683',
    alt: 'Perfume bottle',
  },
];

const CollectionsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const itemsPerView = () => {
    // Add check for window to handle SSR if applicable
    if (typeof window === 'undefined') return 3; // Default for SSR or very small, assuming 3 items fit

    if (window.innerWidth >= 1280) { // xl
      return 5;
    } else if (window.innerWidth >= 1024) { // lg
      return 4;
    } else if (window.innerWidth >= 768) { // md
      return 3; // Medium screens and up will also show 3+
    }
    // Default for sm and smaller screens (mobile)
    return 3; // Show 3 items on the smallest screens
  };

  const calculateTransform = () => {
    const itemWidth = scrollContainerRef.current && scrollContainerRef.current.children[0]
      ? scrollContainerRef.current.children[0].offsetWidth
      : 0;
    return `translateX(-${currentIndex * itemWidth}px)`;
  };

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentItemsPerView = itemsPerView();
    const totalItems = collections.length;
    // Max index is adjusted to ensure you don't scroll past the last visible item
    const maxIndex = Math.max(0, totalItems - currentItemsPerView);

    if (direction === 'next') {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  // Adjust scroll position if window is resized
  useEffect(() => {
    const handleResize = () => {
      const currentItemsPerView = itemsPerView();
      const totalItems = collections.length;
      const maxIndex = Math.max(0, totalItems - currentItemsPerView);
      setCurrentIndex((prevIndex) => Math.min(prevIndex, maxIndex));
    };

    // Ensure this only runs in a browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [collections.length]);


  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Our Collections</h2>
        <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center group">
          View All
          <svg
            className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </a>
      </div>

      <div className="relative">
        {/* Navigation Arrows - Only show if there's more to scroll */}
        {currentIndex > 0 && (
          <button
            onClick={() => handleScroll('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Previous collection"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        )}

        {currentIndex < Math.max(0, collections.length - itemsPerView()) && (
          <button
            onClick={() => handleScroll('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next collection"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        )}

        {/* Collection Items Container */}
        <div
          ref={scrollContainerRef}
          className="flex transition-transform ease-in-out duration-500 will-change-transform"
          style={{ transform: calculateTransform() }}
        >
          {collections.map((collection, index) => (
            <div
              key={index}
              // Adjusting widths to show more items on smaller screens
              className="flex-shrink-0 w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 pb-4" // Now w-1/3 for all smaller screens
            >
              <div className="text-center group cursor-pointer">
                <div
                  // Further reduced image sizes for mobile view to fit 3 items
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 mx-auto rounded-full overflow-hidden mb-2 relative
                             transform transition-transform duration-300 group:scale-105 shadow-lg"
                >
                  <img
                    src={collection.image}  
                    alt={collection.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Optional: Add an overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-10 opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Adjusted text size for smaller items */}
                <p className="text-sm sm:text-base font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                  {collection.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;