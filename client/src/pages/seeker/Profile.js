import React, { useState } from 'react';
import { FiBriefcase, FiBookmark, FiFileText, FiUser, FiTrendingUp, FiUpload } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/my-applications', label: 'My Applications', icon: <FiFileText size={16} /> },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: <FiBookmark size={16} /> },
  { to: '/profile', label: 'Profile', icon: <FiUser size={16} /> },
];

export default function SeekerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
    education: user?.education || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'skills') fd.append(k, v.split(',').map((s) => s.trim()).filter(Boolean));
        else fd.append(k, v);
      });
      if (avatarFile) fd.append('avatar', avatarFile);
      if (resumeFile) fd.append('resume', resumeFile);
      const { data } = await API.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setPwLoading(true);
    try {
      await API.put('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setPwLoading(false); }
  };

  return (
    <DashboardLayout title="Job Seeker" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header"><h3>Profile Settings</h3></div>

        <div className="profile-avatar-section">
          <div className="avatar-preview">
            {user?.avatar ? (
              <img src={`http://localhost:5000/${user.avatar}`} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">{user?.name?.charAt(0)}</div>
            )}
          </div>
          <div>
            <label className="upload-btn">
              <FiUpload /> Upload Photo
              <input type="file" accept="image/*" hidden onChange={(e) => setAvatarFile(e.target.files[0])} />
            </label>
            {avatarFile && <p className="file-name">{avatarFile.name}</p>}
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell employers about yourself..." />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Experience</label>
              <textarea rows={2} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="3 years as Software Engineer at..." />
            </div>
            <div className="form-group">
              <label>Education</label>
              <textarea rows={2} value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="B.S. Computer Science, MIT..." />
            </div>
          </div>
          <div className="form-group">
            <label>Resume (PDF/DOC)</label>
            <label className="upload-btn">
              <FiUpload /> {resumeFile ? resumeFile.name : (user?.resume ? 'Replace Resume' : 'Upload Resume')}
              <input type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => setResumeFile(e.target.files[0])} />
            </label>
            {user?.resume && !resumeFile && (
              <a href={`http://localhost:5000/${user.resume}`} target="_blank" rel="noreferrer" className="resume-link">View current resume</a>
            )}
          </div>
          <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      <div className="section-card">
        <div className="section-card-header"><h3>Change Password</h3></div>
        <form onSubmit={handlePasswordChange} className="profile-form">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="save-btn" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
