import React from 'react';

const NotificationsPage = ({ onLeaveReviewClick }) => {
  const notifications = [
    {
      id: 1,
      title: 'Leave request from Priya Sharma',
      message: 'Priya has applied for 2 days sick leave (20–21 March). Please review and approve.',
      time: '5 minutes ago',
      unread: true,
      action: { label: 'Review →', onClick: onLeaveReviewClick },
    },
    {
      id: 2,
      title: 'New employee onboarded',
      message: 'Sneha Gupta (EMP-249) from Engineering has been successfully onboarded.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Bulk upload completed',
      message: '85 employee records were successfully imported. 2 records had errors.',
      time: 'Yesterday, 4:30 PM',
      unread: true,
      action: { label: 'View Log' },
    },
    {
      id: 4,
      title: 'Payroll reminder',
      message: 'March payroll processing is due in 5 days. Review attendance data before processing.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 5,
      title: 'Holiday added',
      message: 'Good Friday (26 March 2026) has been added to the company holiday calendar.',
      time: '3 days ago',
      unread: false,
    },
  ];

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-sub">3 unread notifications</div>
        </div>
        <button className="btn btn-outline">Mark all read</button>
      </div>

      <div className="notif-list">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`notif-item ${notif.unread ? 'unread' : ''}`}
          >
            {notif.unread && <div className="notif-dot-badge"></div>}
            {!notif.unread && (
              <div style={{ width: '8px', height: '8px', flexShrink: 0, marginTop: '5px' }}></div>
            )}
            <div className="notif-content">
              <div className="notif-title">{notif.title}</div>
              <div className="notif-msg">{notif.message}</div>
              <div className="notif-time">{notif.time}</div>
            </div>
            {notif.action && (
              <button
                className="btn btn-outline btn-sm"
                onClick={notif.action.onClick}
              >
                {notif.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
