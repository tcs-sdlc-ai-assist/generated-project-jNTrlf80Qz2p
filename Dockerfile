# Multi-stage Dockerfile for a Vite / React SPA.
# Build stage produces static assets, runtime stage serves them via nginx.

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback — any unknown route → /index.html so client router takes over.
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / {\n    try_files $uri /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
