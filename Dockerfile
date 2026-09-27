FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json lerna.json package-lock.json* ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json

RUN npm install

COPY client client
COPY server server

RUN npm run build --workspace=presight-client \
  && npm run build --workspace=presight-server

FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV CLIENT_ORIGIN=*
ENV DB_PATH=/data/users.sqlite
ENV NODE_OPTIONS=--experimental-sqlite

COPY --from=build /app /app

RUN mkdir -p /data

EXPOSE 8080

CMD ["node", "server/dist/index.js"]
