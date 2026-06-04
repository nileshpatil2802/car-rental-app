// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../components/Toast";
import {
  FiUser,
  FiBookmark,
  FiCalendar,
  FiFileText,
  FiEdit,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { getAllCarts, getUserByEmail } from "../services/carService";
//import { saveCarToCart } from '../services/carService';
import { getCartById } from "../services/carService";
import { formatCurrency, formatDate } from "../utils/helpers";
import { updateUser } from "../services/carService";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const { bookings, savedCars, cancelBooking } = useBooking();
  const [activeTab, setActiveTab] = useState("bookings");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  //const [activeTab, setActiveTab] = useState('bookings');
  const [savedCarsData, setSavedCarsData] = useState([]);
  const [loadingSavedCars, setLoadingSavedCars] = useState(true);
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.dropoffDate) > new Date(),
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.dropoffDate) <= new Date(),
  );
  const [showPassword, setShowPassword] = useState(false);

  const fetchSavedCars = async () => {
    try {
      const data = await getAllCarts();

      console.log("Dynamic Saved Cars :", data);

      setSavedCarsData(data);
    } catch (error) {
      console.error("Error fetching saved cars :", error);
    } finally {
      setLoadingSavedCars(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        console.log("No email found in localStorage");
        return;
      }

      const data = await getUserByEmail(email);

      console.log("User Profile:", data);

      setProfileData(data);
      console.log("Password data : ",data.password);


      setEditData({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        email: data?.email || "",
        phone: data?.phone || "",
        avatar: data?.avatar || "",
        role: data?.role || "",
        password: data?.password || "",
      });
      console.log("setEditData : ",setEditData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchSavedCars();
    fetchUserProfile();
  }, []);

  // const handleSaveProfile = () => {
  //   updateProfile(editData);
  //   setIsEditingProfile(false);
  // };
  const handleSaveProfile = async () => {
    try {
      const email = localStorage.getItem("email");

      const response = await updateUser(email, editData);

      console.log("Updated User:", response);

      setProfileData(response);

      setEditData({
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        password: response.password,
      });

      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const tabs = [
    { id: "bookings", label: "My Bookings", icon: FiCalendar },
    { id: "saved", label: "Saved Cars", icon: FiBookmark },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "documents", label: "Documents", icon: FiFileText },
  ];

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="bg-white rounded-xl card-shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={profileData?.avatar}
                alt={profileData?.firstName}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Welcome, {profileData?.firstName || "User"}!
                </h1>

                <p className="text-gray-600">{profileData?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">
                  {bookings.length}
                </p>
                <p className="text-gray-600 text-sm">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">
                  {upcomingBookings.length}
                </p>
                <p className="text-gray-600 text-sm">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">
                  {savedCarsData.length}
                </p>
                <p className="text-gray-600 text-sm">Saved Cars</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-secondary text-white"
                  : "bg-white text-primary hover:bg-gray-100"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Upcoming Bookings */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                  <div className="grid gap-6">
                    {upcomingBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl card-shadow p-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div>
                            <img
                              src={booking.carImage}
                              alt={booking.carName}
                              className="w-full h-40 rounded-lg object-cover"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <h3 className="text-xl font-bold mb-2">
                              {booking.carName}
                            </h3>
                            <div className="space-y-2 text-gray-600">
                              <p>
                                <span className="font-semibold">Pickup:</span>{" "}
                                {formatDate(booking.pickupDate)} at{" "}
                                {booking.pickupLocation}
                              </p>
                              <p>
                                <span className="font-semibold">Dropoff:</span>{" "}
                                {formatDate(booking.dropoffDate)} at{" "}
                                {booking.dropoffLocation}
                              </p>
                              <p>
                                <span className="font-semibold">Duration:</span>{" "}
                                {booking.days} days
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <p className="text-gray-600 text-sm">
                                Total Amount
                              </p>
                              <p className="text-3xl font-bold text-secondary">
                                {formatCurrency(booking.total)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 btn-outline text-sm py-2">
                                Modify
                              </button>
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-xl text-center">
                    <p className="text-gray-600 mb-4">No upcoming bookings</p>
                    <Link to="/cars" className="btn-primary">
                      Browse Cars
                    </Link>
                  </div>
                )}
              </div>

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
                  <div className="grid gap-4">
                    {pastBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-xl p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.carImage}
                            alt={booking.carName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-bold">{booking.carName}</h4>
                            <p className="text-gray-600 text-sm">
                              {formatDate(booking.pickupDate)} -{" "}
                              {formatDate(booking.dropoffDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-secondary font-bold">
                            {formatCurrency(booking.total)}
                          </p>
                          <button className="text-secondary hover:text-red-700 text-sm font-semibold mt-2">
                            Leave Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Cars Tab */}
          {/* {activeTab === 'saved' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Saved Cars</h2>
              {savedCarsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedCarsData.map((car) => (
                    <motion.div
                      key={car.id}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-xl overflow-hidden card-shadow"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{car.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{car.brand}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-secondary font-bold">{formatCurrency(car.price)}/day</p>
                          <Link
                            to={`/car/${car.id}`}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl text-center">
                  <p className="text-gray-600 mb-4">No saved cars yet</p>
                  <Link to="/cars" className="btn-primary">
                    Browse Cars
                  </Link>
                </div>
              )}
            </div>
          )} */}
          {activeTab === "saved" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Saved Cars</h2>

              {loadingSavedCars ? (
                <div className="bg-white p-12 rounded-xl text-center">
                  <p>Loading...</p>
                </div>
              ) : savedCarsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedCarsData.map((car) => (
                    <motion.div
                      key={car.id}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-xl overflow-hidden card-shadow"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{car.name}</h3>

                        <p className="text-gray-600 text-sm mb-2">
                          {car.brand}
                        </p>

                        <p className="text-gray-600 text-sm mb-2">
                          Fuel : {car.fuelType}
                        </p>

                        <p className="text-gray-600 text-sm mb-4">
                          Seats : {car.seating}
                        </p>

                        <div className="flex justify-between items-center">
                          <p className="text-secondary font-bold">
                            {formatCurrency(car.price)}/day
                          </p>

                          <Link
                            to={`/car/${car.id}`}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl text-center">
                  <p className="text-gray-600 mb-4">No saved cars yet</p>

                  <Link to="/cars" className="btn-primary">
                    Browse Cars
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isEditingProfile
                        ? "bg-gray-200 text-primary"
                        : "btn-primary"
                    }`}
                  >
                    <FiEdit />
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-6">
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* <div>
                        <label className="block text-sm font-semibold mb-2">First Name</label>
                        <input
                          type="text"
                          value={editData.firstName}
                          onChange={(e) =>
                            setEditData({ ...editData, firstName: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Last Name</label>
                        <input
                          type="text"
                          value={editData.lastName}
                          onChange={(e) =>
                            setEditData({ ...editData, lastName: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                          type="password"
                          value={editData.password}
                          onChange={(e) =>
                            setEditData({ ...editData, password: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div> */}
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editData.firstName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editData.lastName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Password
                        </label>
                        {/* <input
      type="password"
      value={editData.password}
      onChange={(e) =>
        setEditData({ ...editData, password: e.target.value })
      }
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
    /> */}
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={editData.password}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary"
                          >
                            {showPassword ? (
                              <FiEyeOff size={20} />
                            ) : (
                              <FiEye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiCheck /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* <div>
                        <p className="text-gray-600 text-sm mb-1">First Name</p>
                        <p className="text-lg font-semibold">{profileData?.firstName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Last Name</p>
                        <p className="text-lg font-semibold">{profileData?.lastName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Email</p>
                        <p className="text-lg font-semibold">{profileData?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Phone</p>
                        <p className="text-lg font-semibold">{profileData?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Password</p>
                        <p className="text-lg font-semibold">{profileData?.password || 'Not provided'}</p>
                      </div> */}
                      <div>
                        <p className="text-gray-600 text-sm mb-1">First Name</p>
                        <p className="text-lg font-semibold">
                          {profileData?.firstName}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-1">Last Name</p>
                        <p className="text-lg font-semibold">
                          {profileData?.lastName}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-1">Password</p>
                        <p className="text-lg font-semibold">
                          {profileData?.password || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-1">Email</p>
                        <p className="text-lg font-semibold">
                          {profileData?.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-1">Phone</p>
                        <p className="text-lg font-semibold">
                          {profileData?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                  <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Driving License</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload your driving license
                  </p>
                  <button className="btn-outline text-sm">Upload</button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                  <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Aadhaar Card</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload your Aadhaar card
                  </p>
                  <button className="btn-outline text-sm">Upload</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
