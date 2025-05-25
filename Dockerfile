ARG MIGRATE_VERSION=4.18.3
FROM node:22 AS build-env

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --force

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12 AS production

COPY ./entrypoint.sh /entrypoint.sh

WORKDIR /app

COPY --from=build-env /app/.output/ ./.output/
COPY ./migrations ./migrations

EXPOSE 3000

RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v${MIGRATE_VERSION}/migrate.linux-amd64.tar.gz | tar xvz \
    && mv migrate /usr/local/bin/ \
    && chmod +x /usr/local/bin/migrate

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "/app/.output/server/index.mjs"]