import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import axios from 'axios';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  className: string;
  section: string;
  rollNumber: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'leave' | 'unmarked';
  remarks?: string;
}

export default function AdminAttendance() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedStudents, setSavedStudents] = useState<Set<string>>(new Set());

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchClasses(token);
  }, [router]);

  // Reset saved students and load attendance when date changes
  useEffect(() => {
    setSavedStudents(new Set());
    
    // Load attendance for the new date if class is selected
    if (selectedClass && students.length > 0) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        const initialAttendance: Record<string, AttendanceRecord> = {};
        students.forEach((student: Student) => {
          initialAttendance[student._id] = {
            studentId: student._id,
            status: 'unmarked',
          };
        });
        loadAttendanceFromDatabase(token, selectedClass, selectedDate, initialAttendance);
      }
    }
  }, [selectedDate]);

  const fetchClasses = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/students/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success && response.data.data?.length > 0) {
        const uniqueClasses = [...new Set(response.data.data.map((s: any) => s.className))].filter(Boolean) as string[];
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) {
          const firstClass = uniqueClasses[0];
          setSelectedClass(firstClass);
          await fetchStudents(token, firstClass);
        }
      } else {
        setError('No students found. Please add students first.');
      }
    } catch (err: any) {
      console.error('Error loading classes:', err);
      setError('Failed to load classes - ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchStudents = async (token: string, className: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/students/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success) {
        const classStudents = response.data.data.filter((s: any) => s.className === className);
        setStudents(classStudents);
        
        // Initialize attendance records as unmarked
        const initialAttendance: Record<string, AttendanceRecord> = {};
        classStudents.forEach((student: Student) => {
          initialAttendance[student._id] = {
            studentId: student._id,
            status: 'unmarked',
          };
        });
        
        // Load existing attendance from database for this date
        await loadAttendanceFromDatabase(token, className, selectedDate, initialAttendance);
      }
    } catch (err: any) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceFromDatabase = async (token: string, className: string, date: string, initialAttendance: Record<string, AttendanceRecord>) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/by-date/${className}`, {
        params: { date },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success && response.data.data?.length > 0) {
        // Merge database records into initial attendance
        const mergedAttendance = { ...initialAttendance };
        const loadedSavedStudents = new Set<string>();

        response.data.data.forEach((record: any) => {
          const studentId = record.student._id || record.student;
          mergedAttendance[studentId] = {
            studentId,
            status: record.status,
            remarks: record.remarks || '',
          };
          loadedSavedStudents.add(studentId);
        });

        setAttendance(mergedAttendance);
        setSavedStudents(loadedSavedStudents);
        console.log('Loaded attendance for date', date, '- Students:', loadedSavedStudents.size);
      } else {
        // No records found, use initial unmarked state
        setAttendance(initialAttendance);
        setSavedStudents(new Set());
      }
    } catch (err: any) {
      console.error('Error loading attendance from database:', err.response?.data?.message || err.message);
      // On error, use initial unmarked state
      setAttendance(initialAttendance);
      setSavedStudents(new Set());
    }
  };

  const handleClassChange = async (className: string) => {
    setSelectedClass(className);
    setSavedStudents(new Set()); // Reset saved students when class changes
    const token = localStorage.getItem('adminToken');
    if (token) {
      await fetchStudents(token, className);
    }
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'leave') => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Check if any attendance is marked
    const markedCount = Object.values(attendance).filter((a) => a.status !== 'unmarked').length;
    if (markedCount === 0) {
      setError('Please mark attendance for at least one student before saving.');
      return;
    }

    // Validate selectedDate
    if (!selectedDate || !selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setError('Invalid date selected. Please select a valid date.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      const newlySavedStudents = new Set<string>();

      for (const [studentId, record] of Object.entries(attendance)) {
        if (record.status === 'unmarked') continue;
        
        // Validate studentId
        if (!studentId || studentId === 'undefined' || studentId === 'null') {
          console.error('Invalid studentId:', studentId);
          errorCount++;
          continue;
        }

        try {
          const payload = {
            student: studentId,
            date: selectedDate,
            status: record.status,
            remarks: record.remarks || '',
          };
          
          console.log('Sending attendance payload:', payload);
          
          await axios.post(
            `${API_URL}/attendance`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successCount++;
          newlySavedStudents.add(studentId);
        } catch (err: any) {
          const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
          console.error('Attendance save error for student:', studentId, errorMsg);
          if (errorMsg?.includes('already marked')) {
            successCount++;
            newlySavedStudents.add(studentId);
          } else {
            errorCount++;
            if (!errors.includes(errorMsg)) {
              errors.push(errorMsg);
            }
          }
        }
      }

      if (errorCount === 0 && successCount > 0) {
        setSuccess(`✓ Attendance saved successfully for ${successCount} student${successCount > 1 ? 's' : ''}!`);
        setSavedStudents((prev) => new Set([...prev, ...newlySavedStudents]));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else if (errorCount > 0 && successCount > 0) {
        setSuccess(`✓ Saved for ${successCount} student${successCount > 1 ? 's' : ''}`);
        const errorDetail = errors.length > 0 ? ` - ${errors[0]}` : '';
        setError(`✗ Failed for ${errorCount} student${errorCount > 1 ? 's' : ''}${errorDetail}`);
      } else if (errorCount > 0) {
        const errorDetail = errors.length > 0 ? ` - ${errors[0]}` : '';
        setError(`Failed to save attendance${errorDetail}`);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error saving attendance';
      console.error('Fatal error in attendance save:', errorMsg);
      setError(`Error: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter((a) => a.status === 'present').length;
  const absentCount = Object.values(attendance).filter((a) => a.status === 'absent').length;
  const leaveCount = Object.values(attendance).filter((a) => a.status === 'leave').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-purple-500 transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-purple-100">Mark daily attendance and send SMS notifications to parents</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={async () => {
                  const token = localStorage.getItem('adminToken');
                  if (token && selectedClass) {
                    const initialAttendance: Record<string, AttendanceRecord> = {};
                    students.forEach((student: Student) => {
                      initialAttendance[student._id] = {
                        studentId: student._id,
                        status: 'unmarked',
                      };
                    });
                    await loadAttendanceFromDatabase(token, selectedClass, selectedDate, initialAttendance);
                    setSuccess('✓ Attendance refreshed from database');
                    setTimeout(() => setSuccess(''), 2000);
                  }
                }}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">{students.length}</div>
            <p className="text-gray-600 text-sm">Total Students</p>
          </motion.div>
          <motion.div className="bg-green-50 rounded-2xl shadow-md p-6 text-center border border-green-200">
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
              <FaCheck /> {presentCount}
            </div>
            <p className="text-gray-600 text-sm">Present</p>
          </motion.div>
          <motion.div className="bg-red-50 rounded-2xl shadow-md p-6 text-center border border-red-200">
            <div className="text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
              <FaTimes /> {absentCount}
            </div>
            <p className="text-gray-600 text-sm">Absent</p>
          </motion.div>
          <motion.div className="bg-yellow-50 rounded-2xl shadow-md p-6 text-center border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center gap-2">
              <FaClock /> {leaveCount}
            </div>
            <p className="text-gray-600 text-sm">Leave</p>
          </motion.div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Roll No</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Present</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Absent</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Leave</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No students found in this class
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{student.rollNumber || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'present')}
                          className={`px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                            attendance[student._id]?.status === 'present'
                              ? `bg-green-600 text-white ${savedStudents.has(student._id) ? 'ring-2 ring-green-400 ring-offset-2' : ''}`
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <FaCheck />
                          {savedStudents.has(student._id) && attendance[student._id]?.status === 'present' && (
                            <span className="text-xs">✓</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'absent')}
                          className={`px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                            attendance[student._id]?.status === 'absent'
                              ? `bg-red-600 text-white ${savedStudents.has(student._id) ? 'ring-2 ring-red-400 ring-offset-2' : ''}`
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <FaTimes />
                          {savedStudents.has(student._id) && attendance[student._id]?.status === 'absent' && (
                            <span className="text-xs">✓</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'leave')}
                          className={`px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                            attendance[student._id]?.status === 'leave'
                              ? `bg-yellow-600 text-white ${savedStudents.has(student._id) ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <FaClock />
                          {savedStudents.has(student._id) && attendance[student._id]?.status === 'leave' && (
                            <span className="text-xs">✓</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={attendance[student._id]?.remarks || ''}
                          onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                          placeholder="Add remarks..."
                          className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-200 focus:ring-2"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          {students.length > 0 && (
            <div className="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  const token = localStorage.getItem('adminToken');
                  if (token) {
                    fetchStudents(token, selectedClass);
                  }
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Reset
              </button>
              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
