import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';

export default function Gallery() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState('all');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch gallery events from backend
  useEffect(() => {
    const fetchGalleryEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/gallery`);
        if (response.data?.success) {
          setEvents(response.data.data || []);
        } else {
          setError('Failed to load gallery events');
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Failed to load gallery events');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryEvents();
  }, []);

  const filteredEvents = selectedYear === 'all' 
    ? events 
    : events.filter(event => {
        const eventYear = event.year || new Date().getFullYear();
        return eventYear === parseInt(selectedYear);
      });

  const years = ['all', ...new Set(events.map(e => {
    const year = e.year || new Date().getFullYear();
    return year.toString();
  }))];

  const handleViewAlbum = (eventId: string) => {
    router.push(`/gallery/${eventId}`);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-lg text-blue-100">
              Capturing moments of joy and achievement
            </p>
          </motion.div>
        </div>
      </section>

      {/* Year Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedYear === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              All Years
            </button>
            {years.filter(y => y !== 'all').map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading gallery events...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  key={event._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden cursor-pointer group"
                >
                  {/* Image/Emoji Section */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                    {event.images && event.images[0]?.imageUrl ? (
                      <img 
                        src={event.images[0].imageUrl} 
                        alt={event.eventName} 
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-7xl group-hover:scale-125 transition-transform duration-300">
                        🖼️
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {event.eventName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {event.description || 'No description available'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaImage className="text-blue-600" />
                        <span className="text-sm font-semibold">
                          {(event.images && event.images.length) || 0} Photos
                        </span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
                        {event.year || 'N/A'}
                      </span>
                    </div>

                    {/* View Button */}
                    <button 
                      onClick={() => handleViewAlbum(event._id)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      View Album
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found for this year.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Upcoming Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Science Fair 2026', emoji: '🔬', date: 'April 2026' },
              { name: 'Sports Championship', emoji: '⚽', date: 'May 2026' },
              { name: 'School Picnic', emoji: '🚌', date: 'June 2026' },
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl mb-4">{event.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.name}
                </h3>
                <p className="text-blue-600 font-semibold">{event.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
