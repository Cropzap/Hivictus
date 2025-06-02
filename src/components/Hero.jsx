import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero1 from '../assets/hero1.png'; // Assuming hero1.png is a transparent 3D character

// Dummy data for carousel slides
// **IMPORTANT:** For a proper 3D view effect, ensure your `characterImage` URLs
// point to transparent PNG files of 3D renders.
const slides = [
  {
    id: 1,
    subText: "YOUR STYLE, UNLEASHED",
    titleMain: "Discover Your",
    titleHighlight: "Perfect Look",
    description: "Explore our curated collection of fashion-forward apparel, accessories, and more. Elevate your wardrobe with unique pieces and timeless essentials.",
    buttonPrimaryText: "Shop New Arrivals",
    buttonPrimaryLink: "/products/new-arrivals",
    buttonSecondaryText: "Explore Categories",
    buttonSecondaryLink: "/categories",
    characterImage: Hero1, // Using your local asset
  },
  {
    id: 2,
    subText: "QUALITY MEETS INNOVATION",
    titleMain: "Tech That",
    titleHighlight: "Transforms Lives",
    description: "From cutting-edge gadgets to smart home solutions, elevate your everyday.",
    buttonPrimaryText: "Explore Electronics",
    buttonPrimaryLink: "/products/electronics",
    buttonSecondaryText: "View Deals",
    buttonSecondaryLink: "/deals",
    characterImage: "https://png.pngtree.com/png-vector/20230830/ourmid/pngtree-3d-character-modeling-digital-marketing-online-shoping-illustration-png-image_9190024.png",
  },
  {
    id: 3,
    subText: "TASTE THE DIFFERENCE",
    titleMain: "Gourmet Foods,",
    titleHighlight: "Delivered Fresh",
    description: "Indulge in premium ingredients and artisanal treats from around the world.",
    buttonPrimaryText: "Shop Groceries",
    buttonPrimaryLink: "/products/groceries",
    buttonSecondaryText: "Recipes & More",
    buttonSecondaryLink: "/recipes",
    characterImage: "https://www.datocms-assets.com/71239/1659779361-chef-3d-character-cooking.png", // Using a direct URL for better consistency
  },
  {
    id: 4,
    subText: "HOME COMFORTS, ELEVATED",
    titleMain: "Create Your",
    titleHighlight: "Dream Space",
    description: "Find exquisite furniture, decor, and essentials to style every corner of your home.",
    buttonPrimaryText: "Browse Home Decor",
    buttonPrimaryLink: "/products/home",
    buttonSecondaryText: "Design Inspiration",
    buttonSecondaryLink: "/inspiration",
    characterImage: "https://www.datocms-assets.com/71239/1659779359-house-3d-character-holding-home.png",
  }
];

const Hero = () => {
  // Re-enabled currentSlide state and interval for slideshow
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  // This is the correct and only declaration for currentSlideData
  const currentSlideData = slides[currentSlide];

  // Variants for individual content elements (title, description, buttons)
  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, // Slightly faster
  };

  // Variants for the 3D character image
  // Adjusted for entry/exit animation, not continuous loop
  const characterVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 40, rotateY: 0, rotateX: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateY: 0, // No continuous rotation here, but can be added with whileHover
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.1, // Initial delay for character entry
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: -20, // Move up slightly on exit
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  // Carousel controls
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  // Auto-play effect
  useEffect(() => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(nextSlide, 5000);

    return () => { if (slideIntervalRef.current) clearInterval(slideIntervalRef.current); };
  }, [currentSlide]);

  // Pause/Resume on hover
  const handleMouseEnter = () => { if (slideIntervalRef.current) clearInterval(slideIntervalRef.current); };
  const handleMouseLeave = () => { slideIntervalRef.current = setInterval(nextSlide, 5000); };

  return (
    <div
      className="relative w-full h-[calc(100vh-64px)] bg-[#FBFBF8] flex flex-col md:flex-row overflow-hidden"
      onMouseEnter={handleMouseEnter} // Re-enabled hover pause/resume
      onMouseLeave={handleMouseLeave} // Re-enabled hover pause/resume
    >
      {/* AnimatePresence for the entire slide content to handle transitions between slides */}
      <AnimatePresence initial={false} mode='wait'>
        <motion.div
          key={currentSlideData.id} // Key changes with each slide for AnimatePresence
          initial="enter" // Use 'enter' for the initial state of the incoming slide
          animate="center" // Use 'center' for the active state
          exit="exit" // Use 'exit' for the outgoing slide
          variants={{
            enter: { opacity: 0 },
            center: { opacity: 1 },
            exit: { opacity: 0, position: 'absolute' }, // Keep position absolute for exit
          }}
          transition={{ opacity: { duration: 0.6 } }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row" // Ensure this div takes full space and uses flex
        >
          {/* Left Half - Text Content */}
          <div className="relative z-10 w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center md:items-start justify-center p-6 md:p-12 text-center md:text-left">
            {/* Inner motion.div for text content for staged animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              // No exit here, as the parent motion.div handles slide exit
              className="w-full"
            >
              <motion.p
                variants={contentVariants}
                className="text-xs md:text-sm text-gray-500 uppercase tracking-widest mb-2 md:mb-3"
              >
                {currentSlideData.subText}
              </motion.p>
              <motion.h1
                variants={contentVariants}
                className="text-4xl leading-tight md:text-6xl font-extrabold text-gray-900 mb-3 md:mb-4"
              >
                {currentSlideData.titleMain}{' '}
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600`}
                >
                  {currentSlideData.titleHighlight}
                </span>
              </motion.h1>
              <motion.p
                variants={contentVariants}
                className="text-base md:text-lg text-gray-600 max-w-md mx-auto md:mx-0 mb-6 md:mb-8"
              >
                {currentSlideData.description}
              </motion.p>
              <motion.div
                variants={contentVariants}
                className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full justify-center md:justify-start"
              >
                <Link
                  to={currentSlideData.buttonPrimaryLink}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-auto"
                >
                  {currentSlideData.buttonPrimaryText}
                </Link>
                <Link
                  to={currentSlideData.buttonSecondaryLink}
                  className="inline-block bg-transparent border-2 border-gray-400 hover:border-gray-600 text-gray-700 hover:text-gray-900 text-base font-semibold py-2 px-6 rounded-xl transition-all duration-300 w-full md:w-auto"
                >
                  {currentSlideData.buttonSecondaryText}
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Half - Character Image with 3D Effect */}
          <div
            className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center overflow-hidden"
            style={{ perspective: '1500px' }} // Increased perspective for stronger 3D
          >
            {/* The character motion.img is now directly controlled by AnimatePresence in the main motion.div */}
            <motion.img
              key={currentSlideData.id + '-image'} // Key needs to be unique for each image per slide
              src={currentSlideData.characterImage}
              alt="3D Product Character"
              variants={characterVariants}
              initial="hidden"
              animate="visible"
              exit="exit" // Character also exits when slide changes
              className="relative z-10 w-4/5 md:w-3/4 max-w-sm md:max-w-md h-auto object-contain pointer-events-auto
                         drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
              whileHover={{
                scale: 1.08, // Slightly larger scale on hover
                rotateY: [-5, 5], // More pronounced hover tilt
                rotateX: [3, -3],
                y: [-10, 10], // Slight float on hover
                transition: { duration: 0.3, ease: 'easeOut', repeat: Infinity, repeatType: "mirror" },
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots - Re-enabled */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              index === currentSlide ? 'bg-gray-800' : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></motion.button>
        ))}
      </div>
    </div>
  );
};

export default Hero;