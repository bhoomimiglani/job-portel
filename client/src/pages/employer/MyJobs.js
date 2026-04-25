import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiList, FiUser, FiTrendingUp, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/employer', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/employer/post-job', label: 'Post a Job', icon: <FiPlusCircle size={16} /> },
  { to: '/employer/jobs', label: 'My Jobs', icon: <FiList size={16} /> },
  { to: '/employer/profile', label: 'Company Profile', icon: <FiUser size={16} /> },
];

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await API.get('/jobs/employer/my-jobs', { params });
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? All applications will also be deleted.')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs(pagination.page);
    } catch { toast.error('Failed to delete job'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/jobs/${id}`, { status });
      toast.success('Status updated');
      fetchJobs(pagination.page);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <DashboardLayout title="Employer" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header">
          <h3>My Jobs ({pagination.total})</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
            <Link to="/employer/post-job" className="btn-primary-sm">+ Post Job</Link>
          </div>
        </div>

        {loading ? <div className="loading-text">Loading...</div> : jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs found</p>
            <Link to="/employer/post-job" className="btn-primary-sm">Post Your First Job</Link>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Type</th><th>Status</th><th>Applicants</th><th>Posted</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td><strong>{job.title}</strong><br /><small style={{ color: 'var(--gray-400)' }}>{job.location}</small></td>
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
                    <td>
                      <Link to={`/employer/jobs/${job._id}/applicants`} className="table-link">
                        <FiUsers size={13} style={{ marginRight: 4 }} />{job.applicationsCount}
                      </Link>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/employer/jobs/${job._id}/edit`} className="icon-btn"><FiEdit2 size={15} /></Link>
                        <button className="icon-btn danger" onClick={() => handleDelete(job._id)}><FiTrash2 size={15} /></button>
                      </div>
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
