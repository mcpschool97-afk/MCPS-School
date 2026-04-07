#!/bin/bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTAwMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVsaXRlc2Nob29sLmNvbSIsInJvbGUiOiJhZG1pbiIsImZpcnN0TmFtZSI6IkFkbWluaXN0cmF0b3IiLCJsYXN0TmFtZSI6IiIsImlhdCI6MTc0NDk4NzU4MCwiZXhwIjoxNzQ1MDc0MjUzfQ.XKUFz29fZBzYI52gFTcbOtvbUltk0p6x9KVXv8LaV3E"
curl -X POST http://localhost:5000/api/hero-carousel \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@frontend/public/favicon.ico" \
  -v
