const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTAwMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVsaXRlc2Nob29sLmNvbSIsInJvbGUiOiJhZG1pbiIsImZpcnN0TmFtZSI6IkFkbWluaXN0cmF0b3IiLCJsYXN0TmFtZSI6IiIsImlhdCI6MTc3NTQxNzAyNSwiZXhwIjoxNzc1NTAzNDI1fQ.mV3EljhHR3blfYzGMbWNk7jO1C21ibAfzgW8wnhe32M';
const studentId = '678a5009c424e900160a606f';
const today = new Date().toISOString().split('T')[0];

const postData = JSON.stringify({
  student: studentId,
  date: today,
  status: 'present',
  remarks: 'Test attendance'
});

console.log('Testing attendance endpoint');
console.log('Date:', today);
console.log('Student ID:', studentId);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/attendance',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length,
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Status:', res.statusCode);
    console.log('Response Body:', data);
    
    try {
      const parsed = JSON.parse(data);
      if (parsed.success) {
        console.log('\n✅ SUCCESS - Attendance saved!');
        console.log('Record ID:', parsed.data._id);
      } else {
        console.log('\n❌ FAILED - Error:', parsed.message || parsed.error);
      }
    } catch (e) {
      console.log('\n⚠️ Could not parse response');
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ REQUEST ERROR:', error.message);
});

console.log('Sending request...\n');
req.write(postData);
req.end();
