FROM node:10-alpine as dependencies
WORKDIR /usr/src/app
COPY packages/public/frontend/package.json packages/public/frontend/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM dependencies as build
COPY packages/public/frontend packages/public/frontend
COPY babel.config.js .
COPY lerna.json .
COPY tsconfig.json .
RUN yarn build

FROM build as release
RUN npx lerna exec "find . -maxdepth 1 -type d ! -name .next ! -name pages ! -name serverless ! -name . -exec rm -rf {} +"
RUN npx lerna exec "find . -maxdepth 1 -type f ! -name package.json -exec rm -rf {} +"
RUN yarn lerna clean --yes
RUN yarn --frozen-lockfile --production=true --silent

FROM node:10-alpine as development
ENV NODE_ENV production
ENV NEXT_ASSET_PREFIX http://localhost:3000
ENV ASSET_PREFIX http://localhost:3001
WORKDIR /usr/src/app
COPY --from=release /usr/src/app/packages/public/frontend packages/public/frontend
WORKDIR packages/public/frontend
ENTRYPOINT ["node", "serverless/serverless.development.js"]
EXPOSE 3000

FROM development as release
RUN find .next -maxdepth 1 -type d ! -name serverless ! -name .next -exec rm -rf {} +
ENTRYPOINT ["node", "serverless/serverless.production.js"]
EXPOSE 3000