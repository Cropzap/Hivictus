import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6 font-sans">
      <div className="max-w-full mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 mt-6 sm:p-8 md:p-10 border border-white/50">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          Privacy Policy
        </h1>
        <p className="text-gray-700 text-sm sm:text-base mb-8 animate-fade-in animation-delay-100">
          Last Updated: July 20, 2025
        </p>

        {/* Policy Sections */}
        <div className="space-y-6 sm:space-y-8">
          {/* Section 1: Introduction */}
          <PolicySection
            title="1. Introduction"
            content="Welcome to Zoyokart. Your privacy is critically important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By accessing or using our service, you agree to be bound by the terms and conditions of this Privacy Policy."
            delay="200"
          />

          {/* Section 2: Information We Collect */}
          <PolicySection
            title="2. Information We Collect"
            content="We collect various types of information in connection with the services we provide, including:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li><b>Personal Data:</b> Information that can be used to identify you, such as your name, email address, phone number, shipping address, and payment information.</li>
              <li><b>Usage Data:</b> Information collected automatically when you use the service, such as your IP address, browser type, pages visited, and time spent on those pages.</li>
              <li><b>Cookies and Tracking Technologies:</b> We use cookies and similar tracking technologies to track activity on our service and hold certain information.</li>
            </ul>"
            delay="300"
          />

          {/* Section 3: How We Use Your Information */}
          <PolicySection
            title="3. How We Use Your Information"
            content="We use the collected information for various purposes, including to:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li>Provide and maintain our service.</li>
              <li>Process your orders and manage your account.</li>
              <li>Improve, personalize, and expand our service.</li>
              <li>Communicate with you, including for customer support.</li>
              <li>Monitor the usage of our service.</li>
              <li>Detect, prevent, and address technical issues.</li>
            </ul>"
            delay="400"
          />

          {/* Section 4: Sharing Your Information */}
          <PolicySection
            title="4. Sharing Your Information"
            content="We may share your information with third parties in the following situations:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li><b>Service Providers:</b> With vendors, consultants, and other service providers who perform services on our behalf.</li>
              <li><b>Business Transfers:</b> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><b>Legal Requirements:</b> If required to do so by law or in response to valid requests by public authorities.</li>
            </ul>"
            delay="500"
          />

          {/* Section 5: Your Data Protection Rights */}
          <PolicySection
            title="5. Your Data Protection Rights"
            content="Depending on your location, you may have the following data protection rights:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li>The right to access, update, or delete the information we have on you.</li>
              <li>The right of rectification.</li>
              <li>The right to object.</li>
              <li>The right of restriction.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent.</li>
            </ul>
            To exercise any of these rights, please contact us."
            delay="600"
          />

          {/* Section 6: Security of Your Data */}
          <PolicySection
            title="6. Security of Your Data"
            content="The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security."
            delay="700"
          />

          {/* Section 7: Changes to This Privacy Policy */}
          <PolicySection
            title="7. Changes to This Privacy Policy"
            content="We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
            delay="800"
          />

          {/* Section 8: Contact Us */}
          <PolicySection
            title="8. Contact Us"
            content="If you have any questions about this Privacy Policy, please contact us:
            <ul class='list-disc list-inside space-y-1 mt-2 text-sm sm:text-base'>
              <li>By email: privacy@zoyokart.com</li>
              <li>By visiting this page on our website: www.zoyokart.com/contact</li>
            </ul>"
            delay="900"
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

export default PrivacyPolicy;
