# Project Structure & Architecture

## Directory Tree

```
School website/
│
├── frontend/                          # Next.js React Frontend
│   ├── public/                        # Static assets (favicon, images)
│   ├── src/
│   │   ├── pages/                    # Next.js page routes
│   │   │   ├── _app.tsx              # App wrapper
│   │   │   ├── _document.tsx         # HTML document
│   │   │   ├── index.tsx             # Home page
│   │   │   ├── about.tsx             # About Us
│   │   │   ├── academics.tsx         # Academics
│   │   │   ├── gallery.tsx           # Gallery
│   │   │   ├── staff.tsx             # Staff Directory
│   │   │   ├── contact.tsx           # Contact Us
│   │   │   ├── admissions.tsx        # Admissions
│   │   │   ├── facilities.tsx        # Facilities
│   │   │   ├── news.tsx              # News & Announcements
│   │   │   ├── achievements.tsx      # Achievements
│   │   │   └── admin/                # Admin pages
│   │   │       ├── dashboard.tsx
│   │   │       ├── news/
│   │   │       ├── staff/
│   │   │       ├── gallery/
│   │   │       └── inquiries/
│   │   │
│   │   ├── components/               # Reusable React components
│   │   │   ├── Layout.tsx            # Main layout wrapper
│   │   │   ├── Navigation/           # Navigation bar
│   │   │   │   └── Header.tsx
│   │   │   ├── Footer/               # Footer section
│   │   │   │   └── Footer.tsx
│   │   │   ├── Hero/                 # Hero sections
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── Gallery/              # Gallery components
│   │   │   │   ├── GalleryGrid.tsx
│   │   │   │   └── ImageModal.tsx
│   │   │   ├── Staff/                # Staff display components
│   │   │   │   ├── StaffCard.tsx
│   │   │   │   └── StaffGrid.tsx
│   │   │   ├── Forms/                # Form components
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── AdmissionForm.tsx
│   │   │   │   └── InquiryForm.tsx
│   │   │   ├── Cards/                # Card components
│   │   │   │   ├── NewsCard.tsx
│   │   │   │   ├── FacilityCard.tsx
│   │   │   │   └── EventCard.tsx
│   │   │   └── Common/               # Common UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   │
│   │   ├── styles/                   # Global and module styles
│   │   │   ├── globals.css           # Global Tailwind imports
│   │   │   ├── Home.module.scss      # Page-specific styles
│   │   │   ├── about.module.scss
│   │   │   └── variables.scss        # SCSS variables
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── api.ts                # API client setup
│   │   │   ├── constants.ts          # Constants & config
│   │   │   ├── validators.ts         # Form validation
│   │   │   ├── formatters.ts         # Date/number formatting
│   │   │   └── helpers.ts            # General helpers
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useApi.ts             # API fetching
│   │   │   ├── useAuth.ts            # Authentication
│   │   │   ├── useForm.ts            # Form handling
│   │   │   └── usePagination.ts      # Pagination logic
│   │   │
│   │   ├── context/                  # React Context
│   │   │   ├── AuthContext.tsx       # Auth state
│   │   │   ├── ThemeContext.tsx      # Theme state
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   └── api/                      # API integration
│   │       ├── client.ts             # Axios client
│   │       └── endpoints.ts          # API endpoints
│   │
│   ├── .env.example                  # Example environment variables
│   ├── package.json                  # Frontend dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── next.config.js                # Next.js config
│   ├── tailwind.config.js            # Tailwind config
│   ├── postcss.config.js             # PostCSS config
│   └── .eslintrc.json               # ESLint config
│
├── backend/                           # Express.js Backend
│   ├── src/
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js               # User schema
│   │   │   ├── Staff.js              # Staff schema
│   │   │   ├── News.js               # News schema
│   │   │   ├── Gallery.js            # Gallery schema
│   │   │   ├── Admission.js          # Admission form schema
│   │   │   ├── Event.js              # Events schema
│   │   │   ├── Inquiry.js            # Contact inquiry schema
│   │   │   ├── Facility.js           # Facilities schema
│   │   │   └── Achievement.js        # Achievements schema
│   │   │
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.js               # Authentication routes
│   │   │   ├── staff.js              # Staff routes
│   │   │   ├── news.js               # News routes
│   │   │   ├── gallery.js            # Gallery routes
│   │   │   ├── admissions.js         # Admission routes
│   │   │   ├── inquiries.js          # Contact routes
│   │   │   ├── events.js             # Events routes
│   │   │   ├── facilities.js         # Facilities routes
│   │   │   ├── achievements.js       # Achievements routes
│   │   │   └── admin.js              # Admin routes
│   │   │
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js     # Auth logic
│   │   │   ├── staffController.js    # Staff logic
│   │   │   ├── newsController.js     # News logic
│   │   │   ├── galleryController.js  # Gallery logic
│   │   │   ├── admissionController.js
│   │   │   ├── inquiryController.js
│   │   │   ├── eventController.js
│   │   │   ├── facilityController.js
│   │   │   └── achievementController.js
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.js               # JWT authentication
│   │   │   ├── errorHandler.js       # Error handling
│   │   │   ├── validation.js         # Input validation
│   │   │   ├── roleCheck.js          # Role-based access
│   │   │   └── rateLimiter.js        # Rate limiting
│   │   │
│   │   ├── config/                   # Configuration
│   │   │   ├── database.js           # MongoDB connection
│   │   │   ├── cloudinary.js         # Cloudinary setup
│   │   │   ├── email.js              # Email configuration
│   │   │   └── constants.js          # Constants
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── logger.js             # Winston logger
│   │   │   ├── emailService.js       # Email sending
│   │   │   ├── fileUpload.js         # File upload handler
│   │   │   ├── validators.js         # Joi validators
│   │   │   └── helpers.js            # Helper functions
│   │   │
│   │   └── app.js                    # Express app setup
│   │
│   ├── server.js                     # Entry point
│   ├── .env.example                  # Example environment
│   ├── package.json                  # Dependencies
│   └── .eslintrc.json               # ESLint config
│
├── docs/                             # Documentation
│   ├── TECH_STACK.md                 # Tech stack details
│   ├── SETUP.md                      # Installation guide
│   ├── PAGES_AND_FEATURES.md         # Pages & features
│   ├── API.md                        # API documentation
│   ├── DATABASE_SCHEMA.md            # Database schema
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── PROJECT_STRUCTURE.md          # This file
│
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml           # Frontend CI/CD
│       └── backend-ci.yml            # Backend CI/CD
│
├── .gitignore                        # Git ignore rules
├── README.md                         # Main README
└── LICENSE                           # License file
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
│                     (Users accessing)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ Vercel  │
                    │ (CDN)   │
                    └────┬────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
    ┌───▼───────────────┐        ┌───────▼────────┐
    │   Next.js App     │        │   Cloudinary   │
    │   (Frontend)      │        │   (Images)     │
    ├───────────────────┤        └────────────────┘
    │ - React Components│
    │ - Tailwind CSS    │
    │ - React Query     │
    │ - Framer Motion   │
    └────────┬──────────┘
             │
             │ HTTP/REST
             │
    ┌────────▼────────────────────────┐
    │   Express.js API                │
    │   (DigitalOcean/Railway)        │
    ├─────────────────────────────────┤
    │ - Authentication (JWT)          │
    │ - CORS & Security               │
    │ - Rate Limiting                 │
    │ - Request Logging               │
    └────────┬───────────┬────────────┘
             │           │
     ┌───────▼─┐   ┌─────▼──────────┐
     │ MongoDB │   │  Nodemailer    │
     │ (Atlas) │   │  (Email)       │
     └─────────┘   └────────────────┘
```

