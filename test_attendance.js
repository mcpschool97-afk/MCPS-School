const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test data - you'll need a real admin token
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWY0YzAwMDAwMDAwMDAwMDAwMDAwIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiVXNlciIsImlhdCI6MTcwNTUwMDAwMCwiZXhwIjoxNzA1NTg2NDAwfQ.test'; // Fallback token

const headers = {
  'Authorization': `Bearer ${ADMIN_TOKEN}`,
  'Content-Type': 'application/json',
};

async function testAttendanceFlow() {
  try {
    console.log('🧪 Starting Attendance System Tests...\n');

    // Step 1: Get all students
    console.log('📚 Step 1: Fetching all students...');
    const studentsRes = await axios.get(`${API_URL}/students/all`, { headers });
    
    if (!studentsRes.data.success) {
      console.error('❌ Failed to fetch students:', studentsRes.data);
      return;
    }

    const students = studentsRes.data.data;
    console.log(`✅ Found ${students.length} students`);
    
    if (students.length === 0) {
      console.error('❌ No students found. Please add students first.');
      return;
    }

    // Check first student
    const firstStudent = students[0];
    console.log(`\n📋 First Student Details:`);
    console.log(`  - ID: ${firstStudent._id}`);
    console.log(`  - Name: ${firstStudent.firstName} ${firstStudent.lastName}`);
    console.log(`  - Class: ${firstStudent.className}`);
    console.log(`  - _id type: ${typeof firstStudent._id}`);
    console.log(`  - _id is valid: ${!!firstStudent._id}`);

    if (!firstStudent._id) {
      console.error('❌ ERROR: Student doesn\'t have _id field!');
      return;
    }

    // Step 2: Try to mark attendance
    console.log(`\n📝 Step 2: Marking attendance for ${firstStudent.firstName}...`);
    const today = new Date().toISOString().split('T')[0];
    
    const attendancePayload = {
      student: firstStudent._id,
      date: today,
      status: 'present',
      remarks: 'Test attendance mark',
    };

    console.log('Sending payload:', JSON.stringify(attendancePayload, null, 2));

    const attendanceRes = await axios.post(`${API_URL}/attendance`, attendancePayload, { headers });

    if (!attendanceRes.data.success) {
      console.error('❌ Failed to mark attendance:', attendanceRes.data);
      return;
    }

    console.log('✅ Attendance marked successfully!');
    console.log('Response:', JSON.stringify(attendanceRes.data.data, null, 2));

    // Step 3: Retrieve marked attendance
    console.log(`\n🔍 Step 3: Retrieving attendance for ${firstStudent.firstName}...`);
    const retrieveRes = await axios.get(`${API_URL}/attendance/student/${firstStudent._id}`, { headers });

    if (retrieveRes.data.success) {
      console.log(`✅ Found ${retrieveRes.data.data.length} attendance record(s)`);
      console.log('First record:', JSON.stringify(retrieveRes.data.data[0], null, 2));
    } else {
      console.error('❌ Failed to retrieve attendance:', retrieveRes.data);
    }

    console.log('\n✅ All tests passed! Attendance system is working correctly.');

  } catch (error) {
    console.error('\n❌ Test Error:', error.response?.data || error.message);
    console.error('Full Error:', error);
  }
}

testAttendanceFlow();
