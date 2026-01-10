// start server (restart trigger)
require('dotenv').config();
const ImageKit = require("imagekit");
const app = require('./src/app');


const connectDB = require('./src/db/db');
connectDB();

const http = require('http');
const { Server } = require("socket.io");
const socketHandler = require('./src/socketHandler');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to our router
app.set('io', io);

// Initialize Socket Handler
socketHandler(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});