package com.My_Car_Rental_Application.service;

import java.util.List;

import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.dto.UserResponseDto;
import com.My_Car_Rental_Application.entity.Cart;
import com.My_Car_Rental_Application.entity.UserRequest;

public interface UserService {
	
	List<Cart> addCart(CarsDataRequestDto acd);
	
	List<Cart> getAllCarts();

	Cart getCartById(int id);

	void deleteCart(int id);

	UserRequest getUserByEmail(String email);

	UserRequest updateUserProfile(UserRequest userRequest, String email);
}
