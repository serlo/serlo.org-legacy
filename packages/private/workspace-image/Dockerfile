FROM serlo-org-node as base
COPY packages/private packages/private
COPY packages/public/editor-renderer packages/public/editor-renderer
COPY packages/public/legacy-editor-renderer packages/public/legacy-editor-renderer
COPY babel.config.js .
COPY lerna.json .
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent
RUN yarn build

FROM base as release
RUN npx lerna exec "find . -maxdepth 1 -type d ! -name dist ! -name . -exec rm -rf {} +"
RUN npx lerna exec "find . -maxdepth 1 -type f ! -name package.json ! -regex \"\./.*\.tsx?\" -exec rm -rf {} +"
RUN npx lerna clean --yes
RUN yarn --frozen-lockfile --production=true --silent
