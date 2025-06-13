# ---- Build stage ----
FROM node:18-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
  curl \
  gnupg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
COPY templates ./templates
RUN npm run build

# ---- Runtime stage ----
FROM node:18-slim

# Install Chromium and dependencies
RUN apt-get update && \
    apt-get install -y \
    chromium \
    fonts-liberation \
    libglib2.0-0 \
    libnss3 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    --no-install-recommends

RUN chmod -R o+rx /usr/bin/chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('puppeteer-core').launch({args:['--no-sandbox']}).then(b => b.close())"

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/templates ./templates

EXPOSE 8080

CMD ["node", "dist/main"]
