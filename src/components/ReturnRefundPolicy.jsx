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


const ReturnRefundPolicy = () => {
  // Content based on the provided Hivictus Return & Refund Policy
  const policyContent = [
    {
      title: '1. Eligibility for Returns',
      content: `Products must be returned within <b>3 - 5 days</b> from the date of delivery (specific per category).
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Only <b>defective, damaged, or incorrectly delivered items</b> are eligible for returns.</li>
          <li>Perishable goods (like fresh produce) may have special return terms.</li>
        </ul>`,
      delay: '200',
    },
    {
      title: '2. Return Process',
      content: `Contact our Customer Support via <b>email or phone</b> with your order details.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Provide <b>photos or proof</b> if the product is defective/damaged.</li>
          <li>Hivictus will provide a <b>return authorization</b> and instructions for shipment.</li>
        </ul>`,
      delay: '300',
    },
    {
      title: '3. Refunds',
      content: `Refunds will be processed to the <b>original payment method</b> or through <b>redeem code</b> or as <b>wallet credit</b>.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Processed within <b>7–10 business days</b> after we receive the returned product.</li>
          <li>Shipping charges are <b>non-refundable</b> unless the return is due to our error.</li>
        </ul>`,
      delay: '400',
    },
    {
      title: '4. Cancellation',
      content: `Orders can be cancelled <b>before dispatch</b>.
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Once shipped, cancellations will follow the <b>return process</b>.</li>
        </ul>`,
      delay: '500',
    },
    {
      title: '5. Exceptions',
      content: `The following items are <b>not eligible</b> for return or refund:
        <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
          <li>Products <b>used or altered</b> by the customer.</li>
          <li>Any misuse or negligence <b>voids</b> the return/refund eligibility.</li>
        </ul>`,
      delay: '600',
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6 font-sans">
      <div className="max-w-full mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 mt-6 sm:p-8 md:p-10 border border-white/50">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          Return & Refund Policy – Hivictus
        </h1>
        <p className="text-gray-700 text-sm sm:text-base mb-8 animate-fade-in animation-delay-100">
          Effective Date: 15.10.2025
          <br/>
          At Hivictus, we strive to ensure a seamless experience for our customers. Please read our Return & Refund Policy carefully.
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

export default ReturnRefundPolicy;