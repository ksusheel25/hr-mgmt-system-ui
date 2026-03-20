import { useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useEmployees } from '../hooks/useEmployees';

const getStatusBadge = (status) => {
  if (status === 'Active') return 'badge-green';
  if (status === 'On Leave') return 'badge-amber';
  return 'badge-gray';
};

const getEmployeeName = (employee) => {
  if (employee?.name) return employee.name;
  const fullName = [employee?.firstName, employee?.lastName].filter(Boolean).join(' ');
  if (fullName) return fullName;
  return employee?.fullName || 'Unknown';
};

const getEmployeeCode = (employee) => (
  employee?.employeeId ||
  employee?.empId ||
  employee?.code ||
  employee?.employeeCode ||
  employee?.id ||
  '—'
);

const getDepartment = (employee) => (
  employee?.department?.name ||
  employee?.departmentName ||
  employee?.dept ||
  '—'
);

const getDesignation = (employee) => (
  employee?.designation ||
  employee?.position ||
  employee?.role ||
  '—'
);

const getJoinDate = (employee) => (
  employee?.joiningDate ||
  employee?.joinDate ||
  employee?.dateOfJoining ||
  '—'
);

const getStatus = (employee) => (
  employee?.status ||
  employee?.employmentStatus ||
  'Active'
);

const makeAvatar = (name) => {
  const parts = name.split(' ').filter(Boolean);
  if (!parts.length) return 'NA';
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
};

const makeColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#4F46E5', '#7C3AED', '#059669', '#DC2626', '#D97706'];
  return colors[Math.abs(hash) % colors.length];
};

const EmployeesToolbar = () => {
  return (
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
  );
};

const EmployeesTable = ({ employees, loading, error, onEditClick }) => {
  return (
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
          {loading && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '18px' }}>Loading employees...</td>
            </tr>
          )}
          {!loading && error && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '18px', color: 'var(--red)' }}>{error}</td>
            </tr>
          )}
          {!loading && !error && employees.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '18px' }}>No employees found.</td>
            </tr>
          )}
          {!loading && !error && employees.map((emp) => (
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
                <button className="action-btn" onClick={() => onEditClick?.(emp)}>✏️</button>
                <button className="action-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EmployeesPagination = ({ page, totalPages, totalCount, pageSize, hasNext, hasPrev, onPageChange }) => {
  if (!totalPages && !totalCount) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '14px' }}>
        <button className="btn btn-outline btn-sm" disabled={!hasPrev} onClick={() => onPageChange(page - 1)}>← Prev</button>
        <button className="btn btn-outline btn-sm" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>Next →</button>
      </div>
    );
  }

  const resolvedTotalPages = totalPages || (totalCount ? Math.ceil(totalCount / pageSize) : 1);
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(resolvedTotalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }
  const pages = [];
  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', fontSize: '13px', color: 'var(--text-sec)' }}>
      {totalCount !== null && totalCount !== undefined ? (
        <span>
          {totalCount === 0
            ? 'Showing 0 of 0'
            : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalCount)} of ${totalCount}`}
        </span>
      ) : (
        <span>Showing {(page - 1) * pageSize + 1}–{page * pageSize}</span>
      )}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ← Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`btn ${p === page ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="btn btn-outline btn-sm" disabled={!hasNext && page >= resolvedTotalPages} onClick={() => onPageChange(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
};

const EmployeesPage = ({ onAddClick, onEditClick }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { employees, loading, error, pagination } = useEmployees({ page, size: pageSize });
  const normalizedEmployees = useMemo(() => (
    employees.map((employee) => {
      const name = getEmployeeName(employee);
      return {
        id: employee?.id || getEmployeeCode(employee),
        name,
        emp_id: getEmployeeCode(employee),
        avatar: makeAvatar(name),
        color: makeColor(name),
        dept: getDepartment(employee),
        designation: getDesignation(employee),
        joinDate: getJoinDate(employee),
        status: getStatus(employee),
      };
    })
  ), [employees]);

  return (
    <div style={{ paddingBottom: '20px' }}>
      <PageHeader
        title="Employee Management"
        subtitle="248 employees across all departments"
        actionLabel="+ Add Employee"
        onAction={onAddClick}
      />

      <EmployeesToolbar />
      <EmployeesTable
        employees={normalizedEmployees}
        loading={loading}
        error={error}
        onEditClick={onEditClick}
      />
      <EmployeesPagination
        page={pagination.page || page}
        totalPages={pagination.totalPages}
        totalCount={pagination.total}
        pageSize={pagination.size || pageSize}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        onPageChange={setPage}
      />
    </div>
  );
};

export default EmployeesPage;
