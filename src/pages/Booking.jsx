import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { calculateDays, calculateTotal, formatCurrency, validateEmail, validatePhone } from '../utils/helpers';
import Toast from '../components/Toast';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const car = location.state?.car;
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    licenseNumber: '',
    licenseExpiry: '',
    aadhaarNumber: '',
    insuranceType: 'basic',
    additionalServices: [],
  });

  const [errors, setErrors] = useState({});

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">No Car Selected</h1>
          <button onClick={() => navigate('/cars')} className="btn-primary">
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const days = calculateDays(formData.pickupDate, formData.dropoffDate);
  const subtotal = calculateTotal(car.price, days);
  const insurance = formData.insuranceType === 'premium' ? subtotal * 0.1 : subtotal * 0.05;
  const tax = (subtotal + insurance) * 0.1;
  const total = subtotal + insurance + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!formData.dropoffDate) newErrors.dropoffDate = 'Dropoff date is required';
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation) newErrors.dropoffLocation = 'Dropoff location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License expiry is required';
    if (!formData.aadhaarNumber) newErrors.aadhaarNumber = 'Aadhaar number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleConfirmBooking = () => {
    const booking = {
      carId: car.id,
      carName: car.name,
      carImage: car.image,
      pickupDate: formData.pickupDate,
      dropoffDate: formData.dropoffDate,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      driverName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      days,
      subtotal,
      insurance,
      tax,
      total,
      insuranceType: formData.insuranceType,
    };

    addBooking(booking);
    setToast({
      message: 'Booking confirmed successfully!',
      type: 'success',
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const locations = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Boston'];

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Steps Indicator */}
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      s <= step
                        ? 'bg-secondary text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s < step ? <FiCheck /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-1 transition-all ${
                        s < step ? 'bg-secondary' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Trip Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl card-shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Trip Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pickup Date</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Dropoff Date</label>
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.dropoffDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dropoffDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.dropoffDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Pickup Location</label>
                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    {errors.pickupLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Dropoff Location</label>
                    <select
                      name="dropoffLocation"
                      value={formData.dropoffLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.dropoffLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    {errors.dropoffLocation && (
                      <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Continue <FiArrowRight />
                </button>
              </motion.div>
            )}

            {/* Step 2: Driver Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl card-shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Driver Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10 digit number"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">License Expiry</label>
                    <input
                      type="date"
                      name="licenseExpiry"
                      value={formData.licenseExpiry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.licenseExpiry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.licenseExpiry && (
                      <p className="text-red-500 text-sm mt-1">{errors.licenseExpiry}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      placeholder="12 digit Aadhaar number"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.aadhaarNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    Continue <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl card-shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>

                <div className="space-y-6">
                  {/* Car Details */}
                  <div className="border-b pb-6">
                    <h3 className="font-bold mb-4">Car Details</h3>
                    <div className="flex gap-4">
                      <img src={car.image} alt={car.name} className="w-24 h-24 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-lg">{car.name}</p>
                        <p className="text-gray-600">{car.brand}</p>
                        <p className="text-secondary font-bold">{formatCurrency(car.price)}/day</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="border-b pb-6">
                    <h3 className="font-bold mb-4">Trip Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Pickup</p>
                        <p className="font-semibold">{formData.pickupDate}</p>
                        <p className="text-gray-600">{formData.pickupLocation}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Dropoff</p>
                        <p className="font-semibold">{formData.dropoffDate}</p>
                        <p className="text-gray-600">{formData.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details */}
                  <div className="border-b pb-6">
                    <h3 className="font-bold mb-4">Driver Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Name</p>
                        <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="font-semibold">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="font-semibold">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">License</p>
                        <p className="font-semibold">{formData.licenseNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <FiCheck /> Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl card-shadow sticky top-24">
              <h3 className="text-xl font-bold mb-6">Booking Summary</h3>

              <div className="mb-6 pb-6 border-b">
                <img src={car.mainImage} alt={car.name} className="w-full h-40 rounded-lg object-cover mb-4" />
                <p className="font-bold text-lg">{car.name}</p>
                <p className="text-gray-600">{car.brand}</p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Days</span>
                  <span className="font-semibold">{days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate</span>
                  <span className="font-semibold">{formatCurrency(car.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-semibold">{formatCurrency(insurance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-secondary">{formatCurrency(total)}</span>
              </div>

              <div className="bg-light p-4 rounded-lg text-sm text-gray-600">
                <p>✓ Full insurance included</p>
                <p>✓ Free cancellation up to 24 hours</p>
                <p>✓ 24/7 roadside assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Booking;
