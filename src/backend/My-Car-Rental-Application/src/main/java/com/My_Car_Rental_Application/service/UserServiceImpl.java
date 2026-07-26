package com.My_Car_Rental_Application.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.My_Car_Rental_Application.dto.BookingDto;
import com.My_Car_Rental_Application.dto.CarsDataRequestDto;
import com.My_Car_Rental_Application.entity.AdminCarsData;
import com.My_Car_Rental_Application.entity.Booking;
import com.My_Car_Rental_Application.entity.Cart;
import com.My_Car_Rental_Application.entity.UserDocuments;
import com.My_Car_Rental_Application.entity.UserRequest;
import com.My_Car_Rental_Application.repository.BookingRepository;
import com.My_Car_Rental_Application.repository.CarsDataRepository;
import com.My_Car_Rental_Application.repository.CartRepository;
import com.My_Car_Rental_Application.repository.HomeRepository;
import com.My_Car_Rental_Application.repository.UserDocumentRepository;

@Service
public class UserServiceImpl implements UserService{
	
	private CartRepository cartRepository;
	
	private HomeRepository homeRepository;
	
	private CarsDataRepository carsDataRepository;
	
	private BookingRepository bookingRepository;
	
	private UserDocumentRepository userDocumentRepository;
	
	public UserServiceImpl(CartRepository cartRepository,CarsDataRepository carsDataRepository,HomeRepository homeRepository,BookingRepository bookingRepository,UserDocumentRepository userDocumentRepository) {
		this.cartRepository=cartRepository;
		this.homeRepository=homeRepository;
		this.bookingRepository=bookingRepository;
		this.userDocumentRepository=userDocumentRepository;
		this.carsDataRepository=carsDataRepository;
	}

	@Override
	public List<Cart> addCart(CarsDataRequestDto acd) {
		

			UserRequest user = homeRepository.findById(acd.getUserId()).orElseThrow();
		
			Cart ad=new Cart();
			ad.setName(acd.getName());
			ad.setCarId(acd.getCarId());
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
			
			ad.setFeatures(acd.getFeatures());
			ad.setUser(user);
			
			System.out.println("User Id cheque in user service : "+acd.getUserId());
			
			cartRepository.save(ad);
			 
			
		//}
		return cartRepository.findByUser_Id(acd.getUserId());
	}

	@Override
	public List<Cart> getAllCarts(int userId) {
		//return cartRepository.findAll();     findByUser_Id
		return cartRepository.findByUser_Id(userId); 
	}

	@Override
	public Cart getCartById(int id,int userId) {
		return cartRepository.findByIdAndUserId(id,userId);
	}

	@Override
	public void deleteCart(int id) {
		cartRepository.deleteById(id);
		
	}

	@Override
	public UserRequest getUserByEmail(String email) {
		UserRequest byEmail = homeRepository.findByEmail(email);
		
		return byEmail;
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
		user.setRole("USER");
		
		UserRequest save = homeRepository.save(user);
		System.out.println("Updated data from service repo return : "+save);
		
		return save;
	}

//	@Override
//public List<Booking> booking(BookingDto booking) {
//
//    UserRequest user = homeRepository.findById(booking.getUserId())
//            .orElseThrow(() -> new RuntimeException("User not found"));
//    
//    if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
//        throw new RuntimeException("Your account has been blocked by the administrator. You cannot book a car.");
//    }
//
//    Booking book = new Booking();
//
//    book.setUser(user);
//
//    book.setCarName(booking.getCarName());
//    book.setBrand(booking.getBrand());
//    book.setMainImage(booking.getMainImage());
//    book.setPrice(booking.getPrice());
//
//    book.setPickupDate(booking.getPickupDate());
//    book.setDropoffDate(booking.getDropoffDate());
//
//    book.setPickupLocation(booking.getPickupLocation());
//    book.setDropoffLocation(booking.getDropoffLocation());
//
//    book.setTripType(booking.getTripType());
//
//    book.setDays(booking.getDays());
//    book.setTotal(booking.getTotal());
//
//    book.setBookingStatus("Ride Request Pending Approval ✅");
//
//    bookingRepository.save(book);
//
//    return bookingRepository.findByUser_Id(user.getId());
//}
	
	@Override
	public List<Booking> booking(BookingDto booking) {

	    // 1. Check user
	    UserRequest user = homeRepository.findById(booking.getUserId())
	            .orElseThrow(() ->
	                    new RuntimeException("User not found")
	            );
	    
	   AdminCarsData car = carsDataRepository.findById(booking.getCarId()).orElseThrow(() ->
       new RuntimeException("Car not found")
);

	    // 2. Check blocked user
	    if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
	        throw new RuntimeException(
	                "Your account has been blocked by the administrator. You cannot book a car."
	        );
	    }

	    // 3. Validate car ID
	    if (booking.getCarId() <= 0) {
	        throw new RuntimeException("Invalid car ID");
	    }