---

## User Role Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Users                                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
├─ Public Users (Read-only)               ─────────────────────┤
│   - View home page                                           │
│   - Read news and announcements                             │
│   - View gallery                                            │
│   - Browse staff directory                                  │
│   - Submit contact forms                                    │
│   - Submit admissions                                       │
│                                                              │
├─ Admin Users (Full access)              ─────────────────────┤
│   - Manage staff directory                                  │
│   - Create/edit news                                        │
│   - Manage gallery uploads                                  │
│   - View and respond to inquiries                          │
│   - Manage admissions                                       │
│   - Manage events and calendar                             │
│   - View analytics                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Frontend Data Flow
```
User Action
    ↓
React Component
    ↓
React Hook (useQuery/useMutation)
    ↓
Axios API Client
    ↓
Backend API
    ↓
Response Data
    ↓
React State Update (React Query Cache)
    ↓
Component Re-render
    ↓
Updated UI
```

### Backend Data Flow
```
HTTP Request
    ↓
Express Middleware (CORS, Auth, Validation)
    ↓
Route Handler
    ↓
Controller Logic
    ↓
Database Query (Mongoose)
    ↓
Database Response (MongoDB)
    ↓
Format Response
    ↓
Send HTTP Response
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Production Environment                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Domain: schoolwebsite.com                                 │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │           Cloudflare CDN (Global)                     │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ - DDoS Protection       - SSL/TLS                     │ │
│  │ - Cache Management      - DNS                         │ │
│  └───────────────────┬─────────────────────────────────┘ │
│                      │                                    │
│      ┌───────────────┼───────────────┐                   │
│      │               │               │                   │
│  ┌───▼────────┐  ┌───▼────────┐  ┌──▼────────┐         │
│  │ Vercel     │  │ Railway    │  │ MongoDB   │         │
│  │ (Frontend) │  │ (Backend)  │  │ Atlas     │         │
│  └────────────┘  └────────────┘  └───────────┘         │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │        Monitoring & Analytics                    │   │
│  │  - Sentry (Error tracking)                      │   │
│  │  - Datadog (Performance)                        │   │
│  │  - Google Analytics (User behavior)             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
Code Changes
    ↓
Git Commit
    ↓
Push to GitHub
    ↓
├─ GitHub Actions CI/CD (trigger)
│   ├─ Run Linting (ESLint)
│   ├─ Run Tests (Jest)
│   ├─ Build Project
│   └─ If all pass →
│
├─ Frontend Deploy (Vercel)
│   └─ Auto-deploy to production
│
└─ Backend Deploy (Railway)
    └─ Auto-deploy to production
```

---

## File Naming Conventions

### Frontend
- **Pages**: `kebab-case.tsx` (e.g., `about-us.tsx`)
- **Components**: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Styles**: `kebab-case.module.scss` (e.g., `hero-section.module.scss`)

### Backend
- **Models**: `PascalCase.js` (e.g., `User.js`)
- **Routes**: `kebab-case.js` (e.g., `admin-routes.js`)
- **Controllers**: `camelCaseController.js` (e.g., `staffController.js`)
- **Middleware**: `camelCase.js` (e.g., `errorHandler.js`)

---

## Performance Targets

- **Frontend (Lighthouse)**
  - Performance: > 90
  - Accessibility: > 95
  - Best Practices: > 95
  - SEO: > 95

- **Backend**
  - API Response Time: < 100ms
  - Database Query Time: < 50ms
  - Uptime: 99.9%

- **Database**
  - Read Performance: < 10ms
  - Write Performance: < 50ms
  - Backup Frequency: Daily
