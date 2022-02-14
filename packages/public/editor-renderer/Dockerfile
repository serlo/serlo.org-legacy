FROM node:16-alpine as dependencies
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY packages/private/editor-helpers/package.json packages/private/editor-helpers/package.json
COPY packages/private/edtr-io/package.json packages/private/edtr-io/package.json
COPY packages/private/i18n/package.json packages/private/i18n/package.json
COPY packages/private/legacy-editor-to-editor/package.json packages/private/legacy-editor-to-editor/package.json
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/private/mathjax/package.json packages/private/mathjax/package.json
COPY packages/public/editor-renderer/package.json packages/public/editor-renderer/package.json
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
RUN yarn --silent

FROM dependencies as build
COPY packages/private/editor-helpers packages/private/editor-helpers
COPY packages/private/edtr-io packages/private/edtr-io
COPY packages/private/i18n packages/private/i18n
COPY packages/private/legacy-editor-to-editor packages/private/legacy-editor-to-editor
COPY packages/private/markdown packages/private/markdown
COPY packages/private/mathjax packages/private/mathjax
COPY packages/public/editor-renderer packages/public/editor-renderer
COPY scripts/build.ts scripts/build.ts
COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/editor-renderer build

FROM dependencies as release
COPY --from=build /usr/src/app/packages/private/editor-helpers/dist packages/private/editor-helpers/dist
COPY --from=build /usr/src/app/packages/private/edtr-io/dist packages/private/edtr-io/dist
COPY --from=build /usr/src/app/packages/private/i18n/dist packages/private/i18n/dist
COPY --from=build /usr/src/app/packages/private/i18n/resources packages/private/i18n/resources
COPY --from=build /usr/src/app/packages/private/legacy-editor-to-editor/dist packages/private/legacy-editor-to-editor/dist
COPY --from=build /usr/src/app/packages/private/markdown/dist packages/private/markdown/dist
COPY --from=build /usr/src/app/packages/private/mathjax/dist packages/private/mathjax/dist
COPY --from=build /usr/src/app/packages/public/editor-renderer/dist packages/public/editor-renderer/dist
WORKDIR packages/public/editor-renderer
ENTRYPOINT ["yarn", "start"]
EXPOSE 3000
