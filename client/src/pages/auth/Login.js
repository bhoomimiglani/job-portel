import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employer') navigate('/employer');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><FiBriefcase /> JobPortal</div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <div className="input-wrap">
              <FiMail className="input-icon" />
              <input
                type="email" required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>
              Password
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'} required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <div className="demo-btns">
            <button onClick={() => setForm({ email: 'seeker@demo.com', password: 'demo123' })}>Job Seeker</button>
            <button onClick={() => setForm({ email: 'employer@demo.com', password: 'demo123' })}>Employer</button>
            <button onClick={() => setForm({ email: 'admin@demo.com', password: 'demo123' })}>Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
