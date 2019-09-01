FROM serlo-org-node
COPY --from=serlo-org-workspace /usr/src/app/packages/public/notifications-job packages/public/notifications-job
COPY --from=serlo-org-workspace /usr/src/app/node_modules node_modules
WORKDIR packages/public/notifications-job
ENTRYPOINT ["node", "."]
EXPOSE 3000
