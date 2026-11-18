# Stage 1: Build Frontend React / Vite static assets
FROM node:20-alpine AS builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Clean default configuration files
RUN rm -rf /etc/nginx/conf.d/*

# Copy built frontend assets to Nginx web root
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy main configuration and virtual host configs
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/ /etc/nginx/conf.d/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
