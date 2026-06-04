package com.My_Car_Rental_Application.dto;

import com.My_Car_Rental_Application.entity.Features;

import jakarta.persistence.Embedded;

public class CarsDataRequestDto {
	
	private String mainImage;
	private String img1;
	private String img2;
	private String img3;
	private boolean status;
	private String fuelType;
	private String name;
	private int seating;
	private String transmition;			// mode : automatic.....
	private double price;
	private Features features;
	private String description;
	private String brand;
	private double rating;
	private int reviews;
	
	public CarsDataRequestDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CarsDataRequestDto(String mainImage, String img1, String img2, String img3, boolean status,
			String fuelType, String name, int seating, String transmition, double price, Features features,
			String description, String brand, double rating, int reviews) {
		super();
		this.mainImage = mainImage;
		this.img1 = img1;
		this.img2 = img2;
		this.img3 = img3;
		this.status = status;
		this.fuelType = fuelType;
		this.name = name;
		this.seating = seating;
		this.transmition = transmition;
		this.price = price;
		this.features = features;
		this.description = description;
		this.brand = brand;
		this.rating = rating;
		this.reviews = reviews;
	}

	public String getMainImage() {
		return mainImage;
	}

	public void setMainImage(String mainImage) {
		this.mainImage = mainImage;
	}

	public String getImg1() {
		return img1;
	}

	public void setImg1(String img1) {
		this.img1 = img1;
	}

	public String getImg2() {
		return img2;
	}

	public void setImg2(String img2) {
		this.img2 = img2;
	}

	public String getImg3() {
		return img3;
	}

	public void setImg3(String img3) {
		this.img3 = img3;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public String getFuelType() {
		return fuelType;
	}

	public void setFuelType(String fuelType) {
		this.fuelType = fuelType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getSeating() {
		return seating;
	}

	public void setSeating(int seating) {
		this.seating = seating;
	}

	public String getTransmition() {
		return transmition;
	}

	public void setTransmition(String transmition) {
		this.transmition = transmition;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public Features getFeatures() {
		return features;
	}

	public void setFeatures(Features features) {
		this.features = features;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public int getReviews() {
		return reviews;
	}

	public void setReviews(int reviews) {
		this.reviews = reviews;
	}
	
	
	
	
}
