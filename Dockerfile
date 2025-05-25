FROM node:22 AS build-env
ARG MIGRATE_VERSION=4.18.3

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i --force

COPY . .

RUN npm run build

RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v${MIGRATE_VERSION}/migrate.linux-amd64.tar.gz | tar xvz \
    && chmod +x migrate

FROM gcr.io/distroless/nodejs24-debian12 AS production

WORKDIR /app

COPY --from=build-env /app/.output/ ./.output/
COPY --from=build-env /app/migrate /usr/local/bin/migrate
COPY ./migrations ./migrations
COPY ./entrypoint.js ./entrypoint.js

EXPOSE 3000

CMD ["/app/entrypoint.js"]