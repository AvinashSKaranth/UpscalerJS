require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10,
};
