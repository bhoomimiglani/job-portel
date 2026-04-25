import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/ui/JobCard';
import Pagination from '../components/ui/Pagination';
import toast from 'react-hot-toast';
import './Jobs.css';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote', 'hybrid'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering', 'Legal', 'Operations'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    category: searchParams.get('category') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== 0));
      const { data } = await API.get('/jobs', { params });
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === 'jobseeker') {
      API.get('/users/saved-jobs').then(({ data }) => {
        setSavedJobs(data.jobs.map((j) => j._id));
      }).catch(() => {});
    }
  }, [user]);

  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value, page: 1 };
    setFilters(updated);
    const params = Object.fromEntries(Object.entries(updated).filter(([, v]) => v !== '' && v !== 0 && v !== 1));
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = { search: '', location: '', jobType: '', category: '', experienceLevel: '', salaryMin: '', page: 1 };
    setFilters(reset);
    setSearchParams({});
  };

  const handleSave = async (jobId) => {
    if (!user) return toast.error('Please login to save jobs');
    try {
      const { data } = await API.post(`/users/saved-jobs/${jobId}`);
      setSavedJobs(data.savedJobs);
      toast.success(data.saved ? 'Job saved!' : 'Job removed from saved');
    } catch {
      toast.error('Failed to save job');
    }
  };

  const hasFilters = filters.jobType || filters.category || filters.experienceLevel || filters.salaryMin;

  return (
    <div className="jobs-page">
      {/* Search header */}
      <div className="jobs-header">
        <div className="container">
          <h1>Find Jobs</h1>
          <div className="jobs-search-bar">
            <div className="search-input-wrap">
              <FiSearch />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            <div className="search-input-wrap">
              <input
                type="text"
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>
            <button className="filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
              <FiFilter /> Filters {hasFilters && <span className="filter-dot" />}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="jobs-layout">
          {/* Sidebar filters */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="clear-filters" onClick={clearFilters}>
                  <FiX size={14} /> Clear all
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Job Type</label>
              {JOB_TYPES.map((type) => (
                <label key={type} className="checkbox-label">
                  <input
                    type="radio"
                    name="jobType"
                    checked={filters.jobType === type}
                    onChange={() => updateFilter('jobType', filters.jobType === type ? '' : type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>Experience Level</label>
              {EXP_LEVELS.map((level) => (
                <label key={level} className="checkbox-label">
                  <input
                    type="radio"
                    name="experienceLevel"
                    checked={filters.experienceLevel === level}
                    onChange={() => updateFilter('experienceLevel', filters.experienceLevel === level ? '' : level)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{level}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label>Minimum Salary ($/yr)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={filters.salaryMin}
                onChange={(e) => updateFilter('salaryMin', e.target.value)}
              />
            </div>
          </aside>

          {/* Job listings */}
          <div className="jobs-content">
            <div className="jobs-count">
              {loading ? 'Loading...' : `${pagination.total} jobs found`}
            </div>

            {loading ? (
              <div className="jobs-loading">
                {[...Array(6)].map((_, i) => <div key={i} className="job-skeleton" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="no-jobs">
                <p>🔍 No jobs found matching your criteria.</p>
                <button onClick={clearFilters} className="btn-outline">Clear filters</button>
              </div>
            ) : (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSave={user?.role === 'jobseeker' ? handleSave : null}
                    isSaved={savedJobs.includes(job._id)}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) => updateFilter('page', p)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
