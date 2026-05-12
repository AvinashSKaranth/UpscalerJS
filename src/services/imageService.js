const { getTf, loadModel } = require('./upscalerService');

async function processImage(bufferOrPath, modelConfig) {
  const tf = getTf();
  const { package: packageName, scale } = modelConfig;

  const upscaler = loadModel(packageName, scale || undefined);

  let inputTensor;
  let useBuffer = false;
  let sourceBuffer;

  if (Buffer.isBuffer(bufferOrPath)) {
    sourceBuffer = bufferOrPath;
    inputTensor = tf.node.decodeImage(bufferOrPath, 3);
    useBuffer = true;
  } else if (typeof bufferOrPath === 'string') {
    inputTensor = bufferOrPath;
  } else {
    throw new Error('Unsupported input type. Provide a Buffer or file path string.');
  }

  try {
    const resultTensor = await upscaler.upscale(inputTensor);

    if (resultTensor instanceof tf.Tensor) {
      const outputBuffer = Buffer.from(await tf.node.encodePng(resultTensor));
      resultTensor.dispose();
      if (useBuffer && inputTensor instanceof tf.Tensor) {
        inputTensor.dispose();
      }
      return outputBuffer;
    }

    if (typeof resultTensor === 'string') {
      if (useBuffer && inputTensor instanceof tf.Tensor) {
        inputTensor.dispose();
      }
      return Buffer.from(resultTensor, 'base64');
    }

    throw new Error('Unexpected upscale result type');
  } catch (err) {
    if (useBuffer && inputTensor instanceof tf.Tensor) {
      inputTensor.dispose();
    }
    throw err;
  }
}

module.exports = {
  processImage,
};
