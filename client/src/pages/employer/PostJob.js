import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiList, FiUser, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './JobForm.css';

const NAV = [
  { to: '/employer', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/employer/post-job', label: 'Post a Job', icon: <FiPlusCircle size={16} /> },
  { to: '/employer/jobs', label: 'My Jobs', icon: <FiList size={16} /> },
  { to: '/employer/profile', label: 'Company Profile', icon: <FiUser size={16} /> },
];

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering', 'Legal', 'Operations', 'Other'];
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote', 'hybrid'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];

const INITIAL = {
  title: '', description: '', requirements: '', responsibilities: '',
  location: '', jobType: 'full-time', category: 'Technology',
  salaryMin: '', salaryMax: '', salaryPeriod: 'yearly',
  skills: '', experienceLevel: 'entry', education: '', deadline: '',
  status: 'active',
};

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
      };
      await API.post('/jobs', payload);
      toast.success('Job posted successfully!');
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Employer" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header"><h3>Post a New Job</h3></div>
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-group">
            <label>Job Title *</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Senior React Developer" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select required value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Job Type *</label>
              <select required value={form.jobType} onChange={(e) => set('jobType', e.target.value)}>
                {JOB_TYPES.map((t) => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
                {EXP_LEVELS.map((l) => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input required value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. New York, NY or Remote" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Salary ($)</label>
              <input type="number" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} placeholder="50000" />
            </div>
            <div className="form-group">
              <label>Max Salary ($)</label>
              <input type="number" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} placeholder="80000" />
            </div>
            <div className="form-group">
              <label>Salary Period</label>
              <select value={form.salaryPeriod} onChange={(e) => set('salaryPeriod', e.target.value)}>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea required rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the role, team, and what you're looking for..." />
          </div>

          <div className="form-group">
            <label>Responsibilities</label>
            <textarea rows={4} value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} placeholder="Key responsibilities of this role..." />
          </div>

          <div className="form-group">
            <label>Requirements</label>
            <textarea rows={4} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="Required qualifications and experience..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="React, Node.js, MongoDB..." />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input value={form.education} onChange={(e) => set('education', e.target.value)} placeholder="Bachelor's degree or equivalent" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Application Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/employer/jobs')}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
