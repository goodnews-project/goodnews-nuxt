FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# final stage
FROM node:22-alpine
COPY --from=build /app/.output /app/.output
EXPOSE 3000
CMD [ "node", "/app/.output/server/index.mjs" ]
