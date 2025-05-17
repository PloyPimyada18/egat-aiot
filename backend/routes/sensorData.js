const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const sensorDataSchema = require('../models/sensorData').schema;

// List of all sensor collections
const SENSOR_COLLECTIONS = [
  "sensor_co2_inflow",
  "sensor_co2_outflow",
  "sensor_ec_reactor",
  "sensor_humid_inflow",
  "sensor_humid_outflow",
  "sensor_o2_inflow",
  "sensor_o2_outflow",
  "sensor_orp_reactor",
  "sensor_ph_reactor",
  "sensor_so2_inflow",
  "sensor_so2_outflow",
  "sensor_tds_reactor",
  "sensor_temp_inflow",
  "sensor_temp_outflow",
  "sensor_temp_reactor"
];

// Helper to get model for any collection
function getSensorModel(collectionName) {
  return mongoose.model(collectionName, sensorDataSchema, collectionName);
}

// GET all collections
router.get('/collections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    res.json(collectionNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all documents from a collection
router.get('/:collection', async (req, res) => {
  try {
    const Model = getSensorModel(req.params.collection);
    const data = await Model.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET latest document from a collection
router.get('/:collection/latest', async (req, res) => {
  try {
    const Model = getSensorModel(req.params.collection);
    const latest = await Model.findOne({}).sort({ timestamp: -1 });
    if (!latest) {
      return res.status(404).json({ error: 'No data found' });
    }
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET documents by date-time range and device_id
// Example: /api/sensors/sensor_co2_inflow/filter?start=2025-05-01T00:00:00Z&end=2025-05-10T23:59:59Z&device_id=Chlorella_40L_001
router.get('/:collection/filter', async (req, res) => {
  try {
    const { start, end, device_id } = req.query;
    const Model = getSensorModel(req.params.collection);
    const filter = {};
    if (start || end) {
      filter.timestamp = {};
      if (start) filter.timestamp.$gte = new Date(start);
      if (end) filter.timestamp.$lte = new Date(end);
    }
    if (device_id) {
      filter.device_id = device_id;
    }
    const data = await Model.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET latest sensor data for all collections for a given device_id (node)
router.get('/latest-all/:device_id', async (req, res) => {
  const deviceId = req.params.device_id;
  const result = {};

  for (const collection of SENSOR_COLLECTIONS) {
    const Model = getSensorModel(collection);
    const latest = await Model.findOne({ device_id: deviceId }).sort({ timestamp: -1 });
    if (latest) {
      result[collection] = {
        value: latest.value,
        unit: latest.unit
      };
    }
  }
  res.json(result);
});

module.exports = router; 