import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import agriculture-themed background images
// IMPORTANT: Use high-quality, relevant images for the best visual appeal.
// Ensure these paths are correct relative to your project structure.
import AgBannerBg1 from '../assets/farm-bg.jpg'; // Example: Healthy crops, sunrise/sunset
import AgBannerBg2 from '../assets/farm-bg.jpg'; // Example: Modern farming equipment in action
import AgBannerBg3 from '../assets/farm-bg.jpg'; // Example: Farmer's hands holding soil/seedling

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
    overlayColor: 'rgba(0, 0, 0, 0.35)', // Slightly darker overlay
  },
  {
    id: 2,
    title: "Sustainable Harvests",
    subTitle: "Nourishing Land & Lives",
    description: "Our eco-friendly methods ensure abundance for generations to come.",
    buttonText: "Our Commitment",
    buttonLink: "/about/sustainability",
    backgroundImage: AgBannerBg2,
    overlayColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay
  },
  {
    id: 3,
    title: "Empowering Growers",
    subTitle: "Growth Beyond Expectations",
    description: "Join a community of forward-thinking farmers and agricultural experts.",
    buttonText: "Join Network",
    buttonLink: "/community",
    backgroundImage: AgBannerBg3,
    overlayColor: 'rgba(0, 0, 0, 0.3)', // Slightly darker overlay
  },
];

const AgBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  const currentSlideData = slides[currentSlide];

  // Variants for content (title, description, button)
  const contentVariants = {
    hidden: { opacity: 0, x: -70 }, // Increased initial x offset
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7, // Slightly slower entrance
        ease: "easeOut",
        staggerChildren: 0.12, // Fine-tuned stagger
        delayChildren: 0.25, // Slightly longer delay for children
      },
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5, ease: "easeIn" } } // Exit animation
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Variants for the background image animation (subtle zoom/pan and slight movement)
  const backgroundVariants = {
    enter: { opacity: 0, scale: 1.1, y: 10 }, // Start slightly scaled and moved down
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.5, // Slower, more majestic transition
        ease: "easeOut",
      }
    },
    exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 1.0, ease: "easeIn" } }, // Exit slightly scaled out and moved up
  };

  // Carousel controls
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  // Auto-play effect
  useEffect(() => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(nextSlide, 7000); // Increased interval for more breathing room

    return () => { if (slideIntervalRef.current) clearInterval(slideIntervalRef.current); };
  }, [currentSlide]);

  // Pause/Resume on hover
  const handleMouseEnter = () => { if (slideIntervalRef.current) clearInterval(slideIntervalRef.current); };
  const handleMouseLeave = () => { slideIntervalRef.current = setInterval(nextSlide, 7000); };

  return (
    <div
      className="relative w-full h-[220px] md:h-[280px] lg:h-[320px] xl:h-[360px] 2xl:h-[400px] // Slightly increased height for impact
                 overflow-hidden rounded-2xl // More pronounced rounding
                 shadow-xl // Stronger shadow
                 flex items-center text-white
                 group" // Add group for hover effects on dots
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false} mode='wait'>
        {/* Background Image with animated entry/exit and hover effect */}
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

        {/* Content Overlay - Left-aligned and centered vertically */}
        <motion.div
          key={currentSlideData.id + '-content'}
          initial="hidden"
          animate="visible"
          exit="exit" // Use exit from contentVariants for fade out
          variants={contentVariants}
          className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col items-start text-left
                     w-full max-w-xl // Adjusted max-width for content area
                     ml-6 md:ml-10 lg:ml-16 // Increased left margin
                     pointer-events-none" // Allow clicks to pass through to underlying elements like buttons
        >
          <motion.h2
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl font-semibold uppercase tracking-widest // Increased tracking
                       text-lime-300 // Brighter lime color
                       mb-1.5 md:mb-2.5 // Adjusted margin
                       drop-shadow-lg // Stronger drop shadow for emphasis
                       font-['Montserrat',_sans-serif] // Using a clean, modern font if available
                       "
          >
            {currentSlideData.subTitle}
          </motion.h2>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4 lg:mb-5 // Larger font for main title
                       leading-tight // Tighter line height
                       text-white drop-shadow-2xl // Stronger shadow for main title
                       font-['Roboto_Slab',_serif] // A strong, readable serif font
                       "
          >
            {currentSlideData.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base lg:text-lg text-gray-200 max-w-lg mb-6 md:mb-8 lg:mb-10 // Larger description
                       drop-shadow-md // Moderate shadow
                       font-['Open_Sans',_sans-serif] // Readable body font
                       "
          >
            {currentSlideData.description}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex space-x-4 pointer-events-auto" // Re-enable pointer events for buttons
          >
            <Link
              to={currentSlideData.buttonLink}
              className="inline-flex items-center justify-center // Flexbox for centering text
                         bg-gradient-to-br from-green-600 to-emerald-700 // Gradient button
                         hover:from-green-700 hover:to-emerald-800
                         text-white text-base md:text-lg font-bold // Bolder text
                         py-3 px-8 rounded-full // Pill-shaped button
                         transition-all duration-300 ease-out
                         shadow-lg hover:shadow-xl // Stronger shadow
                         transform hover:scale-105 hover:rotate-1 // Subtle rotate on hover
                         border-2 border-transparent hover:border-green-300 // Green border on hover
                         "
            >
              {currentSlideData.buttonText}
              {/* Optional: Add an icon for extra appeal */}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots - More subtle and aligned */}
      <div className="absolute bottom-5 right-6 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.4, backgroundColor: 'rgba(255,255,255,0.9)' }} // More pronounced hover
            whileTap={{ scale: 0.9 }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-gray-400/50 hover:bg-white/70' // Semi-transparent inactive, brighter active
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></motion.button>
        ))}
      </div>
    </div>
  );
};

export default AgBanner;