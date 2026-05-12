function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: 'File too large. Max 10 MB.' });
  }

  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
}

module.exports = errorHandler;
