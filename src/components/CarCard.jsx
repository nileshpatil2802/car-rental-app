import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { GiGasPump } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/helpers';

const CarCard = ({ car }) => {
  const { isSaved, toggleSaveCar } = useBooking();
  const saved = isSaved(car.id);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl overflow-hidden card-shadow group"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              car.available
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {car.available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Save Button */}
        {/* <button
          onClick={() => toggleSaveCar(car.id)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all"
        >
          <FiHeart
            className={`text-xl ${saved ? 'fill-current text-secondary' : ''}`}
          />
        </button> */}

        {/* Brand Badge */}
        <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-semibold">
          {car.brand}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
          {car.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`text-sm ${
                  i < Math.floor(car.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {car.rating} ({car.reviews} reviews)
          </span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <GiGasPump className="text-secondary" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-secondary" />
            <span>{car.transmition}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-secondary" />
            <span>{car.seating} Seats</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">Per Day</p>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(car.price)}
            </p>
          </div>
          <Link
            to={`/car/${car.id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
