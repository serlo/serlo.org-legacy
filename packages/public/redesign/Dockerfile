FROM serlo-org-node
COPY packages/public/redesign packages/public/redesign
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent
RUN cd packages/public/redesign && yarn next:build

WORKDIR packages/public/redesign
ENTRYPOINT ["node", "./server.js"]
EXPOSE 3000
