FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 9000

# Start
CMD ["npm", "start"]