import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMail } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><FiBriefcase /> JobPortal</div>
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        {sent ? (
          <div className="success-msg">
            <p>✅ Check your email for the password reset link.</p>
            <Link to="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <FiMail className="input-icon" />
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-switch"><Link to="/login">← Back to Login</Link></p>
      </div>
    </div>
  );
}
