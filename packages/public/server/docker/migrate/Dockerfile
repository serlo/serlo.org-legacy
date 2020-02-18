FROM node:12-alpine as dependencies
WORKDIR /usr/src/app
COPY docker/migrate/package.json .
COPY docker/migrate/yarn.lock .
RUN yarn --frozen-lockfile --silent

FROM dependencies
COPY migrations migrations
COPY docker/migrate/database.json .
ENTRYPOINT ["yarn", "db-migrate"]
CMD ["up"]
