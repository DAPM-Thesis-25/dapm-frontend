# --- build CRA ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- serve with nginx, render config at runtime ---
FROM nginx:1.27-alpine
RUN apk add --no-cache gettext   # for envsubst

# CRA build output
COPY --from=build /app/build /usr/share/nginx/html

# runtime config template and entrypoint
COPY public/config-template.js /usr/share/nginx/html/config-template.js
COPY docker-entrypoint.sh /docker-entrypoint.d/10-render-config.sh
RUN chmod +x /docker-entrypoint.d/10-render-config.sh

EXPOSE 80
