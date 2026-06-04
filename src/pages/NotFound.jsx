import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowRight } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-white max-w-md"
      >
        {/* 404 Text */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <div className="w-24 h-1 bg-white mx-auto rounded-full" />
        </motion.div>

        {/* Message */}
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-200 mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Suggestions */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-200 mb-4">Here are some helpful links:</p>
          <div className="space-y-2">
            <Link to="/" className="block text-white hover:text-secondary transition-colors">
              ← Back to Home
            </Link>
            <Link to="/cars" className="block text-white hover:text-secondary transition-colors">
              ← Browse Cars
            </Link>
            <Link to="/contact" className="block text-white hover:text-secondary transition-colors">
              ← Contact Support
            </Link>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <FiHome /> Go Home
          </Link>
          <Link
            to="/cars"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all"
          >
            Browse Cars <FiArrowRight />
          </Link>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-10 w-20 h-20 border-2 border-white border-opacity-20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white border-opacity-10 rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default NotFound;
