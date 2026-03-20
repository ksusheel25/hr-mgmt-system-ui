import React, { useState } from 'react';

const LeavePage = ({ onApplyClick }) => {
  const [leaves] = useState([
    { id: 1, emp: 'Priya S.', avatar: 'PS', color: '#7C3AED', type: 'Sick Leave', from: '20 Mar', to: '21 Mar', days: 2, reason: 'Flu', status: 'Pending' },
    { id: 2, emp: 'Rahul M.', avatar: 'RM', color: '#059669', type: 'Casual Leave', from: '18 Mar', to: '18 Mar', days: 1, reason: 'Personal', status: 'Approved' },
    { id: 3, emp: 'Ananya N.', avatar: 'AN', color: '#DC2626', type: 'Earned Leave', from: '25 Mar', to: '29 Mar', days: 5, reason: 'Vacation', status: 'Pending' },
    { id: 4, emp: 'Vikram J.', avatar: 'VJ', color: '#D97706', type: 'Sick Leave', from: '15 Mar', to: '17 Mar', days: 3, reason: 'Surgery', status: 'Rejected' },
  ]);

  const getStatusBadge = (status) => {
    if (status === 'Approved') return 'badge-green';
    if (status === 'Pending') return 'badge-amber';
    if (status === 'Rejected') return 'badge-red';
    return 'badge-gray';
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Leave Management</div>
          <div className="page-sub">8 requests pending approval</div>
        </div>
        <button className="btn btn-primary" onClick={onApplyClick}>
          + Apply Leave
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>
                  <div className="emp-row">
                    <div className="emp-avatar" style={{ background: leave.color, width: '26px', height: '26px', fontSize: '11px' }}>
                      {leave.avatar}
                    </div>
                    {leave.emp}
                  </div>
                </td>
                <td>{leave.type}</td>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`badge ${getStatusBadge(leave.status)}`}>{leave.status}</span>
                </td>
                <td>
                  {leave.status === 'Pending' ? (
                    <>
                      <button className="btn btn-success btn-sm">✓</button>
                      <button className="btn btn-danger btn-sm">✗</button>
                    </>
                  ) : (
                    <button className="action-btn">👁</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavePage;
