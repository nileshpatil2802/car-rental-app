import React, { useEffect, useMemo, useState } from "react";
import Toast from "../components/Toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DocumentStamp from "../components/DocumentStamp";

import {
  FiTruck,
  FiUsers,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiUserX,
  FiUserCheck,
  FiFileText,
  FiSearch,
  FiDownload,
  FiFilter,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getAllCars,
  addCar,
  updateCar,
  deleteCarById,
  getAllUsers,
  deleteUserById,
  updateUserStatus,
  updateUserRole,
  getPendingBookingList,
  getBookingRecords,
  updateBookingStatusByAdmin,
  deleteBookingByAdmin,
  getAllUserDocuments,
  updateDocumentStatusByAdmin,
  getCarImageUrl,
} from "../services/carService";

const BRAND_OPTIONS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Toyota",
  "Honda",
  "Kia",
  "MG",
  "Skoda",
  "Volkswagen",
  "Renault",
  "Nissan",
  "BMW",
  "Audi",
  "Mercedes-Benz",
];

const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

const TRANSMISSION_OPTIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"];

const SEATING_OPTIONS = ["2", "4", "5", "6", "7", "8"];

const COMMON_FEATURE_OPTIONS = [
  "Air Conditioning",
  "Automatic Climate Control",
  "Power Steering",
  "Power Windows",
  "Central Locking",
  "Keyless Entry",
  "Push Button Start",
  "Cruise Control",
  "Rear Parking Camera",
  "Parking Sensors",
  "360 Degree Camera",
  "ABS",
  "Airbags",
  "Electronic Stability Control",
  "Hill Hold Assist",
  "Traction Control",
  "Sunroof",
  "Panoramic Sunroof",
  "Touchscreen Infotainment",
  "Android Auto",
  "Apple CarPlay",
  "Bluetooth",
  "Wireless Charging",
  "USB Charging",
  "Navigation",
  "Premium Sound System",
  "Leather Seats",
  "Ventilated Seats",
  "Heated Seats",
  "Powered Driver Seat",
  "LED Headlamps",
  "Automatic Headlamps",
  "Rain Sensing Wipers",
  "Alloy Wheels",
  "Digital Instrument Cluster",
  "Ambient Lighting",
];

const BOOKING_STATUS_OPTIONS = [
  "CONFIRMED",
  "CANCELLED",
  "ACTIVE",
  "COMPLETED",
];

