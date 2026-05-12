const modelRegistry = {
  upscaling: {
    route: 'upscale',
    description: 'Increase image resolution using super-resolution models.',
    models: [
      { id: 'esrgan-slim', name: 'ESRGAN Slim', package: '@upscalerjs/esrgan-slim', scales: ['2x', '3x', '4x', '8x'] },
      { id: 'esrgan-medium', name: 'ESRGAN Medium', package: '@upscalerjs/esrgan-medium', scales: ['2x', '3x', '4x'] },
      { id: 'esrgan-thick', name: 'ESRGAN Thick', package: '@upscalerjs/esrgan-thick', scales: ['2x', '3x', '4x'] },
      { id: 'esrgan-legacy', name: 'ESRGAN Legacy', package: '@upscalerjs/esrgan-legacy', scales: ['2x', '3x', '4x'] },
      { id: 'default-model', name: 'Default Model', package: '@upscalerjs/default-model', scales: [] },
    ],
  },
  deblurring: {
    route: 'deblur',
    description: 'Remove motion blur and out-of-focus blur from images.',
    models: [
      { id: 'maxim-deblurring', name: 'MAXIM Deblurring', package: '@upscalerjs/maxim-deblurring', scales: [] },
    ],
  },
  denoising: {
    route: 'denoise',
    description: 'Reduce noise and grain from images.',
    models: [
      { id: 'maxim-denoising', name: 'MAXIM Denoising', package: '@upscalerjs/maxim-denoising', scales: [] },
    ],
  },
  'low-light-enhancement': {
    route: 'enhance',
    description: 'Enhance visibility in low-light and nighttime images.',
    models: [
      { id: 'maxim-enhancement', name: 'MAXIM Enhancement', package: '@upscalerjs/maxim-enhancement', scales: [] },
    ],
  },
  retouching: {
    route: 'retouch',
    description: 'Remove blemishes and retouch portrait photographs.',
    models: [
      { id: 'maxim-retouching', name: 'MAXIM Retouching', package: '@upscalerjs/maxim-retouching', scales: [] },
    ],
  },
  deraining: {
    route: 'derain',
    description: 'Remove rain streaks and raindrops from images.',
    models: [
      { id: 'maxim-deraining', name: 'MAXIM Deraining', package: '@upscalerjs/maxim-deraining', scales: [] },
    ],
  },
  dehazing: {
    route: 'dehaze',
    description: 'Remove haze and fog from outdoor or indoor images.',
    models: [
      { id: 'maxim-dehazing-indoor', name: 'MAXIM Dehazing Indoor', package: '@upscalerjs/maxim-dehazing-indoor', scales: [] },
      { id: 'maxim-dehazing-outdoor', name: 'MAXIM Dehazing Outdoor', package: '@upscalerjs/maxim-dehazing-outdoor', scales: [] },
    ],
  },
};

function getCategoryByRoute(route) {
  return Object.values(modelRegistry).find((c) => c.route === route);
}

function getModelById(categoryRoute, modelId) {
  const category = getCategoryByRoute(categoryRoute);
  if (!category) return null;
  return category.models.find((m) => m.id === modelId) || null;
}

module.exports = {
  modelRegistry,
  getCategoryByRoute,
  getModelById,
};
