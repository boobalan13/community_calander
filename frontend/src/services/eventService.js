const API_BASE_URL = 'https://community-calander.onrender.com/api';

const eventService = {
    /**
     * @returns {Promise<Array>}  
     */
    getAllEvents: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) throw new Error('Failed to fetch events');
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    /**
     * @param {string} date  
     * @returns {Promise<Array>}  
     */
    getEventsByDate: async (date) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/date/${date}`);
            if (!response.ok) throw new Error('Failed to fetch events for date');
            return await response.json();
        } catch (error) {
            console.error('Error fetching events for date:', error);
            throw error;
        }
    },

    /**
     * @param {Object} eventData  
     * @returns {Promise<Object>}  
     */
    createEvent: async (eventData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });
            if (!response.ok) throw new Error('Failed to create event');
            return await response.json();
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },

    /**
     * @param {string} eventId  
     * @param {Object} eventData  
     * @returns {Promise<Object>}  
     */
    updateEvent: async (eventId, eventData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });
            if (!response.ok) throw new Error('Failed to update event');
            return await response.json();
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    },

    /**
     * @param {string} eventId  
     * @returns {Promise<void>}
     */
    deleteEvent: async (eventId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete event');
            return await response.json();
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    },
};

export default eventService;