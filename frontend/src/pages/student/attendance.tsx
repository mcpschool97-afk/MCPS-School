import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import axios from 'axios';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  remarks?: string;
  createdAt: string;
}

interface StudentData {
  _id: string;
  firstName: string;
  lastName: string;
  className: string;
  section: string;
  rollNumber: string;
}

export default function StudentAttendance() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, total: 0 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/student/login');
      return;
    }

    const isParent = localStorage.getItem('parentToken') ? true : false;
    fetchAttendance(token, isParent);
  }, [router]);

  const fetchAttendance = async (token: string, isParent: boolean) => {
    try {
      setLoading(true);

      // Get student profile
      const profileResponse = await axios.get(`${API_URL}/students/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse.data?.success) {
        const studentId = profileResponse.data.data[0]?._id || profileResponse.data.data._id;
        setStudentData(profileResponse.data.data[0] || profileResponse.data.data);

        // Get attendance records
        const attendanceResponse = await axios.get(`${API_URL}/attendance/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (attendanceResponse.data?.success) {
          const records = attendanceResponse.data.data || [];
          setAttendance(records);
          
          // Calculate stats
          const presentCount = records.filter((a: any) => a.status === 'present').length;
          const absentCount = records.filter((a: any) => a.status === 'absent').length;
          const leaveCount = records.filter((a: any) => a.status === 'leave').length;
          
          setStats({
            present: presentCount,
            absent: absentCount,
            leave: leaveCount,
            total: records.length,
          });
        }
      }
    } catch (err: any) {
      setError('Failed to load attendance data');
      console.error('Attendance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <FaCheck className="text-green-600" />;
      case 'absent':
        return <FaTimes className="text-red-600" />;
      case 'leave':
        return <FaClock className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 border-l-4 border-green-600';
      case 'absent':
        return 'bg-red-50 border-l-4 border-red-600';
      case 'leave':
        return 'bg-yellow-50 border-l-4 border-yellow-600';
      default:
        return 'bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'leave':
        return 'Leave';
      default:
        return 'Unmarked';
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date).toISOString().split('T')[0].slice(0, 7);
    return recordDate === filterMonth;
  });

  const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  // Helper to normalize date to YYYY-MM-DD format without timezone issues
  const normalizeDate = (dateStr: string | Date): string => {
    let date: Date;
    if (typeof dateStr === 'string') {
      // Handle ISO date strings
      date = new Date(dateStr);
    } else {
      date = dateStr;
    }
    
    // Format as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  const getAttendanceForDate = (date: string) => {
    // Debug log
    console.log(`Checking attendance for date: ${date}`);
    console.log(`Available attendance records:`, attendance.map(a => ({
      date: a.date,
      normalized: normalizeDate(a.date),
      status: a.status
    })));
    
    return attendance.find((record) => {
      const recordDate = normalizeDate(record.date);
      return recordDate === date;
    });
  };

  const renderCalendar = () => {
    const [year, month] = filterMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateStr);
    }

    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'leave':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Attendance Records</h1>
          {studentData && (
            <p className="text-gray-600 mt-2">
              {studentData.firstName} {studentData.lastName} • {studentData.className} {studentData.section}
            </p>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Classes</h3>
              <FaCalendarAlt className="text-blue-600 text-2xl" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 rounded-2xl shadow-md p-6 border border-green-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-700 font-semibold">Present</h3>
              <FaCheck className="text-green-600 text-2xl" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.present}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 rounded-2xl shadow-md p-6 border border-red-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-700 font-semibold">Absent</h3>
              <FaTimes className="text-red-600 text-2xl" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-2xl shadow-md p-6 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-700 font-semibold">Attendance %</h3>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{attendancePercentage}%</div>
          </motion.div>
        </div>

        {/* Filter */}
        <div className="mb-8 flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Filter by Month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
          />
        </div>

        {/* Calendar View */}
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {new Date(filterMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar().map((dateStr, idx) => {
              const record = dateStr ? getAttendanceForDate(dateStr) : null;
              const day = dateStr ? parseInt(dateStr.split('-')[2]) : null;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.01 }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 relative group ${
                    dateStr ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200' : 'bg-transparent'
                  }`}
                >
                  {dateStr && (
                    <>
                      <span className="text-xs font-semibold text-gray-700">{day}</span>
                      {record ? (
                        <div className="relative flex items-center justify-center w-full flex-1">
                          <div
                            className={`w-5 h-5 rounded-full ${getStatusColor(record.status)} shadow-sm hover:w-6 hover:h-6 transition-all cursor-pointer flex-shrink-0`}
                            title={`${day} - ${record.status.toUpperCase()}`}
                          />
                          {/* Tooltip on hover */}
                          <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none">
                            {normalizeDate(record.date)} - {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-200 opacity-30 flex-shrink-0" />
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Legend:</p>
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500" />
                <span className="text-sm text-gray-700">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500" />
                <span className="text-sm text-gray-700">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-700">Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 opacity-30" />
                <span className="text-sm text-gray-700">No Record</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="space-y-4">
          {filteredAttendance.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-md p-12 text-center"
            >
              <p className="text-gray-600 text-lg">No attendance records for {filterMonth}</p>
            </motion.div>
          ) : (
            filteredAttendance
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record, idx) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-2xl shadow-md p-6 ${getStatusBadgeColor(record.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{getStatusIcon(record.status)}</div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {record.remarks && <p className="text-sm text-gray-600 mt-1">{record.remarks}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm ${
                          record.status === 'present'
                            ? 'bg-green-600 text-white'
                            : record.status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}
                      >
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-2xl shadow-md p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <FaCheck className="text-green-600 text-xl" />
              <span className="text-gray-700">Present - Student attended the class</span>
            </div>
            <div className="flex items-center gap-3">
              <FaTimes className="text-red-600 text-xl" />
              <span className="text-gray-700">Absent - Student did not attend</span>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-yellow-600 text-xl" />
              <span className="text-gray-700">Leave - Authorized absence</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
