import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTags } from 'react-icons/fa';
import axios from 'axios';

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/news/${id}`);
        if (response.data?.success) {
          setArticle(response.data.data);
        } else {
          setError('Unable to load news article.');
        }
      } catch (err) {
        console.error('Error fetching news article:', err);
        setError('Unable to load news article.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [API_URL, id]);

  const renderContent = () => {
    if (!article?.content) return null;
    return article.content.split('\n').map((paragraph: string, index: number) => (
      <p key={index} className="text-gray-700 leading-8 mb-4">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            <FaArrowLeft /> Back
          </button>
          <Link href="/news" className="text-blue-600 font-semibold hover:text-blue-800">
            All News
          </Link>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading article...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && article && (
          <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {article.featuredImage ? (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full object-cover max-h-96"
              />
            ) : (
              <div className="h-80 bg-gradient-to-r from-blue-500 to-indigo-600" />
            )}

            <div className="p-8 sm:p-12">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  <FaTags /> {article.category || 'General'}
                </span>
                {article.publishedAt && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                    <FaCalendarAlt /> {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                )}
                {article.author && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                    <FaUser /> {typeof article.author === 'string' ? article.author : article.author?.name}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
              <div className="prose prose-lg text-gray-700">{renderContent()}</div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
