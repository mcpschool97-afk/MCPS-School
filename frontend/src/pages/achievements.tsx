import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward, FaUser } from 'react-icons/fa';

export default function Achievements() {
  const achievements = [
    {
      icon: <FaTrophy className="w-8 h-8" />,
      title: 'Academic Excellence Award',
      year: 2025,
      description: '15 students scored 95%+ in board exams',
    },
    {
      icon: <FaMedal className="w-8 h-8" />,
      title: 'National Science Olympiad',
      year: 2026,
      description: 'Silver medal at National Science Olympiad by Rahul Sharma',
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: 'Sports Championship',
      year: 2025,
      description: 'Won overall trophy in inter-school sports meet',
    },
    {
      icon: <FaTrophy className="w-8 h-8" />,
      title: 'Debate Competition',
      year: 2025,
      description: 'Won state level debate competition',
    },
    {
      icon: <FaMedal className="w-8 h-8" />,
      title: 'STEM Innovation Award',
      year: 2024,
      description: 'Recognized for innovation in STEM education',
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: 'Best School Award',
      year: 2024,
      description: 'Awarded as Best CBSE School in the region',
    },
  ];

  const studentAchievements = [
    {
      name: 'Priya Sharma',
      achievement: 'IIT-JEE Qualified',
      year: 2025,
      image: '🎓',
    },
    {
      name: 'Arjun Patel',
      achievement: 'National Science Talent Scholar',
      year: 2025,
      image: '🏆',
    },
    {
      name: 'Ananya Singh',
      achievement: 'All India Rank 5 - NEET',
      year: 2024,
      image: '⭐',
    },
    {
      name: 'Rohan Kumar',
      achievement: 'National Football Player',
      year: 2024,
      image: '⚽',
    },
    {
      name: 'Neha Gupta',
      achievement: 'Young Entrepreneur Award',
      year: 2024,
      image: '💼',
    },
    {
      name: 'Vedant Singh',
      achievement: 'International Math Olympiad Bronze',
      year: 2023,
      image: '🥉',
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Achievements</h1>
            <p className="text-lg text-blue-100">
              Excellence in academics, sports, and beyond
            </p>
          </motion.div>
        </div>
      </section>

      {/* School Achievements */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            School Milestones
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl text-yellow-600 flex justify-center mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <span className="inline-block bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {achievement.year}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Achievements */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Star Students
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentAchievements.map((student, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="text-6xl text-center mb-4">{student.image}</div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                  {student.name}
                </h3>
                <p className="text-blue-600 font-semibold text-center mb-2">
                  {student.achievement}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  {student.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            By The Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center"
            >
              <div className="text-5xl font-bold mb-2">95%</div>
              <p className="text-lg">Pass Percentage</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-lg text-center"
            >
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-lg">Alumni Success Stories</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-8 rounded-lg text-center"
            >
              <div className="text-5xl font-bold mb-2">150+</div>
              <p className="text-lg">Awards Won</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-red-600 to-red-700 text-white p-8 rounded-lg text-center"
            >
              <div className="text-5xl font-bold mb-2">25+</div>
              <p className="text-lg">Years of Excellence</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
