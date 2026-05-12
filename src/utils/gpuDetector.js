function detectBackend() {
  let tf;
  let Upscaler;
  let backend = 'cpu';

  try {
    tf = require('@tensorflow/tfjs-node-gpu');
    Upscaler = require('upscaler/node-gpu');
    backend = 'gpu';
  } catch (err) {
    try {
      tf = require('@tensorflow/tfjs-node');
      Upscaler = require('upscaler/node');
      backend = 'cpu';
    } catch (err2) {
      throw new Error('Failed to load TensorFlow.js backend. Ensure @tensorflow/tfjs-node is installed.');
    }
  }

  return { tf, Upscaler, backend };
}

module.exports = { detectBackend };
