const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { updateProgress, getProgress } = require('../controllers/progressController');

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

// GET /api/progress/:courseId
router.get('/:courseId', auth, getProgress);

router.post(
  '/update',
  auth,
  basicProgressValidator,
  updateProgress
);

module.exports = router;
