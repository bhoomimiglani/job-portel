import React, { useState, useEffect } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiSearch, FiStar, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={16} /> },
  { to: '/admin/jobs', label: 'Jobs', icon: <FiBriefcase size={16} /> },
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (status) params.status = status;
      if (search) params.search = search;
      const { data } = await API.get('/admin/jobs', { params });
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [status, search]);

  const handleFeature = async (id) => {
    try {
      const { data } = await API.put(`/admin/jobs/${id}/feature`);
      setJobs((prev) => prev.map((j) => j._id === id ? data.job : j));
      toast.success(data.job.isFeatured ? 'Job featured!' : 'Job unfeatured');
    } catch { toast.error('Failed to update'); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await API.put(`/admin/jobs/${id}/status`, { status: newStatus });
      setJobs((prev) => prev.map((j) => j._id === id ? data.job : j));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs(pagination.page);
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <DashboardLayout title="Admin Panel" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header">
          <h3>All Jobs ({pagination.total})</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--gray-200)', borderRadius: 6, padding: '0.35rem 0.75rem' }}>
              <FiSearch size={14} color="var(--gray-400)" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.875rem', width: 140 }}
              />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {loading ? <div className="loading-text">Loading...</div> : (
          <>
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Company</th><th>Type</th><th>Status</th><th>Apps</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td><strong>{job.title}</strong><br /><small style={{ color: 'var(--gray-400)' }}>{job.location}</small></td>
                    <td>{job.companyName}</td>
                    <td style={{ textTransform: 'capitalize' }}>{job.jobType}</td>
                    <td>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                        className="filter-select"
                      >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td>{job.applicationsCount}</td>
                    <td>
                      <button
                        onClick={() => handleFeature(job._id)}
                        style={{ background: 'none', border: 'none', color: job.isFeatured ? '#f59e0b' : 'var(--gray-300)', fontSize: '1.1rem' }}
                        title={job.isFeatured ? 'Unfeature' : 'Feature'}
                      >
                        <FiStar fill={job.isFeatured ? '#f59e0b' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <button className="icon-btn danger" onClick={() => handleDelete(job._id)}><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchJobs} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
