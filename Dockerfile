FROM node:20-alpine

ARG PORT=3000
ENV PORT=${PORT}
ENV VITE_BASE_URL=https://edlas.lolskins.gg/api/

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install serve globally
RUN npm install -g serve

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose the desired port
EXPOSE $PORT

# Command to serve the build folder
CMD ["sh", "-c", "serve -s dist -l $PORT"]
