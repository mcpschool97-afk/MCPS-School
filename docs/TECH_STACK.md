# Tech Stack & Architecture Documentation

## Overview

This school website is built using a modern, scalable JavaScript/Node.js stack designed to meet CBSE (Central Board of Secondary Education) compliance requirements while providing excellent performance, security, and maintainability.

---

## Frontend Stack

### Core Framework: **Next.js 14**

#### Why Next.js?
- **Server-Side Rendering (SSR)**: Improves SEO for pages like home, about, admissions
- **Static Site Generation (SSG)**: Pre-renders static pages for maximum performance
- **API Routes**: Built-in backend capabilities for simple operations
- **Image Optimization**: Automatic image optimization and lazy loading
- **Bundle Size Reduction**: Automatic code splitting
- **File-based Routing**: Intuitive page structure

#### Key Features Used:
```
- Pages Router for page-based routing
- Image component for optimized images
- Built-in font optimization
- Automatic Static Optimization
- ISR (Incremental Static Regeneration) for news/updates
```

### Styling: **Tailwind CSS + SCSS Modules**

#### Why Tailwind CSS?
- Utility-first CSS framework
- Rapid UI development
- Smaller bundle size compared to traditional CSS frameworks
- Easy to maintain with predefined design tokens
- Mobile-first responsive design
- Built-in dark mode support

#### Implementation:
```
- Global styles with globals.css
- Component-level SCSS modules
- Tailwind utilities for responsive design
- Custom color palette for school branding
```

### State Management & Data Fetching: **React Query + Context API**

#### React Query Benefits:
- Automatic API caching
- Background synchronization
- Request deduplication
- Automatic retry logic
- Pagination support for gallery/news
- Minimal boilerplate

#### Context API Usage:
- Authentication context
- Media/gallery context
- Theme context (dark/light mode)

### Form Handling: **React Hook Form + Zod**

#### Advantages:
- Minimal re-renders
- Easy validation with Zod schema
- Better performance than Formik
- Built-in error handling
- Type-safe form data

### Component Library: **Shadcn/ui**

Provides accessible, pre-built components:
- Dialogs for modals
- Dropdown menus
- Navigation components
- Form components
- Toast notifications

### Animation: **Framer Motion**

- Smooth page transitions
- Gallery animations
- Scroll-based animations
- Non-blocking animations with `reduceMotion` support

---

## Backend Stack

### Runtime: **Node.js 18+**

### Framework: **Express.js**

#### Architecture: **MVC (Model-View-Controller)**

```
express/
├── Models (Data Layer)
├── Controllers (Business Logic)
├── Routes (URL Mappings)
└── Middleware (Cross-cutting concerns)
```

#### Why Express?
- Minimal and flexible
- Huge ecosystem of middleware
- Fast and lightweight
- Perfect for REST APIs
- Easy to scale horizontally

### Database: **MongoDB with Mongoose ODM**

#### Data Models:

```javascript
// User Model
{
  email, password, firstName, lastName,
  role (admin/staff/user), phone,
  profileImage, isActive, timestamps
}

// Staff Model
{
  firstName, lastName, email, phone,
  qualification, designation, department,
  experience, profileImage, bio, timestamps
}

// News Model
{
  title, slug, content, excerpt,
  featuredImage, category, author,
  isPublished, publishedAt, views, timestamps
}

// Admission Model (to be created)
{
  firstName, lastName, email, phone,
  class, qualification, parentName,
  address, status, submittedAt, timestamps
}

// Gallery Model (to be created)
{
  title, description, category,
  image/video url, uploadedBy,
  views, published, timestamps
}

// Event Model (to be created)
{
  title, description, startDate, endDate,
  location, image, eventType, timestamps
}
```

#### Why MongoDB?
- Document-oriented (flexible schema)
- Horizontal scalability
- Great for rapidly evolving applications
- Excellent for content management
- MongoDB Atlas for cloud hosting

### Authentication: **JWT (JSON Web Tokens) + bcryptjs**

#### Implementation:
- Password hashing with bcryptjs (10 rounds)
- JWT tokens (7-day expiry)
- Refresh tokens for persistent sessions
- Role-based access control (RBAC)
- Protected routes with middleware

### File Storage: **Cloudinary**

#### Usage:
- Staff profile images
- Gallery images and videos
- News featured images
- Document uploads (PDFs, etc.)
- Automatic image optimization
- CDN distribution

#### Alternative: AWS S3
- For higher volume or specific privacy requirements

### Email Service: **Nodemailer/SendGrid**

#### Use Cases:
- Email verification
- Admission confirmations
- Contact form submissions
- Newsletter/announcements
- Password reset

### Input Validation: **Joi**

- Schema validation for all API endpoints
- Consistent error responses
- Type checking and sanitization

### Security Middleware

1. **Helmet.js**
   - Sets security HTTP headers
   - Prevents XSS attacks
   - Protects against clickjacking

2. **Express CORS**
   - Cross-Origin Resource Sharing
   - Prevents unauthorized API access
   - Configurable origins

3. **Express Rate Limiting**
   - Prevents brute force attacks
   - 100 requests per 15 minutes per IP
   - Configurable per endpoint

4. **bcryptjs**
   - Password hashing
   - Salt rounds: 10

### Logging: **Winston**

- Structured logging
- File and console transports
- Log levels: info, error, warn, debug
- Daily log rotation ready

---

## API Architecture

### REST API Design

#### Base URL
```
http://localhost:5000/api
```

