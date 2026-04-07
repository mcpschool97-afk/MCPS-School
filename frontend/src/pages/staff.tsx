import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Staff() {
  const [selectedDept, setSelectedDept] = useState('management');

  const staff = {
    management: {
      title: 'School Management',
      members: [
        {
          name: 'Dr. Rajesh Kumar',
          position: 'Principal',
          qualification: 'M.Sc, B.Ed, Ph.D',
          experience: '20+ years',
          icon: '👨‍💼',
        },
        {
          name: 'Mrs. Priya Sharma',
          position: 'Vice Principal',
          qualification: 'M.A, B.Ed',
          experience: '15+ years',
          icon: '👩‍💼',
        },
        {
          name: 'Mr. Amit Patel',
          position: 'Academic Director',
          qualification: 'B.Tech, M.Ed',
          experience: '12+ years',
          icon: '👨‍🏫',
        },
      ],
    },
    faculty: {
      title: 'Teaching Faculty',
      members: [
        {
          name: 'Dr. Neha Singh',
          position: 'Head, Science Department',
          qualification: 'M.Sc, B.Ed, Ph.D',
          experience: '12+ years',
          icon: '👩‍🔬',
        },
        {
          name: 'Mr. Vikram Gupta',
          position: 'Head, Mathematics Department',
          qualification: 'M.Sc, B.Ed',
          experience: '10+ years',
          icon: '👨‍🏫',
        },
        {
          name: 'Mrs. Anjali Verma',
          position: 'Head, English Department',
          qualification: 'M.A, B.Ed',
          experience: '8+ years',
          icon: '👩‍🏫',
        },
      ],
    },
    support: {
      title: 'Support Staff',
      members: [
        {
          name: 'Mr. Ravi Kumar',
          position: 'Office Manager',
          qualification: 'B.Com',
          experience: '7+ years',
          icon: '👨‍💼',
        },
        {
          name: 'Ms. Kavya Reddy',
          position: 'Librarian',
          qualification: 'M.Lib Sc',
          experience: '5+ years',
          icon: '👩‍💼',
        },
        {
          name: 'Mr. Suresh',
          position: 'Lab Technician',
          qualification: 'Diploma',
          experience: '6+ years',
          icon: '👨‍🔧',
        },
      ],
    },
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
            <p className="text-lg text-blue-100">
              Dedicated professionals committed to excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Staff Directory */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Department Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {Object.entries(staff).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedDept(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedDept === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {value.title.split(',')[0].trim()}
              </button>
            ))}
          </div>

          {/* Staff Cards */}
          <motion.div
            key={selectedDept}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {staff[selectedDept as keyof typeof staff].title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {staff[selectedDept as keyof typeof staff].members.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-6xl mb-4">{member.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {member.position}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Qualification:</span> {member.qualification}
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span> {member.experience}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-blue-100 mb-6">
              We're always looking for talented educators and staff members
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              Explore Careers
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
