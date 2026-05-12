const app = require('./app');
const config = require('./config');
const { initializeBackend } = require('./services/upscalerService');

async function startServer() {
  try {
    const backend = initializeBackend();
    console.log(`TensorFlow backend initialized: ${backend.toUpperCase()}`);
  } catch (err) {
    console.error('Failed to initialize TensorFlow backend:', err.message);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(`API Docs available at http://localhost:${config.port}/api-docs`);
  });
}

startServer();
