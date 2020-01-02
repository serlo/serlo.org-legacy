FROM node:10-alpine as dependencies
WORKDIR /usr/src/app
COPY packages/private/editor-helpers/package.json packages/private/editor-helpers/package.json
COPY packages/private/edtr-io/package.json packages/private/edtr-io/package.json
COPY packages/private/legacy-editor-to-editor/package.json packages/private/legacy-editor-to-editor/package.json
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/private/mathjax/package.json packages/private/mathjax/package.json
COPY packages/public/editor-renderer/package.json packages/public/editor-renderer/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM dependencies as build
COPY packages/private/editor-helpers packages/private/editor-helpers
COPY packages/private/edtr-io packages/private/edtr-io
COPY packages/private/legacy-editor-to-editor packages/private/legacy-editor-to-editor
COPY packages/private/markdown packages/private/markdown
COPY packages/private/mathjax packages/private/mathjax
COPY packages/public/editor-renderer packages/public/editor-renderer
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
COPY --from=release /usr/src/app/packages/private/editor-helpers packages/private/editor-helpers
COPY --from=release /usr/src/app/packages/private/edtr-io packages/private/edtr-io
COPY --from=release /usr/src/app/packages/private/legacy-editor-to-editor packages/private/legacy-editor-to-editor
COPY --from=release /usr/src/app/packages/private/markdown packages/private/markdown
COPY --from=release /usr/src/app/packages/private/mathjax packages/private/mathjax
COPY --from=release /usr/src/app/packages/public/editor-renderer packages/public/editor-renderer
COPY --from=release /usr/src/app/node_modules node_modules
WORKDIR packages/public/editor-renderer
ENTRYPOINT ["node", "."]
EXPOSE 3000
