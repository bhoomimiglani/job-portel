import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiBookmark, FiFileText, FiUser, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/my-applications', label: 'My Applications', icon: <FiFileText size={16} /> },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: <FiBookmark size={16} /> },
  { to: '/profile', label: 'Profile', icon: <FiUser size={16} /> },
];

const STATUSES = ['', 'pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'];

export default function SeekerApplications() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status) params.status = status;
      const { data } = await API.get('/applications/my-applications', { params });
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [status]);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await API.put(`/applications/${id}/withdraw`);
      toast.success('Application withdrawn');
      fetchApplications(pagination.page);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to withdraw'); }
  };

  return (
    <DashboardLayout title="Job Seeker" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header">
          <h3>My Applications ({pagination.total})</h3>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
          </select>
        </div>

        {loading ? <div className="loading-text">Loading...</div> : applications.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase size={32} />
            <p>No applications found</p>
            <Link to="/jobs" className="btn-primary-sm">Browse Jobs</Link>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr><th>Job</th><th>Company</th><th>Type</th><th>Status</th><th>Applied</th><th>Action</th></tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td><Link to={`/jobs/${app.job?._id}`} className="table-link">{app.job?.title}</Link></td>
                    <td>{app.job?.companyName}</td>
                    <td style={{ textTransform: 'capitalize' }}>{app.job?.jobType}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!['offered', 'rejected', 'withdrawn'].includes(app.status) && (
                        <button className="link-btn danger" onClick={() => handleWithdraw(app._id)}>Withdraw</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchApplications} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
