const { detectBackend } = require('../utils/gpuDetector');

let tf;
let Upscaler;
let backend;

function initializeBackend() {
  const detected = detectBackend();
  tf = detected.tf;
  Upscaler = detected.Upscaler;
  backend = detected.backend;
  return backend;
}

const modelCache = new Map();

function getCacheKey(packageName, scale) {
  return scale ? `${packageName}:${scale}` : packageName;
}

function loadModel(packageName, scale) {
  const key = getCacheKey(packageName, scale);
  if (modelCache.has(key)) {
    return modelCache.get(key);
  }

  let model;
  if (scale) {
    model = require(`${packageName}/${scale}`);
  } else {
    model = require(packageName);
  }

  const upscaler = new Upscaler({ model });
  modelCache.set(key, upscaler);
  return upscaler;
}

function getBackend() {
  return backend;
}

function getTf() {
  return tf;
}

module.exports = {
  initializeBackend,
  loadModel,
  getBackend,
  getTf,
};
