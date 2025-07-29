import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // For navigation arrows

// Dummy image URLs for specific banners for a more attractive look
const banners = [
  {
    id: 1,
    image: 'data:image/jpeg;base64,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',
    title: 'Go nuts about nuts!',
    description: 'Premium dry fruits delivered to your doorstep.',
    buttonText: 'Shop Now',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    contentPosition: 'left'
  },
  {
    id: 2,
    image: 'data:image/jpeg;base64,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',
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
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'} transition-colors duration-300`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default BannerCarousel;