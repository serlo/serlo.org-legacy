# Installs dependencies (including dev dependencies)
# Only copies `package.json` files of private and relevant public packages and root `package.json` / `yarn.lock` to improve Docker caching
FROM serlo-org-node as dependencies
COPY packages/private/cloudflare/package.json packages/private/cloudflare/package.json
COPY packages/private/docker/package.json packages/private/docker/package.json
COPY packages/private/editor-helpers/package.json packages/private/editor-helpers/package.json
COPY packages/private/edtr-io/package.json packages/private/edtr-io/package.json
COPY packages/private/gcloud/package.json packages/private/gcloud/package.json
COPY packages/private/legacy-editor-to-editor/package.json packages/private/legacy-editor-to-editor/package.json
COPY packages/private/markdown/package.json packages/private/markdown/package.json
COPY packages/private/mathjax/package.json packages/private/mathjax/package.json
COPY packages/private/node-image/package.json packages/private/node-image/package.json
COPY packages/private/workspace-image/package.json packages/private/workspace-image/package.json
COPY packages/public/editor-renderer/package.json packages/public/editor-renderer/package.json
COPY packages/public/legacy-editor-renderer/package.json packages/public/legacy-editor-renderer/package.json
COPY packages/public/notifications-job/package.json packages/public/notifications-job/package.json
COPY packages/public/redesign/package.json packages/public/redesign/package.json

COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

# Builds all packages. Needs source code of relevant packages
FROM dependencies as build
COPY packages/private packages/private
COPY packages/public/editor-renderer packages/public/editor-renderer
COPY packages/public/legacy-editor-renderer packages/public/legacy-editor-renderer
COPY packages/public/notifications-job packages/public/notifications-job
COPY packages/public/redesign packages/public/redesign
COPY babel.config.js .
COPY lerna.json .
COPY tsconfig.json .
RUN yarn build

# Prepare release. Deletes source code and dev dependencies
FROM build as release
RUN npx lerna exec --scope=@serlo/{editor-helpers,edtr-io,legacy-editor-to-editor,markdown,mathjax,serlo-org-editor-renderer,serlo-org-legacy-editor-renderer,serlo-org-notifications-job} "find . -maxdepth 1 -type d ! -name dist ! -name . -exec rm -rf {} +"
RUN npx lerna exec --scope=@serlo/{editor-helpers,edtr-io,legacy-editor-to-editor,markdown,mathjax,serlo-org-editor-renderer,serlo-org-legacy-editor-renderer,serlo-org-notifications-job} "find . -maxdepth 1 -type f ! -name package.json -exec rm -rf {} +"
RUN npx lerna exec --scope=@serlo/{workspace-image,node-image} "find . -maxdepth 1 -type f ! -name package.json -exec rm -rf {} +"
RUN npx lerna exec --scope=@serlo/serlo-org-redesign "find . -maxdepth 1 -type d ! -name .next ! -name pages ! -name . -exec rm -rf {} +"
RUN npx lerna exec --scope=@serlo/serlo-org-redesign "find . -maxdepth 1 -type f ! -name package.json ! -name serverless.js -exec rm -rf {} +"
RUN npx lerna clean --yes
RUN yarn --frozen-lockfile --production=true --silent
