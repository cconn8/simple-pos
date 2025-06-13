# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy all source code including templates
COPY . .

# Ensure templates are included
# (This line is optional if you've already done `COPY . .` above and it includes everything)
# COPY src/invoice/templates ./src/invoice/templates

RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/invoice/templates ./src/invoice/templates

EXPOSE 8080
CMD ["node", "dist/main"]