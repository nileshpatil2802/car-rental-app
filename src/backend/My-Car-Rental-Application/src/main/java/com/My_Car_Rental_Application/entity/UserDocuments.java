package com.My_Car_Rental_Application.entity;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserDocuments {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column(length = 500)
	private String drivingLicense;
	@Column(length = 500)
	private String aadhharCard;
	
	private String status;
	
	private String reason;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private UserRequest user;

	public UserDocuments() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserDocuments(int id, String drivingLicense, String aadhharCard, String status, String reason,
			UserRequest user) {
		super();
		this.id = id;
		this.drivingLicense = drivingLicense;
		this.aadhharCard = aadhharCard;
		this.status = status;
		this.reason = reason;
		this.user = user;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDrivingLicense() {
		return drivingLicense;
	}

	public void setDrivingLicense(String drivingLicense) {
		this.drivingLicense = drivingLicense;
	}

	public String getAadhharCard() {
		return aadhharCard;
	}

	public void setAadhharCard(String aadhharCard) {
		this.aadhharCard = aadhharCard;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public UserRequest getUser() {
		return user;
	}

	public void setUser(UserRequest user) {
		this.user = user;
	}

	
	
	
}
