import React from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaBullseye, FaHeart, FaGraduationCap } from 'react-icons/fa';

export default function About() {
  const values = [
    {
      icon: <FaBullseye className="w-6 h-6" />,
      title: 'Excellence',
      description: 'Pursuing excellence in every endeavor',
    },
    {
      icon: <FaHeart className="w-6 h-6" />,
      title: 'Integrity',
      description: 'Building character through honesty and ethics',
    },
    {
      icon: <FaGraduationCap className="w-6 h-6" />,
      title: 'Innovation',
      description: 'Embracing modern teaching methods',
    },
    {
      icon: <FaHistory className="w-6 h-6" />,
      title: 'Tradition',
      description: 'Respecting our heritage and values',
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-blue-100">
              Learn more about Meridian Creative & Progressive School and our mission
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Meridian Creative & Progressive School is dedicated to providing quality education that shapes young minds and prepares them for future success. We believe in fostering an environment where every student can develop intellectually, socially, and emotionally.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to create responsible citizens who contribute positively to society through academic excellence, moral values, and holistic development.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To be a leading CBSE pattern school recognized for excellence in academics, sports, and character development. We envision a school where innovation meets tradition, and students are empowered to achieve their full potential.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We strive to create a global perspective in our students while maintaining strong values and cultural roots.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 flex justify-center mb-4 text-4xl">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Journey</h2>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded in 2010, Meridian Creative & Progressive School has grown into one of the most respected CBSE pattern institutions in the region. Over the years, we have maintained our commitment to academic excellence while embracing modern educational practices.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our state-of-the-art facilities, dedicated faculty, and holistic approach to education have helped us produce hundreds of successful alumni who are making their mark in various fields.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, Meridian Creative & Progressive School stands as a beacon of educational excellence, continuously evolving to meet the needs of 21st-century learners.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
