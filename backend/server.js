const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
