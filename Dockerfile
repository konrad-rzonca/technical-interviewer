FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runs nginx as a non-root user.
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# The app's homepage in package.json is /technical-interviewer, so its files live under that path.
COPY --from=build /app/build /usr/share/nginx/site/technical-interviewer
EXPOSE 8080
