import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiPlusCircle, FiList, FiUser, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const NAV = [
  { to: '/employer', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/employer/post-job', label: 'Post a Job', icon: <FiPlusCircle size={16} /> },
  { to: '/employer/jobs', label: 'My Jobs', icon: <FiList size={16} /> },
  { to: '/employer/profile', label: 'Company Profile', icon: <FiUser size={16} /> },
];

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [totalApps, setTotalApps] = useState(0);

  useEffect(() => {
    API.get('/jobs/employer/my-jobs?limit=5').then(({ data }) => {
      setJobs(data.jobs);
      setTotalApps(data.jobs.reduce((s, j) => s + j.applicationsCount, 0));
    }).catch(() => {});
  }, []);

  const activeJobs = jobs.filter((j) => j.status === 'active').length;

  return (
    <DashboardLayout title="Employer" navItems={NAV}>
      <div className="dashboard-welcome">
        <h1>Welcome, {user?.companyName || user?.name}! 👋</h1>
        <p>Manage your job postings and applicants</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff' }}>📋</div>
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4' }}>✅</div>
          <div className="stat-value">{activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f5f3ff' }}>👥</div>
          <div className="stat-value">{totalApps}</div>
          <div className="stat-label">Total Applicants</div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h3>Recent Job Postings</h3>
          <Link to="/employer/jobs" className="link-btn">View all</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase size={32} />
            <p>No jobs posted yet</p>
            <Link to="/employer/post-job" className="btn-primary-sm">Post Your First Job</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Applicants</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td><strong>{job.title}</strong></td>
                  <td><StatusBadge status={job.status} /></td>
                  <td><FiUsers size={13} style={{ marginRight: 4 }} />{job.applicationsCount}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/employer/jobs/${job._id}/applicants`} className="link-btn">Applicants</Link>
                    {' · '}
                    <Link to={`/employer/jobs/${job._id}/edit`} className="link-btn">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
