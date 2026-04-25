import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiBookmark, FiFileText, FiUser, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/my-applications', label: 'My Applications', icon: <FiFileText size={16} /> },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: <FiBookmark size={16} /> },
  { to: '/profile', label: 'Profile', icon: <FiUser size={16} /> },
];

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    API.get('/applications/my-applications?limit=5').then(({ data }) => setApplications(data.applications)).catch(() => {});
    API.get('/users/saved-jobs').then(({ data }) => setSavedCount(data.jobs.length)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Applications', value: applications.length, icon: '📄', color: '#eff6ff' },
    { label: 'Saved Jobs', value: savedCount, icon: '🔖', color: '#f5f3ff' },
    { label: 'Interviews', value: applications.filter((a) => a.status === 'interview').length, icon: '🎯', color: '#f0fdf4' },
    { label: 'Offers', value: applications.filter((a) => a.status === 'offered').length, icon: '🎉', color: '#fef3c7' },
  ];

  return (
    <DashboardLayout title="Job Seeker" navItems={NAV}>
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p>Here's your job search overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile completion */}
      {(!user?.resume || !user?.skills?.length || !user?.bio) && (
        <div className="profile-alert">
          <p>⚡ Complete your profile to get better job matches</p>
          <Link to="/profile" className="profile-alert-btn">Complete Profile</Link>
        </div>
      )}

      <div className="section-card">
        <div className="section-card-header">
          <h3>Recent Applications</h3>
          <Link to="/my-applications" className="link-btn">View all</Link>
        </div>
        {applications.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase size={32} />
            <p>No applications yet</p>
            <Link to="/jobs" className="btn-primary-sm">Browse Jobs</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Job</th><th>Company</th><th>Status</th><th>Applied</th></tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td><Link to={`/jobs/${app.job?._id}`} className="table-link">{app.job?.title}</Link></td>
                  <td>{app.job?.companyName}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
