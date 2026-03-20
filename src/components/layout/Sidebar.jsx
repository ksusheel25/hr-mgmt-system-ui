import React from 'react';

const Sidebar = ({ currentUser, onLogout, activeScreen, setActiveScreen }) => {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid', section: 'Main' },
    { id: 'employees', label: 'Employees', icon: 'users', section: 'Main' },
    { id: 'attendance', label: 'Attendance', icon: 'clock', section: 'Main' },
    { id: 'leave', label: 'Leave', icon: 'calendar', section: 'Main' },
    { id: 'shifts', label: 'Shifts', icon: 'layers', section: 'Manage' },
    { id: 'calendar', label: 'Holiday Calendar', icon: 'calendar-alt', section: 'Manage' },
    { id: 'policy', label: 'Work Policy', icon: 'check-circle', section: 'Manage' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', section: 'Tools', badge: '3', badgeClass: 'badge-red' },
    { id: 'upload', label: 'Bulk Upload', icon: 'upload', section: 'Tools' },
  ];

  const handleNavClick = (screenId) => {
    setActiveScreen(screenId);
  };

  const renderIcon = (icon) => {
    const icons = {
      grid: <svg className="icon nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      users: <svg className="icon nav-icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
      clock: <svg className="icon nav-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
      calendar: <svg className="icon nav-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
      'calendar-alt': <svg className="icon nav-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/></svg>,
      layers: <svg className="icon nav-icon" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
      'check-circle': <svg className="icon nav-icon" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M12 3a9 9 0 100 18A9 9 0 0012 3z"/></svg>,
      bell: <svg className="icon nav-icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
      upload: <svg className="icon nav-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
    };
    return icons[icon] || null;
  };

  const sections = ['Main', 'Manage', 'Tools'];
  const currentSection = {};
  navItems.forEach(item => {
    if (!currentSection[item.section]) {
      currentSection[item.section] = [];
    }
    currentSection[item.section].push(item);
  });

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">HR</div>
        <span className="logo-text">Hive<span>HR</span></span>
      </div>

      {sections.map(section => (
        <div key={section} className="sidebar-section">
          <div className="sidebar-label">{section}</div>
          {currentSection[section]?.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeScreen === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {renderIcon(item.icon)}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`badge ${item.badgeClass}`} style={{ marginLeft: 'auto', padding: '1px 7px' }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
            {currentUser?.initials || 'AK'}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px' }}>
              {currentUser?.name || 'Arjun Kumar'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-sec)' }}>
              {currentUser?.role || 'HR Admin'}
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: '11px' }} onClick={onLogout}>
            Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
