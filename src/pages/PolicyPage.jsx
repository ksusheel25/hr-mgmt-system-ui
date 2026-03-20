import React, { useState } from 'react';

const PolicyPage = () => {
  const [toggleStates, setToggleStates] = useState({
    wfhEnabled: true,
    wfhApproval: true,
    overtimeAllowed: false,
    carryForward: true,
    geoFencing: false,
    autoCheckout: true,
  });

  const handleToggle = (key) => {
    setToggleStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const PolicyCard = ({ title, subtitle, icon, bgColor, children }) => (
    <div className="policy-card">
      <div className="policy-header">
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-sec)', marginTop: '2px' }}>{subtitle}</div>
        </div>
        <div className="policy-icon" style={{ background: bgColor }}>
          {icon}
        </div>
      </div>
      {children}
    </div>
  );

  const ToggleRow = ({ label, value, onChange }) => (
    <div className="policy-row">
      <span>{label}</span>
      <button
        className={`toggle ${value ? 'on' : 'off'}`}
        onClick={onChange}
      ></button>
    </div>
  );

  const InputRow = ({ label, value, onChange }) => (
    <div className="policy-row">
      <span>{label}</span>
      <input
        className="input-box"
        style={{ width: '60px', padding: '4px 8px', textAlign: 'center' }}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Work Policy</div>
          <div className="page-sub">Configure company-wide work rules</div>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="policy-grid">
        <PolicyCard
          title="WFH Policy"
          subtitle="Work from home settings"
          icon="🏠"
          bgColor="#EEF2FF"
        >
          <ToggleRow
            label="WFH Enabled"
            value={toggleStates.wfhEnabled}
            onChange={() => handleToggle('wfhEnabled')}
          />
          <InputRow label="Max WFH days/week" value="3" onChange={() => {}} />
          <ToggleRow
            label="Requires approval"
            value={toggleStates.wfhApproval}
            onChange={() => handleToggle('wfhApproval')}
          />
        </PolicyCard>

        <PolicyCard
          title="Working Hours"
          subtitle="Daily and weekly limits"
          icon="⏱️"
          bgColor="#ECFDF5"
        >
          <InputRow label="Daily hours" value="9" onChange={() => {}} />
          <InputRow label="Weekly hours" value="45" onChange={() => {}} />
          <ToggleRow
            label="Overtime allowed"
            value={toggleStates.overtimeAllowed}
            onChange={() => handleToggle('overtimeAllowed')}
          />
        </PolicyCard>

        <PolicyCard
          title="Leave Rules"
          subtitle="Accrual and carry-forward"
          icon="📅"
          bgColor="#FEF3C7"
        >
          <InputRow label="Annual leave days" value="20" onChange={() => {}} />
          <InputRow label="Sick leave days" value="10" onChange={() => {}} />
          <ToggleRow
            label="Carry forward"
            value={toggleStates.carryForward}
            onChange={() => handleToggle('carryForward')}
          />
        </PolicyCard>

        <PolicyCard
          title="Attendance Rules"
          subtitle="Check-in and grace period"
          icon="📍"
          bgColor="#EDE9FE"
        >
          <InputRow label="Grace period (min)" value="15" onChange={() => {}} />
          <ToggleRow
            label="Geo-fencing"
            value={toggleStates.geoFencing}
            onChange={() => handleToggle('geoFencing')}
          />
          <ToggleRow
            label="Auto checkout"
            value={toggleStates.autoCheckout}
            onChange={() => handleToggle('autoCheckout')}
          />
        </PolicyCard>
      </div>
    </div>
  );
};

export default PolicyPage;
