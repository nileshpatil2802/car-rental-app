# LuxeDrive - Premium Car Rental Website

A modern, fully responsive car rental website built with React.js, featuring a luxury design inspired by Amazon, BMW, and Tesla.

## 🚀 Features

### Pages
- **Home Page** - Hero section, featured cars, brands, testimonials, FAQ
- **Cars Listing** - Advanced filtering, sorting, grid/list view
- **Car Details** - Image gallery, specifications, pricing, similar cars
- **Booking** - Multi-step booking process with validation
- **Login/Register** - Beautiful authentication UI with form validation
- **Dashboard** - User profile, bookings, saved cars, documents
- **About Us** - Company story, values, team, statistics
- **Contact Us** - Contact form, business hours, support info
- **FAQ** - Frequently asked questions with accordion
- **404 Error** - Custom error page

### Components
- Responsive Navbar with mobile menu
- Premium Footer with links and social media
- Car Cards with ratings and features
- Toast Notifications
- Loading Skeletons
- Hero Banners
- Image Carousel
- Filter Sidebar
- Booking Summary

### Features
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Dark/light themed sections
- ✅ Smooth animations with Framer Motion
- ✅ Advanced car filtering and sorting
- ✅ Multi-step booking process
- ✅ User authentication (mock)
- ✅ Booking history and management
- ✅ Saved cars functionality
- ✅ Local storage support
- ✅ Form validation
- ✅ Beautiful UI with Tailwind CSS
- ✅ Professional color scheme (black, red, white)

## 🛠️ Tech Stack

- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **Axios** - HTTP client (ready for API integration)
- **Context API** - State management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-car-rental-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CarCard.jsx
│   ├── HeroBanner.jsx
│   ├── Toast.jsx
│   └── Loader.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Cars.jsx
│   ├── CarDetails.jsx
│   ├── Booking.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── FAQ.jsx
│   └── NotFound.jsx
├── context/            # Context API
│   ├── AuthContext.jsx
│   └── BookingContext.jsx
├── data/              # Mock data
│   └── carsData.js
├── utils/             # Utility functions
│   └── helpers.js
├── App.jsx            # Main app component
├── App.css            # App styles
├── index.css          # Global styles
└── main.jsx           # Entry point
```

## 🎨 Color Scheme

- **Primary**: #1a1a1a (Black)
- **Secondary**: #dc2626 (Red)
- **Accent**: #ffffff (White)
- **Light**: #f5f5f5 (Light Gray)

## 🔐 Authentication

The app includes mock authentication with:
- Email/password login
- User registration
- Demo login button
- Profile management
- Local storage persistence

**Demo Credentials:**
- Email: any@email.com
- Password: any password (min 6 characters)
- Or use the "Demo Login" button

## 💾 Data Storage

- **User Data**: Stored in localStorage
- **Bookings**: Stored in localStorage
- **Saved Cars**: Stored in localStorage

## 🚗 Mock Data

The app includes 8 premium cars with:
- Multiple images
- Detailed specifications
- Pricing information
- Ratings and reviews
- Availability status
- Features list

## 📱 Responsive Design

- **Mobile**: Optimized for screens < 640px
- **Tablet**: Optimized for screens 640px - 1024px
- **Desktop**: Optimized for screens > 1024px

## 🎯 Key Features Explained

### Booking Flow
1. Select car and click "Book Now"
2. Enter trip details (dates, locations)
3. Enter driver information
4. Review and confirm booking
5. Booking saved to dashboard

### Filtering
- Filter by brand, fuel type, transmission, seating
- Price range slider
- Search functionality
- Multiple sort options

### User Dashboard
- View upcoming and past bookings
- Manage bookings (modify, cancel)
- View saved cars
- Edit profile information
- Upload documents (UI only)

## 🔄 Future Enhancements

- Backend API integration
- Real payment gateway
- Email notifications
- SMS notifications
- Real-time availability
- Advanced search with map
- User reviews and ratings
- Admin dashboard
- Analytics

## 📝 Notes

- This is a frontend-only project
- No backend or database required
- All data is stored locally in the browser
- Perfect for portfolio and demonstration purposes
- Ready to integrate with backend APIs

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a premium car rental website template.

---

**Happy Coding! 🚗✨**
