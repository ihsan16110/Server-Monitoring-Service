// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const app = express();
// const mongoose = require('mongoose');
// const Metrics = require('./models/Metrics');// Import Metrics model
// const ServerModel = require('./models/Server');// Import Server model
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:3002',
//     methods: ['GET', 'POST']
//   }
// });

// // CORS middleware
// app.use(cors({
//   origin: 'http://localhost:3002',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }));

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Route to add a new server
// app.post('/api/servers', async (req, res) => {
//   const { name, ip, location } = req.body;
//   const server = new ServerModel({ name, ip, location });
//   await server.save();
//   res.send(server);
// });

// // Route to get all servers
// app.get('/api/servers', async (req, res) => {
//   const servers = await ServerModel.find();
//   res.send(servers);
// });

// // Route to add metrics for a server
// app.post('/api/metrics', async (req, res) => {
//   const { server_id, cpu, memory, disk, network } = req.body;
//   const metrics = new Metrics({ server_id, cpu, memory, disk, network });
//   await metrics.save();
//   io.emit('new-metrics', metrics); // Emit new data to WebSocket clients
//   res.send(metrics);
// });

// // Route to get metrics for a specific server
// app.get('/api/metrics/:server_id', async (req, res) => {
//   const { server_id } = req.params;
//   const metrics = await Metrics.find({ server_id }).sort({ timestamp: -1 }).limit(100);
//   res.send(metrics);
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Server!');
// });

// // WebSocket connection handling
// io.on('connection', (socket) => {
//   console.log('A User Connected');
//   socket.on('disconnect', () => {
//     console.log('User Disconnected');
//   });
// });

// // Start the server
// server.listen(3000, () => {
//   console.log('Server is Running on http://localhost:3000');
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Metrics = require('./models/Metrics'); // Import Metrics model
const ServerModel = require('./models/Server'); // Import Server model

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3002',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to add a new server
app.post('/api/servers', async (req, res) => {
  const { name, ip, location } = req.body;
  const server = new ServerModel({ name, ip, location });
  await server.save();
  res.send(server);
});

// Route to get all servers
app.get('/api/servers', async (req, res) => {
  const servers = await ServerModel.find();
  res.send(servers);
});

// Route to add metrics for a server
app.post('/api/metrics', async (req, res) => {
  const { server_id, cpu, memory, disk, network } = req.body;
  const metrics = new Metrics({ server_id, cpu, memory, disk, network });
  await metrics.save();
  io.emit('new-metrics', metrics); // Emit new data to WebSocket clients
  res.send(metrics);
});

// Route to get metrics for a specific server
app.get('/api/metrics/:server_id', async (req, res) => {
  const { server_id } = req.params;
  const metrics = await Metrics.find({ server_id }).sort({ timestamp: -1 }).limit(100);
  res.send(metrics);
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Server!');
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A User is Connected');
  socket.on('disconnect', () => {
    console.log('User is Disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

