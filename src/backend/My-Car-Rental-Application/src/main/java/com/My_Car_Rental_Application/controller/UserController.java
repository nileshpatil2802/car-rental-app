package com.My_Car_Rental_Application.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.dto.UserResponseDto;
import com.My_Car_Rental_Application.entity.Cart;
import com.My_Car_Rental_Application.entity.UserRequest;
import com.My_Car_Rental_Application.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/user")
public class UserController {
	
	private UserService userService;
	
	public UserController(UserService userService) {
		this.userService=userService;
	}
	

	@PostMapping("/cart")
	public List<Cart> addCart(@RequestBody CarsDataRequestDto acd){
		List<Cart> cart = userService.addCart(acd);
		System.out.println("I am in cart");
		System.out.println("cart : "+cart);
		return cart;
	}
	
	@GetMapping("/getCarts")
	public List<Cart> getCarts(){
	 List<Cart> allCarts = userService.getAllCarts();
	 	System.out.println("allCarts : "+allCarts);
	    return allCarts;
	}
	
	@GetMapping("/getCarts/{id}")
	public  Cart getCart(@PathVariable int id) {
		return userService.getCartById(id);
	}
	
	@PostMapping("deleteCarts/{id}")
	public void DeleteCart(@PathVariable int id) {
		userService.deleteCart(id);
	}
	
	@GetMapping("/getUserByEmail/{email}")
	public UserRequest getUserByEmail(@PathVariable String email) {
		 UserRequest userByEmail = userService.getUserByEmail(email);
		System.out.println("userByEmail : "+userByEmail);
		return userByEmail;
	}
	
	@PostMapping("/updateProfile/{email}")
	public UserRequest updateUserProfile(@RequestBody UserRequest userRequest,@PathVariable String email) {
		 UserRequest updateUserProfile = userService.updateUserProfile(userRequest,email);
		System.out.println("Updated Profile : "+updateUserProfile);
		return updateUserProfile;
	}
	
	
	
	
}
