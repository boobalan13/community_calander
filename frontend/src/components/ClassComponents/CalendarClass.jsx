import React, { Component } from 'react';
import './CalendarClass.css';
import eventService from '../../services/eventService';

class CalendarClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      selectedDate: null,
      showEventForm: false,
      isEditing: false,
      isLoading: false,
      error: null,
      newEvent: {
        title: '',
        time: '',
        description: ''
      },
      editingEvent: null,
      events: []
    };
  }

  async componentDidMount() {
    this.loadEvents();
  }

  loadEvents = async () => {
    try {
      this.setState({ isLoading: true, error: null });
      const events = await eventService.getAllEvents();
      this.setState({ events, isLoading: false });
    } catch (error) {
      this.setState({ 
        error: 'Failed to load events. Please try again later.',
        isLoading: false 
      });
    }
  };

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  /**
   * Calculate the number of days in a given month
   */
  getMonthDays = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  /**
   * Get the day of week (0-6) for the first day of the month
   */
  getMonthStartDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  /**
   * Format a date object to YYYY-MM-DD string
   */
  formatDateToString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  goToPreviousMonth = () => {
    this.setState(prevState => ({
      currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() - 1),
      selectedDate: null
    }));
  };

  goToNextMonth = () => {
    this.setState(prevState => ({
      currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() + 1),
      selectedDate: null
    }));
  };

  handleDayClick = (dayOfMonth) => {
    const selectedDate = new Date(
      this.state.currentDate.getFullYear(),
      this.state.currentDate.getMonth(),
      dayOfMonth
    );
    this.setState({ selectedDate: this.formatDateToString(selectedDate) });
  };

  showAddEventForm = () => {
    if (!this.state.selectedDate) return;
    this.setState({ 
      showEventForm: true, 
      isEditing: false,
      editingEvent: null,
      newEvent: { title: '', time: '', description: '' }
    });
  };

  showEditEventForm = (event) => {
    this.setState({
      showEventForm: true,
      isEditing: true,
      editingEvent: event,
      newEvent: {
        title: event.title,
        time: event.time,
        description: event.description || ''
      }
    });
  };

  handleEventFormSubmit = async (e) => {
    e.preventDefault();
    const { selectedDate, newEvent, isEditing, editingEvent } = this.state;
    
    if (!selectedDate || !newEvent.title || !newEvent.time) return;

    try {
      this.setState({ isLoading: true, error: null });
      const eventData = {
        date: selectedDate,
        ...newEvent
      };

      let updatedEvent;
      if (isEditing && editingEvent) {
        updatedEvent = await eventService.updateEvent(editingEvent._id, eventData);
        this.setState(prevState => ({
          events: prevState.events.map(event => 
            event._id === editingEvent._id ? updatedEvent : event
          )
        }));
      } else {
        updatedEvent = await eventService.createEvent(eventData);
        this.setState(prevState => ({
          events: [...prevState.events, updatedEvent]
        }));
      }

      this.setState({ 
        showEventForm: false,
        isEditing: false,
        editingEvent: null,
        newEvent: { title: '', time: '', description: '' },
        isLoading: false
      });
    } catch (error) {
      this.setState({ 
        error: isEditing ? 'Failed to update event' : 'Failed to create event',
        isLoading: false 
      });
    }
  };

  deleteEvent = async (eventId) => {
    try {
      this.setState({ isLoading: true, error: null });
      await eventService.deleteEvent(eventId);
      this.setState(prevState => ({
        events: prevState.events.filter(event => event._id !== eventId),
        isLoading: false
      }));
    } catch (error) {
      this.setState({ 
        error: 'Failed to delete event',
        isLoading: false 
      });
    }
  };

  cancelEventForm = () => {
    this.setState({
      showEventForm: false,
      isEditing: false,
      editingEvent: null,
      newEvent: { title: '', time: '', description: '' }
    });
  };

  updateFormField = (field, value) => {
    this.setState(prevState => ({
      newEvent: {
        ...prevState.newEvent,
        [field]: value
      }
    }));
  };

  renderCalendarGrid = () => {
    const { currentDate, events, selectedDate } = this.state;
    const totalDays = this.getMonthDays(currentDate);
    const firstDayOfMonth = this.getMonthStartDay(currentDate);
    const calendarCells = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    for (let day = 1; day <= totalDays; day++) {
      const currentDateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const eventsForDay = events.filter(event => event.date === currentDateString);
      const hasEvents = eventsForDay.length > 0;
      const isSelected = currentDateString === selectedDate;

      calendarCells.push(
        <div 
          key={day} 
          className={`calendar-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => this.handleDayClick(day)}
        >
          {day}
          {hasEvents && <span className="event-count">{eventsForDay.length}</span>}
        </div>
      );
    }

    return calendarCells;
  };

  renderEventsList = () => {
    const { selectedDate, events, isLoading } = this.state;
    if (!selectedDate) return null;
    if (isLoading) return <div className="loading">Loading events...</div>;
    
    const eventsForDate = events.filter(event => event.date === selectedDate);
    
    if (eventsForDate.length === 0) {
      return <div className="no-events">No events scheduled for this date</div>;
    }
    
    return eventsForDate.map(event => (
      <div key={event._id} className="event-item">
        <div className="event-info">
          <div className="event-time">{event.time}</div>
          <div className="event-title">{event.title}</div>
          <div className="event-description">{event.description}</div>
        </div>
        <div className="event-actions">
          <button 
            className="event-action-btn edit"
            onClick={() => this.showEditEventForm(event)}
            title="Edit event"
          >
            ✎
          </button>
          <button 
            className="event-action-btn delete"
            onClick={() => this.deleteEvent(event._id)}
            title="Delete event"
          >
            ✕
          </button>
        </div>
      </div>
    ));
  };

  render() {
    const { 
      currentDate, 
      selectedDate, 
      showEventForm, 
      newEvent, 
      isEditing,
      isLoading,
      error 
    } = this.state;

    return (
      <div className="calendar-container">
        <div className="calendar-left">
          <div className="calendar-header">
            <h1>Community Calendar</h1>
            <div className="month-navigation">
              <span>{this.monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}</span>
              <div className="nav-buttons">
                <button 
                  onClick={this.goToPreviousMonth}
                  title="Previous month"
                >
                  &lt;
                </button>
                <button 
                  onClick={this.goToNextMonth}
                  title="Next month"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
          
          <div className="calendar-grid">
            {this.weekDays.map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {this.renderCalendarGrid()}
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
              {selectedDate && !showEventForm && (
                <button 
                  className="add-event-btn" 
                  onClick={this.showAddEventForm}
                  title="Add new event"
                >
                  Add Event
                </button>
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {showEventForm && (
              <form className="event-form" onSubmit={this.handleEventFormSubmit}>
                <div className="form-group">
                  <label>Event Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => this.updateFormField('time', e.target.value)}
                    required
                    title="Select event time"
                  />
                </div>
                <div className="form-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => this.updateFormField('title', e.target.value)}
                    required
                    placeholder="Enter event title"
                    title="Enter event title"
                  />
                </div>
                <div className="form-group">
                  <label>Event Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => this.updateFormField('description', e.target.value)}
                    placeholder="Enter event description (optional)"
                    title="Enter event description"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="form-submit-btn"
                    disabled={isLoading}
                    title={isEditing ? "Save changes" : "Save event"}
                  >
                    {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save Event')}
                  </button>
                  <button 
                    type="button" 
                    className="form-cancel-btn"
                    onClick={this.cancelEventForm}
                    disabled={isLoading}
                    title="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="events-list">
              {this.renderEventsList()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarClass;