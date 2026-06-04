package com.My_Car_Rental_Application.controller;

import java.util.List;
import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.My_Car_Rental_Application.dto.UserLoginDto;
import com.My_Car_Rental_Application.dto.UserRequestDto;
import com.My_Car_Rental_Application.dto.UserResponseDto;
import com.My_Car_Rental_Application.entity.AdminCarsData;
        
import com.My_Car_Rental_Application.service.HomeService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/home")
public class HomeController {
	
	private HomeService homeService;
	private AuthenticationManager authenticationManager;

	// constructor injection
	public HomeController(HomeService userService,AuthenticationManager authenticationManager) {
		this.homeService=userService;
		this.authenticationManager=authenticationManager;
		
	}
	
	@PostMapping("/register")
	public ResponseEntity<Map<String,String>> UserRegister(@RequestBody UserRequestDto request) {
		System.out.println("request : "+request);
		
		String doRegister = homeService.doRegister(request);
		
		
		return ResponseEntity.ok(Map.of("doRegister",doRegister));
	
	}
	

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> doLogin(@RequestBody UserLoginDto request) {
		System.out.println("Login Request : "+request.getEmail()+""+request.getPassword());
		try {
		Authentication authentication = authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
	        );
		System.out.println("authentication : "+authentication);
		if(authentication.isAuthenticated()){
			UserResponseDto user = homeService.doLogin(request);
			return ResponseEntity.ok(Map.of(
            "message", "Login Successful",
            "user", user
        ));
		}
		}catch(Exception e) {

			System.out.println("❌ Auth Error: " + e.getMessage()); // ✅ See exact error
	        return ResponseEntity.status(401).body(Map.of(
	            "message", "Invalid Credentials",
	            "error", e.getMessage()
	        ));
		}
		return ResponseEntity.status(401).body(Map.of("message", "Invalid Credentials"));
	}
	
	@GetMapping("/cars")
	public List<AdminCarsData> allCars() {
		 List<AdminCarsData> allCars = homeService.allCars();
		 System.out.println("allCars : "+allCars);
		return allCars;
	}

	@GetMapping("/cars/{id}")
	public AdminCarsData findCarById(@PathVariable int id) {
		return homeService.findCarById(id);
	}
	


}
