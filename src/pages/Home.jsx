import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import ProductOverview from '../components/ProductOverview'
import BannerCarousel from '../components/BannerCarousel'
import ProductCategory from '../components/ProductCategory'
import BestSellingProducts from '../components/BestSellingProducts'

function Home() {
  return (
    <div>
        <Hero/>
        <BannerCarousel/>
        <ProductCategory/>
        <BestSellingProducts/>
        <ProductOverview/>
    </div>
  )
}

export default Home