FROM serlo-org-node as development
COPY --from=serlo-org-workspace /usr/src/app/packages/public/frontend packages/public/frontend
COPY --from=serlo-org-workspace /usr/src/app/node_modules node_modules/
WORKDIR packages/public/frontend
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_ASSET_PREFIX http://localhost:3000
ENV ASSET_PREFIX http://localhost:3001
ENTRYPOINT ["node", "serverless.js"]
EXPOSE 3000

FROM development as release
RUN find .next -maxdepth 1 -type d ! -name serverless ! -name .next -exec rm -rf {} +
