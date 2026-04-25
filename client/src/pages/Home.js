import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import API from '../api/axios';
import JobCard from '../components/ui/JobCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Technology', icon: '💻', color: '#2563eb' },
  { name: 'Marketing', icon: '📣', color: '#7c3aed' },
  { name: 'Design', icon: '🎨', color: '#db2777' },
  { name: 'Finance', icon: '💰', color: '#16a34a' },
  { name: 'Healthcare', icon: '🏥', color: '#0891b2' },
  { name: 'Education', icon: '📚', color: '#d97706' },
  { name: 'Sales', icon: '📈', color: '#dc2626' },
  { name: 'Engineering', icon: '⚙️', color: '#374151' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 });

  useEffect(() => {
    API.get('/jobs/featured').then(({ data }) => setFeaturedJobs(data.jobs)).catch(() => {});
    API.get('/jobs/categories').then(({ data }) => {
      const total = data.categories.reduce((s, c) => s + c.count, 0);
      setStats(prev => ({ ...prev, jobs: total }));
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Over 10,000+ jobs available</div>
          <h1>Find Your <span className="gradient-text">Dream Job</span> Today</h1>
          <p>Connect with top employers and discover opportunities that match your skills and ambitions.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <FiMapPin className="search-icon" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">Search Jobs</button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <FiBriefcase />
              <span><strong>{stats.jobs.toLocaleString()}+</strong> Active Jobs</span>
            </div>
            <div className="stat">
              <FiUsers />
              <span><strong>5,000+</strong> Companies</span>
            </div>
            <div className="stat">
              <FiTrendingUp />
              <span><strong>50,000+</strong> Candidates</span>
            </div>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="hero-card floating">
            <div className="hc-icon">💼</div>
            <div><strong>Software Engineer</strong><br /><small>Google · Remote</small></div>
          </div>
          <div className="hero-card floating delay-1">
            <div className="hc-icon">🎨</div>
            <div><strong>UI/UX Designer</strong><br /><small>Apple · San Francisco</small></div>
          </div>
          <div className="hero-card floating delay-2">
            <div className="hc-icon">📊</div>
            <div><strong>Data Analyst</strong><br /><small>Meta · New York</small></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <Link to="/jobs" className="see-all">See all jobs <FiArrowRight /></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?category=${cat.name}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <div className="section-header">
              <h2>Featured Jobs</h2>
              <Link to="/jobs" className="see-all">View all <FiArrowRight /></Link>
            </div>
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-card seeker">
              <h3>Looking for a Job?</h3>
              <p>Create your profile and apply to thousands of jobs with one click.</p>
              <Link to="/register" className="cta-btn">Get Started Free</Link>
            </div>
            <div className="cta-card employer">
              <h3>Hiring Talent?</h3>
              <p>Post your job and reach thousands of qualified candidates instantly.</p>
              <Link to="/register?role=employer" className="cta-btn">Post a Job</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
