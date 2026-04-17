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
              Welcome to Meridian Creative and Progressive School (MCPS)—a place where learning meets creativity and excellence.

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
                “Innovating Education and Inspiring Lives” is not just our slogan, but the foundation of everything we do. At MCPS, we are committed to providing quality education under the CBSE curriculum, focusing on the overall development of every child.

We believe education goes beyond textbooks—it shapes character, builds confidence, and nurtures a progressive mindset. Our school provides a safe, inspiring, and student-friendly environment where students are encouraged to think independently, explore their talents, and achieve their full potential.

With a team of dedicated and experienced educators, we ensure personalized attention and guidance for every learner. Our balanced approach integrates academics with co-curricular activities, sports, and value-based education.

From Nursery to Class 10, our programs are thoughtfully designed to develop intellectual growth, creativity, discipline, and leadership qualities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At MCPS, we strive to nurture responsible, confident, and future-ready individuals who will make a positive impact on society.

Meridian Creative and Progressive School — Innovating Education and Inspiring Lives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Meridian Creative and Progressive School (MCPS), our vision is to create a dynamic and inclusive learning environment where every student is empowered to achieve excellence in academics and beyond.

We envision nurturing young minds to become confident, creative, and responsible individuals who are prepared to face the challenges of a rapidly changing world. Through innovation in education and a strong foundation of values, we aim to develop future leaders who think critically, act ethically, and contribute positively to society.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Guided by our belief in “Innovating Education and Inspiring Lives,” we strive to transform learning into a meaningful and lifelong journey.
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
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
                <div className="overflow-hidden rounded-3xl shadow-xl border border-white/70">
                  <img
                    src="/founders.jpg"
                    alt="Founders of Meridian Creative & Progressive School"
                    className="w-full h-full min-h-[320px] object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    The foundation of this legacy was laid in 1999 with the vision and compassion of the Late Adv. Shatrughan Chauhan and the Late Mrs. Krishna Chauhan, who believed that education is a fundamental right for every child, regardless of ability. At a time when support for specially abled students was limited, they took the first step toward inclusive education by establishing a school dedicated to specially abled students. That institution continues to stand as a beacon of inclusion and care to this day.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This legacy was carried forward with remarkable dedication by the Late Dr. Nirmala Chauhan, our Founding Mother, whose passion and commitment became the guiding force behind this enduring mission. She played a pivotal role in nurturing the institution and strengthening the ideals of inclusive education. Her belief in empathy, strength, and equal opportunity transformed countless lives and built a foundation rooted in care and excellence.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Today, Meridian emerges as a new chapter in this continuing legacy—built on the same values and guided by a new vision for the future.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Over the years, this legacy has grown into a source of hope, learning, and empowerment for students and families alike. Each step forward stands as a tribute to the values that shaped its foundation and the enduring spirit of the Founding Mother.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    As Meridian looks to the future, it carries this legacy forward with renewed purpose—creating a world where every child is valued, supported, and given the opportunity to grow, thrive and achieve their goals.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