	    // 4. Validate dates
	    if (booking.getPickupDate() == null) {
	        throw new RuntimeException("Pickup date is required");
	    }

	    if (booking.getDropoffDate() == null) {
	        throw new RuntimeException("Drop-off date is required");
	    }

	    // 5. Pickup date cannot be in the past
	    if (booking.getPickupDate().isBefore(LocalDate.now())) {
	        throw new RuntimeException(
	                "Pickup date cannot be in the past"
	        );
	    }

	    // 6. Drop-off date must be after pickup date
	    if (!booking.getDropoffDate()
	            .isAfter(booking.getPickupDate())) {

	        throw new RuntimeException(
	                "Drop-off date must be after pickup date"
	        );
	    }

	    // 7. Check whether same car already has overlapping booking
	    long overlappingBookings =
	            bookingRepository.countOverlappingBookings(
	                    booking.getCarId(),
	                    booking.getPickupDate(),
	                    booking.getDropoffDate()
	            );

	    if (overlappingBookings > 0) {
	        throw new RuntimeException(
	                "This car is already booked or waiting for approval for the selected dates"
	        );
	    }

	    // 8. Create booking entity
	    Booking book = new Booking();

	    book.setUser(user);

	    

	    book.setCarName(booking.getCarName());
	    book.setBrand(booking.getBrand());
	    book.setMainImage(booking.getMainImage());
	    book.setPrice(booking.getPrice());

	    book.setPickupDate(booking.getPickupDate());
	    book.setDropoffDate(booking.getDropoffDate());

	    book.setPickupLocation(booking.getPickupLocation());
	    book.setDropoffLocation(booking.getDropoffLocation());
        book.setCar(car);
	    book.setTripType(booking.getTripType());

	    book.setDays(booking.getDays());
	    book.setTotal(booking.getTotal());

	    /*
	     * Never accept booking status from frontend.
	     * Every new booking starts as PENDING.
	     */
	    book.setBookingStatus("PENDING");

	    // 9. Save booking
	    bookingRepository.save(book);

	    // 10. Return user's updated booking list
	    return bookingRepository.findByUser_Id(user.getId());
	}

	@Override
	public void cancelBooking(int bookingId, int userId) {
		bookingRepository.deleteByBookingIdAndUserId(bookingId,userId);
	}

	@Override
	public List<Booking> getBookingList(int id) {
		// TODO Auto-generated method stub
		return bookingRepository.findByUser_Id(id);
	}

