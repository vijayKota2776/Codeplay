// backend/server.js
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

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'CodePlay Backend OK' });
});

// Routes
app.use('/api', authRoutes);                   // /api/register, /api/login, /api/me
app.use('/api/ide', ideRoutes);                // /api/ide/run
app.use('/api/progress', progressRoutes);      // /api/progress/update
app.use('/api/submissions', submissionRoutes); // /api/submissions/...
app.use('/api', reviewRoutes);                 // /api/submissions/:id/reviews
app.use('/api', dashboardRoutes);              // /api/dashboard, /api/leaderboard
app.use('/api/courses', courseRoutes);         // /api/courses...


const labRoutes = require('./routes/labRoutes');
app.use('/api/labs', labRoutes);

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CodePlay backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;

