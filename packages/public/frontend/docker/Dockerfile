FROM serlo-org-node as development
COPY --from=serlo-org-workspace /usr/src/app/packages/public/frontend packages/public/frontend
WORKDIR packages/public/frontend
ENV NEXT_ASSET_PREFIX http://localhost:3000
ENV ASSET_PREFIX http://localhost:3001

ENTRYPOINT ["node", "serverless/serverless.development.js"]
EXPOSE 3000

FROM development as release
RUN find .next -maxdepth 1 -type d ! -name serverless ! -name .next -exec rm -rf {} +

ENTRYPOINT ["node", "serverless/serverless.production.js"]
EXPOSE 3000
