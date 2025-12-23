# ---------- Build stage ----------
FROM node:20-alpine AS builder

ARG PORT=3000
ENV PORT=${PORT}
ENV VITE_BASE_URL=https://edlas.lolskins.gg/api/
ENV NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM node:20-alpine

ARG PORT=3000
ENV PORT=${PORT}

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE $PORT

# Start the app
CMD ["sh", "-c", "serve -s dist -l $PORT"]
