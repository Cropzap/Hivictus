import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';
// Assuming these utility functions and data imports are correct and accessible
// import { convertTextToURLSlug, getCategoryLink } from '../../utils/helper';
// import AppStoreLogo from '../../assets/images/app-store.webp';
// import PlayStoreLogo from '../../assets/images/play-store.webp';
// import Brands from '../../lib/data/brandsList.json';
// import Categories from '../../lib/data/categories.json';

// --- Mock Data and Helper Functions for standalone example ---
// In a real project, these would come from your actual imports.
const convertTextToURLSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');
const getCategoryLink = (cat) => `/category/${convertTextToURLSlug(cat.title)}`;

const AppStoreLogo = 'https://placehold.co/100x30/000/FFF?text=AppStore';
const PlayStoreLogo = 'https://placehold.co/100x30/000/FFF?text=PlayStore';

const Brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F'];
const Categories = [
  { id: 'cat1', title: 'Electronics' },
  { id: 'cat2', title: 'Fashion' },
  { id: 'cat3', title: 'Home Goods' },
  { id: 'cat4', title: 'Books' },
  { id: 'cat5', title: 'Sports' },
];

// Removed type BrandLink = { ... }

const UsefulLinks = [ // Removed : string[]
  'About Us', 'Careers', 'Blog', 'Press', 'Lead', 'Value',
  'Privacy Policy', 'Terms of Service', 'FAQs', 'Security', 'Mobile App',
  'Contact Us', 'Partner With Us', 'Express Delivery', 'Local Stores',
  'Spotlight', 'Warehouse', 'Delivery Info',
];

const PaymentPartners = [
  { logoName: 'mobikwik', alt: 'MobikWik' },
  { logoName: 'paytm', alt: 'PayTm' },
  { logoName: 'visa', alt: 'Visa' },
  { logoName: 'mastercard', alt: 'Mastercard' },
  { logoName: 'maestro', alt: 'Maestro' },
  { logoName: 'rupay', alt: 'RuPay' },
  { logoName: 'amex', alt: 'American Express' },
  { logoName: 'sodex', alt: 'Sodexo' },
  { logoName: 'bhim', alt: 'BHIM UPI' },
  { logoName: '', alt: 'Net Banking' },
  { logoName: '', alt: 'Cash on Delivery' },
  { logoName: '', alt: 'Zoyokart Cash' }, // Changed 'bringIt cash' to 'Zoyokart Cash' for consistency
];
// --- End Mock Data ---


const Footer = () => {
  const allCategories = Categories.map((cat) => ({
    id: cat.id,
    text: cat.title,
    link: getCategoryLink(cat),
  }));

  const allBrands = Brands.map((brand) => ({ // Removed : BrandLink[]
    text: brand,
    link: convertTextToURLSlug(brand),
  }));

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-12 sm:py-16 font-sans">
      <div className="footer-container space-y-10"> {/* Custom wider container for footer */}

        {/* Top Section: Categories & Useful Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-8 border-b border-gray-700">
          {/* Categories */}
          <div>
            <h4 className="font-bold text-xl text-white mb-5">Categories</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {allCategories.map((cat) => (
                <Link
                  to={cat.link}
                  key={cat.id}
                  className="hover:text-blue-400 transition-colors duration-200"
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
                  to={`/${convertTextToURLSlug(link)}`} // Assuming useful links also have a slug
                  key={i}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="lg:col-span-2"> {/* Brands take more space on larger screens */}
            <h4 className="font-bold text-xl text-white mb-5">Brands</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {allBrands.map((brand, i) => (
                <Link
                  key={i}
                  to={`/brand/${brand.link}`}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  {brand.text}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Partners Section */}
        <div className="border-b border-gray-700 pb-10">
          <h4 className="font-bold text-xl text-white mb-6">Payment Partners</h4>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            {PaymentPartners.map((partner, i) => (
              <div
                key={i}
                className="w-24 h-16 sm:w-28 sm:h-20 flex items-center justify-center p-2 rounded-xl
                           bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg
                           transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                {partner.logoName ? (
                  <img
                    src={`/${partner.logoName}.webp`} // Assuming logos are in public folder
                    alt={partner.alt}
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/60x60/333/FFF?text=${partner.alt.charAt(0)}`; }}
                  />
                ) : (
                  <span className="text-xs text-gray-200 text-center leading-tight">
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
          <div className="text-sm text-gray-400 text-center md:text-left flex-1">
            &copy; Zoyokart Commerce Private Limited (formerly known as Loafers Inc Private Limited), 2016-2025. All rights reserved.
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
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-lg
                         shadow-md transition-all duration-200 hover:bg-white/20 hover:scale-110 border border-white/20"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-lg
                         shadow-md transition-all duration-200 hover:bg-white/20 hover:scale-110 border border-white/20"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-lg
                         shadow-md transition-all duration-200 hover:bg-white/20 hover:scale-110 border border-white/20"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-lg
                         shadow-md transition-all duration-200 hover:bg-white/20 hover:scale-110 border border-white/20"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;