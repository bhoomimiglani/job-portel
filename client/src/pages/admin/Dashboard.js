import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBriefcase, FiFileText, FiTrendingUp, FiShield } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={16} /> },
  { to: '/admin/jobs', label: 'Jobs', icon: <FiBriefcase size={16} /> },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => setData(data)).catch(() => toast.error('Failed to load stats'));
  }, []);

  if (!data) return <div className="page-loading"><div className="spinner" /></div>;

  const { stats, recentJobs, recentUsers } = data;

  return (
    <DashboardLayout title="Admin Panel" navItems={NAV}>
      <div className="dashboard-welcome">
        <h1><FiShield style={{ marginRight: 8 }} />Admin Dashboard</h1>
        <p>Platform overview and management</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#eff6ff' },
          { label: 'Job Seekers', value: stats.jobseekers, icon: '🧑‍💼', color: '#f5f3ff' },
          { label: 'Employers', value: stats.employers, icon: '🏢', color: '#f0fdf4' },
          { label: 'Total Jobs', value: stats.totalJobs, icon: '📋', color: '#fef3c7' },
          { label: 'Active Jobs', value: stats.activeJobs, icon: '✅', color: '#f0fdf4' },
          { label: 'Applications', value: stats.totalApplications, icon: '📄', color: '#fdf2f8' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="section-card">
          <div className="section-card-header">
            <h3>Recent Jobs</h3>
            <Link to="/admin/jobs" className="link-btn">View all</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Company</th><th>Status</th></tr></thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.companyName}</td>
                  <td><StatusBadge status={job.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <h3>Recent Users</h3>
            <Link to="/admin/users" className="link-btn">View all</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
