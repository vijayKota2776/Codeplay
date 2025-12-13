const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many auth attempts, try again later.'
});

const ideLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many code runs, slow down a bit.'
});

module.exports = { authLimiter, ideLimiter };
