import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import CarCard from '../components/CarCard';
// import { carsData, brands, fuelTypes, transmissions } from '../data/carsData';

import { getAllCars } from '../services/carService';
import { getCartById,getCarImageUrl } from '../services/carService';
import { formatCurrency } from '../utils/helpers';

const Cars = () => {
  const [filters, setFilters] = useState({
    brand: '',
    fuelType: '',
    transmition: '',
    minPrice: 0,
    maxPrice: 50000,
    seating: '',
    search: '',
  });

  useEffect(() => {
  const fetchCars = async () => {
    const data = await getAllCars();
    console.log("Data from Cars Springboot API : ",data);
    setCars(data);
  };

  fetchCars();
}, []);

const [cars, setCars] = useState([]);

  const [sortBy, setSortBy] = useState('featured');
  const [viewType, setViewType] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  //const brands = [...new Set(cars.map((car) => car.brand))];
const brands = [
  ...new Set(
    cars
      .map((car) => car.brand)
      .filter(Boolean)
  ),
];
const fuelTypes = [
  ...new Set(cars.map((car) => car.fuelType))
];

const transmition = [
  ...new Set(cars.map((car) => car.transmition))
];

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const matchBrand = !filters.brand || car.brand === filters.brand;
      const matchFuel = !filters.fuelType || car.fuelType === filters.fuelType;
      const matchTransmission =
        !filters.transmition || car.transmition === filters.transmition;
      const matchPrice = car.price >= filters.minPrice && car.price <= filters.maxPrice;
      const matchSeating = !filters.seating || car.seating === parseInt(filters.seating);
      const matchSearch =
        !filters.search ||
        car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.brand.toLowerCase().includes(filters.search.toLowerCase());

      return (
        matchBrand &&
        matchFuel &&
        matchTransmission &&
        matchPrice &&
        matchSeating &&
        matchSearch
      );
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [cars, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      fuelType: '',
      transmition: '',
      minPrice: 0,
      maxPrice: 500000,
      seating: '',
      search: '',
    });
  };

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-1">Our Fleet</h1>
          <p className="text-gray-600">
            {filteredCars.length} vehicles available
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-6 rounded-xl card-shadow sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-2xl"
                >
                  <FiX />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Car name or brand"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Fuel Type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">All Types</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Transmission</label>
                <select
                  value={filters.transmition}
                  onChange={(e) => handleFilterChange('transmition', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">All Types</option>
                  {transmition.map((trans) => (
                    <option key={trans} value={trans}>
                      {trans}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Seating</label>
                <select
                  value={filters.seating}
                  onChange={(e) => handleFilterChange('seating', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">All Capacities</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="7">7 Seats</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Price Range: {formatCurrency(filters.minPrice)} - {formatCurrency(filters.maxPrice)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full btn-outline"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center gap-2"
                >
                  <FiFilter /> Filters
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Cars Grid */}
            {filteredCars.length > 0 ? (
              <motion.div
                layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white p-12 rounded-xl text-center">
                <p className="text-xl text-gray-600 mb-4">No cars found matching your filters</p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
