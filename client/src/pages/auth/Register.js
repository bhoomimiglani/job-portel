import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'jobseeker',
    companyName: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name}!`);
      if (user.role === 'employer') navigate('/employer');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><FiBriefcase /> JobPortal</div>
        <h1>Create account</h1>
        <p className="auth-subtitle">Join thousands of professionals</p>

        {/* Role selector */}
        <div className="role-selector">
          <button
            type="button"
            className={form.role === 'jobseeker' ? 'active' : ''}
            onClick={() => setForm({ ...form, role: 'jobseeker' })}
          >
            👤 Job Seeker
          </button>
          <button
            type="button"
            className={form.role === 'employer' ? 'active' : ''}
            onClick={() => setForm({ ...form, role: 'employer' })}
          >
            🏢 Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Full Name</label>
            <div className="input-wrap">
              <FiUser className="input-icon" />
              <input type="text" required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          {form.role === 'employer' && (
            <div className="field">
              <label>Company Name</label>
              <div className="input-wrap">
                <FiHome className="input-icon" />
                <input type="text" required placeholder="Acme Corp" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </div>
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <div className="input-wrap">
              <FiMail className="input-icon" />
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'} required
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="field">
            <label>Confirm Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input
                type="password" required
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
