const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'chlorella_aiot'
})
  .then(() => console.log('Connected to MongoDB - chlorella_aiot database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const sensorDataRouter = require('./routes/sensorData');
app.use('/api/sensor-data', sensorDataRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ultimate EGAT API' });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 