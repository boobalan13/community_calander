const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

 
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1, time: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/date/:date', async (req, res) => {
    try {
        const events = await Event.find({ date: req.params.date }).sort({ time: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        description: req.body.description
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (req.body.title) event.title = req.body.title;
        if (req.body.date) event.date = req.body.date;
        if (req.body.time) event.time = req.body.time;
        if (req.body.description !== undefined) event.description = req.body.description;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const result = await Event.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
