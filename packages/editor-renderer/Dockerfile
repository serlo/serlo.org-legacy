FROM node:10 as base
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY packages/legacy-editor-to-editor/package.json packages/legacy-editor-to-editor/
COPY packages/markdown/package.json packages/markdown/
COPY packages/editor-helpers/package.json packages/editor-helpers/
COPY packages/editor-renderer/package.json packages/editor-renderer/
COPY package.json .
COPY yarn.lock .

FROM base as dependencies
RUN yarn --frozen-lockfile --prod

FROM dependencies as release
COPY packages/legacy-editor-to-editor packages/legacy-editor-to-editor
COPY packages/markdown packages/markdown
COPY packages/editor-helpers packages/editor-helpers
COPY packages/editor-renderer packages/editor-renderer
WORKDIR packages/editor-renderer
ENTRYPOINT node .
EXPOSE 3000
