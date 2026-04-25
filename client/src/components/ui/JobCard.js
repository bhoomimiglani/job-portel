import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiBriefcase, FiDollarSign, FiBookmark } from 'react-icons/fi';
import './JobCard.css';

const JOB_TYPE_COLORS = {
  'full-time': '#16a34a',
  'part-time': '#d97706',
  'contract': '#7c3aed',
  'internship': '#0891b2',
  'remote': '#2563eb',
  'hybrid': '#db2777',
};

export default function JobCard({ job, onSave, isSaved }) {
  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n;
    if (job.salaryMin && job.salaryMax) return `$${fmt(job.salaryMin)} - $${fmt(job.salaryMax)}`;
    if (job.salaryMin) return `From $${fmt(job.salaryMin)}`;
    return `Up to $${fmt(job.salaryMax)}`;
  };

  const salary = formatSalary();
  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <div className={`job-card ${job.isFeatured ? 'featured' : ''}`}>
      {job.isFeatured && <span className="featured-badge">Featured</span>}
      <div className="job-card-header">
        <div className="company-logo">
          {job.companyLogo ? (
            <img src={`http://localhost:5000/${job.companyLogo}`} alt={job.companyName} />
          ) : (
            <div className="logo-placeholder">{job.companyName?.charAt(0)}</div>
          )}
        </div>
        <div className="job-meta">
          <h3 className="job-title">
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <p className="company-name">{job.companyName}</p>
        </div>
        {onSave && (
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => { e.preventDefault(); onSave(job._id); }}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
          >
            <FiBookmark size={16} />
          </button>
        )}
      </div>

      <div className="job-tags">
        <span className="tag" style={{ color: JOB_TYPE_COLORS[job.jobType], background: `${JOB_TYPE_COLORS[job.jobType]}15` }}>
          <FiBriefcase size={12} /> {job.jobType}
        </span>
        <span className="tag">
          <FiMapPin size={12} /> {job.location}
        </span>
        {salary && (
          <span className="tag">
            <FiDollarSign size={12} /> {salary}/{job.salaryPeriod}
          </span>
        )}
      </div>

      <div className="job-card-footer">
        <span className="job-category">{job.category}</span>
        <span className="job-date">
          <FiClock size={12} /> {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
        </span>
      </div>
    </div>
  );
}
