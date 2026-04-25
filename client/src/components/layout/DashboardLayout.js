import React from 'react';
import { NavLink } from 'react-router-dom';
import './DashboardLayout.css';

export default function DashboardLayout({ title, navItems, children }) {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">{title}</h2>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
