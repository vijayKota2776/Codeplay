// backend/routes/progressRoutes.js
const express = require('express');
const router = express.Router();

// adjust paths to match your project:
const auth = require('../middleware/auth');              // module.exports = auth;
const { updateProgress } = require('../controllers/progressController');
// or, if your controller does module.exports = { updateProgress }
// keep as above; if it does module.exports = updateProgress, change import to:
// const updateProgress = require('../controllers/progressController');

function basicProgressValidator(req, res, next) {
  const { courseId, topicId, xp } = req.body;
  if (!courseId || !topicId) {
    return res.status(400).json({ message: 'courseId and topicId are required' });
  }
  if (xp != null && typeof xp !== 'number') {
    return res.status(400).json({ message: 'xp must be a number if provided' });
  }
  next();
}

// POST /api/progress/update
router.post(
  '/update',
  auth,
  basicProgressValidator,
  updateProgress
);

module.exports = router;
