const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  cpu: Number,
  memory: Number,
  disk: Number,
  network: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Metrics', metricsSchema);
