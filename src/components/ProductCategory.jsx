import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Loader } from 'lucide-react'; // Import Loader icon

// --- MainCategoryCard Component ---
const MainCategoryCard = ({ category, onClick }) => {
  const displayedSubcategories = category.subcategories.slice(0, 4);
  const remainingSubcategoriesCount = category.subcategories.length - displayedSubcategories.length;

  return (
    <div
      className="relative flex flex-col justify-end w-full h-52 sm:h-64 rounded-[2.5rem] shadow-xl cursor-pointer
                 transition-all duration-300 ease-in-out transform overflow-hidden group
                 hover:scale-[1.03] hover:shadow-2xl active:scale-98 active:shadow-lg"
      onClick={() => onClick(category)} // Pass the whole category object
    >
      {/* Subtle Background Image (from mainImage) - visible behind the "glass" */}
      <img
        src={category.mainImage || 'https://placehold.co/300x300/E0E0E0/555555?text=Category'} // Fallback placeholder
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem]" // More rounded
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/E0E0E0/555555?text=${encodeURIComponent(category.name.split(' ')[0])}`; }}
      />

      {/* Subcategory Image Collage - This is the "folder" with liquid glass effect */}
      <div
        className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-3 rounded-[2.5rem]
                   bg-lime-900/20 backdrop-blur-sm border border-lime-200/30 shadow-inner-lg" // Themed glass
      >
        {displayedSubcategories.map((sub, index) => (
          <div
            key={sub._id || index} // Use _id from MongoDB
            className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden // More rounded
                       bg-lime-100/40 border border-lime-200/50 shadow-sm" // Themed background
          >
            <img
              src={sub.image || 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Sub'} // Fallback placeholder
              alt={sub.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl transform transition-transform duration-200 group-hover:scale-110" // More rounded
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/A0A0A0/FFFFFF?text=${encodeURIComponent(sub.name.charAt(0))}`; }}
            />
          </div>
        ))}
        {/* Add placeholders if there are fewer than 4 subcategories to maintain grid structure */}
        {Array.from({ length: 4 - displayedSubcategories.length }).map((_, i) => (
          <div key={`placeholder-${i}`} className="w-full h-full bg-lime-100/30 rounded-2xl flex items-center justify-center text-gray-700 text-xs">
            {/* You can put a generic icon or text here if desired */}
          </div>
        ))}
      </div>

      {/* Content Overlay for Name and Count - now at the bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-4 bg-green-900/70 backdrop-blur-sm group-hover:bg-green-900/85 transition-colors duration-300 rounded-b-[2.5rem]">
        <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight drop-shadow-md">
          {category.name}
        </h3>
        {remainingSubcategoriesCount > 0 && (
          <p className="text-lime-200 text-sm mt-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-200 text-center drop-shadow-sm">
            + {remainingSubcategoriesCount} more
          </p>
        )}
      </div>
    </div>
  );
};

// --- SubCategoryModal Component (Updated for iOS-like UI and Agriculture Theme) ---
const SubCategoryModal = ({ mainCategoryName, subcategories, onClose, onSelectSubCategory }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setVisibleItems([]); // Reset on new subcategories
    subcategories.forEach((sub, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, sub._id]); // Use _id for tracking visibility
      }, 70 * index); // Staggered animation for a smooth entrance
    });
  }, [subcategories]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match with modal-fade-out duration
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60
                  ${isClosing ? 'animate-modal-overlay-fade-out' : 'animate-modal-overlay-fade-in'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-lime-50/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 relative w-11/12 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl
                    max-h-[90vh] overflow-y-auto transform border border-lime-200/50 // Themed border
                    ${isClosing ? 'animate-modal-zoom-out' : 'animate-modal-zoom-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-700 bg-white/50 backdrop-blur-sm transition-colors text-xl p-2 rounded-full shadow-md border border-white/50
                     hover:bg-white/70 active:scale-95"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 text-center drop-shadow-sm">
          {mainCategoryName} <span className="text-lime-600">Subcategories</span>
        </h2>

        {/* Subcategory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {subcategories.map((sub) => (
            <div
              key={sub._id} // Use _id from MongoDB
              className={`
                flex flex-col items-center p-3 sm:p-4 rounded-[2rem] shadow-md cursor-pointer // More rounded, stronger shadow
                bg-lime-100/60 backdrop-blur-sm border border-lime-200/70 // Themed background
                transition-all duration-300 ease-in-out transform
                hover:scale-[1.02] hover:shadow-lg active:scale-98 active:shadow-xl
                ${visibleItems.includes(sub._id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              onClick={() => onSelectSubCategory(sub)}
            >
              {/* Image Container with Padding and object-contain */}
              <div className="w-full h-28 sm:h-32 flex items-center justify-center overflow-hidden rounded-3xl mb-2 bg-green-100/40 p-2 border border-green-200/60"> {/* More rounded */}
                <img
                  src={sub.image || 'https://placehold.co/120x120/E0E0E0/333333?text=Subcategory'} // Fallback placeholder
                  alt={sub.name}
                  className="w-full h-full object-contain rounded-2xl transform transition-transform duration-300 group-hover:scale-105" // More rounded
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/120x120/E0E0E0/333333?text=${encodeURIComponent(sub.name.split(' ')[0])}`; }}
                />
              </div>
              <p className="text-center text-sm sm:text-base font-semibold text-gray-800 leading-tight drop-shadow-sm">
                {sub.name}
              </p>
              {/* If you add item counts to subcategories in your backend, display them here */}
              {/* {sub.items && sub.items.length > 0 && (
                <span className="text-lime-600 text-xs mt-1">({sub.items.length} items)</span>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main ProductCategory Component ---
const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMainCategoryClick = (category) => { // Now receives the full category object
    setSelectedMainCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMainCategory(null);
  };

  const handleSelectSubCategory = (subCategory) => {
    console.log('Subcategory selected:', subCategory.name);
    // Here you would typically navigate to a product listing page
    // e.g., navigate(`/products?category=${selectedMainCategory.name}&subcategory=${subCategory.name}`);
    handleCloseModal();
  };

  // React-slick settings for the carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, centerMode: true, centerPadding: '20px' } },
      { breakpoint: 640, settings: { slidesToShow: 1.5, slidesToScroll: 1, centerMode: true, centerPadding: '20px' } },
      { breakpoint: 480, settings: { slidesToShow: 1.2, slidesToScroll: 1, centerMode: true, centerPadding: '15px' } },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-fit flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-lime-100">
        <Loader className="animate-spin text-lime-600" size={48} />
        <p className="ml-4 text-lg text-gray-700">Loading Categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-fit flex flex-col items-center justify-center p-8 text-red-600 bg-gradient-to-br from-red-50 to-orange-100">
        <FaTimes size={48} className="mb-4" />
        <p className="text-lg font-semibold">Error loading categories: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Please ensure your backend is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="min-h-fit bg-gradient-to-br from-green-50 to-lime-100 font-sans text-gray-800 p-4 sm:p-6 md:p-8 relative pt-20"> {/* Removed min-h-screen, kept pt-20 for navbar clearance */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-green-800 drop-shadow-sm">
        Explore Our Farm-Fresh Categories
      </h1>

      {/* Main Category Carousel */}
      <div className="carousel-container w-full px-4 sm:px-0">
        <Slider {...sliderSettings}>
          {categories.map((category) => (
            <div key={category._id} className="p-2"> {/* Use _id from MongoDB */}
              <MainCategoryCard
                category={category}
                onClick={handleMainCategoryClick}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Subcategory Selection Modal */}
      {isModalOpen && selectedMainCategory && (
        <SubCategoryModal
          mainCategoryName={selectedMainCategory.name}
          subcategories={selectedMainCategory.subcategories}
          onClose={handleCloseModal}
          onSelectSubCategory={handleSelectSubCategory}
        />
      )}
    </div>
  );
};

export default ProductCategory;