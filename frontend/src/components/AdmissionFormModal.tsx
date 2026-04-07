import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdmissionFormModal({ isOpen, onClose }: AdmissionFormModalProps) {
  const [formData, setFormData] = useState({
    guardianName: '',
    studentName: '',
    phone: '',
    studentAge: '',
    classApplying: 'Class 1',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const classOptions = [
    'Nursery',
    'KG',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!formData.guardianName || !formData.studentName || !formData.phone || !formData.studentAge) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (formData.phone.length !== 10 || isNaN(Number(formData.phone))) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    if (Number(formData.studentAge) < 3 || Number(formData.studentAge) > 13) {
      setErrorMessage('Student age must be between 3 and 13 years');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/admissions`, formData);

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setFormData({
          guardianName: '',
          studentName: '',
          phone: '',
          studentAge: '',
          classApplying: 'Class 1',
          email: '',
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error submitting application';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-white">Apply for Admission</h2>
              <p className="text-blue-100 text-sm mt-1">
                Meridian Creative & Progressive School - Classes I to VI
              </p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm"
                >
                  ✓ {successMessage}
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  ✗ {errorMessage}
                </motion.div>
              )}

              {/* Guardian Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Enter guardian name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Student Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="studentAge"
                  value={formData.studentAge}
                  onChange={handleChange}
                  placeholder="Enter age (3-18)"
                  min="3"
                  max="18"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Class for Admission */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class for Admission <span className="text-red-500">*</span>
                </label>
                <select
                  name="classApplying"
                  value={formData.classApplying}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classOptions.map((classOption) => (
                    <option key={classOption} value={classOption}>
                      {classOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </motion.button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
