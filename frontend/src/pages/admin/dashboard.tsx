import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaImages, FaNewspaper, FaUsers, FaClipboardList, FaCheckCircle } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    galleryItems: 0,
    newsArticles: 0,
    pendingAdmissions: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch statistics
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch students count
        const usersRes = await fetch(`${API_URL}/students/all`, { headers });
        const usersData = await usersRes.json();
        const totalUsers = usersData.data?.length || 0;

        // Fetch gallery count
        const galleryRes = await fetch(`${API_URL}/gallery`, { headers });
        const galleryData = await galleryRes.json();
        const galleryItems = galleryData.data?.length || 0;

        // Fetch news count
        const newsRes = await fetch(`${API_URL}/news`, { headers });
        const newsData = await newsRes.json();
        const newsArticles = newsData.data?.length || 0;

        // Fetch admissions count
        const admissionsRes = await fetch(`${API_URL}/admissions`, { headers });
        const admissionsData = await admissionsRes.json();
        const pendingAdmissions = admissionsData.data?.filter((adm: any) => adm.status === 'Applied').length || 0;

        setStats({
          totalUsers,
          galleryItems,
          newsArticles,
          pendingAdmissions,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const adminSections = [
    {
      icon: <FaImages className="w-8 h-8" />,
      title: 'Gallery Upload',
      description: 'Upload and manage event photos',
      path: '/admin/gallery',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FaNewspaper className="w-8 h-8" />,
      title: 'News Management',
      description: 'Create, edit, and delete news articles',
      path: '/admin/news',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'Student Profiles',
      description: 'Create and update student profile records',
      path: '/admin/students',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: <FaClipboardList className="w-8 h-8" />,
      title: 'Admissions',
      description: 'View and manage admission applications',
      path: '/admin/admissions',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: <FaCheckCircle className="w-8 h-8" />,
      title: 'Attendance Management',
      description: 'Mark attendance and send SMS notifications',
      path: '/admin/attendance',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">Welcome back, {user?.name || 'Administrator'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Students', value: stats.totalUsers, color: 'bg-blue-500' },
            { label: 'Gallery Items', value: stats.galleryItems, color: 'bg-green-500' },
            { label: 'News Articles', value: stats.newsArticles, color: 'bg-purple-500' },
            { label: 'Pending Admissions', value: stats.pendingAdmissions, color: 'bg-indigo-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className={`${stat.color} w-12 h-12 rounded-lg text-white flex items-center justify-center mb-4 text-xl font-bold`}>
                📊
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Admin Sections Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Management Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => router.push(section.path)}
              className="cursor-pointer group"
            >
              <div className={`bg-gradient-to-br ${section.color} text-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105`}>
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition">{section.icon}</div>
                <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                <p className="text-white/90 text-sm mb-4">{section.description}</p>
                <button className="text-sm font-semibold text-white/80 hover:text-white transition flex items-center gap-1">
                  Open → 
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
