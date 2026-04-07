import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface AttendanceData {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  remarks?: string;
  markedBy?: string;
}

interface AttendanceRecord {
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}

interface ResultSubject {
  subject: string;
  marksObtained: number;
  maximumMarks: number;
  grade: string;
}

interface ResultRecord {
  examName: string;
  term: string;
  year: number;
  subjects: ResultSubject[];
  totalMarks: number;
  percentage: number;
  grade: string;
}

interface StudentProfile {
  id: string;
  _id?: string;
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
  profileImage?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  classTeacherName?: string;
  classTeacherEmail?: string;
  classTeacherPhone?: string;
  attendance?: AttendanceRecord[];
  attendanceRecords?: AttendanceData[];
  results?: ResultRecord[];
  fees?: {
    totalAmount?: number;
    paidAmount?: number;
    dueAmount?: number;
    status?: string;
    lastPaymentDate?: string;
  };
  notes?: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceData[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  useEffect(() => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('parentToken');
    const isParent = localStorage.getItem('parentToken') ? true : false;
    
    if (!token) {
      router.push('/student/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/students/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success) {
          if (Array.isArray(response.data.data)) {
            const records: StudentProfile[] = response.data.data;
            setStudents(records);
            const firstStudent = records[0];
            const firstId = firstStudent?.id || firstStudent?._id || null;
            setSelectedStudentId(firstId);
            if (firstStudent) {
              setProfileData(firstStudent);
              if (firstId) {
                await fetchAttendanceForStudent(firstId, token);
              }
            }
          } else {
            const student = response.data.data;
            setProfileData(student);
            const studentId = student?.id || student?._id;
            if (studentId) {
              await fetchAttendanceForStudent(studentId, token);
            }
          }
        }
      } catch (err: any) {
        console.error('Full error:', err);
        console.error('Error response:', err.response?.data);
        if (err.response?.status === 401) {
          // Token is invalid or expired, redirect to login
          localStorage.removeItem('userToken');
          localStorage.removeItem('parentToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('parentData');
          setError('Your session has expired. Please login again.');
          setTimeout(() => {
            router.push('/student/login');
          }, 2000);
        } else {
          setError(err.response?.data?.message || 'Unable to load profile information.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_URL, router]);

  const fetchAttendanceForStudent = async (studentId: string, token: string) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && response.data.data?.length > 0) {
        setAttendanceRecords(response.data.data);
        calculateAttendancePercentage(response.data.data);
      } else {
        setAttendanceRecords([]);
        setAttendancePercentage(0);
      }
    } catch (err: any) {
      console.error('Error fetching attendance:', err.response?.data?.message || err.message);
      setAttendanceRecords([]);
      setAttendancePercentage(0);
    }
  };

  const calculateAttendancePercentage = (records: AttendanceData[]) => {
    if (!records || records.length === 0) {
      setAttendancePercentage(0);
      return;
    }

    const presentCount = records.filter((r) => r.status === 'present').length;
    const totalDays = records.length;
    const percentage = Math.round((presentCount / totalDays) * 100);
    setAttendancePercentage(percentage);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage > 80) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceBackgroundColor = (percentage: number) => {
    if (percentage > 80) return 'bg-green-50 border-green-200';
    if (percentage >= 75) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getAttendanceStatusForDate = (date: Date): AttendanceData | undefined => {
    return attendanceRecords.find((record) => isSameDay(new Date(record.date), date));
  };

  const getDateCircleColor = (date: Date): string => {
    const attendance = getAttendanceStatusForDate(date);
    if (!attendance) return 'bg-gray-100 text-gray-600 border-gray-200'; // No record
    if (attendance.status === 'present') return 'bg-green-500 text-white border-green-600';
    if (attendance.status === 'absent') return 'bg-red-500 text-white border-red-600';
    return 'bg-yellow-500 text-white border-yellow-600'; // leave
  };

  const getDateHoverInfo = (date: Date): string => {
    const attendance = getAttendanceStatusForDate(date);
    if (!attendance) return 'No record';
    return attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1);
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('parentToken');
    
    if (students.length && !selectedStudentId) {
      const firstStudent = students[0];
      const firstId = firstStudent?.id || firstStudent?._id || null;
      if (firstId) {
        setSelectedStudentId(firstId);
        setProfileData(firstStudent);
        if (token) {
          fetchAttendanceForStudent(firstId, token);
        }
      }
    }
    if (students.length && selectedStudentId) {
      const selected = students.find((student: StudentProfile) => student.id === selectedStudentId || student._id === selectedStudentId);
      if (selected) {
        setProfileData(selected);
        const studentId = selected.id || selected._id;
        if (token && studentId) {
          fetchAttendanceForStudent(studentId, token);
        }
      }
    }
  }, [selectedStudentId, students]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('parentToken');
    localStorage.removeItem('userData');
    router.push('/student/login');
  };

  const getAttendanceSummary = () => {
    return attendancePercentage;
  };

  const getLatestResult = () => {
    if (!profileData?.results?.length) {
      return null;
    }
    return profileData.results[0];
  };

  const getFeeStatus = () => {
    if (!profileData?.fees) {
      return 'N/A';
    }
    return profileData.fees.status ? profileData.fees.status.charAt(0).toUpperCase() + profileData.fees.status.slice(1) : 'Pending';
  };

  const renderAttendance = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-center">
          <p className="text-gray-500">No attendance records available yet.</p>
        </div>
      );
    }

