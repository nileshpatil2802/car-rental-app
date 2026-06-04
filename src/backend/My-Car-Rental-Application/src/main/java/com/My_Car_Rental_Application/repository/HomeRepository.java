package com.My_Car_Rental_Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.My_Car_Rental_Application.dto.UserResponseDto;
import com.My_Car_Rental_Application.entity.UserRequest;



@Repository
public interface HomeRepository extends JpaRepository<UserRequest, Integer>{


	@Query("SELECT u FROM UserRequest u WHERE u.email = :email")
	UserRequest findByEmail(@Param("email") String email);
	


}
