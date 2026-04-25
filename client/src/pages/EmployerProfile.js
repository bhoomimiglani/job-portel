import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiGlobe, FiUsers, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import API from '../api/axios';
import JobCard from '../components/ui/JobCard';
import toast from 'react-hot-toast';
import './EmployerProfile.css';

export default function EmployerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/users/employer/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => toast.error('Company not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!data) return null;

  const { employer, jobs } = data;

  return (
    <div className="employer-profile-page">
      <div className="container">
        <Link to="/jobs" className="back-link"><FiArrowLeft /> Back to Jobs</Link>

        <div className="company-header">
          <div className="company-logo-xl">
            {employer.companyLogo ? (
              <img src={`http://localhost:5000/${employer.companyLogo}`} alt={employer.companyName} />
            ) : (
              <div className="logo-xl-placeholder">{employer.companyName?.charAt(0)}</div>
            )}
          </div>
          <div className="company-header-info">
            <h1>{employer.companyName}</h1>
            <div className="company-meta">
              {employer.industry && <span>🏭 {employer.industry}</span>}
              {employer.location && <span><FiMapPin size={14} /> {employer.location}</span>}
              {employer.companySize && <span><FiUsers size={14} /> {employer.companySize} employees</span>}
              {employer.companyWebsite && (
                <a href={employer.companyWebsite} target="_blank" rel="noreferrer" className="website-link">
                  <FiGlobe size={14} /> Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="company-body">
          {employer.companyDescription && (
            <div className="company-about">
              <h2>About the Company</h2>
              <p>{employer.companyDescription}</p>
            </div>
          )}

          <div className="company-jobs">
            <h2>Open Positions ({jobs.length})</h2>
            {jobs.length === 0 ? (
              <p style={{ color: 'var(--gray-400)' }}>No open positions at the moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {jobs.map((job) => <JobCard key={job._id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
