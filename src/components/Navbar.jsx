// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiInfo, FiMail } from 'react-icons/fi';
// import { MdDirectionsCar } from 'react-icons/md';
// import { useAuth } from '../context/AuthContext';
// import { motion } from 'framer-motion';
// import {getUserByEmail } from '../services/carService';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setIsOpen(false);
//   };

//   const navLinks = [
//     { name: 'Home', path: '/', icon: FiHome },
//     { name: 'Cars', path: '/cars', icon: MdDirectionsCar },
//     { name: 'About', path: '/about', icon: FiInfo },
//     { name: 'Contact', path: '/contact', icon: FiMail },
//   ];

//   return (
    // <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
    //   <div className="container-custom">
    //     <div className="flex justify-between items-center h-20">
    //       {/* Logo */}
    //       <Link to="/" className="flex items-center gap-2 group">
    //         <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
    //           <MdDirectionsCar className="text-2xl" />
    //         </div>
    //         <span className="text-2xl font-bold hidden sm:inline gradient-text">SelfDrive Junction</span>
    //       </Link>

    //       {/* Desktop Menu */}
    //       <div className="hidden md:flex items-center gap-8">
    //         {navLinks.map((link) => (
    //           <Link
    //             key={link.name}
    //             to={link.path}
    //             className="hover:text-secondary transition-colors duration-300 font-medium"
    //           >
    //             {link.name}
    //           </Link>
    //         ))}
    //       </div>

    //       {/* Auth Section */}
    //       <div className="hidden md:flex items-center gap-4">
    //         {user ? (
    //           <div className="flex items-center gap-4">
    //             <Link
    //               to="/dashboard"
    //               className="flex items-center gap-2 hover:text-secondary transition-colors"
    //             >
    //               <FiUser className="text-xl" />
    //               <span className="font-medium">{user.firstName}</span>
    //             </Link>
    //             <button
    //               onClick={handleLogout}
    //               className="btn-primary flex items-center gap-2"
    //             >
    //               <FiLogOut />
    //               Logout
    //             </button>
    //           </div>
    //         ) : (
    //           <div className="flex gap-3">
    //             <Link to="/login" className="btn-outline">
    //               Login
    //             </Link>
    //             <Link to="/register" className="btn-primary">
    //               Register
    //             </Link>
    //           </div>
    //         )}
    //       </div>

    //       {/* Mobile Menu Button */}
    //       <button
    //         onClick={() => setIsOpen(!isOpen)}
    //         className="md:hidden text-2xl hover:text-secondary transition-colors"
    //       >
    //         {isOpen ? <FiX /> : <FiMenu />}
    //       </button>
    //     </div>

    //     {/* Mobile Menu */}
    //     {isOpen && (
    //       <motion.div
    //         initial={{ opacity: 0, y: -20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         exit={{ opacity: 0, y: -20 }}
    //         className="md:hidden pb-6 border-t border-gray-700"
    //       >
    //         <div className="flex flex-col gap-4 mt-4">
    //           {navLinks.map((link) => (
    //             <Link
    //               key={link.name}
    //               to={link.path}
    //               onClick={() => setIsOpen(false)}
    //               className="hover:text-secondary transition-colors font-medium flex items-center gap-2"
    //             >
    //               <link.icon />
    //               {link.name}
    //             </Link>
    //           ))}
    //           <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
    //             {user ? (
    //               <>
    //                 <Link
    //                   to="/dashboard"
    //                   onClick={() => setIsOpen(false)}
    //                   className="flex items-center gap-2 hover:text-secondary transition-colors"
    //                 >
    //                   <FiUser />
    //                   Dashboard
    //                 </Link>
    //                 <button
    //                   onClick={handleLogout}
    //                   className="btn-primary w-full flex items-center justify-center gap-2"
    //                 >
    //                   <FiLogOut />
    //                   Logout
    //                 </button>
    //               </>
    //             ) : (
    //               <>
    //                 <Link to="/login" className="btn-outline w-full text-center">
    //                   Login
    //                 </Link>
    //                 <Link to="/register" className="btn-primary w-full text-center">
    //                   Register
    //                 </Link>
    //               </>
    //             )}
    //           </div>
    //         </div>
    //       </motion.div>
    //     )}
    //   </div>
    // </nav>
//   );
// };

