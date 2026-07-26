import React, { createContext, useState, useContext, useEffect } from 'react';
import { cancelBookingApi, getBookingList } from "../services/carService";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [savedCars, setSavedCars] = useState([]);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }

    const storedSavedCars = localStorage.getItem('savedCars');
    if (storedSavedCars) {
      setSavedCars(JSON.parse(storedSavedCars));
    }
  }, []);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    return newBooking;
  };

  // const cancelBooking = async (bookingId) => {
  //   try {

  //     await cancelBooking(bookingId);

  //     getBookingList(); // reload from DB

  //   } catch (error) {

  //     console.error(error);

  //   }
  // };
  
  const cancelBooking = async (bookingId) => {

    const userId = localStorage.getItem("userId");

    try {

      await cancelBookingApi(bookingId, userId);

      const updatedBookings = await getBookingList();

      setBookingList(updatedBookings);

      

    } catch (error) {

      console.error("Cancel Booking Error:", error);

    }
 
    window.location.reload();
  };

  // const cancelBooking = (bookingId) => {
  //   const updated = bookings.filter(b => b.id !== bookingId);
  //   setBookings(updated);
  //   localStorage.setItem('bookings', JSON.stringify(updated));
  // };
  //   const cancelBooking = async (bookingId) => {
  //   const userId = localStorage.getItem("userId");

  //   try {
  //     const updatedBookings = await cancelBookingApi(bookingId, userId);

  //     setBookings(updatedBookings);

  //   } catch (error) {
  //     console.error("Cancel Booking Error:", error);
  //   }
  // };



  const toggleSaveCar = (carId) => {
    const isSaved = savedCars.includes(carId);
    const updated = isSaved
      ? savedCars.filter(id => id !== carId)
      : [...savedCars, carId];
    setSavedCars(updated);
    localStorage.setItem('savedCars', JSON.stringify(updated));
  };

  const isSaved = (carId) => savedCars.includes(carId);

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      cancelBooking,
      savedCars,
      toggleSaveCar,
      isSaved,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
