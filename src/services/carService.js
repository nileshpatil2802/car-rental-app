import axios from "axios";

const BASE_URL = "http://localhost:8080";

const CAR_IMAGE_BASE_URL ="http://localhost:8080/car-images";

const API_URL = "http://localhost:8080/home/cars";
const LOGIN = "http://localhost:8080/home/login";
// const FORGOT_PASSWORD = "http://localhost:8080/home/forgot-password";

const CART_API_URL = "http://localhost:8080/user/getCarts";
const DELETE_CART_BY_ID = "http://localhost:8080/user/deleteCarts";
const GET_USER_BY_EMAIL = "http://localhost:8080/user/getUserByEmail";
const UPDATE_USER = "http://localhost:8080/user/updateProfile";
const ALL_USERS_FETCH_API_URL = "http://localhost:8080/user/getAllUsers";
const USER_ALL_DOCUMENTS = "http://localhost:8080/user/listOfDocuments";



const UPDATE_CAR_API_URL = "http://localhost:8080/auth/admin/updateCar";
const DELETE_CAR_BY_ID = "http://localhost:8080/auth/admin/deleteCarById";
const DELETE_USER_BY_ID = "http://localhost:8080/auth/admin/deleteUserById";
const UPDATE_USER_STATUS = "http://localhost:8080/auth/admin/updateUserStatus";
const UPDATE_USER_ROLE = "http://localhost:8080/auth/admin/updateUserRole";
const DELETE_BOOKING_BY_ID = "http://localhost:8080/auth/admin/deleteBookingById";
// ========================
// AUTH HEADER
// ========================

const getAuthHeader = () => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  if (!email || !password) {
    return {};
  }

  return {
    Authorization: `Basic ${btoa(`${email}:${password}`)}`
  };
};


export const getAllCars = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Get all Cars : ",response.data);
    return response.data.map((car) => ({
      id: car.id,

      // Keep exact backend car ID
      carId: car.id,

      name: car.name,
      brand: car.brand,
      price: car.price,
      fuelType: car.fuelType,
      transmition: car.transmition,
      seating: car.seating,

      // Keep both names because different components may use either one
      mainImage: car.mainImage,
      image: car.mainImage,

      status: car.status,
      available: car.status,

      img1: car.img1,
      img2: car.img2,
      img3: car.img3,

      rating: car.rating,
      reviews: car.reviews,

      features: [
        car.features?.feature1,
        car.features?.feature2,
        car.features?.feature3,
        car.features?.feature4,
        car.features?.feature5,
      ].filter(Boolean),

      description: car.description,
    }));
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

// export const forgotPassword = async (email) => {
//   const response = await fetch(FORGOT_PASSWORD, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email: email,
//     }),
//   });

//   let data = {};

//   try {
//     data = await response.json();
//   } catch (error) {
//     data = {};
//   }

//   if (!response.ok) {
//     throw new Error(
//       data.message || "Unable to process forgot password request"
//     );
//   }

//   return data;
// };

