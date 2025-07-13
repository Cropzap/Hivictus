import React from 'react';
import Slider from 'react-slick';
import { FaPlus } from 'react-icons/fa'; // For the Add button icon
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// --- Updated Mock Data for Best Selling Agriculture Products ---
const bestSellingProducts = [
  {
    id: 'agri1',
    name: 'Organic Neem Cake Fertilizer',
    fpoName: 'Green Harvest FPO',
    image: 'https://images.unsplash.com/photo-1621243805936-7c157f7b1d8e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for organic fertilizer
    originalPrice: 450,
    discountedPrice: 380,
    discountPercentage: 15,
    unit: '5 kg bag',
  },
  {
    id: 'agri2',
    name: 'Hybrid Tomato Seeds',
    fpoName: 'Seed Innovations Co.',
    image: 'https://images.unsplash.com/photo-1518843888200-c9772ee5c822?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for seeds
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 17,
    unit: '500 seeds pack',
  },
  {
    id: 'agri3',
    name: 'Bio-Pesticide (Neem Oil Based)',
    fpoName: 'EcoProtect Solutions',
    image: 'https://images.unsplash.com/photo-1588960002150-13d80e1a1b0b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for pesticide
    originalPrice: 700,
    discountedPrice: 595,
    discountPercentage: 15,
    unit: '1 Litre bottle',
  },
  {
    id: 'agri4',
    name: 'Drip Irrigation Kit (Small Farm)',
    fpoName: 'AquaFlow Systems',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for irrigation
    originalPrice: 5500,
    discountedPrice: 4950,
    discountPercentage: 10,
    unit: '1 set',
  },
  {
    id: 'agri5',
    name: 'Organic Vermicompost',
    fpoName: 'Earthworm Farms',
    image: 'https://images.unsplash.com/photo-1604724915609-b4b0e7a2b0c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for compost
    originalPrice: 300,
    discountedPrice: 250,
    discountPercentage: 17,
    unit: '10 kg bag',
  },
  {
    id: 'agri6',
    name: 'Gardening Hand Tool Set',
    fpoName: 'FarmTools Pro',
    image: 'https://images.unsplash.com/photo-1582229239851-a9f4d1e2f7f9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for tools
    originalPrice: 850,
    discountedPrice: 720,
    discountPercentage: 15,
    unit: '5 pieces set',
  },
  {
    id: 'agri7',
    name: 'Coco Peat Blocks',
    fpoName: 'Coir Innovations',
    image: 'https://images.unsplash.com/photo-1626207101865-c3c13d3d6e5a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Another placeholder
    originalPrice: 150,
    discountedPrice: 125,
    discountPercentage: 17,
    unit: '5 blocks',
  },
];

// --- ProductCard Component ---
const ProductCard = ({ product }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden
                    flex flex-col h-full transition-all duration-300 ease-in-out
                    hover:shadow-2xl hover:scale-[1.02] active:scale-98
                    border border-gray-100">
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
          {product.discountPercentage}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-40 sm:h-48 flex items-center justify-center bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 p-2"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/E0E0E0/333333?text=${encodeURIComponent(product.name.split(' ')[0])}`; }}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-4 flex-grow justify-between">
        <div>
          <h3 className="text-gray-900 text-base font-semibold leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          {/* FPO Name - placed below product name, smaller font */}
          <p className="text-gray-600 text-xs font-medium mb-2">{product.fpoName}</p>
          <p className="text-gray-500 text-sm mb-3">{product.unit}</p>
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs line-through">₹{product.originalPrice}</span>
            <span className="text-gray-900 text-lg font-bold">₹{product.discountedPrice}</span>
          </div>
          <button
            className="flex items-center justify-center bg-emerald-600 text-white rounded-full px-4 py-2 text-sm font-semibold
                       shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
            onClick={() => console.log(`Added ${product.name} to cart`)} // Replace with actual add to cart logic
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

// --- BestSellingProducts Component ---
const BestSellingProducts = () => {
  // React-slick settings for the carousel
  const sliderSettings = {
    dots: false, // No dots for a cleaner look, relies on arrows
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Default for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          centerMode: true, // Center the active slide for better visual flow
          centerPadding: '30px', // Padding on sides for partial next/prev slide
          arrows: false, // Hide arrows on smaller screens, rely on swipe
        },
      },
      {
        breakpoint: 640, // sm (mobile)
        settings: {
          slidesToShow: 1.2, // Show 1.2 cards for a better mobile carousel feel
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
          arrows: false,
        },
      },
      {
        breakpoint: 480, // xs (extra small mobile)
        settings: {
          slidesToShow: 1.1, // Even smaller peek for very narrow screens
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '15px',
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="bg-white py-10 sm:py-12 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto"> {/* Container to center content */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Selling Agriculture Products</h2>
          <a href="#" className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors">See All</a>
        </div>

        {/* Products Carousel */}
        <div className="carousel-container">
          <Slider {...sliderSettings}>
            {bestSellingProducts.map((product) => (
              <div key={product.id} className="p-2"> {/* Padding for spacing between cards */}
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default BestSellingProducts;