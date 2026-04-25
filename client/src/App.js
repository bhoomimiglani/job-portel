import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmployerProfile from './pages/EmployerProfile';
import NotFound from './pages/NotFound';

// Job Seeker pages
import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerApplications from './pages/seeker/Applications';
import SeekerSavedJobs from './pages/seeker/SavedJobs';
import SeekerProfile from './pages/seeker/Profile';

// Employer pages
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import MyJobs from './pages/employer/MyJobs';
import JobApplicants from './pages/employer/JobApplicants';
import EmployerProfilePage from './pages/employer/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';

// Route guards
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'employer') return <Navigate to="/employer" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 64px - 200px)' }}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/company/:id" element={<EmployerProfile />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password/:token" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />

        {/* Job Seeker */}
        <Route path="/dashboard" element={<PrivateRoute roles={['jobseeker']}><SeekerDashboard /></PrivateRoute>} />
        <Route path="/my-applications" element={<PrivateRoute roles={['jobseeker']}><SeekerApplications /></PrivateRoute>} />
        <Route path="/saved-jobs" element={<PrivateRoute roles={['jobseeker']}><SeekerSavedJobs /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute roles={['jobseeker']}><SeekerProfile /></PrivateRoute>} />

        {/* Employer */}
        <Route path="/employer" element={<PrivateRoute roles={['employer']}><EmployerDashboard /></PrivateRoute>} />
        <Route path="/employer/post-job" element={<PrivateRoute roles={['employer']}><PostJob /></PrivateRoute>} />
        <Route path="/employer/jobs" element={<PrivateRoute roles={['employer']}><MyJobs /></PrivateRoute>} />
        <Route path="/employer/jobs/:id/edit" element={<PrivateRoute roles={['employer']}><EditJob /></PrivateRoute>} />
        <Route path="/employer/jobs/:id/applicants" element={<PrivateRoute roles={['employer']}><JobApplicants /></PrivateRoute>} />
        <Route path="/employer/profile" element={<PrivateRoute roles={['employer']}><EmployerProfilePage /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/jobs" element={<PrivateRoute roles={['admin']}><AdminJobs /></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
