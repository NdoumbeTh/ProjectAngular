# ---- Stage 1: build des dépendances ----
# Séparé du stage final pour ne pas embarquer le cache npm / devDependencies
# dans l'image finale (même sans étape de build type "npm run build", ce stage
# garde l'image de production propre et petite).
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


# ---- Stage 2: image de production ----
FROM node:20-alpine AS runtime

# Image de base légère (alpine) + tini pour un arrêt propre des signaux (SIGTERM)
RUN apk add --no-cache tini

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dossiers d'upload créés à l'avance + appartenance à l'utilisateur non-root
RUN mkdir -p uploads/videos uploads/assignments uploads/submissions \
    && addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node healthcheck.js

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
