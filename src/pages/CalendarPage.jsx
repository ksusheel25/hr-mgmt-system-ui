import React, { useState } from 'react';

const CalendarPage = () => {
  const [holidays] = useState([
    { day: 26, month: 'Jan', name: 'Republic Day', desc: 'National Holiday' },
    { day: 14, month: 'Mar', name: 'Holi', desc: 'Festival Holiday' },
    { day: 26, month: 'Mar', name: 'Good Friday', desc: 'National Holiday' },
    { day: 14, month: 'Apr', name: 'Dr. Ambedkar Jayanti', desc: 'National Holiday' },
  ]);

  // Generate calendar for March 2026
  const generateCalendar = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const cellsArray = [];

    // Header
    days.forEach((d) => {
      cellsArray.push({ type: 'header', value: d });
    });

    // Empty cells for days before 1st
    for (let i = 0; i < 6; i++) {
      cellsArray.push({ type: 'empty', value: null });
    }

    // Days of month
    const holidayDays = [14, 26];
    for (let d = 1; d <= 31; d++) {
      const isToday = d === 18;
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

  const calendarCells = generateCalendar();

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Holiday Calendar</div>
          <div className="page-sub">March 2026 · 2 holidays this month</div>
        </div>
        <button className="btn btn-primary">+ Add Holiday</button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <span>March 2026</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="action-btn">←</button>
              <button className="action-btn">→</button>
            </div>
          </div>
          <div className="cal-grid">
            {calendarCells.map((cell, idx) => {
              if (cell.type === 'header') {
                return (
                  <div key={idx} className="cal-head">
                    {cell.value}
                  </div>
                );
              }
              if (cell.type === 'empty') {
                return (
                  <div key={idx} className="cal-cell empty"></div>
                );
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
        </div>

        <div className="card">
          <div className="card-title">Holidays This Year</div>
          <div className="holiday-list">
            {holidays.map((holiday, idx) => (
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
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
