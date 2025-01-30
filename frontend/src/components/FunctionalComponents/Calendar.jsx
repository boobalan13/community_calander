import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      date: '2024-05-17',
      time: '10:00',
      title: 'Create React App',
      description: 'Start working on the new React application'
    },
    {
      id: 2,
      date: '2024-05-20',
      time: '07:00',
      title: 'Listen to Music',
      description: 'Relaxation time with favorite playlist'
    },
    {
      id: 3,
      date: '2024-05-24',
      time: '00:00',
      title: 'Sleep',
      description: 'Time to rest'
    },
    {
      id: 4,
      date: '2024-05-29',
      time: '11:00',
      title: 'Work out',
      description: 'Regular exercise routine'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    description: ''
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(formatDate(clickedDate));
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;
    setShowEventForm(true);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !newEvent.title || !newEvent.time) return;

    const event = {
      id: Date.now(),
      date: selectedDate,
      ...newEvent
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', time: '', description: '' });
    setShowEventForm(false);
  };

  const handleEventDelete = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      const hasEvents = dayEvents.length > 0;
      const isSelected = dateStr === selectedDate;

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {hasEvents && <span className="event-count">{dayEvents.length}</span>}
        </div>
      );
    }

    return days;
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    const dateEvents = events.filter(event => event.date === selectedDate);
    
    return dateEvents.map(event => (
      <div key={event.id} className="event-item">
        <div className="event-info">
          <div className="event-time">{event.time}</div>
          <div className="event-title">{event.title}</div>
          <div className="event-description">{event.description}</div>
        </div>
        <div className="event-actions">
          <button 
            className="event-action-btn"
            onClick={() => handleEventDelete(event.id)}
          >
            ✕
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-left">
        <div className="calendar-header">
          <h1>CALENDAR</h1>
          <div className="month-navigation">
            <span>{months[currentDate.getMonth()]}, {currentDate.getFullYear()}</span>
            <div className="nav-buttons">
              <button onClick={handlePrevMonth}>&lt;</button>
              <button onClick={handleNextMonth}>&gt;</button>
            </div>
          </div>
        </div>
        
        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      <div className="calendar-right">
        <div className="events-section">
          <div className="events-header">
            <h2 className="events-title">
              {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              }) : 'Select a date'}
            </h2>
            {selectedDate && (
              <button className="add-event-btn" onClick={handleAddEvent}>
                Add Event
              </button>
            )}
          </div>

          {showEventForm && (
            <form className="event-form" onSubmit={handleEventSubmit}>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="form-submit-btn">Save</button>
                <button 
                  type="button" 
                  className="form-cancel-btn"
                  onClick={() => {
                    setShowEventForm(false);
                    setNewEvent({ title: '', time: '', description: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="events-list">
            {renderSelectedDateEvents()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
