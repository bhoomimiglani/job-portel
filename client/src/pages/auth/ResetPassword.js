import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBriefcase, FiLock } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await API.put(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><FiBriefcase /> JobPortal</div>
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Enter your new password</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>New Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input type="password" required minLength={6} placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input type="password" required placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
