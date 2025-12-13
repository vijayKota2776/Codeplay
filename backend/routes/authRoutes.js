const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');
const requireAuth = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  register,
  login,
  getMe
} = require('../controllers/authController');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

module.exports = router;
