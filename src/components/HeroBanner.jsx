import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HeroBanner = ({ title, subtitle, image, cta, ctaLink }) => {
  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">{subtitle}</p>
          {cta && ctaLink && (
            <Link
              to={ctaLink}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {cta}
              <FiArrowRight />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
