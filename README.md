# Job Portal — MERN Stack

A full-featured job portal with role-based authentication (Job Seeker, Employer, Admin).

## 🚀 Quick Start

**✅ READY TO USE** - Both servers are configured and running!
- **live demo**:https://job-portel-ohpgmst05-bhoomimiglani1111-8919s-projects.vercel.app/
- **Frontend**: http://localhost:3000 (React development server)
- **Backend**: http://localhost:5000 (Express API server)
- **Database**: MongoDB connected successfully

### 🔑 Demo Accounts (Ready to use)
| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin** | admin@demo.com | demo123 | Full system access |
| **Employer** | employer@demo.com | demo123 | Post jobs, manage applications |
| **Job Seeker** | seeker@demo.com | demo123 | Browse jobs, apply, save jobs |

## Tech Stack
- **Backend**: Node.js, Express 5, MongoDB, Mongoose, JWT, express-session
- **Frontend**: React 18, React Router 6, Axios, react-hot-toast, react-icons
- **Auth**: JWT tokens + server-side sessions, bcryptjs password hashing

## Features

### Job Seekers
- Browse and search jobs with filters (type, category, experience, salary)
- Apply with cover letter and resume upload
- Save/bookmark jobs
- Track application status (pending → reviewed → shortlisted → interview → offered/rejected)
- Profile management with resume upload

### Employers
- Post, edit, and manage job listings
- View and manage applicants with detailed profiles
- Update application statuses with email notifications
- Company profile page

### Admin
- Dashboard with platform statistics
- Manage all users (activate/deactivate/delete)
- Manage all jobs (feature/unfeature, change status, delete)

## 🛠 Manual Setup (if needed)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Configure environment
Edit `job-portal/.env`:
```
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_secret_here
SESSION_SECRET=your_session_secret_here
CLIENT_URL=http://localhost:3000
```

### 2. Install dependencies
```bash
# Backend
cd job-portal
npm install

# Frontend
cd client
npm install
```

### 3. Seed demo data
```bash
cd job-portal
npm run seed
```

### 4. Start development servers

**Option A - Both servers together:**
```bash
cd job-portal
npm run dev
```

**Option B - Separate terminals:**

Terminal 1 (Backend):
```bash
cd job-portal
npm start
```

Terminal 2 (Frontend):
```bash
cd job-portal/client
npm start
```

## 📁 Project Structure
```
job-portal/
├── src/
│   ├── app.js              # Express app
│   ├── config/db.js        # MongoDB connection
│   ├── models/             # Mongoose models
│   ├── controllers/        # Route handlers
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth, upload, error handling
│   ├── utils/              # JWT, email helpers
│   └── scripts/seed.js     # Demo data seeder
├── uploads/                # Uploaded files (auto-created)
├── server.js               # Entry point
└── client/                 # React frontend
    └── src/
        ├── api/            # Axios instance
        ├── context/        # Auth context
        ├── components/     # Shared components
        └── pages/          # Route pages
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Employer only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Apply to job
- `PUT /api/applications/:id` - Update application status

### Users & Admin
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/stats` - Platform statistics

## 🚨 Troubleshooting

### If servers aren't running:
```bash
# Check running processes
# Backend should be on port 5000
# Frontend should be on port 3000

# Restart backend
cd job-portal
npm run dev

# Restart frontend (new terminal)
cd job-portal/client
npm start
```

### Common Issues:
1. **MongoDB not connected**: Ensure MongoDB is running locally
2. **Port conflicts**: Change PORT in `.env` if needed
3. **File uploads not working**: Check `uploads/` directory exists
