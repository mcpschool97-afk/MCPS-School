// frontend/src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaAward, FaBook, FaTrophy, FaUsers, FaTimes } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [selectedLeader, setSelectedLeader] = useState<any>(null);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);

  const handleExploreMore = () => {
    router.push('/gallery');
  };

  const leadership = [
    {
      id: 1,
      name: 'M.S Manohar',
      position: 'DIRECTOR',
      photo: '/director.jpeg',
      shortMessage: 'With a vision to provide the best educational experience...',
      fullMessage: 'With a vision to provide the best educational experience, our institution is dedicated to creating an environment where learning flourishes. As Director, I am proud of our achievements and the standard of education we provide. We believe in creating a strong foundation for our students both in academics and in their personal values. Our team of dedicated educators works towards the overall development of each child. The institution is a quality conscious organization with a mission to provide the best education and resources to our beloved children to make them responsible citizens of the country.',
      alignment: 'left'
    },
    {
      id: 2,
      name: 'Akarsh Krishna',
      position: 'ASSISTANT DIRECTOR',
      photo: '/assistant director.jpeg',
      shortMessage: 'As Assistant Director, I am committed to fostering an environment...',
      fullMessage: 'As Assistant Director, I am committed to fostering an environment of academic excellence and personal growth. My vision is to ensure that every student receives quality education and support in their journey towards success. We believe in the holistic development of our students, nurturing not just their intellect but also their character and values. Through our dedicated team and modern facilities, we strive to make our school a place where every child can discover their potential and grow into responsible citizens. Education is not just about academics; it\'s about building a strong foundation for life.',
      alignment: 'right'
    },
    {
      id: 3,
      name: 'Mayank Singh Chauhan',
      position: 'PRINCIPAL',
      photo: '/principal.jpg',
      shortMessage: 'It gives an immense pleasure and joy to welcome you to our school...',
      fullMessage: 'It gives an immense pleasure and joy to welcome you to our school and to introduce you to the wide range of educational opportunities offered both through the curriculum and the rich-varied realms of extracurricular activities. Our school is committed to provide you a quality education for better future. We believe that each student is unique and has the potential to be successful. Our mission is to create an environment where every child can develop academically, physically, emotionally and spiritually. We strive to instill in our students the values of honesty, integrity and compassion. Our experienced and dedicated faculty members work tirelessly to ensure that each student receives the best possible education.',
      alignment: 'left'
    },
  ];

  const handleLeaderModal = (leader: any) => {
    setSelectedLeader(leader);
    setIsLeaderModalOpen(true);
  };

  const features = [
    {
      icon: <FaBook className="w-8 h-8" />,
      title: 'Quality Education',
      description: 'CBSE pattern curriculum with modern teaching methodologies',
    },
    {
      icon: <FaTrophy className="w-8 h-8" />,
      title: 'Sports Excellence',
      description: 'Comprehensive sports programs and facilities for student development',
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'Expert Faculty',
      description: 'Highly qualified and experienced teaching professionals',
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: 'Achievements',
      description: 'Consistent excellence in academics and co-curricular activities',
    },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [latestUpdates, setLatestUpdates] = useState<Array<{ _id: string; title: string; excerpt?: string; featuredImage?: string; publishedAt?: string }>>([]);

  const infrastructureImages = [
    '/infra1.jpg',
    '/infra2.jpg',
    '/infra3.jpg',
    '/infra4.jpg',
  ];

  useEffect(() => {
    const getHeroImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/hero-carousel`);
        if (response.data?.success) {
          setHeroImages(response.data.data.map((item: any) => item.imageUrl));
        }
      } catch (err) {
        console.error('Error fetching hero images:', err);
      }
    };
    getHeroImages();
  }, []);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const response = await axios.get(`${API_URL}/news?latest=true&limit=3`);
        if (response.data?.success) {
          setLatestUpdates(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching latest updates:', err);
      }
    };

    fetchLatestUpdates();
  }, [API_URL]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (heroImages.length ? (prev + 1) % heroImages.length : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        {heroImages.length > 0 ? (
          <div className="absolute inset-0">
            {heroImages.map((url, index) => (
              <motion.img
                key={url + index}
                src={url}
                alt={`Hero ${index + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === activeHeroIndex ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ))}
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600" />
        )}

        {/* Founding Mother - Top Left */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-3 left-3 sm:top-5 sm:left-5 lg:top-8 lg:left-8 z-20"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/20 p-3 w-32 sm:w-48 lg:w-56 max-w-[10rem] sm:max-w-[14rem]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/memorial/foundingmother.png"
                    alt="Founding Mother"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm lg:text-base font-bold text-white mb-1">Late Dr. Nirmala Chauhan</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-blue-100 mb-1">Founding Mother</p>
                <p className="text-[9px] sm:text-[10px] text-blue-100 italic leading-tight">A beacon of inspiration and dedication to education</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Founders - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 lg:top-8 lg:right-8 z-20"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/20 p-3 w-36 sm:w-52 lg:w-60 max-w-[11rem] sm:max-w-[15rem]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/founders.jpg"
                    alt="Founders"
                    className="w-full aspect-[5/4] object-cover"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm lg:text-base font-bold text-white mb-1">Late Adv. Shatrughan Chauhan & Late Mrs. Krishna Chauhan</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-blue-100 mb-1">Founders</p>
                <p className="text-[9px] sm:text-[10px] text-blue-100 italic leading-tight">Visionaries who laid the foundation for inclusive education</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-10 sm:pt-16 lg:pt-20">
          {/* Welcome Text Section - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
              Welcome to Meridian Creative & Progressive School
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              Innovating Education And Inspiring Lives
            </p>
            <motion.button
              onClick={handleExploreMore}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Explore Gallery
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.length ? heroImages.map((_, index) => (
            <button key={index}
              onClick={() => setActiveHeroIndex(index)}
              className={`w-3 h-3 rounded-full ${activeHeroIndex === index ? 'bg-white' : 'bg-white/50'}`}
            />
          )) : null}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              School Leadership
            </h2>
            <p className="text-lg text-gray-600">The Backbone of Our Institution</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6"></div>
          </motion.div>

          <div className="space-y-16">
            {leadership.map((leader, idx) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`flex flex-col ${leader.alignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}
              >
                {/* Photo Section */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 w-full md:w-1/2 flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-6 blur-lg opacity-30"></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-80 h-80">
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Content Section */}
                <div className="flex-1 w-full md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: leader.alignment === 'right' ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.2 + 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {leader.name}
                    </h3>
                    <p className="text-purple-600 font-bold text-lg mb-6 border-b-2 border-purple-600 pb-4 inline-block">
                      {leader.position}
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed mb-6">
                      {leader.shortMessage}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLeaderModal(leader)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      READ MORE
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Modal */}
      <AnimatePresence>
        {isLeaderModalOpen && selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsLeaderModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedLeader.name}</h2>
                  <p className="text-blue-100 text-lg mt-1">{selectedLeader.position}</p>
                </div>
                <button
                  onClick={() => setIsLeaderModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Photo and Message */}
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={selectedLeader.photo}
                        alt={selectedLeader.name}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Message</h3>
                    <p className="text-gray-700 leading-8 text-justify text-base">
                      {selectedLeader.fullMessage}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campus Infrastructure */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Campus Infrastructure
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infrastructureImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={src} 
                    alt={`Infrastructure ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Why Choose Meridian Creative & Progressive School?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Latest Updates
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestUpdates.length > 0 ? (
              latestUpdates.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {item.featuredImage ? (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  )}
                  <div className="p-6">
                    <span className="text-sm text-gray-500">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Latest'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {item.excerpt || 'Read the latest update from the admin news section.'}
                    </p>
                    <Link href={`/news/${item._id}`} className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              [1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      School Update {item}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Important announcement about school events and activities.
                    </p>
                    <Link href="/news" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/admissions')}
            >
              <h3 className="text-2xl font-bold mb-2">Admissions Open</h3>
              <p className="text-blue-100 mb-4">Join our school community</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Apply Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/academics')}
            >
              <h3 className="text-2xl font-bold mb-2">Academic Programs</h3>
              <p className="text-green-100 mb-4">Explore our curriculum</p>
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/contact')}
            >
              <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
              <p className="text-purple-100 mb-4">Contact our team</p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Contact Us
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/donations')}
            >
              <h3 className="text-2xl font-bold mb-2">Support Our Mission</h3>
              <p className="text-orange-100 mb-4">Help underprivileged children</p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                Donate Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
