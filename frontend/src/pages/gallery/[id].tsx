import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaImage } from 'react-icons/fa';
import axios from 'axios';

export default function GalleryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch gallery event details
  useEffect(() => {
    if (!id) return;

    const fetchGalleryEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/gallery/${id}`);
        if (response.data?.success) {
          setEvent(response.data.data);
        } else {
          setError('Failed to load gallery event');
        }
      } catch (err) {
        console.error('Error fetching gallery event:', err);
        setError('Failed to load gallery event');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading album...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-6">{error || 'Album not found'}</p>
          <button
            onClick={() => router.push('/gallery')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft /> Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  const images = event.images || [];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/gallery')}
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <FaArrowLeft /> Back to Gallery
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.eventName}</h1>
            <p className="text-blue-100 text-lg">{event.description}</p>
            <div className="flex items-center gap-4 mt-6 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                📅 {event.year}
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <FaImage className="inline mr-2" />
                {images.length} Photos
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Gallery View */}
      {images.length > 0 ? (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Image Display */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-12 rounded-lg overflow-hidden shadow-2xl"
            >
              <img
                src={images[selectedImageIndex]?.imageUrl}
                alt={`${event.eventName} - Photo ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-96 object-cover"
              />
            </motion.div>

            {/* Image Counter */}
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg">
                Photo {selectedImageIndex + 1} of {images.length}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                ← Previous
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Next →
              </button>
            </div>

            {/* Image Grid */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">All Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative h-32 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform ${
                      selectedImageIndex === idx ? 'ring-4 ring-blue-600' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === idx && (
                      <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FaImage className="text-8xl text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 text-xl">No images in this album yet</p>
          </div>
        </section>
      )}
    </div>
  );
}
