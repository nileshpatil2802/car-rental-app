package com.My_Car_Rental_Application.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserRequest user;

   

    private String carName;
    private String brand;
    private String mainImage;

    private double price;

    private LocalDate pickupDate;
    private LocalDate dropoffDate;

    private String pickupLocation;
    private String dropoffLocation;

    private String tripType;

    private int days;
    private double total;

    private String bookingStatus;
    
    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private AdminCarsData car;

    public Booking() {
    }

	public Booking(int id, UserRequest user, String carName, String brand, String mainImage, double price,
			LocalDate pickupDate, LocalDate dropoffDate, String pickupLocation, String dropoffLocation, String tripType,
			int days, double total, String bookingStatus, AdminCarsData car) {
		super();
		this.id = id;
		this.user = user;
		
		this.carName = carName;
		this.brand = brand;
		this.mainImage = mainImage;
		this.price = price;
		this.pickupDate = pickupDate;
		this.dropoffDate = dropoffDate;
		this.pickupLocation = pickupLocation;
		this.dropoffLocation = dropoffLocation;
		this.tripType = tripType;
		this.days = days;
		this.total = total;
		this.bookingStatus = bookingStatus;
		this.car = car;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public UserRequest getUser() {
		return user;
	}

	public void setUser(UserRequest user) {
		this.user = user;
	}


	public String getCarName() {
		return carName;
	}

	public void setCarName(String carName) {
		this.carName = carName;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getMainImage() {
		return mainImage;
	}

	public void setMainImage(String mainImage) {
		this.mainImage = mainImage;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public LocalDate getPickupDate() {
		return pickupDate;
	}

	public void setPickupDate(LocalDate pickupDate) {
		this.pickupDate = pickupDate;
	}

	public LocalDate getDropoffDate() {
		return dropoffDate;
	}

	public void setDropoffDate(LocalDate dropoffDate) {
		this.dropoffDate = dropoffDate;
	}

	public String getPickupLocation() {
		return pickupLocation;
	}

	public void setPickupLocation(String pickupLocation) {
		this.pickupLocation = pickupLocation;
	}

	public String getDropoffLocation() {
		return dropoffLocation;
	}

	public void setDropoffLocation(String dropoffLocation) {
		this.dropoffLocation = dropoffLocation;
	}

	public String getTripType() {
		return tripType;
	}

	public void setTripType(String tripType) {
		this.tripType = tripType;
	}

	public int getDays() {
		return days;
	}

	public void setDays(int days) {
		this.days = days;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public String getBookingStatus() {
		return bookingStatus;
	}

	public void setBookingStatus(String bookingStatus) {
		this.bookingStatus = bookingStatus;
	}

	public AdminCarsData getCar() {
		return car;
	}

	public void setCar(AdminCarsData car) {
		this.car = car;
	}

    
}