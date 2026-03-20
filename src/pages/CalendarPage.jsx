import PageHeader from '../components/common/PageHeader';

const holidays = [
  { day: 26, month: 'Jan', name: 'Republic Day', desc: 'National Holiday' },
  { day: 14, month: 'Mar', name: 'Holi', desc: 'Festival Holiday' },
  { day: 26, month: 'Mar', name: 'Good Friday', desc: 'National Holiday' },
  { day: 14, month: 'Apr', name: 'Dr. Ambedkar Jayanti', desc: 'National Holiday' },
];

const getMonthMeta = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return { firstDay, daysInMonth };
};

const generateCalendarCells = ({ year, monthIndex, today, holidayDays }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cellsArray = [];

  days.forEach((d) => {
    cellsArray.push({ type: 'header', value: d });
  });

  const { firstDay, daysInMonth } = getMonthMeta(year, monthIndex);
  for (let i = 0; i < firstDay; i++) {
    cellsArray.push({ type: 'empty', value: null });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today;
    const isHoliday = holidayDays.includes(d);
    cellsArray.push({
      type: 'day',
      value: d,
      isToday,
      isHoliday,
    });
  }

  return cellsArray;
};

const CalendarGrid = ({ cells }) => {
  return (
    <div className="cal-grid">
      {cells.map((cell, idx) => {
        if (cell.type === 'header') {
          return (
            <div key={idx} className="cal-head">
              {cell.value}
            </div>
          );
        }
        if (cell.type === 'empty') {
          return <div key={idx} className="cal-cell empty"></div>;
        }
        return (
          <div
            key={idx}
            className={`cal-cell ${cell.isToday ? 'today' : ''} ${
              cell.isHoliday ? 'holiday' : ''
            }`}
          >
            {cell.value}
            {cell.isToday && <div className="cal-dot"></div>}
          </div>
        );
      })}
    </div>
  );
};

const HolidayList = ({ items }) => {
  return (
    <div className="holiday-list">
      {items.map((holiday, idx) => (
        <div key={idx} className="holiday-item">
          <div className="holiday-date-box">
            <div className="holiday-day">{holiday.day}</div>
            <div className="holiday-mon">{holiday.month}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{holiday.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-sec)' }}>{holiday.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CalendarPage = () => {
  const holidayDays = holidays
    .filter((holiday) => holiday.month === 'Mar')
    .map((holiday) => holiday.day);
  const calendarCells = generateCalendarCells({
    year: 2026,
    monthIndex: 2,
    today: 18,
    holidayDays,
  });

  return (
    <div style={{ paddingBottom: '20px' }}>
      <PageHeader
        title="Holiday Calendar"
        subtitle="March 2026 · 2 holidays this month"
        actionLabel="+ Add Holiday"
      />

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <span>March 2026</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="action-btn">←</button>
              <button className="action-btn">→</button>
            </div>
          </div>
          <CalendarGrid cells={calendarCells} />
        </div>

        <div className="card">
          <div className="card-title">Holidays This Year</div>
          <HolidayList items={holidays} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
