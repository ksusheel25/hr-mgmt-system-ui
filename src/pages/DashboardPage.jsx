import React, { useState, useEffect } from 'react';

const DashboardPage = ({ userRole }) => {
  const [isHRView, setIsHRView] = useState(userRole === 'hr');
  const [liveTime, setLiveTime] = useState('09:00 AM');
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const t = new Date();
      let h = t.getHours();
      const m = t.getMinutes();
      const s = t.getSeconds();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setLiveTime(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleCheckin = () => {
    setCheckedIn(!checkedIn);
  };

  const attBars = [
    { day: 'Mon', value: 192, max: 220 },
    { day: 'Tue', value: 204, max: 220 },
    { day: 'Wed', value: 188, max: 220 },
    { day: 'Thu', value: 211, max: 220 },
    { day: 'Fri', value: 195, max: 220 },
  ];

  const leaveRequests = [
    { emp: 'Priya S.', type: 'Sick', status: 'Pending', badgeClass: 'badge-amber', avatar: 'PS', color: '#7C3AED' },
    { emp: 'Rahul M.', type: 'Casual', status: 'Approved', badgeClass: 'badge-green', avatar: 'RM', color: '#059669' },
    { emp: 'Ananya N.', type: 'Earned', status: 'Pending', badgeClass: 'badge-amber', avatar: 'AN', color: '#DC2626' },
  ];

  const departments = [
    { name: 'Engineering', count: 68 },
    { name: 'Sales', count: 34 },
    { name: 'Marketing', count: 28 },
    { name: 'Finance', count: 22 },
    { name: 'HR & Ops', count: 19 },
  ];

  const holidays = [
    { day: 26, month: 'Mar', name: 'Good Friday', desc: 'National Holiday', daysAway: 8 },
    { day: 14, month: 'Apr', name: 'Dr. Ambedkar Jayanti', desc: 'National Holiday', daysAway: 27 },
  ];

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">
            {isHRView ? 'HR Dashboard' : 'My Dashboard'}
          </div>
          <div className="page-sub">Wednesday, 18 March 2026</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${isHRView ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setIsHRView(true)}
          >
            HR View
          </button>
          <button
            className={`btn ${!isHRView ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setIsHRView(false)}
          >
            My View
          </button>
        </div>
      </div>

      {isHRView ? (
        // HR Dashboard
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value" style={{ color: 'var(--indigo)' }}>248</div>
              <div className="stat-change up">↑ 4 this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Present Today</div>
              <div className="stat-value" style={{ color: 'var(--green)' }}>211</div>
              <div className="stat-change up">↑ 85.1% attendance</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">On Leave</div>
              <div className="stat-value" style={{ color: 'var(--amber)' }}>22</div>
              <div className="stat-change down">↓ 3 more than yesterday</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Open Positions</div>
              <div className="stat-value" style={{ color: 'var(--red)' }}>15</div>
              <div className="stat-change up">↑ 2 new this week</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-title">Weekly Attendance <span style={{ fontSize: '12px', color: 'var(--text-sec)', fontWeight: 400 }}>This week</span></div>
              <div>
                {attBars.map((bar, idx) => (
                  <div key={idx} className="chart-bar-row">
                    <div className="chart-bar-label">{bar.day}</div>
                    <div className="chart-bar-track">
                      <div className="chart-bar-fill" style={{ width: `${(bar.value / bar.max) * 100}%` }}></div>
                    </div>
                    <div className="chart-bar-val">{bar.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                Leave Requests
                <span className="badge badge-amber" style={{ fontSize: '11px' }}>8 pending</span>
              </div>
              <table className="table" style={{ marginTop: '-4px' }}>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((req, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="emp-row">
                          <div className="emp-avatar" style={{ background: req.color, width: '26px', height: '26px', fontSize: '11px' }}>{req.avatar}</div>
                          {req.emp}
                        </div>
                      </td>
                      <td>{req.type}</td>
                      <td><span className={`badge ${req.badgeClass}`}>Pending</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Department Headcount</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center' }}>
              {departments.map((dept, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--indigo)' }}>{dept.count}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-sec)', marginTop: '4px' }}>{dept.name}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Employee Dashboard
        <>
          <div className="checkin-card">
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Good morning, Priya!</div>
            <div className="checkin-time" id="live-time">{liveTime}</div>
            <div className="checkin-date">Wednesday, 18 March 2026</div>
            <button className="checkin-btn" id="checkin-btn" onClick={handleToggleCheckin}>
              {checkedIn ? 'Check Out' : 'Check In'}
            </button>
            <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7 }} id="checkin-status">
              {checkedIn ? 'Checked in — have a great day!' : 'Not checked in yet'}
            </div>
          </div>

          <div className="leave-bal">
            <div className="leave-bal-card">
              <div className="leave-bal-num">12</div>
              <div className="leave-bal-label">Earned Leave</div>
            </div>
            <div className="leave-bal-card">
              <div className="leave-bal-num">5</div>
              <div className="leave-bal-label">Sick Leave</div>
            </div>
            <div className="leave-bal-card">
              <div className="leave-bal-num">3</div>
              <div className="leave-bal-label">Casual Leave</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Upcoming Holidays</div>
            <div className="holiday-list">
              {holidays.map((holiday, idx) => (
                <div key={idx} className="holiday-item">
                  <div className="holiday-date-box">
                    <div className="holiday-day">{holiday.day}</div>
                    <div className="holiday-mon">{holiday.month}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{holiday.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-sec)' }}>{holiday.desc}</div>
                  </div>
                  <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>{holiday.daysAway} days away</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