    // Get all days in the calendar month
    const monthStart = startOfMonth(calendarMonth);
    const monthEnd = endOfMonth(calendarMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add previous and next month days to fill the grid
    const firstDayOfWeek = monthStart.getDay();
    const previousMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const date = new Date(monthStart);
      date.setDate(date.getDate() - (firstDayOfWeek - i));
      return date;
    });
    
    const lastDayOfMonth = monthEnd.getDay();
    const nextMonthDays = Array.from({ length: 6 - lastDayOfMonth }, (_, i) => {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + i + 1);
      return date;
    });

    const calendarDays = [...previousMonthDays, ...daysInMonth, ...nextMonthDays];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-6">
        {/* Overall Attendance Summary */}
        <motion.div 
          className={`border-2 rounded-3xl p-6 shadow-sm ${getAttendanceBackgroundColor(attendancePercentage)}`}
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">Overall Attendance</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-5xl font-bold ${getAttendanceColor(attendancePercentage)}`}>
                {attendancePercentage}%
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {attendanceRecords.filter((r) => r.status === 'present').length} out of {attendanceRecords.length} days
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-2">
                {attendancePercentage > 80 ? '✓' : attendancePercentage >= 75 ? '⚠' : '✗'}
              </div>
              <p className="text-xs text-gray-600">
                {attendancePercentage > 80 ? 'Excellent' : attendancePercentage >= 75 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Calendar View */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                const newDate = new Date(calendarMonth);
                newDate.setMonth(newDate.getMonth() - 1);
                setCalendarMonth(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Previous month"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900">
              {format(calendarMonth, 'MMMM yyyy')}
            </h3>
            
            <button
              onClick={() => {
                const newDate = new Date(calendarMonth);
                newDate.setMonth(newDate.getMonth() + 1);
                setCalendarMonth(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Next month"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, calendarMonth);
              const attendance = getAttendanceStatusForDate(date);
              const circleColor = getDateCircleColor(date);
              const hasRecord = attendance !== undefined;

              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition ${
                    !isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                  }`}
                  title={`${format(date, 'MMM d, yyyy')} - ${getDateHoverInfo(date)}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition ${circleColor} ${
                      !isCurrentMonth ? 'opacity-50' : ''
                    }`}
                  >
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-3">Legend:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-yellow-600"></div>
                <span className="text-sm text-gray-600">Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-200"></div>
                <span className="text-sm text-gray-600">No Record</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!profileData?.results?.length) {
      return <p className="text-gray-500">Result records are not available.</p>;
    }
    return (
      <div className="space-y-6">
        {profileData.results.map((result, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h4 className="font-semibold text-gray-900">{result.examName} - {result.term} {result.year}</h4>
              <span className="text-sm text-blue-600 font-semibold">Grade: {result.grade}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="text-gray-900 border-b border-gray-200">
                  <tr>
                    <th className="py-2">Subject</th>
                    <th className="py-2">Marks</th>
                    <th className="py-2">Max</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((subject, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2">{subject.subject}</td>
                      <td className="py-2">{subject.marksObtained}</td>
                      <td className="py-2">{subject.maximumMarks}</td>
                      <td className="py-2">{subject.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Total: {result.totalMarks}</p>
              <p>Percentage: {result.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFees = () => {
    if (!profileData?.fees) {
      return <p className="text-gray-500">Fees details are not available.</p>;
    }
    const totalAmount = profileData.fees.totalAmount ?? 0;
    const paidAmount = profileData.fees.paidAmount ?? 0;
    const expectedDueAmount = Math.max(totalAmount - paidAmount, 0);
    const dueAmount = (profileData.fees.dueAmount != null && profileData.fees.dueAmount === expectedDueAmount)
      ? profileData.fees.dueAmount
      : expectedDueAmount;
    const status = profileData.fees.status || (dueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'pending');

    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-gray-900">Fees Summary</h4>
            <p className="text-sm text-gray-500">Status: <span className="font-semibold text-blue-600">{status}</span></p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{dueAmount}</p>
            <p className="text-sm text-gray-500">Outstanding balance</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-3xl p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">₹{totalAmount}</p>
          </div>
          <div className="bg-green-50 rounded-3xl p-4">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">₹{paidAmount}</p>
          </div>
          <div className="bg-yellow-50 rounded-3xl p-4">
            <p className="text-sm text-gray-500">Last Paid</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{profileData.fees.lastPaymentDate ? new Date(profileData.fees.lastPaymentDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              className="bg-blue-600 text-white rounded-2xl px-6 py-3"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button
              className="bg-gray-300 text-gray-800 rounded-2xl px-6 py-3"
              onClick={() => router.push('/student/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">No profile data</h2>
          <p className="text-gray-600">Please log in again to access your student profile.</p>
          <button
            className="mt-6 bg-blue-600 text-white rounded-2xl px-6 py-3"
            onClick={() => router.push('/student/login')}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 bg-white rounded-3xl shadow-lg p-6">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="w-32 h-32 rounded-full bg-blue-100 overflow-hidden border-4 border-blue-200">
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-blue-600">👤</div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h1>
                <p className="text-sm text-gray-500">{profileData.className || 'Class information not set'} • {profileData.section || 'Section N/A'}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-blue-50 rounded-3xl p-5">
                <p className="text-sm text-gray-500">Admission Number</p>
                <p className="mt-2 font-semibold text-gray-900">{profileData.admissionNumber || 'N/A'}</p>
              </div>
              <div className="bg-blue-50 rounded-3xl p-5">
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="mt-2 font-semibold text-gray-900">{profileData.dob ? new Date(profileData.dob).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="bg-blue-50 rounded-3xl p-5">
                <p className="text-sm text-gray-500">Age</p>
                <p className="mt-2 font-semibold text-gray-900">{profileData.age || 'N/A'}</p>
              </div>
              <div className="bg-blue-50 rounded-3xl p-5">
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="mt-2 font-semibold text-gray-900">{profileData.rollNumber || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className={`border-2 rounded-3xl p-5 shadow-sm ${getAttendanceBackgroundColor(attendancePercentage)}`}>
                <p className="text-sm text-gray-500">Attendance Average</p>
                <p className={`mt-3 text-3xl font-bold ${getAttendanceColor(attendancePercentage)}`}>
                  {attendancePercentage}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {attendancePercentage > 80 ? '✓ Excellent' : attendancePercentage >= 75 ? '⚠ Fair' : '✗ Needs Improvement'}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Latest Grade</p>
                <p className="mt-3 text-3xl font-bold text-blue-600">{getLatestResult()?.grade || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">{getLatestResult() ? `${getLatestResult()?.examName} • ${getLatestResult()?.term}` : 'No results yet'}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Fee Status</p>
                <p className="mt-3 text-3xl font-bold text-blue-600">{getFeeStatus()}</p>
                <p className="text-sm text-gray-500 mt-2">Next due: {profileData.fees?.lastPaymentDate ? new Date(profileData.fees.lastPaymentDate).toLocaleDateString() : 'Not set'}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <p className="text-sm text-gray-500 mb-2">Gender: <span className="font-semibold text-gray-900">{profileData.gender || 'N/A'}</span></p>
                <p className="text-sm text-gray-500 mb-2">Address:</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {profileData.address || 'N/A'}
                  {profileData.city ? `, ${profileData.city}` : ''}
                  {profileData.state ? `, ${profileData.state}` : ''}
                  {profileData.postalCode ? ` - ${profileData.postalCode}` : ''}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent / Guardian</h2>
                <p className="text-sm text-gray-500 mb-2">Name: <span className="font-semibold text-gray-900">{profileData.parentName || 'N/A'}</span></p>
                <p className="text-sm text-gray-500 mb-2">Phone: <span className="font-semibold text-gray-900">{profileData.parentPhone || 'N/A'}</span></p>
                <p className="text-sm text-gray-500">Email: <span className="font-semibold text-gray-900">{profileData.parentEmail || 'N/A'}</span></p>
              </div>
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Teacher</h2>
                <p className="text-sm text-gray-500 mb-2">Name: <span className="font-semibold text-gray-900">{profileData.classTeacherName || 'Ms. Priya Sharma'}</span></p>
                <p className="text-sm text-gray-500 mb-2">Email: <span className="font-semibold text-gray-900">{profileData.classTeacherEmail || 'priya.sharma@meridianprogressive.school'}</span></p>
                <p className="text-sm text-gray-500">Phone: <span className="font-semibold text-gray-900">{profileData.classTeacherPhone || '+91 98765 43210'}</span></p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[320px] flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile Actions</h2>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
              </div>
              <p className="text-sm text-gray-500">Manage your student information, attendance, results, and fees from one place.</p>
            </div>
            {students.length > 1 && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Student</h2>
                <div className="space-y-3">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`w-full text-left rounded-2xl px-4 py-3 border ${selectedStudentId === student.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'} text-gray-800`}
                    >
                      {student.firstName} {student.lastName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
              </div>
              {renderAttendance()}
            </section>

            <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Results</h2>
              </div>
              {renderResults()}
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              {renderFees()}
            </section>
            <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-600">{profileData.notes || 'No notes available.'}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
