const { getCategoryByRoute, getModelById } = require('../config/models');

function validateApiRequest(categoryRoute) {
  return (req, res, next) => {
    const category = getCategoryByRoute(categoryRoute);
    if (!category) {
      return res.status(400).json({ success: false, error: `Unknown category route: ${categoryRoute}` });
    }

    let imageBuffer = null;

    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.body && req.body.image) {
      const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    }

    if (!imageBuffer) {
      return res.status(400).json({ success: false, error: 'No image provided. Upload a file or include a base64 image string.' });
    }

    const modelId = req.body.model || req.query.model || category.models[0].id;
    const modelConfig = getModelById(categoryRoute, modelId);
    if (!modelConfig) {
      return res.status(400).json({ success: false, error: `Invalid model: ${modelId}` });
    }

    let scale = req.body.scale || req.query.scale;
    if (modelConfig.scales && modelConfig.scales.length > 0 && !scale) {
      scale = modelConfig.scales[0];
    }
    if (scale && !modelConfig.scales.includes(scale)) {
      return res.status(400).json({ success: false, error: `Unsupported scale: ${scale}. Supported: ${modelConfig.scales.join(', ')}` });
    }

    req.processing = {
      imageBuffer,
      modelConfig,
      scale: scale || null,
    };

    next();
  };
}

module.exports = {
  validateApiRequest,
};
