import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrLeaveTypesBalancesPage() {
  const [leaveTypes, setLeaveTypes] = useState([])
  const [balances, setBalances] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [editType, setEditType] = useState(null)
  const [editBalance, setEditBalance] = useState(null)

  useEffect(() => {
    const loadTypes = async () => {
      const res = await apiClient.get('/v1/admin/leave-types')
      setLeaveTypes(res.data || [])
    }
    loadTypes()
  }, [])

  const loadBalances = async () => {
    if (!selectedEmployeeId) return
    const res = await apiClient.get('/v1/admin/leave-balances', {
      params: { employeeId: selectedEmployeeId },
    })
    setBalances(res.data || [])
  }

  const saveType = async (e) => {
    e.preventDefault()
    if (editType.id || editType.leaveTypeId) {
      const id = editType.id || editType.leaveTypeId
      await apiClient.put(`/v1/admin/leave-types/${id}`, editType)
    } else {
      await apiClient.post('/v1/admin/leave-types', editType)
    }
    setEditType(null)
    const res = await apiClient.get('/v1/admin/leave-types')
    setLeaveTypes(res.data || [])
  }

  const saveBalance = async (e) => {
    e.preventDefault()
    if (editBalance.id || editBalance.balanceId) {
      const id = editBalance.id || editBalance.balanceId
      await apiClient.put(`/v1/admin/leave-balances/${id}`, editBalance)
    } else {
      await apiClient.post('/v1/admin/leave-balances', editBalance)
    }
    setEditBalance(null)
    await loadBalances()
  }

  const deleteType = async (id) => {
    await apiClient.delete(`/v1/admin/leave-types/${id}`)
    const res = await apiClient.get('/v1/admin/leave-types')
    setLeaveTypes(res.data || [])
  }

  const deleteBalance = async (id) => {
    await apiClient.delete(`/v1/admin/leave-balances/${id}`)
    await loadBalances()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leave types & balances</h2>
          <p className="page-subtitle">Configure leave types and allocate balances per employee.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">Leave types</h3>
        {editType ? (
          <form onSubmit={saveType} className="form-grid">
            <div className="form-field">
              <label>
                Code (e.g. ANNUAL)
                <input
                  value={editType.code || ''}
                  onChange={(e) => setEditType((t) => ({ ...t, code: e.target.value }))}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Name
                <input
                  value={editType.name || ''}
                  onChange={(e) => setEditType((t) => ({ ...t, name: e.target.value }))}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditType(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save type
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditType({ code: '', name: '' })}
          >
            Add leave type
          </button>
        )}

        <table className="table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((t) => (
              <tr key={t.id || t.leaveTypeId}>
                <td>{t.code}</td>
                <td>{t.name}</td>
                <td className="table-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditType(t)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteType(t.id || t.leaveTypeId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label>
              Employee ID
              <input
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={loadBalances}>
              Load balances
            </button>
          </div>
        </div>

        {selectedEmployeeId && (
          <>
            <h3 className="card-title" style={{ marginTop: '1rem' }}>
              Balances for employee
            </h3>

            {editBalance ? (
              <form onSubmit={saveBalance} className="form-grid">
                <div className="form-field">
                  <label>
                    Leave type ID
                    <input
                      value={editBalance.leaveTypeId || ''}
                      onChange={(e) =>
                        setEditBalance((b) => ({ ...b, leaveTypeId: e.target.value }))
                      }
                      required
                    />
                  </label>
                </div>
                <div className="form-field">
                  <label>
                    Year
                    <input
                      type="number"
                      value={editBalance.year || new Date().getFullYear()}
                      onChange={(e) =>
                        setEditBalance((b) => ({ ...b, year: Number(e.target.value) || 0 }))
                      }
                      required
                    />
                  </label>
                </div>
                <div className="form-field">
                  <label>
                    Days
                    <input
                      type="number"
                      value={editBalance.days ?? 0}
                      onChange={(e) =>
                        setEditBalance((b) => ({ ...b, days: Number(e.target.value) || 0 }))
                      }
                      required
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditBalance(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    Save balance
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setEditBalance({
                    employeeId: selectedEmployeeId,
                    leaveTypeId: '',
                    year: new Date().getFullYear(),
                    days: 0,
                  })
                }
              >
                Add balance
              </button>
            )}

            <table className="table" style={{ marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>Leave type</th>
                  <th>Year</th>
                  <th>Days</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {balances.map((b) => (
                  <tr key={b.id || b.balanceId}>
                    <td>{b.leaveTypeId}</td>
                    <td>{b.year}</td>
                    <td>{b.days}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditBalance(b)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteBalance(b.id || b.balanceId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

export default HrLeaveTypesBalancesPage

