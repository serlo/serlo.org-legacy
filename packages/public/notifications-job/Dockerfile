FROM node:10-alpine as dependencies
WORKDIR /usr/src/app
COPY packages/public/notifications-job/package.json packages/public/notifications-job/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM dependencies as build
COPY packages/public/notifications-job packages/public/notifications-job
COPY babel.config.js .
COPY lerna.json .
COPY tsconfig.json .
RUN yarn build

FROM build as release
RUN yarn lerna exec "find . -maxdepth 1 -type d ! -name dist ! -name . -exec rm -rf {} +"
RUN yarn lerna exec "find . -maxdepth 1 -type f ! -name package.json -exec rm -rf {} +"
RUN yarn lerna clean --yes
RUN yarn --frozen-lockfile --production=true --silent

FROM node:10-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=release /usr/src/app/packages/public/notifications-job packages/public/notifications-job
COPY --from=release /usr/src/app/node_modules node_modules
WORKDIR packages/public/notifications-job
ENTRYPOINT ["node", "."]
EXPOSE 3000
