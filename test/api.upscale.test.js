const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { exec } = require('child_process');
const { promisify } = require('util');

const app = require('../src/app');
const { initializeBackend } = require('../src/services/upscalerService');

const execAsync = promisify(exec);
const PORT = 3456;
const IMAGE_PATH = path.join(__dirname, 'low-quality.jpg');

async function curlRequest(endpoint, extraArgs) {
  const url = `http://localhost:${PORT}${endpoint}`;
  const cmd = `curl -s -w "\\nHTTP_STATUS:%{http_code}\\nCONTENT_TYPE:%{content_type}\\n" -X POST "${url}" ${extraArgs || ''}`;
  const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 50 * 1024 * 1024 });
  if (stderr) console.error('curl stderr:', stderr);

  const lines = stdout.split('\n');
  const statusLine = lines.find(l => l.startsWith('HTTP_STATUS:'));
  const contentTypeLine = lines.find(l => l.startsWith('CONTENT_TYPE:'));
  const status = parseInt(statusLine?.split(':')[1]?.trim(), 10);
  const contentType = contentTypeLine?.split(':').slice(1).join(':').trim();
  const data = stdout.substring(0, stdout.lastIndexOf('HTTP_STATUS:'));
  return { status, contentType, data };
}

async function runTests() {
  initializeBackend();
  const server = app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
  });

  try {
    // Test 1: Upscale with esrgan-slim, 2x scaling
    console.log('\nTest 1: Upscale with esrgan-slim, 2x scaling');
    const outputPath = path.join(__dirname, 'output-2x.png');
    const res1 = await curlRequest('/api/upscale?model=esrgan-slim&scale=2x&output=file', `-F "image=@${IMAGE_PATH}" -o "${outputPath}"`);
    assert.strictEqual(res1.status, 200, `Expected 200, got ${res1.status}`);
    assert(res1.contentType.startsWith('image/png'), `Expected image/png, got ${res1.contentType}`);
    const stats = fs.statSync(outputPath);
    assert(stats.size > 1000, 'Output image should be larger than 1KB');
    console.log('  PASS: Upscaled image saved to test/output-2x.png, size:', stats.size);

    // Test 2: Missing scale for upscaling model should default to first supported scale
    console.log('\nTest 2: Missing scale defaults to first supported scale');
    const defaultPath = path.join(__dirname, 'output-default.png');
    const res2 = await curlRequest('/api/upscale?model=esrgan-slim&output=file', `-F "image=@${IMAGE_PATH}" -o "${defaultPath}"`);
    assert.strictEqual(res2.status, 200, `Expected 200, got ${res2.status}`);
    assert(res2.contentType.startsWith('image/png'), `Expected image/png, got ${res2.contentType}`);
    console.log('  PASS: Missing scale defaulted correctly');

    // Test 3: Invalid model should return 400
    console.log('\nTest 3: Invalid model returns 400');
    const res3 = await curlRequest('/api/upscale?model=invalid-model&scale=2x&output=file', `-F "image=@${IMAGE_PATH}"`);
    assert.strictEqual(res3.status, 400, `Expected 400, got ${res3.status}`);
    const body3 = JSON.parse(res3.data);
    assert.strictEqual(body3.success, false);
    assert(body3.error.includes('Invalid model'), `Expected 'Invalid model' error, got: ${body3.error}`);
    console.log('  PASS: Invalid model rejected with 400');

    // Test 4: Invalid scale should return 400
    console.log('\nTest 4: Invalid scale returns 400');
    const res4 = await curlRequest('/api/upscale?model=esrgan-slim&scale=99x&output=file', `-F "image=@${IMAGE_PATH}"`);
    assert.strictEqual(res4.status, 400, `Expected 400, got ${res4.status}`);
    const body4 = JSON.parse(res4.data);
    assert.strictEqual(body4.success, false);
    assert(body4.error.includes('Unsupported scale'), `Expected 'Unsupported scale' error, got: ${body4.error}`);
    console.log('  PASS: Invalid scale rejected with 400');

    console.log('\nAll tests passed!');
  } catch (err) {
    console.error('\nTest failed:', err.message);
    if (err.stack) console.error(err.stack);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
