// export default CarDetails;
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FiChevronLeft, FiChevronRight, FiStar, FiCheck } from "react-icons/fi";

// import {
//   FiChevronLeft,
//   FiChevronRight,
//   FiStar,
//   FiCheck,
// } from 'react-icons/fi';

import {
  getCarById,
  getCartById,
  getAllCarts,
  saveCarToCart,
  deleteCartById,
  getCarImageUrl,
} from "../services/carService";

import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

import { formatCurrency } from "../utils/helpers";
import Toast from "../components/Toast";

const CarDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const { toggleSaveCar } = useBooking();

  const [car, setCar] = useState(null);

  const [images, setImages] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(true);

  const [alreadySaved, setAlreadySaved] = useState(false);

  // FETCH CAR DETAILS
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);

        // TRY NORMAL CAR API
        let data = await getCarById(id);

        // IF NOT FOUND THEN TRY CART API
        if (!data) {
          data = await getCartById(id);
        }

        console.log("Final Car Data :", data);

        if (!data) {
          setLoading(false);
          return;
        }

        setCar(data);

        // IMAGES
        const imgArray = [
          data?.mainImage,
          data?.img1,
          data?.img2,
          data?.img3,
        ].filter(Boolean);

        setImages(imgArray);

        // CHECK ALREADY SAVED
        const savedCars = await getAllCarts();

        const exists = savedCars.some((item) => item.id === data.id);

        setAlreadySaved(exists);
      } catch (error) {
        console.error("Fetch Error :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (alreadySaved) {
        const savedCars = await getAllCarts();

        console.log("Saved Cars :", savedCars);

        const savedCar = savedCars.find((item) => item.id === car.id);

        if (savedCar) {
          await deleteCartById(savedCar.id);

          setAlreadySaved(false);

          toggleSaveCar(car.id);

          setToast({
            message: "Car Removed From Cart",
            type: "danger",
          });
        }

        return;
      }

      await saveCarToCart(car);

      setAlreadySaved(true);

      toggleSaveCar(car.id);

      setToast({
        message: "Car Saved Successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Save Error :", error);

      setToast({
        message: "Operation Failed",
        type: "error",
      });
    }
  };

  // BOOKING
  const handleBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/booking", { state: { car } });
  };

  //   const handleBooking = async () => {

  //   if (!user) {
  //     navigate('/login');
  //     return;
  //   }

  //   try {

  //     const response = await carBooking(car);

  //     console.log("Booking Response :", response);

  //     setToast({
  //       message: "Car Booked Successfully",
  //       type: "success",
  //     });

  //     // optional: booking page वर जायचे असेल तर
  //     navigate('/dashboard');

  //   } catch (error) {

  //     console.error("Booking Error :", error);

  //     setToast({
  //       message: "Booking Failed",
  //       type: "error",
  //     });

  //   }

  // };

  // NEXT IMAGE
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // PREVIOUS IMAGE
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  // NOT FOUND
  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Car Not Found</h1>

          <Link to="/cars" className="btn-primary">
            Back To Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 mb-8 text-gray-600">
          <Link to="/cars" className="hover:text-secondary">
            Cars
          </Link>

          <span>/</span>

          <span className="text-primary font-semibold">{car.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden card-shadow mb-6">
              {/* MAIN IMAGE */}
              <div className="relative h-96 md:h-[500px] bg-gray-200 overflow-hidden">
                {images.length > 0 ? (
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={getCarImageUrl(images[currentImageIndex])}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      console.error(
                        "Main image failed:",
                        event.currentTarget.src,
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    No image available
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    {/* PREVIOUS */}
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow"
                    >
                      <FiChevronLeft />
                    </button>

                    {/* NEXT */}
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow"
                    >
                      <FiChevronRight />
                    </button>
                  </>
                )}

                {images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 rounded">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-4 p-4 overflow-x-auto">
                {images.map((imageName, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 flex-shrink-0 border-2 rounded overflow-hidden ${
                      index === currentImageIndex
                        ? "border-secondary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={getCarImageUrl(imageName)}
                      alt={`thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        console.error(
                          "Thumbnail failed:",
                          event.currentTarget.src,
                        );
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* FEATURES */}
            <div className="bg-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">
                Features & Specifications
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {car.features &&
                  Object.values(car.features).map((feature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <FiCheck className="text-secondary mt-1" />

                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl sticky top-24">
              <h1 className="text-3xl font-bold mb-2">{car.name}</h1>

              {/* RATING */}
              <div className="flex items-center gap-2 mb-4">
                <FiStar className="text-yellow-400" />

                {/* <span>
                  {car.rating} ({car.reviews})
                </span> */}
              </div>

              {/* STATUS */}
              <p
                className={`mb-4 font-bold ${
                  car.status ? "text-green-600" : "text-red-600"
                }`}
              >
                {car.status ? "Available" : "Unavailable"}
              </p>

              {/* DETAILS */}
              <div className="space-y-2 mb-4">
                <p>
                  <span className="font-semibold">Fuel :</span> {car.fuelType}
                </p>

                <p>
                  <span className="font-semibold">Transmission :</span>{" "}
                  {car.transmition}
                </p>

                <p>
                  <span className="font-semibold">Seats :</span> {car.seating}
                </p>
              </div>

              {/* PRICE */}
              <h2 className="text-3xl font-bold text-secondary mb-6">
                {formatCurrency(car.price)}
              </h2>

              {/* BOOK BUTTON */}
              <button
                onClick={handleBooking}
                disabled={!car.status}
                className={`w-full p-3 rounded font-semibold transition-all ${
                  car.status
                    ? "btn-primary"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {car.status ? "Book Now" : "Unavailable"}
              </button>

              {/* SAVE BUTTON */}
              {/* <button
                onClick={handleSave}
                className={`w-full mt-3 border p-3 rounded font-semibold transition-all ${
                  alreadySaved
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                {alreadySaved ? 'Saved' : 'Save Car'}
              </button> */}
              {/* <button
  onClick={handleSave}
  className={`w-full mt-3 p-3 rounded font-semibold transition-all ${
    alreadySaved
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'border hover:bg-gray-100'
  }`}
>
  {alreadySaved ? 'Saved' : 'Save Car'}
</button> */}
              <button
                onClick={handleSave}
                className={`w-full mt-3 p-3 rounded font-semibold transition-all ${
                  alreadySaved
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "border hover:bg-gray-100"
                }`}
              >
                {alreadySaved ? "Saved" : "Save Car"}
              </button>

              {/* DESCRIPTION */}
              <p className="mt-6 text-gray-700">{car.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CarDetails;
