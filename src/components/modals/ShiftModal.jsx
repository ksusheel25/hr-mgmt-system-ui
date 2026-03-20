import React, { useState } from 'react';

const ShiftModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    shiftName: '',
    startTime: '09:00',
    endTime: '18:00',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSubmit = () => {
    console.log('Shift Data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          <span>Create Shift</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Shift Name *</label>
          <input
            className="form-input"
            name="shiftName"
            placeholder="e.g. Night Shift"
            value={formData.shiftName}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Time *</label>
            <input
              className="form-input"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Time *</label>
            <input
              className="form-input"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Working Days *</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            {days.map((day) => (
              <span
                key={day}
                className={`badge ${
                  formData.workingDays.includes(day)
                    ? 'badge-blue'
                    : 'badge-gray'
                }`}
                style={{ cursor: 'pointer', padding: '5px 12px' }}
                onClick={() => toggleDay(day)}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Create Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
