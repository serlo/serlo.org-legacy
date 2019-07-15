FROM serlo-org-node as base
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY docker/workspace/dev.sh .
RUN chmod +x dev.sh

FROM base as build
COPY __mocks__ __mocks__
COPY packages packages
COPY .prettierignore .
COPY babel.config.js .
COPY jest.config.js .
COPY lerna.json .
COPY package.json .
COPY prettier.config.js .
COPY tsconfig.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent
RUN yarn lint:js
RUN yarn build
RUN yarn test:js

FROM build as release
RUN rm dev.sh
RUN npx lerna exec "find . -maxdepth 1 -type d ! -name dist ! -name . -exec rm -rf {} +"
RUN npx lerna exec "find . -maxdepth 1 -type f ! -name package.json ! -regex \"\./.*\.tsx?\" -exec rm -rf {} +"
RUN npx lerna clean --yes
RUN yarn --frozen-lockfile --production=true --silent
