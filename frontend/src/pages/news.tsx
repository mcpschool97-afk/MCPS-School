import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTags } from 'react-icons/fa';
import axios from 'axios';

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/news`);
        if (response.data?.success) {
          setNewsArticles(response.data.data || []);
        } else {
          setError('Failed to load news articles');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL]);

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'Events', label: 'Events' },
    { id: 'Admissions', label: 'Admissions' },
    { id: 'Sports', label: 'Sports' },
    { id: 'Achievements', label: 'Achievements' },
    { id: 'General', label: 'General' },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
            <p className="text-lg text-blue-100">
              Stay informed about school events and announcements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading news articles...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, idx) => (
                <motion.div
                  key={article._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
                >
                  {/* Image */}
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                      📰
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTags className="text-blue-600 text-xs" />
                      <span className="text-xs font-semibold text-blue-600 uppercase">
                        {article.category || 'news'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {article.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4">
                      {article.excerpt || article.description || 'No description available'}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      {article.author && (
                        <div className="flex items-center gap-2">
                          <FaUser />
                          <span>{typeof article.author === 'string' ? article.author : article.author?.name}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/news/${article._id}`} className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
