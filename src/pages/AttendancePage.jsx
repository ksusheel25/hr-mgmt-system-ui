import React, { useState } from 'react';

const AttendancePage = () => {
  const [attendance] = useState([
    { id: 1, emp: 'Arjun Kumar', avatar: 'AK', color: '#4F46E5', checkIn: '09:01 AM', checkOut: '06:14 PM', hours: '9h 13m', status: 'Present' },
    { id: 2, emp: 'Priya Sharma', avatar: 'PS', color: '#7C3AED', checkIn: '08:47 AM', checkOut: '—', hours: 'ongoing', status: 'Checked In' },
    { id: 3, emp: 'Rahul Mehta', avatar: 'RM', color: '#059669', checkIn: '—', checkOut: '—', hours: '—', status: 'On Leave' },
    { id: 4, emp: 'Ananya Nair', avatar: 'AN', color: '#DC2626', checkIn: '09:22 AM', checkOut: '06:00 PM', hours: '8h 38m', status: 'Present' },
    { id: 5, emp: 'Vikram Joshi', avatar: 'VJ', color: '#D97706', checkIn: '—', checkOut: '—', hours: '—', status: 'Absent' },
  ]);

  const getStatusBadge = (status) => {
    if (status === 'Present') return 'badge-green';
    if (status === 'Absent') return 'badge-red';
    if (status === 'On Leave') return 'badge-amber';
    if (status === 'Checked In') return 'badge-blue';
    return 'badge-gray';
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Attendance</div>
          <div className="page-sub">Today — 18 March 2026</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline">Export CSV</button>
          <select className="select-box">
            <option>March 2026</option>
          </select>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Present</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>211</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Absent</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>15</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">On Leave</div>
          <div className="stat-value" style={{ color: 'var(--amber)' }}>22</div>
        </div>
      </div>

      <div className="toolbar">
        <input className="input-box" placeholder="Search employee..." />
        <select className="select-box">
          <option>All Departments</option>
          <option>Engineering</option>
        </select>
        <select className="select-box">
          <option>All Status</option>
          <option>Present</option>
          <option>Absent</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att.id}>
                <td>
                  <div className="emp-row">
                    <div className="emp-avatar" style={{ background: att.color, width: '28px', height: '28px', fontSize: '11px' }}>
                      {att.avatar}
                    </div>
                    {att.emp}
                  </div>
                </td>
                <td>{att.checkIn}</td>
                <td>{att.checkOut}</td>
                <td>{att.hours}</td>
                <td>
                  <span className={`badge ${getStatusBadge(att.status)}`}>{att.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
