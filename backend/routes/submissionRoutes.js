const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/auth');
const {
  createSubmission,
  getMySubmissions,
  getExerciseSubmissions
} = require('../controllers/submissionController');


router.post('/', requireAuth, createSubmission);


router.get('/me', requireAuth, getMySubmissions);


router.get('/exercise/:exerciseId', requireAuth, getExerciseSubmissions);

module.exports = router;
