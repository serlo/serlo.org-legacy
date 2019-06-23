FROM node:10 as base
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY packages/private/legacy-editor-to-editor/package.json packages/private/legacy-editor-to-editor/
COPY packages/private/markdown/package.json packages/private/markdown/
COPY packages/private/editor-helpers/package.json packages/private/editor-helpers/
COPY packages/public/editor-renderer/package.json packages/public/editor-renderer/
COPY package.json .
COPY yarn.lock .

FROM base as dependencies
RUN yarn --frozen-lockfile --prod

FROM dependencies as release
COPY packages/private/legacy-editor-to-editor packages/private/legacy-editor-to-editor
COPY packages/private/markdown packages/private/markdown
COPY packages/private/editor-helpers packages/private/editor-helpers
COPY packages/public/editor-renderer packages/public/editor-renderer
WORKDIR packages/public/editor-renderer
ENTRYPOINT node .
EXPOSE 3000
