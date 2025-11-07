import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- API Configuration ---
// This URL should point to your backend API endpoint for banners.
const API_URL = 'https://api.hivictus.com/api/banners';

// --- Main Component ---
const BannerApp = () => {
  // --- State Hooks ---
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Ref Hooks for DOM Manipulation ---
  const carouselRef = useRef(null);
  const itemRefs = useRef([]);

  // --- API Function: Fetch Banners ---
  // This function is responsible for getting the banner data from the backend.
  const fetchBanners = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch banners.');
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]); // Ensure 'banners' is always an array to prevent errors
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  // --- Carousel Logic: Navigation and Transformation ---
  // Calculates the 'translateX' value to center the active carousel item.
  const calculateTransform = () => {
    // Return 0 if the carousel or its items aren't ready to prevent errors
    if (!carouselRef.current || itemRefs.current.length === 0 || banners.length === 0) return 0;
    
    const containerWidth = carouselRef.current.offsetWidth;
    const currentItem = itemRefs.current[currentIndex];

    // Check again for the current item to be safe
    if (!currentItem) return 0; 

    const currentItemOffsetLeft = currentItem.offsetLeft;
    const currentItemWidth = currentItem.offsetWidth;
    const targetScroll = currentItemOffsetLeft - (containerWidth / 2 - currentItemWidth / 2);

    return -targetScroll;
  };

  // Navigates to the previous banner in the carousel.
  const goToPrev = () => {
    if (banners.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
    }
  };

  // Navigates to the next banner in the carousel.
  const goToNext = () => {
    if (banners.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    }
  };

  // --- useEffect Hooks ---
  // 1. Initial Data Fetching
  // This hook runs once when the component mounts to fetch the banner data.
  useEffect(() => {
    fetchBanners();
  }, []);

  // 2. Carousel Transformation
  // This hook updates the carousel's position whenever the active banner changes.
  useEffect(() => {
    // Reset the item refs to match the current number of banners
    itemRefs.current = itemRefs.current.slice(0, banners.length);
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${calculateTransform()}px)`;
    }
  }, [currentIndex, banners.length]);

  // 3. Window Resize Listener
  // This hook adjusts the carousel position on window resize for responsiveness.
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(${calculateTransform()}px)`;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, banners]);

  // --- Component Rendering ---
  // Conditional rendering based on loading state and banner data availability.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 font-sans">
        <p className="text-gray-500 text-xl">Loading banners...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full py-20 bg-gray-50 flex justify-center items-center font-sans">
        <p className="text-gray-500 text-lg">No banners available.</p>
      </div>
    );
  }

  // Main carousel JSX
  return (
    <div className="relative w-full overflow-hidden py-6 bg-gray-50 font-sans">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-700 ease-in-out px-4 md:px-8 lg:px-12"
      >
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`flex-shrink-0 mx-2 transform transition-all duration-300 ease-in-out
              ${index === currentIndex
                ? 'w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[30vw]'
                : 'w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[25vw] xl:w-[20vw] opacity-70 scale-[0.9]'
              }
            `}
          >
            <div
              className={`relative rounded-2xl overflow-hidden shadow-2xl flex items-stretch h-56 sm:h-64 md:h-72 lg:h-80 transform hover:scale-[1.01] transition-transform duration-300
                ${index === currentIndex ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50' : ''}
              `}
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-t ${banner.textColor === 'text-white' ? 'from-black/50 to-transparent' : 'from-black/30 to-transparent'}`}></div>
              <div className={`absolute inset-0 ${banner.bgColor} opacity-60`}></div>
              <div className={`relative z-10 flex flex-col justify-end p-4 sm:p-6 pb-6 ${banner.contentPosition === 'left' ? 'items-start' : 'items-end'} w-full`}>
                <div className={`max-w-[80%] ${banner.contentPosition === 'left' ? 'text-left' : 'text-right'} ${banner.textColor}`}>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2 leading-tight drop-shadow-lg">
                    {banner.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 opacity-90 drop-shadow">
                    {banner.description}
                  </p>
                  <button className={`
                    px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold
                    text-sm sm:text-base
                    ${banner.textColor === 'text-white' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}
                    shadow-xl hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5
                  `}>
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute top-1/2 left-2 md:left-4 lg:left-6 -translate-y-1/2 bg-white rounded-full p-2.5 sm:p-3 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:scale-110 transition-transform z-20"
          >
            <FaChevronLeft className="text-gray-700 text-lg sm:text-xl" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 md:right-4 lg:right-6 -translate-y-1/2 bg-white rounded-full p-2.5 sm:p-3 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:scale-110 transition-transform z-20"
          >
            <FaChevronRight className="text-gray-700 text-lg sm:text-xl" />
          </button>
        </>
      )}
    </div>
  );
};

export default BannerApp;
