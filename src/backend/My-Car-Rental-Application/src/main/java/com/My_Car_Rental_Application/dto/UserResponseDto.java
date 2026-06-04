package com.My_Car_Rental_Application.dto;

public class UserResponseDto {

	private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatar;
    private String role;
	
    public UserResponseDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserResponseDto(String firstName, String lastName, String email, String phone, String avatar, String role) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.avatar = avatar;
		this.role = role;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	
    
	
}
