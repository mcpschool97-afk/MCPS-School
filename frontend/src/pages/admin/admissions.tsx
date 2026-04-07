import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPhone, FaEnvelope, FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';

interface Admission {
  _id: string;
  guardianName: string;
  studentName: string;
  phone: string;
  studentAge: number;
  classApplying: string;
  email: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Admitted' | 'Rejected';
  contacted: boolean;
  contactedDate?: string;
  createdAt: string;
}

export default function AdminAdmissions() {
  const router = useRouter();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: 'Applied',
    remarks: '',
    contacted: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');

    if (!storedToken) {
      router.push('/admin/login');
      return;
    }

    setToken(storedToken);
  }, [router]);

  const fetchAdmissions = useCallback(async (showLoading = false) => {
    if (!token) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const response = await axios.get(`${API_URL}/admissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAdmissions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (token) {
      // Initial load with loading state
      fetchAdmissions(true);
      // Refresh every 5 seconds silently (no loading state)
      const interval = setInterval(() => fetchAdmissions(false), 5000);
      return () => clearInterval(interval);
    }
  }, [token, fetchAdmissions]);

  const handleStatusUpdate = async (admission: Admission) => {
    if (!token) return;

    try {
      const response = await axios.put(
        `${API_URL}/admissions/${admission._id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAdmissions(
          admissions.map((adm) =>
            adm._id === admission._id ? response.data.data : adm
          )
        );
        setIsEditModalOpen(false);
        setSelectedAdmission(null);
      }
    } catch (error) {
      console.error('Error updating admission:', error);
    }
  };

  const handleDeleteAdmission = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this application?')) return;

    try {
      const response = await axios.delete(`${API_URL}/admissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAdmissions(admissions.filter((adm) => adm._id !== id));
      }
    } catch (error) {
      console.error('Error deleting admission:', error);
    }
  };

  const handleEditClick = (admission: Admission) => {
    setSelectedAdmission(admission);
    setEditFormData({
      status: admission.status,
      remarks: '',
      contacted: admission.contacted,
    });
    setIsEditModalOpen(true);
  };

  const statusColors: Record<string, string> = {
    Applied: 'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    Admitted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Manage Admissions</h1>
          <p className="text-blue-100 mt-2">
            View and manage all admission applications
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{admissions.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 text-sm">Contacted</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {admissions.filter((a) => a.contacted).length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 text-sm">Applied</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {admissions.filter((a) => a.status === 'Applied').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 text-sm">Admitted</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {admissions.filter((a) => a.status === 'Admitted').length}
            </p>
          </motion.div>
        </div>

        {/* Admissions Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading admissions...</p>
          </div>
        ) : admissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No admission applications yet.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Guardian Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map((admission, idx) => (
                    <tr key={admission._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{admission.guardianName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{admission.studentName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`tel:${admission.phone}`}
                          className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <FaPhone size={14} /> {admission.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{admission.classApplying}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusColors[admission.status]
                            }`}
                          >
                            {admission.status}
                          </span>
                          {admission.contacted && (
                            <FaCheck className="text-green-600" size={14} title="Contacted" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(admission)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmission(admission._id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedAdmission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Update Application
            </h2>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Contacted Checkbox */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFormData.contacted}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        contacted: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">Contacted Guardian</span>
                </label>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={editFormData.remarks}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  placeholder="Add any notes or remarks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleStatusUpdate(selectedAdmission)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
