import React from 'react';

import Hero from '../components/Hero';
import About from '../components/About';
import ProductOverview from '../components/ProductOverview';
import BannerCarousel from '../components/BannerCarousel';
import ProductCategory from '../components/ProductCategory';
import BestSellingProducts from '../components/BestSellingProducts';

import { Tractor, Leaf } from 'lucide-react'; // Using Lucide for icons
import CategoryProductRows from '../components/CategoryProductRows';

function Home() {
  return (
    <div className="relative overflow-hidden bg-green-50 min-h-screen">

      {/* Background leaf icons for aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Leaf className="absolute top-10 left-10 text-green-200 opacity-20 animate-spin-slow" size={100} />
        <Tractor className="absolute bottom-10 right-10 text-green-300 opacity-10 animate-bounce" size={150} />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto mt-12 px-2">
        <div className="animate-fade-in-down">
          <Hero />
        </div>
      </main>

      {/* Banner Carousel */}
      <section className="relative z-10 animate-fade-in-up mt-10">
        <BannerCarousel />
      </section>

      {/* Product Categories */}
      <section className="relative z-10 animate-fade-in-up mt-4">
        <ProductCategory />
      </section>
      <section className="relative z-10 animate-fade-in-up mt-4">
        <CategoryProductRows/>
      </section>

      {/* Best Selling Products */}
      <section className="relative z-10 animate-fade-in-up mt-16 mb-16">
        <BestSellingProducts />
      </section>
    </div>
  );
}

export default Home;
