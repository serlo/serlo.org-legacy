FROM node:16-alpine as dev-dependencies
WORKDIR /usr/src/app
COPY packages/public/notifications-job/package.json packages/public/notifications-job/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM node:16-alpine as prod-dependencies
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY packages/public/notifications-job/package.json packages/public/notifications-job/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=true --silent

FROM dev-dependencies as build
COPY packages/public/notifications-job packages/public/notifications-job
COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/notifications-job build

FROM prod-dependencies as release
COPY --from=build /usr/src/app/packages/public/notifications-job/dist packages/public/notifications-job/dist
WORKDIR packages/public/notifications-job
ENTRYPOINT ["yarn", "start"]
EXPOSE 3000
