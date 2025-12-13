const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/auth');
const {
  getDashboard,
  getLeaderboard
} = require('../controllers/dashboardController');


router.get('/dashboard', requireAuth, getDashboard);


router.get('/leaderboard', getLeaderboard);

module.exports = router;
