// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   FiTruck,
//   FiUsers,
//   FiCalendar,
//   FiClock,
//   FiDollarSign,
//   FiPlus,
//   FiEdit,
//   FiTrash2,
//   FiEye,
//   FiCheck,
//   FiX,
//   FiUserX,
//   FiUserCheck,
//   FiFileText,
// } from 'react-icons/fi';

// import { getAllCars } from "../services/carService";

// const Cars = () => {
//   const [activeSection, setActiveSection] = useState('cars');
//   const [cars, setCars] = useState([]);

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   const fetchCars = async () => {
//     const data = await getAllCars();
//     setCars(data);
//   };

//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: 'Nilesh',
//       email: 'nilesh@gmail.com',
//       phone: '9876543210',
//       blocked: false,
//       drivingLicense: 'license.jpg',
//       aadhaarCard: 'aadhaar.jpg',
//       documentStatus: 'PENDING',
//       rejectReason: '',
//     },
//     {
//       id: 2,
//       name: 'Rahul',
//       email: 'rahul@gmail.com',
//       phone: '9876543211',
//       blocked: false,
//       drivingLicense: 'license2.jpg',
//       aadhaarCard: 'aadhaar2.jpg',
//       documentStatus: 'APPROVED',
//       rejectReason: '',
//     },
//   ]);

//   const [bookings, setBookings] = useState([
//     {
//       id: 1,
//       user: 'Nilesh',
//       car: 'BMW M440i',
//       status: 'PENDING',
//       total: 2500,
//       paymentStatus: 'Pending',
//     },
//     {
//       id: 2,
//       user: 'Rahul',
//       car: 'Audi A6',
//       status: 'CONFIRMED',
//       total: 4000,
//       paymentStatus: 'Paid',
//     },
//   ]);

//   const emptyCar = {
//     id: '',
//     mainImage: '',
//     img1: '',
//     img2: '',
//     img3: '',
//     mainImageFile: null,
//     img1File: null,
//     img2File: null,
//     img3File: null,

//     name: '',
//     brand: '',
//     fuelType: '',
//     seating: '',
//     transmition: '',
//     price: '',
//     rating: '',
//     reviews: '',
//     description: '',

//     feature1: '',
//     feature2: '',
//     feature3: '',
//     feature4: '',
//     feature5: '',

//     carStatus: 'Available',
//     status: true,
//     available: true,
//   };

//   const [editingCar, setEditingCar] = useState(null);
//   const [showAddCar, setShowAddCar] = useState(false);
//   const [newCar, setNewCar] = useState(emptyCar);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedCar, setSelectedCar] = useState(null);

//   const handleImageFileChange = (e, car, setCar, fieldName) => {
//     const file = e.target.files[0];

//     if (file) {
//       const imageUrl = URL.createObjectURL(file);

//       setCar({
//         ...car,
//         [fieldName]: imageUrl,
//         [`${fieldName}File`]: file,
//       });
//     }
//   };

//   const totalRevenue = bookings
//     .filter((booking) => booking.paymentStatus === 'Paid')
//     .reduce((sum, booking) => sum + Number(booking.total || 0), 0);

//   const dashboardCards = useMemo(
//     () => [
//       {
//         key: 'cars',
//         title: 'Total Cars',
//         value: cars.length,
//         icon: <FiTruck />,
//       },
//       {
//         key: 'users',
//         title: 'Total Users',
//         value: users.length,
//         icon: <FiUsers />,
//       },
//       {
//         key: 'bookings',
//         title: 'Total Bookings',
//         value: bookings.length,
//         icon: <FiCalendar />,
//       },
//       {
//         key: 'pending',
//         title: 'Pending Bookings',
//         value: bookings.filter((b) => b.status === 'PENDING').length,
//         icon: <FiClock />,
//       },
//       {
//         key: 'revenue',
//         title: 'Total Revenue',
//         value: `₹${totalRevenue.toLocaleString('en-IN')}`,
//         icon: <FiDollarSign />,
//       },
//       {
//         key: 'documents',
//         title: 'Documents',
//         value: users.filter((u) => u.documentStatus === 'PENDING').length,
//         icon: <FiFileText />,
//       },
//     ],
//     [cars, users, bookings, totalRevenue]
//   );

//   const handleAddCar = (e) => {
//     e.preventDefault();

//     const carToAdd = {
//       ...newCar,
//       id: Date.now(),
//       price: Number(newCar.price),
//       seating: Number(newCar.seating),
//       rating: Number(newCar.rating),
//       reviews: Number(newCar.reviews),
//       available: newCar.carStatus === 'Available',
//       status: newCar.carStatus === 'Available',
//       features: [
//         newCar.feature1,
//         newCar.feature2,
//         newCar.feature3,
//         newCar.feature4,
//         newCar.feature5,
//       ].filter(Boolean),
//     };

//     setCars([carToAdd, ...cars]);
//     setNewCar(emptyCar);
//     setShowAddCar(false);
//   };

//   const handleUpdateCar = (e) => {
//     e.preventDefault();

//     setCars(
//       cars.map((car) =>
//         car.id === editingCar.id
//           ? {
//               ...editingCar,
//               price: Number(editingCar.price),
//               seating: Number(editingCar.seating),
//               rating: Number(editingCar.rating),
//               reviews: Number(editingCar.reviews),
//               available: editingCar.carStatus === 'Available',
//               status: editingCar.carStatus === 'Available',
//               features: [
//                 editingCar.feature1,
//                 editingCar.feature2,
//                 editingCar.feature3,
//                 editingCar.feature4,
//                 editingCar.feature5,
//               ].filter(Boolean),
//             }
//           : car
//       )
//     );

//     setEditingCar(null);
//   };

//   const handleDeleteCar = (id) => {
//     if (window.confirm('Are you sure you want to delete this car?')) {
//       setCars(cars.filter((car) => car.id !== id));
//     }
//   };

//   const handleBookingStatus = (id, status) => {
//     setBookings(
//       bookings.map((booking) =>
//         booking.id === id ? { ...booking, status } : booking
//       )
//     );
//   };

//   const handlePaymentStatus = (id, paymentStatus) => {
//     setBookings(
//       bookings.map((booking) =>
//         booking.id === id ? { ...booking, paymentStatus } : booking
//       )
//     );
//   };

//   const handleBlockUser = (id) => {
//     setUsers(
//       users.map((user) =>
//         user.id === id ? { ...user, blocked: !user.blocked } : user
//       )
//     );
//   };

//   const handleDeleteUser = (id) => {
//     if (window.confirm('Delete this user?')) {
//       setUsers(users.filter((user) => user.id !== id));
//     }
//   };

//   const approveDocument = (id) => {
//     setUsers(
//       users.map((user) =>
//         user.id === id
//           ? { ...user, documentStatus: 'APPROVED', rejectReason: '' }
//           : user
//       )
//     );
//   };

//   const rejectDocument = (id) => {
//     const reason = prompt('Enter rejection reason');

//     if (reason) {
//       setUsers(
//         users.map((user) =>
//           user.id === id
//             ? { ...user, documentStatus: 'REJECTED', rejectReason: reason }
//             : user
//         )
//       );
//     }
//   };

//   const openEditCarForm = (car) => {
//     setEditingCar({
//       ...car,
//       mainImage: car.image || car.mainImage || '',
//       feature1: car.features?.[0] || '',
//       feature2: car.features?.[1] || '',
//       feature3: car.features?.[2] || '',
//       feature4: car.features?.[3] || '',
//       feature5: car.features?.[4] || '',
//       carStatus: car.available || car.status ? 'Available' : 'Booked',
//     });
//   };

//   const renderCarForm = (car, setCar, submitHandler, title) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <form
//         onSubmit={submitHandler}
//         className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//       >
//         <h2 className="text-2xl font-bold text-primary mb-5">{title}</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[
//             ['name', 'Car Name'],
//             ['brand', 'Brand'],
//             ['fuelType', 'Fuel Type'],
//             ['transmition', 'Transmission'],
//             ['seating', 'Seating'],
//             ['price', 'Price'],
//             ['rating', 'Rating'],
//             ['reviews', 'Reviews'],
//           ].map(([name, placeholder]) => (
//             <input
//               key={name}
//               name={name}
//               value={car[name] || ''}
//               onChange={(e) => setCar({ ...car, [name]: e.target.value })}
//               placeholder={placeholder}
//               className="border p-3 rounded-lg"
//             />
//           ))}

//           <select
//             value={car.carStatus}
//             onChange={(e) => setCar({ ...car, carStatus: e.target.value })}
//             className="border p-3 rounded-lg"
//           >
//             <option value="Available">Available</option>
//             <option value="Booked">Booked</option>
//             <option value="Maintenance">Maintenance</option>
//           </select>

//           <textarea
//             value={car.description || ''}
//             onChange={(e) => setCar({ ...car, description: e.target.value })}
//             placeholder="Description"
//             className="border p-3 rounded-lg md:col-span-2"
//             rows="4"
//           />

//           <div className="md:col-span-2">
//             <h3 className="font-bold text-primary mb-3">Car Features</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {[
//                 ['feature1', 'Feature 1'],
//                 ['feature2', 'Feature 2'],
//                 ['feature3', 'Feature 3'],
//                 ['feature4', 'Feature 4'],
//                 ['feature5', 'Feature 5'],
//               ].map(([name, placeholder]) => (
//                 <input
//                   key={name}
//                   name={name}
//                   value={car[name] || ''}
//                   onChange={(e) => setCar({ ...car, [name]: e.target.value })}
//                   placeholder={placeholder}
//                   className="border p-3 rounded-lg"
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               ['mainImage', 'Main Image'],
//               ['img1', 'Image 1'],
//               ['img2', 'Image 2'],
//               ['img3', 'Image 3'],
//             ].map(([fieldName, label]) => (
//               <div key={fieldName}>
//                 <label className="block font-semibold mb-2">{label}</label>

//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) =>
//                     handleImageFileChange(e, car, setCar, fieldName)
//                   }
//                   className="border p-3 rounded-lg w-full"
//                 />

//                 {car[fieldName] && (
//                   <img
//                     src={car[fieldName]}
//                     alt={label}
//                     className="mt-3 w-full h-32 object-contain bg-gray-100 rounded-lg"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             type="button"
//             onClick={() => {
//               setEditingCar(null);
//               setShowAddCar(false);
//             }}
//             className="px-5 py-3 border rounded-lg"
//           >
//             Cancel
//           </button>

//           <button className="px-5 py-3 bg-secondary text-white rounded-lg font-bold">
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );

