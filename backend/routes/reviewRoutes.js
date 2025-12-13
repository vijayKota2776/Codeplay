const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/auth');
const {
  addReview,
  getReviews
} = require('../controllers/reviewController');


router.post('/submissions/:id/reviews', requireAuth, addReview);


router.get('/submissions/:id/reviews', requireAuth, getReviews);

module.exports = router;
