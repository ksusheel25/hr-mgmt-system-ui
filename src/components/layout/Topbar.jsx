import React from 'react';

const Topbar = ({ title, onNotificationClick }) => {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="search-box">
        <svg style={{ width: '14px', height: '14px', flexShrink: 0, color: 'var(--text-ter)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input placeholder="Search..." />
      </div>
      <div className="notif-btn" onClick={onNotificationClick}>
        <svg style={{ width: '16px', height: '16px', color: 'var(--text-sec)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <div className="notif-dot"></div>
      </div>
      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>AK</div>
    </div>
  );
};

export default Topbar;