#### Endpoint Structure
```
GET    /api/staff                  - List all staff
GET    /api/staff/:id              - Get staff details
POST   /api/staff                  - Create staff (Admin only)
PUT    /api/staff/:id              - Update staff (Admin only)
DELETE /api/staff/:id              - Delete staff (Admin only)

GET    /api/news                   - List published news
GET    /api/news/:slug             - Get news article
POST   /api/news                   - Create news (Admin)
PUT    /api/news/:id               - Update news (Admin)

GET    /api/gallery                - List gallery items
POST   /api/gallery                - Upload gallery item (Admin)

POST   /api/admissions             - Submit admission form
GET    /api/admissions             - Get applications (Admin)

POST   /api/inquiries              - Submit contact form inquiry
GET    /api/inquiries              - Get inquiries (Admin)

POST   /api/auth/login             - User login
POST   /api/auth/register          - User registration
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - User logout
```

#### Response Format
```javascript
// Success Response
{
  success: true,
  message: "Operation successful",
  data: { /* payload */ }
}

// Error Response
{
  success: false,
  message: "Error description",
  errors: [ /* validation errors */ ]
}
```

---

## Deployment Architecture

### Frontend Deployment: **Vercel**

```
Development  → Push to GitHub
                      ↓
             Vercel checks on PR
                      ↓
           Deploy to preview URL
                      ↓
           Merge to main branch
                      ↓
         Automatic production deploy
```

**Benefits:**
- Zero-config Next.js deployment
- Automatic HTTPS
- Global CDN
- Environment variables management
- Preview deployments

### Backend Deployment Options

#### Option 1: **DigitalOcean**
- App Platform for managed deployment
- Automatic scaling
- Easy database integration
- Cost-effective

#### Option 2: **Railway.app**
- Simple deployment
- GitHub integration
- Built-in database support

#### Option 3: **AWS EC2**
- Full control
- Better for enterprise
- More complex setup

### Database Hosting: **MongoDB Atlas**

- Fully managed cloud service
- Automatic backups
- Multi-region replication
- Built-in security
- Simple connection string

---

## Performance Optimization Strategies

### Frontend Performance

1. **Image Optimization**
   - Next.js Image component
   - Automatic format conversion (WebP)
   - Lazy loading
   - Responsive image sizing

2. **Code Splitting**
   - Automatic by Next.js
   - Route-based code splitting
   - Dynamic imports for heavy libraries

3. **Caching Strategy**
   - HTTP caching headers
   - React Query automatic caching
   - Browser caching
   - CDN caching via Cloudflare

4. **Metrics to Track**
   - First Contentful Paint (FCP) < 1.8s
   - Largest Contentful Paint (LCP) < 2.5s
   - Cumulative Layout Shift (CLS) < 0.1

### Backend Performance

1. **Database Optimization**
   - Index frequently queried fields
   - Connection pooling via Mongoose
   - Query optimization
   - Pagination for large datasets

2. **Caching**
   - Redis for session storage (future)
   - HTTP response caching
   - Database query caching

3. **Rate Limiting**
   - Prevent abuse
   - Protect against DDoS
   - Configurable per route

---

## Security Best Practices

### Frontend Security
1. HTTPS only
2. CSP (Content Security Policy) headers
3. CORS properly configured
4. No sensitive data in localStorage
5. Regular dependency updates
6. Input sanitization

### Backend Security
1. JWT token validation
2. Password hashing with bcryptjs
3. SQL/NoSQL injection prevention (Mongoose schemas)
4. CORS whitelist
5. Rate limiting
6. Input validation with Joi
7. Environment variables for secrets
8. HTTPS enforcement

### Data Privacy
- GDPR compliance
- Data encryption in transit (HTTPS)
- Secure password storage
- No sensitive data logging

---

## Development Workflow

### Local Development

```bash
# Clone repository
git clone <repo-url>

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with local MongoDB URI and other configs

# Start backend
npm run dev

# Start frontend (in another terminal)
npm run dev
```

### Version Control
- Feature branches for new features
- Pull request reviews
- Automated tests on PR
- Protection on main branch

### CI/CD Pipeline
```
Push to GitHub
    ↓
GitHub Actions trigger
    ↓
Run linting & tests
    ↓
Build check
    ↓
If all pass: Auto-deploy to production
    ↓
If any fail: Notify developer
```

---

## Scalability Considerations

### Horizontal Scaling
1. **Load Balancing**: Nginx/HAProxy in front of multiple backend instances
2. **Database Replication**: MongoDB sharding for large datasets
3. **CDN**: Cloudflare for static asset distribution

### Vertical Scaling
1. Upgrade server resources
2. Database query optimization
3. Caching layer implementation

### Future Enhancements
1. Redis caching layer
2. Elasticsearch for advanced search
3. GraphQL API (alongside REST)
4. Message queue (RabbitMQ/Redis) for async operations
5. Microservices architecture (if needed)

---

## Monitoring & Analytics

### Application Performance Monitoring (APM)
- Vercel Analytics for frontend
- Backend logging with Winston
- Error tracking (Sentry recommended)

### User Analytics
- Google Analytics integration (optional)
- Heatmaps (optional)
- User behavior tracking

---

## Summary

This tech stack provides:
✅ **Performance**: Fast page loads, optimized images, efficient caching
✅ **Scalability**: Horizontal and vertical scaling capabilities
✅ **Security**: Multiple layers of protection
✅ **Maintainability**: Clean code structure, well-organized
✅ **Developer Experience**: Modern tools, good documentation
✅ **CBSE Compliance**: All required pages and features

The architecture is designed to be easy to extend with new features while maintaining performance and security standards.
