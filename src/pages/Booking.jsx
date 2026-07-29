// export default Booking;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { calculateDays, calculateTotal, validateEmail } from "../utils/helpers";
import Toast from "../components/Toast";
import {
  getUserByEmail,
  carBooking,
  getCarImageUrl,
} from "../services/carService";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useBooking();

  const car = location.state?.car;

  

  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    pickupDate: "",
    dropoffDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    tripType: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    licenseNumber: "",
    licenseExpiry: "",
    aadhaarNumber: "",
    insuranceType: "basic",
    additionalServices: [],
  });

  const formatRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const validateIndianPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const handleBooking = async () => {
  try {
    const response = await carBooking(bookingData);

    console.log("Booking successful:", response);

    alert("Car booked successfully");
  } catch (error) {
    console.error("Booking failed:", error);

    alert(error.message);
  }
};

  const validateDrivingLicense = (license) => {
    return /^[A-Z]{2}\d{2}\s?\d{11}$/.test(license);
  };

  const isFutureDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const isTodayOrFutureDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const email = localStorage.getItem("email");
      const data = await getUserByEmail(email);

      setProfileData(data);

      setFormData((prev) => ({
        ...prev,
        firstName: data?.firstName || prev.firstName,
        lastName: data?.lastName || prev.lastName,
        email: data?.email || prev.email,
        phone: data?.phone || prev.phone,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">No Car Selected</h1>
          <button onClick={() => navigate("/cars")} className="btn-primary">
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const days = calculateDays(formData.pickupDate, formData.dropoffDate);
  const subtotal = calculateTotal(car.price, days);
  const insurance =
    formData.insuranceType === "premium" ? subtotal * 0.1 : subtotal * 0.05;
  const tax = (subtotal + insurance) * 0.1;
  const total = subtotal + insurance + tax;

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  console.log("Changed field:", name);
  console.log("Changed value:", value);

  let finalValue = value;

  if (name === "aadhaarNumber") {
    finalValue = value.replace(/\D/g, "").slice(0, 12);
  }

  if (name === "phone") {
    finalValue = value.replace(/\D/g, "").slice(0, 10);
  }

  if (name === "licenseNumber") {
    finalValue = value.toUpperCase().slice(0, 16);
  }

  setFormData((prev) => ({
    ...prev,
    [name]: finalValue,
  }));

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
};

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup date is required";
    } else if (!isTodayOrFutureDate(formData.pickupDate)) {
      newErrors.pickupDate = "Pickup date cannot be past date";
    }

    if (!formData.dropoffDate) {
      newErrors.dropoffDate = "Dropoff date is required";
    }

    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);

      if (dropoff <= pickup) {
        newErrors.dropoffDate = "Dropoff date must be after pickup date";
      }
    }

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!formData.dropoffLocation) {
      newErrors.dropoffLocation = "Dropoff location is required";
    }

    if (!formData.tripType) {
      newErrors.tripType = "Trip type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!validateIndianPhone(formData.phone)) {
      newErrors.phone =
        "Enter valid 10 digit Indian mobile number starting with 6, 7, 8, or 9";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "Driving license number is required";
    } else if (!validateDrivingLicense(formData.licenseNumber)) {
      newErrors.licenseNumber =
        "Enter valid license number. Example: MH12 20230012345";
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = "License expiry date is required";
    } else if (!isFutureDate(formData.licenseExpiry)) {
      newErrors.licenseExpiry = "Driving license must not be expired";
    }

    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = "Aadhaar number is required";
    } else if (!validateAadhaar(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar number must be exactly 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      if (formData.tripType === "HIRED_DRIVER") {
        setStep(3);
      } else {
        setStep(2);
      }
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  // const handleConfirmBooking = async () => {
  //   if (formData.tripType === 'SELF_DRIVE' && !validateStep2()) {
  //     setStep(2);
  //     return;
  //   }

  //   const booking = {
  //     carName: car.name,
  //     brand: car.brand,
  //     mainImage: car.mainImage,
  //     price: car.price,

  //     pickupDate: formData.pickupDate,
  //     dropoffDate: formData.dropoffDate,

  //     pickupLocation: formData.pickupLocation,
  //     dropoffLocation: formData.dropoffLocation,

  //     tripType: formData.tripType,

  //     days,
  //     total: Math.round(total),

  //     bookingStatus: 'CONFIRMED',
  //   };

  //   try {
  //     await carBooking(booking);

  //     addBooking(booking);

  //     setToast({
  //       message: 'Booking confirmed successfully!',
  //       type: 'success',
  //     });

  //     setTimeout(() => {
  //       navigate('/dashboard');
  //     }, 2000);
  //   } catch (error) {
  //     console.error('Booking Error:', error);

  //     setToast({
  //       message: 'Booking failed!',
  //       type: 'error',
  //     });
  //   }
  // };
  // const handleConfirmBooking = async () => {
  //   if (formData.tripType === "SELF_DRIVE" && !validateStep2()) {
  //     setStep(2);
  //     return;
  //   }

  //   if (!car?.id) {
  //     setToast({
  //       message: "Car ID is missing. Please select the car again.",
  //       type: "error",
  //     });
  //     return;
  //   }

  //   const booking = {
  //     carId: car.id,

  //     carName: car.name,
  //     brand: car.brand,
  //     mainImage: car.mainImage || car.image,
  //     price: Number(car.price),

  //     pickupDate: formData.pickupDate,
  //     dropoffDate: formData.dropoffDate,

  //     pickupLocation: formData.pickupLocation,
  //     dropoffLocation: formData.dropoffLocation,

  //     tripType: formData.tripType,

  //     days: Number(days),
  //     total: Math.round(total),

  //     bookingStatus: "PENDING",
  //   };

  //   try {
  //     const response = await carBooking(booking);

  //     /*
  //      * Your backend currently returns the updated booking list.
  //      * Therefore, do not directly add the local booking as CONFIRMED.
  //      */
  //     if (Array.isArray(response)) {
  //       const latestBooking = response[response.length - 1];

  //       if (latestBooking) {
  //         addBooking(latestBooking);
  //       }
  //     } else if (response) {
  //       addBooking(response);
  //     }

  //     setToast({
  //       message: "Booking request sent to admin successfully!",
  //       type: "success",
  //     });

  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 2000);
  //   } catch (error) {
  //     console.error("Booking Error:", error.response?.data || error.message);

  //     const errorMessage =
  //       error.response?.data?.message || error.message || "Booking failed!";

  //     setToast({
  //       message: errorMessage,
  //       type: "error",
  //     });
  //   }
  // };
//   const handleConfirmBooking = async () => {
//   if (
//     formData.tripType === "SELF_DRIVE" &&
//     !validateStep2()
//   ) {
//     setStep(2);
//     return;
//   }

//   const actualCarId = car?.carId ?? car?.id;

//   console.log("Complete car object:", car);
//   console.log("Cart ID:", car?.cartId);
//   console.log("Actual car ID:", actualCarId);

//   if (!actualCarId) {
//     setToast({
//       message:
//         "Car ID is missing. Please select the car again.",
//       type: "error",
//     });

//     return;
//   }

//   const booking = {
//     // AdminCarsData ID
//     carId: Number(actualCarId),

//     carName: car.name,
//     brand: car.brand,
//     mainImage: car.mainImage || car.image,
//     price: Number(car.price),

//     pickupDate: formData.pickupDate,
//     dropoffDate: formData.dropoffDate,

//     pickupLocation: formData.pickupLocation,
//     dropoffLocation: formData.dropoffLocation,

//     tripType: formData.tripType,

//     days: Number(days),
//     total: Math.round(total),

//     bookingStatus: "PENDING",
//   };

//   console.log("Booking object before API:", booking);

//   try {
//     const response = await carBooking(booking);

//     if (Array.isArray(response)) {
//       const latestBooking =
//         response[response.length - 1];

//       if (latestBooking) {
//         addBooking(latestBooking);
//       }
//     } else if (response) {
//       addBooking(response);
//     }

//     setToast({
//       message:
//         "Booking request sent to admin successfully!",
//       type: "success",
//     });

//     setTimeout(() => {
//       navigate("/dashboard");
//     }, 2000);
//   } catch (error) {
//     console.error(
//       "Booking Error:",
//       error.response?.data || error.message
//     );

//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Booking failed!";

//     setToast({
//       message: errorMessage,
//       type: "error",
//     });
//   }
// };
// const handleConfirmBooking = async () => {
//   if (
//     formData.tripType === "SELF_DRIVE" &&
//     !validateStep2()
//   ) {
//     setStep(2);
//     return;
//   }

//   const actualCarId = car?.carId ?? car?.id;

//   console.log("Complete car object:", car);
//   console.log("Cart ID:", car?.cartId);
//   console.log("Actual Car ID:", actualCarId);

//   if (!actualCarId) {
//     setToast({
//       message:
//         "Car ID is missing. Please select the car again.",
//       type: "error",
//     });
//     return;
//   }

//   if (!formData.pickupDate) {
//     setToast({
//       message: "Pickup date is required.",
//       type: "error",
//     });
//     setStep(1);
//     return;
//   }

//   if (!formData.dropoffDate) {
//     setToast({
//       message: "Drop-off date is required.",
//       type: "error",
//     });
//     setStep(1);
//     return;
//   }

//   const booking = {
//     carId: Number(actualCarId),
//     pickupDate: formData.pickupDate,
//     dropoffDate: formData.dropoffDate,
//   };

//   console.log("Booking object before API:", booking);

//   try {
//     const response = await carBooking(booking);

//     console.log("Booking API response:", response);

//     if (Array.isArray(response)) {
//       const latestBooking =
//         response[response.length - 1];

//       if (latestBooking) {
//         addBooking(latestBooking);
//       }
//     } else if (response) {
//       addBooking(response);
//     }

//     setToast({
//       message:
//         "Booking request sent to admin successfully!",
//       type: "success",
//     });

//     setTimeout(() => {
//       navigate("/dashboard");
//     }, 2000);
//   } catch (error) {
//     console.error(
//       "Booking Error:",
//       error.response?.data || error.message
//     );

//     const errorMessage =
//       error.response?.data?.message ||
//       error.response?.data ||
//       error.message ||
//       "Booking failed!";

//     setToast({
//       message: errorMessage,
//       type: "error",
//     });
//   }
// };
const handleConfirmBooking = async () => {
  // Validate step 1 fields again before submitting
  if (!validateStep1()) {
    setStep(1);
    return;
  }

  // Validate driver details for self-drive booking
  if (
    formData.tripType === "SELF_DRIVE" &&
    !validateStep2()
  ) {
    setStep(2);
    return;
  }

  const actualCarId = car?.carId ?? car?.id;
  const userId = Number(localStorage.getItem("userId"));

  if (!userId) {
    setToast({
      message: "User ID is missing. Please login again.",
      type: "error",
    });
    return;
  }

  if (!actualCarId) {
    setToast({
      message: "Car ID is missing. Please select the car again.",
      type: "error",
    });
    return;
  }

  // Calculate days safely
  const pickup = new Date(formData.pickupDate);
  const dropoff = new Date(formData.dropoffDate);

  const calculatedDays = Math.ceil(
    (dropoff.getTime() - pickup.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const pricePerDay = Number(car?.price);

  if (
    !Number.isFinite(calculatedDays) ||
    calculatedDays <= 0
  ) {
    setToast({
      message: "Please select valid pickup and drop-off dates.",
      type: "error",
    });
    setStep(1);
    return;
  }

  if (!Number.isFinite(pricePerDay)) {
    setToast({
      message: "Invalid car price.",
      type: "error",
    });
    return;
  }

  const calculatedTotal =
    pricePerDay * calculatedDays;

  const bookingRequest = {
  userId: userId,
  carId: Number(actualCarId),

  pickupDate: formData.pickupDate,
  dropoffDate: formData.dropoffDate,

  pickupLocation: formData.pickupLocation,
  dropoffLocation: formData.dropoffLocation,

  tripDriverType: formData.tripType,

  days: calculatedDays,
  price: pricePerDay,
  total: calculatedTotal,

  bookingStatus: "PENDING",
};

 console.log(
  "Request tripDriverType:",
  bookingRequest.tripDriverType
);
console.log(
  "Complete Booking Request:",
  bookingRequest
);

  try {
    const response = await carBooking(bookingRequest);

    console.log("Booking API response:", response);

    if (Array.isArray(response)) {
      const latestBooking =
        response[response.length - 1];

      if (latestBooking) {
        addBooking(latestBooking);
      }
    } else if (response) {
      addBooking(response);
    }

    setToast({
      message:
        "Booking request sent to admin successfully!",
      type: "success",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  } catch (error) {
    console.error(
      "Booking Error:",
      error.response?.data || error.message
    );

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Booking failed!";

    setToast({
      message: errorMessage,
      type: "error",
    });
  }
};

  const locations = ["Mumbai", "Pune", "Nashik", "Nagpur", "Nandurbar"];

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      s <= step
                        ? "bg-secondary text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {s < step ? <FiCheck /> : s}
                  </div>

                  {s < 3 && (
                    <div
                      className={`w-12 h-1 transition-all ${
                        s < step ? "bg-secondary" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl card-shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Trip Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.pickupDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pickupDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Dropoff Date
                    </label>
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.dropoffDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.dropoffDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dropoffDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Pickup Location
                    </label>
                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.pickupLocation
                          ? "border-red-500"
                          : "border-gray-300"
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pickupLocation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Dropoff Location
                    </label>
                    <select
                      name="dropoffLocation"
                      value={formData.dropoffLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.dropoffLocation
                          ? "border-red-500"
                          : "border-gray-300"
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dropoffLocation}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Trip Type
                    </label>

                    <select
                      name="tripType"
                      value={formData.tripType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.tripType ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Trip Type</option>
                      <option value="SELF_DRIVE">Drive Yourself</option>
                      <option value="HIRED_DRIVER">Hired Driver</option>
                    </select>

                    {errors.tripType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tripType}
                      </p>
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

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl card-shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Driver Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10 digit mobile number"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Driving License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="Example: MH12 20230012345"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.licenseNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      License Expiry
                    </label>
                    <input
                      type="date"
                      name="licenseExpiry"
                      value={formData.licenseExpiry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.licenseExpiry
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.licenseExpiry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.licenseExpiry}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      placeholder="12 digit Aadhaar number"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                        errors.aadhaarNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.aadhaarNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.aadhaarNumber}
                      </p>
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

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl card-shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>

                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="font-bold mb-4">Car Details</h3>

                    <div className="flex gap-4">
                      <img
                        src={getCarImageUrl(car.mainImage)}
                        alt={car.name}
                        className="w-20 h-18 rounded-lg object-contain bg-gray-100 border"
                        onError={(e) => {
                          e.target.src = "/placeholder-car.jpg";
                        }}
                      />

                      <div>
                        <p className="font-bold text-lg">{car.name}</p>
                        <p className="text-gray-600">{car.brand}</p>
                        <p className="text-secondary font-bold">
                          {formatRupees(car.price)}/day
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-6">
                    <h3 className="font-bold mb-4">Trip Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Pickup</p>
                        <p className="font-semibold">{formData.pickupDate}</p>
                        <p className="text-gray-600">
                          {formData.pickupLocation}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm">Dropoff</p>
                        <p className="font-semibold">{formData.dropoffDate}</p>
                        <p className="text-gray-600">
                          {formData.dropoffLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-6">
                    <h3 className="font-bold mb-4">Driver Details</h3>

                    {formData.tripType === "HIRED_DRIVER" ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">Name</p>
                          <p className="font-semibold">
                            {profileData?.firstName} {profileData?.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="font-semibold">{profileData?.email}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Phone</p>
                          <p className="font-semibold">{profileData?.phone}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">Name</p>
                          <p className="font-semibold">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="font-semibold">{formData.email}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Phone</p>
                          <p className="font-semibold">{formData.phone}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">
                            License Number
                          </p>
                          <p className="font-semibold">
                            {formData.licenseNumber}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">
                            License Expiry
                          </p>
                          <p className="font-semibold">
                            {formData.licenseExpiry}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">
                            Aadhaar Number
                          </p>
                          <p className="font-semibold">
                            XXXX XXXX {formData.aadhaarNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() =>
                      setStep(formData.tripType === "HIRED_DRIVER" ? 1 : 2)
                    }
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

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl card-shadow sticky top-24">
              <h3 className="text-xl font-bold mb-6">Booking Summary</h3>

              <div className="mb-6 pb-6 border-b">
                {/* <img
                  src={car.mainImage}
                  alt={car.name}
                  className="w-full h-40 rounded-lg object-cover mb-4"
                /> */}
                <img
                  src={getCarImageUrl(car.mainImage)}
                  alt={car.name}
                  className="w-14 h-12 rounded-lg object-contain bg-gray-100 border"
                  onError={(e) => {
                    e.target.src = "/placeholder-car.jpg";
                  }}
                />

                <p className="font-bold text-lg">{car.name}</p>
                <p className="text-gray-600">{car.brand}</p>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-600">Trip Type</span>
                  <span className="font-semibold">
                    {formData.tripType === "SELF_DRIVE"
                      ? "Drive Yourself"
                      : formData.tripType === "HIRED_DRIVER"
                        ? "Hired Driver"
                        : "Not Selected"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Days</span>
                  <span className="font-semibold">{days}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate</span>
                  <span className="font-semibold">
                    {formatRupees(car.price)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {formatRupees(subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-semibold">
                    {formatRupees(insurance)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax 10%</span>
                  <span className="font-semibold">{formatRupees(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-secondary">
                  {formatRupees(total)}
                </span>
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