//const Cars = () => {
const Administrator = () => {
  const [activeSection, setActiveSection] = useState("cars");
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingActionId, setBookingActionId] = useState(null);

  const [totalBookings, setTotalBookings] = useState([]);
  const [totalBookingLoading, setTotalBookingLoading] = useState(false);
  const [totalBookingActionId, setTotalBookingActionId] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentUpdatingId, setDocumentUpdatingId] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [revenueReportType, setRevenueReportType] = useState("DAILY");
  const [revenueDate, setRevenueDate] = useState(getTodayDate());
  const [revenueMonth, setRevenueMonth] = useState(getCurrentMonth());
  const [revenueStartDate, setRevenueStartDate] = useState(getTodayDate());
  const [revenueEndDate, setRevenueEndDate] = useState(getTodayDate());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    fetchCars();
    fetchUsers();
    fetchBookings();
    fetchTotalBookings();
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setDocumentLoading(true);

      const data = await getAllUserDocuments();

      console.log("All user documents:", data);

      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Documents fetch error:", error);

      setDocuments([]);

      setToast({
        message: "Unable to load documents",
        type: "error",
      });
    } finally {
      setDocumentLoading(false);
    }
  };

  const fetchCars = async () => {
    const data = await getAllCars();
    setCars(data);
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log("Users from API:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Users fetch error:", error);
      setUsers([]);
    }
  };

  // pending and rejected
  const fetchBookings = async () => {
    try {
      setBookingLoading(true);

      const data = await getPendingBookingList();

      console.log("Pending Bookings:", data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Bookings fetch error:", error);

      setBookings([]);

      setToast({
        message: "Unable to load pending bookings",
        type: "error",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchTotalBookings = async () => {
    try {
      setTotalBookingLoading(true);

      const data = await getBookingRecords();

      console.log("All Booking Records:", data);
      setTotalBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Total booking error:",
        error.response?.data || error.message,
      );

      setTotalBookings([]);
      setToast({
        message: "Unable to load total booking records",
        type: "error",
      });
    } finally {
      setTotalBookingLoading(false);
    }
  };

  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  const emptyCar = {
    id: "",
    mainImage: "",
    img1: "",
    img2: "",
    img3: "",
    mainImageFile: null,
    img1File: null,
    img2File: null,
    img3File: null,

    name: "",
    brand: "",
    fuelType: "",
    seating: "",
    transmition: "",
    price: "",
    description: "",

    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
    feature5: "",

    carStatus: "Available",
    status: true,
    available: true,
  };

  const [editingCar, setEditingCar] = useState(null);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState(emptyCar);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  // const handleImageFileChange = (e, car, setCar, fieldName) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setCar({
  //       ...car,
  //       [fieldName]: file.name,
  //       [`${fieldName}File`]: file,
  //       [`${fieldName}Preview`]: URL.createObjectURL(file),
  //     });
  //   }
  // };

  const handleImageFileChange = (event, car, setCar, fieldName) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCar((previousCar) => ({
      ...previousCar,

      // Filename for validation and display
      [fieldName]: file.name,

      // Actual selected File object
      [`${fieldName}File`]: file,

      // Temporary browser preview
      [`${fieldName}Preview`]: URL.createObjectURL(file),
    }));
  };

  const validateCarForm = (car) => {
    const requiredFields = [
      ["name", "Car name"],
      ["brand", "Brand"],
      ["fuelType", "Fuel type"],
      ["transmition", "Transmission"],
      ["seating", "Seating"],
      ["price", "Price"],
      ["description", "Description"],

      ["mainImage", "Main image"],
      ["img1", "Image 1"],
      ["img2", "Image 2"],
      ["img3", "Image 3"],
    ];

    for (const [field, label] of requiredFields) {
      if (!car[field] || String(car[field]).trim() === "") {
        setToast({
          message: `${label} is required`,
          type: "warning",
        });
        return false;
      }
    }

    const selectedFeatures = [
      car.feature1,
      car.feature2,
      car.feature3,
      car.feature4,
      car.feature5,
    ].filter((feature) => feature && String(feature).trim() !== "");

    if (selectedFeatures.length === 0) {
      setToast({
        message: "Please add at least one car feature",
        type: "warning",
      });
      return false;
    }

    if (Number(car.price) <= 0) {
      setToast({
        message: "Price must be greater than 0",
        type: "warning",
      });
      return false;
    }

    if (Number(car.seating) <= 0) {
      setToast({
        message: "Seating must be greater than 0",
        type: "warning",
      });
      return false;
    }

    return true;
  };

  const REVENUE_STATUSES = ["CONFIRMED", "ACTIVE", "COMPLETED"];

  const getBookingStatusValue = (booking) =>
    String(booking.bookingStatus || "").toUpperCase();

  const getBookingRevenueDate = (booking) => {
    // Frontend-only report date. Prefer payment/creation date when available.
    const dateValue =
      booking.paymentDate ||
      booking.paidAt ||
      booking.createdAt ||
      booking.bookingDate ||
      booking.pickupDate;

    return dateValue ? String(dateValue).substring(0, 10) : "";
  };

  const isRevenueBooking = (booking) =>
    REVENUE_STATUSES.includes(getBookingStatusValue(booking));

  const paidBookings = useMemo(
    () => totalBookings.filter(isRevenueBooking),
    [totalBookings],
  );

  const matchesRevenuePeriod = (booking) => {
    const bookingDate = getBookingRevenueDate(booking);

    if (revenueReportType === "ALL") return true;
    if (!bookingDate) return false;

    if (revenueReportType === "DAILY") {
      return bookingDate === revenueDate;
    }

    if (revenueReportType === "MONTHLY") {
      return bookingDate.startsWith(revenueMonth);
    }

    if (revenueReportType === "CUSTOM") {
      return (
        Boolean(revenueStartDate) &&
        Boolean(revenueEndDate) &&
        bookingDate >= revenueStartDate &&
        bookingDate <= revenueEndDate
      );
    }

    return true;
  };

  const filteredRevenueBookings = useMemo(
    () => paidBookings.filter(matchesRevenuePeriod),
    [
      paidBookings,
      revenueReportType,
      revenueDate,
      revenueMonth,
      revenueStartDate,
      revenueEndDate,
    ],
  );

  const revenueSummary = useMemo(() => {
    const revenue = filteredRevenueBookings.reduce(
      (sum, booking) => sum + Number(booking.total || 0),
      0,
    );

    const countStatus = (status) =>
      filteredRevenueBookings.filter(
        (booking) => getBookingStatusValue(booking) === status,
      ).length;

    const cancelledCount = totalBookings.filter(
      (booking) =>
        getBookingStatusValue(booking) === "CANCELLED" &&
        matchesRevenuePeriod(booking),
    ).length;

    const averageBooking =
      filteredRevenueBookings.length > 0
        ? revenue / filteredRevenueBookings.length
        : 0;

    const highestBooking =
      filteredRevenueBookings.length > 0
        ? Math.max(
            ...filteredRevenueBookings.map((booking) =>
              Number(booking.total || 0),
            ),
          )
        : 0;

    return {
      revenue,
      bookingCount: filteredRevenueBookings.length,
      completedCount: countStatus("COMPLETED"),
      activeCount: countStatus("ACTIVE"),
      confirmedCount: countStatus("CONFIRMED"),
      cancelledCount,
      averageBooking,
      highestBooking,
    };
  }, [
    filteredRevenueBookings,
    totalBookings,
    revenueReportType,
    revenueDate,
    revenueMonth,
    revenueStartDate,
    revenueEndDate,
  ]);

  const totalRevenue = useMemo(
    () =>
      paidBookings.reduce(
        (sum, booking) => sum + Number(booking.total || 0),
        0,
      ),
    [paidBookings],
  );

  const dashboardCards = useMemo(
    () => [
      {
        key: "cars",
        title: "Total Cars",
        value: cars.length,
        icon: <FiTruck />,
      },
      {
        key: "users",
        title: "Total Users",
        value: users.length,
        icon: <FiUsers />,
      },

      {
        key: "pending",
        title: "Pending Bookings",
        value: bookings.length,
        icon: <FiClock />,
      },
      {
        key: "bookings",
        title: "Total Bookings",
        value: totalBookings.length,
        icon: <FiCalendar />,
      },
      {
        key: "revenue",
        title: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString("en-IN")}`,
        icon: <FiDollarSign />,
      },
      {
        key: "documents",
        title: "Documents",
        value: documents.length,
        icon: <FiFileText />,
      },
    ],
    [cars, users, bookings, totalBookings, totalRevenue, documents],
  );

  const handleAddCar = async (e) => {
    e.preventDefault();

    if (!validateCarForm(newCar)) {
      return;
    }

    try {
      await addCar(newCar);

      await fetchCars();

      setNewCar(emptyCar);
      setShowAddCar(false);

      setToast({
        message: "Car added successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Car added failed",
        type: "error",
      });
      console.error(error);
    }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();

    if (!validateCarForm(editingCar)) {
      return;
    }

    try {
      await updateCar(editingCar);

      await fetchCars();

      setEditingCar(null);

      setToast({
        message: "Car updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);

      setToast({
        message: "Car update failed",
        type: "error",
      });
    }
  };

  const handleUpdateUserRole = async () => {
    try {
      await updateUserRole(selectedUser.id, selectedUser.role);

      await fetchUsers();
      setSelectedUser(null);

      setToast({
        message: "User role updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);

      setToast({
        message: "User role update failed!",
        type: "error",
      });
    }
  };

  const handleDeleteCar = (id) => {
    setDeleteConfirm({ type: "car", id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === "car") {
        await deleteCarById(deleteConfirm.id);
        await fetchCars();

        setToast({
          message: "Car deleted successfully!",
          type: "success",
        });
      }

      if (deleteConfirm.type === "user") {
        await deleteUserById(deleteConfirm.id);
        await fetchUsers();

        setToast({
          message: "User deleted successfully!",
          type: "success",
        });
      }

      if (deleteConfirm.type === "total-booking") {
        console.log("Booking ID sent for delete:", deleteConfirm.id);

        await deleteBookingByAdmin(deleteConfirm.id);

        setTotalBookings((previousBookings) =>
          previousBookings.filter(
            (booking) => Number(booking.id) !== Number(deleteConfirm.id),
          ),
        );

        setBookings((previousBookings) =>
          previousBookings.filter(
            (booking) => Number(booking.id) !== Number(deleteConfirm.id),
          ),
        );

        setToast({
          message: "Booking deleted successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error(
        "Delete operation error:",
        error.response?.data || error.message,
      );

      setToast({
        message:
          deleteConfirm.type === "user"
            ? "User delete failed!"
            : deleteConfirm.type === "total-booking"
              ? error.response?.data?.message ||
                error.response?.data ||
                "Booking delete failed!"
              : "Car delete failed!",
        type: "error",
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      setBookingActionId(bookingId);

      await updateBookingStatusByAdmin(bookingId, status);

      if (status === "CONFIRMED") {
        // Remove accepted booking immediately from Pending section
        setBookings((previousBookings) =>
          previousBookings.filter(
            (booking) => Number(booking.id) !== Number(bookingId),
          ),
        );
      } else if (status === "REJECTED") {
        // Update rejected booking status immediately
        setBookings((previousBookings) =>
          previousBookings.map((booking) =>
            Number(booking.id) === Number(bookingId)
              ? {
                  ...booking,
                  bookingStatus: "REJECTED",
                }
              : booking,
          ),
        );
      }

      setToast({
        message:
          status === "CONFIRMED"
            ? "User Booking Request Accepted"
            : "User Booking Request Rejected",
        type: status === "CONFIRMED" ? "success" : "error",
      });
    } catch (error) {
      console.error("Booking status update error:", error);

      setToast({
        message:
          error?.response?.data?.message ||
          error?.response?.data ||
          "Booking status update failed",
        type: "error",
      });
    } finally {
      setBookingActionId(null);
    }
  };

  const handleTotalBookingStatus = async (bookingId, newStatus) => {
    const previousBookings = totalBookings;

    try {
      setTotalBookingActionId(bookingId);

      setTotalBookings((currentBookings) =>
        currentBookings.map((booking) =>
          Number(booking.id) === Number(bookingId)
            ? { ...booking, bookingStatus: newStatus }
            : booking,
        ),
      );

      await updateBookingStatusByAdmin(bookingId, newStatus);
      await fetchTotalBookings();

      setToast({
        message: `Booking status updated to ${newStatus}`,
        type: "success",
      });
    } catch (error) {
      console.error("Total booking status update error:", error);
      setTotalBookings(previousBookings);

      setToast({
        message:
          error?.response?.data?.message ||
          error?.response?.data ||
          "Booking status update failed",
        type: "error",
      });
    } finally {
      setTotalBookingActionId(null);
    }
  };

  const handleDeleteTotalBooking = (bookingId) => {
    setDeleteConfirm({
      type: "total-booking",
      id: bookingId,
    });
  };

  const handleBlockUser = async (id) => {
    try {
      await updateUserStatus(id);
      await fetchUsers();

      setToast({
        message: "User status updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);

      setToast({
        message: "User status update failed!",
        type: "error",
      });
    }
  };

  const handleDeleteUser = (id) => {
    setDeleteConfirm({ type: "user", id });
  };

  // const approveDocument = (id) => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === id
  //         ? { ...user, documentStatus: "APPROVED", rejectReason: "" }
  //         : user,
  //     ),
  //   );
  // };

  // const rejectDocument = (id) => {
  //   setRejectReasonInput("");
  //   setRejectReasonError("");
  //   setRejectModal({ id });
  // };

  const closeRejectModal = () => {
    if (documentUpdatingId) return;

    setRejectModal(null);
    setRejectReasonInput("");
    setRejectReasonError("");
  };

  //   const confirmRejectDocument = async () => {
  //   const reason = rejectReasonInput.trim();

  //   if (!reason) {
  //     setRejectReasonError("Please enter a rejection reason");
  //     return;
  //   }

  //   if (reason.length < 5) {
  //     setRejectReasonError(
  //       "Rejection reason must contain at least 5 characters",
  //     );
  //     return;
  //   }

  //   if (!rejectModal?.documentId) {
  //     setRejectReasonError("Document information is missing");
  //     return;
  //   }

  //   const previousDocuments = documents;

  //   try {
  //     setDocumentUpdatingId(rejectModal.documentId);

  //     // Optimistic update
  //     setDocuments((currentDocuments) =>
  //       currentDocuments.map((document) =>
  //         Number(document.id) === Number(rejectModal.documentId)
  //           ? {
  //               ...document,
  //               status: "REJECT",
  //               reason,
  //             }
  //           : document,
  //       ),
  //     );

  //     // ✅ Correct function name, correct 3 args (id, status, reason)
  //     const updatedDocument = await updateDocumentStatusByAdmin(
  //       rejectModal.documentId,
  //       "REJECT",
  //       reason,
  //     );

  //     setDocuments((currentDocuments) =>
  //       currentDocuments.map((document) =>
  //         Number(document.id) === Number(rejectModal.documentId)
  //           ? {
  //               ...document,
  //               status: updatedDocument?.status || "REJECT",
  //               reason:
  //                 updatedDocument?.reason !== undefined
  //                   ? updatedDocument.reason
  //                   : reason,
  //             }
  //           : document,
  //       ),
  //     );

  //     setDocumentPreview((currentPreview) =>
  //       currentPreview && Number(currentPreview.documentId) === Number(rejectModal.documentId)
  //         ? { ...currentPreview, status: updatedDocument?.status || "REJECT" }
  //         : currentPreview,
  //     );

  //     setToast({
  //       message: "Document rejected successfully!",
  //       type: "success",
  //     });

  //     // setDocuments((currentDocuments) =>
  //     //   currentDocuments.map((document) =>
  //     //     Number(document.id) === Number(rejectModal.documentId)
  //     //       ? {
  //     //           ...document,
  //     //           status: updatedDocument?.status || "REJECT",
  //     //           reason:
  //     //             updatedDocument?.reason !== undefined
  //     //               ? updatedDocument.reason
  //     //               : reason,
  //     //         }
  //     //       : document,
  //     //   ),
  //     // );

  //     // setToast({
  //     //   message: "Document rejected successfully!",
  //     //   type: "success",
  //     // });

  //     setRejectModal(null);
  //     setRejectReasonInput("");
  //     setRejectReasonError("");
  //   } catch (error) {
  //     console.error(
  //       "Document rejection error:",
  //       error.response?.data || error.message,
  //     );

  //     setDocuments(previousDocuments);

  //     setToast({
  //       message:
  //         error.response?.data?.message ||
  //         error.response?.data ||
  //         "Document rejection failed",
  //       type: "error",
  //     });
  //   } finally {
  //     setDocumentUpdatingId(null);
  //   }
  // };
  const confirmRejectDocument = async () => {
    const reason = rejectReasonInput.trim();

    if (!reason) {
      setRejectReasonError("Please enter a rejection reason");
      return;
    }

    if (reason.length < 5) {
      setRejectReasonError(
        "Rejection reason must contain at least 5 characters",
      );
      return;
    }

    if (!rejectModal?.documentId) {
      setRejectReasonError("Document information is missing");
      return;
    }

    const previousDocuments = documents;

    try {
      setDocumentUpdatingId(rejectModal.documentId);

      // Optimistic update
      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          Number(document.id) === Number(rejectModal.documentId)
            ? {
                ...document,
                status: "REJECT",
                reason,
              }
            : document,
        ),
      );

      const updatedDocument = await updateDocumentStatusByAdmin(
        rejectModal.documentId,
        "REJECT",
        reason,
      );

      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          Number(document.id) === Number(rejectModal.documentId)
            ? {
                ...document,
                status: updatedDocument?.status || "REJECT",
                reason:
                  updatedDocument?.reason !== undefined
                    ? updatedDocument.reason
                    : reason,
              }
            : document,
        ),
      );

      setDocumentPreview((currentPreview) =>
        currentPreview &&
        Number(currentPreview.documentId) === Number(rejectModal.documentId)
          ? { ...currentPreview, status: updatedDocument?.status || "REJECT" }
          : currentPreview,
      );

      setToast({
        message: "Document rejected successfully!",
        type: "success",
      });

      setRejectModal(null);
      setRejectReasonInput("");
      setRejectReasonError("");
    } catch (error) {
      console.error(
        "Document rejection error:",
        error.response?.data || error.message,
      );

      setDocuments(previousDocuments);

      setToast({
        message:
          error.response?.data?.message ||
          error.response?.data ||
          "Document rejection failed",
        type: "error",
      });
    } finally {
      setDocumentUpdatingId(null);
    }
  };
  const openEditCarForm = (car) => {
    setEditingCar({
      ...car,
      mainImage: car.image || car.mainImage || "",
      feature1: car.features?.[0] || "",
      feature2: car.features?.[1] || "",
      feature3: car.features?.[2] || "",
      feature4: car.features?.[3] || "",
      feature5: car.features?.[4] || "",
      carStatus: car.available || car.status ? "Available" : "Booked",
    });
  };

  const renderCarForm = (car, setCar, submitHandler, title) => {
    const selectedFeatures = [
      car.feature1,
      car.feature2,
      car.feature3,
      car.feature4,
      car.feature5,
    ].filter((feature) => feature && String(feature).trim() !== "");

    const updateFeatures = (features) => {
      const cleanFeatures = features
        .map((feature) => String(feature || "").trim())
        .filter(Boolean)
        .filter(
          (feature, index, array) =>
            array.findIndex(
              (item) => item.toLowerCase() === feature.toLowerCase(),
            ) === index,
        )
        .slice(0, 5);

      setCar({
        ...car,
        feature1: cleanFeatures[0] || "",
        feature2: cleanFeatures[1] || "",
        feature3: cleanFeatures[2] || "",
        feature4: cleanFeatures[3] || "",
        feature5: cleanFeatures[4] || "",
        featureSelect: "",
        customFeature: "",
      });
    };

    const addFeature = (feature) => {
      const value = String(feature || "").trim();

      if (!value) {
        return;
      }

      if (
        selectedFeatures.some(
          (selectedFeature) =>
            selectedFeature.toLowerCase() === value.toLowerCase(),
        )
      ) {
        setToast({
          message: "This feature is already selected",
          type: "warning",
        });
        return;
      }

      if (selectedFeatures.length >= 5) {
        setToast({
          message: "You can add maximum 5 features",
          type: "warning",
        });
        return;
      }

      updateFeatures([...selectedFeatures, value]);
    };

    const removeFeature = (featureToRemove) => {
      updateFeatures(
        selectedFeatures.filter((feature) => feature !== featureToRemove),
      );
    };

    const handleStatusChange = (value) => {
      setCar({
        ...car,
        carStatus: value,
        status: value === "Available",
        available: value === "Available",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[92vh] overflow-y-auto"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-5">
            {title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Car Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={car.name || ""}
                onChange={(e) => setCar({ ...car, name: e.target.value })}
                placeholder="Enter car name"
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={car.brand || ""}
                onChange={(e) => setCar({ ...car, brand: e.target.value })}
                className="border p-3 rounded-lg w-full bg-white"
                required
              >
                <option value="">Select brand</option>
                {BRAND_OPTIONS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
                {car.brand && !BRAND_OPTIONS.includes(car.brand) && (
                  <option value={car.brand}>{car.brand}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                value={car.fuelType || ""}
                onChange={(e) => setCar({ ...car, fuelType: e.target.value })}
                className="border p-3 rounded-lg w-full bg-white"
                required
              >
                <option value="">Select fuel type</option>
                {FUEL_OPTIONS.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Transmission <span className="text-red-500">*</span>
              </label>
              <select
                value={car.transmition || ""}
                onChange={(e) =>
                  setCar({ ...car, transmition: e.target.value })
                }
                className="border p-3 rounded-lg w-full bg-white"
                required
              >
                <option value="">Select transmission</option>
                {TRANSMISSION_OPTIONS.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Seating Capacity <span className="text-red-500">*</span>
              </label>
              <select
                value={String(car.seating || "")}
                onChange={(e) => setCar({ ...car, seating: e.target.value })}
                className="border p-3 rounded-lg w-full bg-white"
                required
              >
                <option value="">Select seating</option>
                {SEATING_OPTIONS.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat} Seater
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Price Per Day <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="500"
                max="50000"
                value={car.price || ""}
                onChange={(e) => setCar({ ...car, price: e.target.value })}
                placeholder="Enter price per day (₹)"
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Car Status <span className="text-red-500">*</span>
              </label>

              <select
                value={car.carStatus || "Available"}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border p-3 rounded-lg w-full bg-white"
                required
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Out of Service">Out of Service</option>
              </select>

              <p className="text-xs text-gray-500 mt-1">
                Select the current operational status of the car.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={car.description || ""}
                onChange={(e) =>
                  setCar({ ...car, description: e.target.value })
                }
                placeholder="Enter car description"
                className="border p-3 rounded-lg w-full"
                rows="4"
                required
              />
            </div>

            <div className="sm:col-span-2 border rounded-xl p-3 sm:p-4 bg-gray-50">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-primary">
                    Car Features <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select common features or add a unique feature. Maximum 5.
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {selectedFeatures.length}/5
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Select Feature
                  </label>
                  <select
                    value={car.featureSelect || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCar({ ...car, featureSelect: value });

                      if (value) {
                        addFeature(value);
                      }
                    }}
                    disabled={selectedFeatures.length >= 5}
                    className="border p-3 rounded-lg w-full bg-white disabled:bg-gray-100"
                  >
                    <option value="">Choose a feature</option>
                    {COMMON_FEATURE_OPTIONS.filter(
                      (feature) =>
                        !selectedFeatures.some(
                          (selectedFeature) =>
                            selectedFeature.toLowerCase() ===
                            feature.toLowerCase(),
                        ),
                    ).map((feature) => (
                      <option key={feature} value={feature}>
                        {feature}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Add Unique Feature
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={car.customFeature || ""}
                      onChange={(e) =>
                        setCar({ ...car, customFeature: e.target.value })
                      }
                      placeholder="Example: Virtual Cockpit"
                      disabled={selectedFeatures.length >= 5}
                      className="border p-3 rounded-lg w-full disabled:bg-gray-100"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature(car.customFeature);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addFeature(car.customFeature)}
                      disabled={
                        selectedFeatures.length >= 5 ||
                        !String(car.customFeature || "").trim()
                      }
                      className="px-4 py-3 bg-secondary text-white rounded-lg disabled:bg-gray-300 shrink-0"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {selectedFeatures.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-2 bg-red-100 text-secondary px-3 py-2 rounded-full text-xs sm:text-sm font-semibold"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="hover:text-red-800"
                          title={`Remove ${feature}`}
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No feature added. Please add at least one feature.
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["mainImage", "Main Image"],
                ["img1", "Image 1"],
                ["img2", "Image 2"],
                ["img3", "Image 3"],
              ].map(([fieldName, label]) => (
                <div key={fieldName}>
                  <label className="block font-semibold mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>

                  {/* <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageFileChange(e, car, setCar, fieldName)
                    }
                    className="border p-3 rounded-lg w-full text-sm"
                    required={!car[fieldName]}
                  /> */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleImageFileChange(event, car, setCar, fieldName)
                    }
                  />

                  {car[fieldName] && (
                    <img
                      src={
                        car[`${fieldName}Preview`] ||
                        getCarImageUrl(car[fieldName])
                      }
                      alt={label}
                      className="mt-3 w-full h-28 sm:h-32 object-contain bg-gray-100 rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setEditingCar(null);
                setShowAddCar(false);
              }}
              className="w-full sm:w-auto px-5 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-secondary text-white rounded-lg font-bold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderCars = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 sm:p-5 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Car Management
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Add, update, delete and view cars
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCar(true)}
            className="w-full sm:w-auto bg-secondary text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold"
          >
            <FiPlus /> Add Car
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          {cars.length} car{cars.length === 1 ? "" : "s"}
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="p-10 text-center">
          <FiTruck className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No cars found</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first car to start managing the fleet.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Car</th>
                  <th className="p-3 text-left">Brand</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((car) => {
                  const isAvailable = Boolean(car.available || car.status);

                  return (
                    <tr
                      key={car.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getCarImageUrl(car.mainImage)}
                            alt={car.name}
                            className="w-14 h-12 rounded-lg object-contain bg-gray-100 border"
                            onError={(e) => {
                              e.target.src = "/placeholder-car.jpg";
                            }}
                          />
                          <div>
                            <p className="font-semibold">{car.name || "N/A"}</p>
                            <p className="text-xs text-gray-500">
                              ID: {car.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{car.brand || "N/A"}</td>
                      <td className="p-3 font-bold">
                        ₹{Number(car.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable ? "Available" : "Booked"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCar(car)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                            title="View"
                          >
                            <FiEye />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditCarForm(car)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCar(car.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4">
            {cars.map((car) => {
              const isAvailable = Boolean(car.available || car.status);

              return (
                <article
                  key={car.id}
                  className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={getCarImageUrl(car.image || car.mainImage)}
                      alt={car.name || "Car"}
                      className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-contain bg-gray-100 border shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Car #{car.id}</p>
                          <h3 className="font-bold text-base sm:text-lg text-primary truncate">
                            {car.name || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {car.brand || "N/A"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable ? "Available" : "Booked"}
                        </span>
                      </div>

                      <p className="font-bold text-secondary mt-2 text-sm sm:text-base">
                        ₹{Number(car.price || 0).toLocaleString("en-IN")} / day
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                    <div className="bg-gray-50 border rounded-lg p-2">
                      <p className="text-gray-500">Fuel</p>
                      <p className="font-semibold truncate">
                        {car.fuelType || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-2">
                      <p className="text-gray-500">Gear</p>
                      <p className="font-semibold truncate">
                        {car.transmition || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-2">
                      <p className="text-gray-500">Seats</p>
                      <p className="font-semibold">{car.seating || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCar(car)}
                      className="bg-green-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm"
                    >
                      <FiEye /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditCarForm(car)}
                      className="bg-blue-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCar(car.id)}
                      className="bg-red-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  const renderTotalBookings = () => {
    const getBookingStatus = (booking) =>
      String(booking.bookingStatus || "PENDING").toUpperCase();

    const getUserName = (booking) =>
      booking.user?.fullName ||
      booking.user?.name ||
      [booking.user?.firstName, booking.user?.lastName]
        .filter(Boolean)
        .join(" ") ||
      booking.userName ||
      booking.name ||
      "N/A";

    const getUserEmail = (booking) =>
      booking.user?.email || booking.email || "";

    const getStatusClass = (status) => {
      switch (status) {
        case "CONFIRMED":
          return "bg-green-100 text-green-700 border-green-200";
        case "REJECTED":
          return "bg-red-100 text-red-700 border-red-200";
        case "CANCELLED":
          return "bg-gray-100 text-gray-700 border-gray-200";
        case "ACTIVE":
          return "bg-purple-100 text-purple-700 border-purple-200";
        case "COMPLETED":
          return "bg-blue-100 text-blue-700 border-blue-200";
        default:
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
      }
    };

    const formatDate = (dateValue) => {
      if (!dateValue) return "N/A";

      const date = new Date(`${dateValue}T00:00:00`);
      if (Number.isNaN(date.getTime())) return dateValue;

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatMoney = (amount) =>
      `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 sm:p-5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                Total Booking Management
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                View, update and delete all booking records
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {totalBookings.length} booking
                {totalBookings.length === 1 ? "" : "s"}
              </span>

              <button
                type="button"
                onClick={fetchTotalBookings}
                disabled={totalBookingLoading}
                className="px-3 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                {totalBookingLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {totalBookingLoading ? (
          <div className="p-10 sm:p-14 text-center text-gray-500">
            Loading total bookings...
          </div>
        ) : totalBookings.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <FiCalendar className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">
              No booking records found
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Booking</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Car</th>
                    <th className="p-3 text-left">Travel Dates</th>
                    <th className="p-3 text-left">Route</th>
                    <th className="p-3 text-left">Trip</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {totalBookings.map((booking) => {
                    const status = getBookingStatus(booking);
                    const isUpdating =
                      Number(totalBookingActionId) === Number(booking.id);

                    return (
                      <tr
                        key={booking.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3">
                          <p className="font-bold text-primary">
                            #{booking.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            Car ID: {booking.car?.id || booking.carId || "N/A"}
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-semibold">
                            {getUserName(booking)}
                          </p>
                          {getUserEmail(booking) && (
                            <p className="text-xs text-gray-500 max-w-[180px] truncate">
                              {getUserEmail(booking)}
                            </p>
                          )}
                        </td>

                        <td className="p-3">
                          <p className="font-semibold">
                            {booking.carName || booking.car?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.brand || booking.car?.brand || "N/A"}
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-medium">
                            {formatDate(booking.pickupDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            to {formatDate(booking.dropoffDate)}
                          </p>
                          <p className="text-xs font-semibold mt-1">
                            {booking.days || 0} day
                            {Number(booking.days) === 1 ? "" : "s"}
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-medium">
                            {booking.pickupLocation || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            to {booking.dropoffLocation || "N/A"}
                          </p>
                        </td>

                        <td className="p-3">
                          <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">
                            {String(booking.tripType || "N/A").replaceAll(
                              "_",
                              " ",
                            )}
                          </span>
                        </td>

                        <td className="p-3">
                          <p className="font-bold text-secondary">
                            {formatMoney(booking.total)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatMoney(booking.price)} / day
                          </p>
                        </td>

                        <td className="p-3">
                          <select
                            value={status}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleTotalBookingStatus(
                                booking.id,
                                event.target.value,
                              )
                            }
                            className={`border rounded-lg px-3 py-2 text-xs font-semibold outline-none disabled:opacity-50 ${getStatusClass(
                              status,
                            )}`}
                          >
                            {BOOKING_STATUS_OPTIONS.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleDeleteTotalBooking(booking.id)
                              }
                              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white p-2.5 rounded-lg"
                              title="Delete Booking"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden bg-gray-50 p-3 grid grid-cols-1 gap-4">
              {totalBookings.map((booking) => {
                const status = getBookingStatus(booking);
                const isUpdating =
                  Number(totalBookingActionId) === Number(booking.id);

                return (
                  <article
                    key={booking.id}
                    className="bg-white border rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Booking #{booking.id}
                        </p>
                        <h3 className="font-bold text-primary break-words">
                          {booking.carName || booking.car?.name || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500 break-words">
                          {getUserName(booking)}
                        </p>
                      </div>

                      <select
                        value={status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleTotalBookingStatus(
                            booking.id,
                            event.target.value,
                          )
                        }
                        className={`shrink-0 border rounded-lg px-2 py-2 text-[11px] font-semibold ${getStatusClass(
                          status,
                        )}`}
                      >
                        {BOOKING_STATUS_OPTIONS.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                      <div className="bg-gray-50 border rounded-lg p-3">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="font-semibold">
                          {formatDate(booking.pickupDate)}
                        </p>
                        <p className="text-xs text-gray-500 break-words">
                          {booking.pickupLocation || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 border rounded-lg p-3">
                        <p className="text-xs text-gray-500">Dropoff</p>
                        <p className="font-semibold">
                          {formatDate(booking.dropoffDate)}
                        </p>
                        <p className="text-xs text-gray-500 break-words">
                          {booking.dropoffLocation || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 border rounded-lg p-3">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold">
                          {booking.days || 0} day
                          {Number(booking.days) === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="bg-gray-50 border rounded-lg p-3">
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-bold text-secondary">
                          {formatMoney(booking.total)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleDeleteTotalBooking(booking.id)}
                      className="mt-4 w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <FiTrash2 /> Delete Booking
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderBookings = (onlyPending = false) => {
    const bookingList = bookings;

    const getBookingStatus = (booking) =>
      String(booking.bookingStatus || "PENDING").toUpperCase();

    const getUserName = (booking) =>
      booking.user?.fullName ||
      booking.user?.name ||
      [booking.user?.firstName, booking.user?.lastName]
        .filter(Boolean)
        .join(" ") ||
      "N/A";

    const getUserEmail = (booking) => booking.user?.email || "";

    const getStatusClass = (status) => {
      switch (status) {
        case "CONFIRMED":
          return "bg-green-100 text-green-700 border-green-200";
        case "REJECTED":
          return "bg-red-100 text-red-700 border-red-200";
        case "CANCELLED":
          return "bg-gray-100 text-gray-700 border-gray-200";
        case "COMPLETED":
          return "bg-blue-100 text-blue-700 border-blue-200";
        default:
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
      }
    };

    const formatDate = (dateValue) => {
      if (!dateValue) return "N/A";

      const date = new Date(`${dateValue}T00:00:00`);

      if (Number.isNaN(date.getTime())) {
        return dateValue;
      }

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatMoney = (amount) =>
      `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 sm:p-5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                {onlyPending
                  ? "Pending Booking Requests"
                  : "Booking Management"}
              </h2>

              <p className="text-sm sm:text-base text-gray-600">
                Accept, reject and manage customer bookings
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {bookingList.length} booking
                {bookingList.length === 1 ? "" : "s"}
              </span>

              <button
                type="button"
                onClick={fetchBookings}
                disabled={bookingLoading}
                className="px-3 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                {bookingLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {bookingLoading ? (
          <div className="p-10 sm:p-14 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : bookingList.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <FiCalendar className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3" />

            <p className="font-semibold text-gray-600">
              {onlyPending
                ? "No pending booking requests"
                : "No bookings found"}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              New customer bookings will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop and tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Booking</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Car</th>
                    <th className="p-3 text-left">Travel Dates</th>
                    <th className="p-3 text-left">Route</th>
                    <th className="p-3 text-left">Trip</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookingList.map((booking) => {
                    const status = getBookingStatus(booking);
                    const isUpdating = bookingActionId === booking.id;

                    return (
                      <tr
                        key={booking.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3">
                          <p className="font-bold text-primary">
                            #{booking.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            Car ID: {booking.car?.id || booking.carId || "N/A"}
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-semibold">
                            {getUserName(booking)}
                          </p>
                          {getUserEmail(booking) && (
                            <p className="text-xs text-gray-500 max-w-[180px] truncate">
                              {getUserEmail(booking)}
                            </p>
                          )}
                        </td>

                        <td className="p-3">
                          <p className="font-semibold">
                            {booking.carName || booking.car?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.brand || booking.car?.brand || "N/A"}
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-medium">
                            {formatDate(booking.pickupDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            to {formatDate(booking.dropoffDate)}
                          </p>
                          <p className="text-xs font-semibold mt-1">
                            {booking.days || 0} day
                            {Number(booking.days) === 1 ? "" : "s"}
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-medium">
                            {booking.pickupLocation || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            to {booking.dropoffLocation || "N/A"}
                          </p>
                        </td>

                        <td className="p-3">
                          <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">
                            {String(booking.tripType || "N/A").replaceAll(
                              "_",
                              " ",
                            )}
                          </span>
                        </td>

                        <td className="p-3">
                          <p className="font-bold text-secondary">
                            {formatMoney(booking.total)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatMoney(booking.price)} / day
                          </p>
                        </td>

                        <td className="p-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                              status,
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            {status === "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleBookingStatus(booking.id, "CONFIRMED")
                                  }
                                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white p-2.5 rounded-lg"
                                  title="Accept Booking"
                                >
                                  <FiCheck />
                                </button>

                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleBookingStatus(booking.id, "REJECTED")
                                  }
                                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white p-2.5 rounded-lg"
                                  title="Reject Booking"
                                >
                                  <FiX />
                                </button>
                              </>
                            )}

                            {status === "CONFIRMED" && (
                              <>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleBookingStatus(booking.id, "COMPLETED")
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                >
                                  Complete
                                </button>

                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleBookingStatus(booking.id, "CANCELLED")
                                  }
                                  className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {["REJECTED", "CANCELLED", "COMPLETED"].includes(
                              status,
                            ) && (
                              <span className="text-xs text-gray-400">
                                No action
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile booking cards */}
            <div className="md:hidden bg-gray-50 p-3 grid grid-cols-1 xl:grid-cols-2 gap-4">
              {bookingList.map((booking) => {
                const status = getBookingStatus(booking);
                const isUpdating = bookingActionId === booking.id;

                const carName =
                  booking.carName || booking.car?.name || "Car unavailable";

                const carBrand = booking.brand || booking.car?.brand || "N/A";

                const customerName = getUserName(booking);
                const customerEmail = getUserEmail(booking);

                return (
                  <article
                    key={booking.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col"
                  >
                    <div className="border-b border-gray-100 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500">
                            Booking #{booking.id}
                          </p>

                          <h3 className="mt-1 break-words text-lg font-bold leading-tight text-primary">
                            {carName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {carBrand}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-4 rounded-xl bg-gray-50 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Customer
                            </p>
                            <p className="mt-1 break-words text-sm font-bold text-gray-900">
                              {customerName}
                            </p>
                            {customerEmail && (
                              <p className="mt-0.5 break-all text-xs text-gray-500">
                                {customerEmail}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Total
                            </p>
                            <p className="mt-1 text-base font-bold text-secondary">
                              {formatMoney(booking.total)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-gray-100 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Pickup
                          </p>
                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {formatDate(booking.pickupDate)}
                          </p>
                          <p className="mt-1 break-words text-xs leading-relaxed text-gray-500">
                            {booking.pickupLocation || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Dropoff
                          </p>
                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {formatDate(booking.dropoffDate)}
                          </p>
                          <p className="mt-1 break-words text-xs leading-relaxed text-gray-500">
                            {booking.dropoffLocation || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {booking.days || 0} day
                            {Number(booking.days) === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Trip Type
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-gray-900">
                            {String(booking.tripType || "N/A").replaceAll(
                              "_",
                              " ",
                            )}
                          </p>
                        </div>
                      </div>

                      {status === "PENDING" && (
                        <div className="mt-4 grid grid-cols-2 gap-3 mt-auto pt-4">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleBookingStatus(booking.id, "CONFIRMED")
                            }
                            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiCheck />
                            {isUpdating ? "Processing" : "Accept"}
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleBookingStatus(booking.id, "REJECTED")
                            }
                            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiX />
                            {isUpdating ? "Processing" : "Reject"}
                          </button>
                        </div>
                      )}

                      {status === "CONFIRMED" && (
                        <div className="mt-4 grid grid-cols-2 gap-3 mt-auto pt-4">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleBookingStatus(booking.id, "COMPLETED")
                            }
                            className="min-h-[46px] rounded-xl bg-blue-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
                          >
                            Complete
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleBookingStatus(booking.id, "CANCELLED")
                            }
                            className="min-h-[46px] rounded-xl bg-gray-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-gray-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const filteredUsers = useMemo(() => {
    const searchValue = userSearch.trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      const id = String(user.id || "").toLowerCase();

      const fullName = (
        user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim()
      ).toLowerCase();

      const email = String(user.email || "").toLowerCase();

      const phone = String(user.phone || "").toLowerCase();

      const role = String(user.role || "USER").toLowerCase();

      const status = String(user.status || "ACTIVE").toLowerCase();

      return (
        id.includes(searchValue) ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        role.includes(searchValue) ||
        status.includes(searchValue)
      );
    });
  }, [users, userSearch]);

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 sm:p-5 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              User Management
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              View, block, unblock and delete users
            </p>
          </div>

          <div className="relative w-full sm:w-72 lg:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Search all user fields"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 outline-none transition focus:border-secondary focus:ring-2 focus:ring-red-100"
            />
            {userSearch && (
              <button
                type="button"
                onClick={() => setUserSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                title="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="p-10 text-center">
          <FiUsers className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No users found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try another search value.
          </p>
          {userSearch && (
            <button
              type="button"
              onClick={() => setUserSearch("")}
              className="mt-4 text-secondary font-semibold hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const userFullName =
                    user.fullName ||
                    `${user.firstName || ""} ${user.lastName || ""}`.trim();
                  const userStatus = String(
                    user.status || (user.blocked ? "BLOCKED" : "ACTIVE"),
                  ).toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{user.id}</td>
                      <td className="p-3 font-semibold">
                        {userFullName || "N/A"}
                      </td>
                      <td className="p-3">{user.email || "N/A"}</td>
                      <td className="p-3">{user.phone || "N/A"}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${userStatus === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {userStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                            title="View User"
                          >
                            <FiEye />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBlockUser(user.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                            title={
                              userStatus === "BLOCKED"
                                ? "Unblock User"
                                : "Block User"
                            }
                          >
                            {userStatus === "BLOCKED" ? (
                              <FiUserCheck />
                            ) : (
                              <FiUserX />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4">
            {filteredUsers.map((user) => {
              const userFullName =
                user.fullName ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim();
              const userStatus = String(
                user.status || (user.blocked ? "BLOCKED" : "ACTIVE"),
              ).toUpperCase();

              return (
                <article
                  key={user.id}
                  className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">User #{user.id}</p>
                      <h3 className="font-bold text-base sm:text-lg text-primary truncate">
                        {userFullName || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-500 break-all">
                        {user.email || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${userStatus === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {userStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="bg-gray-50 border rounded-lg p-3">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold break-all">
                        {user.phone || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-3">
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="font-semibold">{user.role || "USER"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm"
                    >
                      <FiEye /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBlockUser(user.id)}
                      className="bg-yellow-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm"
                    >
                      {userStatus === "BLOCKED" ? <FiUserCheck /> : <FiUserX />}
                      {userStatus === "BLOCKED" ? "Unblock" : "Block"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  const DOCUMENT_BASE_URL = "http://localhost:8080/user/document/";

  const getDocumentUrl = (fileName) => {
    if (!fileName) return "";

    if (
      fileName.startsWith("http://") ||
      fileName.startsWith("https://") ||
      fileName.startsWith("blob:")
    ) {
      return fileName;
    }

    return `${DOCUMENT_BASE_URL}${encodeURIComponent(fileName)}`;
  };

  const getFileType = (fileName) => {
    if (!fileName) return "unknown";

    const extension = String(fileName).split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension)) {
      return "image";
    }

    if (extension === "pdf") {
      return "pdf";
    }

    if (["doc", "docx"].includes(extension)) {
      return "doc";
    }

    return "unknown";
  };

  //   const openDocumentPreview = (document, documentType) => {
  //   const isDrivingLicense = documentType === "DRIVING_LICENSE";
  //   const fileName = isDrivingLicense
  //     ? document.drivingLicense
  //     : document.aadhharCard;

  //   if (!fileName) {
  //     setToast({
  //       message: "Document is not uploaded",
  //       type: "warning",
  //     });
  //     return;
  //   }

  // //   setDocumentPreview({
  // //   documentId: document.id,
  // //   documentType,
  // //   fileType: getFileType(fileName), // ✅ add this line
  // //   title: isDrivingLicense
  // //     ? "Driving License Review"
  // //     : "Aadhaar Card Review",
  // //   fileName,
  // //   fileUrl: getDocumentUrl(fileName),
  // //   userId: document.userId,
  // //   userName:
  // //     document.fullName ||
  // //     `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
  // //     "Unknown User",
  // // });
  // setDocumentPreview({
  //   documentId: document.id,
  //   documentType,
  //   fileType: getFileType(fileName),
  //   status: document.status,        // ← added
  //   title: isDrivingLicense
  //     ? "Driving License Review"
  //     : "Aadhaar Card Review",
  //   fileName,
  //   fileUrl: getDocumentUrl(fileName),
  //   userId: document.userId,
  //   userName:
  //     document.fullName ||
  //     `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
  //     "Unknown User",
  // });
  // };

  const openDocumentPreview = (document, documentType) => {
    const isDrivingLicense = documentType === "DRIVING_LICENSE";
    const fileName = isDrivingLicense
      ? document.drivingLicense
      : document.aadhharCard;

    if (!fileName) {
      setToast({
        message: "Document is not uploaded",
        type: "warning",
      });
      return;
    }

    setDocumentPreview({
      documentId: document.id,
      documentType,
      fileType: getFileType(fileName),
      status: document.status,
      title: isDrivingLicense
        ? "Driving License Review"
        : "Aadhaar Card Review",
      fileName,
      fileUrl: getDocumentUrl(fileName),
      userId: document.userId,
      userName:
        document.fullName ||
        `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
        "Unknown User",
    });
  };
  const closeDocumentPreview = () => {
    setDocumentPreview(null);
  };

  //   const handleDocumentStatusChange = async (document, newStatus) => {
  //   const normalizedStatus = String(newStatus || "").toUpperCase();

  //   if (normalizedStatus === "REJECT") {
  //     setRejectReasonInput(document.reason || "");
  //     setRejectReasonError("");

  //     setRejectModal({
  //       documentId: document.id,
  //       userId: document.userId,
  //       previousStatus: String(document.status || "PENDING").toUpperCase(),
  //       userName:
  //         document.fullName ||
  //         `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
  //         "Unknown User",
  //     });

  //     return;
  //   }

  //   const previousDocuments = documents;

  //   try {
  //     setDocumentUpdatingId(document.id);

  //     // Optimistic update
  //     setDocuments((currentDocuments) =>
  //       currentDocuments.map((currentDocument) =>
  //         Number(currentDocument.id) === Number(document.id)
  //           ? {
  //               ...currentDocument,
  //               status: normalizedStatus,
  //               reason: "",
  //             }
  //           : currentDocument,
  //       ),
  //     );

  //     // ✅ Correct function name, correct 3 args (id, status, reason)
  //     // const updatedDocument = await updateDocumentStatusByAdmin(
  //     //   document.id,
  //     //   normalizedStatus,
  //     //   "",
  //     // );

  //     // setDocumentPreview((currentPreview) =>
  //     //   currentPreview && Number(currentPreview.documentId) === Number(document.id)
  //     //     ? { ...currentPreview, status: updatedDocument?.status || normalizedStatus }
  //     //     : currentPreview,
  //     // );

  //     // setToast({
  //     //   message: `Document status updated to ${normalizedStatus}`,
  //     //   type: "success",
  //     // });

  //     // setDocuments((currentDocuments) =>
  //     //   currentDocuments.map((currentDocument) =>
  //     //     Number(currentDocument.id) === Number(document.id)
  //     //       ? {
  //     //           ...currentDocument,
  //     //           status: updatedDocument?.status || normalizedStatus,
  //     //           reason:
  //     //             updatedDocument?.reason !== undefined
  //     //               ? updatedDocument.reason
  //     //               : "",
  //     //         }
  //     //       : currentDocument,
  //     //   ),
  //     // );

  //     // setToast({
  //     //   message: `Document status updated to ${normalizedStatus}`,
  //     //   type: "success",
  //     // });
  //     // ✅ Correct function name, correct 3 args (id, status, reason)
  //     const updatedDocument = await updateDocumentStatusByAdmin(
  //       document.id,
  //       normalizedStatus,
  //       "",
  //     );

  //     setDocuments((currentDocuments) =>
  //       currentDocuments.map((currentDocument) =>
  //         Number(currentDocument.id) === Number(document.id)
  //           ? {
  //               ...currentDocument,
  //               status: updatedDocument?.status || normalizedStatus,
  //               reason:
  //                 updatedDocument?.reason !== undefined
  //                   ? updatedDocument.reason
  //                   : "",
  //             }
  //           : currentDocument,
  //       ),
  //     );

  //     setDocumentPreview((currentPreview) =>
  //       currentPreview && Number(currentPreview.documentId) === Number(document.id)
  //         ? { ...currentPreview, status: updatedDocument?.status || normalizedStatus }
  //         : currentPreview,
  //     );

  //     setToast({
  //       message: `Document status updated to ${normalizedStatus}`,
  //       type: "success",
  //     });
  //   } catch (error) {
  //     console.error(
  //       "Document status update error:",
  //       error.response?.data || error.message,
  //     );

  //     setDocuments(previousDocuments);

  //     setToast({
  //       message:
  //         error.response?.data?.message ||
  //         error.response?.data ||
  //         "Document status update failed",
  //       type: "error",
  //     });
  //   } finally {
  //     setDocumentUpdatingId(null);
  //   }
  // };
  const handleDocumentStatusChange = async (document, newStatus) => {
    const normalizedStatus = String(newStatus || "").toUpperCase();

    if (normalizedStatus === "REJECT") {
      setRejectReasonInput(document.reason || "");
      setRejectReasonError("");

      setRejectModal({
        documentId: document.id,
        userId: document.userId,
        previousStatus: String(document.status || "PENDING").toUpperCase(),
        userName:
          document.fullName ||
          `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
          "Unknown User",
      });

      return;
    }

    const previousDocuments = documents;

    try {
      setDocumentUpdatingId(document.id);

      // Optimistic update
      setDocuments((currentDocuments) =>
        currentDocuments.map((currentDocument) =>
          Number(currentDocument.id) === Number(document.id)
            ? {
                ...currentDocument,
                status: normalizedStatus,
                reason: "",
              }
            : currentDocument,
        ),
      );

      const updatedDocument = await updateDocumentStatusByAdmin(
        document.id,
        normalizedStatus,
        "",
      );

      setDocuments((currentDocuments) =>
        currentDocuments.map((currentDocument) =>
          Number(currentDocument.id) === Number(document.id)
            ? {
                ...currentDocument,
                status: updatedDocument?.status || normalizedStatus,
                reason:
                  updatedDocument?.reason !== undefined
                    ? updatedDocument.reason
                    : "",
              }
            : currentDocument,
        ),
      );

      setDocumentPreview((currentPreview) =>
        currentPreview &&
        Number(currentPreview.documentId) === Number(document.id)
          ? {
              ...currentPreview,
              status: updatedDocument?.status || normalizedStatus,
            }
          : currentPreview,
      );

      setToast({
        message: `Document status updated to ${normalizedStatus}`,
        type: "success",
      });
    } catch (error) {
      console.error(
        "Document status update error:",
        error.response?.data || error.message,
      );

      setDocuments(previousDocuments);

      setToast({
        message:
          error.response?.data?.message ||
          error.response?.data ||
          "Document status update failed",
        type: "error",
      });
    } finally {
      setDocumentUpdatingId(null);
    }
  };
  const renderDocuments = () => {
    const getDocumentStatusClass = (status) => {
      switch (String(status || "PENDING").toUpperCase()) {
        case "ACCEPT":
          return "border-green-300 bg-green-50 text-green-700";
        case "REJECT":
          return "border-red-300 bg-red-50 text-red-700";
        default:
          return "border-yellow-300 bg-yellow-50 text-yellow-700";
      }
    };

    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="border-b p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary sm:text-2xl">
                Document Verification
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Review and verify customer identity documents
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDocuments}
              disabled={documentLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiRefreshCw className={documentLoading ? "animate-spin" : ""} />
              {documentLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {documentLoading ? (
          <div className="p-12 text-center text-gray-500">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="mx-auto mb-3 text-5xl text-gray-300" />
            <p className="font-semibold text-gray-600">No documents found</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">User ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Driving License</th>
                    <th className="p-4 text-left">Aadhaar Card</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((document) => {
                    const status = String(
                      document.status || "PENDING",
                    ).toUpperCase();
                    const isUpdating =
                      Number(documentUpdatingId) === Number(document.id);
                    const fullName =
                      document.fullName ||
                      `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
                      "Unknown User";

                    return (
                      <tr
                        key={document.id}
                        className="border-b transition hover:bg-gray-50"
                      >
                        <td className="p-4 font-bold text-primary">
                          {document.userId || "-"}
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-gray-900">
                            {fullName}
                          </p>
                          {document.email && (
                            <p className="text-xs text-gray-500">
                              {document.email}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          {document.drivingLicense ? (
                            <button
                              type="button"
                              onClick={() =>
                                openDocumentPreview(document, "DRIVING_LICENSE")
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              <FiEye /> Review
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not Uploaded
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {document.aadhharCard ? (
                            <button
                              type="button"
                              onClick={() =>
                                openDocumentPreview(document, "AADHAAR_CARD")
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                            >
                              <FiEye /> Review
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not Uploaded
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <select
                            value={status}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleDocumentStatusChange(
                                document,
                                event.target.value,
                              )
                            }
                            className={`min-w-[130px] rounded-lg border px-3 py-2.5 text-xs font-bold outline-none disabled:opacity-50 ${getDocumentStatusClass(
                              status,
                            )}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="ACCEPT">ACCEPT</option>
                            <option value="REJECT">REJECT</option>
                          </select>
                          {isUpdating && (
                            <p className="mt-1 text-xs text-gray-400">
                              Updating...
                            </p>
                          )}
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                          {document.reason || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-3 md:hidden">
              {documents.map((document) => {
                const status = String(
                  document.status || "PENDING",
                ).toUpperCase();
                const isUpdating =
                  Number(documentUpdatingId) === Number(document.id);
                const fullName =
                  document.fullName ||
                  `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
                  "Unknown User";

                return (
                  <article
                    key={document.id}
                    className="rounded-2xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          User ID: {document.userId || "-"}
                        </p>
                        <h3 className="truncate font-bold text-primary">
                          {fullName}
                        </h3>
                        {document.email && (
                          <p className="truncate text-xs text-gray-500">
                            {document.email}
                          </p>
                        )}
                      </div>

                      <select
                        value={status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleDocumentStatusChange(
                            document,
                            event.target.value,
                          )
                        }
                        className={`rounded-lg border px-2 py-2 text-[10px] font-bold ${getDocumentStatusClass(
                          status,
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACCEPT">ACCEPT</option>
                        <option value="REJECT">REJECT</option>
                      </select>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={!document.drivingLicense}
                        onClick={() =>
                          openDocumentPreview(document, "DRIVING_LICENSE")
                        }
                        className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-700 disabled:opacity-40"
                      >
                        <FiEye className="text-xl" />
                        <span className="text-xs font-bold">
                          Review License
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={!document.aadhharCard}
                        onClick={() =>
                          openDocumentPreview(document, "AADHAAR_CARD")
                        }
                        className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 p-3 text-purple-700 disabled:opacity-40"
                      >
                        <FiEye className="text-xl" />
                        <span className="text-xs font-bold">
                          Review Aadhaar
                        </span>
                      </button>
                    </div>

                    <div className="mt-4 rounded-xl border bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Reason</p>
                      <p className="mt-1 text-sm font-medium">
                        {document.reason || "-"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const formatRevenueMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatRevenueDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const cleanDate = String(dateValue).substring(0, 10);
    const date = new Date(`${cleanDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) return cleanDate;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRevenueCustomerName = (booking) =>
    booking.user?.fullName ||
    booking.user?.name ||
    [booking.user?.firstName, booking.user?.lastName]
      .filter(Boolean)
      .join(" ") ||
    booking.userName ||
    booking.name ||
    "N/A";

  const getRevenueCarName = (booking) =>
    booking.carName || booking.car?.name || "N/A";

  const getRevenueReportPeriod = () => {
    if (revenueReportType === "DAILY") {
      return formatRevenueDate(revenueDate);
    }

    if (revenueReportType === "MONTHLY") {
      if (!revenueMonth) return "N/A";
      const [year, month] = revenueMonth.split("-");
      return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
        "en-IN",
        { month: "long", year: "numeric" },
      );
    }

    if (revenueReportType === "CUSTOM") {
      return `${formatRevenueDate(revenueStartDate)} to ${formatRevenueDate(
        revenueEndDate,
      )}`;
    }

    return "All Time";
  };

  const validateRevenueFilter = () => {
    if (revenueReportType === "DAILY" && !revenueDate) {
      setToast({ message: "Please select report date", type: "warning" });
      return false;
    }

    if (revenueReportType === "MONTHLY" && !revenueMonth) {
      setToast({ message: "Please select report month", type: "warning" });
      return false;
    }

    if (revenueReportType === "CUSTOM") {
      if (!revenueStartDate || !revenueEndDate) {
        setToast({
          message: "Please select start and end dates",
          type: "warning",
        });
        return false;
      }

      if (revenueStartDate > revenueEndDate) {
        setToast({
          message: "Start date cannot be after end date",
          type: "warning",
        });
        return false;
      }
    }

    return true;
  };

  const downloadRevenuePdf = () => {
    if (!validateRevenueFilter()) return;

    if (filteredRevenueBookings.length === 0) {
      setToast({
        message: "No revenue records available for the selected period",
        type: "warning",
      });
      return;
    }

    try {
      setIsGeneratingPdf(true);

      const document = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const generatedDate = new Date();
      const reportNumber = `REV-${generatedDate.getFullYear()}${String(
        generatedDate.getMonth() + 1,
      ).padStart(2, "0")}${String(generatedDate.getDate()).padStart(
        2,
        "0",
      )}-${String(generatedDate.getTime()).slice(-6)}`;

      const pageWidth = document.internal.pageSize.getWidth();

      document.setFillColor(220, 38, 38);
      document.rect(0, 0, pageWidth, 34, "F");
      document.setTextColor(255, 255, 255);
      document.setFont("helvetica", "bold");
      document.setFontSize(21);
      document.text("SELFDRIVE JUNCTION", 14, 15);
      document.setFont("helvetica", "normal");
      document.setFontSize(10);
      document.text("Car Rental Revenue & Collection Statement", 14, 23);
      document.setFontSize(9);
      document.text(`Report No: ${reportNumber}`, pageWidth - 14, 13, {
        align: "right",
      });
      document.text(
        `Generated: ${generatedDate.toLocaleString("en-IN")}`,
        pageWidth - 14,
        21,
        { align: "right" },
      );

      document.setTextColor(20, 20, 20);
      document.setFont("helvetica", "bold");
      document.setFontSize(15);
      document.text("REVENUE REPORT", 14, 45);
      document.setFont("helvetica", "normal");
      document.setFontSize(10);
      document.text(`Report Type: ${revenueReportType}`, 14, 53);
      document.text(`Report Period: ${getRevenueReportPeriod()}`, 14, 60);
      document.text(
        `Generated By: ${localStorage.getItem("name") || "Administrator"}`,
        14,
        67,
      );

      const summaryY = 76;
      const boxWidth = 49;
      const boxHeight = 20;
      const boxGap = 5;
      const summaryCards = [
        {
          label: "Total Revenue",
          value: `INR ${Number(revenueSummary.revenue).toLocaleString("en-IN")}`,
        },
        { label: "Paid Bookings", value: String(revenueSummary.bookingCount) },
        {
          label: "Average Booking",
          value: `INR ${Math.round(
            revenueSummary.averageBooking,
          ).toLocaleString("en-IN")}`,
        },
        {
          label: "Highest Booking",
          value: `INR ${Number(revenueSummary.highestBooking).toLocaleString(
            "en-IN",
          )}`,
        },
        { label: "Cancelled", value: String(revenueSummary.cancelledCount) },
      ];

      summaryCards.forEach((summary, index) => {
        const x = 14 + index * (boxWidth + boxGap);
        document.setFillColor(254, 242, 242);
        document.setDrawColor(254, 202, 202);
        document.roundedRect(x, summaryY, boxWidth, boxHeight, 2, 2, "FD");
        document.setTextColor(100, 100, 100);
        document.setFontSize(8);
        document.setFont("helvetica", "normal");
        document.text(summary.label, x + 3, summaryY + 7);
        document.setTextColor(185, 28, 28);
        document.setFontSize(11);
        document.setFont("helvetica", "bold");
        document.text(summary.value, x + 3, summaryY + 15);
      });

      const tableRows = filteredRevenueBookings.map((booking, index) => [
        index + 1,
        `#${booking.id}`,
        formatRevenueDate(getBookingRevenueDate(booking)),
        getRevenueCustomerName(booking),
        getRevenueCarName(booking),
        String(booking.tripType || "N/A").replaceAll("_", " "),
        `${booking.pickupLocation || "N/A"} to ${
          booking.dropoffLocation || "N/A"
        }`,
        booking.days || 0,
        getBookingStatusValue(booking),
        `INR ${Number(booking.total || 0).toLocaleString("en-IN")}`,
      ]);

      autoTable(document, {
        startY: 104,
        head: [
          [
            "Sr.",
            "Booking",
            "Revenue Date",
            "Customer",
            "Vehicle",
            "Trip Type",
            "Route",
            "Days",
            "Status",
            "Amount",
          ],
        ],
        body: tableRows,
        theme: "grid",
        headStyles: {
          fillColor: [220, 38, 38],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
        },
        bodyStyles: { fontSize: 7.5, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 18 },
          2: { cellWidth: 25 },
          3: { cellWidth: 34 },
          4: { cellWidth: 34 },
          5: { cellWidth: 27 },
          6: { cellWidth: 45 },
          7: { cellWidth: 13, halign: "center" },
          8: { cellWidth: 22 },
          9: { cellWidth: 27, halign: "right", fontStyle: "bold" },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          const pageHeight = document.internal.pageSize.getHeight();
          document.setFontSize(8);
          document.setFont("helvetica", "normal");
          document.setTextColor(120, 120, 120);
          document.text(
            "This is a system-generated revenue statement.",
            14,
            pageHeight - 8,
          );
          document.text(
            `Page ${document.internal.getNumberOfPages()}`,
            pageWidth - 14,
            pageHeight - 8,
            { align: "right" },
          );
        },
      });

      const finalY = document.lastAutoTable?.finalY || 110;
      document.setFillColor(248, 250, 252);
      document.setDrawColor(220, 220, 220);
      document.roundedRect(pageWidth - 88, finalY + 7, 74, 26, 2, 2, "FD");
      document.setTextColor(70, 70, 70);
      document.setFontSize(9);
      document.setFont("helvetica", "normal");
      document.text("Total Paid Bookings", pageWidth - 84, finalY + 16);
      document.text("Net Revenue", pageWidth - 84, finalY + 26);
      document.setFont("helvetica", "bold");
      document.text(
        String(revenueSummary.bookingCount),
        pageWidth - 18,
        finalY + 16,
        { align: "right" },
      );
      document.setTextColor(220, 38, 38);
      document.setFontSize(12);
      document.text(
        `INR ${Number(revenueSummary.revenue).toLocaleString("en-IN")}`,
        pageWidth - 18,
        finalY + 27,
        { align: "right" },
      );

      const safePeriod = getRevenueReportPeriod()
        .replaceAll(" ", "-")
        .replaceAll("/", "-")
        .replaceAll(",", "");

      document.save(`SelfDrive-Revenue-${safePeriod}.pdf`);
      setToast({
        message: "Revenue PDF downloaded successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Revenue PDF generation error:", error);
      setToast({ message: "Unable to generate revenue PDF", type: "error" });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const renderRevenue = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Revenue & Payment Reports
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Generate daily, monthly, custom and all-time revenue statements
            </p>
          </div>

          <button
            type="button"
            onClick={downloadRevenuePdf}
            disabled={isGeneratingPdf || filteredRevenueBookings.length === 0}
            className="w-full lg:w-auto bg-secondary hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            <FiDownload />
            {isGeneratingPdf ? "Generating PDF..." : "Download PDF Report"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="text-secondary" />
          <h3 className="text-lg font-bold text-primary">Report Filter</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Report Type
            </label>
            <select
              value={revenueReportType}
              onChange={(event) => setRevenueReportType(event.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full bg-white outline-none focus:border-secondary focus:ring-2 focus:ring-red-100"
            >
              <option value="DAILY">Daily Report</option>
              <option value="MONTHLY">Monthly Report</option>
              <option value="CUSTOM">Custom Date Range</option>
              <option value="ALL">All-Time Report</option>
            </select>
          </div>

          {revenueReportType === "DAILY" && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Report Date
              </label>
              <input
                type="date"
                value={revenueDate}
                onChange={(event) => setRevenueDate(event.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full outline-none focus:border-secondary focus:ring-2 focus:ring-red-100"
              />
            </div>
          )}

          {revenueReportType === "MONTHLY" && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Report Month
              </label>
              <input
                type="month"
                value={revenueMonth}
                onChange={(event) => setRevenueMonth(event.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full outline-none focus:border-secondary focus:ring-2 focus:ring-red-100"
              />
            </div>
          )}

          {revenueReportType === "CUSTOM" && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={revenueStartDate}
                  onChange={(event) => setRevenueStartDate(event.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full outline-none focus:border-secondary focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  min={revenueStartDate}
                  value={revenueEndDate}
                  onChange={(event) => setRevenueEndDate(event.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full outline-none focus:border-secondary focus:ring-2 focus:ring-red-100"
                />
              </div>
            </>
          )}

          <div className="flex items-end">
            <button
              type="button"
              onClick={fetchTotalBookings}
              disabled={totalBookingLoading}
              className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw />
              {totalBookingLoading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-sm">
          <span className="text-gray-500">Selected period:</span>
          <span className="ml-2 font-bold text-primary">
            {getRevenueReportPeriod()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-red-100 text-sm">Net Revenue</p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 break-all">
                {formatRevenueMoney(revenueSummary.revenue)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              <FiDollarSign />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-gray-500 text-sm">Paid Bookings</p>
              <h3 className="text-2xl font-bold text-primary mt-2">
                {revenueSummary.bookingCount}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center text-xl">
              <FiCheck />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-gray-500 text-sm">Average Booking</p>
              <h3 className="text-2xl font-bold text-primary mt-2">
                {formatRevenueMoney(Math.round(revenueSummary.averageBooking))}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-xl">
              <FiTrendingUp />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-gray-500 text-sm">Highest Booking</p>
              <h3 className="text-2xl font-bold text-primary mt-2">
                {formatRevenueMoney(revenueSummary.highestBooking)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-xl">
              <FiTrendingUp />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-700">Completed Trips</p>
          <p className="text-xl font-bold text-green-800 mt-1">
            {revenueSummary.completedCount}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-xs text-purple-700">Active Trips</p>
          <p className="text-xl font-bold text-purple-800 mt-1">
            {revenueSummary.activeCount}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-700">Confirmed Trips</p>
          <p className="text-xl font-bold text-blue-800 mt-1">
            {revenueSummary.confirmedCount}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-600">Cancelled Trips</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {revenueSummary.cancelledCount}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-primary">
              Revenue Transactions
            </h3>
            <p className="text-sm text-gray-500">
              Revenue is calculated in React from confirmed, active and
              completed bookings
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {filteredRevenueBookings.length} transaction
            {filteredRevenueBookings.length === 1 ? "" : "s"}
          </span>
        </div>

        {totalBookingLoading ? (
          <div className="p-12 text-center text-gray-500">
            Loading revenue records...
          </div>
        ) : filteredRevenueBookings.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">
              No revenue records found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Select another date or report period.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Booking</th>
                    <th className="p-3 text-left">Revenue Date</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Vehicle</th>
                    <th className="p-3 text-left">Route</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRevenueBookings.map((booking) => {
                    const status = getBookingStatusValue(booking);
                    return (
                      <tr
                        key={booking.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-bold text-primary">
                          #{booking.id}
                        </td>
                        <td className="p-3">
                          {formatRevenueDate(getBookingRevenueDate(booking))}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold">
                            {getRevenueCustomerName(booking)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.user?.email || booking.email || ""}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold">
                            {getRevenueCarName(booking)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.brand || booking.car?.brand || "N/A"}
                          </p>
                        </td>
                        <td className="p-3">
                          <p>{booking.pickupLocation || "N/A"}</p>
                          <p className="text-xs text-gray-500">
                            to {booking.dropoffLocation || "N/A"}
                          </p>
                        </td>
                        <td className="p-3">
                          {booking.days || 0} day
                          {Number(booking.days) === 1 ? "" : "s"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              status === "COMPLETED"
                                ? "bg-blue-100 text-blue-700"
                                : status === "ACTIVE"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-secondary">
                          {formatRevenueMoney(booking.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-red-50 border-t-2 border-red-200">
                  <tr>
                    <td
                      colSpan="7"
                      className="p-4 text-right font-bold text-primary"
                    >
                      Net Revenue
                    </td>
                    <td className="p-4 text-right text-lg font-bold text-secondary">
                      {formatRevenueMoney(revenueSummary.revenue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="md:hidden p-3 bg-gray-50 space-y-3">
              {filteredRevenueBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="bg-white border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Booking #{booking.id}
                      </p>
                      <h4 className="font-bold text-primary mt-1">
                        {getRevenueCarName(booking)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {getRevenueCustomerName(booking)}
                      </p>
                    </div>
                    <p className="font-bold text-secondary">
                      {formatRevenueMoney(booking.total)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Revenue Date</p>
                      <p className="font-semibold mt-1">
                        {formatRevenueDate(getBookingRevenueDate(booking))}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-semibold mt-1">
                        {getBookingStatusValue(booking)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-xs text-gray-500">Route</p>
                      <p className="font-semibold mt-1">
                        {booking.pickupLocation || "N/A"} →{" "}
                        {booking.dropoffLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeSection === "cars") return renderCars();
    if (activeSection === "users") return renderUsers();
    if (activeSection === "bookings") return renderTotalBookings();
    if (activeSection === "pending") return renderBookings(true);
    if (activeSection === "documents") return renderDocuments();
    if (activeSection === "revenue") return renderRevenue();

    return renderCars();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Mobile dashboard heading */}
      <div className="border-b border-gray-200 bg-white lg:hidden">
        <div className="px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your rental business
          </p>
        </div>

        {/* Mobile dashboard navigation - responsive card grid instead of horizontal scroll */}
        <div className="px-3 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {dashboardCards.map((card) => (
              <button
                key={card.key}
                type="button"
                onClick={() => setActiveSection(card.key)}
                className={`flex items-center gap-2 sm:gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  activeSection === card.key
                    ? "border-secondary bg-secondary text-white shadow-md"
                    : "border-gray-200 bg-white text-primary"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base sm:text-lg ${
                    activeSection === card.key
                      ? "bg-white text-secondary"
                      : "bg-red-50 text-secondary"
                  }`}
                >
                  {card.icon}
                </span>

                <span className="min-w-0">
                  <span
                    className={`block truncate text-[11px] font-medium ${
                      activeSection === card.key
                        ? "text-red-50"
                        : "text-gray-500"
                    }`}
                  >
                    {card.title}
                  </span>
                  <span className="block truncate text-sm sm:text-base font-bold">
                    {card.value}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-4 sm:py-6 lg:py-8">
        {/* Desktop heading */}
        <div className="mb-8 hidden lg:block">
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage cars, users, bookings, documents and revenue
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-primary">Dashboard</h3>

              <div className="space-y-3">
                {dashboardCards.map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setActiveSection(card.key)}
                    className={`group w-full rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                      activeSection === card.key
                        ? "border-secondary bg-secondary shadow-lg"
                        : "border-gray-200 bg-white hover:border-secondary hover:bg-secondary hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-all duration-300 ${
                          activeSection === card.key
                            ? "bg-white text-secondary"
                            : "bg-red-100 text-secondary group-hover:bg-white"
                        }`}
                      >
                        {card.icon}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm transition-colors ${
                            activeSection === card.key
                              ? "text-white"
                              : "text-gray-500 group-hover:text-white"
                          }`}
                        >
                          {card.title}
                        </p>

                        <h2
                          className={`truncate text-2xl font-bold transition-colors ${
                            activeSection === card.key
                              ? "text-white"
                              : "text-primary group-hover:text-white"
                          }`}
                        >
                          {card.value}
                        </h2>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="min-w-0 lg:col-span-3">{renderContent()}</main>
        </div>
      </div>

      {showAddCar && renderCarForm(newCar, setNewCar, handleAddCar, "Add Car")}

      {editingCar &&
        renderCarForm(editingCar, setEditingCar, handleUpdateCar, "Update Car")}

      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="bg-secondary text-white px-4 sm:px-5 py-3 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-lg sm:text-xl font-bold">Car Details</h2>

              <span className="bg-white text-secondary px-3 py-1 rounded-full text-xs font-bold">
                {selectedCar.available || selectedCar.status
                  ? "Available"
                  : "Booked"}
              </span>
            </div>

            <div className="p-4">
              <div className="w-full flex justify-center mb-4">
                <img
                  src={getCarImageUrl(
                    selectedCar.image || selectedCar.mainImage,
                  )}
                  alt={selectedCar.name}
                  className="rounded-xl shadow-md h-32 sm:h-40 w-auto object-contain bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ["ID", selectedCar.id],
                  ["Name", selectedCar.name],
                  ["Brand", selectedCar.brand],
                  ["Price", `₹${selectedCar.price}`],
                  ["Fuel Type", selectedCar.fuelType],
                  ["Transmission", selectedCar.transmition],
                  ["Seating", selectedCar.seating],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3 border">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-semibold text-primary text-sm break-words">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-3 border">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-gray-700 text-sm">
                  {selectedCar.description}
                </p>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-3 border">
                <p className="font-bold text-primary mb-2 text-sm">Features</p>

                {selectedCar.features && selectedCar.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCar.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-secondary px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No features available</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {[selectedCar.img1, selectedCar.img2, selectedCar.img3]
                  .filter(Boolean)
                  .map((img, index) => (
                    <img
                      key={index}
                      src={getCarImageUrl(img)}
                      alt={`car-${index}`}
                      className="w-full h-16 sm:h-20 object-contain bg-gray-100 rounded-lg border"
                    />
                  ))}
              </div>

              <button
                onClick={() => setSelectedCar(null)}
                className="mt-4 w-full bg-secondary text-white py-2.5 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-secondary text-white px-5 sm:px-6 py-4 rounded-t-2xl sticky top-0">
              <h2 className="text-xl sm:text-2xl font-bold">User Details</h2>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-sm">Name</label>
                  <input
                    type="text"
                    value={
                      selectedUser.fullName ||
                      `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                      "N/A"
                    }
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 cursor-default"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-sm">Email</label>
                  <input
                    type="text"
                    value={selectedUser.email || ""}
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 cursor-default"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-sm">Phone</label>
                  <input
                    type="text"
                    value={selectedUser.phone || ""}
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 cursor-default"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-sm">Status</label>
                  <input
                    type="text"
                    value={selectedUser.blocked ? "Blocked" : "Active"}
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 cursor-default"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-sm">Role</label>
                  <select
                    value={selectedUser.role || "USER"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        role: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={handleUpdateUserRole}
                  className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                >
                  Submit
                </button>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-secondary hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-secondary px-5 sm:px-6 py-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white text-lg">
                <FiX />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  Reject Document
                </h2>
                <p className="text-xs sm:text-sm text-red-50">
                  This reason will be visible to the user
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl border bg-gray-50 p-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Customer
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {rejectModal.userName || "Unknown User"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    User ID
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {rejectModal.userId || "-"}
                  </p>
                </div>
              </div>

              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Rejection Reason <span className="text-red-500">*</span>
              </label>

              <textarea
                autoFocus
                value={rejectReasonInput}
                onChange={(e) => {
                  setRejectReasonInput(e.target.value);
                  if (rejectReasonError) setRejectReasonError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    confirmRejectDocument();
                  }
                }}
                placeholder="Explain why this document is being rejected (e.g. blurry image, expired license, mismatched details)..."
                rows="4"
                maxLength={500}
                disabled={Boolean(documentUpdatingId)}
                className={`w-full border rounded-lg p-3 text-sm resize-none outline-none transition focus:ring-2 disabled:bg-gray-100 ${
                  rejectReasonError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-secondary focus:ring-red-100"
                }`}
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                {rejectReasonError ? (
                  <p className="text-xs font-semibold text-red-600">
                    {rejectReasonError}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Be clear and specific so the user knows what to fix.
                  </p>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {rejectReasonInput.length}/500
                </span>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={Boolean(documentUpdatingId)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmRejectDocument}
                  disabled={Boolean(documentUpdatingId)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {documentUpdatingId ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiX /> Reject Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {documentPreview && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 sm:p-5">
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-primary sm:text-xl">
                  {documentPreview.title}
                </h2>
                <p className="truncate text-xs text-gray-500 sm:text-sm">
                  User ID: {documentPreview.userId || "-"} ·{" "}
                  {documentPreview.userName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDocumentPreview}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-3 sm:p-5">
              <div className="flex min-h-[500px] items-center justify-center overflow-hidden rounded-xl border bg-white">
                {/* {documentPreview.fileType === "pdf" ? (
  <div className="flex flex-col items-center gap-4 p-10 text-center">
    <FiFileText className="text-6xl text-red-400" />
    <p className="font-semibold text-gray-700">
      PDF preview can't be embedded here due to browser security policy.
    </p>
    
      <a href={documentPreview.fileUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white hover:bg-red-700"
    >
      <FiEye /> Open PDF in New Tab
    </a>
  </div>
// ) : documentPreview.fileType === "image" ? (
//     <img
//       src={documentPreview.fileUrl}
//       alt={documentPreview.title}
//       className="max-h-[72vh] max-w-full object-contain"
//       onError={(e) => {
//         e.target.style.display = "none";
//         e.target.nextSibling.style.display = "flex";
//       }}
//     />
//   ) : (
) : documentPreview.fileType === "image" ? ( */}
                {/* {documentPreview.fileType === "pdf" ? (
    <div className="flex flex-col items-center gap-4 p-10 text-center">
      <FiFileText className="text-6xl text-red-400" />
      <p className="font-semibold text-gray-700">
        PDF preview can't be embedded here due to browser security policy.
      </p>

      
       <a href={documentPreview.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white hover:bg-red-700"
      >
        <FiEye /> Open PDF in New Tab
      </a>
    </div>
  ) : documentPreview.fileType === "image" ? (
    <div className="relative inline-block">
      <img
        src={documentPreview.fileUrl}
        alt={documentPreview.title}
        className="max-h-[72vh] max-w-full object-contain"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <DocumentStamp status={documentPreview.status} />
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3 p-8 text-center text-gray-500">
      <FiFileText className="text-5xl text-gray-300" />
      <p className="font-semibold">Preview not available for this file type</p>
      <a href={documentPreview.fileUrl} target="_blank" rel="noreferrer" className="text-secondary font-semibold hover:underline">
        Click here to open/download the file
      </a>
    </div>
  )} */}
                {documentPreview.fileType === "pdf" ? (
                  <div className="relative flex w-full flex-col items-center gap-4 p-10 text-center">
                    <FiFileText className="text-6xl text-red-400" />
                    <p className="font-semibold text-gray-700">
                      PDF preview can't be embedded here due to browser security
                      policy.
                    </p>

                    <a
                      href={documentPreview.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white hover:bg-red-700"
                    >
                      <FiEye /> Open PDF in New Tab
                    </a>

                    <DocumentStamp status={documentPreview.status} />
                  </div>
                ) : documentPreview.fileType === "image" ? (
                  <div className="relative inline-block">
                    <img
                      src={documentPreview.fileUrl}
                      alt={documentPreview.title}
                      className="max-h-[72vh] max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <DocumentStamp status={documentPreview.status} />
                  </div>
                ) : (
                  <div className="relative flex w-full flex-col items-center gap-3 p-8 text-center text-gray-500">
                    <FiFileText className="text-5xl text-gray-300" />
                    <p className="font-semibold">
                      Preview not available for this file type
                    </p>

                    <a
                      href={documentPreview.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-secondary font-semibold hover:underline"
                    >
                      Click here to open/download the file
                    </a>

                    <DocumentStamp status={documentPreview.status} />
                  </div>
                )}

                {documentPreview.fileType === "image" && (
                  <div
                    style={{ display: "none" }}
                    className="flex-col items-center gap-3 p-8 text-center text-gray-500"
                  >
                    <FiFileText className="text-5xl text-gray-300" />
                    <p className="font-semibold">Unable to load this image</p>
                    <a
                      href={documentPreview.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-secondary font-semibold hover:underline"
                    >
                      Try opening it directly
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              <a
                href={documentPreview.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
              >
                <FiEye /> Open Full Screen
              </a>

              <button
                type="button"
                onClick={closeDocumentPreview}
                className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-5 sm:p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl">
              <FiTrash2 />
            </div>

            <h2 className="text-xl font-bold text-primary mb-2">
              Delete{" "}
              {deleteConfirm.type === "user"
                ? "User"
                : deleteConfirm.type === "total-booking"
                  ? "Booking"
                  : "Car"}
              ?
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this{" "}
              {deleteConfirm.type === "user"
                ? "user"
                : deleteConfirm.type === "total-booking"
                  ? "booking"
                  : "car"}
              ?
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 left-4 sm:left-auto z-50">
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

export default Administrator;
