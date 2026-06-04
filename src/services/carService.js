
import axios from "axios";

const API_URL = "http://localhost:8080/home/cars";
const LOGIN = "http://localhost:8080/home/login";
const CART_API_URL = "http://localhost:8080/user/getCarts";
const DELETE_CART_BY_ID = "http://localhost:8080/user/deleteCarts";
const GET_USER_BY_EMAIL = "http://localhost:8080/user/getUserByEmail";
const UPDATE_USER = "http://localhost:8080/user/updateProfile";

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

// ========================
// CARS
// ========================

export const getAllCars = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data.map((car) => ({
      id: car.id,
      name: car.name,
      brand: car.brand,
      price: car.price,
      fuelType: car.fuelType,
      transmition: car.transmition,
      seating: car.seating,
      image: car.mainImage,
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
        car.features?.feature5
      ].filter(Boolean),
      description: car.description
    }));
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

export const getCarById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car by id:", error);
    return null;
  }
};

// ========================
// LOGIN
// ========================

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

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// ========================
// CARTS
// ========================

export const getAllCarts = async () => {
  try {
    const response = await axios.get(CART_API_URL, {
      headers: getAuthHeader()
    });

    return response.data.map((car) => ({
      id: car.id,
      name: car.name,
      brand: car.brand,
      price: car.price,
      fuelType: car.fuelType,
      transmition: car.transmition,
      seating: car.seating,
      image: car.mainImage,
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
        car.features?.feature5
      ].filter(Boolean),
      description: car.description
    }));
  } catch (error) {
    console.error("Error fetching carts:", error);
    return [];
  }
};

export const getCartById = async (id) => {
  try {
    const response = await axios.get(`${CART_API_URL}/${id}`, {
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching cart by id:", error);
    return null;
  }
};

export const saveCarToCart = async (car) => {
  try {
    const cartData = {
      mainImage: car.mainImage,
      img1: car.img1,
      img2: car.img2,
      img3: car.img3,
      status: car.status,
      fuelType: car.fuelType,
      name: car.name,
      seating: car.seating,
      transmition: car.transmition,
      price: car.price,
      description: car.description,
      brand: car.brand,
      rating: car.rating,
      reviews: car.reviews,

      features: {
        feature1: car.features?.feature1,
        feature2: car.features?.feature2,
        feature3: car.features?.feature3,
        feature4: car.features?.feature4,
        feature5: car.features?.feature5
      }
    };

    const response = await axios.post(
      "http://localhost:8080/user/cart",
      cartData,
      {
        headers: getAuthHeader()
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error saving cart:", error);
    throw error;
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

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (email, userData) => {
  console.log("userData : "+userData.data);
  console.log("email : "+email);
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