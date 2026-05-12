const { processImage } = require('../services/imageService');
const { sendImageResponse, getOutputFormat } = require('../utils/responseHelper');
const { modelRegistry } = require('../config/models');

async function handleEnhancement(req, res) {
  try {
    const { imageBuffer, modelConfig, scale } = req.processing;
    const outputFormat = getOutputFormat(req);

    const configForService = {
      package: modelConfig.package,
      scale: scale || undefined,
    };

    const resultBuffer = await processImage(imageBuffer, configForService);
    sendImageResponse(res, resultBuffer, outputFormat);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function getModels(req, res) {
  res.json({ success: true, data: modelRegistry });
}

function healthCheck(req, res) {
  const { getBackend } = require('../services/upscalerService');
  res.json({
    success: true,
    status: 'ok',
    backend: getBackend(),
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  handleEnhancement,
  getModels,
  healthCheck,
};