//   const renderCars = () => (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="p-4 border-b flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-primary">Car Management</h2>
//           <p className="text-gray-600">Add, update, delete and view cars</p>
//         </div>

//         <button
//           onClick={() => setShowAddCar(true)}
//           className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2"
//         >
//           <FiPlus /> Add Car
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[800px]">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Brand</th>
//               <th className="p-3 text-left">Price</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {cars.map((car) => (
//               <tr key={car.id} className="border-b">
//                 <td className="p-3 font-semibold">{car.name}</td>
//                 <td className="p-3">{car.brand}</td>
//                 <td className="p-3 font-bold">₹{car.price}</td>

//                 <td className="p-3">
//                   {car.available || car.status ? 'Available' : 'Booked'}
//                 </td>

//                 <td className="p-3">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => setSelectedCar(car)}
//                       className="bg-green-500 text-white p-2 rounded-lg"
//                       title="View"
//                     >
//                       <FiEye />
//                     </button>

//                     <button
//                       onClick={() => openEditCarForm(car)}
//                       className="bg-blue-500 text-white p-2 rounded-lg"
//                       title="Edit"
//                     >
//                       <FiEdit />
//                     </button>

//                     <button
//                       onClick={() => handleDeleteCar(car.id)}
//                       className="bg-red-500 text-white p-2 rounded-lg"
//                       title="Delete"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderBookings = (onlyPending = false) => {
//     const list = onlyPending
//       ? bookings.filter((b) => b.status === 'PENDING')
//       : bookings;

