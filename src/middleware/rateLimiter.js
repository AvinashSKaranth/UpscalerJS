const rateLimit = require('express-rate-limit');
const config = require('../config');

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
