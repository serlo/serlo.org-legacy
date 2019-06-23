FROM node:10 as base
ENV NODE_ENV production
WORKDIR /usr/src/app

FROM base as dependencies
COPY packages/public/legacy-editor-renderer/package.json packages/public/legacy-editor-renderer/
COPY packages/private/markdown/package.json packages/private/markdown/
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --prod

FROM dependencies as release
COPY packages/public/legacy-editor-renderer packages/public/legacy-editor-renderer
COPY packages/private/markdown packages/private/markdown
WORKDIR packages/public/legacy-editor-renderer
ENTRYPOINT node .
EXPOSE 3000
