import PageHeader from '../components/common/PageHeader';

const notifications = [
  {
    id: 1,
    title: 'Leave request from Priya Sharma',
    message: 'Priya has applied for 2 days sick leave (20–21 March). Please review and approve.',
    time: '5 minutes ago',
    unread: true,
    action: { label: 'Review →', type: 'review' },
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
    action: { label: 'View Log', type: 'view' },
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

const NotificationItem = ({ notif, onLeaveReviewClick }) => {
  const handleAction = () => {
    if (notif.action?.type === 'review') {
      onLeaveReviewClick?.();
    }
  };

  return (
    <div className={`notif-item ${notif.unread ? 'unread' : ''}`}>
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
          onClick={handleAction}
        >
          {notif.action.label}
        </button>
      )}
    </div>
  );
};

const NotificationList = ({ items, onLeaveReviewClick }) => {
  return (
    <div className="notif-list">
      {items.map((notif) => (
        <NotificationItem
          key={notif.id}
          notif={notif}
          onLeaveReviewClick={onLeaveReviewClick}
        />
      ))}
    </div>
  );
};

const NotificationsPage = ({ onLeaveReviewClick }) => {

  return (
    <div style={{ paddingBottom: '20px' }}>
      <PageHeader
        title="Notifications"
        subtitle="3 unread notifications"
        actionLabel="Mark all read"
        actionClassName="btn btn-outline"
      />

      <NotificationList items={notifications} onLeaveReviewClick={onLeaveReviewClick} />
    </div>
  );
};

export default NotificationsPage;
