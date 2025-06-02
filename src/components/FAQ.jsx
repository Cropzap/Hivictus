import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react'; // Using Lucide-React for icons

// Dummy data for e-commerce FAQs
const faqData = [
  {
    id: 1,
    question: "What are your shipping options and delivery times?",
    answer: "We offer standard and express shipping. Standard delivery typically takes 5-7 business days, while express delivery arrives in 2-3 business days. Shipping costs vary based on your location and selected option, calculated at checkout."
  },
  {
    id: 2,
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also log into your account and view your order history to find tracking information."
  },
  {
    id: 3,
    question: "What is your return policy?",
    answer: "We accept returns of unused and unworn items within 30 days of purchase. Items must be in their original packaging with tags attached. Please visit our 'Returns' page for detailed instructions on how to initiate a return."
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Google Pay. All transactions are securely processed."
  },
  {
    id: 5,
    question: "Can I change or cancel my order after it's been placed?",
    answer: "We process orders quickly, so changes or cancellations are only possible within a short window after placement (usually a few hours). Please contact our customer service immediately if you need to modify your order."
  },
  {
    id: 6,
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most international destinations. International shipping times and costs vary significantly based on the country. Customs duties and taxes may apply upon delivery, which are the responsibility of the recipient."
  },
  {
    id: 7,
    question: "How do I create an account?",
    answer: "Click on the 'Sign Up' or 'Create Account' link in the top right corner of our website. You'll need to provide your email address and create a password. An account allows for faster checkout, order tracking, and personalized recommendations."
  },
];

const FAQ = () => {
  // State to manage which FAQ item is currently open
  // null means none are open, a number means the FAQ with that ID is open
  const [openId, setOpenId] = useState(null);

  // Function to toggle the open state of an FAQ item
  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id); // Close if already open, open if closed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-3xl border border-gray-200 relative overflow-hidden"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center space-x-3">
          <HelpCircle size={32} className="text-blue-500" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Question Header */}
              <motion.button
                className="w-full text-left p-4 md:p-5 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="text-lg md:text-xl font-semibold text-gray-800">
                  {faq.question}
                </span>
                <motion.div
                  initial={false} // Prevents initial animation on mount
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={24} className="text-gray-600" />
                </motion.div>
              </motion.button>

              {/* Answer Content (Animated) */}
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden" // Important for height animation
                  >
                    <div className="p-4 md:p-5 text-gray-700 leading-relaxed bg-white border-t border-gray-200">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;