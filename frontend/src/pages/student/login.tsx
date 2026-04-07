import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function StudentLogin() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [loginCredential, setLoginCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: loginCredential,
        password,
      });

      if (response.data?.success && response.data.token) {
        const user = response.data.user;
        
        // Store appropriate token based on user role
        if (user?.role === 'parent') {
          localStorage.setItem('parentToken', response.data.token);
          localStorage.setItem('parentData', JSON.stringify(user));
        } else if (user?.role === 'student') {
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(user));
        } else {
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(user));
        }

        if (user?.role === 'admin' || user?.role === 'staff') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/profile');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-50 p-4 flex items-center justify-center">
              <img src="/logo/logo.jpeg" alt="Meridian Creative & Progressive School Logo" className="h-20 w-20 object-cover rounded-full" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Student & Parent Portal</h1>
          <p className="text-gray-500 mt-2">Access your personalized academic dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username or Email</label>
            <input
              type="text"
              value={loginCredential}
              onChange={(e) => setLoginCredential(e.target.value)}
              placeholder="student123 or parent@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500 text-center">
          Login with your student or parent account. If your account has not been created, please contact school administration.
        </div>
      </motion.div>
    </div>
  );
}
