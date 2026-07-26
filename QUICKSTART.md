# LuxeDrive - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 🔑 Demo Credentials

### Login
- **Email**: any@email.com
- **Password**: any password (minimum 6 characters)
- **Or**: Click "Demo Login" button for instant access

### Test User
- Name: John Doe
- Email: john@example.com
- Phone: 9876543210

## 📱 Key Features to Try

### 1. Browse Cars
- Go to `/cars`
- Use filters to find cars by brand, price, fuel type
- Sort by price, rating, or newest
- Click on any car to see details

### 2. Book a Car
- Click "Book Now" on any car
- Fill in trip details (dates, locations)
- Enter driver information
- Review and confirm booking
- Check booking in dashboard

### 3. User Dashboard
- View all bookings (upcoming and past)
- Manage bookings (modify or cancel)
- View saved cars
- Edit profile information
- Upload documents (UI only)

### 4. Save Cars
- Click the heart icon on any car card
- View saved cars in dashboard
- Quick access to favorite vehicles

### 5. Explore Pages
- **Home** (`/`) - Featured cars, testimonials, FAQ
- **Cars** (`/cars`) - Full car listing with filters
- **Car Details** (`/car/:id`) - Detailed car information
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and info
- **FAQ** (`/faq`) - Frequently asked questions
- **Dashboard** (`/dashboard`) - User profile and bookings

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#1a1a1a',      // Black
  secondary: '#dc2626',    // Red
  accent: '#ffffff',       // White
}
```

### Add More Cars
Edit `src/data/carsData.js` and add to `carsData` array

### Modify Testimonials
Edit `src/data/carsData.js` and update `testimonials` array

### Change Company Info
- Footer: `src/components/Footer.jsx`
- Contact: `src/pages/Contact.jsx`
- About: `src/pages/About.jsx`

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # State management
├── data/          # Mock data
├── utils/         # Helper functions
├── App.jsx        # Main app
├── index.css      # Global styles
└── main.jsx       # Entry point
```

## 🔧 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 💾 Data Storage

All data is stored in browser's localStorage:
- User profile
- Bookings
- Saved cars

Data persists across browser sessions but is cleared when localStorage is cleared.

## 🌐 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Next Steps

1. **Customize** - Update colors, text, and images
2. **Add More Data** - Add more cars and testimonials
3. **Backend Integration** - Connect to real APIs
4. **Deploy** - Deploy to Vercel, Netlify, or GitHub Pages

## 📚 Documentation

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Icons](https://react-icons.github.io/react-icons)

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Build Errors
```bash
npm run build -- --force
```

## 📞 Support

For issues or questions:
1. Check the FAQ page
2. Review the code comments
3. Check React/Tailwind documentation

## 🎉 You're All Set!

Start exploring and customizing your car rental website. Happy coding!
