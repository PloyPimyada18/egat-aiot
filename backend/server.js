const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Client } = require('pg');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'chlorella-aiot-cluster'
})
  .then(() => console.log('Connected to MongoDB - chlorella-aiot-cluster database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// PostgreSQL Connection Test
const pgClient = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgClient.connect(err => {
  if (err) {
    console.error('PostgreSQL connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database successfully!');
  }
});

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