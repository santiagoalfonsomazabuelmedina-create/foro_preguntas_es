# Imagen de la aplicación para producción. Se construye en dos etapas:
#   1. "build": instala todo y empaqueta el frontend con Vite.
#   2. final: solo lo necesario para correr (sin herramientas de desarrollo). Más liviana y segura.

# ── Etapa 1 ────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Etapa 2 ────────────────────────────────────────────────
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
COPY db ./db
COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./
# Carpeta para el log de operaciones (H5.2): el usuario "node" necesita poder escribir en ella.
RUN mkdir -p data && chown node:node data
# No correr como administrador (root) dentro del contenedor.
USER node
EXPOSE 3000
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
