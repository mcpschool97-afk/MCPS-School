const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGE0ZmU5YzQyNGU5MDAxNjBhNjA1MCIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHNjaG9vbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiVXNlciIsImlhdCI6MTczNzExODYxMywiZXhwIjoxNzM3MjA1MDEzfQ.oCEBzzzpQ4Q6wvL5NvN7bUXXXo4OPqlEPRPlqY7gVA8';
const studentId = '678a5009c424e900160a606f';
const today = new Date().toISOString().split('T')[0];

const postData = JSON.stringify({
  studentId: studentId,
  date: today,
  status: 'Present',
  remarks: 'Test attendance'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/attendance',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length,
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

console.log('Sending POST request to http://localhost:5000/api/attendance');
console.log('Body:', postData);
req.write(postData);
req.end();
