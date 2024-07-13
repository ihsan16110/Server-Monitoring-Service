
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');
const ServerModel = require('./models/Server');
const Metrics = require('./models/Metrics');

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/monitoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Endpoints

// Add a new server
app.post('/api/servers', async (req, res) => {
  const { name, ip, location } = req.body;
  const server = new ServerModel({ name, ip, location });
  await server.save();
  res.send(server);
});

// Get all servers
app.get('/api/servers', async (req, res) => {
  const servers = await ServerModel.find();
  res.send(servers);
});

// Add metrics for a server
app.post('/api/metrics', async (req, res) => {
  const { server_id, cpu, memory, disk, network } = req.body;
  const metrics = new Metrics({ server_id, cpu, memory, disk, network });
  await metrics.save();
  io.emit('new-metrics', metrics); // Emit new data to WebSocket clients
  res.send(metrics);
});

// Get metrics for a server
app.get('/api/metrics/:server_id', async (req, res) => {
  const { server_id } = req.params;
  const metrics = await Metrics.find({ server_id }).sort({ timestamp: -1 }).limit(100);
  res.send(metrics);
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the Server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