//     return (
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-4 border-b">
//           <h2 className="text-2xl font-bold text-primary">
//             Booking Management
//           </h2>
//           <p className="text-gray-600">
//             Accept, reject, cancel and complete bookings
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1000px]">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">Booking ID</th>
//                 <th className="p-3 text-left">User</th>
//                 <th className="p-3 text-left">Car</th>
//                 <th className="p-3 text-left">Booking Status</th>
//                 <th className="p-3 text-left">Payment</th>
//                 <th className="p-3 text-left">Amount</th>
//                 <th className="p-3 text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {list.map((booking) => (
//                 <tr key={booking.id} className="border-b">
//                   <td className="p-3">{booking.id}</td>
//                   <td className="p-3">{booking.user}</td>
//                   <td className="p-3">{booking.car}</td>
//                   <td className="p-3">
//                     <select
//                       value={booking.status}
//                       onChange={(e) =>
//                         handleBookingStatus(booking.id, e.target.value)
//                       }
//                       className="border rounded-lg p-2"
//                     >
//                       <option>PENDING</option>
//                       <option>CONFIRMED</option>
//                       <option>REJECTED</option>
//                       <option>CANCELLED</option>
//                       <option>COMPLETED</option>
//                     </select>
//                   </td>
//                   <td className="p-3">
//                     <select
//                       value={booking.paymentStatus}
//                       onChange={(e) =>
//                         handlePaymentStatus(booking.id, e.target.value)
//                       }
//                       className="border rounded-lg p-2"
//                     >
//                       <option>Paid</option>
//                       <option>Pending</option>
//                       <option>Refunded</option>
//                     </select>
//                   </td>
//                   <td className="p-3 font-bold">₹{booking.total}</td>
//                   <td className="p-3">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() =>
//                           handleBookingStatus(booking.id, 'CONFIRMED')
//                         }
//                         className="bg-green-500 text-white p-2 rounded-lg"
//                       >
//                         <FiCheck />
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleBookingStatus(booking.id, 'REJECTED')
//                         }
//                         className="bg-red-500 text-white p-2 rounded-lg"
//                       >
//                         <FiX />
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleBookingStatus(booking.id, 'CANCELLED')
//                         }
//                         className="bg-gray-500 text-white p-2 rounded-lg"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const renderUsers = () => (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="p-4 border-b">
//         <h2 className="text-2xl font-bold text-primary">User Management</h2>
//         <p className="text-gray-600">View, block, unblock and delete users</p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[900px]">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">ID</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Phone</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="border-b">
//                 <td className="p-3">{user.id}</td>
//                 <td className="p-3 font-semibold">{user.name}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3">{user.phone}</td>
//                 <td className="p-3">
//                   {user.blocked ? 'Blocked' : 'Active'}
//                 </td>
//                 <td className="p-3">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => setSelectedUser(user)}
//                       className="bg-blue-500 text-white p-2 rounded-lg"
//                     >
//                       <FiEye />
//                     </button>
//                     <button
//                       onClick={() => handleBlockUser(user.id)}
//                       className="bg-yellow-500 text-white p-2 rounded-lg"
//                     >
//                       {user.blocked ? <FiUserCheck /> : <FiUserX />}
//                     </button>
//                     <button
//                       onClick={() => handleDeleteUser(user.id)}
//                       className="bg-red-500 text-white p-2 rounded-lg"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderDocuments = () => (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="p-4 border-b">
//         <h2 className="text-2xl font-bold text-primary">
//           Document Verification
//         </h2>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[950px]">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">User</th>
//               <th className="p-3 text-left">Driving License</th>
//               <th className="p-3 text-left">Aadhaar Card</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Reason</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="border-b">
//                 <td className="p-3 font-semibold">{user.name}</td>
//                 <td className="p-3">
//                   <button className="text-blue-600 underline">
//                     View License
//                   </button>
//                 </td>
//                 <td className="p-3">
//                   <button className="text-blue-600 underline">
//                     View Aadhaar
//                   </button>
//                 </td>
//                 <td className="p-3">{user.documentStatus}</td>
//                 <td className="p-3">{user.rejectReason || '-'}</td>
//                 <td className="p-3">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => approveDocument(user.id)}
//                       className="bg-green-500 text-white px-3 py-2 rounded-lg"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => rejectDocument(user.id)}
//                       className="bg-red-500 text-white px-3 py-2 rounded-lg"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderRevenue = () => (
//     <div className="bg-white rounded-xl shadow-md p-6">
//       <h2 className="text-2xl font-bold text-primary mb-4">
//         Payment / Revenue
//       </h2>

