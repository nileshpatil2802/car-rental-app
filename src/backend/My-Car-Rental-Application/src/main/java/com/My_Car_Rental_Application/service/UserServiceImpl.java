package com.My_Car_Rental_Application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.dto.UserResponseDto;
import com.My_Car_Rental_Application.entity.Cart;
import com.My_Car_Rental_Application.entity.UserRequest;
import com.My_Car_Rental_Application.repository.CartRepository;
import com.My_Car_Rental_Application.repository.HomeRepository;

@Service
public class UserServiceImpl implements UserService{
	
	private CartRepository cr;
	
	private HomeRepository homeRepository;
	
	public UserServiceImpl(CartRepository cr,HomeRepository homeRepository) {
		this.cr=cr;
		this.homeRepository=homeRepository;
	}

	@Override
	public List<Cart> addCart(CarsDataRequestDto acd) {
		
		List<Cart> existingCars = cr.checkRecords(
			
		        acd.getMainImage(),
		        acd.getImg1(),
		        acd.getImg2(),
		        acd.getImg3(),
		        acd.isStatus(),
		        acd.getFuelType(),
		        acd.getName(),
		        acd.getSeating(),
		        acd.getTransmition(),
		        acd.getPrice(),
		        acd.getDescription(),acd.getBrand(),acd.getRating(),acd.getReviews(), acd.getFeatures().getFeature1(), acd.getFeatures().getFeature2(), acd.getFeatures().getFeature3(), acd.getFeatures().getFeature4(), acd.getFeatures().getFeature5());
				
		
		if(!existingCars.isEmpty()){
		
			cr.deleteRecords(

				    acd.getMainImage(),
				    acd.getImg1(),
				    acd.getImg2(),
				    acd.getImg3(),
				    acd.isStatus(),
				    acd.getFuelType(),
				    acd.getName(),
				    acd.getSeating(),
				    acd.getTransmition(),
				    acd.getPrice(),
				    acd.getDescription(),
				    acd.getBrand(),acd.getRating(),acd.getReviews(),
				    acd.getFeatures().getFeature1(),
				    acd.getFeatures().getFeature2(),
				    acd.getFeatures().getFeature3(),
				    acd.getFeatures().getFeature4(),
				    acd.getFeatures().getFeature5()
				);
		}else{
			Cart ad=new Cart();
			ad.setName(acd.getName());
			ad.setDescription(acd.getDescription());
			ad.setFeatures(acd.getFeatures());
			ad.setFuelType(acd.getFuelType());
			ad.setImg1(acd.getImg1());
			ad.setImg2(acd.getImg2());
			ad.setImg3(acd.getImg3());
			ad.setMainImage(acd.getMainImage());
			ad.setPrice(acd.getPrice());
			ad.setSeating(acd.getSeating());
			ad.setStatus(acd.isStatus());
			ad.setTransmition(acd.getTransmition());
			ad.setBrand(acd.getBrand());
			ad.setRating(acd.getRating());
			ad.setReviews(acd.getReviews());
			
			cr.save(ad);
			 
			
		}
		return cr.findAll();
	}

	@Override
	public List<Cart> getAllCarts() {
		return cr.findAll();
	}

	@Override
	public Cart getCartById(int id) {
		return cr.findById(id).orElse(null);
	}

	@Override
	public void deleteCart(int id) {
		cr.deleteById(id);
		
	}

	@Override
	public UserRequest getUserByEmail(String email) {
		 
		
		return homeRepository.findByEmail(email);
	}

	@Override
	public UserRequest updateUserProfile(UserRequest userRequest,String email) {
		System.out.print("User Request : "+userRequest.getPassword()+" "+userRequest.getRole());
		UserRequest user = homeRepository.findByEmail(email);
		System.out.println("Before updated Data : "+user);
		user.setFirstName(userRequest.getFirstName());
		user.setEmail(email);
		user.setAvatar(userRequest.getAvatar());
		user.setLastName(userRequest.getLastName());
		user.setPassword(userRequest.getPassword());
		user.setPhone(userRequest.getPhone());
		user.setRole(userRequest.getRole());
		user.setPassword(userRequest.getPassword());
		
		UserRequest save = homeRepository.save(user);
		System.out.println("Updated data from service repo return : "+save.toString());
		
		return save;
	}

	
}
