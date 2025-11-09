import React from 'react';

// PolicySection Component for reusable animated sections
// Note: This component should ideally be in a separate file (e.g., PolicySection.jsx)
// for a real-world application, but is included here for completeness.
const PolicySection = ({ title, content, delay }) => {
  return (
    <div
      className="bg-white/60 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/70 shadow-lg
                 transition-all duration-300 ease-in-out transform
                 hover:shadow-xl hover:scale-[1.005] animate-fade-in" /* Added hover effects and fade-in */
      style={{ animationDelay: `${delay}ms` }} // Apply animation delay
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h2>
      <div
        className="text-gray-700 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};


const ShippingPolicy = () => {
  // Content based on the provided Hivictus Shipping Policy
  const policyContent = [
    {
      title: '1. Shipping Areas',
      content: `We currently deliver only <b>inside Tamilnadu</b>.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Some remote areas may have <b>extended delivery timelines</b>.</li>
        </ul>`,
      delay: '200',
    },
    {
      title: '2. Processing Time',
      content: `Orders are usually processed within <b>1–3 business days</b>.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Delivery timelines vary based on the <b>seller's location</b>, product type, and logistics partner.</li>
        </ul>`,
      delay: '300',
    },
    {
      title: '3. Shipping Charges',
      content: `Shipping charges are calculated at checkout based on <b>weight, distance, and delivery speed</b>.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li><b>Free shipping</b> may be offered on select products or promotional offers.</li>
        </ul>`,
      delay: '400',
    },
    {
      title: '4. Delivery',
      content: `Customers will be able to <b>track the order</b> once the order is confirmed.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Hivictus is <b>not liable for delays</b> due to unforeseen circumstances such as weather, strikes, or <i>force majeure</i> events.</li>
        </ul>`,
      delay: '500',
    },
    {
      title: '5. Lost or Damaged Shipments',
      content: `Report lost or damaged shipments to <b>Customer Support within 12 – 24 hours</b> of delivery.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Replacement or refund will be processed as per our <b>Return & Refund Policy</b>.</li>
        </ul>`,
      delay: '600',
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6 font-sans">
      <div className="max-w-full mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 mt-6 sm:p-8 md:p-10 border border-white/50">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          Shipping Policy – Hivictus 🚚
        </h1>
        <p className="text-gray-700 text-sm sm:text-base mb-8 animate-fade-in animation-delay-100">
          Effective Date: 15.10.2025
          <br/>
          We aim to deliver products efficiently and reliably.
        </p>

        {/* Policy Sections */}
        <div className="space-y-6 sm:space-y-8">
          {policyContent.map((section, index) => (
            <PolicySection
              key={index}
              title={section.title}
              content={section.content}
              delay={section.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;