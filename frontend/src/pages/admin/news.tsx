import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

interface NewsArticle {
  _id?: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  author?: string;
  featured?: boolean;
  isLatestUpdate?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
}

export default function AdminNews() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    author: 'School Admin',
    featured: false,
    isLatestUpdate: false,
    isPublished: true,
    featuredImage: '',
    featuredImagePublicId: '',
  });
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImagePublicId, setFeaturedImagePublicId] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const categories = ['General', 'Academics', 'Sports', 'Events', 'Achievements'];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchArticles = async () => {
      try {
        setError(null);
        const response = await axios.get(`${API_URL}/news/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success) {
          const data = response.data.data || [];
          console.log('Fetched articles:', data);
          console.log('Categories in articles:', data.map((a: any) => ({ title: a.title, category: a.category })));
          setArticles(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch news:', err);
        setError('Unable to load news articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [router, API_URL]);

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'General',
      author: 'School Admin',
      featured: false,
      isPublished: true,
      featuredImage: '',
      featuredImagePublicId: '',
    });
    setFeaturedImageUrl('');
    setFeaturedImagePublicId('');
    setEditingId(null);
    setImageUploadError('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageUploadError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_URL}/news/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        setFeaturedImageUrl(response.data.data.imageUrl);
        setFeaturedImagePublicId(response.data.data.publicId);
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setImageUploadError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert('Title and content are required.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const payload = {
      title: formData.title,
      excerpt: formData.excerpt || '',
      content: formData.content,
      category: formData.category,
      featured: formData.featured || false,
      isLatestUpdate: formData.isLatestUpdate || false,
      isPublished: formData.isPublished || false,
      featuredImage: featuredImageUrl || formData.featuredImage || '',
      featuredImagePublicId: featuredImagePublicId || formData.featuredImagePublicId || '',
    };

    console.log('Submitting payload:', payload);

    try {
      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/news/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post(`${API_URL}/news`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data?.success) {
        const saved = response.data.data;
        console.log('Saved article response:', saved);
        console.log('Saved category:', saved.category);
        const article: NewsArticle = {
          _id: saved._id,
          title: saved.title,
          excerpt: saved.excerpt,
          content: saved.content,
          category: saved.category,
          author: typeof saved.author === 'string' ? saved.author : saved.author?.name || 'Admin',
          featured: saved.featured,
          isPublished: saved.isPublished,
          publishedAt: saved.publishedAt,
          featuredImage: saved.featuredImage,
          featuredImagePublicId: saved.featuredImagePublicId,
        };

        setArticles((prev) =>
          editingId ? prev.map((item) => (item._id === editingId ? article : item)) : [article, ...prev]
        );
        resetForm();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      console.error('Save failed:', err);
      alert(err.response?.data?.message || 'Failed to save article.');
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      featured: article.featured,
      isLatestUpdate: article.isLatestUpdate,
      isPublished: article.isPublished,
      featuredImage: article.featuredImage,
      featuredImagePublicId: article.featuredImagePublicId,
    });
    setFeaturedImageUrl(article.featuredImage || '');
    setFeaturedImagePublicId(article.featuredImagePublicId || '');
    setEditingId(article._id || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API_URL}/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArticles((prev) => prev.filter((article) => article._id !== id));
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete article.');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const latestUpdateArticles = articles.filter((article) => article.isLatestUpdate);
  const filteredArticles =
    filter === 'all' ? articles : articles.filter((article) => article.category === filter);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-purple-500 transition"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold">News Management</h1>
              <p className="text-purple-100">Create and publish news articles with Cloudinary images.</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
          >
            <FaPlus /> New Article
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="flex flex-col gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Latest Updates Section</h2>
                <p className="text-sm text-gray-500 mt-1">These are the articles currently shown in the homepage Latest Updates section.</p>
              </div>
              <div className="text-sm text-gray-600">
                {latestUpdateArticles.length} article{latestUpdateArticles.length !== 1 ? 's' : ''} selected
              </div>
            </div>
            {latestUpdateArticles.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {latestUpdateArticles.map((article) => (
                  <div key={article._id} className="rounded-2xl border border-gray-200 p-3 bg-gray-50 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{article.title}</p>
                      <p className="text-xs text-gray-500">{article.category}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No latest updates selected yet. Mark any article as "Show in Latest Updates" to display it on the homepage.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', ...categories].map((category) => (
              <button
              key={category}
              onClick={() => setFilter(category === 'all' ? 'all' : category)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                filter === (category === 'all' ? 'all' : category)
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{article.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(article._id || '')}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {article.featuredImage && (
                  <img src={article.featuredImage} alt={article.title} className="w-full rounded-lg mb-4 object-cover max-h-64" />
                )}
                <p className="text-gray-700 mb-4">{article.excerpt || article.content.slice(0, 200) + '...'}</p>
                <div className="text-xs text-gray-500">
                  Published: {article.isPublished ? 'Yes' : 'No'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 relative z-50 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Article' : 'New Article'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[180px] focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category || 'General'}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
                  >
                    {categories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    Featured
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      name="isLatestUpdate"
                      checked={formData.isLatestUpdate || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    Show in Latest Updates
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    Published
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {uploadingImage && <p className="mt-2 text-sm text-gray-500">Uploading image...</p>}
                {imageUploadError && <p className="mt-2 text-sm text-red-600">{imageUploadError}</p>}
                {featuredImageUrl && (
                  <img src={featuredImageUrl} alt="Featured" className="mt-4 w-full rounded-xl object-cover max-h-72" />
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                >
                  {editingId ? 'Update Article' : 'Save Article'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
