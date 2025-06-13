import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import ProductOverview from '../components/ProductOverview'

function Home() {
  return (
    <div>
        <Hero/>
        <About/>
        <ProductOverview/>
    </div>
  )
}

export default Home