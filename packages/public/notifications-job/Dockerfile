FROM node:16-alpine as dependencies
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY packages/public/notifications-job/package.json packages/public/notifications-job/package.json
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
RUN yarn --silent

FROM dependencies as build
COPY packages/public/notifications-job packages/public/notifications-job
COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/notifications-job build

FROM dependencies as release
COPY --from=build /usr/src/app/packages/public/notifications-job/dist packages/public/notifications-job/dist
WORKDIR packages/public/notifications-job
ENTRYPOINT ["yarn", "start"]
EXPOSE 3000
