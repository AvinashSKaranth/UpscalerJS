# UpscalerJS Image Enhancement API Server

AI-powered image enhancement APIs built with Node.js, Express, and the [UpscalerJS](https://upscalerjs.com) ecosystem. Supports GPU/CPU auto-detection, file upload, base64 input, and live demo pages.

## Features

- **7 Image Enhancement Categories**: Upscaling, Deblurring, Denoising, Low Light Enhancement, Retouching, Deraining, Dehazing
- **Multiple Models**: ESRGAN variants (Slim, Medium, Thick, Legacy, Default) and MAXIM models
- **GPU/CPU Auto-Detection**: Automatically uses TensorFlow GPU if available, falls back to CPU
- **Flexible Input/Output**: Accept `multipart/form-data` or `application/json` (base64). Return raw image or base64 JSON
- **Interactive Demo UI**: EJS-based frontend to test every API with live previews
- **Swagger/OpenAPI Docs**: Auto-generated API documentation at `/api-docs`
- **Docker Support**: CPU and GPU Docker Compose configurations
- **Rate Limiting**: Configurable per-endpoint rate limits

## Quick Start

### Prerequisites

- Node.js >= 18
- (Optional) NVIDIA GPU with CUDA for GPU acceleration

### Installation

```bash
# Clone the repository
cd upscalerjs-api-server

# Copy environment file
cp .env.example .env

# Install dependencies
npm install
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

Server starts on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Landing page with all APIs |
| GET | `/api/health` | Health check + backend info |
| GET | `/api/models` | List all available models |
| POST | `/api/upscale` | Upscale image |
| POST | `/api/deblur` | Deblur image |
| POST | `/api/denoise` | Denoise image |
| POST | `/api/enhance` | Low light enhancement |
| POST | `/api/retouch` | Retouch image |
| POST | `/api/derain` | Remove rain |
| POST | `/api/dehaze` | Remove haze |
| GET | `/api-docs` | Swagger UI |

### Request Format

**Multipart (file upload)**

```bash
curl -X POST "http://localhost:3000/api/upscale?model=esrgan-slim&scale=2x&output=file" \
  -F "image=@photo.png"
```

**JSON (base64)**

```bash
curl -X POST "http://localhost:3000/api/upscale?model=esrgan-slim&scale=2x&output=base64" \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,iVBORw0KGgo..."}'
```

**Parameters**

- `model` - Model ID (see `/api/models`)
- `scale` - Scale factor for upscaling (`2x`, `3x`, `4x`, `8x`)
- `output` - Response format: `file` (default) or `base64`

### Response Format

- `output=file` → `Content-Type: image/png` with raw image bytes
- `output=base64` → JSON `{ success: true, image: "data:image/png;base64,...", encoding: "base64" }`

## Docker

### CPU

```bash
docker-compose up --build
```

### GPU

```bash
docker-compose -f docker-compose.gpu.yml up --build
```

Requires [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html).

## Project Structure

```
├── src/
│   ├── app.js              # Express configuration
│   ├── server.js           # Entry point
│   ├── config/             # Environment + model registry
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Upload, validation, rate limit, errors
│   ├── routes/             # API + page routes
│   ├── services/           # Upscaler logic + image processing pipeline
│   ├── utils/              # GPU detector + response helpers
│   └── views/              # EJS templates + demo pages
├── public/css/             # Stylesheets
├── Dockerfile
├── docker-compose.yml
├── docker-compose.gpu.yml
└── .env.example
```

## Model Reference

| Task | Models |
|------|--------|
| Upscaling | ESRGAN Slim, Medium, Thick, Legacy, Default |
| Deblurring | MAXIM Deblurring |
| Denoising | MAXIM Denoising |
| Low Light | MAXIM Enhancement |
| Retouching | MAXIM Retouching |
| Deraining | MAXIM Deraining |
| Dehazing | MAXIM Dehazing Indoor, Outdoor |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Runtime environment |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `10` | Max requests per window |

## Notes

- `tfjs-node-gpu` is an optional dependency. If CUDA is unavailable, the server falls back to `tfjs-node` automatically.
- 8x upscaling is only supported by ESRGAN Slim in Node.js.
- Both input and output tensors are disposed after processing to prevent memory leaks.