// export default Navbar;
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiInfo, FiMail } from 'react-icons/fi';
// import { MdDirectionsCar } from 'react-icons/md';
// import { useAuth } from '../context/AuthContext';
// import { motion } from 'framer-motion';
// import {getUserByEmail } from '../services/carService';

// const [profileData, setProfileData] = useState(null);

// const fetchUserProfile = async () => {
//   try {
//     const email = localStorage.getItem("email");

//     if (!email) {
//       console.log("No email found in localStorage");
//       return;
//     }

//     const data = await getUserByEmail(email);

//     console.log("User Profile:", data);

//     setProfileData(data);

//     setEditData({
//       firstName: data?.firstName || "",
//       lastName: data?.lastName || "",
//       email: data?.email || "",
//       phone: data?.phone || ""
//     });

//   } catch (error) {
//     console.error("Error fetching profile:", error);
//   }
// };

// useEffect(() => {
  
//   fetchUserProfile();
// }, []);

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setIsOpen(false);
//   };

//   const navLinks = [
//     { name: 'Home', path: '/', icon: FiHome },
//     { name: 'Cars', path: '/cars', icon: MdDirectionsCar },
//     { name: 'About', path: '/about', icon: FiInfo },
//     { name: 'Contact', path: '/contact', icon: FiMail },
//   ];

