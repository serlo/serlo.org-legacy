FROM node:10 as base

WORKDIR /usr/src/app
COPY packages/legacy-editor-renderer/package.json packages/legacy-editor-renderer/
COPY packages/markdown/package.json packages/markdown/
COPY package.json .
COPY yarn.lock .

FROM base as dependencies
RUN yarn --frozen-lockfile --prod
ENTRYPOINT find .

FROM dependencies as release
COPY packages/legacy-editor-renderer ./packages/legacy-editor-renderer
COPY packages/markdown ./packages/markdown
WORKDIR packages/legacy-editor-renderer
ENTRYPOINT node .
EXPOSE 3000
