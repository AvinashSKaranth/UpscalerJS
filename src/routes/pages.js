const express = require('express');
const router = express.Router();
const { modelRegistry } = require('../config/models');

router.get('/', (req, res) => {
  res.render('index', { title: 'UpscalerJS API Server', categories: modelRegistry });
});

const demoRoutes = [
  { path: '/demo/upscaling', view: 'demos/upscaling', category: 'upscaling', title: 'Upscaling Demo' },
  { path: '/demo/deblurring', view: 'demos/deblurring', category: 'deblurring', title: 'Deblurring Demo' },
  { path: '/demo/denoising', view: 'demos/denoising', category: 'denoising', title: 'Denoising Demo' },
  { path: '/demo/enhancement', view: 'demos/enhancement', category: 'low-light-enhancement', title: 'Low Light Enhancement Demo' },
  { path: '/demo/retouching', view: 'demos/retouching', category: 'retouching', title: 'Retouching Demo' },
  { path: '/demo/deraining', view: 'demos/deraining', category: 'deraining', title: 'Deraining Demo' },
  { path: '/demo/dehazing', view: 'demos/dehazing', category: 'dehazing', title: 'Dehazing Demo' },
];

demoRoutes.forEach((demo) => {
  router.get(demo.path, (req, res) => {
    const category = modelRegistry[demo.category];
    res.render(demo.view, {
      title: demo.title,
      category,
      apiEndpoint: `/api/${category.route}`,
    });
  });
});

module.exports = router;
