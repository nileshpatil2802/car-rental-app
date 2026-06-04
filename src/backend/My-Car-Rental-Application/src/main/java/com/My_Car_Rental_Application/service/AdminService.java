package com.My_Car_Rental_Application.service;

import java.util.List;

import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.entity.AdminCarsData;
import com.My_Car_Rental_Application.entity.Cart;
public interface AdminService {

	AdminCarsData addCars(CarsDataRequestDto adRequest);

}
