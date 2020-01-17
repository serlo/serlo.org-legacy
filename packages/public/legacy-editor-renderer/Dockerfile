FROM node:10-alpine as dev-dependencies
WORKDIR /usr/src/app
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/public/legacy-editor-renderer/package.json packages/public/legacy-editor-renderer/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM node:10-alpine as prod-dependencies
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/public/legacy-editor-renderer/package.json packages/public/legacy-editor-renderer/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=true --silent

FROM dev-dependencies as build
COPY packages/private/markdown packages/private/markdown
COPY packages/public/legacy-editor-renderer packages/public/legacy-editor-renderer
COPY lerna.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/legacy-editor-renderer build

FROM prod-dependencies as release
COPY --from=build /usr/src/app/packages/private/markdown/dist packages/private/markdown/dist
COPY --from=build /usr/src/app/packages/public/legacy-editor-renderer/dist packages/public/legacy-editor-renderer/dist
WORKDIR packages/public/legacy-editor-renderer
ENTRYPOINT ["yarn", "start"]
EXPOSE 3000
