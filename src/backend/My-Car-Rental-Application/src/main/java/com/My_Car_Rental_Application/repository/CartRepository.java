package com.My_Car_Rental_Application.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.My_Car_Rental_Application.entity.Cart;

import jakarta.transaction.Transactional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{

	@Query("""
		    SELECT a
		    FROM Cart a
		    WHERE 
		    a.mainImage = :mainImage
		    AND a.img1 = :img1
		    AND a.img2 = :img2
		    AND a.img3 = :img3
		    AND a.status = :status
		    AND a.fuelType = :fuelType
		    AND a.name = :name
		    AND a.seating = :seating
		    AND a.transmition = :transmition
		    AND a.price = :price
		    AND a.description = :description
		    AND a.brand = :brand
		    AND a.rating = :rating
		    AND a.reviews = :reviews
		    AND a.features.feature1 = :feature1
		    AND a.features.feature2 = :feature2
		    AND a.features.feature3 = :feature3
		    AND a.features.feature4 = :feature4
		    AND a.features.feature5 = :feature5
		""")
		List<Cart> checkRecords(

		    @Param("mainImage") String mainImage,
		    @Param("img1") String img1,
		    @Param("img2") String img2,
		    @Param("img3") String img3,
		    @Param("status") boolean status,
		    @Param("fuelType") String fuelType,
		    @Param("name") String name,
		    @Param("seating") int seating,
		    @Param("transmition") String transmition,
		    @Param("price") double price,
		    @Param("description") String description,
		    @Param("brand") String brand,
		    @Param("rating") double rating,
		    @Param("reviews") int reviews,
		    @Param("feature1") String feature1,
		    @Param("feature2") String feature2,
		    @Param("feature3") String feature3,
		    @Param("feature4") String feature4,
		    @Param("feature5") String feature5
		);

	@Transactional
	@Modifying
	@Query("""
	    DELETE
	    FROM Cart a
	    WHERE 
	    a.mainImage = :mainImage
	    AND a.img1 = :img1
	    AND a.img2 = :img2
	    AND a.img3 = :img3
	    AND a.status = :status
	    AND a.fuelType = :fuelType
	    AND a.name = :name
	    AND a.seating = :seating
	    AND a.transmition = :transmition
	    AND a.price = :price
	    AND a.description = :description
	    AND a.brand = :brand
		AND a.rating = :rating
		AND a.reviews = :reviews
	    AND a.features.feature1 = :feature1
	    AND a.features.feature2 = :feature2
	    AND a.features.feature3 = :feature3
	    AND a.features.feature4 = :feature4
	    AND a.features.feature5 = :feature5
	""")
	int deleteRecords(@Param("mainImage") String mainImage,@Param("img1") String img1,@Param("img2") String img2,@Param("img3") String img3,
			@Param("status") boolean status,@Param("fuelType") String fuelType,@Param("name") String name,
			@Param("seating") int seating,@Param("transmition") String transmition, @Param("price") double price,@Param("description") String description,@Param("brand") String brand,
		    @Param("rating") double rating,
		    @Param("reviews") int reviews,
            @Param("feature1") String feature1,@Param("feature2") String feature2,@Param("feature3") String feature3,
            @Param("feature4") String feature4,@Param("feature5") String feature5
	);
	
	
}
