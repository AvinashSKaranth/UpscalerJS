const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { validateApiRequest } = require('../middleware/validate');
const { handleEnhancement, getModels, healthCheck } = require('../controllers/imageController');

/**
 * @openapi
 * /api/models:
 *   get:
 *     summary: List all available models
 *     responses:
 *       200:
 *         description: Registry of all models
 */
router.get('/models', getModels);

/**
 * @openapi
 * /api/upscale:
 *   post:
 *     summary: Upscale an image
 *     consumes:
 *       - multipart/form-data
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *       - in: formData
 *         name: model
 *         type: string
 *       - in: formData
 *         name: scale
 *         type: string
 *       - in: query
 *         name: output
 *         type: string
 *         enum: [file, base64]
 *     responses:
 *       200:
 *         description: Upscaled image
 */
router.post('/upscale', upload.single('image'), validateApiRequest('upscale'), handleEnhancement);

/**
 * @openapi
 * /api/deblur:
 *   post:
 *     summary: Deblur an image
 */
router.post('/deblur', upload.single('image'), validateApiRequest('deblur'), handleEnhancement);

/**
 * @openapi
 * /api/denoise:
 *   post:
 *     summary: Denoise an image
 */
router.post('/denoise', upload.single('image'), validateApiRequest('denoise'), handleEnhancement);

/**
 * @openapi
 * /api/enhance:
 *   post:
 *     summary: Enhance a low-light image
 */
router.post('/enhance', upload.single('image'), validateApiRequest('enhance'), handleEnhancement);

/**
 * @openapi
 * /api/retouch:
 *   post:
 *     summary: Retouch an image
 */
router.post('/retouch', upload.single('image'), validateApiRequest('retouch'), handleEnhancement);

/**
 * @openapi
 * /api/derain:
 *   post:
 *     summary: Remove rain from an image
 */
router.post('/derain', upload.single('image'), validateApiRequest('derain'), handleEnhancement);

/**
 * @openapi
 * /api/dehaze:
 *   post:
 *     summary: Remove haze from an image
 */
router.post('/dehaze', upload.single('image'), validateApiRequest('dehaze'), handleEnhancement);

router.get('/health', healthCheck);

module.exports = router;
