package com.My_Car_Rental_Application.service;



import org.springframework.stereotype.Service;

import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.entity.AdminCarsData;

import com.My_Car_Rental_Application.repository.CarsDataRepository;


@Service
public class AdminServiceImpl implements AdminService{
	
	private CarsDataRepository adRepository;
	

	
	public AdminServiceImpl(CarsDataRepository adRepository) {
		this.adRepository=adRepository;
		
	}

	@Override
	public AdminCarsData addCars(CarsDataRequestDto adRequest) {
		
		AdminCarsData ad = new AdminCarsData();
		ad.setDescription(adRequest.getDescription());
		ad.setFeatures(adRequest.getFeatures());
		ad.setFuelType(adRequest.getFuelType());
		ad.setImg1(adRequest.getImg1());
		ad.setImg2(adRequest.getImg2());
		ad.setImg3(adRequest.getImg3());
		ad.setMainImage(adRequest.getMainImage());
		ad.setName(adRequest.getName());
		ad.setPrice(adRequest.getPrice());
		ad.setSeating(adRequest.getSeating());
		ad.setStatus(adRequest.isStatus());
		ad.setTransmition(adRequest.getTransmition());
		ad.setBrand(adRequest.getBrand());
		ad.setRating(adRequest.getRating());
		ad.setReviews(adRequest.getReviews());
		
		
		return adRepository.save(ad);
		
	}

	

	

}