export const getCarById = async (id) => {
  try {

    console.log("Car Id :", id);

    const response = await axios.get(
      `${API_URL}/${id}`,
      {
        headers: getAuthHeader()
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error fetching car by id:", error);
    return null;
  }
};

// ========================
// LOGIN
// ========================

// export const login = async (email, password) => {
//   const response = await fetch(LOGIN, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   });

//   const data = await response.json();
//   console.log("Login Response:", data);

//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }

//   localStorage.setItem("email", email);
//   localStorage.setItem("password", password);

//   if (data.user) {
//     localStorage.setItem("user", JSON.stringify(data.user));
//   }

//   return data;
// };

// export const login = async (email, password) => {

//   const response = await fetch(LOGIN, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   });

//   const data = await response.json();

//   console.log("Login Response:", data);

//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }

//   localStorage.setItem("email", email);
//   localStorage.setItem("password", password);

//   if (data.user) {
//     localStorage.setItem("user", JSON.stringify(data.user));
//     localStorage.setItem("id", data.user.id);
//     localStorage.setItem("userId", data.user.id);
//     localStorage.setItem("avatar", data.user.avatar);
//     localStorage.setItem("email", data.user.email);
//     localStorage.setItem("firstName", data.user.firstName);
//     localStorage.setItem("lastName", data.user.lastName);
//     localStorage.setItem("phone", data.user.phone);
//     localStorage.setItem("role", data.user.role);
//   }

//   return data;
// };
export const login = async (email, password) => {

  const response = await fetch(LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  console.log("Login Response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  if (data.user) {

    // Clear previous user's data
    localStorage.clear();

    // Store current logged-in user's data
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("id", data.user.id);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("avatar", data.user.avatar);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("password", password);
    localStorage.setItem("firstName", data.user.firstName);
    localStorage.setItem("lastName", data.user.lastName);
    localStorage.setItem("phone", data.user.phone);
    localStorage.setItem("role", data.user.role);
  }

  return data;
};

// ========================
// CARTS
// ========================

// export const getAllCarts = async () => {

//   try {

//     const userId = localStorage.getItem("userId");
//     console.log("I am in get all carts : ", userId);

//     if (!userId) {
//       console.error("User ID is missing");
//       return [];
//     }

//     console.log("Getting carts for user:", userId);

//     const response = await axios.get(`${CART_API_URL}/${userId}`, {
//       headers: getAuthHeader()
//     });

//     console.log("Cart API response:", response.data);

//     return response.data.map((car) => ({

//       id: car.id,
//       name: car.name,
//       brand: car.brand,
//       price: car.price,
//       fuelType: car.fuelType,
//       transmition: car.transmition,
//       seating: car.seating,
//       image: car.mainImage,
//       available: car.status,
//       img1: car.img1,
//       img2: car.img2,
//       img3: car.img3,
//       rating: car.rating,
//       reviews: car.reviews,
//       features: [
//         car.features?.feature1,
//         car.features?.feature2,
//         car.features?.feature3,
//         car.features?.feature4,
//         car.features?.feature5
//       ].filter(Boolean),
//       description: car.description
//     }));
//   } catch (error) {
//     console.error("Error fetching carts:", error);
//     return [];
//   }
// };

export const getAllCarts = async () => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is missing");
      return [];
    }

    const response = await axios.get(
      `${CART_API_URL}/${userId}`,
      {
        headers: getAuthHeader(),
      }
    );

    console.log("RAW CART API RESPONSE:", response.data);

    if (!Array.isArray(response.data)) {
      console.error(
        "Cart API response is not an array:",
        response.data
      );
      return [];
    }

    return response.data.map((cart) => {
      /*
       * New backend DTO uses cartId.
       * Fallback to id supports an older backend response.
       */
      const resolvedCartId =
        cart.cartId ?? cart.id;

      console.log("Mapping cart:", {
        backendCartId: cart.cartId,
        backendId: cart.carId,
        resolvedCartId,
        carId: cart.carId,
      });

      return {
        cartId: resolvedCartId,

        // Temporary support for old frontend code
        id: resolvedCartId,

        // Actual admin_cars_data ID
        carId: cart.carId,

        userId: cart.userId,

        name: cart.name,
        brand: cart.brand,
        price: cart.price,
        fuelType: cart.fuelType,
        transmition: cart.transmition,
        seating: cart.seating,

        mainImage: cart.mainImage,
        image: cart.mainImage,

        createdAt: cart.createdAt,
      };
    });
  } catch (error) {
    console.error(
      "Error fetching carts:",
      error.response?.data || error.message
    );

    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const userId = localStorage.getItem("userId");
    console.log("I am in getAllUsers:", userId);

    const response = await axios.get(`${ALL_USERS_FETCH_API_URL}`, {
      headers: getAuthHeader()
    });

    console.log("Uses Response : ", response.data);

    return response.data.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email,
      phone: user.phone,
      password: user.password,
      avatar: user.avatar,
      role: user.role,
      status: user.status,

    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getAllUserDocuments = async () => {
  try {
    const response = await axios.get(USER_ALL_DOCUMENTS, {
      headers: getAuthHeader(),
    });

    console.log("Documents Response:", response.data);

    return response.data.map((document) => {
      // Supports both flattened DTO and nested user object
      const user = document.user || {};

      return {
        id: document.id,

        userId: document.userId ?? user.id,
        firstName: document.firstName ?? user.firstName,
        lastName: document.lastName ?? user.lastName,

        fullName:
          document.fullName ||
          `${document.firstName ?? user.firstName ?? ""} ${
            document.lastName ?? user.lastName ?? ""
          }`.trim(),

        email: document.email ?? user.email,
        phone: document.phone ?? user.phone,

        drivingLicense: document.drivingLicense,
        aadhharCard: document.aadhharCard,

        status: document.status || "PENDING",
        reason: document.reason || "",
      };
    });
  } catch (error) {
    console.error(
      "Error fetching user documents:",
      error.response?.data || error.message
    );

    return [];
  }
};

export const getCartById = async (id) => {
  try {

    const userId = localStorage.getItem("userId");
    console.log("I am in get cart by id : ", userId);

    const response = await axios.get(`${CART_API_URL}/${id}/${userId}`, {
      headers: getAuthHeader()
    });
    console.log("response.data :",response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching cart by id:", error);
    return null;
  }
};

// export const saveCarToCart = async (car) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     const cartData = {
//       userId: parseInt(userId),
//       carId: car.carId,
//       mainImage: car.mainImage,
//       img1: car.img1,
//       img2: car.img2,
//       img3: car.img3,
//       status: car.status,
//       fuelType: car.fuelType,
//       name: car.name,
//       seating: car.seating,
//       transmition: car.transmition,
//       price: car.price,
//       description: car.description,
//       brand: car.brand,
//       rating: car.rating,
//       reviews: car.reviews,

//       features: {
//         feature1: car.features?.feature1,
//         feature2: car.features?.feature2,
//         feature3: car.features?.feature3,
//         feature4: car.features?.feature4,
//         feature5: car.features?.feature5
//       }
//     };

//     console.log("Cart data : ", cartData);

//     const response = await axios.post(
//       "http://localhost:8080/user/cart",
//       cartData,
//       {
//         headers: getAuthHeader()
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error saving cart:", error);
//     throw error;
//   }
// };

export const saveCarToCart = async (car) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User is not logged in");
    }

    // Get the actual AdminCarsData ID
    const actualCarId = car.carId ?? car.id;

    if (!actualCarId) {
      throw new Error("Car ID is missing");
    }

    const cartData = {
      userId: Number(userId),
      carId: Number(actualCarId),
    };

    console.log("Car Object:", car);
    console.log("Cart Request:", cartData);

    const response = await axios.post(
      "http://localhost:8080/user/cart",
      cartData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error saving cart:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// export const carBooking = async (booking) => {
//   try {

//     const userId = localStorage.getItem("userId");

//     const bookingData = {
//       userId: parseInt(userId),

//       carName: booking.carName,
//       brand: booking.brand,
//       mainImage: booking.mainImage,

//       price: booking.price,

//       pickupDate: booking.pickupDate,
//       dropoffDate: booking.dropoffDate,

//       pickupLocation: booking.pickupLocation,
//       dropoffLocation: booking.dropoffLocation,

//       tripType: booking.tripType,

//       days: booking.days,
//       total: booking.total,

//       bookingStatus: "CONFIRMED"
//     };

//     console.log("Booking Data :", bookingData);

//     const response = await axios.post(
//       "http://localhost:8080/user/booking",
//       bookingData,
//       {
//         headers: getAuthHeader()
//       }
//     );

//     return response.data;

//   } catch (error) {

//     console.error("Booking Error :", error);
//     throw error;

//   }
// };

// export const carBooking = async (booking) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     if (!userId) {
//       throw new Error("User is not logged in");
//     }

//     if (!booking.carId) {
//       throw new Error("Car ID is missing");
//     }

//     console.log("Car id is : ",booking.carId);

//     const bookingData = {
//       userId: Number(userId),

//       carId: Number(booking.carId),
      

//       carName: booking.carName,
//       brand: booking.brand,
//       mainImage: booking.mainImage,

//       price: Number(booking.price),

//       pickupDate: booking.pickupDate,
//       dropoffDate: booking.dropoffDate,

//       pickupLocation: booking.pickupLocation,
//       dropoffLocation: booking.dropoffLocation,

//       tripType: booking.tripType,

//       days: Number(booking.days),
//       total: Number(booking.total),

//       bookingStatus: "PENDING",
//     };

//     console.log("Booking Request:", bookingData);

//     const response = await axios.post(
//       "http://localhost:8080/user/booking",
//       bookingData,
//       {
//         headers: getAuthHeader(),
//       }
//     );

//     return response.data;

//   } catch (error) {
//     console.error(
//       "Booking Error:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// export const carBooking = async (booking) => {
//   try {
//     const userId =
//       localStorage.getItem("userId");

//     if (!userId) {
//       throw new Error(
//         "User is not logged in"
//       );
//     }

//     if (!booking?.carId) {
//       throw new Error(
//         "Car ID is missing"
//       );
//     }

//     const bookingData = {
//       userId: Number(userId),

//       carId: Number(booking.carId),

//       // carName:
//       //   booking.carName ?? booking.name,

//       // brand: booking.brand,

//       // mainImage:
//       //   booking.mainImage ??
//       //   booking.image,

//        price: Number(booking.price),

//       pickupDate: booking.pickupDate,
//       dropoffDate: booking.dropoffDate,

//       pickupLocation:
//         booking.pickupLocation,

//       dropoffLocation:
//         booking.dropoffLocation,

//       tripDriverType: booking.tripDriverType,
//       days: Number(booking.days),
//       total: Number(booking.total),

//       bookingStatus: "PENDING",
//     };

//     console.log(
//       "Booking Request:",
//       bookingData
//     );

//     const response = await axios.post(
//       "http://localhost:8080/user/booking",
//       bookingData,
//       {
//         headers: {
//           ...getAuthHeader(),
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Booking Error:",
//       error.response?.data ||
//         error.message
//     );

//     throw error;
//   }
// };

export const carBooking = async (booking) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User is not logged in");
    }

    if (!booking?.carId) {
      throw new Error("Car ID is missing");
    }

    const bookingData = {
      userId: Number(userId),
      carId: Number(booking.carId),

      price: Number(booking.price),

      pickupDate: booking.pickupDate,
      dropoffDate: booking.dropoffDate,

      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,

      tripDriverType: booking.tripDriverType,

      days: Number(booking.days),
      total: Number(booking.total),

      bookingStatus: "PENDING",
    };

    console.log("Booking Request:", bookingData);

    const response = await axios.post(
      "http://localhost:8080/user/booking",
      bookingData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Full booking error:", error);
    console.error("Backend response:", error.response?.data);

    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unable to book this car";

    throw new Error(backendMessage);
  }
};

export const deleteCartById = async (id) => {
  try {
    const response = await axios.post(
      `${DELETE_CART_BY_ID}/${id}`,
      {},
      {
        headers: getAuthHeader()
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting cart:", error);
    return null;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(
      `${GET_USER_BY_EMAIL}/${email}`,
      {
        headers: getAuthHeader()
      }
    );
    console.log("I am in getUserEmail Method : ", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (email, userData) => {
  console.log("userData : " + userData.data);
  console.log("email : " + email);
  try {
    const response = await axios.post(
      `${UPDATE_USER}/${email}`,
      userData,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const cancelBookingApi = async (bookingId, userId) => {
  console.log("cancelBookingApi : ", bookingId, userId);
  const response = await axios.post(
    `http://localhost:8080/user/cancelBooking/${bookingId}/${userId}`,
    {},
    {
      headers: getAuthHeader()
    }
  );

  return response.data;
};

export const getBookingList = async () => {
  const userId = localStorage.getItem("userId");

  const response = await axios.get(
    `http://localhost:8080/user/bookingList/${userId}`,
    {
      headers: getAuthHeader()
    }
  );

  console.log("getBookingList :", response.data);

  return response.data;
};

export const getPendingBookingList = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/auth/admin/getPendingBookingsData",
      {
        headers: getAuthHeader(),
      }
    );

    console.log("Pending and Rejected Booking List:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Get Booking List Error:",
      error.response?.data || error
    );

    throw error;
  }
};

export const getBookingRecords = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/auth/admin/getBookingRecords",
      {
        headers: getAuthHeader(),
      }
    );

    console.log("All Remaining Booking List:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Get Booking List Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const updateBookingStatusByAdmin = async (
  bookingId,
  bookingStatus
) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/auth/admin/updateBookingStatus/${bookingId}`,
      null,
      {
        params: {
          bookingStatus: bookingStatus,
        },
        headers: getAuthHeader(),
      }
    );

    console.log("Booking status updated:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Update booking status error:",
      error.response?.data || error
    );

    throw error;
  }
};

export const updateDocumentStatusByAdmin = async (id, status, reason) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/auth/admin/updateDocumentStatus/${id}`,
      null,
      {
        params: {
          status: status,
          reason: reason,
        },
        headers: getAuthHeader(),
      }
    );
    console.log("Document status updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Update Document status error:",
      error.response?.data || error
    );
    throw error;
  }
};

export const deleteBookingByAdmin = async (id) => {
  try {

    console.log("deleteBookingStatusByAdmin id : ", id);
    const response = await axios.post(
      `${DELETE_BOOKING_BY_ID}/${id}`,
      {},
      {
        headers: getAuthHeader()
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// export const uploadDocuments = async (formData) => {
//   const email = localStorage.getItem("email");
//   const password = localStorage.getItem("password");

//   const response = await fetch("http://localhost:8080/user/upload-documents", {
//     method: "POST",
//     headers: {
//       Authorization: "Basic " + btoa(email + ":" + password),
//     },
//     body: formData,
//   });

//   const result = await response.text();

//   console.log("Upload Status:", response.status);
//   console.log("Upload Response:", result);

//   if (!response.ok) {
//     throw new Error(result || "Document upload failed");
//   }


//   return result;
// };

// export const getDocuments = async () => {
//   const userId = localStorage.getItem("userId");

//   const response = await axios.get(
//     `http://localhost:8080/user/getDocuments/${userId}`,
//     {
//       headers: getAuthHeader()
//     }
//   );

//   console.log("getDocuments :", response.data);

//   return response.data;
// };

export const uploadDocuments = async (formData) => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  console.log("Upload Email:", email);
  console.log("Upload Password:", password);

  const response = await fetch("http://localhost:8080/user/upload-documents", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(email + ":" + password),
    },
    body: formData,
  });

  const result = await response.text();

  console.log("Upload Status:", response.status);
  console.log("Upload Response:", result);

  if (!response.ok) {
    throw new Error(result || "Document upload failed");
  }

  return result;
};

// export const getAllDocuments = async () => {
//   const response = await axios.get(
//     "http://localhost:8080/user/documents",
//     {
//       headers: getAuthHeader()
//     }
//   );

//   console.log("All Documents:", response.data);
//   return response.data;
// };

export const getUserDocuments = async () => {
  const userId = localStorage.getItem("userId");

  const response = await axios.get(
    `http://localhost:8080/user/documents/${userId}`,
    {
      headers: getAuthHeader()
    }
  );
  console.log("I am in getUserDocuments service method :",response.data);

  return response.data;
};

// add car
// export const addCar = async (car) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     const carAddedData = {
//       userId: parseInt(userId),
//       mainImage: car.mainImage,
//       img1: car.img1,
//       img2: car.img2,
//       img3: car.img3,
//       status: car.status,
//       fuelType: car.fuelType,
//       name: car.name,
//       seating: Number(car.seating),
//       transmition: car.transmition,
//       price: Number(car.price),
//       description: car.description,
//       brand: car.brand,
      
//       features: {
//         feature1: car.feature1,
//         feature2: car.feature2,
//         feature3: car.feature3,
//         feature4: car.feature4,
//         feature5: car.feature5
//       }
//     };

//     console.log("Car Added data : ", carAddedData);

//     const response = await axios.post(
//       "http://localhost:8080/auth/admin/addCars",
//       carAddedData,
//       {
//         headers: getAuthHeader()
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error adding car:", error);
//     throw error;
//   }
// };



const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(
        new Error(`Failed to read image: ${file.name}`)
      );
    };

    reader.readAsDataURL(file);
  });
};



