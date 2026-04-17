import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Contact() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-blue-100">
              We'd love to hear from you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center"
            >
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">
                Balrampur, Post Patkhauli<br />
                Azamgarh<br />
                Near Maa Murati College
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center"
            >
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                <FaPhone />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600 text-sm">
                +91 9076697973
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center"
            >
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                <FaEnvelope />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                mcpschool97@gmail.com
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center"
            >
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                <FaClock />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Hours</h3>
              <p className="text-gray-600 text-sm">
                Mon - Fri: 8:00 AM - 4:00 PM<br />
                Saturday: 9:00 AM - 1:00 PM<br />
                Sunday: Closed
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Find Us On The Map
          </h2>
          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.8274649999996!2d83.18738!3d26.05469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39954d8c8c8c8c8d%3A0x1234567890abcdef!2sBalrampur%2C%20Patkhauli%2C%20Azamgarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1650000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://maps.app.goo.gl/7B7rE81XKKmyy9jJ7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Full Size Map
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
