import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList, FaFileAlt, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import AdmissionFormModal from '../components/AdmissionFormModal';

export default function Admissions() {
  const [selectedClass, setSelectedClass] = useState<'primary' | 'upperPrimary' | 'secondary'>('primary');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const admissionInfo = {
    primary: {
      classRange: 'Classes I - III',
      ageRange: '5 - 9 years',
      capacity: '40 students per class',
      testPattern: 'Assessment in Mathematics, English & General Awareness',
      documents: ['Birth Certificate', 'Transfer Certificate', 'Previous Progress Reports', 'Health Certificate', 'Vaccination Certificate'],
    },
    upperPrimary: {
      classRange: 'Classes IV - VI',
      ageRange: '9 - 12 years',
      capacity: '42 students per class',
      testPattern: 'Entrance test in English, Mathematics & Science',
      documents: ['Birth Certificate', 'Transfer Certificate', 'Last Mark Sheet', 'Health Certificate', 'Character Certificate'],
    },
    secondary: {
      classRange: 'Classes VII - IX',
      ageRange: '12 - 15 years',
      capacity: '45 students per class',
      testPattern: 'Comprehensive entrance test covering all subjects',
      documents: ['Birth Certificate', 'Transfer Certificate', 'Last Mark Sheet', 'Health Certificate', 'Character Certificate', 'Migration Certificate'],
    },
  };

  const timeline = [
    { period: 'November - December', activity: 'Registration Opens' },
    { period: 'January - February', activity: 'Entrance Exam' },
    { period: 'March', activity: 'Result Declaration' },
    { period: 'April', activity: 'Admission Process' },
    { period: 'May - June', activity: 'New Session Begins' },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions</h1>
            <p className="text-lg text-blue-100">
              Join our community - Classes I to IX
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admission Information */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Class Selection Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {Object.entries(admissionInfo).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedClass(key as 'primary' | 'upperPrimary' | 'secondary')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedClass === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {value.classRange}
              </button>
            ))}
          </div>

          {/* Admission Details */}
          <motion.div
            key={selectedClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left Column - Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                {admissionInfo[selectedClass].classRange}
              </h2>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-50 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Age Range</h3>
                  <p className="text-blue-600 text-lg font-semibold">
                    {admissionInfo[selectedClass].ageRange}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Class Capacity</h3>
                  <p className="text-green-600 text-lg font-semibold">
                    {admissionInfo[selectedClass].capacity}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-purple-50 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Entrance Test</h3>
                  <p className="text-purple-600">
                    {admissionInfo[selectedClass].testPattern}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Required Documents */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaFileAlt className="text-blue-600" /> Required Documents
              </h2>
              <div className="space-y-3">
                {admissionInfo[selectedClass].documents.map((doc, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (idx + 1) }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"
                  >
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-gray-700 font-medium">{doc}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsFormModalOpen(true)}
                className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admission Timeline */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Admission Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <FaCalendarAlt className="text-blue-600 text-3xl mx-auto mb-4" />
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    {item.period}
                  </p>
                  <p className="text-gray-800 font-bold">{item.activity}</p>
                </div>
                {idx < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-blue-600"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is the admission fee?',
                a: 'Admission fees vary by class. Please contact our admissions office for detailed fee structure.',
              },
              {
                q: 'Do you offer scholarships?',
                a: 'Yes, we offer merit-based and need-based scholarships. Check with the admissions team for eligibility criteria.',
              },
              {
                q: 'What is the school bus facility?',
                a: 'We provide GPS-enabled school buses covering major routes at an additional fee.',
              },
              {
                q: 'Is online admission available?',
                a: 'Online registration is available. Final admission processes require in-person verification.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg"
              >
                <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Form Modal */}
      <AdmissionFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />
    </div>
  );
}
