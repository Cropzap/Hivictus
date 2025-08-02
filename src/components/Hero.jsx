import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Example loader icon

// IMPORTANT: Use high-quality, relevant images for the best visual appeal.
// Ensure these paths are correct relative to your project structure.
// Consider using a CDN for production to improve loading times.
import AgBannerBg1 from '../assets/farm-bg.jpg';
import AgBannerBg2 from '../assets/farm-bg.jpg';
import AgBannerBg3 from '../assets/farm-bg.jpg';

// Dummy data for banner slides - Agriculture Themed
const slides = [
  {
    id: 1,
    title: "Precision Farming",
    subTitle: "Cultivating Tomorrow, Today",
    description: "Leverage data-driven insights for optimal resource management and yield.",
    buttonText: "Discover Technology",
    buttonLink: "/solutions/precision-farming",
    backgroundImage: AgBannerBg1,
    overlayColor: 'rgba(0, 0, 0, 0.45)', // Slightly darker overlay for contrast
  },
  {
    id: 2,
    title: "Sustainable Harvests",
    subTitle: "Nourishing Land & Lives",
    description: "Our eco-friendly methods ensure abundance for generations to come.",
    buttonText: "Our Commitment",
    buttonLink: "/about/sustainability",
    backgroundImage: AgBannerBg2,
    overlayColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker overlay
  },
  {
    id: 3,
    title: "Empowering Growers",
    subTitle: "Growth Beyond Expectations",
    description: "Join a community of forward-thinking farmers and agricultural experts.",
    buttonText: "Join Network",
    buttonLink: "/community",
    backgroundImage: AgBannerBg3,
    overlayColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay
  },
];

const AgBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true); // New state for image loading
  const slideIntervalRef = useRef(null);

  const currentSlideData = slides[currentSlide];

  // Preload images
  useEffect(() => {
    setLoadingImage(true);
    const img = new Image();
    img.src = currentSlideData.backgroundImage;
    img.onload = () => setLoadingImage(false);
    img.onerror = () => {
      console.error("Failed to load banner image:", currentSlideData.backgroundImage);
      setLoadingImage(false); // Still set to false to avoid infinite loading, maybe show fallback
    };
  }, [currentSlideData.backgroundImage]);


  // Variants for content (title, description, button)
  const contentVariants = {
    hidden: { opacity: 0, x: -70 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.12,
        delayChildren: 0.25,
      },
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Variants for the background image animation (subtle zoom/pan and slight movement)
  const backgroundVariants = {
    enter: { opacity: 0, scale: 1.1, y: 15 }, // Start slightly scaled and moved down
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.5, // Slower, more majestic transition
        ease: "easeOut",
      }
    },
    exit: { opacity: 0, scale: 0.9, y: -15, transition: { duration: 1.0, ease: "easeIn" } }, // Exit slightly scaled out and moved up
  };

  // Carousel controls
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play effect
  useEffect(() => {
    // Clear any existing interval to prevent multiple intervals running
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    // Set new interval
    slideIntervalRef.current = setInterval(nextSlide, 7000); // Increased interval for more breathing room

    // Cleanup on component unmount or when currentSlide changes (re-setting interval)
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [nextSlide]); // Depend on nextSlide to ensure interval resets if nextSlide changes (though it's useCallback)

  // Pause/Resume on hover
  const handleMouseEnter = () => { if (slideIntervalRef.current) clearInterval(slideIntervalRef.current); };
  const handleMouseLeave = () => { slideIntervalRef.current = setInterval(nextSlide, 7000); };


  return (
    <div
      className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px]
                 overflow-hidden rounded-2xl
                 shadow-xl
                 flex items-center text-white
                 group" // Add group for hover effects on dots
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false} mode='wait'>
        {/* Loading Spinner */}
        {loadingImage && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-30"
          >
            <Loader2 className="animate-spin text-green-400" size={48} />
          </motion.div>
        )}

        {/* Background Image with animated entry/exit and hover effect */}
        {!loadingImage && (
          <motion.div
            key={currentSlideData.id + '-bg'}
            initial="enter"
            animate="center"
            exit="exit"
            variants={backgroundVariants}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlideData.backgroundImage}
              alt="Agriculture Background"
              className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105" // Subtle zoom on group hover
            />
            {/* Dynamic Overlay for better text readability */}
            <div
              className="absolute inset-0 transition-colors duration-500" // Smooth transition for overlay
              style={{ backgroundColor: currentSlideData.overlayColor }}
            ></div>
          </motion.div>
        )}


        {/* Content Overlay - Left-aligned and centered vertically */}
        {!loadingImage && (
          <motion.div
            key={currentSlideData.id + '-content'}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col items-start text-left
                       w-full max-w-xl
                       ml-6 md:ml-10 lg:ml-16"
          >
            <motion.h2
              variants={itemVariants}
              // clamp() for fluid typography: min, preferred, max
              className="text-[clamp(0.9rem,2vw,1.25rem)] font-semibold uppercase tracking-widest
                         text-lime-300 mb-1.5 md:mb-2.5 drop-shadow-lg
                         font-['Montserrat',_sans-serif]"
            >
              {currentSlideData.subTitle}
            </motion.h2>
            <motion.h1
              variants={itemVariants}
              // clamp() for fluid typography: min, preferred, max
              className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold mb-3 md:mb-4 lg:mb-5
                         leading-tight text-white drop-shadow-2xl
                         font-['Roboto_Slab',_serif]"
            >
              {currentSlideData.title}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              // clamp() for fluid typography: min, preferred, max
              className="text-[clamp(0.8rem,1.8vw,1.125rem)] text-gray-200 max-w-lg mb-6 md:mb-8 lg:mb-10
                         drop-shadow-md font-['Open_Sans',_sans-serif]"
            >
              {currentSlideData.description}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex space-x-4"
            >
              <Link
                to={currentSlideData.buttonLink}
                className="inline-flex items-center justify-center
                           bg-gradient-to-br from-green-600 to-emerald-700
                           hover:from-green-700 hover:to-emerald-800
                           text-white text-[clamp(0.8rem,1.8vw,1.125rem)] font-bold
                           py-2.5 px-6 sm:py-3 sm:px-8 rounded-full
                           transition-all duration-300 ease-out
                           shadow-lg hover:shadow-xl
                           transform hover:scale-105 active:scale-95 // Added active scale
                           border-2 border-transparent hover:border-green-300"
                aria-label={currentSlideData.buttonText}
              >
                {currentSlideData.buttonText}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Dots - More subtle and aligned */}
      <div className="absolute bottom-5 right-6 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.4, backgroundColor: 'rgba(255,255,255,0.9)' }}
            whileTap={{ scale: 0.9 }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-gray-400/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></motion.button>
        ))}
      </div>
    </div>
  );
};

export default AgBanner;