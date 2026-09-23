FROM node:24.4.1-bookworm-slim@sha256:36ae19f59c91f3303c7a648f07493fe14c4bd91320ac8d898416327bacf1bbfa AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS build
# The existing secrets test checks Git ignore rules in a temporary repository.
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
COPY . .
RUN npm run typecheck && npm test && npm run build

FROM dependencies AS production-dependencies
RUN npm prune --omit=dev --no-audit --no-fund

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY --from=build --chown=node:node /app/.next ./.next
# These files are loaded dynamically from process.cwd() in back/composition.ts.
COPY raw/dataset.csv ./raw/dataset.csv
COPY back/ai/openai.mjs ./back/ai/openai.mjs
COPY back/config/secrets.mjs ./back/config/secrets.mjs
COPY scripts/docker/ ./scripts/docker/
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 CMD ["node", "scripts/docker/healthcheck.mjs"]
CMD ["node", "node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