//	@Override
//	public
//	UserDocuments uploadDocuments(
//	        int userId,
//	        MultipartFile drivingLicense,
//	        MultipartFile aadhaarCard
//	) {
//		String driving = drivingLicense.getOriginalFilename();
//		String aadhhar = aadhaarCard.getOriginalFilename();
//		
//		UserRequest user = homeRepository.findById(userId).orElseThrow();
//		
//		UserDocuments document = userDocumentRepository
//	            .findByUserId(userId)
//	            .orElse(new UserDocuments());
//		
//		
//		document.setUser(user);
//		document.setDrivingLicense(driving);
//		document.setAadhharCard(aadhhar);
//		userDocumentRepository.save(document);
//		
//		return userDocumentRepository.findByUser_Id(userId);
//	}
//	@Override
//	public UserDocuments uploadDocuments(
//	        int userId,
//	        MultipartFile drivingLicense,
//	        MultipartFile aadhharCard
//	) {
//	    try {
//	        //String uploadDir1 = "D:/car-rental-documents/";
//	        String uploadDir = "D:/Nilesh Patil/car-rental-app-main/car-rental-app-main/upload";
//	        File folder = new File(uploadDir);
//	        if (!folder.exists()) {
//	            folder.mkdirs();
//	        }
//
//	        String drivingFileName = System.currentTimeMillis() + "_" + drivingLicense.getOriginalFilename();
//	        String aadhaarFileName = System.currentTimeMillis() + "_" + aadhharCard.getOriginalFilename();
//
//	        Path drivingPath = Paths.get(uploadDir + drivingFileName);
//	        Path aadhaarPath = Paths.get(uploadDir + aadhaarFileName);
//
//	        Files.copy(drivingLicense.getInputStream(), drivingPath, StandardCopyOption.REPLACE_EXISTING);
//	        Files.copy(aadhharCard.getInputStream(), aadhaarPath, StandardCopyOption.REPLACE_EXISTING);
//
//	        UserRequest user = homeRepository.findById(userId).orElseThrow();
//
//	        UserDocuments document = userDocumentRepository
//	                .findByUserId(userId)
//	                .orElse(new UserDocuments());
//
//	        document.setUser(user);
//	        document.setDrivingLicense(drivingFileName);
//	        document.setAadhharCard(aadhaarFileName);
//
//	        userDocumentRepository.save(document);
//
//	        return userDocumentRepository.findByUser_Id(userId);
//
//	    } catch (Exception e) {
//	        throw new RuntimeException("Document upload failed: " + e.getMessage());
//	    }
//	}
//	@Override
//	public UserDocuments uploadDocuments(
//	        int userId,
//	        MultipartFile drivingLicense,
//	        MultipartFile aadhharCard) {
//
//	    try {
//
//	        String uploadDir =
//	                "D:/Nilesh Patil/car-rental-app-main/car-rental-app-main/upload";
//
//	        File folder = new File(uploadDir);
//
//	        if (!folder.exists()) {
//	            folder.mkdirs();
//	        }
//
//	        String drivingFileName =
//	                System.currentTimeMillis() + "_" +
//	                drivingLicense.getOriginalFilename();
//
//	        String aadhaarFileName =
//	                System.currentTimeMillis() + "_" +
//	                aadhharCard.getOriginalFilename();
//
//	        Path drivingPath =
//	                Paths.get(uploadDir, drivingFileName);
//
//	        Path aadhaarPath =
//	                Paths.get(uploadDir, aadhaarFileName);
//
//	        Files.copy(
//	                drivingLicense.getInputStream(),
//	                drivingPath,
//	                StandardCopyOption.REPLACE_EXISTING
//	        );
//
//	        Files.copy(
//	                aadhharCard.getInputStream(),
//	                aadhaarPath,
//	                StandardCopyOption.REPLACE_EXISTING
//	        );
//
//	        UserRequest user =
//	                homeRepository.findById(userId)
//	                .orElseThrow(() ->
//	                        new RuntimeException("User not found"));
//
//	        UserDocuments document =
//	                userDocumentRepository
//	                .findByUserId(userId)
//	                .orElse(new UserDocuments());
//
//	        document.setUser(user);
//	        document.setDrivingLicense(drivingFileName);
//	        document.setAadhharCard(aadhaarFileName);
//
//	        userDocumentRepository.save(document);
//
//	        return userDocumentRepository.findByUser_Id(userId);
//
//	    } catch (Exception e) {
//
//	        e.printStackTrace();
//
//	        throw new RuntimeException(
//	                "Document upload failed : " + e.getMessage()
//	        );
//	    }
//	}
	
	@Override
	public UserDocuments uploadDocuments(
	        int userId,
	        MultipartFile drivingLicense,
	        MultipartFile aadhharCard) {

	    try {
	        String uploadDir =
	                "D:/Nilesh Patil/car-rental-app-main/car-rental-app-main/upload";

	        File folder = new File(uploadDir);

	        if (!folder.exists()) {
	            folder.mkdirs();
	        }

	        // DELETE ALL PREVIOUS FILES FROM UPLOAD FOLDER
//	        File[] oldFiles = folder.listFiles();
//
//	        if (oldFiles != null) {
//	            for (File oldFile : oldFiles) {
//	                if (oldFile.isFile()) {
//	                    oldFile.delete();
//	                }
//	            }
//	        }

	        // NEW FILE NAMES
	        String drivingFileName =
	                System.currentTimeMillis() + "_" +
	                drivingLicense.getOriginalFilename();

	        String aadhaarFileName =
	                System.currentTimeMillis() + "_" +
	                aadhharCard.getOriginalFilename();

	        Path drivingPath = Paths.get(uploadDir, drivingFileName);
	        Path aadhaarPath = Paths.get(uploadDir, aadhaarFileName);

	        // SAVE NEW FILES
	        Files.copy(
	                drivingLicense.getInputStream(),
	                drivingPath,
	                StandardCopyOption.REPLACE_EXISTING
	        );

	        Files.copy(
	                aadhharCard.getInputStream(),
	                aadhaarPath,
	                StandardCopyOption.REPLACE_EXISTING
	        );

	        UserRequest user =
	                homeRepository.findById(userId)
	                        .orElseThrow(() -> new RuntimeException("User not found"));

	        UserDocuments document =
	                userDocumentRepository
	                        .findByUserId(userId)
	                        .orElse(new UserDocuments());

	        document.setUser(user);
	        document.setDrivingLicense(drivingFileName);
	        document.setAadhharCard(aadhaarFileName);
	        document.setStatus("Pending");
	        document.setReason("");

	        userDocumentRepository.save(document);

	        return userDocumentRepository.findByUser_Id(userId);

	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new RuntimeException(
	                "Document upload failed : " + e.getMessage()
	        );
	    }
	}

	@Override
	public UserDocuments getDocumentsByUser(int userId) {
		 
		return userDocumentRepository.findByUser_Id(userId);
	}

	@Override
	public List<UserRequest> getAllUsers() {
		
		return homeRepository.findAll();
	}

	@Override
	public List<UserDocuments> DocumentList() {
		
		return userDocumentRepository.findAll();
	}

 

	
}
