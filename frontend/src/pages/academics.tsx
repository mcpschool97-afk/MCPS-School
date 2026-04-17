import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaChalkboard, FaFlask } from 'react-icons/fa';

export default function Academics() {
  const [selectedClass, setSelectedClass] = useState('primary');

  const programs = {
    preprimary: {
      name: 'Pre-Primary (Nursery & KG)',
      description: 'Early childhood education focused on play-based learning, social development, and foundational skills.',
      subjects: ['Language Skills', 'Number Concepts', 'Art & Craft', 'Music & Rhymes', 'Physical Development', 'Social Studies'],
      features: ['Play-based learning', 'Storytelling sessions', 'Creative play', 'Social interaction activities'],
    },
    primary: {
      name: 'Primary Section (Classes I-V)',
      description: 'Comprehensive learning with emphasis on conceptual understanding, practical applications, and holistic development.',
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Physical Education', 'Art', 'Music'],
      features: ['Activity-based learning', 'Project-based assignments', 'Laboratory experiments', 'Regular assessments', 'Interactive teaching'],
    },
    upperPrimary: {
      name: 'Upper Primary (Classes VI-VIII)',
      description: 'A bridge to advanced learning with integrated science, mathematics, and language studies to build a strong foundation.',
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Life Skills'],
      features: ['Concept-based learning', 'Hands-on experiments', 'Collaborative projects', 'Technology integration', 'Value education'],
    },
    secondary: {
      name: 'Secondary Section (Classes IX-X)',
      description: 'Focused academic preparation for higher classes through rigorous concepts, exam readiness, and skill development.',
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Career Guidance'],
      features: ['Comprehensive revision', 'Competitive exam orientation', 'Advanced lab work', 'Critical thinking development', 'Mentorship support'],
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
            <p className="text-lg text-blue-100">
              CBSE pattern curriculum from Nursery to Class X with modern teaching methods
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Tabs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {Object.entries(programs).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedClass(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedClass === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {value.name.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Program Details */}
          <motion.div
            key={selectedClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {programs[selectedClass as keyof typeof programs].name}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {programs[selectedClass as keyof typeof programs].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Subjects */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBook className="text-blue-600" /> Subjects
                </h3>
                <ul className="space-y-2">
                  {programs[selectedClass as keyof typeof programs].subjects.map((subject, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFlask className="text-blue-600" /> Key Features
                </h3>
                <ul className="space-y-2">
                  {programs[selectedClass as keyof typeof programs].features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Co-Curricular Activities */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Co-Curricular Activities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Sports', 'Science Club', 'Literary Society', 'Art & Culture', 'Debate Club', 'Music & Dance'].map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl mb-4">
                  {idx === 0 && '⚽'}
                  {idx === 1 && '🔬'}
                  {idx === 2 && '📚'}
                  {idx === 3 && '🎨'}
                  {idx === 4 && '🎤'}
                  {idx === 5 && '🎵'}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{activity}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
