// // export default Home;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiArrowRight, FiStar } from 'react-icons/fi';

// import HeroBanner from '../components/HeroBanner';
// import CarCard from '../components/CarCard';
// import Toast from '../components/Toast';

// import { getAllCars } from '../services/carService';

// // Keep static data if needed
// import { testimonials, brands } from '../data/carsData';

// const Home = () => {

//   const [toast, setToast] = useState(null);

//   // Dynamic Cars State
//   const [cars, setCars] = useState([]);

//   // Loading State (optional)
//   const [loading, setLoading] = useState(true);

//   // Fetch Cars
//   useEffect(() => {

//     const fetchCars = async () => {
//       try {
//         const data = await getAllCars();
//         setCars(data);
//       } catch (error) {
//         console.error("Failed to fetch cars:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCars();

//   }, []);

//   // Featured Cars
//   const featuredCars = cars.slice(0, 6);

//   const features = [
//     {
//       icon: '🚗',
//       title: 'Premium Fleet',
//       description: 'Luxury vehicles from top brands',
//     },
//     {
//       icon: '⚡',
//       title: 'Easy Booking',
//       description: 'Simple and fast reservation process',
//     },
//     {
//       icon: '🛡️',
//       title: 'Full Insurance',
//       description: 'Comprehensive coverage included',
//     },
//     {
//       icon: '🌍',
//       title: 'Global Service',
//       description: 'Available in multiple locations',
//     },
//   ];

//   return (
//     <div className="min-h-screen">

//       {/* Hero Section */}
//       <section className="container-custom py-8">
//         <HeroBanner
//           title="Experience Luxury on the Road"
//           subtitle="Premium car rental service with the finest vehicles and exceptional service"
//           image="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=600&fit=crop"
//           cta="Browse Cars"
//           ctaLink="/cars"
//         />
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-light">
//         <div className="container-custom">
//           <h2 className="section-title text-center">
//             Why Choose SelfDrive Junction?
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

//             {features.map((feature, idx) => (
//               <motion.div
//                 key={idx}
//                 whileHover={{ y: -10 }}
//                 className="bg-white p-8 rounded-xl card-shadow text-center"
//               >
//                 <div className="text-5xl mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </motion.div>
//             ))}

//           </div>
//         </div>
//       </section>

//       {/* Featured Cars */}
//       {/* <section className="py-16">

//         <div className="container-custom">

//           <div className="flex justify-between items-center mb-12">
//             <div>
//               <h2 className="section-title">Featured Vehicles</h2>
//               <p className="section-subtitle">
//                 Handpicked luxury cars for your journey
//               </p>
//             </div>

//             <Link
//               to="/cars"
//               className="btn-primary flex items-center gap-2"
//             >
//               View All <FiArrowRight />
//             </Link>
//           </div>

//           {/* Loading */}
//       {/* {loading ? (
//             <p className="text-center text-gray-500">
//               Loading cars...
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

//               {featuredCars.map((car) => (
//                 <CarCard
//                   key={car.id}
//                   car={car}
//                 />
//               ))}

//             </div>
//           )}

//         </div>
//       </section> */}
//       <section className="py-16">
//         <div className="container-custom">

//           <div className="flex justify-between items-center mb-12">
//             <div>
//               <h2 className="section-title">Featured Vehicles</h2>
//               <p className="section-subtitle">
//                 Handpicked luxury cars for your journey
//               </p>
//             </div>

//             <Link
//               to="/cars"
//               className="btn-primary flex items-center gap-2"
//             >
//               View All <FiArrowRight />
//             </Link>
//           </div>

//           {/* Loading */}
//           {loading ? (
//             <p className="text-center text-gray-500">
//               Loading cars...
//             </p>
//           ) : (
//             <div
//               className="flex gap-6 overflow-x-auto pb-4 featured-scroll"
//               style={{
//                 scrollbarWidth: "thin"
//               }}
//             >
//               {featuredCars.map((car) => (
//                 <div
//                   key={car.id}
//                   className="min-w-[350px] md:min-w-[380px] flex-shrink-0"
//                 >
//                   <CarCard car={car} />
//                 </div>
//               ))}
//             </div>
//           )}

//         </div>
//       </section>

//       {/* Brands Section */}
//       <section className="py-16 bg-light">
//         <div className="container-custom">

