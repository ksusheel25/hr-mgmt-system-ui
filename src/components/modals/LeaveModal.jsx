import React, { useState } from 'react';

const LeaveModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    leaveType: 'Earned Leave',
    fromDate: '',
    toDate: '',
    reason: '',
    handoverNotes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Leave Request:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          <span>Apply for Leave</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Leave Type *</label>
          <select
            className="form-input"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
          >
            <option>Earned Leave</option>
            <option>Sick Leave</option>
            <option>Casual Leave</option>
            <option>Maternity Leave</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">From Date *</label>
            <input
              className="form-input"
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">To Date *</label>
            <input
              className="form-input"
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason *</label>
          <textarea
            className="form-input"
            name="reason"
            rows="3"
            placeholder="Describe your reason..."
            value={formData.reason}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Handover notes</label>
          <textarea
            className="form-input"
            name="handoverNotes"
            rows="2"
            placeholder="Tasks to be handed over..."
            value={formData.handoverNotes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
