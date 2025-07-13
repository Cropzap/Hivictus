import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // For navigation arrows

// Dummy image URLs for specific banners for a more attractive look
const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1549298418-e21b8b7d9f78?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Go nuts about nuts!',
    description: 'Premium dry fruits delivered to your doorstep.',
    buttonText: 'Shop Now',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    contentPosition: 'left'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582046162128-6a4a7b7d0c3c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Send Some Love',
    description: 'Get up to 33% OFF on gourmet chocolates.',
    buttonText: 'Explore Gifts',
    bgColor: 'bg-amber-800',
    textColor: 'text-white',
    contentPosition: 'left'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1563212839-8134764b1d6f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Stationery & Games Store',
    description: 'Unleash creativity with our premium collection!',
    buttonText: 'Discover Now',
    bgColor: 'bg-purple-700',
    textColor: 'text-white',
    contentPosition: 'left'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1628178873426-38435d883b27?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Flash Deals Await!',
    description: 'Grab incredible discounts on your favorites!',
    buttonText: 'Shop All Deals',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    contentPosition: 'left'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1574885876020-f584f2b988f0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Fresh Veggies!',
    description: 'Farm-fresh vegetables, delivered daily.',
    buttonText: 'Order Fresh',
    bgColor: 'bg-green-700',
    textColor: 'text-white',
    contentPosition: 'left'
  },
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const itemRefs = useRef([]);

  // Calculate the transform value to center the current active card
  const calculateTransform = () => {
    if (!carouselRef.current || itemRefs.current.length === 0) return 0;

    const containerWidth = carouselRef.current.offsetWidth;
    const currentItem = itemRefs.current[currentIndex];

    if (!currentItem) return 0;

    const currentItemOffsetLeft = currentItem.offsetLeft;
    const currentItemWidth = currentItem.offsetWidth;

    // Calculate the target scroll position to center the current item
    const targetScroll = currentItemOffsetLeft - (containerWidth / 2 - currentItemWidth / 2);

    return -targetScroll;
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, banners.length); // Clean up old refs
    // Re-calculate transform when currentIndex changes to ensure smooth centering
    // This also helps on initial load if component mounts after refs are available
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${calculateTransform()}px)`;
    }
  }, [currentIndex, banners.length]); // Depend on currentIndex to re-center on change

  // Adjust carousel position on window resize
  useEffect(() => {
    const handleResize = () => {
      // Re-calculate transform on resize to keep centering the current active item
      // Debounce this in a real-world app for performance
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(${calculateTransform()}px)`;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]); // Also depend on currentIndex so it re-centers correctly if resized while not at index 0

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full overflow-hidden py-6 bg-gray-50 font-sans">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-700 ease-in-out px-4 md:px-8 lg:px-12"
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            ref={(el) => (itemRefs.current[index] = el)} // Store ref to each item
            className={`flex-shrink-0 mx-2 transform transition-all duration-300 ease-in-out
              ${index === currentIndex
                ? 'w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[30vw]' // Active card: wider on mobile, scales down
                : 'w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[25vw] xl:w-[20vw] opacity-70 scale-[0.9]' // Side cards: narrower on mobile, scales down
              }
            `}
          >
            <div
              className={`relative rounded-2xl overflow-hidden shadow-2xl flex items-stretch h-56 sm:h-64 md:h-72 lg:h-80 transform hover:scale-[1.01] transition-transform duration-300
                ${index === currentIndex ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50' : ''} // Highlight active card
              `}
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Optional: Subtle gradient overlay for better text contrast */}
              <div className={`absolute inset-0 bg-gradient-to-t ${banner.textColor === 'text-white' ? 'from-black/50 to-transparent' : 'from-black/30 to-transparent'}`}></div>

              {/* Background overlay - less opaque to let image show more */}
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

      {/* Navigation Arrows */}
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

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'} transition-colors duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;