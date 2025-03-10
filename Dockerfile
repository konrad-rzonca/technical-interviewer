# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Set theme argument (default to ubs)
ARG THEME=ubs
ENV REACT_APP_THEME=${THEME}

# Build the app for production
RUN npm run build:${THEME}

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create temp directories and fix permissions
RUN mkdir -p /tmp/nginx_client_temp \
    /tmp/nginx_proxy_temp \
    /tmp/nginx_fastcgi_temp \
    /tmp/nginx_uwsgi_temp \
    /tmp/nginx_scgi_temp \
    && chmod 777 /tmp/nginx_* \
    && touch /tmp/nginx.pid \
    && chmod 777 /tmp/nginx.pid \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Expose port
EXPOSE 80

# Start nginx with custom PID path
CMD ["nginx", "-g", "daemon off; pid /tmp/nginx.pid;"]