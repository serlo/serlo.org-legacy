FROM node:10-alpine as dev-dependencies
WORKDIR /usr/src/app
COPY packages/public/frontend/package.json packages/public/frontend/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM node:10-alpine as prod-dependencies
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY packages/public/frontend/package.json packages/public/frontend/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=true --silent

FROM dev-dependencies as build
COPY packages/public/frontend packages/public/frontend
COPY lerna.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/frontend build

FROM prod-dependencies as development
COPY --from=build /usr/src/app/packages/public/frontend/.next packages/public/frontend/.next
COPY --from=build /usr/src/app/packages/public/frontend/pages packages/public/frontend/pages
COPY --from=build /usr/src/app/packages/public/frontend/serverless packages/public/frontend/serverless
WORKDIR packages/public/frontend
ENTRYPOINT ["node", "serverless/serverless.development.js"]
EXPOSE 3000

FROM development as release
RUN find .next -maxdepth 1 -type d ! -name serverless ! -name .next -exec rm -rf {} +
ENTRYPOINT ["node", "serverless/serverless.production.js"]
EXPOSE 3000
