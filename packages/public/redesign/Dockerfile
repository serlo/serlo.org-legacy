FROM serlo-org-node
COPY package.json .
COPY yarn.lock .
WORKDIR packages/public/redesign
COPY packages/public/redesign/package.json .
RUN yarn --frozen-lockfile --production=false --silent

ENV NEXT_TELEMETRY_DISABLED=1
COPY packages/public/redesign .
RUN yarn next:build

ENV NEXT_ASSET_PREFIX http://localhost:3000
ENV ASSET_PREFIX http://localhost:3000

ENTRYPOINT ["node", "serverless.js"]
EXPOSE 3000