export const getCarImageUrl = (imageName) => {
  if (!imageName) {
    return "/placeholder-car.jpg";
  }

  if (
    imageName.startsWith("http://") ||
    imageName.startsWith("https://") ||
    imageName.startsWith("data:") ||
    imageName.startsWith("blob:")
  ) {
    return imageName;
  }

  return `${CAR_IMAGE_BASE_URL}/${encodeURIComponent(
    imageName
  )}`;
};

export const addCar = async (car) => {
  try {
    const userId = localStorage.getItem("userId");

    const [
      mainImageBase64,
      img1Base64,
      img2Base64,
      img3Base64,
    ] = await Promise.all([
      convertFileToBase64(car.mainImageFile),
      convertFileToBase64(car.img1File),
      convertFileToBase64(car.img2File),
      convertFileToBase64(car.img3File),
    ]);

    const carAddedData = {
      userId: Number(userId),

      // Actual Base64 image content
      mainImage: mainImageBase64,
      img1: img1Base64,
      img2: img2Base64,
      img3: img3Base64,

      // Original filenames
      mainImageName:
        car.mainImageFile?.name || car.mainImage,

      img1Name:
        car.img1File?.name || car.img1,

      img2Name:
        car.img2File?.name || car.img2,

      img3Name:
        car.img3File?.name || car.img3,

      status: Boolean(car.status),
      fuelType: car.fuelType,
      name: car.name,
      seating: Number(car.seating),
      transmition: car.transmition,
      price: Number(car.price),
      description: car.description,
      brand: car.brand,

      features: {
        feature1: car.feature1,
        feature2: car.feature2,
        feature3: car.feature3,
        feature4: car.feature4,
        feature5: car.feature5,
      },
    };

    console.log("Car Added Data:", {
      ...carAddedData,
      mainImage: mainImageBase64
        ? "MAIN IMAGE PRESENT"
        : null,
      img1: img1Base64 ? "IMAGE 1 PRESENT" : null,
      img2: img2Base64 ? "IMAGE 2 PRESENT" : null,
      img3: img3Base64 ? "IMAGE 3 PRESENT" : null,
    });

    const response = await axios.post(
      "http://localhost:8080/auth/admin/addCars",
      carAddedData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error adding car:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const updateCar = async (car) => {
  try {
    const userId = localStorage.getItem("userId");

    const updateCarData = {
      userId: Number(userId),

      mainImage: car.mainImage,
      img1: car.img1,
      img2: car.img2,
      img3: car.img3,

      status: car.carStatus === "Available",

      fuelType: car.fuelType,
      name: car.name,
      seating: Number(car.seating),
      transmition: car.transmition,
      price: Number(car.price),
      description: car.description,
      brand: car.brand,
      rating: Number(car.rating),
      reviews: Number(car.reviews),

      features: {
        feature1: car.feature1,
        feature2: car.feature2,
        feature3: car.feature3,
        feature4: car.feature4,
        feature5: car.feature5,
      },
    };

    console.log("Car ID:", car.id);
    console.log("Update Request:", updateCarData);

    const response = await axios.post(
      `${UPDATE_CAR_API_URL}/${car.id}`,
      updateCarData,
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update Car Error:", error.response?.data || error.message);
    throw error;
  }
};

// delete car
export const deleteCarById = async (id) => {
  try {
    const response = await axios.post(
      `${DELETE_CAR_BY_ID}/${id}`,
      {},
      {
        headers: getAuthHeader()
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting cart:", error);
    return null;
  }
};

// export const deleteUserById = async (id) => {
//   try {
//     const response = await axios.post(
//       `${DELETE_USER_BY_ID}/${id}`,
//       {},
//       {
//         headers: getAuthHeader()
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error deleting cart:", error);
//     return null;
//   }
// };

export const deleteUserById = async (id) => {
  try {

    console.log("deleteUserById : ", id);
    const response = await axios.post(
      `${DELETE_USER_BY_ID}/${id}`,
      {},
      {
        headers: getAuthHeader()
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUserStatus = async (id) => {
  try {
    console.log("updateUserStatus : ", id);
    const response = await axios.post(
      `${UPDATE_USER_STATUS}/${id}`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    console.log("updateUserRole : ", id);
    const response = await axios.post(
      `${UPDATE_USER_ROLE}/${id}`,
      { role },
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// reset password 
const FORGOT_PASSWORD =
  `${BASE_URL}/home/forgot-password`;

const VALIDATE_RESET_TOKEN =
  `${BASE_URL}/home/validate-reset-token`;

const RESET_PASSWORD =
  `${BASE_URL}/home/reset-password`;

const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type");

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    return response.json();
  }

  const text = await response.text();

  return {
    message:
      text || "Unexpected server response",
  };
};

export const forgotPassword = async (email) => {
  const response = await fetch(
    FORGOT_PASSWORD,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to send password reset email"
    );
  }

  return data;
};

export const validateResetToken = async (
  token
) => {
  const response = await fetch(
    `${VALIDATE_RESET_TOKEN}?token=${encodeURIComponent(
      token
    )}`,
    {
      method: "GET",
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to validate reset token"
    );
  }

  return data;
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  const response = await fetch(
    RESET_PASSWORD,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword,
      }),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to reset password"
    );
  }

  return data;
};