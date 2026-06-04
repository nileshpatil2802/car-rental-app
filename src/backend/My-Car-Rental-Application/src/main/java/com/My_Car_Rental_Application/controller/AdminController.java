package com.My_Car_Rental_Application.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.entity.AdminCarsData;
import com.My_Car_Rental_Application.service.AdminService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth/admin")
public class AdminController {
	
	private AdminService adService;
	
	public AdminController(AdminService adService) {
		this.adService=adService;
	}

	@PostMapping("/addCars")
	public AdminCarsData addCars(@RequestBody CarsDataRequestDto adRequest ) {
		return adService.addCars(adRequest);
	}
	
	
	
}
