package com.My_Car_Rental_Application.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.My_Car_Rental_Application.entity.AdminCarsData;


@Repository
public interface CarsDataRepository extends JpaRepository<AdminCarsData, Integer>{

//	@Query("""
//		    SELECT a
//		    FROM AdminCarsData a
//		    WHERE 
//		    a.mainImage = :mainImage
//		    AND a.img1 = :img1
//		    AND a.img2 = :img2
//		    AND a.img3 = :img3
//		    AND a.status = :status
//		    AND a.fuelType = :fuelType
//		    AND a.name = :name
//		    AND a.seating = :seating
//		    AND a.transmition = :transmition
//		    AND a.price = :price
//		    AND a.description = :description
//		""")
//		boolean checkRecords(
//
//		    @Param("mainImage") String mainImage,
//
//		    @Param("img1") String img1,
//
//		    @Param("img2") String img2,
//
//		    @Param("img3") String img3,
//
//		    @Param("status") boolean status,
//
//		    @Param("fuelType") String fuelType,
//
//		    @Param("name") String name,
//
//		    @Param("seating") int seating,
//
//		    @Param("transmition") String transmition,
//
//		    @Param("price") double price,
//
//		    @Param("description") String description
//		);
	
}
