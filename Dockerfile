FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
