import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="logo">VH</div>
      </div>
      <div className="calendar-content">
        {/* Calendar Content goes here */}
      </div>
      <div className="buttons-container">
        <button className="exec-board-btn" onClick={() => navigateTo('/executives')}>Exec Board</button>
        <button className="dummy-btn" onClick={() => navigateTo('/signup')}>Sign Up</button>
        <button className="upcoming-events-btn" onClick={() => navigateTo('/upcoming-events')}>Upcoming Events</button>
        <button className="past-events-btn" onClick={() => navigateTo('/past-events')}>Past Events</button>
      </div>
    </div>
  );
}

export default Calendar;