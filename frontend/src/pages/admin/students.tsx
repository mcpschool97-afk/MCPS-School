import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaEdit, FaSave, FaTrash } from 'react-icons/fa';

interface FeeDetails {
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  status?: string;
  lastPaymentDate?: string;
}

interface StudentProfileForm {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  className: string;
  section: string;
  rollNumber: string;
  age: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentPassword: string;
  profileImage: string;
  notes: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  status: string;
  lastPaymentDate: string;
}

interface StudentCard {
  id: string;
  admissionNumber?: string;
  firstName: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  age?: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  fees?: FeeDetails;
  profileImage?: string;
  notes?: string;
  lastPaymentDate?: string;
  user?: {
    username?: string;
    email?: string;
  };
}

const initialFormState: StudentProfileForm = {
  admissionNumber: '',
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  className: '',
  section: '',
  rollNumber: '',
  age: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  parentPassword: '',
  profileImage: '',
  notes: '',
  totalAmount: '',
  paidAmount: '',
  dueAmount: '',
  status: 'pending',
  lastPaymentDate: '',
};

export default function AdminStudents() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<StudentProfileForm>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      throw new Error('Cloudinary cloud name is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local');
    }

    if (!uploadPreset) {
      throw new Error('Cloudinary upload preset is not configured. Please set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      setUploadingImage(true);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      console.log('Uploading to Cloudinary:', {
        url: uploadUrl,
        cloudName,
        uploadPreset,
        fileName: file.name,
      });

      const response = await axios.post(uploadUrl, formData);

      if (response.data?.secure_url) {
        console.log('Upload successful:', response.data.secure_url);
        return response.data.secure_url;
      } else {
        throw new Error('Failed to get image URL from Cloudinary - no secure_url in response');
      }
    } catch (err: any) {
      console.error('Cloudinary upload error:', err.response?.data || err.message);
      
      let errorMsg = 'Failed to upload image to Cloudinary';
      
      if (err.response?.data?.error?.message) {
        errorMsg = err.response.data.error.message;
      } else if (err.response?.data?.error) {
        errorMsg = typeof err.response.data.error === 'string' 
          ? err.response.data.error 
          : JSON.stringify(err.response.data.error);
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      throw new Error(errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (jpg, png, etc)');
      return;
    }

    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      parentPassword: generateRandomPassword(),
    }));

    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStudents(token);
  }, [router]);

  const fetchStudents = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/students/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.success) {
        setStudents(response.data.data.map((student: any) => ({
          id: student.id,
          admissionNumber: student.admissionNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          dob: student.dob ? new Date(student.dob).toISOString().slice(0, 10) : '',
          gender: student.gender,
          className: student.className,
          section: student.section,
          rollNumber: student.rollNumber,
          age: student.age,
          address: student.address,
          city: student.city,
          state: student.state,
          postalCode: student.postalCode,
          parentName: student.parentName,
          parentEmail: student.parentEmail,
          parentPhone: student.parentPhone,
          fees: student.fees,
          profileImage: student.profileImage,
          notes: student.notes,
          lastPaymentDate: student.fees?.lastPaymentDate ? new Date(student.fees.lastPaymentDate).toISOString().slice(0, 10) : '',
          user: student.user,
        })));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load students.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSelectedId(null);
    setFormValues({
      ...initialFormState,
      parentPassword: generateRandomPassword(),
    });
    setProfileImageFile(null);
    setImagePreview('');
    setSuccess('');
    setError('');
    setShowPassword(false);
    setShowForm(false);
  };

  const handleEdit = (student: StudentCard) => {
    setSelectedId(student.id);
    setFormValues({
      admissionNumber: student.admissionNumber || '',
      firstName: student.firstName,
      lastName: student.lastName || '',
      dob: student.dob || '',
      gender: student.gender || '',
      className: student.className || '',
      section: student.section || '',
      rollNumber: student.rollNumber || '',
      age: student.age?.toString() || '',
      address: student.address || '',
      city: student.city || '',
      state: student.state || '',
      postalCode: student.postalCode || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      parentEmail: student.parentEmail || '',
      parentPassword: student.user?.email ? 'current-password-unchanged' : '',
      profileImage: student.profileImage || '',
      notes: student.notes || '',
      totalAmount: student.fees?.totalAmount?.toString() || '',
      paidAmount: student.fees?.paidAmount?.toString() || '',
      dueAmount: student.fees?.dueAmount?.toString() || '',
      status: student.fees?.status || 'pending',
      lastPaymentDate: student.lastPaymentDate || '',
    });
    setImagePreview(student.profileImage || '');
    setProfileImageFile(null);
    setSuccess('');
    setError('');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student profile? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      await axios.delete(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Student profile deleted successfully.');
      setSelectedId(null);
      resetForm();
      fetchStudents(token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to delete student profile.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Authentication failed. Please login again.');
      router.push('/admin/login');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formValues.firstName.trim()) {
      setError('Student first name is required');
      setSaving(false);
      return;
    }

    if (!selectedId && !formValues.parentEmail.trim()) {
      setError('Parent email is required for new students');
      setSaving(false);
      return;
    }

    if (!selectedId && !formValues.parentPassword) {
      setError('Parent password is required for new students');
      setSaving(false);
      return;
    }

    try {
      let profileImageUrl = formValues.profileImage;

      // Upload image to Cloudinary if a new file is selected
      if (profileImageFile) {
        try {
          profileImageUrl = await uploadImageToCloudinary(profileImageFile);
        } catch (uploadErr: any) {
          setError(`Image upload failed: ${uploadErr.message}`);
          setSaving(false);
          return;
        }
      }

      const payload: any = {
        admissionNumber: formValues.admissionNumber.trim() || undefined,
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim() || undefined,
        dob: formValues.dob ? new Date(formValues.dob).toISOString() : undefined,
        gender: formValues.gender || undefined,
        className: formValues.className.trim() || undefined,
        section: formValues.section.trim() || undefined,
        rollNumber: formValues.rollNumber.trim() || undefined,
        age: formValues.age ? Number(formValues.age) : undefined,
        address: formValues.address.trim() || undefined,
        city: formValues.city.trim() || undefined,
        state: formValues.state.trim() || undefined,
        postalCode: formValues.postalCode.trim() || undefined,
        parentName: formValues.parentName.trim() || undefined,
        parentPhone: formValues.parentPhone.trim() || undefined,
        parentEmail: formValues.parentEmail.trim() || undefined,
        profileImage: profileImageUrl || undefined,
        notes: formValues.notes.trim() || undefined,
        fees: {
          totalAmount: formValues.totalAmount ? Number(formValues.totalAmount) : undefined,
          paidAmount: formValues.paidAmount ? Number(formValues.paidAmount) : undefined,
          dueAmount: formValues.dueAmount ? Number(formValues.dueAmount) : undefined,
          status: formValues.status || 'pending',
          lastPaymentDate: formValues.lastPaymentDate ? new Date(formValues.lastPaymentDate).toISOString() : undefined,
        },
      };

      // Only include password if it's a new student or being changed
      if (!selectedId || (formValues.parentPassword && formValues.parentPassword !== 'current-password-unchanged')) {
        payload.parentPassword = formValues.parentPassword;
      }

      // Clean payload - remove undefined values and clean nested objects
      const cleanedPayload: any = {};
      Object.keys(payload).forEach((key) => {
        if (key === 'fees' && payload[key]) {
          // Handle fees separately - clean the nested object
          const cleanedFees: any = {};
          Object.keys(payload.fees).forEach((feeKey) => {
            if (payload.fees[feeKey] !== undefined) {
              cleanedFees[feeKey] = payload.fees[feeKey];
            }
          });
          if (Object.keys(cleanedFees).length > 0) {
            cleanedPayload.fees = cleanedFees;
          }
        } else if (payload[key] !== undefined) {
          cleanedPayload[key] = payload[key];
        }
      });

      console.log(`[${selectedId ? 'UPDATE' : 'CREATE'}] Cleaned payload:`, cleanedPayload);

      if (selectedId) {
        // UPDATE existing student
        try {
          const response = await axios.put(`${API_URL}/students/${selectedId}`, cleanedPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('[UPDATE] Response:', response.data);

          if (response.data?.success) {
            setSuccess('Student profile updated successfully!');
            setProfileImageFile(null);
            setTimeout(() => {
              fetchStudents(token);
              resetForm();
            }, 1500);
          } else {
            const errorMessage = response.data?.message || 'Failed to update student profile';
            console.error('[UPDATE] Server error:', response.data);
            setError(errorMessage);
          }
        } catch (axiosErr: any) {
          console.error('[UPDATE] Error:', axiosErr.response?.data || axiosErr.message);
          let errorMessage = 'Failed to update student profile';
          if (axiosErr.response?.data?.message) {
            errorMessage = axiosErr.response.data.message;
          } else if (axiosErr.response?.data?.error) {
            errorMessage = axiosErr.response.data.error;
          } else if (axiosErr.response?.status === 404) {
            errorMessage = 'Student profile not found';
          } else if (axiosErr.response?.status === 403) {
            errorMessage = 'You do not have permission to update this student';
          } else if (axiosErr.message) {
            errorMessage = axiosErr.message;
          }
          setError(errorMessage);
          setSaving(false);
          return;
        }
      } else {
        // CREATE new student
        try {
          const response = await axios.post(`${API_URL}/students`, cleanedPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('[CREATE] Response:', response.data);

          if (response.data?.success) {
            setSuccess('Student profile created successfully!');
            setProfileImageFile(null);
            setTimeout(() => {
              fetchStudents(token);
              resetForm();
            }, 1500);
          } else {
            const errorMessage = response.data?.message || 'Failed to create student profile';
            console.error('[CREATE] Server error:', response.data);
            setError(errorMessage);
          }
        } catch (axiosErr: any) {
          console.error('[CREATE] Error:', axiosErr.response?.data || axiosErr.message);
          let errorMessage = 'Failed to create student profile';
          if (axiosErr.response?.data?.message) {
            errorMessage = axiosErr.response.data.message;
          } else if (axiosErr.response?.data?.error) {
            errorMessage = axiosErr.response.data.error;
          } else if (axiosErr.response?.status === 403) {
            errorMessage = 'Only admin or staff can create students';
          } else if (axiosErr.message) {
            errorMessage = axiosErr.message;
          }
          setError(errorMessage);
          setSaving(false);
          return;
        }
      }
    } catch (err: any) {
      console.error('Save error:', err);
      
      // Extract error message from various possible locations
      let errorMessage = 'Unable to save student profile. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.statusText) {
        errorMessage = `Error: ${err.response.statusText}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Get unique classes and sections from students
  const uniqueClasses = Array.from(new Set(students.map((s) => s.className).filter(Boolean)));
  const uniqueSections = Array.from(new Set(students.map((s) => s.section).filter(Boolean)));

  // Filter students based on selected class and section
  const filteredStudents = students.filter((student) => {
    if (filterClass && student.className !== filterClass) return false;
    if (filterSection && student.section !== filterSection) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Profiles</h1>
          <p className="text-gray-600 mt-2">Create and manage student records. Only admins can update student details.</p>
        </div>

        {/* Main Grid */}
        <div className={`grid gap-6 ${showForm ? 'grid-cols-1 lg:grid-cols-[1fr_420px]' : 'grid-cols-1'}`}>
          {/* Student List Section */}
          <section className="bg-white rounded-3xl shadow-lg p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Student List</h2>
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setFormValues({
                      ...initialFormState,
                      parentPassword: generateRandomPassword(),
                    });
                    setProfileImageFile(null);
                    setImagePreview('');
                    setError('');
                    setSuccess('');
                    setShowPassword(false);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white font-semibold hover:bg-blue-700 transition"
                >
                  <FaPlusCircle /> New Student
                </button>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Section</label>
                  <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                  >
                    <option value="">All Sections</option>
                    {uniqueSections.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            </div>

            {/* Student List */}
            {loading ? (
              <div className="text-center text-gray-500 py-16">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                {students.length === 0 ? 'No student profiles found.' : 'No students match your filters.'}
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl border p-3 cursor-pointer transition ${
                      selectedId === student.id
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => handleEdit(student)}
                      className="w-full text-left hover:opacity-80 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 text-lg flex-shrink-0">
                          {student.profileImage ? (
                            <img src={student.profileImage} alt="student" className="w-full h-full object-cover" />
                          ) : (
                            <span>{student.firstName?.[0] || '?'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.admissionNumber || 'No admission #'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.className} {student.section && `/ ${student.section}`}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(student.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition flex-shrink-0"
                          title="Delete student"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Form Section - Only show when showForm is true */}
          {showForm && (
            <section className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedId ? 'Edit Student' : 'New Student'}</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  title="Close form"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                    {success}
                  </div>
                )}

                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                  {/* Quick Info */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Quick Info</label>
                    <input
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name *"
                      required
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <input
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="admissionNumber"
                        value={formValues.admissionNumber}
                        onChange={handleInputChange}
                        placeholder="Admission #"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                      />
                      <input
                        name="rollNumber"
                        value={formValues.rollNumber}
                        onChange={handleInputChange}
                        placeholder="Roll #"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                      />
                    </div>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Class Info</label>
                    <input
                      name="className"
                      value={formValues.className}
                      onChange={handleInputChange}
                      placeholder="Class"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <input
                      name="section"
                      value={formValues.section}
                      onChange={handleInputChange}
                      placeholder="Section"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Personal</label>
                    <input
                      type="date"
                      name="dob"
                      value={formValues.dob}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <select
                      name="gender"
                      value={formValues.gender}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="number"
                      name="age"
                      value={formValues.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Address</label>
                    <input
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="city"
                        value={formValues.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                      />
                      <input
                        name="state"
                        value={formValues.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                      />
                    </div>
                    <input
                      name="postalCode"
                      value={formValues.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                  </div>

                  {/* Parent Info */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Parent Info</label>
                    <input
                      name="parentName"
                      value={formValues.parentName}
                      onChange={handleInputChange}
                      placeholder="Parent Name"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <input
                      name="parentEmail"
                      type="email"
                      value={formValues.parentEmail}
                      onChange={handleInputChange}
                      placeholder="Parent Email *"
                      required
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <input
                      name="parentPhone"
                      value={formValues.parentPhone}
                      onChange={handleInputChange}
                      placeholder="Parent Phone"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                  </div>

                  {/* Profile Image */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Profile Image</label>
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    {(imagePreview || uploadingImage) && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-xs text-gray-400">Uploading...</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fees */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Fees</label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formValues.totalAmount}
                      onChange={handleInputChange}
                      placeholder="Total"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <input
                      type="number"
                      name="paidAmount"
                      value={formValues.paidAmount}
                      onChange={handleInputChange}
                      placeholder="Paid"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                    <select
                      name="status"
                      value={formValues.status}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="parentPassword"
                        value={formValues.parentPassword}
                        onChange={handleInputChange}
                        placeholder={selectedId ? 'Leave blank to keep' : 'Auto-generated'}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm pr-16 focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormValues((prev) => ({
                            ...prev,
                            parentPassword: generateRandomPassword(),
                          }))
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        Gen
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase">Notes</label>
                    <textarea
                      name="notes"
                      value={formValues.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm min-h-[60px] focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    <FaSave /> {saving ? 'Saving...' : selectedId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
