import React, { useState, useEffect } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiSearch, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Pagination from '../../components/ui/Pagination';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FiTrendingUp size={16} />, end: true },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={16} /> },
  { to: '/admin/jobs', label: 'Jobs', icon: <FiBriefcase size={16} /> },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (role) params.role = role;
      if (search) params.search = search;
      const { data } = await API.get('/admin/users', { params });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [role, search]);

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/toggle-status`);
      setUsers((prev) => prev.map((u) => u._id === id ? data.user : u));
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers(pagination.page);
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <DashboardLayout title="Admin Panel" navItems={NAV}>
      <div className="section-card">
        <div className="section-card-header">
          <h3>Users ({pagination.total})</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--gray-200)', borderRadius: 6, padding: '0.35rem 0.75rem' }}>
              <FiSearch size={14} color="var(--gray-400)" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.875rem', width: 140 }}
              />
            </div>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="filter-select">
              <option value="">All Roles</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? <div className="loading-text">Loading...</div> : (
          <>
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong>{u.companyName && <><br /><small style={{ color: 'var(--gray-400)' }}>{u.companyName}</small></>}</td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
                        background: u.role === 'admin' ? '#fee2e2' : u.role === 'employer' ? '#dbeafe' : '#d1fae5',
                        color: u.role === 'admin' ? '#991b1b' : u.role === 'employer' ? '#1e40af' : '#065f46',
                        textTransform: 'capitalize',
                      }}>{u.role}</span>
                    </td>
                    <td>
                      <span style={{ color: u.isActive ? 'var(--success)' : 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
                        {u.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {u.role !== 'admin' && (
                          <button
                            className="link-btn"
                            onClick={() => handleToggleStatus(u._id)}
                            style={{ color: u.isActive ? 'var(--warning)' : 'var(--success)' }}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button className="icon-btn danger" onClick={() => handleDelete(u._id)}><FiTrash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchUsers} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
