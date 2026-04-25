import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiDollarSign, FiCalendar, FiUsers, FiEye, FiBookmark, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';
import './JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  useEffect(() => {
    if (user?.role === 'jobseeker') {
      API.get('/users/saved-jobs').then(({ data }) => {
        setIsSaved(data.jobs.some((j) => j._id === id));
      }).catch(() => {});
      API.get('/applications/my-applications').then(({ data }) => {
        setHasApplied(data.applications.some((a) => a.job?._id === id));
      }).catch(() => {});
    }
  }, [user, id]);

  const handleSave = async () => {
    if (!user) return toast.error('Please login to save jobs');
    try {
      const { data } = await API.post(`/users/saved-jobs/${id}`);
      setIsSaved(data.saved);
      toast.success(data.saved ? 'Job saved!' : 'Removed from saved');
    } catch { toast.error('Failed to save job'); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resumeFile) formData.append('resume', resumeFile);
      await API.post(`/applications/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setHasApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!job) return null;

  const salary = job.salaryMin || job.salaryMax
    ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k / ${job.salaryPeriod}`
    : 'Not specified';

  return (
    <div className="job-detail-page">
      <div className="container">
        <Link to="/jobs" className="back-link"><FiArrowLeft /> Back to Jobs</Link>

        <div className="job-detail-layout">
          {/* Main content */}
          <div className="job-detail-main">
            <div className="job-detail-header">
              <div className="company-logo-lg">
                {job.employer?.companyLogo ? (
                  <img src={`http://localhost:5000/${job.employer.companyLogo}`} alt={job.companyName} />
                ) : (
                  <div className="logo-placeholder-lg">{job.companyName?.charAt(0)}</div>
                )}
              </div>
              <div className="job-detail-title">
                <h1>{job.title}</h1>
                <Link to={`/company/${job.employer?._id}`} className="company-link">
                  {job.companyName} <FiExternalLink size={13} />
                </Link>
                <div className="job-detail-meta">
                  <span><FiMapPin size={14} /> {job.location}</span>
                  <span><FiBriefcase size={14} /> {job.jobType}</span>
                  <span><FiDollarSign size={14} /> {salary}</span>
                  <span><FiEye size={14} /> {job.views} views</span>
                  <span><FiUsers size={14} /> {job.applicationsCount} applicants</span>
                </div>
              </div>
              <div className="job-detail-actions">
                <StatusBadge status={job.status} />
                {job.deadline && (
                  <p className="deadline"><FiCalendar size={13} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div className="job-detail-body">
              <section>
                <h2>Job Description</h2>
                <div className="rich-text">{job.description}</div>
              </section>
              {job.responsibilities && (
                <section>
                  <h2>Responsibilities</h2>
                  <div className="rich-text">{job.responsibilities}</div>
                </section>
              )}
              {job.requirements && (
                <section>
                  <h2>Requirements</h2>
                  <div className="rich-text">{job.requirements}</div>
                </section>
              )}
              {job.skills?.length > 0 && (
                <section>
                  <h2>Required Skills</h2>
                  <div className="skills-list">
                    {job.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="job-detail-sidebar">
            <div className="apply-card">
              {user?.role === 'jobseeker' ? (
                hasApplied ? (
                  <div className="applied-badge">✅ Already Applied</div>
                ) : (
                  <button className="apply-btn" onClick={() => setShowApplyModal(true)} disabled={job.status !== 'active'}>
                    Apply Now
                  </button>
                )
              ) : !user ? (
                <Link to="/login" className="apply-btn">Login to Apply</Link>
              ) : null}
              <button className={`save-job-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                <FiBookmark /> {isSaved ? 'Saved' : 'Save Job'}
              </button>
            </div>

            <div className="job-overview-card">
              <h3>Job Overview</h3>
              <ul>
                <li><span>Category</span><strong>{job.category}</strong></li>
                <li><span>Job Type</span><strong style={{ textTransform: 'capitalize' }}>{job.jobType}</strong></li>
                <li><span>Experience</span><strong style={{ textTransform: 'capitalize' }}>{job.experienceLevel}</strong></li>
                <li><span>Salary</span><strong>{salary}</strong></li>
                {job.education && <li><span>Education</span><strong>{job.education}</strong></li>}
                <li><span>Posted</span><strong>{new Date(job.createdAt).toLocaleDateString()}</strong></li>
              </ul>
            </div>

            <div className="company-card">
              <h3>About the Company</h3>
              <Link to={`/company/${job.employer?._id}`} className="company-info">
                <div className="company-logo-sm">
                  {job.employer?.companyLogo ? (
                    <img src={`http://localhost:5000/${job.employer.companyLogo}`} alt={job.companyName} />
                  ) : (
                    <div className="logo-placeholder-sm">{job.companyName?.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <strong>{job.companyName}</strong>
                  {job.employer?.industry && <p>{job.employer.industry}</p>}
                </div>
              </Link>
              {job.employer?.companyDescription && (
                <p className="company-desc">{job.employer.companyDescription.slice(0, 150)}...</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for {job.title}</h2>
            <p className="modal-company">{job.companyName}</p>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  rows={6}
                  placeholder="Tell the employer why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Resume (PDF/DOC) — optional if you have one on profile</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
