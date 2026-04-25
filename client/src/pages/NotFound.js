import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ padding: '0.65rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 8, fontWeight: 600 }}>
        Go Home
      </Link>
    </div>
  );
}
