# ============================================================
# DocReady — Dockerfile
# Serves the static frontend via Nginx (lightweight, production-ready)
# Future: swap the Nginx stage for a Python/Flask backend stage
# ============================================================

# ------------------------------------------------------------
# Stage 1 — Build / Lint stage (optional static validation)
# Uses Node only to validate JSON data files; no bundler needed
# since DocReady is plain HTML/CSS/JS with no build step.
# ------------------------------------------------------------
FROM node:20-alpine AS validator

WORKDIR /app

# Copy data and lang files for JSON validation
COPY data/ ./data/
COPY lang/ ./lang/

# Validate JSON files so bad data never ships to production
RUN node -e " \
  const fs = require('fs'); \
  const files = ['data/services.json', 'lang/en.json']; \
  files.forEach(f => { \
    if (fs.existsSync(f)) { \
      JSON.parse(fs.readFileSync(f, 'utf8')); \
      console.log('✅ Valid JSON:', f); \
    } else { \
      console.log('⚠️  Not found (skipping):', f); \
    } \
  }); \
  console.log('JSON validation complete.'); \
"


# ------------------------------------------------------------
# Stage 2 — Production image
# Serves the static site with Nginx on port 80
# ------------------------------------------------------------
FROM nginx:1.27-alpine AS production

LABEL maintainer="DocReady Team <code.swecha.org>"
LABEL description="DocReady — Government Document Checklist for Indian Citizens"
LABEL version="1.0.0"

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy all static assets into Nginx web root
COPY index.html    /usr/share/nginx/html/
COPY style.css     /usr/share/nginx/html/
COPY app.js        /usr/share/nginx/html/
COPY data/         /usr/share/nginx/html/data/
COPY lang/         /usr/share/nginx/html/lang/

# Copy custom Nginx config for SPA-style routing and caching headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx runs as non-root for security
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check — verifies Nginx is serving the app
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ | grep -q "DocReady" || exit 1

# Start Nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]


# ============================================================
# HOW TO BUILD AND RUN
# ============================================================
#
#   Build the image:
#     docker build -t docready:latest .
#
#   Run the container:
#     docker run -d -p 8080:80 --name docready docready:latest
#
#   Open in browser:
#     http://localhost:8080
#
#   Stop and remove:
#     docker stop docready && docker rm docready
#
# ============================================================
#
# NGINX CONFIG (nginx.conf) — create this file in the project root:
#
#   server {
#       listen 80;
#       server_name _;
#       root /usr/share/nginx/html;
#       index index.html;
#
#       location / {
#           try_files $uri $uri/ /index.html;
#       }
#
#       location ~* \.(css|js|json|png|jpg|svg|ico|woff2?)$ {
#           expires 7d;
#           add_header Cache-Control "public, immutable";
#       }
#
#       add_header X-Frame-Options DENY;
#       add_header X-Content-Type-Options nosniff;
#       add_header Referrer-Policy no-referrer;
#   }
#
# ============================================================
