
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHome,
  FiInfo,
  FiMail,
} from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { getUserByEmail } from '../services/carService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const email = localStorage.getItem('email');

      if (!email) return;

      const data = await getUserByEmail(email);
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // const handleLogout = () => {
  //   logout();

  //   localStorage.removeItem('user');
  //   localStorage.removeItem('id');
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('email');
  //   localStorage.removeItem('password');
  //   localStorage.removeItem('role');
  //   localStorage.removeItem('avatar');
  //   localStorage.removeItem('firstName');
  //   localStorage.removeItem('lastName');
  //   localStorage.removeItem('phone');

  //   navigate('/');
  //   setIsOpen(false);
  // };

  const handleLogout = () => {

  // Clear all local storage
  localStorage.clear();

  // Clear auth context
  logout();

  // Close mobile menu
  setIsOpen(false);

  // Redirect to home page
  navigate("/", { replace: true });
};

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },

    isAdmin
      ? { name: 'Administrator', path: '/administrator', icon: MdDirectionsCar }
      : { name: 'Cars', path: '/cars', icon: MdDirectionsCar },

    { name: 'About', path: '/about', icon: FiInfo },
    { name: 'Contact', path: '/contact', icon: FiMail },
  ];

  const profilePath = '/dashboard';

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <MdDirectionsCar className="text-2xl" />
            </div>

            <span className="text-2xl font-bold hidden sm:inline gradient-text">
              SelfDrive Junction
            </span>
          </Link>

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

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={profilePath}
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                >
                  <FiUser className="text-xl" />

                  <span className="font-medium">
                    {isAdmin
                      ? 'Admin'
                      : profileData?.firstName || user.firstName || 'User'}
                  </span>
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

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl hover:text-secondary transition-colors"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

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
                      to={profilePath}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 hover:text-secondary transition-colors"
                    >
                      <FiUser />
                      {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
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
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn-outline w-full text-center"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary w-full text-center"
                    >
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