import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/jobs/${id}`).then(({ data }) => {
      const j = data.job;
      setForm({
        title: j.title, description: j.description, requirements: j.requirements || '',
        responsibilities: j.responsibilities || '', location: j.location,
        jobType: j.jobType, category: j.category, salaryMin: j.salaryMin || '',
        salaryMax: j.salaryMax || '', salaryPeriod: j.salaryPeriod,
        skills: j.skills?.join(', ') || '', experienceLevel: j.experienceLevel,
        education: j.education || '', deadline: j.deadline ? j.deadline.split('T')[0] : '',
        status: j.status,
      });
    }).catch(() => { toast.error('Job not found'); navigate('/employer/jobs'); });
  }, [id, navigate]);

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
      await API.put(`/jobs/${id}`, payload);
      toast.success('Job updated!');
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <DashboardLayout title="Employer" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header"><h3>Edit Job</h3></div>
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-group">
            <label>Job Title *</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select value={form.jobType} onChange={(e) => set('jobType', e.target.value)}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Min Salary</label>
              <input type="number" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Max Salary</label>
              <input type="number" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea required rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Responsibilities</label>
            <textarea rows={4} value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Requirements</label>
            <textarea rows={4} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => set('skills', e.target.value)} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/employer/jobs')}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
