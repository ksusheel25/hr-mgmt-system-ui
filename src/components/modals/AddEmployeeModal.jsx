import React, { useState } from 'react';

const AddEmployeeModal = ({ isOpen, onClose, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    shift: 'General Shift',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          <span>{isEditMode ? 'Edit Employee' : 'Add Employee'}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              className="form-input"
              name="firstName"
              placeholder="Arjun"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              className="form-input"
              name="lastName"
              placeholder="Kumar"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            className="form-input"
            name="email"
            type="email"
            placeholder="arjun@company.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              className="form-input"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Finance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Designation *</label>
            <input
              className="form-input"
              name="designation"
              placeholder="Software Engineer"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Joining Date *</label>
            <input
              className="form-input"
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Shift</label>
            <select
              className="form-input"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
            >
              <option>General Shift</option>
              <option>Morning Shift</option>
              <option>Evening Shift</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEditMode ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
