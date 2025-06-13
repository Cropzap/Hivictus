import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, BarChart2, Shield, Users, ArrowRight } from 'lucide-react'; // Added ArrowRight for button

const About = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // More dynamic parallax effects for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']); // Stronger vertical parallax
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);   // Subtle horizontal drift
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);    // More pronounced zoom
  const backgroundRotate = useTransform(scrollYProgress, [0, 1], ['-3deg', '3deg']); // Slight rotation

  // Animation variants for text elements to slide in and fade up
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.2, 0.6, 0.4, 1.0] } }, // Custom easing
  };

  // Staggered animation for child elements (cards)
  const staggerContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Slightly faster stagger
      },
    },
  };

  // Card specific hover and whileInView animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 } // Spring physics for a smoother feel
    },
    hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.3)", transition: { duration: 0.3 } },
    tap: { scale: 0.98 }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100vh] overflow-hidden flex items-center justify-center py-20 px-4 md:px-8 bg-gradient-to-br from-gray-900 to-black font-sans text-white"
    >
      {/* Animated Parallax Background Image */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform" // will-change-transform for browser optimization
        style={{
          y: backgroundY,
          x: backgroundX, // Apply horizontal drift
          scale: backgroundScale,
          rotateZ: backgroundRotate, // Apply rotation
          backgroundImage: `url(/hero1.png)`, // Using hq720.jpg
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Gradient Overlay for professional look and readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Main content container - Enhanced Frosted Glass Effect */}
      <motion.div
        className="relative z-20 max-w-6xl mx-auto p-8 md:p-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-3xl border border-white border-opacity-20 transform transition-all duration-500 ease-out"
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }} // More sophisticated ease for entrance
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 drop-shadow-2xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          Unveiling Our Legacy: The [Your Company Name] Story
        </motion.h2>

        <motion.p
          className="text-sm sm:text-base text-center leading-relaxed mb-10 drop-shadow-lg max-w-4xl mx-auto font-light text-gray-200"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.3 }}
        >
          At **[Your Company Name]**, we are pioneers in innovation, transforming challenges into opportunities. Our journey is built on a foundation of relentless dedication to excellence, fostering a vibrant ecosystem where ideas flourish and exceptional solutions come to life. Discover how we're shaping the future, one brilliant project at a time.
        </motion.p>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 text-center" // Adjust grid for more space
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Mission Card */}
          <motion.div
            className="p-6 bg-white bg-opacity-10 rounded-2xl shadow-xl flex flex-col items-center border border-white border-opacity-15 hover:border-opacity-40 transition-all duration-300 ease-out"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true, amount: 0.4 }}
          >
            <Sparkles size={48} className="text-yellow-400 mb-4 drop-shadow-xl" /> {/* Reduced icon size slightly */}
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white">Our Mission</h3> {/* Reduced font size */}
            <p className="text-xs sm:text-sm leading-relaxed text-gray-200"> {/* Reduced font size */}
              To architect and deliver transformative digital experiences that empower businesses and individuals globally, driving sustainable growth and fostering meaningful connections.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            className="p-6 bg-white bg-opacity-10 rounded-2xl shadow-xl flex flex-col items-center border border-white border-opacity-15 hover:border-opacity-40 transition-all duration-300 ease-out"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true, amount: 0.4 }}
          >
            <BarChart2 size={48} className="text-green-400 mb-4 drop-shadow-xl" />
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white">Our Vision</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-200">
              To be recognized as the global benchmark for innovation and excellence, shaping the future of technology with integrity and unparalleled client success.
            </p>
          </motion.div>

          {/* Values Card */}
          <motion.div
            className="p-6 bg-white bg-opacity-10 rounded-2xl shadow-xl flex flex-col items-center border border-white border-opacity-15 hover:border-opacity-40 transition-all duration-300 ease-out"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true, amount: 0.4 }}
          >
            <Shield size={48} className="text-purple-400 mb-4 drop-shadow-xl" />
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white">Core Values</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-200">
              Integrity, pioneering Innovation, Customer-Centricity, Collaborative Synergy, and an unyielding pursuit of Excellence.
            </p>
          </motion.div>

          {/* Team Card */}
          <motion.div
            className="p-6 bg-white bg-opacity-10 rounded-2xl shadow-xl flex flex-col items-center border border-white border-opacity-15 hover:border-opacity-40 transition-all duration-300 ease-out"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true, amount: 0.4 }}
          >
            <Users size={48} className="text-blue-400 mb-4 drop-shadow-xl" />
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white">Our Exceptional Team</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-200">
              A collective of brilliant minds, diverse talents, and passionate individuals, united by a singular drive to create, innovate, and excel.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-12 text-center"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform" // Reduced button text size
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(255, 100, 0, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Discover Our Story <ArrowRight className="ml-3" size={20} /> {/* Reduced icon size */}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;