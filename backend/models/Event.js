const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


eventSchema.index({ date: 1 });
eventSchema.index({ createdAt: -1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
