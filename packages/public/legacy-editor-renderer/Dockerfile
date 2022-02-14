FROM node:16-alpine as dependencies
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/public/legacy-editor-renderer/package.json packages/public/legacy-editor-renderer/package.json
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
RUN yarn --silent

FROM dependencies as build
COPY packages/private/markdown packages/private/markdown
COPY packages/public/legacy-editor-renderer packages/public/legacy-editor-renderer
COPY scripts/build.ts scripts/build.ts
COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/legacy-editor-renderer build

FROM dependencies as release
COPY --from=build /usr/src/app/packages/private/markdown/dist packages/private/markdown/dist
COPY --from=build /usr/src/app/packages/public/legacy-editor-renderer/dist packages/public/legacy-editor-renderer/dist
WORKDIR packages/public/legacy-editor-renderer
ENTRYPOINT ["yarn", "start"]
EXPOSE 3000
