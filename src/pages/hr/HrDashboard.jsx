function HrDashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">HR Dashboard</h2>
          <p className="page-subtitle">
            Snapshot of company attendance, leave usage, and upcoming holidays.
          </p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Today&apos;s present</div>
          <div className="card-value">–</div>
        </div>
        <div className="card">
          <div className="card-title">Employees on leave</div>
          <div className="card-value">–</div>
        </div>
        <div className="card">
          <div className="card-title">WFH today</div>
          <div className="card-value">–</div>
        </div>
        <div className="card">
          <div className="card-title">Upcoming holidays</div>
          <div className="card-value">–</div>
        </div>
      </div>
    </div>
  )
}

export default HrDashboard

