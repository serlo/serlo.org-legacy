FROM node:10-alpine as dependencies
WORKDIR /usr/src/app
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/public/legacy-editor-renderer/package.json packages/public/legacy-editor-renderer/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM dependencies as build
COPY packages/private/markdown packages/private/markdown
COPY packages/public/legacy-editor-renderer packages/public/legacy-editor-renderer
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
COPY --from=release /usr/src/app/packages/private/markdown packages/private/markdown
COPY --from=release /usr/src/app/packages/public/legacy-editor-renderer packages/public/editor-renderer
COPY --from=release /usr/src/app/node_modules node_modules
WORKDIR packages/public/editor-renderer
ENTRYPOINT ["node", "."]
EXPOSE 3000
