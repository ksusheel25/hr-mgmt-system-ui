import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrEmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editEmployee, setEditEmployee] = useState(null)

  const loadEmployees = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/v1/admin/employees')
      setEmployees(res.data || [])
    } catch (err) {
      setError('Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleEdit = (employee) => {
    setEditEmployee(employee)
  }

  const handleChange = (field, value) => {
    setEditEmployee((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editEmployee.id) {
        await apiClient.put(`/api/v1/admin/employees/${editEmployee.id}`, editEmployee)
      } else {
        await apiClient.post('/api/v1/admin/employees', editEmployee)
      }
      setEditEmployee(null)
      await loadEmployees()
    } catch (err) {
      setError('Failed to save employee.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (employeeId) => {
    try {
      await apiClient.patch(`/api/v1/admin/employees/${employeeId}/deactivate`)
      await loadEmployees()
    } catch {
      // minimal handling
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Employees</h2>
          <p className="page-subtitle">Create and manage employees, shifts and managers.</p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() =>
            setEditEmployee({
              employeeCode: '',
              firstName: '',
              lastName: '',
              email: '',
              shiftId: '',
              managerId: '',
              active: true,
              remainingWfhBalance: 0,
            })
          }
        >
          Add employee
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <div className="card" style={{ marginBottom: '1rem' }}>
        {editEmployee ? (
          <form onSubmit={handleSave} className="form-grid">
            <div className="form-field">
              <label>
                Employee code
                <input
                  value={editEmployee.employeeCode || ''}
                  onChange={(e) => handleChange('employeeCode', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                First name
                <input
                  value={editEmployee.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Last name
                <input
                  value={editEmployee.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Email
                <input
                  type="email"
                  value={editEmployee.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Shift ID
                <input
                  value={editEmployee.shiftId || ''}
                  onChange={(e) => handleChange('shiftId', e.target.value)}
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Manager ID
                <input
                  value={editEmployee.managerId || ''}
                  onChange={(e) => handleChange('managerId', e.target.value)}
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Remaining WFH balance
                <input
                  type="number"
                  value={editEmployee.remainingWfhBalance ?? 0}
                  onChange={(e) =>
                    handleChange('remainingWfhBalance', Number(e.target.value) || 0)
                  }
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Active
                <select
                  value={editEmployee.active ? 'true' : 'false'}
                  onChange={(e) => handleChange('active', e.target.value === 'true')}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditEmployee(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save employee'}
              </button>
            </div>
          </form>
        ) : (
          <p style={{ margin: 0 }}>Select &quot;Add employee&quot; or click an employee to edit.</p>
        )}
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Shift</th>
                <th>Manager</th>
                <th>Status</th>
                <th>WFH balance</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id || e.employeeId}>
                  <td>{e.employeeCode}</td>
                  <td>
                    {e.firstName} {e.lastName}
                  </td>
                  <td>{e.email}</td>
                  <td>{e.shiftId}</td>
                  <td>{e.managerId}</td>
                  <td>
                    <span
                      className={
                        e.active ? 'status-pill status-pill-success' : 'status-pill status-pill-danger'
                      }
                    >
                      {e.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{e.remainingWfhBalance}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>
                    {e.active && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDeactivate(e.id || e.employeeId)}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default HrEmployeesPage

