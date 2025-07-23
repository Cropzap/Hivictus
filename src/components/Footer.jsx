import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaApple, // For App Store
  FaGooglePlay, // For Play Store
} from 'react-icons/fa';

// --- Mock Data and Helper Functions for standalone example ---
// In a real project, these would come from your actual imports.
const convertTextToURLSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');
const getCategoryLink = (cat) => `/category/${convertTextToURLSlug(cat.title)}`;

// Using placeholder images for logos for demonstration
const AppStoreLogo = 'https://placehold.co/100x30/000/FFF?text=AppStore';
const PlayStoreLogo = 'https://placehold.co/100x30/000/FFF?text=PlayStore';

const Brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F'];
const Categories = [
  { id: 'cat1', title: 'Fruits & Vegetables' },
  { id: 'cat2', title: 'Grains & Pulses' },
  { id: 'cat3', title: 'Dairy & Eggs' },
  { id: 'cat4', title: 'Spices & Herbs' },
  { id: 'cat5', title: 'Organic Products' },
  { id: 'cat6', title: 'Farm Equipment' },
];

const UsefulLinks = [
  'About Us', 'Careers', 'Blog', 'Press',
  'Privacy Policy', 'Terms of Service', 'FAQs', 'Security',
  'Contact Us', 'Partner With Us', 'Express Delivery', 'Local Stores',
];

const PaymentPartners = [
  { logoName: 'mobikwik', alt: 'MobikWik' },
  { logoName: 'paytm', alt: 'PayTm' },
  { logoName: 'visa', alt: 'Visa' },
  { logoName: 'mastercard', alt: 'Mastercard' },
  { logoName: 'rupay', alt: 'RuPay' },
  { logoName: 'bhim', alt: 'BHIM UPI' },
  { logoName: '', alt: 'Net Banking' },
  { logoName: '', alt: 'Cash on Delivery' },
];
// --- End Mock Data ---


const Footer = () => {
  const allCategories = Categories.map((cat) => ({
    id: cat.id,
    text: cat.title,
    link: getCategoryLink(cat),
  }));

  const allBrands = Brands.map((brand) => ({
    text: brand,
    link: convertTextToURLSlug(brand),
  }));

  return (
    <footer className="font-sans">
      {/* Desktop Footer - Visible on medium screens and up */}
      <div className="hidden md:block bg-gradient-to-b from-green-900 to-green-950 text-green-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Top Section: Categories, Useful Links, Brands */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-8 border-b border-green-800">
            {/* Categories */}
            <div>
              <h4 className="font-bold text-xl text-white mb-5">Categories</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {allCategories.map((cat) => (
                  <Link
                    to={cat.link}
                    key={cat.id}
                    className="hover:text-emerald-400 transition-colors duration-200"
                  >
                    {cat.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="font-bold text-xl text-white mb-5">Useful Links</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {UsefulLinks.map((link, i) => (
                  <Link
                    to={`/${convertTextToURLSlug(link)}`}
                    key={i}
                    className="hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-xl text-white mb-5">Brands</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {allBrands.map((brand, i) => (
                  <Link
                    key={i}
                    to={`/brand/${brand.link}`}
                    className="hover:text-emerald-400 transition-colors duration-200"
                  >
                    {brand.text} {/* CORRECTED LINE: Render brand.text */}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Partners Section */}
          <div className="border-b border-green-800 pb-10">
            <h4 className="font-bold text-xl text-white mb-6">Payment Partners</h4>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
              {PaymentPartners.map((partner, i) => (
                <div
                  key={i}
                  className="w-24 h-16 sm:w-28 sm:h-20 flex items-center justify-center p-2 rounded-xl
                             bg-green-800/30 backdrop-blur-sm border border-green-700/50 shadow-lg
                             transition-all duration-300 hover:scale-105 hover:bg-green-700/40"
                >
                  {partner.logoName ? (
                    <img
                      src={`/${partner.logoName}.webp`}
                      alt={partner.alt}
                      className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/60x60/333/FFF?text=${partner.alt.charAt(0)}`; }}
                    />
                  ) : (
                    <span className="text-xs text-green-100 text-center leading-tight">
                      {partner.alt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar: Copyright, Download App, Social Media */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
            {/* Copyright */}
            <div className="text-sm text-green-300 text-center md:text-left flex-1">
              &copy; Zoyokart Commerce Private Limited, 2016-2025. All rights reserved.
            </div>

            {/* Download App */}
            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 justify-center md:justify-start">
              <h4 className="font-bold text-lg text-white whitespace-nowrap">
                Download App:
              </h4>
              <div className="flex gap-3">
                <Link to="/download/app-store" className="block">
                  <img
                    src={AppStoreLogo}
                    alt="App store"
                    className="h-9 w-28 object-contain rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                  />
                </Link>
                <Link to="/download/play-store" className="block">
                  <img
                    src={PlayStoreLogo}
                    alt="Play store"
                    className="h-9 w-28 object-contain rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                  />
                </Link>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 flex-1 justify-center md:justify-end">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-green-800/30 backdrop-blur-sm text-white flex items-center justify-center text-lg
                           shadow-md transition-all duration-200 hover:bg-green-700/40 hover:scale-110 border border-green-700/50"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-green-800/30 backdrop-blur-sm text-white flex items-center justify-center text-lg
                           shadow-md transition-all duration-200 hover:bg-green-700/40 hover:scale-110 border border-green-700/50"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-green-800/30 backdrop-blur-sm text-white flex items-center justify-center text-lg
                           shadow-md transition-all duration-200 hover:bg-green-700/40 hover:scale-110 border border-green-700/50"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-green-800/30 backdrop-blur-sm text-white flex items-center justify-center text-lg
                           shadow-md transition-all duration-200 hover:bg-green-700/40 hover:scale-110 border border-green-700/50"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Visible only on small screens */}
      <div className="md:hidden bg-green-900 text-green-100 py-4 px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {/* App Download Links (Icons only for compactness) */}
          <div className="flex gap-4 mb-2">
            <Link to="/download/app-store" aria-label="Download on App Store">
              <FaApple className="text-3xl text-white hover:text-emerald-400 transition-colors" />
            </Link>
            <Link to="/download/play-store" aria-label="Get it on Google Play">
              <FaGooglePlay className="text-3xl text-white hover:text-emerald-400 transition-colors" />
            </Link>
          </div>

          {/* Social Media Links (Icons only) */}
          <div className="flex gap-4 mb-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white text-xl hover:text-emerald-400 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-white text-xl hover:text-emerald-400 transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white text-xl hover:text-emerald-400 transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white text-xl hover:text-emerald-400 transition-colors"
            >
              <FaLinkedinIn />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-green-300">
            &copy; Zoyokart Commerce Private Limited, 2016-2025.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;