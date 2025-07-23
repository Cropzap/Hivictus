import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 mt-6 sm:p-8 md:p-10 border border-white/50">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          Terms and Conditions
        </h1>
        <p className="text-gray-700 text-sm sm:text-base mb-8 animate-fade-in animation-delay-100">
          Effective Date: July 20, 2025
        </p>

        {/* Policy Sections */}
        <div className="space-y-6 sm:space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <PolicySection
            title="1. Acceptance of Terms"
            content="By accessing or using the Zoyokart website and services, you agree to be bound by these Terms and Conditions and all policies referenced herein. If you do not agree to all of these terms, do not use this website or our services."
            delay="200"
          />

          {/* Section 2: Description of Service */}
          <PolicySection
            title="2. Description of Service"
            content="Zoyokart provides an online platform for the sale and purchase of agriculture-related products, including but not limited to fertilizers, seeds, tools, and organic produce. Our service facilitates transactions between buyers and sellers, but we are not responsible for the quality, safety, or legality of products advertised."
            delay="300"
          />

          {/* Section 3: User Accounts */}
          <PolicySection
            title="3. User Accounts"
            content="To access certain features of the service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for any activities or actions under your account."
            delay="400"
          />

          {/* Section 4: Prohibited Activities */}
          <PolicySection
            title="4. Prohibited Activities"
            content="You agree not to engage in any of the following prohibited activities:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li>Violating any laws or regulations.</li>
              <li>Infringing on the rights of others.</li>
              <li>Posting false, inaccurate, misleading, defamatory, or libelous content.</li>
              <li>Distributing viruses or any other technologies that may harm Zoyokart or the interests or property of users.</li>
              <li>Harvesting or otherwise collecting information about users without their consent.</li>
            </ul>"
            delay="500"
          />

          {/* Section 5: Intellectual Property */}
          <PolicySection
            title="5. Intellectual Property"
            content="All content on the Zoyokart website, including text, graphics, logos, images, and software, is the property of Zoyokart or its content suppliers and protected by intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission."
            delay="600"
          />

          {/* Section 6: Disclaimers */}
          <PolicySection
            title="6. Disclaimers"
            content="The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. Zoyokart makes no warranties, expressed or implied, regarding the operation of the service or the information, content, materials, or products included on the service. We do not guarantee that the service will be uninterrupted, secure, or error-free."
            delay="700"
          />

          {/* Section 7: Limitation of Liability */}
          <PolicySection
            title="7. Limitation of Liability"
            content="In no event shall Zoyokart, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service."
            delay="800"
          />

          {/* Section 8: Governing Law */}
          <PolicySection
            title="8. Governing Law"
            content="These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
            delay="900"
          />

          {/* Section 9: Changes to Terms */}
          <PolicySection
            title="9. Changes to These Terms"
            content="We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms."
            delay="1000"
          />

          {/* Section 10: Contact Us */}
          <PolicySection
            title="10. Contact Us"
            content="If you have any questions about these Terms and Conditions, please contact us:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li>By email: legal@zoyokart.com</li>
              <li>By visiting this page on our website: www.zoyokart.com/contact</li>
            </ul>"
            delay="1100"
          />
        </div>
      </div>
    </div>
  );
};

// PolicySection Component for reusable animated sections
const PolicySection = ({ title, content, delay }) => {
  return (
    <div
      className="bg-white/60 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/70 shadow-lg
                 transition-all duration-300 ease-in-out transform
                 hover:shadow-xl hover:scale-[1.005] animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h2>
      <div
        className="text-gray-700 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default TermsAndConditions;
