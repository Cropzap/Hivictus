import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart2, Shield, Users, ArrowRight, CheckCircle, Leaf, Download, X } from 'lucide-react';

const AboutUs = () => {
  const scrollRef = useRef(null);
  const [showSellerAppPopup, setShowSellerAppPopup] = useState(false);

  const { scrollYProgress: sellerAppScrollProgress } = useScroll({
    target: scrollRef,
    offset: ['start end', 'end start'],
  });

  const appImageY = useTransform(sellerAppScrollProgress, [0, 1], ['-10%', '10%']);
  const appImageScale = useTransform(sellerAppScrollProgress, [0, 1], [0.95, 1.05]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    },
    hover: { scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.1)", transition: { type: "spring", stiffness: 300, damping: 20 } },
    tap: { scale: 0.97 }
  };

  const popupVariants = {
    hidden: { x: '100%', y: '100%', opacity: 0, scale: 0.8 },
    visible: {
      x: '0%', y: '0%', opacity: 1, scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5
      }
    },
    exit: {
      x: '100%', y: '100%', opacity: 0, scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5
      }
    }
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-white font-sans text-gray-800">
      

      {/* Main content container */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl pt-28 pb-12">

        {/* Hero Section - A clean welcome */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
            Cultivating the Future of Agriculture
          </h1>
          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Cropzap, we bridge the gap between farmers and businesses, building a resilient and transparent agri-commerce network through technology and innovation.
          </p>
        </motion.div>

        {/* Dedicated Seller Application Download Section */}
        <motion.section
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left: App Image and Heading */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:w-2/3">
            <motion.div
              className="relative w-40 h-auto flex-shrink-0"
              style={{ y: appImageY, scale: appImageScale }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="https://www.cropzap.com/logo/logo_bg.png"
                alt="Cropzap Seller Application"
                className="w-full h-full object-contain rounded-xl shadow-2xl border border-gray-200"
              />
            </motion.div>
            <div className="text-center lg:text-left">
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 leading-tight"
                variants={itemVariants}
                transition={{ delay: 0.2 }}
              >
                Unlock New Opportunities <br /> with Cropzap Seller App
              </motion.h2>
              <motion.p
                className="text-sm text-gray-600 leading-relaxed"
                variants={itemVariants}
                transition={{ delay: 0.4 }}
              >
                Manage your produce, connect with businesses, and access market insights, all from your fingertips.
              </motion.p>
            </div>
          </div>

          {/* Right: Download Button */}
          <motion.div
            className="flex-shrink-0 w-full lg:w-1/3 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.a
              href="/download-seller-app"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg
                         flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out
                         hover:scale-105 active:scale-95 transform cursor-pointer group relative overflow-hidden text-lg"
              whileHover={{ boxShadow: "0 15px 30px rgba(0, 128, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Download Now</span>
              <Download className="w-5 h-5 ml-2 relative z-10" />
              <span className="absolute inset-0 bg-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Our Story Section */}
        <motion.section
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-green-800 mb-5 text-center">Our Story</h2>
          <motion.h3
            className="text-xl font-semibold text-gray-700 mb-3 text-center"
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            The Roots of Agricultural Innovation.
          </motion.h3>
          <motion.p
            className="text-sm text-gray-600 mb-3 leading-relaxed"
            variants={itemVariants}
            transition={{ delay: 0.3 }}
          >
            Combining technology with expert insights. At Cropzap, we believe in the power of data and collaboration. Our platform offers a suite of services, from market data analytics to personalised business intelligence, ensuring our customers stay ahead of market trends and make informed decisions.
          </motion.p>
          <motion.p
            className="text-sm text-gray-600 leading-relaxed italic"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            Join us on this journey to create a more connected and efficient agricultural ecosystem.
          </motion.p>
        </motion.section>

        {/* Vision & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.section
            className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-xl font-bold text-green-700 mb-3">Our Vision</h3>
            <motion.p
              className="text-sm text-gray-600 leading-relaxed"
              variants={itemVariants}
              transition={{ delay: 0.2 }}
            >
              To build a resilient, transparent, and scalable agri-commerce network that guarantees fair pricing for farmers and ensures quality produce for businesses, fostering sustainable agricultural growth.
            </motion.p>
          </motion.section>

          <motion.section
            className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-xl font-bold text-green-700 mb-3">Our Mission</h3>
            <motion.p
              className="text-sm text-gray-600 leading-relaxed"
              variants={itemVariants}
              transition={{ delay: 0.2 }}
            >
              To empower farmers with the knowledge, digital tools, and market access needed to cultivate high-quality crops while ensuring businesses receive fresh, traceable, and ethically sourced produce.
            </motion.p>
          </motion.section>
        </div>

        {/* Founder's Message Section */}
        <motion.section
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-6 border border-gray-100"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="w-full md:w-1/3 flex justify-center">
            <motion.img
              src="https://placehold.co/200x200/edf2f7/4a5568?text=Founder"
              alt="Dharunkumar, Founder & CEO of Cropzap"
              className="rounded-full w-40 h-40 object-cover border-4 border-green-200 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-bold text-green-800 mb-3">Founder's Message</h3>
            <p className="text-base font-semibold text-gray-700 mb-2">I'm Dharunkumar, the Founder and CEO of Cropzap Agri Networks.</p>
            <motion.p
              className="text-sm text-gray-600 leading-relaxed"
              variants={itemVariants}
              transition={{ delay: 0.2 }}
            >
              Our mission is rooted in the belief that technology and data-driven decisions are essential to transforming agriculture. I started this venture with a vision to empower farmers and revolutionize agricultural practices.
            </motion.p>
            <motion.p
              className="text-sm text-gray-600 leading-relaxed mt-3"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              Agriculture is not just the backbone of India's economy but the pathway to realizing the quote by Honorable Prime Minister Narendra Modi, to make the country a $5 trillion economy. With the integration of agricultural technology and innovative commodity exchange models, we aim to secure India's food future while fostering sustainability and economic growth.
            </motion.p>
          </div>
        </motion.section>

        {/* Our Key Values Section */}
        <motion.section
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-green-800 text-center mb-8">Our Key Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Sparkles size={32} className="text-yellow-500" />, title: 'Technology Empowerment', desc: 'Empowering through technology and data-driven solutions' },
              { icon: <BarChart2 size={32} className="text-blue-500" />, title: 'Economic Growth', desc: 'Driving economic growth by supporting India\'s 5 trillion dollar goal' },
              { icon: <Shield size={32} className="text-purple-500" />, title: 'Sustainable Practices', desc: 'Commitment to sustainable and innovative agricultural practices' },
              { icon: <CheckCircle size={32} className="text-green-500" />, title: 'Food Security', desc: 'Enhancing food security through advanced agricultural models' },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center border border-gray-100"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="mb-3">{value.icon}</div>
                <h4 className="text-base font-semibold mb-1 text-gray-900">{value.title}</h4>
                <p className="text-xs text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Value Proposition Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.section
            className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-xl font-bold text-green-700 mb-4">For Farmers</h3>
            <ul className="space-y-3">
              {[
                'Fair Pricing & Market Access: Eliminates unfair price fluctuations and middlemen exploitation',
                'Access to Quality Inputs: Reliable access to high-quality seeds, fertilizers, and farm equipment.',
                'Expert Advisory & Data Insights: AI-powered guidance to improve yield and productivity.',
                'Financial Inclusion: Access to agri-financing, insurance, and digital payment solutions.',
                'Reduced Post-Harvest Losses: Efficient logistics and storage solutions to minimize wastage.',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start text-sm text-gray-600"
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-xl font-bold text-green-700 mb-4">For Businesses</h3>
            <ul className="space-y-3">
              {[
                'Affordable, High-Quality Produce: Direct sourcing from trusted farmers ensures cost-effective procurement.',
                'Timely & Reliable Deliveries: Streamlined logistics enhance business efficiency.',
                'Enhanced Transparency & Traceability: Blockchain-powered verification of product origin and quality.',
                'Reduced Waste & Cost Efficiency: Better inventory management and optimized logistics minimize financial losses.',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start text-sm text-gray-600"
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* The Cropzap CODE Section */}
        <motion.section
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-green-800 text-center mb-8">The Cropzap CODE</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { letter: 'C', title: 'Collaboration', desc: 'Building strong partnerships with farmers, businesses, and stakeholders' },
              { letter: 'O', title: 'Optimization', desc: 'Making every aspect of the supply chain more efficient' },
              { letter: 'D', title: 'Development', desc: 'Committed to continuous growth and improvement' },
              { letter: 'E', title: 'Empowerment', desc: 'Providing tools, data, and support for informed decisions' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center border border-gray-100"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="text-5xl font-extrabold text-green-600 mb-3">{item.letter}</div>
                <h4 className="text-base font-semibold mb-1 text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Highlights / Call to Action */}
        <motion.section
          className="text-center p-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-green-800 mb-3">Innovate with Cropzap</h3>
          <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Join <span className="font-bold text-green-600">Cropzap</span> today and experience the future of agriculture, where data-driven decisions lead to unparalleled success.
          </p>
        </motion.section>
      </main>

      {/* Floating Seller App Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center
                   cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out"
        onClick={() => setShowSellerAppPopup(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
        aria-label="Open Seller Application Info"
      >
        <Download size={28} />
      </motion.button>

      {/* Seller Application Popup */}
      <AnimatePresence>
        {showSellerAppPopup && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 w-full max-w-xs sm:max-w-sm"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={() => setShowSellerAppPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              <img
                src="/Screenshot 2025-06-13 at 8.39.17 PM.jpg"
                alt="Cropzap Seller App Icon"
                className="w-20 h-20 object-contain rounded-lg mb-3 shadow-md border border-gray-100"
              />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Get Cropzap Seller App
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                Streamline your farming business. Manage orders, track inventory, and connect directly with buyers.
              </p>
              <motion.a
                href="/download-seller-app"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-7 rounded-full shadow-lg
                           flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out
                           hover:scale-105 active:scale-95 transform group relative overflow-hidden text-sm"
                whileHover={{ boxShadow: "0 10px 20px rgba(0, 128, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSellerAppPopup(false)}
              >
                <span className="relative z-10">Download Now</span>
                <Download className="w-4 h-4 ml-1.5 relative z-10" />
                <span className="absolute inset-0 bg-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 py-5 text-center text-xs border-t border-gray-200">
        &copy; {new Date().getFullYear()} Cropzap Agri Networks. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutUs;