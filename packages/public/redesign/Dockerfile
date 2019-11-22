FROM serlo-org-node
COPY package.json .
COPY yarn.lock .
WORKDIR packages/public/redesign
COPY packages/public/redesign/package.json .
RUN yarn --frozen-lockfile --production=false --silent

ARG ASSET_PREFIX
ENV ASSET_PREFIX "$ASSET_PREFIX"
COPY packages/public/redesign .
RUN yarn next:build
ENTRYPOINT ["node", "server.js"]
EXPOSE 3000
