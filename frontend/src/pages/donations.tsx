import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaQrcode, FaUniversity, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Donations() {
  const donationMethodsRef = useRef<HTMLElement>(null);

  const handleStartDonating = () => {
    donationMethodsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Mission</h1>
            <p className="text-lg text-red-100">
              Help us continue providing quality education to underprivileged children
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Your Donation Matters</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Meridian Creative & Progressive School is dedicated to providing quality education to children from economically disadvantged backgrounds. As an NGO-supported institution, we believe that every child deserves access to world-class education regardless of their socioeconomic status.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your generous donation helps us continue our mission by supporting:
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📚', title: 'Scholarships', desc: 'Support students in need' },
              { icon: '🏫', title: 'Infrastructure', desc: 'Build better facilities' },
              { icon: '👨‍🏫', title: 'Teacher Training', desc: 'Enhance teaching quality' },
              { icon: '💻', title: 'Technology', desc: 'Digital learning tools' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl text-center"
              >
                <div className="text-5xl mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section ref={donationMethodsRef} className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ways to Donate</h2>
            <p className="text-gray-600">Choose the method that's most convenient for you</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center"
            >
              <div className="text-5xl text-orange-600 mb-6">
                <FaQrcode />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Scan & Donate</h3>
              <p className="text-gray-600 text-center mb-8">
                Scan the QR code below using your phone's camera or UPI app to make an instant donation.
              </p>
              <div className="bg-white border-4 border-orange-200 rounded-2xl p-6 w-64 h-64 flex items-center justify-center">
                <img
                  src="/donations/qr.jpeg"
                  alt="Donation QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 mt-6">Secure and instant UPI payment</p>
            </motion.div>

            {/* Bank Transfer Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="text-5xl text-orange-600 mb-6">
                <FaUniversity />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Bank Transfer</h3>
              <p className="text-gray-600 mb-8">
                Transfer your donation directly to our school's bank account for larger contributions.
              </p>

              <div className="bg-orange-50 rounded-2xl p-6 space-y-4 mb-8">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Bank Name</p>
                  <p className="text-lg text-gray-900 font-bold">HDFC Bank</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Account Number</p>
                  <p className="text-lg text-gray-900 font-bold">50100XXXXXXXX123</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">IFSC Code</p>
                  <p className="text-lg text-gray-900 font-bold">HDFC0000001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Account Holder</p>
                  <p className="text-lg text-gray-900 font-bold">Meridian Creative & Progressive School NGO</p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-900 mb-4">For More Information</h4>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-orange-600" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-orange-600" />
                  <span>donations@meridianprogressive.school</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Impact</h2>
            <p className="text-gray-600">See how donations create lasting change</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { amount: '₹500', impact: 'Provides 1 month of meals for a student' },
              { amount: '₹2000', impact: 'Covers textbooks for 1 semester' },
              { amount: '₹5000', impact: 'Provides computer training for 5 students' },
              { amount: '₹10000', impact: 'Sponsors full infrastructure upgrade for classroom' },
              { amount: '₹25000', impact: 'Full scholarship for 1 student for 1 year' },
              { amount: '₹1,00,000', impact: 'Funds library setup or sports equipment' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-6 text-center"
              >
                <p className="text-3xl font-bold text-orange-600 mb-2">{item.amount}</p>
                <p className="text-gray-700">{item.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl md:text-6xl mb-6">
              <FaHeart />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Make a Difference Today</h2>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Every rupee you donate goes directly towards providing quality education to children who need it most. Together, we can create a brighter future.
            </p>
            <button onClick={handleStartDonating} className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
              Start Donating
            </button>
          </motion.div>
        </div>
      </section>

      {/* Tax Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Tax Benefits:</span> Meridian Creative & Progressive School is a registered NGO under Section 80G of the Income Tax Act. Your donations are tax-deductible.
          </p>
        </div>
      </section>
    </div>
  );
}
