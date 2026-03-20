import React, { useState } from 'react';

const EmployeesPage = ({ onAddClick, onEditClick }) => {
  const [employees] = useState([
    { id: 1, name: 'Arjun Kumar', emp_id: 'EMP-001', avatar: 'AK', color: '#4F46E5', dept: 'Engineering', designation: 'Senior Engineer', joinDate: 'Jan 2022', status: 'Active' },
    { id: 2, name: 'Priya Sharma', emp_id: 'EMP-002', avatar: 'PS', color: '#7C3AED', dept: 'Marketing', designation: 'Marketing Lead', joinDate: 'Mar 2021', status: 'Active' },
    { id: 3, name: 'Rahul Mehta', emp_id: 'EMP-003', avatar: 'RM', color: '#059669', dept: 'Sales', designation: 'Account Manager', joinDate: 'Jun 2023', status: 'On Leave' },
    { id: 4, name: 'Ananya Nair', emp_id: 'EMP-004', avatar: 'AN', color: '#DC2626', dept: 'Finance', designation: 'Finance Analyst', joinDate: 'Aug 2022', status: 'Active' },
    { id: 5, name: 'Vikram Joshi', emp_id: 'EMP-005', avatar: 'VJ', color: '#D97706', dept: 'Engineering', designation: 'Product Manager', joinDate: 'Feb 2020', status: 'Active' },
  ]);

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'badge-green';
    if (status === 'On Leave') return 'badge-amber';
    return 'badge-gray';
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Employee Management</div>
          <div className="page-sub">248 employees across all departments</div>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          + Add Employee
        </button>
      </div>

      <div className="toolbar">
        <input className="input-box" style={{ flex: 1, maxWidth: '240px' }} placeholder="Search employees..." />
        <select className="select-box">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Sales</option>
          <option>Marketing</option>
        </select>
        <select className="select-box">
          <option>All Status</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="emp-row">
                    <div className="emp-avatar" style={{ background: emp.color }}>{emp.avatar}</div>
                    <div>
                      <div className="emp-name">{emp.name}</div>
                      <div className="emp-dept">{emp.emp_id}</div>
                    </div>
                  </div>
                </td>
                <td>{emp.dept}</td>
                <td>{emp.designation}</td>
                <td>{emp.joinDate}</td>
                <td>
                  <span className={`badge ${getStatusBadge(emp.status)}`}>{emp.status}</span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => onEditClick(emp)}>✏️</button>
                  <button className="action-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', fontSize: '13px', color: 'var(--text-sec)' }}>
        <span>Showing 1–5 of 248</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-outline btn-sm">← Prev</button>
          <button className="btn btn-primary btn-sm">1</button>
          <button className="btn btn-outline btn-sm">2</button>
          <button className="btn btn-outline btn-sm">3</button>
          <button className="btn btn-outline btn-sm">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
