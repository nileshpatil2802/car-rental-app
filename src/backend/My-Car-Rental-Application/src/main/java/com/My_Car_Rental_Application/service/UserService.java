package com.My_Car_Rental_Application.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;


import com.My_Car_Rental_Application.dto.BookingDto;
import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.entity.Booking;
import com.My_Car_Rental_Application.entity.Cart;
import com.My_Car_Rental_Application.entity.UserDocuments;
import com.My_Car_Rental_Application.entity.UserRequest;

public interface UserService {
	
	List<Cart> addCart(CarsDataRequestDto acd);
	
	List<Cart> getAllCarts(int userId);

	Cart getCartById(int id,int userId);

	void deleteCart(int id);

	UserRequest getUserByEmail(String email);

	UserRequest updateUserProfile(UserRequest userRequest, String email);

	List<Booking> booking(BookingDto booking);

	void cancelBooking(int bookingId, int userId);

	List<Booking> getBookingList(int id);

	UserDocuments uploadDocuments(
	        int userId,
	        MultipartFile drivingLicense,
	        MultipartFile aadhaarCard
	);

	UserDocuments getDocumentsByUser(int userId);

	List<UserRequest> getAllUsers();

	List<UserDocuments> DocumentList();


}
