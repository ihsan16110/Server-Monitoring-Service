
const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: String,
  ip: String,
  location: String,
});

// module.exports = mongoose.model('Server', serverSchema);
const ServerModel = mongoose.model('Server', serverSchema);
module.exports = ServerModel;

