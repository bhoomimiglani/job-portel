import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiBookmark, FiFileText, FiUser, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobCard from '../../components/ui/JobCard';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/my-applications', label: 'My Applications', icon: <FiFileText size={16} /> },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: <FiBookmark size={16} /> },
  { to: '/profile', label: 'Profile', icon: <FiUser size={16} /> },
];

export default function SeekerSavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const { data } = await API.get('/users/saved-jobs');
      setJobs(data.jobs);
    } catch { toast.error('Failed to load saved jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleUnsave = async (jobId) => {
    try {
      await API.post(`/users/saved-jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Removed from saved jobs');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <DashboardLayout title="Job Seeker" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header">
          <h3>Saved Jobs ({jobs.length})</h3>
        </div>
        {loading ? <div className="loading-text">Loading...</div> : jobs.length === 0 ? (
          <div className="empty-state">
            <FiBookmark size={32} />
            <p>No saved jobs yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} onSave={handleUnsave} isSaved={true} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
