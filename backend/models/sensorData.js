const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  metadata: {
    device_id: { type: String, required: true },
    location: { type: String, required: true },
    sensor_type: { type: String, required: true },
    unit: { type: String, required: true },
  },
  value: { type: Number, required: true },
});

module.exports = mongoose.model('SensorData', sensorDataSchema); 