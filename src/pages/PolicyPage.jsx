import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';

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

const InputRow = ({ label, name, value, onChange }) => (
  <div className="policy-row">
    <span>{label}</span>
    <input
      className="input-box"
      style={{ width: '60px', padding: '4px 8px', textAlign: 'center' }}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

const PolicyPage = () => {
  const [toggleStates, setToggleStates] = useState({
    wfhEnabled: true,
    wfhApproval: true,
    overtimeAllowed: false,
    carryForward: true,
    geoFencing: false,
    autoCheckout: true,
  });

  const [policyValues, setPolicyValues] = useState({
    wfhDays: '3',
    dailyHours: '9',
    weeklyHours: '45',
    annualLeave: '20',
    sickLeave: '10',
    gracePeriod: '15',
  });

  const handleToggle = (key) => {
    setToggleStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPolicyValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <PageHeader
        title="Work Policy"
        subtitle="Configure company-wide work rules"
        actionLabel="Save Changes"
      />

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
          <InputRow
            label="Max WFH days/week"
            name="wfhDays"
            value={policyValues.wfhDays}
            onChange={handleInputChange}
          />
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
          <InputRow
            label="Daily hours"
            name="dailyHours"
            value={policyValues.dailyHours}
            onChange={handleInputChange}
          />
          <InputRow
            label="Weekly hours"
            name="weeklyHours"
            value={policyValues.weeklyHours}
            onChange={handleInputChange}
          />
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
          <InputRow
            label="Annual leave days"
            name="annualLeave"
            value={policyValues.annualLeave}
            onChange={handleInputChange}
          />
          <InputRow
            label="Sick leave days"
            name="sickLeave"
            value={policyValues.sickLeave}
            onChange={handleInputChange}
          />
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
          <InputRow
            label="Grace period (min)"
            name="gracePeriod"
            value={policyValues.gracePeriod}
            onChange={handleInputChange}
          />
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
