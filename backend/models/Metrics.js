
const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  server_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  timestamp: { type: Date, default: Date.now },
  cpu: Number,
  memory: Number,
  disk: Number,
  network: Number,
});

module.exports = mongoose.model('Metrics', metricsSchema);

