# ─────────────────────────────────────────────────────────────────────────────
# GlobeX AI — Production Dockerfile
# ─────────────────────────────────────────────────────────────────────────────

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm install --save-dev typescript @types/node

# Copy source
COPY src ./src/

# Build TypeScript
RUN npm run build

# Generate Prisma
RUN npx prisma generate

# ─────────────────────────────────────────────────────────────────────────────

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma/
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3000

# Run with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

# ─────────────────────────────────────────────────────────────────────────────
# Build: docker build -t globex-ai:latest .
# Run:   docker run -p 3000:3000 \
#          -e DATABASE_URL=postgresql://... \
#          -e JWT_SECRET=... \
#          globex-ai:latest
# ─────────────────────────────────────────────────────────────────────────────
