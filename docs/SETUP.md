# Setup & Installation Guide

## Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **Git** installed ([Download](https://git-scm.com/))
- **MongoDB** connection (local or MongoDB Atlas)
- **Code Editor** (VS Code recommended)

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/school-website

# JWT
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@schoolwebsite.com
ADMIN_PASSWORD=secure_password_change_this
```

### Step 4: Start Backend Server

```bash
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected: localhost
```

### Step 5: Test Backend

Open browser and navigate to:
- Health Check: `http://localhost:5000/health`
- Should return: `{ "status": "Server is running" }`

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_IMAGE_DOMAIN=res.cloudinary.com
NEXT_PUBLIC_ENABLE_PWA=true
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

### Step 5: Access Application

Open your browser and go to:
```
http://localhost:3000
```

---

## Environment Variables Explanation

### Backend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `development` \| `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Token encryption key | Random 32+ characters |
| `JWT_EXPIRE` | Token expiration | `7d` \| `24h` |
| `EMAIL_SERVICE` | Email provider | `gmail` \| `sendgrid` |
| `CLOUDINARY_*` | Image storage | Cloudinary credentials |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | `UA-XXXXX-Y` |
| `NEXT_PUBLIC_IMAGE_DOMAIN` | Image CDN domain | `res.cloudinary.com` |

---

## Database Setup

### Option 1: Local MongoDB

#### Install MongoDB Community Edition
- [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- [Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/)
- [Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

#### Start MongoDB (Windows)
```bash
# If installed as service, it starts automatically
# Or run manually:
mongod
```

#### Connection String
```
mongodb://localhost:27017/school-website
```

### Option 2: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Add IP address to whitelist
6. Use in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-website
```

---

## File Upload Setup (Cloudinary)

### Sign Up for Cloudinary

1. Visit [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

### Add to .env
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

---

## Email Service Setup (Gmail)

### Setup Gmail App Password

1. Enable 2-Factor Authentication on Gmail
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate app password for "Mail"
4. Copy the password

### Add to .env
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=generated-app-password
```

---

## Running Both Servers

### Option 1: Separate Terminals

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Option 2: Using npm-run-all (Windows/Mac)

Install globally:
```bash
npm install -g npm-run-all
```

Run from project root:
```bash
npm-run-all --parallel dev:backend dev:frontend
```

(Requires scripts in root package.json)

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error
```
MongooseError: Cannot connect to database
```

**Solution:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify MongoDB Atlas IP whitelist

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Ensure `CORS_ORIGIN` in backend .env matches frontend URL
- Default: `http://localhost:3000`

### Issue: Image Upload Not Working
```
Cloudinary error: Authentication failed
```

**Solution:**
- Verify Cloudinary credentials in .env
- Check API Key and Secret
- Ensure Cloud Name is correct

---

## Testing the Integration

### 1. Test Backend API

```bash
curl http://localhost:5000/health
```

Expected:
```json
{ "status": "Server is running" }
```

### 2. Test Frontend Connection

Check browser console (F12 → Console):
```javascript
fetch('http://localhost:5000/api/staff')
  .then(r => r.json())
  .then(d => console.log(d))
```

### 3. Test Database

From backend terminal:
```bash
# Create a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## Production Deployment

### Before Deploying

1. ✅ Set `NODE_ENV=production` in backend
2. ✅ Update `CORS_ORIGIN` to production frontend URL
3. ✅ Use production MongoDB Atlas database
4. ✅ Generate strong `JWT_SECRET`
5. ✅ Setup production email service
6. ✅ Configure production Cloudinary account
7. ✅ Update `NEXT_PUBLIC_API_URL` to production backend URL

### Deployment Platforms

#### Frontend: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Backend: Railway/DigitalOcean
See production deployment guides in docs folder.

---

## Next Steps

1. ✅ All systems running locally
2. Create all pages (refer to PAGES_AND_FEATURES.md)
3. Build API routes (check API documentation)
4. Connect components to API
5. Setup admin panel
6. Test thoroughly
7. Deploy to production

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

Happy coding! 🚀
