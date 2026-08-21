# ---- Stage 1: build Angular ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production


# ---- Stage 2: image de production (nginx non-root) ----
# nginx-unprivileged tourne nativement en tant qu'utilisateur "nginx" (uid 101),
# ce qui évite d'avoir à retoucher les permissions de l'image nginx officielle.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/isi-elearning/browser /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
