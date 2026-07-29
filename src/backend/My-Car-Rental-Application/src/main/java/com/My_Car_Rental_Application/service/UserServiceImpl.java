package com.My_Car_Rental_Application.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.time.temporal.ChronoUnit;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.My_Car_Rental_Application.dto.AddToCartDto;
import com.My_Car_Rental_Application.dto.BookingDto;
import com.My_Car_Rental_Application.dto.BookingResponseDto;
import com.My_Car_Rental_Application.dto.CartResponseDto;
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
	
	private final PasswordEncoder passwordEncoder;
	
	public UserServiceImpl(CartRepository cartRepository,CarsDataRepository carsDataRepository,HomeRepository homeRepository,BookingRepository bookingRepository,UserDocumentRepository userDocumentRepository,PasswordEncoder passwordEncoder) {
		this.cartRepository=cartRepository;
		this.homeRepository=homeRepository;
		this.bookingRepository=bookingRepository;
		this.userDocumentRepository=userDocumentRepository;
		this.carsDataRepository=carsDataRepository;
		this.passwordEncoder=passwordEncoder;
	}

	@Override
	public List<CartResponseDto> addCart(AddToCartDto dto) {
		

		 UserRequest user = homeRepository
		            .findById(dto.getUserId())
		            .orElseThrow(() ->
		                    new RuntimeException("User not found"));
		 
		 AdminCarsData car = carsDataRepository
		            .findById(dto.getCarId())
		            .orElseThrow(() ->
		                    new RuntimeException("Car not found"));
		 
		 boolean alreadyExists =
		            cartRepository.existsByUser_IdAndCar_Id(
		                    user.getId(),
		                    car.getId());
		 
		 if (alreadyExists) {
		        throw new RuntimeException("Car already added in cart.");
		    }
		
			Cart cart=new Cart();
			cart.setUser(user);
		    cart.setCar(car);

			
			
			
			cartRepository.save(cart);
			 System.out.println("User ID : " + user.getId());
			 System.out.println("Car ID  : " + car.getId());
			 
			
		//}
			 return cartRepository
		                .findByUser_Id(user.getId())
		                .stream()
		                .map(this::convertToCartResponseDto)
		                .toList();
	}

	@Override
	public List<CartResponseDto> getAllCarts(int userId) {
		return cartRepository
        .findByUser_Id(userId)
        .stream()
        .map(this::convertToCartResponseDto)
        .toList();
	}

	@Override
	public CartResponseDto getCartById(int id,int userId) {
		
		Cart cart = cartRepository.findByIdAndUserId(id,userId);
		
		if (cart == null) {
	        throw new RuntimeException("Cart not found");
	    }
		
		return convertToCartResponseDto(cart); 
		
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
		user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
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
	public List<BookingResponseDto> booking(BookingDto booking) {
		
//		UserDocuments documentsByUserId = userDocumentRepository.findByUser_Id(booking.getUserId());
//		System.out.println("I am in booking service document fetch using userId :"+documentsByUserId);
//		System.out.println("I am in booking service print user Id here :"+booking.getUserId());

		
		
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
	    
	    long calculatedDays = ChronoUnit.DAYS.between(
	            booking.getPickupDate(),
	            booking.getDropoffDate()
	    );
	    
	    if (calculatedDays <= 0) {
	        throw new RuntimeException(
	                "Drop-off date must be after pickup date"
	        );
	    }
	    
	    double pricePerDay = car.getPrice();

	    double totalAmount =
	            pricePerDay * calculatedDays;

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
	    book.setAdminCarsData(car);

	    book.setPickupDate(booking.getPickupDate());
	    book.setDropoffDate(booking.getDropoffDate());

	    book.setDays((int) calculatedDays);

	    book.setPrice(pricePerDay);
	    book.setTotal(totalAmount);

	    book.setBookingStatus("PENDING");

	    book.setPickupLocation(booking.getPickupLocation());
	    book.setDropoffLocation(booking.getDropoffLocation());

	    book.setTripDriverType(booking.getTripDriverType());

	    // 9. Save booking
	    bookingRepository.save(book);

	    // 10. Return user's updated booking list
	    return bookingRepository.findByUser_Id(user.getId()).stream().map(this::convertToDto).toList();
	}
	
//	public BookingResponseDto convertToDto(Booking booking) {
//		BookingResponseDto dto=new BookingResponseDto();
//		dto.setBookingId(booking.getId());
//		dto.setBrand(booking.getAdminCarsData().getBrand());
//		dto.setCarId(booking.getAdminCarsData().getId());
//		dto.setCreatedAt(booking.getCreatedAt());
//		dto.setDescription(booking.getAdminCarsData().getDescription());
//		dto.setFeatures(booking.getAdminCarsData().getFeatures());
//		dto.setFuelType(booking.getAdminCarsData().getFuelType());
//		dto.setMainImage(booking.getAdminCarsData().getMainImage());
//		dto.setImg1(booking.getAdminCarsData().getImg1());
//		dto.setImg2(booking.getAdminCarsData().getImg2());
//		dto.setImg3(booking.getAdminCarsData().getImg3());
//		dto.setName(booking.getAdminCarsData().getName());
//		dto.setPrice(booking.getAdminCarsData().getPrice());
//		dto.setSeating(booking.getAdminCarsData().getSeating());
//		dto.setStatus(booking.getBookingStatus());
//		dto.setTransmition(booking.getAdminCarsData().getTransmition());
//		dto.setUserId(booking.getUser().getId());
//		
//		
//		return dto;
//	}
	public BookingResponseDto convertToDto(Booking booking) {

	    BookingResponseDto dto = new BookingResponseDto();

	    dto.setBookingId(booking.getId());
	    dto.setCreatedAt(booking.getCreatedAt());
	    dto.setStatus(booking.getBookingStatus());
	    
//	    private int days;

	    //private String bookingStatus;
	    
//	    private String pickupLocation;
//	    
//	    private String dropoffLocation;
	    
//	    private String tripDriverType;
	    
//	    private Double total;
	    
	   // private Double price; 

	    // Booking information
	    dto.setPickupDate(booking.getPickupDate());
	    dto.setDropoffDate(booking.getDropoffDate());
	    dto.setPickupLocation(booking.getPickupLocation());
	    dto.setDropoffLocation(booking.getDropoffLocation());

	    // Use the getter that actually exists in your Booking entity
	    dto.setTripDriverType(booking.getTripDriverType());

	    dto.setDays(booking.getDays());

	    dto.setTotal(
	            booking.getTotal() != null
	                    ? booking.getTotal()
	                    : 0.0
	    );

	    // User information
	    if (booking.getUser() != null) {
	        dto.setUserId(booking.getUser().getId());
	    }

	    // Car information
	    if (booking.getAdminCarsData() != null) {

	        AdminCarsData car = booking.getAdminCarsData();

	        dto.setCarId(car.getId());
	        dto.setBrand(car.getBrand());
	        dto.setDescription(car.getDescription());
	        dto.setFeatures(car.getFeatures());
	        dto.setFuelType(car.getFuelType());

	        dto.setMainImage(car.getMainImage());
	        dto.setImg1(car.getImg1());
	        dto.setImg2(car.getImg2());
	        dto.setImg3(car.getImg3());

	        dto.setName(car.getName());

	        // Booking price saved at booking time
	        dto.setPrice(
	                booking.getPrice() != null
	                        ? booking.getPrice()
	                        : car.getPrice()
	        );

	        dto.setSeating(car.getSeating());
	        dto.setTransmition(car.getTransmition());
	    }

	    return dto;
	}

	@Override
	public void cancelBooking(int bookingId, int userId) {
		bookingRepository.deleteByBookingIdAndUserId(bookingId,userId);
	}

	@Override
	public List<BookingResponseDto> getBookingList(int id) {
		// TODO Auto-generated method stub
		return bookingRepository.findByUser_Id(id).stream().map(this::convertToDto).toList();
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

	
//	private CartResponseDto convertToDto(Cart cart) {
//
//	    CartResponseDto dto = new CartResponseDto();
//
//	    dto.setCartId(cart.getId());
//
//	    dto.setCarId(cart.getCar().getId());
//
//	    dto.setName(cart.getCar().getName());
//
//	    dto.setBrand(cart.getCar().getBrand());
//
//	    dto.setPrice(cart.getCar().getPrice());
//
//	    dto.setMainImage(cart.getCar().getMainImage());
//
//	    dto.setFuelType(cart.getCar().getFuelType());
//
//	    dto.setSeating(cart.getCar().getSeating());
//
//	    dto.setTransmition(cart.getCar().getTransmition());
//
//	    return dto;
//	}
	
	private CartResponseDto convertToCartResponseDto(Cart cart) {

	    CartResponseDto dto = new CartResponseDto();

	    dto.setCartId(cart.getId());
	    dto.setUserId(cart.getUser().getId());

	    AdminCarsData car = cart.getCar();

	    dto.setCarId(car.getId());

	    dto.setMainImage(car.getMainImage());
	    dto.setImg1(car.getImg1());
	    dto.setImg2(car.getImg2());
	    dto.setImg3(car.getImg3());

	    dto.setStatus(car.isStatus());

	    dto.setFuelType(car.getFuelType());
	    dto.setName(car.getName());
	    dto.setSeating(car.getSeating());
	    dto.setTransmition(car.getTransmition());
	    dto.setPrice(car.getPrice());

	    dto.setFeatures(car.getFeatures());

	    dto.setDescription(car.getDescription());
	    dto.setBrand(car.getBrand());

	    dto.setCreatedAt(cart.getCreatedAt());

	    return dto;
	}
 

	
}
