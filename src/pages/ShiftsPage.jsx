import React from 'react';

const ShiftsPage = ({ onCreateClick }) => {
  const shifts = [
    { id: 1, name: 'General Shift', time: 'Mon–Fri · 9:00 AM – 6:00 PM · 9 hrs', employees: 148, color: '#4F46E5' },
    { id: 2, name: 'Morning Shift', time: 'Mon–Sat · 6:00 AM – 2:00 PM · 8 hrs', employees: 62, color: '#7C3AED' },
    { id: 3, name: 'Evening Shift', time: 'Mon–Sat · 2:00 PM – 10:00 PM · 8 hrs', employees: 24, color: '#059669' },
    { id: 4, name: 'Night Shift', time: 'Mon–Sun · 10:00 PM – 6:00 AM · 8 hrs', employees: 14, color: '#DC2626' },
  ];

  const getEmployeeBadgeClass = (employees) => {
    if (employees > 60) return 'badge-green';
    if (employees > 20) return 'badge-blue';
    return 'badge-gray';
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Shift Management</div>
          <div className="page-sub">4 active shift configurations</div>
        </div>
        <button className="btn btn-primary" onClick={onCreateClick}>
          + Create Shift
        </button>
      </div>

      <div className="shift-list">
        {shifts.map((shift) => (
          <div key={shift.id} className="shift-item">
            <div className="shift-color" style={{ background: shift.color }}></div>
            <div>
              <div className="shift-name">{shift.name}</div>
              <div className="shift-time">{shift.time}</div>
            </div>
            <span className={`badge ${getEmployeeBadgeClass(shift.employees)}`} style={{ marginLeft: 'auto' }}>
              {shift.employees} employees
            </span>
            <div className="shift-actions">
              <button className="action-btn">✏️</button>
              <button className="action-btn">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftsPage;
