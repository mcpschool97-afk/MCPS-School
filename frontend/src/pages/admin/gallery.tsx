import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  publicId?: string;
  uploadedAt?: string;
}

interface GalleryEvent {
  _id: string;
  eventName: string;
  description?: string;
  year?: number;
  images: GalleryImage[];
}

export default function AdminGalleryUpload() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState<GalleryImage[]>([]);
  const [heroUploading, setHeroUploading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
    setAuthenticated(true);
    fetchGalleryEvents(storedToken);
    fetchHeroImages();
  }, [router]);

  const fetchHeroImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/hero-carousel`);
      if (response.data.success) {
        setHeroImages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
    }
  };

  const fetchGalleryEvents = async (authToken?: string) => {
    try {
      const response = await axios.get(`${API_URL}/gallery`);
      if (response.data.success) {
        setEvents(response.data.data || []);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching gallery events:', error);
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      alert('Please enter an event name');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/gallery`,
        {
          eventName,
          description: eventDescription,
          year: new Date().getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setEvents([response.data.data, ...events]);
        setSelectedEvent(response.data.data._id);
        setEventName('');
        setEventDescription('');
        setGalleryImages([]);
        alert('Event created successfully!');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedEvent) {
      alert('Please select an event first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('images', file);
    }

    try {
      const response = await axios.post(`${API_URL}/gallery/${selectedEvent}/images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const event = response.data.data;
        setGalleryImages(event.images || []);
        setEvents(events.map((item) => (item._id === event._id ? event : item)));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      alert('Please select an image');
      return;
    }

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setHeroUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', 'School Moment');
    formData.append('description', '');

    try {
      // Use fresh token from localStorage
      const freshToken = localStorage.getItem('adminToken');
      if (!freshToken) {
        alert('Session expired. Please login again.');
        router.push('/admin/login');
        return;
      }

      console.log('Uploading hero image:', file.name, 'Size:', file.size, 'Type:', file.type);

      const response = await axios.post(`${API_URL}/hero-carousel`, formData, {
        headers: {
          Authorization: `Bearer ${freshToken}`,
          // Let axios handle Content-Type for FormData
        },
      });

      console.log('Upload response:', response.status, response.data);

      if (response.data.success) {
        setHeroImages([response.data.data, ...heroImages]);
        alert('Hero image uploaded successfully!');
        // Reset the file input
        e.target.value = '';
      } else {
        alert(`Upload failed: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Hero upload error:', error);
      let errorMsg = 'Failed to upload hero image';
      
      if (error.response?.status === 403) {
        errorMsg = 'You do not have permission to upload hero images';
      } else if (error.response?.status === 400) {
        errorMsg = error.response.data.message || 'Invalid file. Please upload a JPG, PNG, GIF, or WebP image.';
      } else if (error.response?.status === 500) {
        errorMsg = error.response.data.message || 'Server error. Please check the image file and try again.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`Error: ${errorMsg}`);
    } finally {
      setHeroUploading(false);
    }
  };

  const handleDeleteHeroImage = async (imageId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/hero-carousel/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setHeroImages(heroImages.filter((img) => img._id !== imageId));
        alert('Hero image deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting hero image:', error);
      alert('Failed to delete hero image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedEvent) return;

    try {
      const response = await axios.delete(`${API_URL}/gallery/${selectedEvent}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setGalleryImages(response.data.data.images || []);
        alert('Image deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event and all its photos?')) return;

    try {
      const response = await axios.delete(`${API_URL}/gallery/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setEvents(events.filter((evt) => evt._id !== eventId));
        if (selectedEvent === eventId) {
          setSelectedEvent('');
          setGalleryImages([]);
        }
        alert('Event deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvent(eventId);
    const event = events.find((e) => e._id === eventId);
    setGalleryImages(event?.images || []);
  };

  if (loading || !authenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:bg-blue-500 p-2 rounded-lg transition">
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Gallery Management</h1>
            <p className="text-blue-100">Upload event photos and keep the gallery updated.</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Hero Carousel Images</h2>
          <p className="text-sm text-gray-500 mb-4">Upload images to show behind the homepage hero text.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                disabled={heroUploading}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-2">Recommended resolution: 1920x1080 or similar.</p>
            </div>
            <div className="text-right">
              <button
                disabled={heroUploading}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-70"
              >
                {heroUploading ? 'Uploading...' : 'Upload Hero Image'}
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {heroImages.map((img) => (
              <div key={img._id} className="relative h-24 overflow-hidden rounded-lg border border-gray-200">
                <img src={img.imageUrl} alt="Hero" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeleteHeroImage(img._id)}
                  className="absolute top-1 right-1 text-white bg-red-600 rounded-full p-1 text-xs"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Events</h2>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
              />
              <button
                onClick={handleCreateEvent}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                + New Event
              </button>
            </div>

            <div className="space-y-2">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSelectEvent(event._id)}
                  className={`p-3 rounded-lg cursor-pointer transition flex items-center justify-between ${
                    selectedEvent === event._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{event.eventName}</p>
                    <p className="text-xs opacity-75">{event.images?.length || 0} photos</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event._id);
                    }}
                    className="text-xs hover:opacity-70 transition"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 bg-white rounded-lg shadow-md p-8">
            {selectedEvent ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {events.find((e) => e._id === selectedEvent)?.eventName}
                </h2>
                <p className="text-gray-600 mb-8">Total photos: {galleryImages.length}</p>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-400 rounded-lg p-12 text-center mb-8 hover:bg-blue-100 transition cursor-pointer">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaCloudUploadAlt className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {uploading ? 'Uploading...' : 'Drop images here or click to select'}
                    </h3>
                    <p className="text-gray-600 text-sm">Supported formats: JPG, PNG, GIF</p>
                  </label>
                </div>

                {galleryImages.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Uploaded Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((image) => (
                        <motion.div
                          key={image._id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group bg-gray-100 rounded-lg overflow-hidden h-48"
                        >
                          {image.imageUrl && (
                            <img src={image.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDeleteImage(image._id)}
                              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Select an event from the left to manage its photos.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