//           <h2 className="section-title text-center mb-12">
//             Premium Brands
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">

//             {brands.map((brand, idx) => (
//               <motion.div
//                 key={idx}
//                 whileHover={{ scale: 1.1 }}
//                 className="bg-white p-6 rounded-lg card-shadow flex items-center justify-center h-24 cursor-pointer"
//               >
//                 <span className="font-bold text-primary text-center">
//                   {brand}
//                 </span>
//               </motion.div>
//             ))}

//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       {/* <section className="py-16">

//         <div className="container-custom">

//           <h2 className="section-title text-center mb-12">
//             What Our Customers Say
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

//             {testimonials.map((testimonial) => (
//               <motion.div
//                 key={testimonial.id}
//                 whileHover={{ y: -10 }}
//                 className="bg-white p-8 rounded-xl card-shadow"
//               >

//                 <div className="flex items-center gap-4 mb-4">

//                   <img
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />

//                   <div>
//                     <h4 className="font-bold">{testimonial.name}</h4>
//                     <p className="text-sm text-gray-600">
//                       {testimonial.role}
//                     </p>
//                   </div>

//                 </div>

//                 <div className="flex gap-1 mb-4">

//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <FiStar
//                       key={i}
//                       className="fill-yellow-400 text-yellow-400"
//                     />
//                   ))}

//                 </div>

//                 <p className="text-gray-600 italic">
//                   "{testimonial.text}"
//                 </p>

//               </motion.div>
//             ))}

//           </div>

//         </div>
//       </section> */}
//       {/* <section className="py-16">
//   <div className="container-custom">

//     <h2 className="section-title text-center mb-12">
//       What Our Customers Say
//     </h2>

//     <div className="flex gap-8 overflow-x-auto pb-4 hide-scrollbar">

//       {testimonials.map((testimonial) => (
//         <motion.div
//           key={testimonial.id}
//           whileHover={{ y: -10 }}
//           className="bg-white p-8 rounded-xl card-shadow min-w-[320px] max-w-[320px] flex-shrink-0"
//         >

//           <div className="flex items-center gap-4 mb-4">

//             <img
//               src={testimonial.image}
//               alt={testimonial.name}
//               className="w-12 h-12 rounded-full object-cover"
//             />

//             <div>
//               <h4 className="font-bold">
//                 {testimonial.name}
//               </h4>

//               <p className="text-sm text-gray-600">
//                 {testimonial.role}
//               </p>
//             </div>

//           </div>

//           <div className="flex gap-1 mb-4">

//             {[...Array(testimonial.rating)].map((_, i) => (
//               <FiStar
//                 key={i}
//                 className="fill-yellow-400 text-yellow-400"
//               />
//             ))}

//           </div>

//           <p className="text-gray-600 italic">
//             "{testimonial.text}"
//           </p>

//         </motion.div>
//       ))}

//     </div>

//   </div>
// </section> */}
//       <section className="py-16">
//         <div className="container-custom">

//           <h2 className="section-title text-center mb-12">
//             What Our Customers Say
//           </h2>

//           <div
//             className="flex gap-8 overflow-x-auto pb-4 featured-scroll"
//             style={{ scrollbarWidth: "thin" }}
//           >

//             {testimonials.map((testimonial) => (
//               <motion.div
//                 key={testimonial.id}
//                 whileHover={{ y: -10 }}
//                 className="bg-white p-8 rounded-xl card-shadow min-w-[320px] max-w-[320px] flex-shrink-0"
//               >

//                 <div className="flex items-center gap-4 mb-4">

//                   <img
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />

//                   <div>
//                     <h4 className="font-bold">
//                       {testimonial.name}
//                     </h4>

//                     <p className="text-sm text-gray-600">
//                       {testimonial.role}
//                     </p>
//                   </div>

//                 </div>

//                 <div className="flex gap-1 mb-4">

//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <FiStar
//                       key={i}
//                       className="fill-yellow-400 text-yellow-400"
//                     />
//                   ))}

//                 </div>

//                 <p className="text-gray-600 italic">
//                   "{testimonial.text}"
//                 </p>

//               </motion.div>
//             ))}

//           </div>

//         </div>
//       </section>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed bottom-8 right-8 z-50">
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         </div>
//       )}

//     </div>
//   );
// };

// export default Home;