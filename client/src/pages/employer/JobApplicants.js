import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlusCircle, FiList, FiUser, FiTrendingUp, FiDownload, FiMail } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './JobApplicants.css';

const NAV = [
  { to: '/employer', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/employer/post-job', label: 'Post a Job', icon: <FiPlusCircle size={16} /> },
  { to: '/employer/jobs', label: 'My Jobs', icon: <FiList size={16} /> },
  { to: '/employer/profile', label: 'Company Profile', icon: <FiUser size={16} /> },
];

const STATUSES = ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected'];

export default function JobApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchApps = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await API.get(`/applications/job/${id}`, { params });
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load applicants'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, [statusFilter]);

  const handleStatusUpdate = async (appId, status, extra = {}) => {
    try {
      await API.put(`/applications/${appId}/status`, { status, ...extra });
      toast.success('Status updated');
      fetchApps(pagination.page);
      if (selected?._id === appId) setSelected((prev) => ({ ...prev, status }));
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <DashboardLayout title="Employer" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Applicants ({pagination.total})</h3>
            <Link to="/employer/jobs" className="back-link-sm">← Back to Jobs</Link>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
          </select>
        </div>

        {loading ? <div className="loading-text">Loading...</div> : applications.length === 0 ? (
          <div className="empty-state"><p>No applicants yet</p></div>
        ) : (
          <div className="applicants-layout">
            <div className="applicants-list">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className={`applicant-card ${selected?._id === app._id ? 'selected' : ''}`}
                  onClick={() => setSelected(app)}
                >
                  <div className="applicant-avatar">
                    {app.applicant?.avatar ? (
                      <img src={`http://localhost:5000/${app.applicant.avatar}`} alt={app.applicant.name} />
                    ) : (
                      <div className="avatar-placeholder-sm">{app.applicant?.name?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="applicant-info">
                    <strong>{app.applicant?.name}</strong>
                    <p>{app.applicant?.email}</p>
                    <p>{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
              <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchApps} />
            </div>

            {selected && (
              <div className="applicant-detail">
                <div className="applicant-detail-header">
                  <div className="applicant-avatar-lg">
                    {selected.applicant?.avatar ? (
                      <img src={`http://localhost:5000/${selected.applicant.avatar}`} alt={selected.applicant.name} />
                    ) : (
                      <div className="avatar-placeholder-lg">{selected.applicant?.name?.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h3>{selected.applicant?.name}</h3>
                    <p><FiMail size={13} /> {selected.applicant?.email}</p>
                    {selected.applicant?.phone && <p>📞 {selected.applicant.phone}</p>}
                    {selected.applicant?.location && <p>📍 {selected.applicant.location}</p>}
                  </div>
                </div>

                {selected.applicant?.skills?.length > 0 && (
                  <div className="detail-section">
                    <h4>Skills</h4>
                    <div className="skills-list">
                      {selected.applicant.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                )}

                {selected.applicant?.experience && (
                  <div className="detail-section">
                    <h4>Experience</h4>
                    <p>{selected.applicant.experience}</p>
                  </div>
                )}

                {selected.applicant?.education && (
                  <div className="detail-section">
                    <h4>Education</h4>
                    <p>{selected.applicant.education}</p>
                  </div>
                )}

                {selected.coverLetter && (
                  <div className="detail-section">
                    <h4>Cover Letter</h4>
                    <p className="cover-letter">{selected.coverLetter}</p>
                  </div>
                )}

                {selected.resume && (
                  <div className="detail-section">
                    <a href={`http://localhost:5000/${selected.resume}`} target="_blank" rel="noreferrer" className="resume-download-btn">
                      <FiDownload /> Download Resume
                    </a>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Update Status</h4>
                  <div className="status-actions">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        className={`status-btn ${selected.status === s ? 'active' : ''}`}
                        onClick={() => handleStatusUpdate(selected._id, s)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
