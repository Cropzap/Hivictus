import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Truck,
  ShieldCheck, 
  Mail, 
  Loader, 
  Youtube,
} from 'lucide-react';

// --- Configuration and Helper Functions ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
const CATEGORIES_API_URL = `${API_BASE_URL}/categories`;
const DISPLAY_CATEGORY_COUNT = 5; // Display only the first 5 categories in the footer

// Helper to convert text to a URL-friendly slug
const convertTextToURLSlug = (text) => (text || '').toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

// Function to map link text directly to the provided routes
const mapLinkToRoute = (text) => {
  const slug = convertTextToURLSlug(text);
  
  // Custom static routes
  if (slug.includes('privacy-policy')) return '/privacy-policy';
  if (slug.includes('terms-and-conditions')) return '/terms-and-conditions';
   if (slug.includes('refund-policy')) return '/refund-policy';
    if (slug.includes('shipping-policy')) return '/shipping-policy';
  if (slug.includes('faq')) return '/faq';
  if (slug.includes('about-us')) return 'https://www.hivictus.com/our-story';
  if (slug.includes('contact-us') || slug.includes('support')) return '/support'; 
  
  // Default mapping
  return `/${slug}`;
};

// --- Static Link Data (As in your original component) ---
const CompanyLinks = [
  { text: 'About Us', link: mapLinkToRoute('About Us') }, 
  { text: 'Products', link: mapLinkToRoute('products') }, 
  { text: 'Orders', link: mapLinkToRoute('Orders') },
];

const CustomerServiceLinks = [
  { text: 'Privacy Policy', link: mapLinkToRoute('Privacy Policy') }, 
  { text: 'Terms & Conditions', link: mapLinkToRoute('Terms and Conditions') },
  { text: 'Refund Policy', link: mapLinkToRoute('Refund Policy') }, 
  { text: 'Shipping Policy', link: mapLinkToRoute('Shipping Policy') }, 
  { text: 'FAQs', link: mapLinkToRoute('FAQ') }, 
  { text: 'Support', link: mapLinkToRoute('Support') }, 
];

const FeatureLinks = [
  { text: 'Express Delivery', link: mapLinkToRoute(''), icon: Truck }, 
  { text: 'Security & Trust', link: mapLinkToRoute(''), icon: ShieldCheck },
];

// --- Footer Component ---
const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch categories from the configured API URL
    const loadCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // **IMPORTANT:** Assuming the API returns an ARRAY of category objects.
        // If it returns a single object like the one you provided, you'd wrap it in an array:
        // const rawData = await response.json();
        // const data = Array.isArray(rawData) ? rawData : [rawData];
        
        const data = await response.json();

        // 🎯 FIX: Filter out categories where the 'name' field is missing or invalid.
        // We are now looking for the 'name' field as per your data model.
        const validCategories = data.filter(cat => cat && cat.name);
        
        // 🎯 FIX: Map the data to a consistent structure for the component to use.
        // This is a good practice to protect the component from backend changes.
        const mappedCategories = validCategories.map(cat => ({
            id: cat._id.$oid,
            // **Key Change: Using 'name' from your data model**
            name: cat.name,
            slug: convertTextToURLSlug(cat.name),
            image: cat.mainImage // Optional: Keep the image link
        }));
        
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories from backend:", error.message);
        setCategories([]); 
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Generates a link to the products page filtered by category
  const getCategoryLink = (cat) => {
    // Links to /products route using a query parameter for filtering
    return `/products?category=${cat.slug}`;
  };

  return (
    <footer className="font-sans bg-gray-950 text-gray-300 border-t border-gray-800 shadow-2xl">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">

        {/* Top Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-6 pb-8 border-b border-gray-800">

          {/* Column 1: Shop Categories (Backend Data) */}
          <div className="col-span-1">
            <h4 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              {isLoading && (
                <li className="text-gray-500 flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin text-emerald-500" />
                  Loading categories...
                </li>
              )}
              {!isLoading && categories.length === 0 && (
                <li className="text-red-400">
                  No categories found.
                </li>
              )}
              
              {/* Display minimal categories with corrected 'name' field */}
              {categories.slice(0, DISPLAY_CATEGORY_COUNT).map((cat) => (
                // Using cat.id is safer for keys, assuming it's available after mapping
                <li key={cat.id || cat.slug}>
                  <Link
                    to={getCategoryLink(cat)}
                    className="hover:text-emerald-400 transition-colors duration-200 block"
                  >
                    {/* **Key Change: Displaying cat.name** */}
                    {cat.name}
                  </Link>
                </li>
              ))}
              
              {/* Optional: Add a "View All" link if there are more than 5 */}
              {categories.length > DISPLAY_CATEGORY_COUNT && (
                 <li className="pt-2">
                    <Link
                        to="/products"
                        className="text-emerald-500 font-medium hover:text-emerald-400 transition-colors duration-200 block"
                    >
                        View All Categories &rarr;
                    </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Column 2: Company Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              {CompanyLinks.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="hover:text-emerald-400 transition-colors duration-200 block"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              {CustomerServiceLinks.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="hover:text-emerald-400 transition-colors duration-200 block"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Key Features & Contact */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Our Commitment</h4>
            <ul className="space-y-3 text-sm">
              {FeatureLinks.map((item, index) => (
                <li key={index} className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3 text-emerald-500" />
                  <Link 
                    to={item.link} 
                    className="hover:text-emerald-400 transition-colors duration-200"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
              <li className="flex items-center pt-3">
                  <Mail className="w-5 h-5 mr-3 text-emerald-500" />
                  <a 
                    href="mailto:support@shopname.com" 
                    className="hover:text-emerald-400 transition-colors duration-200"
                  >
                    info@hivictus.com
                  </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row md:justify-between items-center pt-8">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Hivictus. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.facebook.com/hivictuspvtltd/" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://x.com/Hivictuspvtltd" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/hivictuspvtltd/" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/company/hivictus/" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200">
              <Linkedin className="w-5 h-5" />
            </a>
             <a href="https://www.youtube.com/@hivictuspvtltd" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;