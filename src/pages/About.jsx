import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import HeroBanner from '../components/HeroBanner';

const About = () => {
  const stats = [
    { icon: FiUsers, label: 'Happy Customers', value: '50K+' },
    { icon: FiTrendingUp, label: 'Bookings', value: '100K+' },
    { icon: FiAward, label: 'Years Experience', value: '15+' },
    { icon: FiCheck, label: 'Fleet Size', value: '500+' },
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service',
    },
    {
      title: 'Reliability',
      description: 'Our customers can count on us for dependable service',
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate to improve customer experience',
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and honesty',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container-custom py-8">
        <HeroBanner
          title="About SelfDrive Junction"
          subtitle="Premium car rental service with a passion for excellence"
          image="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=600&fit=crop"
        />
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2026, SelfDrive Junction has been a leader in premium car rental services. 
                What started as a small venture has grown into a trusted name in the industry.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that every journey deserves to be special. Our commitment to providing 
                luxury vehicles and exceptional service has made us the preferred choice for 
                discerning travelers worldwide.
              </p>
              <p className="text-gray-600">
                Today, we operate a fleet of over 500 premium vehicles across multiple locations, 
                serving thousands of satisfied customers every year.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="h-96 rounded-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1494976866556-6812c9d1c72e?w=600&h=400&fit=crop"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <stat.icon className="text-5xl mx-auto mb-4 text-secondary" />
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl card-shadow text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <motion.div
                key={member}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl overflow-hidden card-shadow text-center"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=member${member}`}
                  alt={`Team Member ${member}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">Team Member {member}</h3>
                  <p className="text-secondary font-semibold mb-2">Position</p>
                  <p className="text-gray-600 text-sm">
                    Dedicated professional with years of experience
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Luxury?</h2>
          <p className="text-lg mb-8 text-gray-200">
            Join thousands of satisfied customers and book your premium car today
          </p>
          <a href="/cars" className="inline-block btn-primary">
            Browse Our Fleet
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
