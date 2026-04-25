import React from 'react';

const STATUS_STYLES = {
  pending:     { bg: '#fef3c7', color: '#92400e' },
  reviewed:    { bg: '#dbeafe', color: '#1e40af' },
  shortlisted: { bg: '#d1fae5', color: '#065f46' },
  interview:   { bg: '#ede9fe', color: '#5b21b6' },
  offered:     { bg: '#d1fae5', color: '#065f46' },
  rejected:    { bg: '#fee2e2', color: '#991b1b' },
  withdrawn:   { bg: '#f3f4f6', color: '#374151' },
  active:      { bg: '#d1fae5', color: '#065f46' },
  closed:      { bg: '#fee2e2', color: '#991b1b' },
  draft:       { bg: '#f3f4f6', color: '#374151' },
  pending_job: { bg: '#fef3c7', color: '#92400e' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.65rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      textTransform: 'capitalize',
    }}>
      {status?.replace('_', ' ')}
    </span>
  );
}
