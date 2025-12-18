const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const ideRoutes = require('./routes/ideRoutes');
const progressRoutes = require('./routes/progressRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const courseRoutes = require('./routes/courseRoutes');


const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'CodePlay Backend OK' });
});


app.use('/api', authRoutes);                   
app.use('/api/ide', ideRoutes);                
app.use('/api/progress', progressRoutes);      
app.use('/api/submissions', submissionRoutes); 
app.use('/api', reviewRoutes);                 
app.use('/api', dashboardRoutes);              
app.use('/api/courses', courseRoutes);        


const labRoutes = require('./routes/labRoutes');
app.use('/api/labs', labRoutes);

const PORT = process.env.PORT || 4000;

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('leave_room', (data) => {
    socket.leave(data);
    console.log(`User with ID: ${socket.id} left room: ${data}`);
  });

  socket.on('code_change', (data) => {
    socket.to(data.room).emit('receive_code_change', data);
  });

  socket.on('send_message', (data) => {
    io.in(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`CodePlay backend running on http://localhost:${PORT}`);
    console.log(`Socket.IO initialized`);
  });
}

module.exports = app;

