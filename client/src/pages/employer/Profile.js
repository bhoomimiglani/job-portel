import React, { useState } from 'react';
import { FiPlusCircle, FiList, FiUser, FiTrendingUp, FiUpload } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import '../employer/JobForm.css';

const NAV = [
  { to: '/employer', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/employer/post-job', label: 'Post a Job', icon: <FiPlusCircle size={16} /> },
  { to: '/employer/jobs', label: 'My Jobs', icon: <FiList size={16} /> },
  { to: '/employer/profile', label: 'Company Profile', icon: <FiUser size={16} /> },
];

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function EmployerProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    companyName: user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
    companyDescription: user?.companyDescription || '',
    companySize: user?.companySize || '',
    industry: user?.industry || '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logoFile) fd.append('companyLogo', logoFile);
      const { data } = await API.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout title="Employer" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header"><h3>Company Profile</h3></div>

        <div className="profile-avatar-section">
          <div className="avatar-preview">
            {user?.companyLogo ? (
              <img src={`http://localhost:5000/${user.companyLogo}`} alt="Logo" style={{ borderRadius: 8 }} />
            ) : (
              <div className="avatar-placeholder" style={{ borderRadius: 8 }}>{user?.companyName?.charAt(0)}</div>
            )}
          </div>
          <div>
            <label className="upload-btn">
              <FiUpload /> Upload Company Logo
              <input type="file" accept="image/*" hidden onChange={(e) => setLogoFile(e.target.files[0])} />
            </label>
            {logoFile && <p className="file-name">{logoFile.name}</p>}
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Contact Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Technology" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company Website</label>
              <input value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Company Size</label>
              <select value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                <option value="">Select size</option>
                {SIZES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
          </div>
          <div className="form-group">
            <label>Company Description</label>
            <textarea rows={4} value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} placeholder="Tell candidates about your company..." />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
