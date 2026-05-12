function sendImageResponse(res, buffer, format) {
  if (format === 'base64') {
    return res.json({
      success: true,
      image: `data:image/png;base64,${buffer.toString('base64')}`,
      encoding: 'base64',
    });
  }

  res.set('Content-Type', 'image/png');
  res.send(buffer);
}

function getOutputFormat(req) {
  const queryOutput = req.query.output;
  if (queryOutput === 'base64') return 'base64';
  if (queryOutput === 'file' || queryOutput === 'image') return 'file';

  const accept = req.headers.accept || '';
  if (accept.includes('application/json')) return 'base64';
  if (accept.includes('image/')) return 'file';

  return 'file';
}

module.exports = {
  sendImageResponse,
  getOutputFormat,
};
