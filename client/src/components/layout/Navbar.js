import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'employer') return '/employer';
    return '/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FiBriefcase className="brand-icon" />
          <span>JobPortal</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Find Jobs
          </NavLink>
          {user?.role === 'employer' && (
            <NavLink to="/employer/post-job" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Post a Job
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.avatar ? (
                  <img src={`http://localhost:5000/${user.avatar}`} alt={user.name} className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
                )}
                <span className="user-name">{user.name}</span>
                <FiChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-role">{user.role}</p>
                  </div>
                  <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FiUser size={15} /> Dashboard
                  </Link>
                  {user.role === 'jobseeker' && (
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiSettings size={15} /> Profile Settings
                    </Link>
                  )}
                  {user.role === 'employer' && (
                    <Link to="/employer/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiSettings size={15} /> Company Profile
                    </Link>
                  )}
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
