import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '#' },
      { name: 'Blog', path: '#' },
      { name: 'Press', path: '#' },
    ],
    Services: [
      { name: 'Car Rental', path: '/cars' },
      { name: 'Corporate Packages', path: '#' },
      { name: 'Airport Transfer', path: '#' },
      { name: 'Long-term Rental', path: '#' },
    ],
    Support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Terms & Conditions', path: '#' },
      { name: 'Privacy Policy', path: '#' },
    ],
    Legal: [
      { name: 'Insurance', path: '#' },
      { name: 'Cancellation Policy', path: '#' },
      { name: 'Damage Policy', path: '#' },
      { name: 'Refund Policy', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, url: '#' },
    { icon: FiTwitter, url: '#' },
    { icon: FiInstagram, url: '#' },
    { icon: FiLinkedin, url: '#' },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <MdDirectionsCar className="text-2xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">SelfDrive Junction</span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium car rental experience with luxury vehicles and exceptional service.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-bold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-gray-700">
          <div className="flex items-start gap-4">
            <FiPhone className="text-secondary text-2xl mt-1" />
            <div>
              <h5 className="font-semibold mb-1">Phone</h5>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FiMail className="text-secondary text-2xl mt-1" />
            <div>
              <h5 className="font-semibold mb-1">Email</h5>
              <p className="text-gray-400">support@selfdrivejunction.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FiMapPin className="text-secondary text-2xl mt-1" />
            <div>
              <h5 className="font-semibold mb-1">Address</h5>
              <p className="text-gray-400">123 Luxury Ave, Premium City, PC 12345</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black bg-opacity-50 py-6">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SelfDrive Junction. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="#" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-secondary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
