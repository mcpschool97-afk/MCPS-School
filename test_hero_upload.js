const https = require('https');
const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTAwMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVsaXRlc2Nob29sLmNvbSIsInJvbGUiOiJhZG1pbiIsImZpcnN0TmFtZSI6IkFkbWluaXN0cmF0b3IiLCJsYXN0TmFtZSI6IiIsImlhdCI6MTc0NDk4NzU4MCwiZXhwIjoxNzQ1MDc0MjUzfQ.XKUFz29fZBzYI52gFTcbOtvbUltk0p6x9KVXv8LaV3E';

const form = new FormData();
form.append('image', fs.createReadStream('frontend/public/favicon.ico'));

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/hero-carousel',
  method: 'POST',
  headers: {
    ...form.getHeaders(),
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

form.pipe(req);
