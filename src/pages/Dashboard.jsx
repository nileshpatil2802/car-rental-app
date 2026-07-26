import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DocumentStamp from "../components/DocumentStamp";

import {
  FiUser,
  FiBookmark,
  FiCalendar,
  FiFileText,
  FiEdit,
  FiX,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";

import {
  getAllCarts,
  getUserByEmail,
  updateUser,
  uploadDocuments,
  getBookingList,
  getUserDocuments,
} from "../services/carService";

import { formatCurrency, formatDate } from "../utils/helpers";

const Dashboard = () => {
  const { user } = useAuth();
  const { cancelBooking } = useBooking();

  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [activeTab, setActiveTab] = useState(
    isAdmin ? "adminCars" : "bookings",
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [bookingList, setBookingList] = useState([]);
  const [licenseFile, setLicenseFile] = useState(null);
  const [aadhharFile, setAadhharFile] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);

  const normalizedDocumentStatus = (() => {
    const rawStatus =
      documentsData?.status ??
      documentsData?.documentStatus ??
      documentsData?.verificationStatus ??
      "PENDING";

    const status = String(rawStatus).trim().toUpperCase();

    if (status === "ACCEPT" || status === "ACCEPTED" || status === "APPROVED") {
      return "ACCEPT";
    }

    if (status === "REJECT" || status === "REJECTED") {
      return "REJECT";
    }

    return "PENDING";
  })();

  const [savedCarsData, setSavedCarsData] = useState([]);
  const [loadingSavedCars, setLoadingSavedCars] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookingList.filter((b) => {
    const dropoff = new Date(b.dropoffDate);
    dropoff.setHours(0, 0, 0, 0);
    return dropoff >= today;
  });

  const pastBookings = bookingList.filter((b) => {
    const dropoff = new Date(b.dropoffDate);
    dropoff.setHours(0, 0, 0, 0);
    return dropoff < today;
  });

  // const fetchUserDocuments = async () => {
  //   try {
  //     const data = await getUserDocuments();
  //     setDocumentsData(data);
  //   } catch (error) {
  //     console.error("Fetch documents error:", error);
  //   }
  // };

  const fetchUserDocuments = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in localStorage");
        setDocumentsData(null);
        return;
      }

      const response = await getUserDocuments();

      console.log("Complete user document response:", response);

      /*
      Supports these response formats:

      1. Direct object:
         { id, status, drivingLicense, aadhharCard }

      2. Axios response:
         { data: { id, status, ... } }

      3. Array:
         [{ id, status, ... }]
    */

      let documentData = response;

      if (response?.data) {
        documentData = response.data;
      }

      if (Array.isArray(documentData)) {
        documentData =
          documentData.length > 0
            ? documentData[documentData.length - 1]
            : null;
      }

      if (!documentData) {
        console.error("No document record received");
        setDocumentsData(null);
        return;
      }

      const receivedStatus =
        documentData.status ??
        documentData.documentStatus ??
        documentData.verificationStatus ??
        "PENDING";

      const correctedDocumentData = {
        ...documentData,
        status: String(receivedStatus).trim().toUpperCase(),
      };

      console.log("Document selected for Dashboard:", correctedDocumentData);

      console.log(
        "Status received by Dashboard:",
        correctedDocumentData.status,
      );

      setDocumentsData(correctedDocumentData);
    } catch (error) {
      console.error(
        "Fetch documents error:",
        error.response?.data || error.message,
      );

      setDocumentsData(null);
    }
  };

  // useEffect(() => {
  //   if (activeTab === "viewDocuments") {
  //     fetchUserDocuments();
  //   }
  // }, [activeTab]);
  useEffect(() => {
    const refreshDocumentsOnFocus = () => {
      if (activeTab === "viewDocuments") {
        fetchUserDocuments();
      }
    };

    window.addEventListener("focus", refreshDocumentsOnFocus);

    return () => {
      window.removeEventListener("focus", refreshDocumentsOnFocus);
    };
  }, [activeTab]);

  const fetchBookingList = async () => {
    try {
      const data = await getBookingList();
      setBookingList(data);
    } catch (error) {
      console.error("Error Fetching Bookings :", error);
    }
  };

  const fetchSavedCars = async () => {
    try {
      const data = await getAllCarts();
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

      if (!email) return;

      const data = await getUserByEmail(email);
      setProfileData(data);

      setEditData({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        email: data?.email || "",
        phone: data?.phone || "",
        password: data?.password || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleDocumentSubmit = async () => {
    if (!licenseFile || !aadhharFile) {
      alert("Please select both Driving License and Aadhaar Card");
      return;
    }

    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("drivingLicense", licenseFile);
    formData.append("aadhharCard", aadhharFile);

    try {
      await uploadDocuments(formData);
      alert("Documents uploaded successfully");

      setLicenseFile(null);
      setAadhharFile(null);
      setActiveTab("viewDocuments");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Document upload failed");
    }
  };

  useEffect(() => {
    fetchUserProfile();

    if (!isAdmin) {
      fetchSavedCars();
      fetchBookingList();
    } else {
      setLoadingSavedCars(false);
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await updateUser(email, editData);

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

  const userTabs = [
    { id: "bookings", label: "My Bookings", icon: FiCalendar },
    { id: "saved", label: "Saved Cars", icon: FiBookmark },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "documents", label: "Documents", icon: FiFileText },
    { id: "viewDocuments", label: "View Documents", icon: FiFileText },
  ];

  const adminTabs = [
    { id: "adminCars", label: "Car Management", icon: FiFileText },
    { id: "adminUsers", label: "Users", icon: FiUser },
    { id: "adminBookings", label: "Bookings", icon: FiCalendar },
    { id: "adminDocuments", label: "Documents", icon: FiFileText },
    { id: "profile", label: "Profile", icon: FiUser },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container-custom">
        <div className="bg-white rounded-xl card-shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={profileData?.avatar}
                alt={profileData?.firstName || "User"}
                className="w-20 h-20 rounded-full object-cover"
              />

              <div>
                <h1 className="text-3xl font-bold text-primary">
                  {isAdmin
                    ? "Admin Dashboard"
                    : `Welcome, ${profileData?.firstName || "User"}!`}
                </h1>

                <p className="text-gray-600">
                  {isAdmin
                    ? "Manage cars, users, bookings, documents and revenue"
                    : profileData?.email}
                </p>
              </div>
            </div>

            {isAdmin ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">0</p>
                  <p className="text-gray-600 text-sm">Total Cars</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">0</p>
                  <p className="text-gray-600 text-sm">Total Users</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">0</p>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">
                    {bookingList.length}
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
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            // <button
            //   key={tab.id}
            //   // onClick={() => setActiveTab(tab.id)}
            //   onClick={() => {
            //     setActiveTab(tab.id);

            //     if (tab.id === "viewDocuments") {
            //       fetchUserDocuments();
            //     }
            //   }}
            //   className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            //     activeTab === tab.id
            //       ? "bg-secondary text-white"
            //       : "bg-white text-primary hover:bg-gray-100"
            //   }`}
            // >
            //   <tab.icon />
            //   {tab.label}
            // </button>
            // <button
            //   key={tab.id}
            //   onClick={() => {
            //     setActiveTab(tab.id);

            //     if (tab.id === "viewDocuments") {
            //       fetchUserDocuments();
            //     }
            //   }}
            //   className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            //     activeTab === tab.id
            //       ? "bg-secondary text-white"
            //       : "bg-white text-primary hover:bg-gray-100"
            //   }`}
            // >
            //   <tab.icon />
            //   {tab.label}
            // </button>
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);

                if (tab.id === "viewDocuments") {
                  fetchUserDocuments();
                }
              }}
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

        <div>
          {activeTab === "adminCars" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Car Management</h2>
                  <p className="text-gray-600">
                    Add, update, delete and view cars
                  </p>
                </div>

                <button className="btn-primary">+ Add Car</button>
              </div>

              <div className="grid grid-cols-5 font-bold bg-gray-100 p-4 rounded-lg">
                <p>Name</p>
                <p>Brand</p>
                <p>Price</p>
                <p>Status</p>
                <p>Action</p>
              </div>
            </div>
          )}

          {activeTab === "adminUsers" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <p className="text-gray-600">
                All registered users will show here.
              </p>
            </div>
          )}

          {activeTab === "adminBookings" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
              <p className="text-gray-600">All user bookings will show here.</p>
            </div>
          )}

          {activeTab === "adminDocuments" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <h2 className="text-2xl font-bold mb-4">User Documents</h2>
              <p className="text-gray-600">
                All uploaded user documents will show here.
              </p>
            </div>
          )}

          {activeTab === "bookings" && !isAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>

                {upcomingBookings.length > 0 ? (
                  <div className="grid gap-6">
                    {upcomingBookings.map((booking, index) => (
                      <motion.div
                        key={`upcoming-${booking.id}-${index}`}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl card-shadow p-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div>
                            <img
                              src={booking.mainImage}
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

                              <p>
                                <span className="font-semibold">
                                  Booking Status:
                                </span>{" "}
                                <span
                                  className={
                                    booking.bookingStatus === "Accepted"
                                      ? "text-green-600 font-bold"
                                      : "text-red-600"
                                  }
                                >
                                  {booking.bookingStatus}
                                </span>
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

                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                            >
                              Cancel
                            </button>
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

              {pastBookings.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>

                  <div className="grid gap-4">
                    {pastBookings.map((booking, index) => (
                      <div
                        key={`past-${booking.id}-${index}`}
                        className="bg-white rounded-xl p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.mainImage}
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

          {activeTab === "saved" && !isAdmin && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Saved Cars</h2>

              {loadingSavedCars ? (
                <div className="bg-white p-12 rounded-xl text-center">
                  <p>Loading...</p>
                </div>
              ) : savedCarsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedCarsData.map((car, index) => (
                    <motion.div
                      key={`saved-car-${car.id}-${index}`}
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

          {activeTab === "profile" && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {isAdmin ? "Admin Profile" : "Profile Information"}
                  </h2>

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
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
                            setEditData({
                              ...editData,
                              email: e.target.value,
                            })
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
                            setEditData({
                              ...editData,
                              phone: e.target.value,
                            })
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          {profileData?.password}
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

          {activeTab === "documents" && !isAdmin && (
            <div className="bg-white rounded-xl card-shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`bg-white border-2 rounded-2xl p-8 text-center shadow-md transition-all duration-300 hover:shadow-xl ${
                    licenseFile
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-red-500"
                  }`}
                >
                  <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />

                  {licenseFile && (
                    <FiCheckCircle className="text-green-600 text-3xl mx-auto mb-2" />
                  )}

                  <h3 className="font-bold mb-2">Driving License</h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {licenseFile ? licenseFile.name : "No file selected"}
                  </p>

                  <label
                    htmlFor="licenseInput"
                    className="btn-outline text-sm cursor-pointer inline-block"
                  >
                    Select File
                  </label>

                  <input
                    id="licenseInput"
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setLicenseFile(e.target.files[0])}
                  />
                </div>

                <div
                  className={`bg-white border-2 rounded-2xl p-8 text-center shadow-md transition-all duration-300 hover:shadow-xl ${
                    aadhharFile
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-red-500"
                  }`}
                >
                  <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />

                  {aadhharFile && (
                    <FiCheckCircle className="text-green-600 text-3xl mx-auto mb-2" />
                  )}

                  <h3 className="font-bold mb-2">Aadhaar Card</h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {aadhharFile ? aadhharFile.name : "No file selected"}
                  </p>

                  <label
                    htmlFor="aadhaarInput"
                    className="btn-outline text-sm cursor-pointer inline-block"
                  >
                    Select File
                  </label>

                  <input
                    id="aadhaarInput"
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setAadhharFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleDocumentSubmit}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {activeTab === "viewDocuments" && !isAdmin && (
            <div className="bg-white rounded-xl card-shadow p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">Documents</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <DocumentPreview
                  title="Aadhaar Card"
                  fileUrl={documentsData?.aadhharCard}
                  status={normalizedDocumentStatus}
                  setPreviewImage={setPreviewImage}
                />

                <DocumentPreview
                  title="Driving Licence"
                  fileUrl={documentsData?.drivingLicense}
                  status={normalizedDocumentStatus}
                  setPreviewImage={setPreviewImage}
                /> */}
                <DocumentPreview
                  title="Aadhaar Card"
                  fileUrl={documentsData?.aadhharCard}
                  status={normalizedDocumentStatus}
                  setPreviewImage={setPreviewImage}
                />

                <DocumentPreview
                  title="Driving Licence"
                  fileUrl={documentsData?.drivingLicense}
                  status={normalizedDocumentStatus}
                  setPreviewImage={setPreviewImage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 text-white text-4xl hover:text-red-500"
          >
            <FiX />
          </button>

          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-[95%] max-h-[95%] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

// const DocumentPreview = ({ title, fileUrl, setPreviewImage }) => {
//   const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");
//   const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileUrl || "");

//   return (
//     <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
//       <div className="px-4 py-3 border-b">
//         <h3 className="font-bold text-lg">{title}</h3>
//       </div>

//       <div className="p-4 h-96 flex items-center justify-center">
//         {!fileUrl ? (
//           <p className="text-gray-500">{title} not found</p>
//         ) : isImage ? (
//           <div className="relative group w-full h-full">
//             <img
//               src={fileUrl}
//               alt={title}
//               className="w-full h-full object-contain rounded-lg"
//             />

//             <div
//               onClick={() => setPreviewImage(fileUrl)}
//               className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-lg"
//             >
//               <FiEye className="text-white text-5xl" />
//             </div>
//           </div>
//         ) : isPdf ? (
//           <div className="text-center">
//             <FiFileText className="text-6xl text-red-500 mx-auto mb-4" />
//             <p className="font-semibold mb-4">PDF Document</p>

//             <a
//               href={fileUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold"
//             >
//               Open PDF
//             </a>
//           </div>
//         ) : (
//           <a
//             href={fileUrl}
//             target="_blank"
//             rel="noreferrer"
//             className="text-blue-600 underline font-semibold"
//           >
//             View Document
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };
const DocumentPreview = ({ title, fileUrl, status, setPreviewImage }) => {
  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileUrl || "");

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      <div className="p-4 h-96 flex items-center justify-center">
        {!fileUrl ? (
          <p className="text-gray-500">{title} not found</p>
        ) : isImage ? (
          <div className="relative group w-full h-full">
            <img
              src={fileUrl}
              alt={title}
              className="w-full h-full object-contain rounded-lg"
            />

            <div
              onClick={() => setPreviewImage(fileUrl)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-lg"
            >
              <FiEye className="text-white text-5xl" />
            </div>

            <DocumentStamp status={status} />
          </div>
        ) : isPdf ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
            <FiFileText className="text-6xl text-red-500 mx-auto mb-4" />
            <p className="font-semibold mb-4">PDF Document</p>

            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Open PDF
            </a>

            <DocumentStamp status={status} />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline font-semibold"
            >
              View Document
            </a>

            <DocumentStamp status={status} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