//   return (
//     <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
//       <div className="container-custom">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 group">
//             <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//               <MdDirectionsCar className="text-2xl" />
//             </div>
//             <span className="text-2xl font-bold hidden sm:inline gradient-text">SelfDrive Junction</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className="hover:text-secondary transition-colors duration-300 font-medium"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* Auth Section */}
//           <div className="hidden md:flex items-center gap-4">
//             {user ? (
//               <div className="flex items-center gap-4">
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center gap-2 hover:text-secondary transition-colors"
//                 >
//                   <FiUser className="text-xl" />
//                   <span className="font-medium">{profileData.firstName}</span>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="btn-primary flex items-center gap-2"
//                 >
//                   <FiLogOut />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="flex gap-3">
//                 <Link to="/login" className="btn-outline">
//                   Login
//                 </Link>
//                 <Link to="/register" className="btn-primary">
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-2xl hover:text-secondary transition-colors"
//           >
//             {isOpen ? <FiX /> : <FiMenu />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="md:hidden pb-6 border-t border-gray-700"
//           >
//             <div className="flex flex-col gap-4 mt-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.name}
//                   to={link.path}
//                   onClick={() => setIsOpen(false)}
//                   className="hover:text-secondary transition-colors font-medium flex items-center gap-2"
//                 >
//                   <link.icon />
//                   {link.name}
//                 </Link>
//               ))}
//               <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
//                 {user ? (
//                   <>
//                     <Link
//                       to="/dashboard"
//                       onClick={() => setIsOpen(false)}
//                       className="flex items-center gap-2 hover:text-secondary transition-colors"
//                     >
//                       <FiUser />
//                       Dashboard
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="btn-primary w-full flex items-center justify-center gap-2"
//                     >
//                       <FiLogOut />
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link to="/login" className="btn-outline w-full text-center">
//                       Login
//                     </Link>
//                     <Link to="/register" className="btn-primary w-full text-center">
//                       Register
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiInfo, FiMail } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { getUserByEmail } from '../services/carService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  // const fetchUserProfile = async () => {
  //   try {
  //     const email = localStorage.getItem("email");

  //     if (!email) return;

  //     const data = await getUserByEmail(email);

  //     console.log("Profile Data:", data);

  //     setProfileData(data);

  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //   }
  // };

  const fetchUserProfile = async () => {
  try {
    const email = localStorage.getItem("email");

    console.log("Email:", email);

    if (!email) return;

    const data = await getUserByEmail(email);

    console.log("Profile Data:", data);

    setProfileData(data);

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
  const handleLogout = () => {
    logout();
    localStorage.removeItem("email");
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Cars', path: '/cars', icon: MdDirectionsCar },
    { name: 'About', path: '/about', icon: FiInfo },
    { name: 'Contact', path: '/contact', icon: FiMail },
  ];

  return (
    // <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
    //   <div className="container-custom">
    //     <div className="flex justify-between items-center h-20">

    //       {/* Logo */}
    //       <Link to="/" className="flex items-center gap-2">
    //         <MdDirectionsCar className="text-3xl" />
    //         <span className="text-2xl font-bold">
    //           SelfDrive Junction
    //         </span>
    //       </Link>

    //       {/* Desktop Menu */}
    //       <div className="hidden md:flex items-center gap-8">
    //         {navLinks.map((link) => (
    //           <Link
    //             key={link.name}
    //             to={link.path}
    //           >
    //             {link.name}
    //           </Link>
    //         ))}
    //       </div>

    //       {/* User Section */}
    //       <div className="hidden md:flex items-center gap-4">
    //         {user ? (
    //           <>
    //             <Link
    //               to="/dashboard"
    //               className="flex items-center gap-2"
    //             >
    //               <FiUser />
    //               <span>
    //                 {profileData?.firstName}
    //               </span>
    //             </Link>

    //             <button
    //               onClick={handleLogout}
    //               className="btn-primary flex items-center gap-2"
    //             >
    //               <FiLogOut />
    //               Logout
    //             </button>
    //           </>
    //         ) : (
    //           <>
    //             <Link to="/login" className="btn-outline">
    //               Login
    //             </Link>

    //             <Link to="/register" className="btn-primary">
    //               Register
    //             </Link>
    //           </>
    //         )}
    //       </div>

    //     </div>
    //   </div>
    // </nav>
//     <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
//   <div className="container-custom">
//     <div className="flex justify-between items-center h-20">

//       {/* Logo */}
//       <Link to="/" className="flex items-center gap-2">
//         <MdDirectionsCar className="text-3xl" />
//         <span className="text-lg md:text-2xl font-bold">
//           SelfDrive Junction
//         </span>
//       </Link>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex items-center gap-8">
//         {navLinks.map((link) => (
//           <Link
//             key={link.name}
//             to={link.path}
//             className="hover:text-secondary transition-colors"
//           >
//             {link.name}
//           </Link>
//         ))}
//       </div>

//       {/* Desktop User Section */}
//       <div className="hidden md:flex items-center gap-4">
//         {user ? (
//           <>
//             <Link
//               to="/dashboard"
//               className="flex items-center gap-2 hover:text-secondary"
//             >
//               <FiUser />
//               <span>{profileData?.firstName}</span>
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="btn-primary flex items-center gap-2"
//             >
//               <FiLogOut />
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="btn-outline">
//               Login
//             </Link>

//             <Link to="/register" className="btn-primary">
//               Register
//             </Link>
//           </>
//         )}
//       </div>

//       {/* Mobile Menu Button */}
//       <div className="md:hidden">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="text-2xl"
//         >
//           {isOpen ? <FiX /> : <FiMenu />}
//         </button>
//       </div>

//     </div>

//     {/* Mobile Menu */}
//     {isOpen && (
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="md:hidden py-4 border-t border-gray-700"
//       >
//         <div className="flex flex-col gap-4">

//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.path}
//               onClick={() => setIsOpen(false)}
//               className="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 rounded"
//             >
//               <link.icon />
//               {link.name}
//             </Link>
//           ))}

//           <hr className="border-gray-600" />

//           {user ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 onClick={() => setIsOpen(false)}
//                 className="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 rounded"
//               >
//                 <FiUser />
//                 {profileData?.firstName}
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 rounded text-left"
//               >
//                 <FiLogOut />
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 onClick={() => setIsOpen(false)}
//                 className="px-2 py-2 hover:bg-gray-700 rounded"
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/register"
//                 onClick={() => setIsOpen(false)}
//                 className="px-2 py-2 hover:bg-gray-700 rounded"
//               >
//                 Register
//               </Link>
//             </>
//           )}

//         </div>
//       </motion.div>
//     )}
//   </div>
// </nav>
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <MdDirectionsCar className="text-2xl" />
            </div>
            <span className="text-2xl font-bold hidden sm:inline gradient-text">SelfDrive Junction</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-secondary transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                >
                  <FiUser className="text-xl" />
                  <span className="font-medium">{user.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl hover:text-secondary transition-colors"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-6 border-t border-gray-700"
          >
            <div className="flex flex-col gap-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-secondary transition-colors font-medium flex items-center gap-2"
                >
                  <link.icon />
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 hover:text-secondary transition-colors"
                    >
                      <FiUser />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-outline w-full text-center">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary w-full text-center">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
