# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ .

# Build the application
RUN npm run build:prod

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
RUN npm install -g http-server

# Copy built application from builder
COPY --from=builder /app/dist/frontend/browser ./dist

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4200 || exit 1

# Start the application
CMD ["http-server", "dist", "-p", "4200", "-g"]