//       <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
//         <p className="text-gray-600">Total Paid Booking Amount</p>
//         <h1 className="text-4xl font-bold text-secondary mt-2">
//           ₹{totalRevenue.toLocaleString('en-IN')}
//         </h1>
//       </div>

//       {renderBookings(false)}
//     </div>
//   );

//   const renderContent = () => {
//     if (activeSection === 'cars') return renderCars();
//     if (activeSection === 'users') return renderUsers();
//     if (activeSection === 'bookings') return renderBookings(false);
//     if (activeSection === 'pending') return renderBookings(true);
//     if (activeSection === 'documents') return renderDocuments();
//     if (activeSection === 'revenue') return renderRevenue();

//     return renderCars();
//   };

//   return (
//     <div className="min-h-screen bg-light py-8">
//       <div className="container-custom">
//         <div className="mb-8">
//           <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
//             Admin Dashboard
//           </h1>
//           <p className="text-gray-600">
//             Manage cars, users, bookings, documents and revenue
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           <div className="lg:col-span-1">
//             <div className="bg-white p-5 rounded-xl card-shadow lg:sticky lg:top-24">
//               <h3 className="text-xl font-bold text-primary mb-5">
//                 Dashboard
//               </h3>

//               <div className="space-y-4">
//                 {dashboardCards.map((card) => (
//                   <button
//                     key={card.key}
//                     onClick={() => setActiveSection(card.key)}
//                     className={`w-full text-left p-4 rounded-xl border transition ${
//                       activeSection === card.key
//                         ? 'border-secondary shadow-md'
//                         : 'border-gray-200 hover:border-secondary'
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-xl bg-red-100 text-secondary flex items-center justify-center text-2xl">
//                         {card.icon}
//                       </div>

