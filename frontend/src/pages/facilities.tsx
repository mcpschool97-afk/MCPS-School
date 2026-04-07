import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaFlask, FaLaptop, FaSwimmer, FaUtensils, FaAmbulance, FaBus, FaTree } from 'react-icons/fa';

export default function Facilities() {
  const facilities = [
    {
      icon: <FaBook className="w-12 h-12" />,
      title: 'Central Library',
      description: 'Well-stocked library with over 15,000 books and digital resources for research and learning.',
    },
    {
      icon: <FaFlask className="w-12 h-12" />,
      title: 'Science Laboratories',
      description: 'Fully equipped labs for Physics, Chemistry, and Biology with modern instruments and safety measures.',
    },
    {
      icon: <FaLaptop className="w-12 h-12" />,
      title: 'Computer Labs',
      description: 'Advanced computer facilities with latest hardware and software for IT and programming education.',
    },
    {
      icon: <FaSwimmer className="w-12 h-12" />,
      title: 'Sports Complex',
      description: 'Olympic-size swimming pool, basketball courts, badminton halls, and outdoor sports facilities.',
    },
    {
      icon: <FaUtensils className="w-12 h-12" />,
      title: 'Cafeteria',
      description: 'Hygienic cafeteria serving nutritious meals prepared by professional chefs.',
    },
    {
      icon: <FaAmbulance className="w-12 h-12" />,
      title: 'Medical Centre',
      description: 'On-campus medical facility with qualified nurses and doctors for student health and safety.',
    },
    {
      icon: <FaBus className="w-12 h-12" />,
      title: 'Transportation',
      description: 'GPS-enabled school buses covering major routes with trained and courteous drivers.',
    },
    {
      icon: <FaTree className="w-12 h-12" />,
      title: 'Green Campus',
      description: 'Eco-friendly campus with lush gardens and environmental conservation initiatives.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Facilities</h1>
            <p className="text-lg text-blue-100">
              State-of-the-art infrastructure for holistic development
            </p>
          </motion.div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="text-blue-600 hover:text-blue-700 flex justify-center mb-4">
                  {facility.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {facility.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {facility.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Highlights */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Infrastructure Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Building</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ 50+ classrooms with smart boards</li>
                <li>✓ Separate blocks for each section</li>
                <li>✓ Accessibility for students with disabilities</li>
                <li>✓ Advanced security surveillance system</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Technology</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ WiFi enabled campus</li>
                <li>✓ Digital classrooms with projectors</li>
                <li>✓ Online learning management system</li>
                <li>✓ Virtual lab simulations</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Safety</h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ CCTV surveillance 24/7</li>
                <li>✓ Fire detection system</li>
                <li>✓ First aid equipped rooms</li>
                <li>✓ Regular safety drills</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
