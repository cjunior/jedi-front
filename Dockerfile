# ---------- Build Angular ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Nginx ----------
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia APENAS a pasta browser
COPY --from=build /app/dist/*/browser /usr/share/nginx/html/browser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