//                       <div>
//                         <p className="text-sm text-gray-500">{card.title}</p>
//                         <h2 className="text-2xl font-bold text-primary">
//                           {card.value}
//                         </h2>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-3">{renderContent()}</div>
//         </div>
//       </div>

//       {showAddCar &&
//         renderCarForm(newCar, setNewCar, handleAddCar, 'Add Car')}

//       {editingCar &&
//         renderCarForm(editingCar, setEditingCar, handleUpdateCar, 'Update Car')}

//       {selectedCar && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-5">
//               <h2 className="text-2xl font-bold text-primary">
//                 Car Details
//               </h2>

//               <span
//                 className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                   selectedCar.available || selectedCar.status
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-red-100 text-red-700'
//                 }`}
//               >
//                 {selectedCar.available || selectedCar.status
//                   ? 'Available'
//                   : 'Booked'}
//               </span>
//             </div>

//             <div className="w-full flex justify-center mb-5">
//               <img
//                 src={selectedCar.image || selectedCar.mainImage}
//                 alt={selectedCar.name}
//                 className="rounded-xl shadow-lg max-h-[400px] w-auto object-contain"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <p><b>ID:</b> {selectedCar.id}</p>
//               <p><b>Name:</b> {selectedCar.name}</p>
//               <p><b>Brand:</b> {selectedCar.brand}</p>
//               <p><b>Price:</b> ₹{selectedCar.price}</p>
//               <p><b>Fuel Type:</b> {selectedCar.fuelType}</p>
//               <p><b>Transmission:</b> {selectedCar.transmition}</p>
//               <p><b>Seating:</b> {selectedCar.seating}</p>
//               <p><b>Rating:</b> {selectedCar.rating}</p>
//               <p><b>Reviews:</b> {selectedCar.reviews}</p>
//             </div>

//             <div className="mt-4">
//               <p><b>Description:</b></p>
//               <p className="text-gray-600">{selectedCar.description}</p>
//             </div>

//             <div className="mt-4">
//               <p className="font-bold mb-2">Features:</p>

//               {selectedCar.features && selectedCar.features.length > 0 ? (
//                 <ul className="list-disc pl-6 text-gray-700">
//                   {selectedCar.features.map((feature, index) => (
//                     <li key={index}>{feature}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500">No features available</p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
//               {[selectedCar.img1, selectedCar.img2, selectedCar.img3]
//                 .filter(Boolean)
//                 .map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt={`car-${index}`}
//                     className="w-full h-32 object-contain bg-gray-100 rounded-lg"
//                   />
//                 ))}
//             </div>

//             <button
//               onClick={() => setSelectedCar(null)}
//               className="mt-5 w-full bg-secondary text-white py-3 rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md">
//             <h2 className="text-2xl font-bold text-primary mb-4">
//               User Details
//             </h2>

//             <p><b>Name:</b> {selectedUser.name}</p>
//             <p><b>Email:</b> {selectedUser.email}</p>
//             <p><b>Phone:</b> {selectedUser.phone}</p>
//             <p><b>Status:</b> {selectedUser.blocked ? 'Blocked' : 'Active'}</p>
//             <p><b>Documents:</b> {selectedUser.documentStatus}</p>

//             <button
//               onClick={() => setSelectedUser(null)}
//               className="mt-5 w-full bg-secondary text-white py-3 rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cars;