import React from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FiBriefcase /> JobPortal
            </Link>
            <p>Connecting talented professionals with great companies. Find your dream job or hire top talent today.</p>
            <div className="footer-contact">
              <span><FiMail size={14} /> support@jobportal.com</span>
              <span><FiPhone size={14} /> +1 (555) 000-0000</span>
              <span><FiMapPin size={14} /> San Francisco, CA</span>
            </div>
          </div>

          <div className="footer-links">
            <h4>For Job Seekers</h4>
            <ul>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><Link to="/my-applications">My Applications</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>For Employers</h4>
            <ul>
              <li><Link to="/register">Post a Job</Link></li>
              <li><Link to="/employer">Employer Dashboard</Link></li>
              <li><Link to="/employer/jobs">Manage Jobs</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
