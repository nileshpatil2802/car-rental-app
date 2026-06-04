import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { faqs } from '../data/carsData';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-light py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle">Find answers to common questions about our services</p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl overflow-hidden card-shadow"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-light transition-colors"
              >
                <h3 className="text-lg font-bold text-primary text-left">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <FiChevronDown className="text-secondary text-2xl" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="px-8 py-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Didn't find your answer?</h2>
          <p className="text-lg mb-8 text-gray-200">
            Our support team is here to help. Contact us anytime!
          </p>
          <a href="/contact" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
